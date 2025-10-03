import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./ContactUs.css";
import Tonic from "../../assets/Tonic.svg";
import Hamburger from "../../assets/hamburger.svg";
import Close from "../../assets/Close.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneVolume,
  faCommentDots,
  faLocationDot,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import UserContext from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import JsonLd from "../JsonLd";
import { Helmet } from "react-helmet-async";

function ContactUs() {
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

  let generateRandomNumber = () => {
    return Math.floor(Math.random() * 10) + 1;
  };

  const [captchaValid, setCaptchaValid] = useState(false);
  const [num1, setNum1] = useState(generateRandomNumber());
  const [num2, setNum2] = useState(generateRandomNumber());
  const [userAnswer, setUserAnswer] = useState("");

  const handleCaptchaChange = () => {
    if (parseInt(userAnswer) === num1 + num2) {
      setCaptchaValid(true);
      setNum1(generateRandomNumber());
      setNum2(generateRandomNumber());
      setUserAnswer("");
    } else {
      setError("Incorrect answer, please try again.");
      setCaptchaValid(false);
    }
  };

  const regenerateCaptcha = () => {
    setNum1(generateRandomNumber());
    setNum2(generateRandomNumber());
    setUserAnswer("");
    setError("");
    setCaptchaValid(false);
  };

  const [errors, setErrors] = useState({});

  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    subject: "",
    content: "",
  });
  const { name, email, address, phone, subject, content } = user;

  const handleSubmit = async (e) => {
    e.preventDefault();
    let formErrors = {};
    if (!name) formErrors.name = "Name is required";
    if (!email) formErrors.email = "Email is required";
    if (!address) formErrors.address = "Address is required";
    if (!phone) formErrors.phone = "Phone number is required";
    if (!subject) formErrors.subject = "Subject is required";
    if (!content) formErrors.content = "Message content is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      formErrors.email = "Enter a valid email address";
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (phone && !phoneRegex.test(phone)) {
      formErrors.phone = "Enter a valid 10-digit phone number";
    }
    if (!captchaValid) {
      formErrors.captcha = "Please solve the CAPTCHA";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    try {
      const response = await axios.post(
        "https://demo.webriefly.com/api/contact",
        user
      );
      if (response.status === 200) {
        setUser({
          name: "",
          email: "",
          address: "",
          phone: "",
          subject: "",
          content: "",
        });
        setCaptchaValid(false);
        setUserAnswer("");
        setErrors({});
      }
      toast.success("Contact details successfully submitted", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Contact details is not submitted", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
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

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/get-theme-breadcrumb"
        );
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

  const schemaData = {
    "@context": "http://schema.org",
    "@graph": [
      {
        "@type": "ContactPage",
        name: "RxLyte",
        url: "http://demo.webriefly.com/about",
        description:
          "RxLyte is a modern ecommerce platform offering premium healthcare products.",
        mainEntity: {
          "@type": "Organization",
          name: "RxLyte",
          url: "http://demo.webriefly.com/",
          logo: "http://demo.webriefly.com/Tonic.svg",
          description:
            "RxLyte is a trusted ecommerce store providing high-quality healthcare products.",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+1-800-654-3210",
            contactType: "customer service",
            areaServed: "US",
            availableLanguage: "English",
          },
        },
      },

      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "http://demo.webriefly.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Contact Us",
            item: "http://demo.webriefly.com/contact-us",
          },
        ],
      },
    ],
  };

  let [cookie, setCookie] = useState([]);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent) {
      return;
    }

    const cookiedata = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/cookiesalldata"
        );
        setCookie([response.data]);
      } catch (error) {
        console.error("error", error);
      }
    };
    cookiedata();
  }, []);

  const handleCookieAccept = (data) => {
    localStorage.setItem("cookieConsent", JSON.stringify(data));
    setCookie((prevCookie) =>
      prevCookie.filter((item) => item.cookie !== "yes")
    );
  };

  return (
    <>
      <JsonLd data={schemaData} />

      <Helmet>
        <title>Contact Us - Get in Touch with Rxlyte Support</title>
        <meta
          name="description"
          content="Have questions or need assistance? Contact Rxlyte's support team for quick responses. We’re here to help with orders, inquiries, and more."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://demo.webriefly.com/contact-us" />
      </Helmet>

      <div
        className="container"
        id="container-customx"
        style={{
          backgroundColor:
            cart?.background_color ||
            (cart?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: cart?.background_image
            ? `url(https://demo.webriefly.com/uploads/${cart.background_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: cart?.breadcrumb_height
            ? `${cart.breadcrumb_height}px`
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
                    <span className="count-badge mt-2 mt-lg-1 pt-0 mt-md-1">
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
                      Contact Us
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
                        <Link to="/" className="text-dark">
                          Home
                        </Link>
                      </li>
                      <li className="breadcrumb-item navbar-item fw-medium text-dark me-4 p-0">
                        Contact Us
                      </li>
                    </ol>
                  </nav>
                </>
              )}
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid d-flex justify-content-center cart-cart">
        <div className="container">
          <div className="row mt-5 pt-4 justify-content-center">
            <div className="col-12 col-md-6 query bg-light mb-3 rounded query-us">
              <div className="d-flex flex-column">
                <h2 className="text-start ps-5 ps-lg-0 ms-lg-0 mt-2 query-feel lorem-contact">
                  Feel Free to contact <br /> us for any query
                </h2>
                <div className="phone-mail d-flex align-items-center p-3 ps-0 rounded-5 bg-light mt-0">
                  <div className="rounded-border bg-success text-center text-white fs-3 d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faPhoneVolume} />
                  </div>

                  <div className="ms-3 lorem-contact">
                    <h2 className="fw-normal mb-1 text-lg-start text-start mt-1 contact-phone">
                      Phone Number
                    </h2>
                    <p className="head-office fw-normal text-dark">
                      Head office: (210) 123 451
                    </p>
                  </div>
                </div>
                <div className="phone-mail d-flex align-items-center p-3 rounded-5 ps-0 bg-light mt-0 lorem-contact">
                  <div className="rounded-border bg-success text-center text-white fs-3 d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faCommentDots} />
                  </div>
                  <div className="ms-3">
                    <h2 className="fw-normal mb-1 text-lg-start mt-1 text-start contact-phone">
                      Mail Address
                    </h2>
                    <p className="head-office fw-normal text-dark">
                      Webecyenvato12@gmail.com
                    </p>
                  </div>
                </div>
                <div className="phone-mail d-flex align-items-center p-3 rounded-5 ps-0 bg-light mt-0 lorem-contact">
                  <div className="rounded-border bg-success text-center text-white fs-3 d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faLocationDot} />
                  </div>
                  <div className="ms-3 d-flex position-relative flex-column">
                    <h2 className="fw-normal mb-1 text-lg-start mt-1 text-start contact-phone">
                      Office Address
                    </h2>
                    <p className="head-office fw-normal text-dark">
                      254 Lillian Blvd, Holbrook
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 query query2 bg-light mb-3 d-flex justify-content-center align-items-lg-center h-auto">
              <form onSubmit={handleSubmit} className="lorem-contact w-100">
                <div className="row mb-3">
                  <div className="col-12 col-md-6 d-flex flex-column align-items-center align-items-lg-center contact-name">
                    <div className="form-group text-start">
                      <label htmlFor="firstName" className="name1">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control fw-normal mt-4 py-4 lorem-contact1"
                        id="firstName"
                        placeholder="Your name"
                        name="name"
                        value={name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                        <p className="error-text text-danger">{errors.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-md-6 d-flex flex-column align-items-center  align-items-md-start contact-name">
                    <div className="form-group w-100 mt-sm-3 blackitalic text-start mt-3 mt-lg-3">
                      <label htmlFor="lastName">Email</label>
                      <input
                        type="email"
                        className="form-control mt-2 fw-normal py-4 lorem-contact1"
                        id="lastName"
                        placeholder="Your email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <p className="error-text text-danger">{errors.email}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="row mb-1 mt-0 d-flex align-items-md-start  contact-name5">
                  <div className="col-12 col-md-6 d-flex flex-column align-items-center ">
                    <div className="form-group blackitalic text-start">
                      <label htmlFor="email">Address</label>
                      <input
                        type="text"
                        className="form-control fw-normal mt-2 py-4 lorem-contact1"
                        placeholder="Your address"
                        id="email"
                        name="address"
                        value={address}
                        onChange={handleChange}
                      />
                      {errors.address && (
                        <p className="error-text text-danger">
                          {errors.address}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-md-6 d-flex flex-column align-items-center">
                    <div className="form-group blackitalic text-start contact-name">
                      <label htmlFor="phoneNumber" className="mt-3 mt-lg-0">
                        Phone
                      </label>
                      <input
                        type="number"
                        className="form-control fw-normal mt-2 py-4 lorem-contact1"
                        placeholder="Your phone"
                        id="phoneNumber"
                        name="phone"
                        value={phone}
                        onChange={handleChange}
                      />
                      {errors.phone && (
                        <p className="error-text text-danger">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-3 d-flex flex-column align-items-center lorem-contact1">
                  <div className="form-group blackitalic text-start mt-3">
                    <label htmlFor="product">Subject</label>
                    <input
                      type="text"
                      className="form-control fw-normal mt-2 py-4 lorem-contact1"
                      placeholder="Subject"
                      id="phoneNumber"
                      name="subject"
                      value={subject}
                      onChange={handleChange}
                    />
                    {errors.subject && (
                      <p className="error-text text-danger">{errors.subject}</p>
                    )}
                  </div>
                </div>

                <div className="mb-3 d-flex flex-column align-items-center lorem-contact1">
                  <div className="form-group mt-sm-0 blackitalic ms-0 ms-md-0 ms-lg-0 text-start">
                    <label htmlFor="message">Content</label>
                    <textarea
                      className="form-control fw-normal mt-2 lorem-contact1 custom-message"
                      id="message"
                      placeholder="Enter message"
                      name="content"
                      value={content}
                      onChange={handleChange}
                    >
                      {errors.content && (
                        <p className="error-text text-danger">
                          {errors.content}
                        </p>
                      )}
                    </textarea>

                    <div className="captcha-container mt-4">
                      <p className="captcha-header ms-1 mt-2 fw-light">
                        Solve this: {num1} + {num2} = ?
                      </p>
                      <div className="d-flex flex-row">
                        <input
                          type="text"
                          className="form-control captcha-input ms-1 mb-3 py-4"
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          placeholder="Your answer"
                        />
                        <button
                          type="button"
                          className="captcha-button d-flex ms-1 mb-2 border bg-none border-0 bg-transparent"
                          onClick={regenerateCaptcha}
                        >
                          🔄
                        </button>
                      </div>
                      {errors.captcha && (
                        <p className="error-text text-danger">
                          {errors.captcha}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-12 col-md-6 d-flex flex-colu">
                  <button
                    type="submit"
                    className="btn btn-success-product d-flex flex-row align-items-center button-btn py-4 px-2 mt-4 ms-4 ms-lg-2 mb-4 blackitalic lorem-contact"
                    onClick={handleCaptchaChange}
                  >
                    Submit Request
                    <FontAwesomeIcon
                      icon={faArrowRightLong}
                      className="ms-2 mt-1"
                    />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>

      <div className="container-fluid">
        <div className="container">
          <div className="row theme-allow cart-cart">
            {Array.isArray(cookie) && cookie.length > 0
              ? cookie.map((data, key) => {
                  if (data.cookie !== "yes") return null;
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
                      className="col-12 col-lg-12 col-md-12 border d-flex justify-content-center gap-5 align-items-center"
                      key={key}
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
                          {data.message}.
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
                })
              : null}
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
                <input
                  type="email"
                  placeholder="Email address"
                  className="form-control me-2 py-4 cart-cart1"
                  aria-label="Email address"
                />
                <button
                  className="btn btn-success-product d-flex cart-cart1 py-4 me-0"
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

export default ContactUs;
