import React, { useContext, useEffect, useState, useRef } from "react";
import "./CustomerAccount.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faPhoneVolume,
  faBars,
  faMagnifyingGlass,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Tonic from "../../assets/Tonic.svg";
import { Link, useNavigate } from "react-router-dom";
import Over from "../../assets/Over.webp";
import Address from "../../assets/Cart_address.webp";
import Cart_order from "../../assets/Cart_request.webp";
import Cart_reviews from "../../assets/Cart_reviews.webp";
import Cart_download from "../../assets/Cart_download.webp";
import Cart_setting from "../../assets/Cart_setting.webp";
import Cart_logout from "../../assets/Cart_logout.webp";
import Cart_user from "../../assets/Cart_user.webp";
import axios from "axios";
import UserContext from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Close from "../../assets/Close.webp";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";

import Hamburger from "../../assets/hamburger.svg";
import { Helmet } from "react-helmet";

function CustomerAccount() {
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

  let navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [password, setPassword] = useState([]);

  useEffect(() => {
    const alldata = async () => {
      try {
        let response = await axios.get(
          "http://89.116.170.231:1600/getannounce"
        );
        setPassword(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    alldata();
  }, []);

  const leftData = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : password.length - 1
    );
  };

  const rightData = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < password.length - 1 ? prevIndex + 1 : 0
    );
  };

  const [auth, setAuth] = useState(true);
  const [message, setMessage] = useState("");

  let handleDelete = () => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://89.116.170.231:1600/logout")
      .then((res) => {
        if (res.data.Status === "Success") {
          localStorage.removeItem("token");
          localStorage.removeItem("userDetails");
          localStorage.removeItem("user");
          localStorage.removeItem("auth");
          setAuth(false);
          setMessage("Logged out successfully!");
          navigate(`/${url.login}`);
        } else {
          setMessage(res.data.Error);
        }
      })
      .catch((err) => {
        console.log("Error during logout:", err);
        setMessage("Logout failed, please try again.");
      });
  };

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    dob: "",
    email: "",
  });

  const [detail, setDetail] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    dob: "",
    email: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const full_name = `${detail.first_name} ${detail.last_name}`;
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const { id } = storedUser;
    if (!id) {
      toast.error("User ID not found. Please log in again.");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.put(
        `http://89.116.170.231:1600/userupdated/${id}`,
        detail
      );
      if (response.status === 200) {
        const updatedUser = {
          ...storedUser,
          first_name: detail.first_name,
          last_name: detail.last_name,
          phone_number: detail.phone_number,
          dob: detail.dob,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setDetail(updatedUser);
        toast.success("Data updated successfully", {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: true,
          closeButton: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("Data update failed", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: true,
        closeButton: true,
        draggable: true,
      });
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "full_name") {
      const [first_name, ...lastNameParts] = value.split(" ");
      const last_name = lastNameParts.join(" ");
      setDetail({
        ...detail,
        first_name: first_name,
        last_name: last_name,
      });
    } else {
      setDetail({ ...detail, [name]: value });
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate("/login");
    } else {
      setDetail({
        first_name: storedUser.first_name || "",
        last_name: storedUser.last_name || "",
        phone_number: storedUser.phone_number || "",
        dob: storedUser.dob || "",
        email: storedUser.email || "",
      });
    }
  }, [navigate]);

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
      <Helmet>
        <title>Edit Account - Update Your Profile | Rxlyte</title>
        <meta
          name="description"
          content="Update your personal information, email, and contact details securely. Keep your Rxlyte account up to date for a better shopping experience."
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="http://srv724100.hstgr.cloud/user/edit-account"
        />
      </Helmet>

      <div
        className="container d-lg-none d-block"
        id="container-customx1"
        style={{
          backgroundColor:
            password?.background_color ||
            (password?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: password?.background_image
            ? `url(http://89.116.170.231:1600/src/image/${password.background_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: password?.breadcrumb_height
            ? `${password.breadcrumb_height}px`
            : "190px",
        }}
      >
        {password.length > 0 && (
          <div className="d-block d-lg-block text-start pt-2 pb-2">
            <p className="mb-0 mt-0 mt-lg-0 me-md-3 free-shipping cart-cart d-flex flex-row ms-0 ms-lg-0">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="me-2 text-success fs-6 d-block d-lg-block mt-1"
                style={{ cursor: "pointer", position: "relative", zIndex: "1" }}
                onClick={leftData}
              />
              <FontAwesomeIcon
                icon={faArrowRight}
                className="me-2 text-success fs-6 d-block d-lg-block mt-1"
                style={{ cursor: "pointer", position: "relative", zIndex: "1" }}
                onClick={rightData}
              />
              <div className="ms-0">
                {password[currentIndex].content
                  .split(" ")
                  .slice(0, 6)
                  .join(" ")}
              </div>
            </p>
          </div>
        )}

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

                <div className="navbar-icons1 d-sm-flex mt-1 mt-md-0 gap-0 navbar-mobile">
                  <Link
                    to={`/${url.wishlist}`}
                    className="position-relative text-decoration-none me-3 mt-0 wishlist-home"
                  >
                    <span className="count-badge mt-1">{count6}</span>
                    <img
                      src={Wishlists}
                      alt="RxLYTE"
                      className="cart-image profiles1 mt-1"
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
                    />
                  </Link>

                  <Link
                    to={`/${url.cart}`}
                    className="nav-link d-flex nav-properties1"
                  >
                    <img
                      src={Carthome}
                      alt="Cart"
                      className="img-fluid profiles1 mt-1 pt-1 "
                    />
                    <div className="addcarts ms-1 ps-1 pt-lg-1 count-badge1">
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
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-md-start align-items-start ps-lg-2 ps-0 mt-2 mt-lg-3 lorem-home d-lg-block d-none">
            {password.length > 0 && (
              <div className="d-block d-lg-block text-start pt-0">
                <p className="mb-0 mt-0 mt-lg-0 me-md-3 free-shipping d-flex flex-row ms-2 ms-lg-0">
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="me-2 text-success fs-6 d-block d-lg-block mt-1"
                    style={{ cursor: "pointer" }}
                    onClick={leftData}
                  />
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="me-2 text-success fs-6 d-block d-lg-block mt-1"
                    style={{ cursor: "pointer" }}
                    onClick={rightData}
                  />
                  <div className="ms-0">
                    {password[currentIndex].content
                      .split(" ")
                      .slice(0, 7)
                      .join(" ")}
                  </div>
                </p>
              </div>
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

                      <div className="d-flex flex-row gap-2">
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
                            />
                            <div className="addcarts ms-1 ps-1 count-badge1 count-cart">
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
              <div className="d-flex flex-row justify-content-lg-end align-items-end float-end gap-4 mt-1">
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
                  />
                </Link>

                <Link to={`/${url.login}`}>
                  <img
                    src={Accounts}
                    alt="RxLYTE"
                    className="cart-image2 mt-2"
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
                  />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="container bg-light d-lg-block d-none">
          <div className="row d-flex justify-content-start text-center align-items-start mt-0 mb-lg-0 mb-2">
            <div className="col-12 col-md-8 d-flex align-items-center mb-2 mt-0 flex-row">
              <Link className="navbar-brand d-non d-lg-block" to="/">
                <img
                  src={logoUrl || Tonic}
                  alt="Tonic Logo"
                  className="img-fluid me-3 me-md-0 mt-0"
                  style={{ height: `${logoHeight}px`, width: "200px" }}
                />
              </Link>

              <div className="input-welcome1-home position-relative start-501 d-flex flex-row align-items-center mt-1">
                <input
                  type="search"
                  className="form-control p-2 border-1 mt-sm-3 border py-4 input-home rounded-0 d-lg-block d-none border-end-0 me- pe-2"
                  placeholder="Search For Product"
                  name="search"
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="d-lg-block d-none w-75">
                  <select
                    className="form-select rounded-0 border-0 mt-3 border-start-0"
                    style={{ height: "49px" }}
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="New Arrivals">New Arrivals</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Featured">Featured</option>
                    <option value="Best Sellers">Best Sellers</option>
                    <option value="Mobile Phone">Mobile Phone</option>
                    <option value="Computers & Laptops">
                      Computers & Laptops
                    </option>
                    <option value="Top Brands">Top Brands</option>
                    <option value="Weekly Best Selling">
                      Weekly Best Selling
                    </option>
                    <option value="CPU Heat Pipes">CPU Heat Pipes</option>
                    <option value="CPU Coolers">CPU Coolers</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Headphones">Headphones</option>
                    <option value="Wireless Headphones">
                      Wireless Headphones
                    </option>
                    <option value="TWS Headphones">TWS Headphones</option>
                    <option value="Smart Watch">Smart Watch</option>
                    <option value="Gaming Console">Gaming Console</option>
                    <option value="Playstation">Playstation</option>
                    <option value="Gifts">Gifts</option>
                    <option value="Computers">Computers</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Accessories">Accessories</option>
                    <option value="SmartPhones & Tablets">
                      SmartPhones & Tablets
                    </option>
                    <option value="TV Video & Music">TV Video & Music</option>
                    <option value="Cameras">Cameras</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Accessories">Accessories</option>
                    <option value="With Bluetooth">With Bluetooth</option>
                    <option value="Sports">Sports</option>
                    <option value="Electronics Gadgets">
                      Electronics Gadgets
                    </option>
                    <option value="Microscope">Microscope</option>
                    <option value="Remote Control">Remote Control</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Thermometer">Thermometer</option>
                    <option value="Backpack">Backpack</option>
                    <option value="Headphones">Headphones</option>
                  </select>
                </div>

                <div className="d-flex d-lg-block d-none">
                  <button className="ms-0 btn btn-success d-flex mt-3 py-4 px-3 rounded-0 justify-content-center align-items-center">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container lorem-home d-none d-lg-block bg-light pb-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="d-flex flex-column flex-md-row align-items-center mb-3 mb-md-0 ">
              <div className="dropdown d-inline-block">
                <button
                  className="btn btn-success d-flex align-items-center me-3 py-4 rounded-0 cart-cart"
                  id="categoryDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FontAwesomeIcon icon={faBars} className="me-2" />
                  BROWSE CATEGORIES
                  <FontAwesomeIcon icon={faAngleDown} className="ms-2" />
                </button>

                <ul
                  className="dropdown-menu rounded-0 lh-lg"
                  aria-labelledby="categoryDropdown"
                >
                  <li>
                    <Link className="dropdown-item" to="#">
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Electronics
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Gifts
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="#"
                      aria-labelledby="categoryDropdown"
                    >
                      Computers
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      SmartPhones & Tablets
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Tv,Vido & Music
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Cameras
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Cooking
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Accessories
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Sports
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Electronics Gadgets
                    </Link>
                  </li>
                </ul>
              </div>

              <nav>
                <ul className="nav-list d-flex flex-wrap mb-0 gap-3 gap-md-4 ">
                  <li className="nav-item">
                    <div className="nav-link-wrapper">
                      <Link to="/" className="nav-link fw-medium text-success">
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

            <div className="d-none d-md-flex align-items-center mt-3 mt-md-0 d-lg-none d-xl-block d-xxl-block d-lg-block d-none">
              <span className="d-flex">
                <FontAwesomeIcon
                  icon={faPhoneVolume}
                  className="text-success me-3 mt-1 fw-medium"
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
      </div>

      <div className="container-fluid">
        <div className="container">
          <div className="row gap-1 d-flex flex-wrap justify-content-start justify-content-lg-start ms-lg-0 mt-3">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 customer-dashboard text-start bg-body shadow-lg rounded-0 ms-0">
              <ul className="px-3 py-3 list-lyte">
                <li>
                  <Link to={`/${url.userDashboard}`} className="text-dark">
                    <img src={Over} alt="RxLYTE" className="me-2" />
                    Overview
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userOrders}`} className="text-dark">
                    <img src={Cart_user} alt="RxLYTE" className="me-2" />
                    Orders
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userProductReviews}`} className="text-dark">
                    <img src={Cart_reviews} alt="RxLYTE" className="me-2" />
                    Reviews
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userDownloads}`} className="text-dark">
                    <img src={Cart_download} alt="RxLYTE" className="me-2" />
                    Downloads
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userOrderReturns}`} className="text-dark">
                    <img src={Cart_order} alt="RxLYTE" className="me-2" />
                    Order Returns Requets
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userAddress}`} className="text-dark">
                    <img src={Address} alt="RxLYTE" className="me-2" />
                    Addresses
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userEditAccount}`} className="text-dark">
                    <img src={Cart_setting} alt="RxLYTE" className="me-2" />
                    Account Settings
                  </Link>
                </li>

                <li onClick={handleDelete} style={{ cursor: "pointer" }}>
                  <img src={Cart_logout} alt="Logout" className="me-2" />
                  Logout
                </li>
              </ul>
            </div>

            <div className="col-12 col-sm-12 col-md-12 col-lg-6 bg-body shadow-lg customer-dashboard1 text-start rounded-0 mb-2 mb-lg-0 ms-lg-1 ms-sm-0 border d-flex flex-column py-5 overflow-hidden letter-typo ms-md-2">
              <div className="d-flex flex-row ms-1 mb-4 gap-0">
                <button
                  className="btn py-4 d-flex address-account border rounded-0 address-profile border-end-0"
                  id="profile-btn"
                >
                  <Link
                    className="text-decoration-none"
                    to={`/${url.userEditAccount}`}
                    style={{ color: "#0c55aa" }}
                  >
                    Profile
                  </Link>
                </button>

                <button className="btn py-4 d-flex address-account border rounded-0 address-profile cart-cart1">
                  <Link
                    className="text-decoration-none"
                    style={{ color: "#0c55aa" }}
                    to={`/${url.changePassword}`}
                  >
                    Change Password
                  </Link>
                </button>
              </div>

              <form action="" method="" className="w-100">
                <div className="d-flex justify-content- name-user w-100 gap-3">
                  <div className="d-flex flex-column justify-content-between w-100">
                    <label htmlFor="full_name">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter full name"
                      className="form-control mt-2 py-4 address-name"
                      name="full_name"
                      value={`${detail.first_name || ""} ${
                        detail.last_name || ""
                      }`}
                      onChange={onInputChange}
                    />
                    {errors.full_name && (
                      <div className="text-danger">{errors.full_name}</div>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <label htmlFor="">Date of birth</label>
                  <input
                    type="date"
                    className="form-control mt-2 py-4 address-name"
                    name="dob"
                    value={detail.dob || ""}
                    onChange={onInputChange}
                    style={{
                      zIndex: "1",
                      position: "relative",
                    }}
                  />
                  {errors.dob && (
                    <div className="text-danger">{errors.dob}</div>
                  )}
                </div>

                <div className="mt-3">
                  <label htmlFor="">Email</label>
                  <input
                    type="email"
                    className="form-control mt-2 py-4 address-name"
                    name="email"
                    value={detail.email}
                    disabled
                  />
                  {errors.email && (
                    <div className="text-danger">{errors.email}</div>
                  )}
                </div>

                <div className="mt-3">
                  <label htmlFor="">Phone</label>
                  <input
                    type="text"
                    className="form-control mt-2 py-4 address-name"
                    name="phone_number"
                    value={detail.phone_number}
                    onChange={onInputChange}
                  />
                  {errors.phone_number && (
                    <div className="text-danger">{errors.phone_number}</div>
                  )}
                </div>

                <button
                  className="btn btn-success d-flex ms-2 mt-3 py-4 rounded-0 letter-typo"
                  onClick={handleSubmit}
                >
                  Update
                </button>
              </form>
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
export default CustomerAccount;
