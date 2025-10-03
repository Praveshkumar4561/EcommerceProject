import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Sitemap.css";
import Tonic from "../../assets/Tonic.svg";
import Hamburger from "../../assets/hamburger.svg";
import UserContext from "../../context/UserContext";
import Close from "../../assets/Close.webp";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import { Helmet } from "react-helmet-async";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Sitemap() {
  let { count, setCount } = useContext(UserContext);

  useEffect(() => {
    const cartdata = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/allcartdata"
        );
        setCount(response.data.length);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    cartdata();
  }, []);

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
      .get("https://demo.webriefly.com/api/get-theme-logo")
      .then((response) => {
        if (response.data) {
          setLogoUrl(
            `https://demo.webriefly.com/uploads/${response.data.logo_url}`
          );
          setLogoHeight(response.data.logo_height || "45");
        }
      })
      .catch((error) => console.error("Error fetching logo:", error));
  }, []);

  let [cart, setCart] = useState("");
  let [about, setAbout] = useState("");

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/get-theme-breadcrumb"
        );
        setAbout(response.data);
        setCart(response.data);
      } catch (error) {
        console.error("Error fetching breadcrumb settings:", error);
      }
    };
    fetchBreadcrumbData();
  }, []);

  let [count6, setCount6] = useState(0);

  useEffect(() => {
    const wishlistdata = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/wishlistdata"
        );
        setCount6(response.data.length);
      } catch (error) {
        console.error("Error fetching wishlist data:", error);
      }
    };
    wishlistdata();
  }, []);

  const [detail, setDetail] = useState([]);
  const [showProducts, setShowProducts] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/productpagedata"
        );
        setDetail(response.data);
      } catch (error) {
        console.error("Error occurred", error);
      }
    };
    fetchProductData();
  }, []);

  let currentProducts = detail;
  let totalPages = 1;

  if (detail.length >= 500) {
    totalPages = Math.ceil(detail.length / productsPerPage);
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    currentProducts = detail.slice(indexOfFirstProduct, indexOfLastProduct);
  }

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const toggleProducts = () => {
    if (showProducts) {
      setShowProducts(false);
    } else {
      setShowProducts(true);
      setShowBlogs(false);
    }
  };

  const [user, setUser] = useState([]);
  const [showBlogs, setShowBlogs] = useState(false);
  const [currentPage1, setCurrentPage1] = useState(1);
  const productsPerPage1 = 6;

  useEffect(() => {
    const alldata = async () => {
      try {
        let response = await axios.get(
          "https://demo.webriefly.com/api/blogpostdata"
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    alldata();
  }, []);

  let currentBlogs = user;
  let totalPages1 = 1;
  if (user.length >= 500) {
    totalPages1 = Math.ceil(user.length / productsPerPage1);
    const indexOfLastBlog = currentPage1 * productsPerPage1;
    const indexOfFirstBlog = indexOfLastBlog - productsPerPage1;
    currentBlogs = user.slice(indexOfFirstBlog, indexOfLastBlog);
  }

  const handlePageClick1 = (pageNumber) => {
    setCurrentPage1(pageNumber);
  };

  const handlePrev1 = () => {
    if (currentPage1 > 1) setCurrentPage1(currentPage1 - 1);
  };

  const handleNext1 = () => {
    if (currentPage1 < totalPages1) setCurrentPage1(currentPage1 + 1);
  };

  const toggleBlogs = () => {
    if (showBlogs) {
      setShowBlogs(false);
    } else {
      setShowBlogs(true);
      setShowProducts(false);
    }
  };

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
      await axios.post("https://demo.webriefly.com/api/newsletterpost", letter);
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

  return (
    <>
      <Helmet>
        <title>Sitemap - RxLyte</title>
        <meta
          name="description"
          content="Explore the Sitemap of YourSiteName to easily navigate our website. This page is optimized for SEO and is fully indexable."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://demo.webriefly.com/sitemap" />
      </Helmet>

      <script type="application/ld+json">
        {`
            {
              "@context": "https://schema.org",
              "@type": "SiteNavigationElement",
              "name": "Sitemap",
              "url": "http://demo.webriefly.com/sitemap",
              "hasPart": [
                {"@type": "SiteNavigationElement", "name": "Home", "url": "http://demo.webriefly.com/"},
                {"@type": "SiteNavigationElement", "name": "About", "url": "http://demo.webriefly.com/about"},
                {"@type": "SiteNavigationElement", "name": "Shop", "url": "http://demo.webriefly.com/shop"},
                {"@type": "SiteNavigationElement", "name": "Blog", "url": "http://demo.webriefly.com/blog"},
                {"@type": "SiteNavigationElement", "name": "Product Details", "url": "http://demo.webriefly.com/product-details"},
                {"@type": "SiteNavigationElement", "name": "Product Categories", "url": "http://demo.webriefly.com/product-categories"},
                {"@type": "SiteNavigationElement", "name": "Cart", "url": "http://demo.webriefly.com/cart"},
                {"@type": "SiteNavigationElement", "name": "Wishlist", "url": "http://demo.webriefly.com/wishlist"},
                {"@type": "SiteNavigationElement", "name": "Contact Us", "url": "http://demo.webriefly.com/contact-us"},
                {"@type": "SiteNavigationElement", "name": "FAQs", "url": "http://demo.webriefly.com/faqs"},
                {"@type": "SiteNavigationElement", "name": "Privacy Policy", "url": "http://demo.webriefly.com/privacy-policy"},
                {"@type": "SiteNavigationElement", "name": "Medicine Policy", "url": "http://demo.webriefly.com/medicine-policy"},
                {"@type": "SiteNavigationElement", "name": "Terms & Conditions", "url": "http://demo.webriefly.com/terms-condition"},
                {"@type": "SiteNavigationElement", "name": "Sitemap", "url": "http://demo.webriefly.com/sitemap"}
              ]
            }
          `}
      </script>

      <div
        className="container"
        id="container-customx"
        style={{
          backgroundColor:
            about?.background_color ||
            (about?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: about?.background_image
            ? `url(https://demo.webriefly.com/uploads/${about.background_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: about?.breadcrumb_height
            ? `${about.breadcrumb_height}px`
            : "190px",
        }}
      >
        <div className="container-custom ms-2 pt-lg-4 mt-lg-0 mt-5 pt-5 mb-auto mt-auto me-lg-0 me-2">
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

                <div className="navbar-icons1 d-sm-flex">
                  <Link
                    to={`/${url.wishlist}`}
                    className="position-relative text-decoration-none me-3 mt-0 wishlist-home"
                  >
                    <span className="count-badge mt-2 mt-lg-1 pt-0 mt-md-2">
                      {count6}
                    </span>
                    <img
                      src={Wishlists}
                      alt="RxLYTE"
                      className="profiles1 img-fluid mt-1 navbar-shop cart-image1"
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
                      className="profiles1 img-fluid me-3 mt-1 navbar-shop cart-image2"
                    />
                  </Link>

                  <Link
                    to={`/${url.cart}`}
                    className="nav-link d-flex nav-properties1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={Carthome}
                      alt="Cart"
                      className="img-fluid profiles1 mt-1 pt-0 navbar-shop cart-image"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="addcarts ps-2 pt-lg-0 mt-lg-0 count-badge1">
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

          <main className="container mt-5 cart-cart container-bread">
            {about?.enable_breadcrumb === "yes" &&
              about?.breadcrumb_style !== "none" && (
                <>
                  {about?.hide_title !== "yes" && (
                    <h1
                      className={`fw-medium mb-3 text-center container-contact fs-2 container-style ${
                        about?.breadcrumb_style === "without title"
                          ? "d-none"
                          : ""
                      }`}
                    >
                      Sitemap
                    </h1>
                  )}

                  <nav
                    aria-label="breadcrumb"
                    id="container-contact1"
                    className={`ms-5 ps-3 ms-lg-0 ps-lg-0 ${
                      about?.breadcrumb_style === "without title" ||
                      about?.breadcrumb_style === "align start"
                        ? "d-flex justify-content-start align-items-center w-50"
                        : "d-flex justify-content-center align-items-center"
                    }`}
                  >
                    <ol className="breadcrumb d-flex flex-nowrap flex-row gap-0 overflow-hidden pe-4 pe-lg-0 pe-md-0">
                      <li className="breadcrumb-item navbar-item fw-medium p-0">
                        <Link to="/" className="text-dark">
                          Home
                        </Link>
                      </li>
                      <li className="breadcrumb-item navbar-item fw-medium text-dark p-0">
                        Sitemap
                      </li>
                    </ol>
                  </nav>
                </>
              )}
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid">
        <div className="container ms-lg-2 m-0">
          <h2 className="sitemap-name1 mt-4 cart-cart1">Pages</h2>
          <div className="border sitemap-link1"></div>
          <div className="row gap-0 p-0 mt-2 sitemap-link d-flex flex-md-row align-items-md-start flex-md-nowrap">
            <div className="col-lg-4 col-md-4 col-12 d-flex flex-column align-items-md-start align-items-sm-start">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link onClick={toggleProducts}>Shop</Link>
              <Link onClick={toggleBlogs}>Blog</Link>
              <Link onClick={toggleProducts}>Product Details</Link>
            </div>
            <div className="col-lg-4 col-md-4 col-12 d-flex flex-column align-items-sm-start  align-items-md-start">
              <Link to="/product-categories">Product Categories</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/contact-us">Contact Us</Link>
              <Link to="/faqs">FAQ's</Link>
            </div>
            <div className="col-lg-4 col-md-4 col-12 d-flex flex-column align-items-sm-start align-items-md-start">
              <Link to="/privacy-policy">Privacy Policy</Link>
              <Link to="/medicine-policy">Medicine Policy</Link>
              <Link to="/terms-condition">Terms & Conditions</Link>
              <Link to="/sitemap">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>

      {showProducts && (
        <>
          <div className="container-fluid">
            <div className="container cart-cart">
              {Array.isArray(detail) && detail.length > 0 ? (
                <div className="row gap-0 mt-2">
                  {currentProducts.map((data, key) => (
                    <div
                      className="col-lg-4 col-md-4 col-12 sitemap-images sitemap-images1 rounded d-flex flex-row flex-nowrap flex-column"
                      key={key}
                    >
                      <li className="lh-base text-start">
                        <Link to={`/${url.productDetails}`}>{data.name}</Link>
                      </li>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No products available.</p>
              )}
            </div>

            {detail.length >= 500 && (
              <div className="d-flex gap-2 justify-content-center mt-3 flex-row flex-nowrap">
                <button
                  className="btn btn-success-product d-flex cart-cart1 prev-site p-0 m-0"
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                >
                  <FontAwesomeIcon
                    icon={faChevronLeft}
                    className="font-class"
                  />
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`btn btn-success-product d-flex prev-site1 ${
                      currentPage === index + 1 ? "active" : ""
                    }`}
                    onClick={() => handlePageClick(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  className="btn btn-success-product d-flex cart-cart1 prev-site"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                >
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    className="font-class"
                  />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {showBlogs && (
        <div className="container-fluid">
          <div className="container cart-cart me-4 me-lg-0">
            {Array.isArray(user) && user.length > 0 ? (
              <div className="row gap-0 mt-3">
                {currentBlogs.map((data, key) => (
                  <div
                    className="col-lg-4 col-md-4 col-12 sitemap-images sitemap-images1 rounded d-flex flex-row flex-nowrap flex-column"
                    key={key}
                  >
                    <div className="d-flex flex-row">
                      <li className="mt-0 text-start">
                        <Link to={`/blog-details/${data.id}`}>
                          {data.name.split("").slice(0, 35).join("")}
                        </Link>
                      </li>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No blogs available.</p>
            )}
          </div>

          {user.length >= 500 && (
            <div className="d-flex gap-2 justify-content-center mt-3 flex-row flex-nowrap">
              <button
                className="btn btn-success-product d-flex cart-cart1 prev-site"
                onClick={handlePrev1}
                disabled={currentPage1 === 1}
              >
                <FontAwesomeIcon icon={faChevronLeft} className="font-class" />
              </button>
              {Array.from({ length: totalPages1 }, (_, index) => (
                <button
                  key={index}
                  className={`btn btn-success-product d-flex prev-site1 ${
                    currentPage1 === index + 1 ? "active" : ""
                  }`}
                  onClick={() => handlePageClick1(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
              <button
                className="btn btn-success-product d-flex cart-cart1 prev-site"
                onClick={handleNext1}
                disabled={currentPage1 === totalPages1}
              >
                <FontAwesomeIcon icon={faChevronRight} className="font-class" />
              </button>
            </div>
          )}
        </div>
      )}

      <footer className="bg-dark text-white pt-4 pb-4 cart-cart mt-5 sitemap-footer">
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
                  <h2 className="mb-2 pb-0 about-blog">Help?</h2>
                  <ul className="lh-lg footer-list p-0">
                    <li>
                      <Link
                        to="/faqs"
                        className="text-white text-decoration-none"
                      >
                        FAQ's
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
                    <small className="text-danger text-start cart-cart mt-1">
                      {errors.email}
                    </small>
                  )}
                </div>
                <button
                  className="btn btn-success-product d-flex cart-cart1 py-4 me-0 ms-1"
                  type="submit"
                  onClick={newsSubmit}
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
                © {new Date().getFullYear()} Copyright RxLYTE. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Sitemap;
