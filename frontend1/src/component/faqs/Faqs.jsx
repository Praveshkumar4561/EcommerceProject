import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Faqs.css";

import Tonic from "../../assets/Tonic.svg";
import axios from "axios";
import Hamburger from "../../assets/hamburger.svg";
import UserContext from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Close from "../../assets/Close.webp";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import JsonLd from "../JsonLd";
import { Helmet } from "react-helmet";

function Faqs() {
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

  const generateRandomNumber = () => Math.floor(Math.random() * 10) + 1;

  const generateRandomOperation = () => {
    const operations = ["add", "subtract"];
    const selectedOperation =
      operations[Math.floor(Math.random() * operations.length)];
    const num1 = generateRandomNumber();
    const num2 = generateRandomNumber();
    return { selectedOperation, num1, num2 };
  };

  const [user, setUser] = useState({
    name: "",
    subject: "",
    message: "",
  });

  const { name, subject, message } = user;

  const [captchaValid, setCaptchaValid] = useState(false);
  const [operation, setOperation] = useState(generateRandomOperation());
  const { selectedOperation, num1, num2 } = operation;
  const [userAnswer, setUserAnswer] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleCaptchaChange = () => {
    const correctAnswer =
      selectedOperation === "add" ? num1 + num2 : num1 - num2;

    if (parseInt(userAnswer) === correctAnswer) {
      setCaptchaValid(true);
      setOperation(generateRandomOperation());
      setUserAnswer("");
      setError("");
    } else {
      setError("Incorrect answer, please try again.");
      setCaptchaValid(false);
    }
  };

  const regenerateCaptcha = () => {
    setOperation(generateRandomOperation());
    setUserAnswer("");
    setError("");
    setCaptchaValid(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaValid) {
      return;
    }
    try {
      const response = await axios.post(
        "http://89.116.170.231:1600/faqs",
        user
      );
      toast.success("Faqs successfully submitted", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Faqs not submitted", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
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

  let [faqs, setFaqs] = useState([]);

  useEffect(() => {
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
    faqdata();
  }, []);

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: "RxLyte, Ecommerce, premium healthcare, online pharmacy, RxLyte Ecommerce site",
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          bestRating: "5",
          ratingCount: "5932",
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <JsonLd data={schemaData} />

      <Helmet>
        <title>Frequently Asked Questions (FAQs) - Get Answers | Rxlyte</title>
        <meta
          name="description"
          content="Find answers to common questions about orders, payments, shipping, and more. Explore our FAQs section for quick solutions at Rxlyte."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://srv724100.hstgr.cloud/faqs" />
      </Helmet>

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
                      Faqs
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
                      <li className="breadcrumb-item navbar-item fw-medium text-dark p-0">
                        Faqs
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
        <div className="container overflow-hidden">
          <div className="row d-flex justify-content-sm-center justify-content-md-center justify-content-xl-start justify-content-xxl-start mt-5 h-auto">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 faqs-page bg-body h-auto">
              <div className="d-flex flex-column lorem-faqs text-start bg-transparent shadow-lg py-4">
                <h2 className="general ms-4 mt-1 fw-medium cart-cart">
                  General Information
                </h2>
                <h4 className="ms-4 fw-medium cart-cart lh-base">
                  Can you buy medicine online in USA?
                </h4>
                <p className="justo ms-4 me-1 mt-1 lh-lg cart-cart text-dark">
                  Generally speaking, customers register for an account with a
                  legitimate online pharmacy and provide credit and insurance
                  details. The state in which the pharmacy is located has
                  granted it permission to sell prescription drugs. Once you've
                  registered, you need to send in a legitimate prescription.
                </p>

                <h4 className="ms-4 cart-cart fw-medium">
                  Can medication be shipped to USA?
                </h4>
                <p className="justo ms-4 me-1 mt-2 lh-lg cart-cart text-dark">
                  Prescription medication cannot be sent to the United States
                  unless the Food and Drug Administration (FDA) has given the
                  go-ahead. There are a few outliers, however. Prescription
                  medications manufactured in the United States and exported are
                  often only returnable to the original manufacturer.
                </p>

                <h4 className="ms-4 cart-cart fw-medium lh-base">
                  Is Canada Drug Warehouse legitimate?
                </h4>
                <p className="justo ms-4 mt-1 me-1 lh-lg cart-cart text-dark">
                  Canada Drug Warehouse has certifications from both the
                  International Pharmacy Association of British Columbia (IPABC)
                  and the Canadian International
                </p>
              </div>
            </div>

            <div className="col-12 col-sm-12 col-md-12 col-lg-6 col-xl-6 col-xxl-6 mt-sm-0 mt-md-0 mt-xl-0 mt-xxl-0 faqs-page faqs-page1 faq-enhance">
              <div className="d-flex flex-column text-start ms-0 faq-enhance">
                <h6 className="question fs-4 mt-lg-4 mt-0 ms-4 pt-2 fw-medium cart-cart">
                  Ask a Question
                </h6>
                <p className="lorem-ipsum ms-4 me-0 lh-lg cart-cart text-dark">
                  What innovative solutions does Rx Lyte offer to enhance
                  medication adherence and optimize patient outcomes,
                  particularly for individuals managing chronic conditions?
                  Additionally, how does the platform integrate technology to
                  streamline prescription management.
                </p>
                <form onSubmit={handleSubmit} className="lorem-faqs2">
                  <input
                    type="text"
                    className="form-control bg-white name-text mt-1 ms-4 py-4 fw-normal lorem-faqs1 cart-cart text-dark"
                    placeholder="Your Name*"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    className="form-control bg-white name-text mt-4 ms-4 py-4 fw-normal lorem-faqs1 cart-cart text-dark"
                    placeholder="Subject*"
                    name="subject"
                    value={subject}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    className="form-control bg-white name-text mt-4 ms-4 py-4 fw-normal lorem-faqs1 cart-cart text-dark"
                    placeholder="Type Your Message*"
                    name="message"
                    value={message}
                    onChange={handleChange}
                    required
                  />

                  <div className="captcha-container1 mt-4 ms-4 py-3">
                    <p className="captcha-header1 fw-light ms-1 cart-cart">
                      Solve this captcha: {num1}
                      {selectedOperation === "add" ? " + " : " - "} {num2} = ?
                    </p>
                    <div className="d-flex flex-row">
                      <input
                        type="text"
                        className="form-control captcha-input1 ms-1 mb-3 py-4 cart-cart"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder="Your answer"
                      />
                      <button
                        type="button"
                        className="captcha-button1 ms-1 mb-2 border-0 bg-transparent"
                        onClick={regenerateCaptcha}
                      >
                        🔄
                      </button>
                    </div>
                    {error && (
                      <p className="error-message1 ms-1 cart-cart">{error}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success mt-lg-4 mt-2 d-flex py-4 ms-4 mb-3 mb-lg-0 rounded-0 cart-cart1"
                    onClick={handleCaptchaChange}
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
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

export default Faqs;
