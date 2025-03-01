import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Privacy.css";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";

import Hamburger from "../../assets/hamburger.svg";

import Close from "../../assets/Close.webp";
import UserContext from "../../context/UserContext";
import axios from "axios";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";

function Privacy() {
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

  return (
    <>
      <div
        className="container"
        id="container-customx"
        style={{
          backgroundColor:
            cart?.background_color ||
            (cart?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: cart?.background_image
            ? `url(http://89.116.170.231:1600/src/image/${cart.background_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: cart?.breadcrumb_height
            ? `${cart.breadcrumb_height}px`
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
                    <span className="count-badge mt-1">{count6}</span>
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
                  >
                    <img
                      src={Carthome}
                      alt="Cart"
                      className="img-fluid profiles1 mt-1 pt-0 navbar-shop cart-image"
                    />
                    <div className="addcarts ms-1 ps-1 pt-lg-0 count-badge1">
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
            {cart?.enable_breadcrumb === "yes" &&
              cart?.breadcrumb_style !== "none" && (
                <>
                  {cart?.hide_title !== "yes" && (
                    <h1
                      className={`fw-medium mb-3 text-center container-contact fs-2 container-style ${
                        cart?.breadcrumb_style === "without title"
                          ? "d-none"
                          : ""
                      }`}
                    >
                      Privacy Policy
                    </h1>
                  )}

                  <nav
                    aria-label="breadcrumb"
                    id="container-contact1"
                    className={`ms-5 ps-3 ms-lg-0 ps-lg-0 ${
                      cart?.breadcrumb_style === "without title" ||
                      cart?.breadcrumb_style === "align start"
                        ? "d-flex justify-content-start align-items-center w-50"
                        : "d-flex justify-content-center align-items-center"
                    }`}
                  >
                    <ol className="breadcrumb d-flex flex-nowrap flex-row gap-0 overflow-hidden">
                      <li className="breadcrumb-item navbar-item fw-medium p-0">
                        <Link target="_blank" to="/" className="text-dark">
                          Home
                        </Link>
                      </li>
                      <li className="breadcrumb-item navbar-item fw-medium text-dark me-4 p-0">
                        Privacy
                      </li>
                    </ol>
                  </nav>
                </>
              )}
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid overflow-x-hidden position-relative">
        <div className="container ms-0 ms-lg-0 ms-md-0">
          <div className="row gap-3 mt-4 pt-3 d-flex justify-content-xxl-start justify-content-lg-center justify-content-md-center me-1 me-sm-0">
            <div className="col-12 col-md-12 col-lg-12 blog-privacy bg-light h-auto">
              <h3 className="lorem-privacy ms-2 ps-1 pt-4 text-start lorem-space fw-normal">
                Privacy Policy
              </h3>

              <div className="lorem-typo lh-lg">
                <ul className="text-start me-sm-2 ms-4">
                  <li className="mt-2 ms-0 lorem-privacy1">
                    Our customers and their privacy are the most important thing
                    to us at Rx Lyte.
                  </li>

                  <li className="mt-2 ms-0 lorem-privacy1">
                    We make sure that the information you give us when you log
                    in is well protected to keep your data safe.
                  </li>

                  <li className="mt-2 ms-0 lorem-privacy1">
                    You can be sure that this information will only be used to
                    improve your shopping experience with us.
                  </li>
                </ul>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  Personal Information We Gather{" "}
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start ms-4">
                    <li className="mt-2 ms-0 lorem-privacy1">
                      For the order to go through, we need to get some personal
                      information from you.{" "}
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 ps- pt-0 text-start lorem-space fw-normal">
                  Information about registering{" "}
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start ms-4">
                    <li className="mt-2 ms-0 lorem-privacy1">
                      When you sign up for any service that Rx Lyte offers, you
                      give us information about yourself as well.{" "}
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      This could include your name, location, ways to reach you,
                      and interests.{" "}
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  Email Address Details
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start ms-4">
                    <li className="mt-2 ms-0 lorem-privacy1">
                      In order to keep records, we may keep the text of your
                      emails, your email address, and your replies.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      These steps are taken when you choose to email us.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  What do they do with your personal data?
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start me-2 ms-4">
                    <li className="mt-2 ms-0 lorem-privacy1">
                      Our goal is to improve, manage, and grow our business by
                      using the personally identifiable information we collect.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      For our customers, this information is used to improve
                      customer service, let you know about new goods and
                      services, and make your time on our website more
                      enjoyable.{" "}
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      You can choose not to share information with our online
                      pharmacy.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      Customers can change their minds at any time if they no
                      longer want to share personal information if it is no
                      longer needed or useful.{" "}
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      Customers are in the "opt-out" group until they clearly
                      agree (opts-in) to share their information. This means
                      they do not want to share.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      We always let our customers know when a third party is
                      collecting information that can be used to find out who
                      they are.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  What Are Cookies?
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start me-2 ms-4">
                    <li className="mt-2 ms-0 lorem-privacy1">
                      Websites that you visit can make small text files called
                      cookies. Your computer browser saves them on your device.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      They do many things, such as keeping your login
                      information safe, keeping track of what you do online, and
                      helping websites give you a more personalized experience.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      These files have information in them that lets websites
                      identify your computer and learn about how you use the
                      internet.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      Please go to your browser's settings to change how cookies
                      are used.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-1 pt-0 text-start lorem-space fw-normal">
                  What We Do With The Data We Get From Cookies
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start ms-4">
                    <li className="mt-3 ms-0 lorem-privacy1">
                      We use the cookies we send to tell our customers apart and
                      give them a more unique experience.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      There are hypertext links on our site.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy1 ms-2 pt-0 text-start lorem-space fw-normal">
                  On Rx Lyte, you might find linked links that take you to other
                  websites.
                </h3>

                <div className="lorem-typo">
                  <ul className="me-2 ms-4">
                    <li className="mt-0 ms-0 lorem-privacy1">
                      If you click on these links, you might be taken to sites
                      that have different privacy practices. The Privacy Policy
                      of the site you linked to will govern your privacy after
                      you leave our site.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-1 pt-0 text-start lorem-space fw-normal">
                  Giving Your OK
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start me-2 ms-4">
                    <li className="mt-0 ms-0 lorem-privacy1">
                      You agree that your personally identifiable information
                      will be collected and used in the ways described in this
                      Privacy Policy when you use our online store and its
                      services.
                    </li>

                    <li className="mt-3 ms-0 lorem-privacy1">
                      Anytime you want, you can change your mind or remove your
                      agreement.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  Notifying People of Changes
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start me-2 ms-4">
                    <li className="mt-1 ms-0 lorem-privacy1">
                      Rx Lyte looks at the Privacy Policy from time to time and
                      makes changes to it.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      If this Privacy Statement is changed, we will post the
                      changes here and send an email to people who have agreed
                      to receive information from us.
                    </li>
                  </ul>
                </div>
              </div>
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
                  <h5 className="mb-3">Company</h5>
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
                  <h5 className="mb-3">Help?</h5>
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
                      <Link className="text-white text-decoration-none">
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

export default Privacy;
