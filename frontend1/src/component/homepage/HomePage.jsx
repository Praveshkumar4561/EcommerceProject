import React, { useContext, useEffect, useRef, useState } from "react";
import "./HomePage.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faPhoneVolume,
  faArrowRightLong,
  faBars,
  faMagnifyingGlass,
  faArrowLeft,
  faArrowRight,
  faCartShopping,
  faHeart,
  faStar,
  faAngleLeft,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import Hamburger from "../../assets/hamburger.svg";
import Close from "../../assets/Close.webp";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import Panic from "../../assets/Panic Attacks.webp";
import { Link, useNavigate } from "react-router-dom";
import Generic from "../../assets/Lytes.svg";
import PainRelief from "../../assets/Latest.svg";
import Tonic from "../../assets/Tonic.svg";
import Support from "../../assets/Support.svg";
import Payments from "../../assets/Payments.svg";
import Returns from "../../assets/Returns.svg";
import Shipping from "../../assets/Shipping.svg";
import UserContext from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JsonLd from "../JsonLd";
import { Helmet } from "react-helmet";

function HomePage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [rotatedIndexes, setRotatedIndexes] = useState([]);

  const faqsAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
    setRotatedIndexes((prev) => {
      const newIndexes = [...prev];
      if (newIndexes.includes(index)) {
        newIndexes.splice(newIndexes.indexOf(index), 1);
      } else {
        newIndexes.push(index);
      }
      return newIndexes;
    });
  };

  let [faqs, setFaqs] = useState([]);

  useEffect(() => {
    faqdata();
  }, []);

  const faqdata = async () => {
    try {
      const response = await axios.get(
        "http://89.116.170.231:1600/pagesdatafaqs"
      );
      setFaqs(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  let [blog, setBlog] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 3;

  useEffect(() => {
    const showdata = async () => {
      try {
        let answer = await axios.get("http://89.116.170.231:1600/blogpostdata");
        setBlog(answer.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    showdata();
  }, []);

  const indexOfLastPost = currentPage * blogsPerPage;
  const indexOfFirstPost = indexOfLastPost - blogsPerPage;
  const currentBlogs = blog.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < Math.ceil(blog.length / blogsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const [user, setUser] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const alldata = async () => {
      let response = await axios.get("http://89.116.170.231:1600/getannounce");
      setUser(response.data);
    };
    alldata();
  }, []);

  const leftData = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : user.length - 1
    );
  };

  const rightData = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < user.length - 1 ? prevIndex + 1 : 0
    );
  };

  let [detail, setDetail] = useState([]);
  const [auth, setAuth] = useState(true);
  let navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const isAuthenticated = localStorage.getItem("auth");
      if (!storedUser || isAuthenticated !== "true") {
        navigate("/");
      } else if (storedUser && storedUser.tokenExpiration) {
        if (Date.now() > storedUser.tokenExpiration) {
          console.log("Token expired. Logging out...");
          localStorage.removeItem("user");
          localStorage.removeItem("auth");
          toast.error("Session expired. Please log in again.");
          navigate("/");
        } else {
          setDetail(storedUser);
          setAuth(true);
        }
      } else {
        console.log("No tokenExpiration found in localStorage.");
      }
    };
    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 1000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  let { count, setCount } = useContext(UserContext);

  useEffect(() => {
    cartdata();
  }, []);

  const cartdata = async () => {
    try {
      const response = await axios.get(
        "http://89.116.170.231:1600/allcartdata"
      );
      setCount(response.data.length);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  let [count6, setCount6] = useState("");

  useEffect(() => {
    wishlistdata();
  }, []);

  const wishlistdata = async () => {
    try {
      const response = await axios.get(
        "http://89.116.170.231:1600/wishlistdata"
      );
      setCount6(response.data.length);
    } catch (error) {
      console.error("Error fetching wishlist data:", error);
    }
  };

  const [product, setProduct] = useState([]);

  let homedata = async () => {
    try {
      let response = await axios.get(
        "http://89.116.170.231:1600/productpagedata"
      );
      setProduct(response.data);
    } catch (error) {
      console.error("Error occurred", error);
    }
  };
  homedata();

  let [label, setLabel] = useState([]);

  useEffect(() => {
    let labeldata = async () => {
      let response = await axios.get(
        "http://89.116.170.231:1600/productlabelsdata"
      );
      setLabel(response.data);
    };
    labeldata();
  });

  const addCartItem = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("store", data.store);
    formData.append("price", data.price);
    formData.append("price_sale", data.price_sale);
    if (data.image) {
      formData.append("image", data.image);
    } else {
      console.log("No image file available for this product.");
    }
    try {
      const response = await axios.post(
        "http://89.116.170.231:1600/addcart",
        formData
      );
      setCount((prevCount) => prevCount + 1);
      toast.success("Product successfully added on the cart", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeButton: true,
        draggable: true,
      });
    } catch (error) {
      toast.error("Product is not added on the cart", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeButton: true,
        draggable: true,
      });
    }
  };

  let addWishlistItem = async (data) => {
    const formData = new FormData();
    formData.append("product_name", data.name);
    formData.append("store", data.store);
    formData.append("price", data.price);
    formData.append("price_sale", data.price_sale);
    formData.append("sku", data.sku);
    const imageFileName = data.image ? data.image.split("/").pop() : null;
    if (imageFileName) {
      formData.append("image", imageFileName);
    } else {
      console.log("No image file available for this product.");
    }
    try {
      const response = await axios.post(
        "http://89.116.170.231:1600/wishlistpost",
        formData
      );
      setCount6((prevCount) => prevCount + 1);
      toast.success("Product successfully added on the wishlist", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeButton: true,
        draggable: true,
      });
    } catch (error) {}
  };

  const defaultUrlState = {
    login: "login",
    register: "register",
    changePassword: "user/change-password",
    cart: "cart",
    checkout: "checkout",
    ordersTracking: "orders/tracking",
    wishlist: "wishlist",
    productDetails: "product-details",
    userDashboard: "user/dashboard",
    userAddress: "user/address",
    userDownloads: "user/downloads",
    userOrderReturns: "user/order-returns",
    userProductReviews: "user/product-reviews",
    userEditAccount: "user/edit-account",
    userOrders: "user/orders",
  };

  const [url, setUrl] = useState(
    JSON.parse(localStorage.getItem("urlState")) || defaultUrlState
  );

  useEffect(() => {
    const storedUrlState = JSON.parse(localStorage.getItem("urlState"));
    if (storedUrlState) {
      setUrl(storedUrlState);
    }
  }, []);

  const [logoUrl, setLogoUrl] = useState(null);
  const [logoHeight, setLogoHeight] = useState("45");

  useEffect(() => {
    axios
      .get("http://89.116.170.231:1600/get-theme-logo")
      .then((response) => {
        if (response.data) {
          setLogoUrl(
            `http://89.116.170.231:1600/src/image/${response.data.logo_url}`
          );
          setLogoHeight(response.data.logo_height || "45");
        }
      })
      .catch((error) => console.error("Error fetching logo:", error));
  }, []);

  const [review, setReview] = useState([]);
  const reviewsPerPage = 2;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/allreviewdata"
        );
        setReview(response.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
    fetchReviews();
  }, []);

  const paginatedReviews = review.slice(
    currentIndex,
    currentIndex + reviewsPerPage
  );

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + reviewsPerPage >= review.length
        ? 0
        : prevIndex + reviewsPerPage
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0
        ? review.length - (review.length % reviewsPerPage || reviewsPerPage)
        : prevIndex - reviewsPerPage
    );
  };

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const toggleButtonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const schemaData = {
    "@context": "http://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: "RxLYTE",
        url: "http://srv724100.hstgr.cloud/",
        logo: "http://srv724100.hstgr.cloud/Tonic.svg",
        description:
          "RxLyte is a leading eCommerce platform offering a premium selection of healthcare and wellness products, ensuring high-quality and affordable solutions for customers.",
        contactPoint: {
          "@type": "ContactPoint",
          telephone: "+1-800-654-3210",
          contactType: "customer service",
          areaServed: "US",
          availableLanguage: "English",
        },
      },
      {
        "@type": "WebSite",
        name: "RxLYTE",
        url: "http://srv724100.hstgr.cloud/",
        description:
          "Shop the latest healthcare products at RxLyte, your trusted online pharmacy for premium wellness essentials.",
        keywords:
          "RxLYTE, Ecommerce, healthcare, online pharmacy, wellness products",
      },
      {
        "@type": "LocalBusiness",
        name: "RxLYTE Healthcare Store",
        url: "http://srv724100.hstgr.cloud/",
        image: "http://srv724100.hstgr.cloud/Tonic.svg",
        description:
          "RxLyte's physical store provides top-tier healthcare and wellness products, ensuring convenient access for all customers.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "123 Healthcare Street",
          addressLocality: "New York",
          addressRegion: "NY",
          postalCode: "10001",
          addressCountry: "US",
        },
        telephone: "+1-800-654-3210",
        areaServed: "US",
      },

      {
        "@type": "FAQPage",
        name: "FAQs",
        mainEntity: Array.isArray(faqs)
          ? faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            }))
          : [],
      },

      ...(Array.isArray(product) ? product : []).map((item) => ({
        "@type": "Product",
        name: item.name,
        image: item.image,
        description: item.description,
        brand: {
          "@type": "Brand",
          name: item.brand,
        },
        sku: item.sku,
        offers: {
          "@type": "Offer",
          url: item.url || window.location.href,
          priceCurrency: "USD",
          price: item.price_sale ? item.price_sale : item.price,
          priceValidUntil: item.saleEndDate || undefined,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: item.ratingValue || 4.9,
          bestRating: item.bestRating || 5,
          ratingCount: item.ratingCount || 5842,
        },
      })),

      ...(Array.isArray(blog) ? blog : []).map((blogItem) => ({
        "@type": "Blog",
        name: blogItem.name,
        image: blogItem.image,
        description: blogItem.description,
        url: blogItem.url,
        datePublished: blogItem.datePublished,
        author: {
          "@type": "Person",
          name: blogItem.author_name,
        },
      })),
    ],
  };

  return (
    <>
      <JsonLd data={schemaData} />

      <Helmet>
        <title>
          RxLYTE - Buy Healthcare & Wellness Products Online | Best Prices
        </title>

        <meta
          name="description"
          content="Shop premium healthcare and wellness products online at RxLYTE. Discover high-quality medical essentials, vitamins, supplements, and personal care items at unbeatable prices. Enjoy fast delivery and secure checkout."
        />
        <meta
          name="keywords"
          content="RxLYTE, healthcare products, online pharmacy, wellness products, medical essentials, buy medicine online, vitamins, supplements, personal care, health & wellness, affordable healthcare, quality healthcare, RxLYTE store"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="RxLYTE Team" />
        <meta name="language" content="English" />

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="RxLYTE - Buy Healthcare & Wellness Products Online | Best Prices"
        />
        <meta
          property="og:description"
          content="Shop premium healthcare and wellness products online at RxLYTE. High-quality medical essentials, vitamins, supplements, and personal care products available at unbeatable prices. Fast delivery & secure checkout."
        />
        <meta property="og:url" content="http://srv724100.hstgr.cloud/" />
        <meta
          property="og:image"
          content="http://srv724100.hstgr.cloud/assets/Tonic.svg"
        />
        <meta property="og:site_name" content="RxLYTE" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="RxLYTE - Buy Healthcare & Wellness Products Online | Best Prices"
        />
        <meta
          name="twitter:description"
          content="Shop premium healthcare and wellness products online at RxLYTE. Get high-quality medical essentials, vitamins, and personal care products at unbeatable prices."
        />
        <meta
          name="twitter:image"
          content="http://srv724100.hstgr.cloud/assets/Tonic.svg"
        />

        <link rel="canonical" href="http://srv724100.hstgr.cloud/" />
      </Helmet>

      <div
        className="container d-lg-none d-block"
        id="container-customx1"
        style={{
          backgroundColor:
            user?.background_color ||
            (user?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: user?.background_image
            ? `url(http://89.116.170.231:1600/src/image/${user.background_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: user?.breadcrumb_height
            ? `${user.breadcrumb_height}px`
            : "190px",
        }}
      >
        {user.length > 0 && (
          <div className="d-block d-lg-block text-start pt-2 pb-2">
            <p className="mb-0 mt-0 mt-lg-0 me-md-3 free-shipping cart-cart d-flex flex-row ms-0 ms-lg-0">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="me-2 text-success fs-6 d-block d-lg-block mt-1"
                style={{ cursor: "pointer", position: "relative", zIndex: "1" }}
                onClick={leftData}
              />
              <FontAwesomeIcon
                icon={faArrowRight}
                className="me-2 text-success fs-6 d-block d-lg-block mt-1"
                style={{ cursor: "pointer", position: "relative", zIndex: "1" }}
                onClick={rightData}
              />
              <div className="ms-0">
                {user[currentIndex]?.content
                  ? user[currentIndex].content.split(" ").slice(0, 6).join(" ")
                  : "No content available"}
              </div>
            </p>
          </div>
        )}

        <div className="container-custom ms-2 pt-lg-4 mt-lg-0 mt-5 pt-5 mb-auto mt-auto">
          <header className="d-flex flex-wrap justify-content-between py-2 mb-5 border-bottom bg-body rounded-2 container-custom1">
            <nav className="navbar navbar-expand-lg navbar-light w-100 d-flex flex-row flex-nowrap">
              <div className="container">
                <Link className="navbar-brand d-non d-lg-block" to="/">
                  <img
                    src={logoUrl || Tonic}
                    alt="Tonic Logo"
                    className="img-fluid image-galaxy"
                    style={{ height: `${logoHeight}px`, width: "200px" }}
                  />
                </Link>

                <button
                  type="button"
                  className="navbar-toggler py-0 px-1 d-lg-none dropdown-burger"
                  onClick={toggleDropdown}
                  ref={toggleButtonRef}
                  aria-label="Toggle navigation"
                >
                  <span className="navbar-toggler-icons">
                    <img
                      key={isDropdownOpen ? "Close" : "hamburger"}
                      src={isDropdownOpen ? Close : Hamburger}
                      alt={isDropdownOpen ? "Close" : "Menu"}
                      className="img-fluid hamburger-images"
                    />
                  </span>
                </button>

                <div className="navbar-collapse d-none d-lg-block">
                  <ul className="navbar-nav ms-auto cart-cart">
                    <li className="nav-item">
                      <Link className="nav-link" to="/">
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/shop">
                        Shop
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link className="nav-link" to="/blog">
                        Blog
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/privacy-policy">
                        Privacy Policy
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/contact-us">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="navbar-icons1 d-sm-flex mt-1 mt-md-0 gap-0 navbar-mobile">
                  <Link
                    to={`/${url.wishlist}`}
                    className="position-relative text-decoration-none me-3 mt-0 wishlist-home"
                  >
                    <span className="count-badge mt-2">{count6}</span>
                    <img
                      src={Wishlists}
                      alt="RxLYTE"
                      className="cart-image profiles1 mt-2 mt-lg-1"
                    />
                  </Link>

                  <Link
                    to={`/${url.login}`}
                    className="nav-link"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={Accounts}
                      alt="Profile"
                      className="profiles1 img-fluid me-3 mt-1"
                    />
                  </Link>

                  <Link
                    to={`/${url.cart}`}
                    className="nav-link d-flex nav-properties1"
                  >
                    <img
                      src={Carthome}
                      alt="Cart"
                      className="img-fluid profiles1 mt-1 pt-1 pt-md-0"
                    />
                    <div className="addcarts ms-1 ps-1 pt-lg-1 count-badge1">
                      {count}
                    </div>
                  </Link>
                </div>
              </div>
            </nav>

            {isDropdownOpen && (
              <div
                className="custom-dropdown cart-cart rounded-0"
                ref={dropdownRef}
              >
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link" to="/">
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/shop">
                      Shop
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/blog">
                      Blog
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/privacy-policy">
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/contact-us">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </header>
        </div>
      </div>
      <div></div>

      <div className="container-fluid">
        <div className="row align-items-start justify-content-between text-center mt-lg-0 mt-0 pt-0 pt-lg-0 bg-light ms-0 me-0">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-md-start align-items-start ps-lg-2 ps-0 mt-2 mt-lg-3 lorem-home d-lg-block d-none">
            {user.length > 0 && (
              <div className="d-block d-lg-block text-start pt-0">
                <p className="mb-0 mt-0 mt-lg-0 me-md-3 free-shipping d-flex flex-row ms-2 ms-lg-0">
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="me-2 text-success fs-6 d-block d-lg-block mt-1"
                    style={{ cursor: "pointer" }}
                    onClick={leftData}
                  />
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="me-2 text-success fs-6 d-block d-lg-block mt-1"
                    style={{ cursor: "pointer" }}
                    onClick={rightData}
                  />

                  <div className="ms-0">
                    {user[currentIndex]?.content
                      ? user[currentIndex].content
                          .split(" ")
                          .slice(0, 7)
                          .join(" ")
                      : "No content available"}
                  </div>
                </p>
              </div>
            )}
          </div>

          <div className="col-12 col-md-6 d-flex justify-content-md-end mt-2 mt-md-0 lorem-home d-md-none d-lg-block d-none">
            {detail && detail.first_name ? (
              <div className="d-flex align-items-center float-end gap-0 d-none d-lg-block mt-1">
                <div className="free-shipping d-flex flex-row me-3 mt-21">
                  <span className="d-flex align-items-center gap-2">
                    <div className="d-sm-flex pt-1">
                      <Link to={`/${url.userDashboard}`} className="nav-link">
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            color: "white",
                            fontSize: "18px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          className="profile-lyte1 img-fluid me-0 ms-1 border rounded-5 py-1 bg-success"
                        >
                          {detail.first_name.charAt(0).toUpperCase()}
                        </div>
                      </Link>

                      <div className="d-flex flex-column me-0">
                        <span className="me-4 pe-2">
                          Hello {detail.first_name}
                        </span>
                        <span className="ms-4">
                          {detail.email || "No Email"}
                        </span>
                      </div>

                      <div className="d-flex flex-row gap-2">
                        <div className="d-flex flex-row gap-2">
                          <Link
                            to={`/${url.wishlist}`}
                            className="position-relative text-decoration-none me-3 mt-0 wishlist-home"
                          >
                            <span className="count-badge mt-2">{count6}</span>
                            <img
                              src={Wishlists}
                              alt="RxLYTE"
                              className="cart-image1 profiles1 mt-2"
                            />
                          </Link>

                          <Link
                            to={`/${url.login}`}
                            className="nav-link"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <img
                              src={Accounts}
                              alt="Profile"
                              className="cart-image2 img-fluid me-3 mt-1"
                            />
                          </Link>

                          <Link
                            to={`/${url.cart}`}
                            className="nav-link d-flex nav-properties1"
                          >
                            <img
                              src={Carthome}
                              alt="Cart"
                              className="img-fluid cart-image mt-1 pt-1 mt-lg-2 pt-md-0"
                            />
                            <div className="addcarts ms-1 ps-1 count-badge1 count-cart">
                              {count}
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-row justify-content-lg-end align-items-end float-end gap-4 mt-1">
                <Link to={`/${url.wishlist}`}>
                  <span
                    className="position-absolute ms-1 ps-1 mt-0 count-badge1"
                    style={{ fontFamily: "verdana" }}
                  >
                    {count6}
                  </span>
                  <img
                    src={Wishlists}
                    alt="RxLYTE"
                    className="mt-3 cart-image1"
                  />
                </Link>

                <Link to={`/${url.login}`}>
                  <img
                    src={Accounts}
                    alt="RxLYTE"
                    className="cart-image2 mt-2"
                  />
                </Link>

                <Link to={`/${url.cart}`}>
                  <span
                    className="position-absolute ms-2 mt-0 count-badge1"
                    style={{ fontFamily: "verdana" }}
                  >
                    {count}
                  </span>
                  <img
                    src={Carthome}
                    alt="RxLYTE"
                    className="mt-3 cart-image"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="container bg-light d-lg-block d-none">
          <div className="row d-flex justify-content-start text-center align-items-start mt-0 mb-lg-0 mb-2">
            <div className="col-12 col-md-8 d-flex align-items-center mb-2 mt-0 flex-row">
              <Link className="navbar-brand d-non d-lg-block" to="/">
                <img
                  src={logoUrl || Tonic}
                  alt="Tonic Logo"
                  className="img-fluid me-3 me-md-0 mt-0"
                  style={{ height: `${logoHeight}px`, width: "200px" }}
                />
              </Link>

              <div className="input-welcome1-home position-relative start-501 d-flex flex-row align-items-center mt-1">
                <input
                  type="search"
                  className="form-control p-2 border-1 mt-sm-3 border py-4 input-home rounded-0 d-lg-block d-none border-end-0 me- pe-2"
                  placeholder="Search For Product"
                  name="search"
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="d-lg-block d-none w-75">
                  <select
                    className="form-select rounded-0 border-0 mt-3 border-start-0"
                    style={{ height: "49px" }}
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="New Arrivals">New Arrivals</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Featured">Featured</option>
                    <option value="Best Sellers">Best Sellers</option>
                    <option value="Mobile Phone">Mobile Phone</option>
                    <option value="Computers & Laptops">
                      Computers & Laptops
                    </option>
                    <option value="Top Brands">Top Brands</option>
                    <option value="Weekly Best Selling">
                      Weekly Best Selling
                    </option>
                    <option value="CPU Heat Pipes">CPU Heat Pipes</option>
                    <option value="CPU Coolers">CPU Coolers</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Headphones">Headphones</option>
                    <option value="Wireless Headphones">
                      Wireless Headphones
                    </option>
                    <option value="TWS Headphones">TWS Headphones</option>
                    <option value="Smart Watch">Smart Watch</option>
                    <option value="Gaming Console">Gaming Console</option>
                    <option value="Playstation">Playstation</option>
                    <option value="Gifts">Gifts</option>
                    <option value="Computers">Computers</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Accessories">Accessories</option>
                    <option value="SmartPhones & Tablets">
                      SmartPhones & Tablets
                    </option>
                    <option value="TV Video & Music">TV Video & Music</option>
                    <option value="Cameras">Cameras</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Accessories">Accessories</option>
                    <option value="With Bluetooth">With Bluetooth</option>
                    <option value="Sports">Sports</option>
                    <option value="Electronics Gadgets">
                      Electronics Gadgets
                    </option>
                    <option value="Microscope">Microscope</option>
                    <option value="Remote Control">Remote Control</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Thermometer">Thermometer</option>
                    <option value="Backpack">Backpack</option>
                    <option value="Headphones">Headphones</option>
                  </select>
                </div>

                <div className="d-flex d-lg-block d-none">
                  <button className="ms-0 btn btn-success d-flex mt-3 py-4 px-3 rounded-0 justify-content-center align-items-center">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container lorem-home d-none d-lg-block bg-light pb-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="d-flex flex-column flex-md-row align-items-center mb-3 mb-md-0 ">
              <div className="dropdown d-inline-block">
                <button
                  className="btn btn-success d-flex align-items-center me-3 py-4 rounded-0 cart-cart"
                  id="categoryDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FontAwesomeIcon icon={faBars} className="me-2" />
                  BROWSE CATEGORIES
                  <FontAwesomeIcon icon={faAngleDown} className="ms-2" />
                </button>

                <ul
                  className="dropdown-menu rounded-0 lh-lg"
                  aria-labelledby="categoryDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="#">
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Electronics
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Gifts
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="#"
                      aria-labelledby="categoryDropdown"
                    >
                      Computers
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      SmartPhones & Tablets
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Tv,Vido & Music
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Cameras
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Cooking
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Accessories
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Sports
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Electronics Gadgets
                    </Link>
                  </li>
                </ul>
              </div>

              <nav>
                <ul className="nav-list d-flex flex-wrap mb-0 gap-3 gap-md-4 ">
                  <li className="nav-item">
                    <div className="nav-link-wrapper">
                      <Link to="/" className="nav-link fw-medium text-success">
                        Home
                      </Link>
                    </div>
                  </li>

                  <li className="nav-item">
                    <Link to="/shop" className="nav-link fw-medium">
                      Shop
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/blog" className="nav-link fw-medium">
                      Blog
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to="/privacy-policy" className="nav-link fw-medium">
                      Privacy Policy
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to="/contact-us" className="nav-link fw-medium">
                      Contact
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="d-none d-md-flex align-items-center mt-3 mt-md-0 d-lg-none d-xl-block d-xxl-block d-lg-block d-none">
              <span className="d-flex">
                <FontAwesomeIcon
                  icon={faPhoneVolume}
                  className="text-success me-3 mt-1 fw-medium"
                />
                <span
                  className="fw-medium d-lg-none d-xl-block d-xxl-block"
                  style={{ fontFamily: "verdana" }}
                >
                  1800-654-3210
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="container cart-cart">
          <div className="row g-3 d-flex flex-row flex-lg-nowrap">
            <div className="col-12 col-lg-8 m-0">
              <div className="box-panic shadow-sm p-4 position-relative">
                <div className="d-flex flex-column mt-4">
                  <h3 className="text-start">Get rid of your Panic Attacks</h3>
                  <p className="text-danger mb-3 text-start">
                    Starting at $5.99
                  </p>
                  <Link
                    to="/shop"
                    className="text-decoration-none text-light cart-cart1 shop-right"
                  >
                    <button className="btn btn-success d-flex py-4 cart-cart1">
                      <span className="d-flex align-items-center flex-row flex-nowrap">
                        Shop Now
                        <FontAwesomeIcon
                          icon={faArrowRightLong}
                          className="mt-0 ms-1 pt-1"
                        />
                      </span>
                    </button>
                  </Link>
                </div>
                <div className="d-flex justify-content-end align-items-end attack-img">
                  <img
                    src={Panic}
                    alt="Panic Attacks"
                    className="panic-img position-absolute lyte-pain"
                  />
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4 d-flex flex-column gap-3 gap-md-0 align-items-md-start align-items-lg-start align-items-xxl-center align-items-xl-center m-0 mt-3 mt-lg-2 mt-xl-0 mt-xxl-0 generic-lyte">
              <div className="box-generic shadow-sm p-4 position-relative lh-lg">
                <h4 className="text-start">Buy Generic Medicines</h4>
                <p className="text-danger mb-3 text-start">Starting at $5.99</p>

                <Link
                  to="/shop"
                  className="text-decoration-none text-light cart-cart1 shop-right"
                >
                  <button className="btn btn-success d-flex py-4 cart-cart1">
                    <span className="d-flex align-items-center flex-row flex-nowrap">
                      Shop Now
                      <FontAwesomeIcon
                        icon={faArrowRightLong}
                        className="mt-0 ms-1 pt-1"
                      />
                    </span>
                  </button>
                </Link>

                <div className="d-flex justify-content-end align-items-end">
                  <img
                    src={Generic}
                    alt="Generic Medicines"
                    className="generic-img position-absolute me-lg-2 me-0"
                  />
                </div>
              </div>

              <div className="box-pain shadow-sm p-4 position-relative w-100 mt-lg-2 mt-xl-3 mt-xxl-3 mt-md-2">
                <div className="d-flex align-items-start flex-column align-items-lg-end lh-lg align-items-md-end">
                  <div className="d-flex flex-column align-items-lg-start align-items-xl-start align-items-xxl-start product-homepage flex-wrap ms-lg-5 ps-lg-5 ps-xl-0 ps-xxl-0 ms-xl-0 ms-xxl-0">
                    <h5 className="text-success ms-lg-5">Hot Product</h5>
                    <h4 className="text-start text-lg-start text-md-end me-4 me-lg-0 ms-lg-5">
                      Buy Pain Relief Medicines
                    </h4>
                    <p className="text-danger mb-3 ms-lg-5">$199.00/60%</p>
                    <Link
                      to="/shop"
                      className="text-decoration-none text-light cart-cart1 shop-right"
                    >
                      <button className="btn btn-success d-flex py-4 cart-cart1 ms-lg-5">
                        <span className="d-flex align-items-center flex-row flex-nowrap">
                          Shop Now
                          <FontAwesomeIcon
                            icon={faArrowRightLong}
                            className="mt-0 ms-1 pt-1"
                          />
                        </span>
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="d-flex justify-content-end justify-content-md-start align-items-end">
                  <img
                    src={PainRelief}
                    alt="Pain Relief Medicines"
                    className="pain-img position-absolute"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-fluid mt-3 mt-lg-0 cart-cart">
          <h3 className="mt-lg-4 mt-0 text-center faq-typo1">
            Featured Products
          </h3>
          <div className="container">
            <div className="row row-cols-1 row-cols-sm-2 mt-0 row-cols-md-4 gap-2 g-3 d-flex flex-row flex-wrap me-md-2 me-lg-0">
              {Array.isArray(product) && product.length > 0 ? (
                product.slice(0, 4).map((data, index) => {
                  const productLabel = label.find(
                    (item) => item.name === data.label
                  );
                  const labelColor = productLabel
                    ? productLabel.color
                    : "green";

                  return (
                    <div
                      className="col-12 col-lg-3 col-md-6 text-center border rounded feature-watch px-lg-1 px-0"
                      key={index}
                    >
                      <div className="feature-box rounded-0 position-relative rounded-1">
                        <button
                          className="position-absolute end-0 btn d-flex mt-2 rounded-0 cart-cart product-label text-light me-2"
                          style={{ backgroundColor: labelColor }}
                        >
                          {data.label || "Label"}
                        </button>
                        <Link to={`/${url.productDetails}`}>
                          <img
                            src={`http://89.116.170.231:1600/src/image/${data.image}`}
                            className="w-100 h-100 object-fit-cover border-0 image-watch"
                            style={{ cursor: "pointer" }}
                            alt={data.name || "Product Image"}
                          />
                        </Link>
                        <button
                          className="position-absolute me-1 btn btn-light wishlist-button wishlist-button1 text-light btn-success"
                          onClick={() => addWishlistItem(data)}
                        >
                          <FontAwesomeIcon icon={faHeart} />
                          <div className="wishlist-button-content">
                            Add to Wishlist
                          </div>
                        </button>
                        <div className="add-to-cart-button-container">
                          <button
                            className="add-to-cart-button mt-4 d-flex flex-row cart-cart1"
                            style={{ whiteSpace: "nowrap" }}
                            onClick={() => addCartItem(data)}
                          >
                            <FontAwesomeIcon
                              icon={faCartShopping}
                              className="me-2 mt-0"
                            />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                      <hr />
                      <div className="ms-3">
                        <h6 className="mt-2 mb-0 lh-base text-start text-lg-start">
                          {data.store || "Product Store"}
                        </h6>
                        <h6 className="mt-0 lh-base text-start text-lg-start fw-bold">
                          {data.name || "Product Name"}
                        </h6>
                        <h6 className="mt-0 lh-base text-start text-lg-start">
                          SKU:{data.sku || "Product Name"}
                        </h6>
                        <div
                          className="d-flex justify-content-start justify-content-lg-start mb-2 gap-1 mt-2 flex-row"
                          style={{ fontFamily: "verdana" }}
                        >
                          <h6 className="me-1">{data.price || "Price"}</h6>
                          <strike className="text-danger fw-medium">
                            {data.discountPrice || "$54"}
                          </strike>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>No featured products available</div>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />

        <div className="container-fluid mt-3 mt-lg-0 cart-cart">
          <h3 className="mt-lg-4 mt-0 text-center mb-0 faq-typo1">
            What Our Customers Say
          </h3>

          <div className="container d-flex justify-content-center mt-0 align-items-center">
            <div className="row gap-2 g-3 d-flex flex-row flex-lg-nowrap flex-md-nowrap flex-wrap customer-what">
              {Array.isArray(paginatedReviews) &&
              paginatedReviews.length > 0 ? (
                paginatedReviews.map((item) => (
                  <div
                    key={item.id}
                    className="col-12 col-md-6 col-lg-6 border text-start rounded d-flex flex-column justify-content-center align-items-center lh-lg mt-0"
                  >
                    <img
                      src={`http://89.116.170.231:1600/src/image/${item.image}`}
                      alt="Customer"
                      className="img-fluid customer-homeimage mt-3"
                    />
                    <h5 className="mt-2 color-barnes">
                      {item.first_name} {item.last_name}
                    </h5>
                    <span className="great-choice">{item.title}</span>
                    <span className="ms-3 me-1">{item.notes}</span>

                    <span className="d-flex flex-row flex-nowrap mb-3 gap-2 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`bg-${
                            i < item.rating ? "success" : "success"
                          } text-${
                            i < item.rating ? "light" : "light"
                          } rounded px-1`}
                        >
                          <FontAwesomeIcon icon={faStar} />
                        </div>
                      ))}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center mt-0">No reviews available.</p>
              )}
            </div>
          </div>

          <div className="text-center mt-2 mt-lg-3 pointer-click">
            <FontAwesomeIcon
              icon={faAngleLeft}
              className={`me-3 ${currentIndex === 0 ? "disabled" : ""}`}
              onClick={handlePrevious}
            />
            <FontAwesomeIcon
              icon={faAngleRight}
              className={`${
                currentIndex + reviewsPerPage >= review.length ? "disabled" : ""
              }`}
              onClick={handleNext}
            />
          </div>
        </div>

        <div className="container-fluid mt-3 mt-lg-0 cart-cart">
          <h3 className="mt-lg-4 mt-0 text-center faq-typo1">
            Trending Products
          </h3>
          <div className="container">
            <div className="row row-cols-1 row-cols-sm-2 mt-0 row-cols-md-4 gap-2 g-3 d-flex flex-row flex-wrap me-md-2 me-lg-0">
              {Array.isArray(product) && product.length > 0 ? (
                product.slice(0, 8).map((data, index) => {
                  const productLabel = label.find(
                    (item) => item.name === data.label
                  );
                  const labelColor = productLabel
                    ? productLabel.color
                    : "green";

                  return (
                    <div
                      className="col-12 col-lg-3 col-md-6 text-center border rounded feature-watch px-lg-0 px-0"
                      key={index}
                    >
                      <div className="feature-box rounded-0 position-relative rounded-1">
                        {data.label && (
                          <button
                            className="position-absolute end-0 btn d-flex mt-2 rounded-0 cart-cart product-label text-light me-2"
                            style={{ backgroundColor: labelColor }}
                          >
                            {data.label}
                          </button>
                        )}
                        <Link to={`/${url.productDetails}`}>
                          <img
                            src={`http://89.116.170.231:1600/src/image/${data.image}`}
                            className="w-100 h-100 object-fit-cover border-0 image-watch"
                            style={{ cursor: "pointer" }}
                            alt={data.name || "Product Image"}
                          />
                        </Link>
                        <button
                          className="position-absolute me-1 btn btn-light wishlist-button wishlist-button1 text-light btn-success"
                          onClick={() => addWishlistItem(data)}
                        >
                          <FontAwesomeIcon icon={faHeart} />
                          <div className="wishlist-button-content">
                            Add to Wishlist
                          </div>
                        </button>
                        <div className="add-to-cart-button-container">
                          <button
                            className="add-to-cart-button mt-4 d-flex flex-row cart-cart1"
                            style={{ whiteSpace: "nowrap" }}
                            onClick={() => addCartItem(data)}
                          >
                            <FontAwesomeIcon
                              icon={faCartShopping}
                              className="me-2 mt-0"
                            />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                      <hr />
                      <div className="ms-3">
                        <h6 className="mt-2 mb-0 lh-base text-start text-lg-start">
                          {data.store || "Product Store"}
                        </h6>
                        <h6 className="mt-0 lh-base text-start text-lg-start fw-bold">
                          {data.name || "Product Name"}
                        </h6>
                        <h6 className="mt-0 lh-base text-start text-lg-start">
                          SKU:{data.sku || "Product Name"}
                        </h6>
                        <div
                          className="d-flex justify-content-start justify-content-lg-start mb-2 gap-1 mt-2 flex-row"
                          style={{ fontFamily: "verdana" }}
                        >
                          <h6 className="me-1">{data.price || "Price"}</h6>
                          <strike className="text-danger fw-medium">
                            {data.discountPrice || "$54"}
                          </strike>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div>No trending products available</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-3 mt-lg-0 cart-cart">
        <h3 className="mt-lg-4 mt-0 text-center faq-typo1">
          Best Selling Item
        </h3>
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 mt-0 row-cols-md-4 gap-2 g-3 d-flex flex-row flex-wrap me-md-2 me-lg-0">
            {Array.isArray(product) && product.length > 0 ? (
              product.slice(0, 4).map((data, index) => {
                const productLabel = label.find(
                  (item) => item.name === data.label
                );
                const labelColor = productLabel ? productLabel.color : "green";

                return (
                  <div
                    className="col-12 col-lg-3 col-md-6 text-center border rounded feature-watch h-auto"
                    key={index}
                  >
                    <div className="feature-box rounded-0 position-relative rounded-1">
                      {data.label && (
                        <button
                          className="position-absolute end-0 btn d-flex mt-2 rounded-0 cart-cart product-label text-light"
                          style={{ backgroundColor: labelColor }}
                        >
                          {data.label}
                        </button>
                      )}

                      <Link to={`/${url.productDetails}`}>
                        <img
                          src={`http://89.116.170.231:1600/src/image/${data.image}`}
                          alt={data.name || "Product Image"}
                          className="w-100 h-100 object-fit-cover border-0 image-watch"
                          style={{ cursor: "pointer" }}
                        />
                      </Link>

                      <button
                        className="position-absolute me-1 btn btn-light wishlist-button wishlist-button1 text-light btn-success"
                        onClick={() => addWishlistItem(data)}
                      >
                        <FontAwesomeIcon icon={faHeart} />
                        <div className="wishlist-button-content">
                          Add to Wishlist
                        </div>
                      </button>

                      <div className="add-to-cart-button-container">
                        <button
                          className="add-to-cart-button mt-4 d-flex flex-row cart-cart1"
                          style={{ whiteSpace: "nowrap" }}
                          onClick={() => addCartItem(data)}
                        >
                          <FontAwesomeIcon
                            icon={faCartShopping}
                            className="me-2 mt-0"
                          />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    <hr />
                    <div className="ms-3">
                      <h6 className="mt-2 mb-0 lh-base text-start text-lg-start">
                        {data.store || "Product Store"}
                      </h6>
                      <h6 className="mt-0 lh-base text-start text-lg-start fw-bold">
                        {data.name || "Product Name"}
                      </h6>
                      <h6 className="mt-0 lh-base text-start text-lg-start">
                        SKU:{data.sku || "Product Name"}
                      </h6>
                      <div
                        className="d-flex justify-content-start justify-content-lg-start mb-2 gap-1 mt-2 flex-row"
                        style={{ fontFamily: "verdana" }}
                      >
                        <h6 className="me-1">{data.price || "Price"}</h6>
                        <strike className="text-danger fw-medium">
                          {data.discountPrice || "$54"}
                        </strike>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>No best-selling items available</div>
            )}
          </div>
        </div>
      </div>

      <div className="container-fluid full-height d-flex justify-content-center align-items-center">
        <div className="container">
          <div className="row mt-lg-4">
            <div className="col-12 d-flex justify-content-center">
              <div className="custom-container text-center-custom lorem-home h-auto pb-4">
                <h1 className="fw-normal fs-1 mt-4 text-center">FAQs</h1>
                <div>
                  {Array.isArray(faqs) && faqs.length > 0 ? (
                    faqs.map((item, index) => (
                      <div
                        key={index}
                        className="ms-lg-3 me-2 ms-2 mt-4 rounded-2 border d-flex flex-column h-auto position-relative"
                      >
                        <div className="d-flex align-items-center">
                          <h4 className="fs-4 cart-cart mb-0 text-start ms-0 faq-typo p-2 fw-normal ms-md-0">
                            {item.question}
                          </h4>

                          <div className="custom-button1">
                            <button
                              className="border rounded py-2 ms-2 px-2 bg-success text-light"
                              onClick={() => faqsAnswer(index)}
                            >
                              <FontAwesomeIcon
                                icon={faAngleDown}
                                className={`fs-2 ${
                                  rotatedIndexes.includes(index) ? "rotate" : ""
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                        {activeIndex === index && (
                          <div className="mt-lg-0 ms-2 text-start cart-cart mt-1">
                            {item.answer}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>Loading FAQs...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid lorem-home">
        <div className="container">
          <h2 className="text-center mt-4 fw-medium faq-typo1">Latest Blogs</h2>
          <div className="row mt-3 d-flex justify-content-start lorem-home1 flex-row gap-3 gap-xxl-4 me-lg-0 me-0 ms-lg-1">
            {Array.isArray(currentBlogs) && currentBlogs.length > 0 ? (
              currentBlogs.map((post, index) => (
                <div
                  key={index}
                  className="col-12 col-xxl-4 col-lg-4 col-md-4 custom-height3 border mb-3 d-flex flex-column align-items-center text-center ms-lg- latest-read ms-md-3 mt-md-2"
                >
                  <img
                    src={`http://89.116.170.231:1600/src/image/${post.image}`}
                    alt={`img${index + 1}`}
                    className="img-fluid w-100"
                  />
                  <div className="latest-moree">
                    <h4 className="fw-medium fs-4 mt-2 lh-base text-start ms-2 ms-lg-2">
                      {post.name.split(" ").slice(0, 8).join(" ")}
                    </h4>
                    <p className="text-dark text-start mt-0 px-lg-2 px-2">
                      {post.description.split(" ").slice(0, 10).join(" ")}
                    </p>
                    <Link
                      to={`/blog-details/${post.id}`}
                      className="text-decoration-none mt-1"
                    >
                      <h3 className="read-more ms-5 mt-4">
                        <button className="btn-success rounded text-light py-2 mt-2 more-button">
                          Read more
                        </button>
                      </h3>
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p>Loading blogs...</p>
            )}
          </div>

          <div className="pagination d-flex justify-content-center flex-row flex-nowrap mt-1">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="mt-2 me-2 text-success"
              style={{ cursor: "pointer" }}
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            />
            <button
              onClick={() => paginate(1)}
              className={`btn ${
                currentPage === 1
                  ? "btn-success d-flex paginate align-items-center"
                  : "paginate btn-secondary"
              } mx-2`}
            >
              1
            </button>
            <button
              onClick={() => paginate(2)}
              className={`btn ${
                currentPage === 2
                  ? "btn-success d-flex paginate align-items-center"
                  : "paginate btn-secondary"
              } mx-2`}
            >
              2
            </button>
            <button
              onClick={() => paginate(3)}
              className={`btn ${
                currentPage === 3
                  ? "btn-success d-flex paginate align-items-center"
                  : "paginate btn-secondary"
              } mx-2`}
            >
              3
            </button>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="mt-2 text-success"
              style={{ cursor: "pointer" }}
              onClick={goToNextPage}
              disabled={currentPage === Math.ceil(blog.length / blogsPerPage)}
            />
          </div>
        </div>
      </div>

      <div className="container-fluid bg-light py-4 mt-4">
        <div className="container cart-cart">
          <div className="row text-center">
            <div className="col-6 col-lg-3 d-flex align-items-center justify-content-center mb-3 mb-lg-0">
              <div className="border bg-body px-2 py-1 rounded me-2">
                <img
                  src={Shipping}
                  alt="Free Shipping"
                  width="47"
                  className="me-2 shipping-image"
                />
              </div>

              <h4 className="mt-2 mt-lg-0 shipping-free wrap-secure">
                Free Shipping
              </h4>
            </div>
            <div className="col-6 col-lg-3 d-flex align-items-center justify-content-center mb-3 mb-lg-0">
              <div className="border bg-body px-2 py-1 rounded me-2">
                <img
                  src={Returns}
                  alt="Free Shipping"
                  width="47"
                  className="me-2 shipping-image"
                />
              </div>

              <h4 className="mt-2 mt-lg-0 shipping-free wrap-secure">
                Easy Returns
              </h4>
            </div>

            <div className="col-6 col-lg-3 d-flex align-items-center justify-content-center mb-3 mb-lg-0 mt-md-3 mt-lg-0">
              <div className="border bg-body px-2 py-1 rounded me-2 ms-md-4 ms-lg-0">
                <img
                  src={Payments}
                  alt="Free Shipping"
                  width="47"
                  className="me-2 shipping-image"
                />
              </div>
              <h4 className="mt-2 mt-lg-0 shipping-free">
                <span className="text-start d-flex flex-row flex-nowrap wrap-secure">
                  Secure Payment
                </span>
              </h4>
            </div>

            <div className="col-6 col-lg-3 d-flex align-items-center justify-content-center mb-3 mb-lg-0 mt-md-3 mt-lg-0">
              <div className="border bg-body px-2 py-1 rounded me-2">
                <img
                  src={Support}
                  alt="Free Shipping"
                  width="47"
                  className="me-2 shipping-image"
                />
              </div>
              <h4 className="mt-2 mt-lg-0 shipping-free wrap-secure">
                24/7 Support
              </h4>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-dark text-white pt-4 pb-4 cart-cart mt-4">
        <div className="container text-center text-md-left">
          <div className="row footer-lyte">
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 mx-auto mt-lg-3 mt-0 d-flex flex-column text-start ms-0">
              <img
                src={Tonic}
                alt="RxTonic"
                className="img-fluid mb-3"
                style={{ maxWidth: "190px" }}
              />
              <h4 className="mb-2">About Us</h4>
              <p className="text-start lh-lg footer-list">
                <li>
                  We assert that our online pharmacy, RxTonic.com, complies with
                  all local legal requirements while delivering healthcare
                  services over the internet platform. To provide our consumers
                  the finest pharmaceutical care possible,all pharmaceutical
                  firms and drug manufacturers have accredited facilities and
                  trained pharmacists on staff.
                </li>
              </p>
            </div>

            <div className="col-12 col-md-6 col-lg-4 mt-md-5 pt-md-2 mt-lg-0 pt-lg-0">
              <div className="d-flex flex-row flex-lg-nowrap w-100 gap-2 mt-lg-5 pt-lg-4">
                <div className="text-start">
                  <h5 className="mb-2 pb-0">Company</h5>
                  <ul className="lh-lg footer-list p-0">
                    <li>
                      <Link
                        to="/about"
                        className="text-white text-decoration-none"
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/blog"
                        className="text-white text-decoration-none"
                      >
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link className="text-white text-decoration-none">
                        Payment Security
                      </Link>
                    </li>
                    <li>
                      <Link className="text-white text-decoration-none">
                        Affiliate Marketing
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="text-start ms-5 ps-5 ps-lg-0">
                  <h5 className="mb-2 pb-0">Help?</h5>
                  <ul className="lh-lg footer-list p-0">
                    <li>
                      <Link
                        to="/faqs"
                        className="text-white text-decoration-none"
                      >
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-white text-decoration-none"
                        to="/sitemap"
                      >
                        Sitemap
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/contact-us"
                        className="text-white text-decoration-none"
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3 col-xl-3 mx-auto mt-lg-2 mt-0 ms-lg-5 mt-lg-5 pt-lg-4 pt-1 ms-0 footer-list">
              <h5 className="mb-lg-3 mb-3 text-start">
                Sign Up for Newsletter
              </h5>
              <form className="d-flex flex-row flex-nowrap">
                <input
                  type="email"
                  placeholder="Email address"
                  className="form-control me-2 py-4 cart-cart1"
                  aria-label="Email address"
                />
                <button
                  className="btn btn-success d-flex cart-cart1 py-4 me-0"
                  type="submit"
                  onClick={(e) => e.preventDefault()}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <hr className="my-4 me-3" />

          <div className="row align-items-center footer-lyte1">
            <div className="col-md-6 col-lg-7">
              <p className="text-md-start text-lg-start text-start mb-0">
                &copy; {new Date().getFullYear()} RxTonic. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
export default HomePage;
