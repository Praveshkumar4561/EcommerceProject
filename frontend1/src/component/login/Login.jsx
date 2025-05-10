import React, { useContext, useEffect, useRef, useState } from "react";
import "./Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Tonic from "../../assets/Tonic.svg";
import Hamburger from "../../assets/hamburger.svg";
import Close from "../../assets/Close.webp";
import UserContext from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import { Helmet } from "react-helmet-async";

function Login() {
  const navigate = useNavigate();
  let { count, setCount } = useContext(UserContext);

  useEffect(() => {
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
  }, []);

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
        localStorage.removeItem("cart");
        localStorage.removeItem("registerUser");
        localStorage.removeItem("user");
        const userData = response.data.user;
        const tokenExpirationTime = response.data.tokenExpiration;
        const userWithExpiration = {
          ...userData,
          tokenExpiration: tokenExpirationTime,
        };
        localStorage.setItem("user", JSON.stringify(userWithExpiration));
        localStorage.setItem("auth", "true");
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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegisterErrors({});
    const errors = {};
    const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
    if (!registerUser.first_name) errors.first_name = "First name is required";
    if (!registerUser.last_name) errors.last_name = "Last name is required";
    if (!registerUser.phone_number)
      errors.phone_number = "Phone number is required";
    if (!registerUser.email) errors.email = "Email is required";
    if (!registerUser.password) {
      errors.password = "Password is required";
    } else if (!strongPasswordRegex.test(registerUser.password)) {
      errors.password =
        "Password must be at least 6 characters and include letters, numbers, and special characters";
    }
    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }
    try {
      const response = await axios.post(
        "http://89.116.170.231:1600/submit",
        registerUser
      );
      localStorage.removeItem("cart");
      localStorage.removeItem("user");
      localStorage.removeItem("registerUser");
      localStorage.setItem("registeredUser", JSON.stringify(registerUser));
      toast.success("Registered successfully! You can now login", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Registration failed! Please try again", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser && storedUser.tokenExpiration) {
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
    setIsDropdownOpen((prev) => !prev);
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

  let [count6, setCount6] = useState(0);

  useEffect(() => {
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
    wishlistdata();
  }, []);

  let [cookie, setCookie] = useState([]);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent) {
      return;
    }

    const cookiedata = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/cookiesalldata"
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
      <Helmet>
        <title>Login to Your Account - Secure Access | Rxlyte</title>
        <meta
          name="description"
          content="Sign in to your Rxlyte account for a seamless shopping experience. Access your orders, wishlist, and exclusive deals securely."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://srv724100.hstgr.cloud/login" />
      </Helmet>

      <div
        className="container"
        id="container-custom"
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
                    <span className="count-badge mt-2 mt-lg-1">{count6}</span>
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
                        <Link to="/" className="text-dark">
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
                <div className="card-body border rounded-1 cart-cart">
                  <h2 className="fw-lighter login cart-cart text-center about-trend1">
                    Login
                  </h2>
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
                        className="form-control py-4 cart-cart address-register"
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
                        className="form-control py-4 address-register cart-cart"
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
                        className="btn btn-success-product button-account d-flex py-4 cart-cart w-100"
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
                  <h2 className="fw-lighter login cart-cart about-trend1">
                    Register
                  </h2>
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
                <div className="card-body cart-cart">
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
                        <small className="text-danger d-flex flex-column text-start mt-1">
                          {registerErrors.password}
                        </small>
                      )}
                      <p className="mt-1">
                        Password must contain(@,letter,number)
                      </p>
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
                    <div className="mb-3 form-check text-start cart-cart">
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
                        className="btn btn-success-product w-100 button-account d-flex py-4 cart-cart"
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
                alt="RxTonic"
                className="img-fluid mb-3"
                style={{ maxWidth: "190px" }}
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
                  className="form-control me-2 py-4 cart-cart"
                  aria-label="Email address"
                />
                <button
                  className="btn btn-success-product d-flex cart-cart py-4 me-0"
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
                &copy; {new Date().getFullYear()} RxLYTE. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Login;
