import React, { useContext, useEffect, useRef, useState } from "react";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
import Profile from "../../assets/image.webp";
import Hamburger from "../../assets/hamburger.svg";
import Cart from "../../assets/Cart.svg";
import UserContext from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login() {
  const navigate = useNavigate();
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

  const [registerErrors, setRegisterErrors] = useState({});

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

  const [loginErrors, setLoginErrors] = useState({});
  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginErrors({});

    if (!user.email || !user.password) {
      setLoginErrors({
        email: !user.email ? "Email is required" : "",
        password: !user.password ? "Password is required" : "",
      });
      return;
    }

    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const passwordToSend = storedUser?.password || user.password;
      const response = await axios.post(
        "http://89.116.170.231:1600/login",
        { email: user.email, password: passwordToSend },
        { withCredentials: true }
      );
      if (response?.data?.Status === "Success" && response?.data?.user) {
        const userData = response.data.user;
        const tokenExpirationTime = response.data.tokenExpiration;
        const userWithExpiration = {
          ...userData,
          tokenExpiration: tokenExpirationTime,
        };
        localStorage.setItem("user", JSON.stringify(userWithExpiration));
        localStorage.setItem("auth", "true");
        setAuth(true);
        setMessage("Login successful!");
        navigate("/");
      } else {
        console.warn("Login Failed:", response.data);
        setLoginErrors({
          general: response.data.Message || "Incorrect email or password.",
        });
      }
    } catch (error) {
      console.error("Login Error:", error);
      setLoginErrors({
        general:
          error.response?.data?.Message || "Incorrect email or password.",
      });
    }
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.tokenExpiration) {
        console.log("Stored expiration:", storedUser.tokenExpiration);
        console.log("Current time:", Date.now());
        if (Date.now() > storedUser.tokenExpiration) {
          console.log("Token expired. Logging out...");

          localStorage.removeItem("user");
          localStorage.removeItem("auth");

          toast.error("Session expired. Please log in again.");

          navigate("/login");
        }
      } else {
        console.log("No tokenExpiration found in localStorage.");
      }
    };
    checkTokenExpiration();
    const timeoutid = setTimeout(() => {
      checkTokenExpiration();
    }, 10000);
    return () => clearTimeout(timeoutid);
  }, [navigate]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterErrors({});
    const errors = {};
    if (!registerUser.first_name) errors.first_name = "First name is required";
    if (!registerUser.last_name) errors.last_name = "Last name is required";
    if (!registerUser.phone_number)
      errors.phone_number = "Phone number is required";
    if (!registerUser.email) errors.email = "Email is required";
    if (!registerUser.password) errors.password = "Password is required";
    else if (registerUser.password.length < 6)
      errors.password = "Password must be at least 6 characters";

    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }
    try {
      const response = await axios.post(
        "http://89.116.170.231:1600/submit",
        registerUser
      );
      toast.success("Registered successfully! you can login", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Registered failed! you can try again", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
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

  const [show, setShow] = useState(false);

  const passwordshow = () => {
    setShow(!show);
  };

  const [shows, setShows] = useState(false);

  const passwordshows = () => {
    setShows(!shows);
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
            `http://89.116.170.231:1600/api/src/image/${response.data.logo_url}`
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

  return (
    <>
      <div
        className="container"
        id="container-custom"
        style={{
          backgroundColor:
            cart?.background_color ||
            (cart?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: cart?.background_image
            ? `url(http://89.116.170.231:1600/api/src/image/${cart.background_image})`
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
                      src={Hamburger}
                      alt="Menu"
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
                      <Link className="nav-link" to={`/${url.cart}`}>
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
                    <Link className="nav-link" to={`/${url.cart}`}>
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
                      Login
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
                    <ol className="breadcrumb d-flex flex-wrap gap-0">
                      <li className="breadcrumb-item navbar-item fw-medium">
                        <Link target="_blank" to="/" className="text-dark">
                          Home
                        </Link>
                      </li>
                      <li className="breadcrumb-item navbar-item fw-medium text-dark">
                        Login
                      </li>
                    </ol>
                  </nav>
                </>
              )}
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid cart-cart">
        <div className="container login-alignment">
          <div className="row d-flex justify-content-start flex-md-nowrap flex-row gap-0 ">
            <div className="col-12 col-md-6 col-lg-6 mb-4 mb-lg-0 login-alignment1">
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
                      />
                      {loginErrors.email && (
                        <small className="text-danger">
                          {loginErrors.email}
                        </small>
                      )}
                    </div>

                    <div className="mb-4 text-start">
                      <label htmlFor="loginPassword" className="form-label">
                        Password
                      </label>
                      <input
                        type={shows ? "text" : "password"}
                        className="form-control py-4 address-register"
                        id="loginPassword"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={handleLoginChange}
                      />
                      <FontAwesomeIcon
                        icon={shows ? faEyeSlash : faEye}
                        className="position-absolute translate-middle-y end-0 me-4 pe-2"
                        onClick={passwordshows}
                        style={{ cursor: "pointer", marginTop: "-23px" }}
                      />
                      {loginErrors.password && (
                        <small className="text-danger">
                          {loginErrors.password}
                        </small>
                      )}
                      <div className="mt-1 pt-0">
                        {loginErrors.general && (
                          <div className="text-danger text-start mb-2 mt-0">
                            {loginErrors.general}
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      className="d-flex justify-content-lg-center align-items-center"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <button
                        type="submit"
                        className="btn btn-success button-account d-flex py-4 cart-cart w-100"
                      >
                        Sign In
                      </button>
                    </div>
                  </form>

                  <div className="text-center mt-3">
                    <p className="account1 text-dark cart-cart">
                      <Link
                        to={`/${url.login}`}
                        className="text-dark text-decoration-none me-2"
                      >
                        Don't have an account?
                      </Link>

                      <Link
                        to={`/${url.login}`}
                        className="account1 text-decoration-none cart-cart"
                      >
                        Create account
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-6">
              <div className="card shadow-sm w-100 register mt-0 mt-lg-3 mt-md-3">
                <div className="card-header text-center border rounded-2">
                  <h3 className="fw-lighter login">Register</h3>
                  <p className="account fw-medium text-dark">
                    Don't have an account?{" "}
                    <Link
                      to={`/${url.login}`}
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
                      {registerErrors.email && (
                        <small className="text-danger">
                          {registerErrors.email}
                        </small>
                      )}
                    </div>

                    <div className="mb-3 text-start">
                      <label htmlFor="registerPassword" className="form-label">
                        Create Password
                      </label>
                      <input
                        type={show ? "text" : "password"}
                        className="form-control py-4 address-register cart-cart"
                        id="registerPassword"
                        placeholder="Create Password"
                        name="password"
                        value={registerUser.password}
                        onChange={handleRegisterChange}
                      />
                      <FontAwesomeIcon
                        icon={show ? faEyeSlash : faEye}
                        className="position-absolute translate-middle-y end-0 me-4 pe-2"
                        onClick={passwordshow}
                        style={{ cursor: "pointer", marginTop: "-23px" }}
                      />
                      {registerErrors.password && (
                        <small className="text-danger">
                          {registerErrors.password}
                        </small>
                      )}
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
                      {registerErrors.first_name && (
                        <small className="text-danger">
                          {registerErrors.first_name}
                        </small>
                      )}
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
                      {registerErrors.last_name && (
                        <small className="text-danger">
                          {registerErrors.last_name}
                        </small>
                      )}
                    </div>
                    <div className="mb-3 text-start">
                      <label htmlFor="phoneNumber" className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="number"
                        className="form-control py-4 address-register cart-cart"
                        id="phoneNumber"
                        placeholder="Phone Number"
                        name="phone_number"
                        value={registerUser.phone_number}
                        onChange={handleRegisterChange}
                      />
                      {registerErrors.phone_number && (
                        <small className="text-danger">
                          {registerErrors.phone_number}
                        </small>
                      )}
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
                    <div
                      className="d-flex justify-content-lg-center align-items-center"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <button
                        type="submit"
                        className="btn btn-success w-100 button-account d-flex py-4 cart-cart"
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
        <ToastContainer />
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
              <p
                className="ps-lg-0 ps-xl-3 ps-xxl-1 me-2 
              text-lg-start text-start pharmacy2 lh-lg"
              >
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
