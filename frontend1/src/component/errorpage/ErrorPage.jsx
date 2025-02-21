import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./ErrorPage.css";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
import Profile from "../../assets/image.webp";
import Hamburger from "../../assets/hamburger.svg";
import Cart from "../../assets/Cart.svg";
import UserContext from "../../context/UserContext";
import axios from "axios";
import Page from "../../assets/pagen.webp";
import Close from "../../assets/Close.webp";

function ErrorPage() {
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
  cartdata();

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
    productDetails: "product/details",
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

  const [errorImage, setErrorImage] = useState(
    localStorage.getItem("errorPageImage") || Page
  );

  useEffect(() => {
    const storedImage = localStorage.getItem("errorPageImage");
    if (storedImage) {
      setErrorImage(storedImage);
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

  let [cart, setCart] = useState("");

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/get-theme-breadcrumb"
        );
        setCart(response.data);
      } catch (error) {
        console.error("Error fetching breadcrumb settings:", error);
      }
    };
    fetchBreadcrumbData();
  }, []);

  let [about, setAbout] = useState("");

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/get-theme-breadcrumb"
        );
        setAbout(response.data);
      } catch (error) {
        console.error("Error fetching breadcrumb settings:", error);
      }
    };
    fetchBreadcrumbData();
  }, []);

  return (
    <>
      <div
        className="container"
        id="container-custom"
        style={{
          backgroundColor:
            about?.background_color ||
            (about?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: about?.background_image
            ? `url(http://89.116.170.231:1600/src/image/${about.background_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: about?.breadcrumb_height
            ? `${about.breadcrumb_height}px`
            : "190px",
        }}
      >
        <div className="container-custom ms-2 pt-lg-4 mt-lg-0 mt-5 pt-5 mb-auto mt-auto">
          <header className="d-flex flex-wrap justify-content-between py-2 mb-5 border-bottom bg-body rounded-2 container-custom1">
            <nav className="navbar navbar-expand-lg navbar-light w-100 d-flex flex-row flex-nowrap">
              <div className="container">
                <Link className="navbar-brand d-non d-lg-block" to="/">
                  <img
                    src={logoUrl || image1}
                    alt="Tonic Logo"
                    className="img-fluid"
                    style={{ height: `${logoHeight}px`, width: "200px" }}
                  />
                </Link>

                <button
                  type="button"
                  className="navbar-toggler py-0 px-1 d-lg-none"
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
                  <Link to={`/${url.login}`} className="nav-link">
                    <img
                      src={Profile}
                      alt="Profile"
                      className="profiles img-fluid me-3"
                    />
                  </Link>

                  <Link
                    to={`/${url.cart}`}
                    className="nav-link d-flex nav-properties1"
                  >
                    <img
                      src={Cart}
                      alt="Cart"
                      className="img-fluid profiles1 mt-1"
                    />
                    <div className="addcarts ms-1 ps-1 pt-lg-1">{count}</div>
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

          <main className="container mt-5 cart-cart">
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
                      Error
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
                    <ol className="breadcrumb d-flex flex-wrap gap-0">
                      <li className="breadcrumb-item navbar-item fw-medium">
                        <Link target="_blank" to="/" className="text-dark">
                          Home
                        </Link>
                      </li>
                      <li className="breadcrumb-item navbar-item fw-medium text-dark">
                        Error
                      </li>
                    </ol>
                  </nav>
                </>
              )}
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid d-flex justify-content-center align-items-start align-items-md-start align-items-lg-start align-items-xl-start align-items-xxl-start">
        <div className="container text-center">
          <div className="row">
            <div className="col-12 d-flex flex-column justify-content-center align-items-center mt-0">
              <img src={errorImage} alt="RxLYTE" className="img-fluid" />

              <h3 className="opps cart-cart fw-medium">
                Oops! The page you requested was not found!
              </h3>
              <p className="sorry-para text-dark cart-cart">
                Sorry, but the page you are looking for doesn’t exist!
              </p>

              <button className="btn btn-success d-flex py-4 cart-cart1 rounded-0">
                <Link to="/" className="text-light text-decoration-none">
                  Back to Home
                </Link>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid bg-dark text-light py-4 mt-4 mb-0 d-flex justify-content-center align-items-center lorem-contact min-vw-100 lorem-error">
        <footer className="footer-homepage">
          <div className="container text-center d-flex justify-content-center">
            <div className="row justify-content-center">
              <div className="col-lg-3 col-md-6 col-12 d-flex flex-column align-items-start mb-4 list-contact2">
                <img
                  src={Tonic}
                  alt="About Us"
                  className="img-fluid mb-2 me-5 pe-5 about-rx"
                />
                <h4 className="me-5 pe-5">About Us</h4>
                <p className="mt-2 pharmacy2 text-start lh-lg">
                  We assert that our online pharmacy, RxTonic.com, complies with
                  all local legal requirements while delivering healthcare
                  services over the internet platform. To provide our consumers
                  the finest pharmaceutical care possible,all pharmaceutical
                  firms and drug manufacturers have accredited facilities and
                  trained pharmacists on staff.
                </p>
              </div>

              <div className="col-lg-3 col-md-6 col-6 d-flex flex-column align-items-lg-center mb-lg-4 list-contact mt-md-4 pt-md-3 mt-lg-0 pt-lg-0 mt-xxl-1 pt-xxl-0 list-contact3">
                <h4 className="mt-lg-5 mt-md-2 company-footer">Company</h4>
                <ul className="mt-2 lh-lg text-start pharmacy3 ms-lg-0 ms-md-5 pharmacy-about pharmacy-list1 pharmacy-link">
                  <li className="pharmacy2">
                    <Link to="/about" className="text-light">
                      About Us
                    </Link>
                  </li>

                  <li className="pharmacy2">
                    <Link to="/blog" className="text-light">
                      Blog
                    </Link>
                  </li>

                  <li className="pharmacy2">
                    <Link to="#" className="text-light">
                      Payment Security
                    </Link>
                  </li>

                  <li className="pharmacy2">
                    <Link to="#" className="text-light">
                      Affiliate Marketing
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 col-6 d-flex flex-column align-items-lg-center align-items-start mb-lg-4 list-contact list-contact1 help-sitemap">
                <h4 className="mt-lg-4 pt-lg-4 mt-3 mt-sm-0 mt-md-0">Help?</h4>
                <ul className="mt-2 lh-lg text-start me-4 pe-2 pharmacy3">
                  <li className="pharmacy2">
                    <Link to="/faqs" className="text-light">
                      FAQ
                    </Link>
                  </li>
                  <li className="pharmacy2">
                    <Link to="#" className="text-light">
                      Sitemap
                    </Link>
                  </li>
                  <li className="pharmacy2">
                    <Link to="/contact-us" className="text-light">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="col-lg-3 col-md-6 d-flex flex-column align-items-lg-center mb-4 signup-news mt-lg-1">
                <h4
                  className="mb-2 mt-lg-4 pt-lg-3 me-sm-4"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Sign Up for Newsletter
                </h4>
                <p className="ps-lg-0 ps-xl-3 ps-xxl-1 me-2 text-lg-start text-start pharmacy2 lh-lg">
                  Get updates by subscribing to our weekly newsletter.
                </p>
                <div className="d-flex flex-row signup-text">
                  <input
                    type="email"
                    placeholder="Email address"
                    className="form-control mb-2 py-4 ms-lg-2 rounded-0 cart-cart"
                  />
                  <button className="btn btn-success d-flex px-lg-2 py-4 me-0 ms-1 rounded-0 cart-cart">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default ErrorPage;
