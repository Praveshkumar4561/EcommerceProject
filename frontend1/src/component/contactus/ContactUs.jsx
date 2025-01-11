import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ContactUs.css";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
import "../../../src/assets/fonts/Roboto-BlackItalic.ttf";
import Profile from "../../assets/image.webp";
import Hamburger from "../../assets/hamburger.svg";
import Cart from "../../assets/Cart.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhoneVolume,
  faCommentDots,
  faLocationDot,
  faArrowRightLong,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import UserContext from "../../context/UserContext";

function ContactUs() {
  let { count, setCount } = useContext(UserContext);

  useEffect(() => {
    cartdata();
  }, []);

  const cartdata = async () => {
    try {
      const response = await axios.get("http://50.18.56.183:1600/allcartdata");
      setCount(response.data.length);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };
  cartdata();

  // catcha code

  let generateRandomNumber = () => {
    return Math.floor(Math.random() * 10) + 1;
  };

  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    product: "",
    message: "",
  });
  const [captchaValid, setCaptchaValid] = useState(false);
  const [num1, setNum1] = useState(generateRandomNumber());
  const [num2, setNum2] = useState(generateRandomNumber());
  const [userAnswer, setUserAnswer] = useState("");
  const [error, setError] = useState("");

  const { first_name, last_name, email, phone_number, product, message } = user;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleCaptchaChange = () => {
    if (parseInt(userAnswer) === num1 + num2) {
      setCaptchaValid(true);
      setNum1(generateRandomNumber());
      setNum2(generateRandomNumber());
      setUserAnswer("");
      setError("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaValid) {
      alert("Please complete the CAPTCHA");
      return;
    }

    try {
      const response = await axios.post(
        "http://50.18.56.183:1600/contact",
        user
      );
      if (response.status === 200) {
        alert("Message sent successfully!");
        setUser({
          first_name: "",
          last_name: "",
          email: "",
          phone_number: "",
          product: "",
          message: "",
        });
        setCaptchaValid(false);
        setUserAnswer("");
      } else {
        alert("Failed to send message.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while sending your message.");
    }
  };

  // catcha code

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
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      {}

      <div className="container cart-cart" id="container-custom">
        <div className="container-custom">
          <header className="d-flex flex-wrap justify-content-between py-2 mb-5 border-bottom bg-body rounded-2 container-custom1">
            <nav className="navbar navbar-expand-lg navbar-light w-100">
              <div className="container">
                <Link className="navbar-brand d-non d-lg-block" to="#">
                  <img src={image1} alt="Tonic Logo" className="img-fluid" />
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
                      src={Hamburger}
                      alt="Menu"
                      className="img-fluid hamburger-image"
                    />
                  </span>
                </button>

                <div className="navbar-collapse d-none d-lg-block">
                  <ul className="navbar-nav ms-auto">
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
                      <Link className="nav-link" to={`/blog-details/${1}`}>
                        Pages
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/blog">
                        Blog
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/cart">
                        Cart
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/contact-us">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="navbar-icons d-sm-flex">
                  <Link to="/login" className="nav-link">
                    <img
                      src={Profile}
                      alt="Profile"
                      className="profiles img-fluid me-3"
                    />
                  </Link>
                  <Link to="/cart" className="nav-link d-flex nav-properties1">
                    <img
                      src={Cart}
                      alt="Cart"
                      className="img-fluid profiles1 mt-1"
                    />
                    <div className="addcarts ms-1 ps-1 pt-lg-1">{count}</div>
                  </Link>
                </div>

                {}
              </div>
            </nav>

            {isDropdownOpen && (
              <div className="custom-dropdown cart-cart" ref={dropdownRef}>
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
                    <Link className="nav-link" to={`/blog-details/${1}`}>
                      Pages
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/blog">
                      Blog
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/cart">
                      Cart
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

          {}

          <main className="container mt-5 lorem-contact">
            <h1 className="fw-medium mb-3 text-center container-contact fs-2">
              Contact Us
            </h1>
            <nav aria-label="breadcrumb" id="container-contact1">
              <ol className="breadcrumb d-flex flex-wrap gap-0">
                <li className="breadcrumb-item navbar-item fw-medium">
                  <Link target="blank" to="/" className="text-dark">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item navbar-item fw-medium text-dark">
                  Contact Us
                </li>
              </ol>
            </nav>
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid d-flex justify-content-center cart-cart">
        <div className="container">
          <div className="row mt-5 pt-4 justify-content-center">
            <div className="col-12 col-md-6 query bg-light mb-3 rounded query-us">
              <div className="d-flex flex-column">
                <h2 className="text-start ms-5 ps-5 ps-lg-0 ms-lg-0 mt-2 query-feel lorem-contact">
                  Feel Free to contact <br /> us for any query
                </h2>
                <div className="phone-mail d-flex align-items-center p-3 rounded-5 bg-light mt-0">
                  <div className="rounded-border bg-success text-center text-white fs-3 d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faPhoneVolume} />
                  </div>

                  <div className="ms-3 lorem-contact">
                    <p className="fw-normal mb-1 text-lg-start mt-1">
                      Phone Number
                    </p>
                    <p className="head-office fw-normal text-dark">
                      Head office: (210) 123 451
                    </p>
                  </div>
                </div>
                <div className="phone-mail d-flex align-items-center p-3 rounded-5 bg-light mt-0 lorem-contact">
                  <div className="rounded-border bg-success text-center text-white fs-3 d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faCommentDots} />
                  </div>
                  <div className="ms-3">
                    <p className="fw-normal mb-1 text-lg-start mt-1">
                      Mail Address
                    </p>
                    <p className="head-office fw-normal text-dark">
                      Webecyenvato12@gmail.com
                    </p>
                  </div>
                </div>
                <div className="phone-mail d-flex align-items-center p-3 rounded-5 bg-light mt-0 lorem-contact">
                  <div className="rounded-border bg-success text-center text-white fs-3 d-flex align-items-center justify-content-center">
                    <FontAwesomeIcon icon={faLocationDot} />
                  </div>
                  <div className="ms-3">
                    <p className="fw-normal mb-1 text-lg-start mt-1">
                      Office Address
                    </p>
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
                  <div className="col-12 col-md-6 d-flex flex-column align-items-lg-center contact-name">
                    <div className="form-group text-start">
                      <label htmlFor="firstName" className="name1">
                        First Name*
                      </label>
                      <input
                        type="text"
                        className="form-control fw-normal mt-4 py-4 lorem-contact1"
                        id="firstName"
                        placeholder="First Name*"
                        name="first_name"
                        value={first_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6 d-flex flex-column align-items-start align-items-md-start contact-name">
                    <div className="form-group w-100 mt-sm-3 blackitalic text-start">
                      <label htmlFor="lastName">Last Name*</label>
                      <input
                        type="text"
                        className="form-control mt-2 fw-normal py-4 lorem-contact1"
                        id="lastName"
                        placeholder="Last Name"
                        name="last_name"
                        value={last_name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-1 mt-0 d-flex align-items-md-start contact-name5">
                  <div className="col-12 col-md-6 d-flex flex-column align-items-start ">
                    <div className="form-group blackitalic text-start">
                      <label htmlFor="email">Mail Address</label>
                      <input
                        type="email"
                        className="form-control fw-normal mt-2 py-4 lorem-contact1"
                        placeholder="Mail Address"
                        id="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6 d-flex flex-column align-items-start">
                    <div className="form-group blackitalic text-start contact-name">
                      <label htmlFor="phoneNumber" className="mt-3 mt-lg-0">
                        Phone Number
                      </label>
                      <input
                        type="number"
                        className="form-control fw-normal mt-2 py-4 lorem-contact1"
                        placeholder="Phone Number"
                        id="phoneNumber"
                        name="phone_number"
                        value={phone_number}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3 d-flex flex-column align-items-cente lorem-contact1">
                  <div className="form-group blackitalic text-start mt-3">
                    <label htmlFor="product">Choose Product</label>
                    <select
                      className="form-control fw-bold mt-2 py-4"
                      id="product"
                      name="product"
                      value={product}
                      onChange={handleChange}
                    >
                      <option value="">Select a product</option>
                      <option value="product1">Product 1</option>
                      <option value="product2">Product 2</option>
                    </select>
                  </div>
                </div>

                <div className="form-group mt-sm-0 blackitalic ms-0 ms-md-0 ms-lg-0 text-start">
                  <label htmlFor="message">Enter Message</label>
                  <textarea
                    className="form-control fw-normal mt-2 lorem-contact1 custom-message"
                    id="message"
                    placeholder="Enter Message"
                    name="message"
                    value={message}
                    onChange={handleChange}
                  ></textarea>

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
                    {error && <p className="error-message ms-3">{error}</p>}
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-success d-flex flex-row align-items-center button-btn py-4 px-2 mt-4 ms-4 ms-lg-2 mb-4 blackitalic lorem-contact"
                  onClick={handleCaptchaChange}
                >
                  Submit Request
                  <FontAwesomeIcon
                    icon={faArrowRightLong}
                    className="ms-2 mt-1"
                  />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {}

      <div className="container-fluid bg-dark text-light py-5 mt-4 mb-0 d-flex justify-content-center align-items-center lorem-contact rounded-0">
        <div className="container text-center">
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
                the finest pharmaceutical care possible,all pharmaceutical firms
                and drug manufacturers have accredited facilities and trained
                pharmacists on staff.
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
              <p className="ps-lg-0 ps-xl-3 ps-xxl-1 me-2 text-lg-start text-sm-end pharmacy2 lh-lg">
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
      </div>
    </>
  );
}

export default ContactUs;
