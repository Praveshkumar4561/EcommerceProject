import React, { useContext, useEffect, useRef, useState } from "react";
import "./HomePage.css";
import Tonic from "/assets/Tonic.svg";
import Panic from "/assets/panic-attacks.webp";
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
  faGreaterThan,
} from "@fortawesome/free-solid-svg-icons";
import Hamburger from "../../assets/hamburger.svg";
import Close from "../../assets/Close.webp";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import Generic from "../../assets/Lytes.svg";
import PainRelief from "../../assets/Latest.svg";
import Support from "../../assets/Support.svg";
import Payments from "../../assets/Payments.svg";
import Returns from "../../assets/Returns.svg";
import Shipping from "../../assets/Shipping.svg";
import UserContext from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JsonLd from "../JsonLd";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function HomePage() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqsAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
    const newIndexes = [...prev];
    if (newIndexes.includes(index)) {
      newIndexes.splice(newIndexes.indexOf(index), 1);
    } else {
      newIndexes.push(index);
    }
    return newIndexes;
  };

  let [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const labeldata = async () => {
      try {
        let response = await axios.get(
          "http://147.93.45.171:1600/pagesdatafaqs"
        );
        const filteredData = response.data.filter(
          (faqs) => faqs.status === "published" || faqs.status === "default"
        );
        setFaqs(filteredData);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    labeldata();
  }, []);

  const [blog, setBlog] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 3;

  useEffect(() => {
    const showdata = async () => {
      try {
        let response = await axios.get(
          "http://147.93.45.171:1600/blogpostdata"
        );
        const filteredData = response.data.filter(
          (b) =>
            (b.status === "Published" || b.status === "Draft") &&
            String(b.feature).toLowerCase() === "yes"
        );
        setBlog(filteredData);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    showdata();
  }, []);

  const totalPages = Math.ceil(blog.length / blogsPerPage);
  const indexOfLastPost = currentPage * blogsPerPage;
  const indexOfFirstPost = indexOfLastPost - blogsPerPage;
  const currentBlogs = blog.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const [user, setUser] = useState([]);

  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fallbackContent = "No announcements available.";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/getannounce"
        );

        const now = new Date();
        const filtered = response.data.filter(
          (announcement) =>
            announcement.active === "yes" &&
            new Date(announcement.end_date) >= now
        );

        const updatedAnnouncements = filtered.map((announcement) => ({
          ...announcement,
          truncatedContent: announcement.content
            ? announcement.content.split(" ").slice(0, 6).join(" ")
            : fallbackContent,
        }));

        setFilteredAnnouncements(updatedAnnouncements);
        if (updatedAnnouncements.length > 0) {
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };

    fetchData();
  }, []);

  const leftData = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : filteredAnnouncements.length - 1
    );
  };

  const rightData = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < filteredAnnouncements.length - 1 ? prevIndex + 1 : 0
    );
  };

  let [detail, setDetail] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const isAuthenticated = localStorage.getItem("auth");
      if (!storedUser || isAuthenticated !== "true") {
        navigate("/");
      } else if (storedUser && storedUser.tokenExpiration) {
        if (Date.now() > storedUser.tokenExpiration) {
          localStorage.removeItem("user");
          localStorage.removeItem("auth");
          toast.error("Session expired. Please log in again.");
          navigate("/");
        } else {
          setDetail(storedUser);
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
    const cartdata = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/allcartdata"
        );
        setCount(response.data.length);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    cartdata();
  }, []);

  let [count6, setCount6] = useState(0);

  useEffect(() => {
    const wishlistdata = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/wishlistdata"
        );
        setCount6(response.data.length);
      } catch (error) {
        console.error("Error fetching wishlist data:", error);
      }
    };
    wishlistdata();
  }, []);

  const [product, setProduct] = useState([]);
  let [search, setSearch] = useState("");
  let [search1, setSearch1] = useState("");
  const searchContainerRef = useRef(null);

  useEffect(() => {
    if (search) {
      searchbar();
    } else {
      homedata();
    }
  }, [search]);

  let searchbar = async () => {
    let response = await axios.get(
      `http://147.93.45.171:1600/productsearch/${search}`
    );
    setSearch1(response.data);
  };

  const homedata = async () => {
    try {
      let response = await axios.get(
        "http://147.93.45.171:1600/productpagedata"
      );
      const filteredData = response.data.filter(
        (product) =>
          product.status === "Published" || product.status === "Draft"
      );
      setProduct(filteredData);
    } catch (error) {
      console.error("Error fetching blog data:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchClick = () => {
    navigate("/product-categories");
  };

  let [label, setLabel] = useState([]);

  useEffect(() => {
    const labeldata = async () => {
      try {
        let response = await axios.get(
          "http://147.93.45.171:1600/productlabelsdata"
        );
        const filteredData = response.data.filter(
          (label) => label.status === "Published" || label.status === "Draft"
        );
        setLabel(filteredData);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    labeldata();
  }, []);

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
      await axios.post("http://147.93.45.171:1600/addcart", formData);
      setCount((prevCount) => prevCount + 1);
      toast.success("Product successfully added on the cart", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeButton: true,
        draggable: true,
      });
    } catch (error) {
      toast.error("Product is not added on the cart", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
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
      await axios.post("http://147.93.45.171:1600/wishlistpost", formData);
      setCount6((prevCount) => prevCount + 1);
      toast.success("Product successfully added on the wishlist", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
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

  const [logoUrl, setLogoUrl] = useState(
    window.__APP_CONFIG__?.logoUrl || "/assets/Tonic.svg"
  );
  const [logoHeight, setLogoHeight] = useState(
    window.__APP_CONFIG__?.logoHeight || "45"
  );

  useEffect(() => {
    axios
      .get("http://147.93.45.171:1600/get-theme-logo")
      .then(({ data }) => {
        const url = data.logo_url
          ? `http://147.93.45.171:1600/src/image/${data.logo_url}`
          : "/assets/Tonic.svg";
        setLogoUrl(url);
        setLogoHeight(data.logo_height || "45");
      })
      .catch(() => {});
  }, []);

  const [review, setReview] = useState([]);
  const reviewsPerPage = 2;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/allreviewdata"
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
        url: "http://srv689968.hstgr.cloud/",
        logo: "http://srv689968.hstgr.cloud/Tonic.svg",
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
        url: "http://srv689968.hstgr.cloud/",
        description:
          "Shop the latest healthcare products at RxLyte, your trusted online pharmacy for premium wellness essentials.",
        keywords:
          "RxLYTE, Ecommerce, healthcare, online pharmacy, wellness products",
      },
      {
        "@type": "LocalBusiness",
        name: "RxLYTE Healthcare Store",
        url: "http://srv689968.hstgr.cloud/",
        image: "http://srv689968.hstgr.cloud/Tonic.svg",
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

  let [ads, setAds] = useState([]);

  useEffect(() => {
    const adspagedata = async () => {
      try {
        const response = await axios.get("http://147.93.45.171:1600/adsdata");
        setAds(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    adspagedata();
  }, []);

  const [cookieData, setCookieData] = useState([]);
  const [shouldShowCookie, setShouldShowCookie] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");

    if (!consent) {
      setShouldShowCookie(true);
      axios
        .get("http://147.93.45.171:1600/cookiesalldata")
        .then((response) => {
          const dataArray = Array.isArray(response.data)
            ? response.data
            : response.data?.cookies || [];

          const validData = dataArray.filter((item) => item.cookie === "yes");

          setCookieData(validData);
        })
        .catch((error) => {
          console.error("Error fetching cookie data:", error);
        });
    }
  }, []);

  const handleCookieAccept = (data) => {
    localStorage.setItem("cookieConsent", JSON.stringify(data));
    setShouldShowCookie(false);
  };

  const [totalVisits, setTotalVisits] = useState(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    if (hasTracked.current) return;
    hasTracked.current = true;
    const trackVisit = async () => {
      try {
        const path = window.location.pathname;
        const response = await axios.get(
          `http://147.93.45.171:1600/track?page=${path}`
        );
        setTotalVisits(response.data.total);
      } catch (error) {
        console.error("Tracking error:", error);
      }
    };
    // trackVisit();
  }, []);

  let [letter, setLetter] = useState({
    email: "",
  });
  let { email } = letter;

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    const requiredFields = { email };

    for (const field in requiredFields) {
      if (
        !requiredFields[field] ||
        requiredFields[field].toString().trim() === ""
      ) {
        let fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        newErrors[field] = `${fieldName} is required`;
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  let newsSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      await axios.post("http://147.93.45.171:1600/newsletterpost", letter);
      toast.success("Newsletter subscribed successfully", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Newsletter is not subscribed", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  let onInputChange = (e) => {
    setLetter({ ...letter, [e.target.name]: e.target.value });
  };

  const domain = "http://srv689968.hstgr.cloud//";

  let [home, setHome] = useState(null);

  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/themeoptionsdata"
        );
        setHome(response.data);
      } catch (error) {
        console.error("Error fetching SEO data", error);
      }
    };
    fetchSEOData();
  }, []);

  return (
    <>
      <JsonLd data={schemaData} />
      {home && (
        <Helmet>
          <title>
            {home.site_title ||
              "RxLYTE - Buy Healthcare & Wellness Products Online | Best Prices"}
          </title>

          <meta
            name="description"
            content={
              home?.seo_description ||
              "Shop premium healthcare and wellness products online at RxLYTE. Discover high-quality medical essentials, vitamins, supplements, and personal care items at unbeatable prices. Enjoy fast delivery and secure checkout."
            }
          />

          <meta
            name="robots"
            content={
              home?.seo_index === "1" ? "index, follow" : "index, follow"
            }
          />

          <meta
            name="author"
            content={home?.copyright || "© 2025 RxLYTE. All rights reserved."}
          />

          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content={
              home?.seo_title ||
              "RxLYTE - Buy Healthcare & Wellness Products Online | Best Prices"
            }
          />
          <meta
            property="og:description"
            content={
              home?.seo_description ||
              "Shop premium healthcare and wellness products online at RxLYTE. High-quality medical essentials, vitamins, supplements, and personal care products available at unbeatable prices. Fast delivery & secure checkout."
            }
          />
          <meta
            property="og:url"
            content={
              home?.seo_canonical?.startsWith("http")
                ? home.seo_canonical
                : `${domain}${home?.seo_canonical || window.location.pathname}`
            }
          />
          <meta
            property="og:image"
            content={home?.seo_og_image_url || "/assets/Tonic.svg"}
          />
          <meta property="og:site_name" content="RxLYTE" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content={
              home?.seo_title ||
              "RxLYTE - Buy Healthcare & Wellness Products Online | Best Prices"
            }
          />
          <meta
            name="twitter:description"
            content={
              home?.seo_description ||
              "Shop premium healthcare and wellness products online at RxLYTE. Get high-quality medical essentials, vitamins, and personal care products at unbeatable prices."
            }
          />
          <meta
            name="twitter:image"
            content={home?.seo_og_image_url || "/assets/Tonic.svg"}
          />

          <link
            rel="canonical"
            href={
              home?.seo_canonical?.startsWith("http")
                ? home.seo_canonical
                : `${domain}${home?.seo_canonical || window.location.pathname}`
            }
          />
        </Helmet>
      )}
      <div
        className="container d-lg-none d-block"
        id="container-customx1"
        style={{
          backgroundColor:
            user?.background_color ||
            (user?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: user?.background_image
            ? `url(http://147.93.45.171:1600/src/image/${user.background_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: user?.breadcrumb_height
            ? `${user.breadcrumb_height}px`
            : "190px",
        }}
      >
        {filteredAnnouncements.length > 0 ? (
          <div className="d-block d-lg-block text-start pt-2 pb-2">
            <div className="mb-0 mt-0 mt-lg-0 me-md-3 free-shipping cart-cart d-flex flex-row ms-0 ms-lg-0">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="me-2 text-success-accessible fs-6 d-block d-lg-block mt-1"
                style={{
                  cursor: "pointer",
                  position: "relative",
                  zIndex: "1000",
                }}
                onClick={leftData}
              />
              <FontAwesomeIcon
                icon={faArrowRight}
                className="me-2 text-success-accessible fs-6 d-block d-lg-block mt-1"
                style={{
                  cursor: "pointer",
                  position: "relative",
                  zIndex: "1000",
                }}
                onClick={rightData}
              />

              <div className="announcement-text">
                {filteredAnnouncements[currentIndex]?.truncatedContent ||
                  fallbackContent}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-start">No announcements available.</div>
        )}

        <div className="container-custom ms-2 pt-lg-4 mt-lg-0 mt-5 pt-5 mb-auto mt-auto me-lg-0 me-2">
          <header className="d-flex flex-wrap justify-content-between py-2 mb-5 border-bottom bg-body rounded-2 container-custom1 me-4">
            <nav className="navbar navbar-expand-lg navbar-light w-100 d-flex flex-row flex-nowrap">
              <div className="container">
                <Link className="navbar-brand d-non d-lg-block" to="/">
                  <img
                    src={logoUrl || Tonic}
                    alt="Tonic Logo"
                    className="image-galaxy"
                    style={{ height: `${logoHeight}px`, width: "200px" }}
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
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

                <div className="navbar-icons1 d-sm-flex mt-0 mt-md-0 gap-0 navbar-mobile">
                  <Link
                    to={`/${url.wishlist}`}
                    className="position-relative text-decoration-none me-3 mt-0 wishlist-home"
                  >
                    <span className="count-badge mt-2 pt-sm-2 pt-0 pt-md-0 mt-md-2">
                      {count6}
                    </span>
                    <img
                      src={Wishlists}
                      alt="RxLYTE"
                      className="cart-image profiles1 mt-2 mt-lg-1"
                      width="50"
                      height="50"
                      loading="lazy"
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
                      width="50"
                      height="50"
                      loading="lazy"
                    />
                  </Link>

                  <Link
                    to={`/${url.cart}`}
                    className="nav-link d-flex nav-properties1"
                  >
                    <img
                      src={Carthome}
                      alt="Cart"
                      className="profiles1 img-fluid mt-2"
                      style={{
                        height: "50px",
                        width: "auto",
                        objectFit: "contain",
                      }}
                      loading="lazy"
                    />

                    <div className="addcarts ms-1 ps-1 pt-sm-1 pt-lg-1 pt-0 pt-md-0 count-badge1">
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
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-md-start align-items-start ps-lg-2 ps-0 mt-2 mt-lg-2 pt-lg-1 lorem-home d-lg-block d-none">
            {filteredAnnouncements.length > 0 ? (
              <div className="d-block d-lg-block text-start pt-2 pt-lg-0 pb-2">
                <div className="mb-0 mt-0 mt-lg-0 me-md-3 free-shipping cart-cart d-flex flex-row ms-0 ms-lg-0">
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="me-2 text-success-accessible fs-6 d-block d-lg-block mt-1"
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      zIndex: "1000",
                    }}
                    onClick={leftData}
                  />
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="me-2 text-success-accessible fs-6 d-block d-lg-block mt-1"
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      zIndex: "1000",
                    }}
                    onClick={rightData}
                  />
                  <div className="announcement-content">
                    {filteredAnnouncements[currentIndex]?.truncatedContent ||
                      fallbackContent}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-start">{fallbackContent}</div>
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

                      <div className="d-flex flex-row gap-2 mt-1">
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
                              width="50"
                              height="50"
                              loading="lazy"
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
                              width="50"
                              height="50"
                              loading="lazy"
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
                              width="50"
                              height="50"
                              loading="lazy"
                            />
                            <div className="addcarts ms-1 mt-1 ps-1 count-badge1 count-cart">
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
              <div className="d-flex flex-row justify-content-lg-end align-items-end float-end gap-4 mt-1 me-2">
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
                    width="50"
                    height="50"
                    loading="lazy"
                  />
                </Link>

                <Link to={`/${url.login}`}>
                  <img
                    src={Accounts}
                    alt="RxLYTE"
                    className="cart-image2 mt-2"
                    width="50"
                    height="50"
                    loading="lazy"
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
                    width="50"
                    height="50"
                    loading="lazy"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="container bg-light d-lg-block d-none">
          <div className="row d-flex justify-content-start text-center align-items-start mt-0 mb-lg-0 mb-2">
            <div className="col-12 col-md-8 d-flex align-items-center mb-2 mt-0 flex-row">
              <div className="logo-container">
                <img
                  className="img-fluid"
                  src={logoUrl}
                  alt="Logo"
                  width={280}
                  height={logoHeight}
                  loading="eager"
                  decoding="async"
                  fetchpriority="high"
                  srcSet={`${logoUrl}?w=300 300w, ${logoUrl}?w=600 600w, ${logoUrl}?w=1200 1200w`}
                  sizes="(max-width: 768px) 100vw, 280px"
                />
              </div>

              <div
                ref={searchContainerRef}
                className="search-container cart-cart position-relative"
              >
                <div className="input-welcome1-home search-container position-relative d-flex flex-row align-items-center mt-1">
                  <input
                    type="search"
                    className="form-control p-2 border-1 mt-sm-3 border py-4 input-home rounded-0 d-lg-block d-none border-end-0 me- pe-2 cart-cart"
                    placeholder="Search For Product"
                    name="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />

                  <div className="d-lg-block d-none w-75">
                    <select
                      id="categorySelect"
                      className="form-select rounded-0 mt-3"
                      style={{ height: "49px" }}
                      aria-label="Category selection"
                    >
                      {[
                        "All Categories",
                        "New Arrivals",
                        "Electronics",
                        "Featured",
                        "Best Sellers",
                        "Mobile Phone",
                        "Computers & Laptops",
                        "Top Brands",
                        "Weekly Best Selling",
                        "CPU Heat Pipes",
                        "CPU Coolers",
                        "Accessories",
                        "Headphones",
                        "Wireless Headphones",
                        "TWS Headphones",
                        "Smart Watch",
                        "Gaming Console",
                        "Playstation",
                        "Gifts",
                        "Desktop",
                        "Laptop",
                        "Tablet",
                        "SmartPhones & Tablets",
                        "TV Video & Music",
                        "Cameras",
                        "Cooking",
                        "With Bluetooth",
                        "Sports",
                        "Electronics Gadgets",
                        "Microscope",
                        "Remote Control",
                        "Monitor",
                        "Thermometer",
                        "Backpack",
                      ].map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="d-flex d-lg-block d-none">
                    <button
                      className="ms-0 btn btn-success-accesses d-flex mt-3 py-4 px-3 rounded-0 justify-content-center align-items-center"
                      onClick={handleSearchClick}
                      aria-label="Search"
                    >
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                  </div>
                </div>
                {search && Array.isArray(search1) && (
                  <div className="search-results-search d-flex flex-column justify-content-center">
                    {search1.length > 0 ? (
                      <>
                        {search1.slice(0, 4).map((product, idx) => (
                          <Link
                            key={idx}
                            to="/product-categories"
                            className="text-dark text-decoration-none"
                          >
                            <div className="search-result-item d-flex align-items-center p-2 border-bottom">
                              <img
                                src={`http://147.93.45.171:1600/src/image/${product.image}`}
                                alt={product.name}
                                className="img-thumbnail"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                }}
                              />
                              <div className="search-result-details text-start ms-2">
                                <h6 className="mb-1">{product.name}</h6>
                                <div className="d-flex flex-row gap-3 sales-font">
                                  <div className="price fw-bold mb-0">
                                    {product.price}
                                  </div>
                                  {product.price_sale && (
                                    <div className="price-sale text-danger-access fw-bold mb-0">
                                      {product.price_sale}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                        <div className="border w-100 pb-4 pt-3 all-result text-center">
                          <Link to="/product-categories">View all results</Link>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-dark py-3">
                        No result found!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container lorem-home d-none d-lg-block bg-light pb-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="d-flex flex-column flex-md-row align-items-center mb-3 mb-md-0 ">
              <div className="dropdown d-inline-block position-relative">
                <button
                  type="button"
                  className="btn btn-success-accesses d-flex align-items-center me-3 py-4 rounded-0 cart-cart"
                  id="categoryDropdown"
                  aria-label="Browse Categories"
                >
                  <FontAwesomeIcon
                    icon={faBars}
                    className="me-2"
                    aria-hidden="true"
                  />
                  <span className="cart-cart1">Browse Categories</span>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="ms-2"
                    aria-hidden="true"
                  />
                </button>

                <ul
                  className="dropdown-menu rounded-0 lh-lg"
                  aria-labelledby="categoryDropdown"
                >
                  <li>
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Electronics
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Gifts
                    </Link>
                  </li>

                  <li className="dropdown-submenus position-relative">
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Computers{" "}
                      <FontAwesomeIcon
                        icon={faGreaterThan}
                        className="float-end pt-2 computer-font"
                      />
                    </Link>
                    <ul className="dropdown-menus submenus rounded-0 lh-lg">
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?desktop"
                        >
                          Desktop
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?laptop"
                        >
                          Laptop
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?tablet"
                        >
                          Tablet
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?accessories"
                        >
                          Accessories
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      SmartPhones & Tablets
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Tv, Video & Music
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Cameras
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Cooking
                    </Link>
                  </li>

                  <li className="dropdown-submenus position-relative">
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Accessories
                      <FontAwesomeIcon
                        icon={faGreaterThan}
                        className="float-end pt-2 computer-font"
                      />
                    </Link>
                    <ul className="dropdown-menus submenus rounded-0 lh-lg">
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?with-bluetooth"
                        >
                          With Bluetooth
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Sports
                    </Link>
                  </li>

                  <li className="dropdown-submenus position-relative">
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Electronics Gadgets
                      <FontAwesomeIcon
                        icon={faGreaterThan}
                        className="float-end pt-2 computer-font"
                      />
                    </Link>
                    <ul className="dropdown-menus submenus rounded-0 lh-lg">
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?microscope"
                        >
                          Microscope
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?remote-control"
                        >
                          Remote Control
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?monitor"
                        >
                          Monitor
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?thermometer"
                        >
                          Thermometer
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?backpack"
                        >
                          Backpack
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?headphones"
                        >
                          Headphones
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <nav>
                <ul className="nav-list d-flex flex-wrap mb-0 gap-3 gap-md-4 ">
                  <li className="nav-item">
                    <div className="nav-link-wrapper">
                      <Link
                        to="/"
                        className="nav-link fw-medium text-success-accessible"
                      >
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

            <div className="d-none d-md-flex align-items-center mt-3 mt-md-0 d-lg-none d-xl-block d-xxl-block d-lg-block d-none me-3">
              <span className="d-flex">
                <FontAwesomeIcon
                  icon={faPhoneVolume}
                  className="text-success-accessible me-3 mt-1 fw-medium"
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
          <div className="row g-3 d-flex flex-row flex-lg-nowrap flex-md-nowrap">
            <div className="col-12 col-lg-8 m-0 col-md-8">
              <div className="container">
                <div className="promo-box">
                  <div className="promo-content text-start lh-1">
                    <h3>Get rid of your Panic Attacks</h3>
                    <p className="sales-font text-danger-access fw-light mt-0">
                      Starting at $05.99
                    </p>
                    <Link
                      to="/shop"
                      className="text-decoration-none text-light d-flex justify-content-center align-items-center"
                      aria-label="Go to Shop page"
                      style={{
                        backgroundColor: "#0f5132",
                        width: "150px",
                        height: "50px",
                        borderRadius: "8px",
                        whiteSpace: "nowrap",
                        fontWeight: "500",
                        fontSize: "1rem",
                        padding: "0 12px",
                      }}
                    >
                      <span className="d-flex align-items-center flex-row flex-nowrap">
                        Shop Now
                        <FontAwesomeIcon
                          icon={faArrowRightLong}
                          className="ms-2 mt-1"
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  </div>
                  <img
                    src={Panic}
                    alt="Panic Attack"
                    className="promo-image"
                    loading="eager"
                    fetchpriority="high"
                  />
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-4 d-flex flex-column gap-3 gap-md-0 align-items-md-start align-items-lg-start align-items-xxl-center align-items-xl-center m-0 mt-3 mt-md-0 mt-lg-2 mt-xl-0 mt-xxl-0 generic-lyte">
              <div className="box-generic shadow-sm p-4 position-relative lh-lg">
                <h2 className="text-start generic-med mb-0">
                  Buy Generic Medicines
                </h2>
                <div className="text-danger-access mb-1 text-start sales-font">
                  Starting at $05.99
                </div>

                <Link
                  to="/shop"
                  className="text-decoration-none text-light d-flex justify-content-center align-items-center"
                  aria-label="Go to Shop page"
                  style={{
                    backgroundColor: "#0f5132",
                    width: "150px",
                    height: "50px",
                    borderRadius: "8px",
                    whiteSpace: "nowrap",
                    fontWeight: "500",
                    fontSize: "1rem",
                    padding: "0 12px",
                  }}
                >
                  <span className="d-flex align-items-center flex-row flex-nowrap">
                    Shop Now
                    <FontAwesomeIcon
                      icon={faArrowRightLong}
                      className="ms-2 mt-1"
                      aria-hidden="true"
                    />
                  </span>
                </Link>

                <div className="d-flex justify-content-end align-items-end">
                  <img
                    src={Generic}
                    alt="Generic Medicines"
                    width={280}
                    height={280}
                    loading="eager"
                    decoding="async"
                    fetchpriority="high"
                    className="generic-img position-absolute me-lg-2 me-0"
                  />
                </div>
              </div>

              <div className="box-pain shadow-sm p-4 position-relative mt-lg-2 mt-xl-3 mt-xxl-3 mt-md-2">
                <div className="d-flex align-items-start flex-column align-items-lg-end lh-lg align-items-md-end">
                  <div className="d-flex flex-column align-items-lg-start align-items-xl-start align-items-xxl-start product-homepage flex-wrap ms-lg-5 ps-lg-5 ps-xl-0 ps-xxl-0 ms-xl-0 ms-xxl-0">
                    <h2 className="text-success-accessible ms-lg-5 text-start ms-0 mb-1 customer-help">
                      Hot Product
                    </h2>
                    <h2 className="text-start text-lg-start text-md-end me-lg-0 ms-lg-5 ms-0 me-0 text-start generic-med mb-0">
                      Buy Pain Relief Medicines
                    </h2>
                    <div className="mb-2 text-lg-center text-md-start sales-font ms-lg-5 text-danger-access">
                      $199.00/60%
                    </div>

                    <Link
                      to="/shop"
                      className="text-decoration-none text-light d-flex justify-content-center align-items-center ms-lg-5"
                      aria-label="Go to Shop page"
                      style={{
                        backgroundColor: "#0f5132",
                        width: "150px",
                        height: "50px",
                        borderRadius: "8px",
                        whiteSpace: "nowrap",
                        fontWeight: "500",
                        fontSize: "1rem",
                        padding: "0 12px",
                      }}
                    >
                      <span className="d-flex align-items-center flex-row flex-nowrap">
                        Shop Now
                        <FontAwesomeIcon
                          icon={faArrowRightLong}
                          className="ms-2 mt-1"
                          aria-hidden="true"
                        />
                      </span>
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
                          className="position-absolute end-0 btn d-flex mt-2 rounded px-2 cart-cart product-label text-light me-2"
                          style={{ backgroundColor: labelColor }}
                        >
                          {data.label || "label"}
                        </button>

                        <Link to={`/${url.productDetails}`}>
                          <img
                            src={`http://147.93.45.171:1600/src/image/${data.image}`}
                            className="w-100 h-100 object-fit-cover border-0 image-watch"
                            style={{ cursor: "pointer" }}
                            alt={data.name || "Product Image"}
                            loading="lazy"
                            width="300"
                            height="300"
                          />
                        </Link>

                        <button
                          className="position-absolute me-1 btn btn-light wishlist-button wishlist-button1 text-light btn-success-accesses"
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
                      <div className="border w-100"></div>
                      <div className="ms-3">
                        <h3 className="mt-2 mb-0 lh-base text-start text-lg-start price-row">
                          {data.store || "Product Store"}
                        </h3>
                        <h3 className="mt-0 lh-base text-start text-lg-start fw-bold price-name">
                          {data.name.split(" ").slice(0, 6).join(" ")}
                        </h3>
                        <h4 className="mt-1 lh-base text-start text-lg-start price-row">
                          SKU:{data.sku || "Product Name"}
                        </h4>
                        <div
                          className="d-flex justify-content-start justify-content-lg-start mb-2 gap-1 mt-1 flex-row"
                          style={{ fontFamily: "verdana" }}
                        >
                          <span className="me-1 price-amount">
                            {data.price || "Price"}
                          </span>
                          <strike className="text-danger-access fw-medium">
                            {data.discountPrice || "$54"}
                          </strike>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-start">No featured products available</div>
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
                    className="col-12 col-md-6 col-lg-6 border text-start rounded d-flex flex-column justify-content-center align-items-center lh-lg mt-0 customer-use"
                  >
                    <div className="d-flex flex-row align-items-center justify-content-between w-100">
                      <div className="customer-homeimage border mt-3 ms-2">
                        <img
                          src={`http://147.93.45.171:1600/src/image/${item.image}`}
                          alt={`Customer: ${item.first_name} ${item.last_name}`}
                          className="img-fluid"
                        />
                      </div>
                      <h2 className="mt-2 text-name pt-3 me-2 customer-help">
                        {item.first_name} {item.last_name}
                      </h2>
                    </div>

                    <span className="ms-lg-0 ms-xl-3 ms-xxl-3 me-1">
                      {item.notes}
                    </span>

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
                <div className="text-center mt-0">No reviews available.</div>
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
                            className="position-absolute end-0 btn d-flex mt-2 rounded px-2 cart-cart product-label text-light me-2"
                            style={{ backgroundColor: labelColor }}
                          >
                            {data.label}
                          </button>
                        )}

                        <Link to={`/${url.productDetails}`}>
                          <img
                            src={`http://147.93.45.171:1600/src/image/${data.image}`}
                            className="w-100 h-100 object-fit-cover border-0 image-watch"
                            style={{ cursor: "pointer" }}
                            alt={data.name || "Product Image"}
                            loading="lazy"
                            width="300"
                            height="300"
                          />
                        </Link>

                        <button
                          className="position-absolute me-1 btn btn-light wishlist-button wishlist-button1 text-light btn-success-accesses"
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
                      <div className="border w-100"></div>
                      <div className="ms-3">
                        <h3 className="mt-2 mb-0 lh-base text-start text-lg-start price-row">
                          {data.store || "Product Store"}
                        </h3>
                        <h4 className="mt-0 lh-base text-start text-lg-start fw-bold price-name">
                          {data.name.split(" ").slice(0, 6).join(" ")}
                        </h4>
                        <h4 className="mt-1 lh-base text-start text-lg-start price-row">
                          SKU:{data.sku || "Product Name"}
                        </h4>
                        <div
                          className="d-flex justify-content-start justify-content-lg-start mb-2 gap-1 mt-1 flex-row"
                          style={{ fontFamily: "verdana" }}
                        >
                          <span className="me-1 price-amount">
                            {data.price || "Price"}
                          </span>
                          <strike className="text-danger-access fw-medium">
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
                    className="col-12 col-lg-3 col-md-6 text-center border rounded feature-watch"
                    key={index}
                  >
                    <div className="feature-box rounded-0 position-relative rounded-1">
                      {data.label && (
                        <button
                          className="position-absolute end-0 btn d-flex mt-2 rounded px-2 cart-cart product-label text-light"
                          style={{ backgroundColor: labelColor }}
                        >
                          {data.label}
                        </button>
                      )}

                      <Link to={`/${url.productDetails}`}>
                        <img
                          src={`http://147.93.45.171:1600/src/image/${data.image}`}
                          className="w-100 h-100 object-fit-cover border-0 image-watch"
                          style={{ cursor: "pointer" }}
                          alt={data.name || "Product Image"}
                          loading="lazy"
                          width="300"
                          height="300"
                        />
                      </Link>

                      <button
                        className="position-absolute me-1 btn btn-light wishlist-button wishlist-button1 text-light btn-success-accesses"
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
                    <div className="border w-100"></div>
                    <div className="ms-3">
                      <h3 className="mt-2 mb-0 lh-base text-start text-lg-start price-row">
                        {data.store || "Product Store"}
                      </h3>
                      <h4 className="mt-0 lh-base text-start text-lg-start fw-bold price-name">
                        {data.name.split(" ").slice(0, 6).join(" ")}
                      </h4>
                      <h4 className="mt-1 lh-base text-start text-lg-start price-row">
                        SKU:{data.sku || "Product Name"}
                      </h4>
                      <div
                        className="d-flex justify-content-start justify-content-lg-start mb-2 gap-1 mt-1 flex-row"
                        style={{ fontFamily: "verdana" }}
                      >
                        <span className="me-1 price-amount">
                          {data.price || "Price"}
                        </span>
                        <strike className="text-danger-access fw-medium">
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
      {totalVisits !== null}
      {shouldShowCookie && (
        <div className="container-fluid">
          <div className="container">
            <div className="row theme-allow cart-cart">
              {cookieData.map((data, key) => {
                const cardStyle = {
                  backgroundColor: data.backgroundColor,
                  color: data.textColor,
                  ...(data.style === "Minimal" && {
                    width: "388px",
                    height: "135px",
                    marginLeft: "2px",
                  }),
                };

                return (
                  <div
                    key={key}
                    className="col-12 col-lg-12 col-md-12 border d-flex justify-content-center gap-5 align-items-center"
                    style={cardStyle}
                  >
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <span
                        className={
                          data.style === "Full Width"
                            ? "message-cookie ms-1"
                            : ""
                        }
                      >
                        {data.message}
                      </span>
                      <button
                        className={`btn btn-dark d-flex cart-cart allow-site mt-1 button-cook mb-2 mt-2 btn-outline-light ${
                          data.style === "Full Width"
                            ? "button-cook-position"
                            : ""
                        }`}
                        onClick={() => handleCookieAccept(data)}
                      >
                        {data.button_text}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div className="container-fluid full-height d-flex justify-content-center align-items-center">
        <div className="container">
          <div className="row mt-lg-4">
            <div className="col-12 d-flex justify-content-center">
              <div className="custom-container text-center-custom lorem-home h-auto pb-4">
                <h2
                  className="fw-normal fs-1 mt-4 text-center"
                  id="faq-heading"
                >
                  FAQ's
                </h2>

                <section aria-labelledby="faq-heading">
                  {Array.isArray(faqs) && faqs.length > 0 ? (
                    faqs.map((item, index) => (
                      <div
                        key={index}
                        className="ms-lg-3 me-2 ms-2 mt-4 rounded-2 border d-flex flex-column h-auto position-relative"
                      >
                        <div className="d-flex align-items-center">
                          <h3
                            className="fs-4 cart-cart mb-0 text-start ms-0 faq-typo p-2 fw-normal ms-md-0"
                            id={`faq-${index}-question`}
                          >
                            {item.question}
                          </h3>

                          <button
                            className="custom-button1 border rounded py-2 ms-2 px-2 bg-success text-light"
                            onClick={() => faqsAnswer(index)}
                            aria-expanded={activeIndex === index}
                            aria-controls={`faq-${index}-answer`}
                          >
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              className={`fs-2 ${
                                activeIndex === index ? "rotate" : ""
                              }`}
                              aria-hidden="true"
                            />
                            <span className="visually-hidden">
                              {activeIndex === index
                                ? `Collapse answer for FAQ ${index + 1}`
                                : `Expand answer for FAQ ${index + 1}`}
                            </span>
                          </button>
                        </div>

                        {activeIndex === index && (
                          <div
                            id={`faq-${index}-answer`}
                            role="region"
                            aria-labelledby={`faq-${index}-question`}
                            className="mt-lg-0 ms-2 text-start cart-cart mt-1"
                          >
                            {item.answer}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div>Loading FAQs…</div>
                  )}
                </section>
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
                  className="col-12 col-xxl-4 col-lg-4 col-md-4 custom-height3 border mb-3 d-flex flex-column align-items-center text-center latest-read ms-md-3 mt-md-2"
                >
                  <img
                    src={`http://147.93.45.171:1600/src/image/${post.image}`}
                    alt={
                      post.title
                        ? `Image for ${post.title}`
                        : `Blog image ${index + 1}`
                    }
                    width="150"
                    height="150"
                    loading="lazy"
                    className="img-fluid"
                    style={{ objectFit: "cover", aspectRatio: "1 / 1" }}
                  />

                  <div className="latest-moree">
                    <h3 className="fw-medium fs-4 mt-2 lh-base text-start ms-2 ms-lg-2">
                      {post.name.split(" ").slice(0, 8).join(" ")}
                    </h3>

                    <div className="text-dark text-start mt-0 px-lg-2 px-2">
                      {post.description.split(" ").slice(0, 27).join(" ")}
                    </div>

                    <div className="d-flex justify-content-center w-100 align-items-center">
                      <Link
                        to={`/blog-details/${post.id}`}
                        className="btn btn-success-accesses rounded text-light mt-0 more-button d-flex align-items-center justify-content-center w-auto"
                        aria-label={`Read full article about ${post.name}`}
                      >
                        <span className="visually-hidden">
                          Read full article about{" "}
                        </span>
                        {post.name.split(" ").slice(0, 2).join(" ")}
                        <span className="visually-hidden">article</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-start">Loading blogs...</div>
            )}
          </div>

          <div className="pagination d-flex justify-content-center flex-row flex-nowrap mt-1">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="mt-2 me-2 text-success-accessible"
              style={{
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
              onClick={currentPage === 1 ? undefined : goToPreviousPage}
            />

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`btn ${
                  currentPage === i + 1
                    ? "btn-success-accesses d-flex paginate align-items-center justify-content-center"
                    : "paginate btn-secondary d-flex justify-content-center align-items-center"
                } mx-2`}
              >
                {i + 1}
              </button>
            ))}

            <FontAwesomeIcon
              icon={faArrowRight}
              className="mt-2 text-success-accessible"
              style={{
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
              onClick={currentPage === totalPages ? undefined : goToNextPage}
            />
          </div>
        </div>
      </div>
      <div className="container-fluid bg-light py-4 mt-4">
        <div className="container cart-cart ">
          <div className="row text-center d-flex w-1001 flex-lg-nowrap flex-wrap flex-row align-items-start">
            <div className="col-6 col-lg-3 d-flex align-items-center justify-content-start mb-3 mb-lg-0">
              <div className="border bg-body px-2 py-1 rounded me-2">
                <img
                  src={Shipping}
                  alt="Free Shipping"
                  width="47"
                  className="me-2 shipping-image"
                />
              </div>

              <h3 className="mt-2 mt-lg-0 shipping-free wrap-securp">
                Free Shipping
              </h3>
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

              <h3 className="mt-2 mt-lg-0 shipping-free wrap-secure">
                Easy Returns
              </h3>
            </div>

            <div className="col-6 col-lg-3 d-flex align-items-center justify-content-start mb-3 mb-lg-0 mt-md-3 mt-lg-0">
              <div className="border bg-body px-2 py-1 rounded me-2 ms-md-0 ms-lg-0">
                <img
                  src={Payments}
                  alt="Free Shipping"
                  width="47"
                  className="me-2 shipping-image"
                />
              </div>
              <h3 className="mt-2 mt-lg-0 shipping-free">
                <span className="text-start d-flex flex-row flex-nowrap wrap-secure">
                  Secure Payment
                </span>
              </h3>
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
              <h3 className="mt-2 mt-lg-0 shipping-free wrap-secure">
                24/7 Support
              </h3>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid">
        <div className="container">
          <div className="row m-auto">
            <div className="ad-container m-0">
              {(() => {
                const footerAd = ads.find(
                  (data) =>
                    data.location === "Footer(before)" &&
                    new Date(data.expired) > new Date() &&
                    data.status !== "pending"
                );
                if (!footerAd) return null;

                const cardClass =
                  footerAd.ads_size === "full-width"
                    ? "ad-card full-width-card"
                    : "ad-card";

                return (
                  <div className="ad-card-container">
                    <div className={cardClass}>
                      <picture className="ad-picture">
                        {footerAd.mobileImage && (
                          <source
                            media="(max-width: 767px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.mobileImage}`}
                          />
                        )}
                        {footerAd.desktopImage && (
                          <source
                            media="(min-width: 768px) and (max-width: 991px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.desktopImage}`}
                          />
                        )}
                        <img
                          src={`http://147.93.45.171:1600/src/image/${footerAd.image}`}
                          alt="Advertisement"
                          className="ad-img"
                        />
                      </picture>
                      <div className="ad-overlay">
                        <div className="ad-overlay-top">
                          <button className="ad-button btn btn-success-accesses d-flex cart-cart1">
                            <Link to="/shop" className="ad-link">
                              {footerAd.button}
                            </Link>
                          </button>
                        </div>
                        <div className="ad-overlay-bottom cart-cart">
                          <h3 className="ad-title">{footerAd.title}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
      <footer className="footer pt-4 pb-4 cart-cart mt-4">
        <div className="container text-center text-md-left">
          <div className="row footer-lyte">
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 mx-auto mt-lg-3 mt-0 d-flex flex-column text-start ms-0">
              <img
                src={Tonic}
                alt="Tonic"
                width="190"
                height="190"
                className="img-fluid mb-3"
                style={{ maxWidth: "190px" }}
                loading="lazy"
              />
              <h2 className="mb-2 about-blog">About Us</h2>
              <ul className="text-start lh-lg footer-list ps-0">
                <li>
                  We assert that our online pharmacy, RxTonic.com, complies with
                  all local legal requirements while delivering healthcare
                  services over the internet platform. To provide our consumers
                  the finest pharmaceutical care possible, all pharmaceutical
                  firms and drug manufacturers have accredited facilities and
                  trained pharmacists on staff.
                </li>
              </ul>
            </div>

            <div className="col-12 col-md-6 col-lg-4 mt-md-5 pt-md-2 mt-lg-0 pt-lg-0">
              <div className="d-flex flex-row flex-lg-nowrap w-100 gap-2 mt-lg-5 pt-lg-4">
                <div className="text-start">
                  <h2 className="mb-2 pb-0 about-blog">Company</h2>
                  <ul className="lh-lg footer-list p-0">
                    <li>
                      <Link to="/about">About Us</Link>
                    </li>
                    <li>
                      <Link to="/blog">Blog</Link>
                    </li>
                    <li>
                      <Link>Payment Security</Link>
                    </li>
                    <li>
                      <Link>Affiliate Marketing</Link>
                    </li>
                  </ul>
                </div>

                <div className="text-start ms-5 ps-5 ps-lg-0">
                  <h2 className="mb-2 pb-0 about-blog">Help?</h2>
                  <ul className="lh-lg footer-list p-0">
                    <li>
                      <Link to="/faqs" className="text-decoration-none">
                        FAQ's
                      </Link>
                    </li>
                    <li>
                      <Link className="text-decoration-none" to="/sitemap">
                        Sitemap
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact-us" className="text-decoration-none">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3 col-xl-3 mx-auto mt-lg-2 mt-0 ms-lg-5 mt-lg-5 pt-lg-4 pt-1 ms-0 footer-list">
              <h2 className="mb-lg-3 mb-3 text-start about-blog">
                Sign Up for Newsletter
              </h2>
              <form className="d-flex flex-row flex-nowrap">
                <div className="d-flex flex-column justify-content-start">
                  <input
                    type="email"
                    placeholder="Email"
                    className="form-control me-2 py-4 cart-cart1"
                    aria-label="Email address"
                    name="email"
                    value={email}
                    onChange={onInputChange}
                  />
                  {errors.email && (
                    <small className="text-danger-access text-start cart-cart mt-1">
                      {errors.email}
                    </small>
                  )}
                </div>
                <button
                  className="btn btn-success-accesses d-flex cart-cart1 py-4 me-0 ms-1"
                  type="submit"
                  onClick={newsSubmit}
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <hr className="my-4 me-3" />

          <div className="row align-items-center footer-lyte1">
            <div className="col-md-6 col-lg-7 col-12 text-start">
              <div className="text-md-start text-lg-start mb-0">
                © {new Date().getFullYear()} Copyright RxLYTE. All rights
                reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="container-fluid">
        <div className="container">
          <div className="row m-auto">
            <div className="ad-container m-0">
              {(() => {
                const footerAd = ads.find(
                  (data) =>
                    data.location === "Footer(after)" &&
                    new Date(data.expired) > new Date() &&
                    data.status !== "pending"
                );
                if (!footerAd) return null;

                const cardClass =
                  footerAd.ads_size === "full-width"
                    ? "ad-card full-width-card"
                    : "ad-card";

                return (
                  <div className="ad-card-container mb-2">
                    <div className={cardClass}>
                      <picture className="ad-picture">
                        {footerAd.mobileImage && (
                          <source
                            media="(max-width: 767px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.mobileImage}`}
                          />
                        )}
                        {footerAd.desktopImage && (
                          <source
                            media="(min-width: 768px) and (max-width: 991px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.desktopImage}`}
                          />
                        )}
                        <img
                          src={`http://147.93.45.171:1600/src/image/${footerAd.image}`}
                          alt="Advertisement"
                          className="ad-img"
                        />
                      </picture>
                      <div className="ad-overlay">
                        <div className="ad-overlay-top">
                          <button className="ad-button btn btn-success-accesses d-flex cart-cart1">
                            <Link to="/shop" className="ad-link">
                              {footerAd.button}
                            </Link>
                          </button>
                        </div>
                        <div className="ad-overlay-bottom cart-cart">
                          <h3 className="ad-title">{footerAd.title}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;
