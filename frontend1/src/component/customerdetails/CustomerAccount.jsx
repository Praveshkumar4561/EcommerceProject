import React, { useContext, useEffect, useState } from "react";
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
import Cart from "../../assets/Cart.svg";
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
import Carthome from "../../assets/Carthome.svg";
import Wishlists from "../../assets/Wishlists.svg";
import Accounts from "../../assets/Accounts.svg";

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
  cartdata();

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
          autoClose: 1500,
          hideProgressBar: true,
          closeButton: true,
          draggable: true,
        });
      }
    } catch (error) {
      toast.error("Data update failed", {
        position: "bottom-right",
        autoClose: 1500,
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

  return (
    <>
      <div className="container-fluid">
        <div className="row align-items-start justify-content-between text-center mt-lg-0 mt-0 pt-0 pt-lg-0 bg-light ms-0 me-0">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-md-start align-items-start ps-lg-2 ps-0 mt-2 mt-lg-3 lorem-home">
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

          <div className="col-12 col-md-6 d-flex justify-content-md-end mt-2 mt-md-0 lorem-home d-md-none d-lg-block">
            {detail && detail.first_name ? (
              <div className="d-flex align-items-center float-end gap-0 d-none d-lg-block mt-1">
                <div className="free-shipping d-flex flex-row me-3 mt-2">
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

                      <Link
                        to={`/${url.cart}`}
                        className="nav-link d-flex mt-2"
                      >
                        <img
                          src={Cart}
                          alt="Cart"
                          className="img-fluid profile1 me-2 ms-1"
                          style={{
                            position: "relative",
                            cursor: "pointer",
                            zIndex: 1000,
                          }}
                        />
                        <div className="addcarts-lyte2 ms-3 mt-2 pt-1">
                          {count}
                        </div>
                      </Link>
                    </div>
                  </span>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-row gap-2 justify-content-lg-end align-items-center icons-wishlist">
                <Link to={`/${url.wishlist}`}>
                  <img src={Wishlists} alt="RxLYTE" />
                </Link>
                <Link to={`/${url.login}`}>
                  <img src={Accounts} alt="RxLYTE" />
                </Link>
                <Link to={`/${url.cart}`}>
                  <span
                    className="position-absolute ms-4 text-dark mt-1"
                    style={{ fontFamily: "verdana" }}
                  >
                    {count}
                  </span>
                  <img src={Carthome} alt="RxLYTE" className="mt-3" />
                </Link>
              </div>
            )}
          </div>

          <div className="d-flex flex-row gap-2 justify-content-lg-end align-items-center icons-wishlist d-lg-none d-md-none">
            <Link to={`/${url.wishlist}`}>
              <img src={Wishlists} alt="RxLYTE" />
            </Link>
            <Link to={`/${url.login}`}>
              <img src={Accounts} alt="RxLYTE" />
            </Link>
            <Link to={`/${url.cart}`}>
              <span
                className="position-absolute ms-4 text-dark mt-1"
                style={{ fontFamily: "verdana" }}
              >
                {count}
              </span>
              <img src={Carthome} alt="RxLYTE" className="mt-3" />
            </Link>
          </div>
        </div>

        <div className="container bg-light">
          <div className="row d-flex justify-content-start text-center align-items-start mt-0 mb-lg-0 mb-2">
            <div className="col-12 col-md-8 d-flex align-items-center mb-4 mt-0 d-flex flex-row">
              <Link className="navbar-brand d-non d-lg-block" to="/">
                <img
                  src={logoUrl || Tonic}
                  alt="Tonic Logo"
                  className="img-fluid me-3 me-md-0 mt-0 mt-lg-0"
                  style={{ height: `${logoHeight}px`, width: "200px" }}
                />
              </Link>

              <div className="input-welcome-user1 d-flex flex-row align-items-center mt-1">
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
                    <Link className="dropdown-item" href="#">
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Electronics
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Gifts
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      href="#"
                      aria-labelledby="categoryDropdown"
                    >
                      Computers
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      SmartPhones & Tablets
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Tv,Vido & Music
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Cameras
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Cooking
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Accessories
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Sports
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Electronics Gadgets
                    </Link>
                  </li>
                </ul>
              </div>

              <nav>
                <ul className="nav-list d-flex flex-wrap mb-0 gap-3 gap-md-4">
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

            <div className="d-none d-md-flex align-items-center mt-3 mt-md-0 d-lg-none d-xl-block d-xxl-block">
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

                <button className="btn py-4 d-flex address-account border rounded-0 address-profile">
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

      <div className="container-fluid bg-dark text-light py-4 mt-4 mb-0 d-flex justify-content-center align-items-center lorem-contact min-vw-100">
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
export default CustomerAccount;
