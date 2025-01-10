import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
import axios from "axios";
import Profile from "../../assets/image.png";
import Hamburger from "../../assets/hamburger.svg";
import Cart from "../../assets/Cart.svg";
import UserContext from "../../context/UserContext";

function Login() {
  const navigate = useNavigate();
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

  const [registerUser, setRegisterUser] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    password: "",
  });

  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { email, password } = user;
  const {} = registerUser;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://50.18.56.183:1600/login", user, {
        withCredentials: true,
      });
      if (response.data.Status === "Success") {
        console.log("Login successful!");
        navigate("/");
      } else {
        alert(response.data.Error || "Unexpected error during login");
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      alert("Error occurred during login");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://50.18.56.183:1600/submit", registerUser);
      if (response.data.status === "success") {
        navigate("/login");
      }
      alert("Registration successfully you can login");
    } catch (error) {
      console.error("Error occurred during registration", error);
      alert("Error occurred during registration");
    }
  };

  const handleLoginChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterUser({ ...registerUser, [e.target.name]: e.target.value });
  };

  //  signup page

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
      <div className="container cart-cart" id="container-custom">
        <div className="container-custom ms-3 ms-lg-0">
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
                    <Link className="nav-link" to="/cart-page">
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

          <main className="container mt-5 cart-cart">
            <h1
              className="fw-medium mb-3 text-center container-contact fs-2"
              style={{ position: "relative", zIndex: "1000" }}
            >
              Login
            </h1>
            <nav aria-label="breadcrumb" id="container-contact1">
              <ol
                className="breadcrumb d-flex flex-wrap gap-0"
                style={{ position: "relative", zIndex: "1000" }}
              >
                <li className="breadcrumb-item navbar-item fw-medium">
                  <Link target="blank" to="/" className="text-dark">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item navbar-item fw-medium">
                  <Link to="/blog" className="text-dark">
                    Pages
                  </Link>
                </li>
                <li className="breadcrumb-item navbar-item fw-medium text-dark">
                  Login
                </li>
              </ol>
            </nav>
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid cart-cart">
        <div className="container">
          <div className="row d-flex justify-content-start gap-0">
            <div className="col-12 col-md-6 col-lg-5 mb-4 mb-lg-0">
              <div className="card w-100">
                <div className="card-body border rounded-1">
                  <h3 className="card-title text-center login fw-medium">
                    Login
                  </h3>
                  <p className="text-center mb-3 account text-dark">
                    Please login using your account details below.
                  </p>
                  <form method="POST" onSubmit={handleLoginSubmit}>
                    <div className="mb-3 text-start">
                      <label htmlFor="loginEmail" className="form-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control py-4 address-register"
                        id="loginEmail"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>
                    <div className="mb-4 text-start">
                      <label htmlFor="loginPassword" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control py-4 address-register"
                        id="loginPassword"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={handleLoginChange}
                        required
                      />
                    </div>

                    <div className="d-flex justify-content-lg-center align-items-center">
                      <button
                        type="submit"
                        className="btn btn-success w-100 button-account d-flex py-4 cart-cart w-auto"
                      >
                        Sign In
                      </button>
                    </div>
                  </form>
                  <div className="text-center mt-3">
                    <p className="account1 text-dark cart-cart">
                      <Link
                        to="/login"
                        className="text-dark text-decoration-none me-2"
                      >
                        Don't have an account?
                      </Link>

                      <Link
                        to="/login"
                        className="account1 text-decoration-none cart-cart"
                      >
                        Create account
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-5">
              <div className="card shadow-sm w-100 register">
                <div className="card-header text-center border rounded-2">
                  <h3 className="fw-lighter login">Register</h3>
                  <p className="account fw-medium text-dark">
                    Don't have an account?{" "}
                    <Link
                      to="/login"
                      className="text-dark text-decoration-none"
                    >
                      Register
                    </Link>
                  </p>
                </div>
                <div className="card-body">
                  <form onSubmit={handleRegisterSubmit}>
                    <div className="mb-3 text-start">
                      <label htmlFor="registerEmail" className="form-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control py-4 address-register cart-cart"
                        id="registerEmail"
                        placeholder="Email Address"
                        name="email"
                        value={registerUser.email}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="mb-3 text-start">
                      <label htmlFor="registerPassword" className="form-label">
                        Create Password
                      </label>
                      <input
                        type="password"
                        className="form-control py-4 address-register cart-cart"
                        id="registerPassword"
                        placeholder="Create Password"
                        name="password"
                        value={registerUser.password}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="mb-3 text-start">
                      <label htmlFor="firstName" className="form-label">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="form-control py-4 address-register cart-cart"
                        id="firstName"
                        placeholder="First Name"
                        name="first_name"
                        value={registerUser.first_name}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="mb-3 text-start">
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="form-control py-4 address-register cart-cart"
                        id="lastName"
                        placeholder="Last Name"
                        name="last_name"
                        value={registerUser.last_name}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="mb-3 text-start">
                      <label htmlFor="phoneNumber" className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control py-4 address-register cart-cart"
                        id="phoneNumber"
                        placeholder="Phone Number"
                        name="phone_number"
                        value={registerUser.phone_number}
                        onChange={handleRegisterChange}
                      />
                    </div>
                    <div className="mb-3 form-check text-start">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="agree"
                        required
                      />
                      <label className="form-check-label agree" htmlFor="agree">
                        I agree to the Terms & Conditions
                      </label>
                    </div>
                    <div className="d-flex justify-content-lg-center align-items-center">
                      <button
                        type="submit"
                        className="btn btn-success w-100 button-account d-flex py-4 cart-cart w-auto"
                      >
                        Create Account
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default Login;
