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
import { Link, useNavigate, useParams } from "react-router-dom";
import Profile from "../../assets/image.webp";
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

function CustomerAccount() {
  let { count, setCount } = useContext(UserContext);

  useEffect(() => {
    cartdata();
  }, []);

  const cartdata = async () => {
    try {
      const response = await axios.get("http://52.9.253.67:1600/allcartdata");
      setCount(response.data.length);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };
  cartdata();

  let navigate = useNavigate();

  let [user, setUser] = useState({
    name: "",
    phone: "",
    date: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    date: "",
    email: "",
  });

  const { name, phone, date, email } = user;
  let { id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("ID:", id);
    if (validateForm()) {
      try {
        const response = await axios.put(
          `http://52.9.253.67:1600/userupdate/${id}`,
          user
        );
        setUser(response.data);
        console.log("User data updated:", response.data);
        navigate("/user/address");
        alert("Data updated successfully");
      } catch (error) {
        console.error("Error occurred:", error);
        alert("Error occurred while updating the user data. Please try again.");
      }
    } else {
      alert("Form validation failed. Please check your inputs.");
    }
  };

  useEffect(() => {
    somedata();
  }, []);

  let somedata = async () => {
    let response = await axios.get(
      `http://52.9.253.67:1600/dashboardsome/${1}`
    );
    setUser(response.data[0]);
  };

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!date) {
      formErrors.email = "Date is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Date is invalid";
      isValid = false;
    }
    setErrors(formErrors);
    return isValid;
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [password, setPassword] = useState([]);

  useEffect(() => {
    const alldata = async () => {
      try {
        let response = await axios.get("http://52.9.253.67:1600/getannounce");
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
    axios.defaults.withCredentials = false;
    axios
      .get("http://52.9.253.67:1600/logout")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(false);
          setMessage("Logged out successfully!");
          alert("Logged out successfully!");
          navigate("/login");
        } else {
          setMessage(res.data.Error);
        }
      })
      .catch((err) => {
        console.log("Error during logout:", err);
        setMessage("Logout failed, please try again.");
      });
  };

  let deleteAccount = async (id) => {
    try {
      await axios.delete(`http://loclahost:1600/deleteaccount/${id}`, user);
      alert("Data deleted");
    } catch (error) {
      console.error("Error", error);
    }
  };

  let [detail, setDetail] = useState([]);

  let userdata = async () => {
    let response = await axios.get("http://52.9.253.67:1600/alldata");
    setDetail(response.data);
  };
  userdata();

  return (
    <>
      <div className="container-fluid">
        <div className="row align-items-center justify-content-between text-center mt-lg-2 mt-0 pt-0 pt-lg-1">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-md-start align-items-center ps-4 lorem-home">
            {password.length > 0 && (
              <div className="d-block d-lg-block text-start">
                <p className="mb-0 mt-3 mt-lg-0 me-md-3 free-shipping d-flex flex-row">
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
                    {password[currentIndex]?.content || "No content available"}
                  </div>
                </p>
              </div>
            )}
          </div>

          <div className="col-12 col-md-6 d-flex justify-content-md-end align-items-center mt-2 mt-md-0 lorem-home d-md-none d-lg-block">
            {Array.isArray(detail) && detail.length > 0 ? (
              detail.slice(0, 1).map((data, key) => (
                <div
                  className="d-flex align-items-center gap-3 float-lg-end d-none d-lg-block"
                  key={key}
                >
                  <div className="free-shipping d-flex flex-row me-3">
                    <span className="d-flex align-items-center gap-2">
                      <div className="d-sm-flex ms-auto d-flex">
                        <Link to="/user/dashboard" className="nav-link">
                          {data.first_name ? (
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
                              className="profile-lyte1 img-fluid me-0 border rounded-5 py-1 bg-success"
                            >
                              {data.first_name.charAt(0).toUpperCase()}
                            </div>
                          ) : (
                            <img
                              src={Profile}
                              alt="Profile"
                              className="profile-lyte1 img-fluid me-0 border rounded-5 py-1"
                            />
                          )}
                        </Link>

                        <div className="d-flex flex-column me-4">
                          <span className="me-4 pe-2">
                            Hello {data.first_name || "User"}
                          </span>
                          <span className="ms-4">{data.email}</span>
                        </div>

                        <Link to="/cart" className="nav-link d-flex mt-1">
                          <img
                            src={Cart}
                            alt="Cart"
                            className="img-fluid profile1 me-2"
                          />
                          <div className="addcarts-lyte2 ms-3">{count}</div>
                        </Link>
                      </div>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="d-flex flex-column">
                <span className="me-4 pe-2">Hello User</span>
                <span className="ms-4">No profile available</span>
              </div>
            )}
          </div>
        </div>

        <div className="container">
          <div className="row d-flex justify-content-start text-center align-items-start mt-0">
            <div className="col-12 col-md-8 d-flex align-items-center mb-4 mt-0 d-flex flex-row">
              <img
                src={Tonic}
                alt="404"
                className="img-fluid me-3 me-md-0 mt-0 mt-lg-2"
              />

              <div className="input-welcome7 d-flex flex-row align-items-center mt-3">
                <input
                  type="search"
                  className="form-control p-2 border-1 mt-sm-3 border py-4 input-home rounded-0 d-lg-block d-none me-0"
                  placeholder="Search For Product"
                />

                <div className="d-lg-block d-none w-75 ">
                  <select
                    className="form-select rounded-0 border-0 mt-3"
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
                  <button className="ms-1 btn btn-success d-flex mt-3 py-4 px-3 rounded-0 justify-content-center align-items-center">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container lorem-home d-none d-lg-block">
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
                    <Link to="/" className="nav-link fw-medium text-success">
                      Home
                    </Link>
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
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="d-none d-md-flex align-items-center mt-3 mt-md-0">
              <FontAwesomeIcon
                icon={faPhoneVolume}
                className="text-success me-2 mt-0 fw-medium"
              />
              <span className="fw-medium" style={{ fontFamily: "verdana" }}>
                1800-654-3210
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
                  <Link to="/user/dashboard" className="text-dark">
                    <img src={Over} alt="404" className="me-2" />
                    Overview
                  </Link>
                </li>

                <li>
                  <Link to="/user/orders" className="text-dark">
                    <img src={Cart_user} alt="404" className="me-2" />
                    Orders
                  </Link>
                </li>

                <li>
                  <Link to="/user/product-reviews" className="text-dark">
                    <img src={Cart_reviews} alt="404" className="me-2" />
                    Reviews
                  </Link>
                </li>

                <li>
                  <Link to="/user/downloads" className="text-dark">
                    <img src={Cart_download} alt="404" className="me-2" />
                    Downloads
                  </Link>
                </li>

                <li>
                  <Link to="/user/order-returns" className="text-dark">
                    <img src={Cart_order} alt="404" className="me-2" />
                    Order Returns Requets
                  </Link>
                </li>

                <li>
                  <Link to="/user/address" className="text-dark">
                    <img src={Address} alt="404" className="me-2" />
                    Addresses
                  </Link>
                </li>

                <li>
                  <Link to={`/user/edit-account/${1}`} className="text-dark">
                    <img src={Cart_setting} alt="404" className="me-2" />
                    Account Settings
                  </Link>
                </li>

                <li>
                  <img src={Cart_logout} alt="404" className="me-2" />
                  Logout
                </li>
              </ul>
            </div>

            <div className="col-12 col-sm-12 col-md-12 col-lg-6 bg-body shadow-lg customer-dashboard1 text-start rounded-0 mb-2 mb-lg-0 ms-lg-1 ms-sm-0 border d-flex flex-column py-5 overflow-hidden letter-typo ms-md-2">
              <div className="d-flex flex-row ms-1 mb-4 gap-0">
                <button
                  class="btn py-4 d-flex address-account border rounded-0 address-profile border-end-0"
                  id="profile-btn"
                >
                  <Link
                    className="text-decoration-none"
                    to={`/user/edit-account/${1}`}
                    style={{ color: "#0c55aa" }}
                  >
                    Profile
                  </Link>
                </button>

                <button class="btn py-4 d-flex address-account border rounded-0 address-profile">
                  <Link
                    className="text-decoration-none"
                    style={{ color: "#0c55aa" }}
                    to={`/user/change-password/${user.id}`}
                  >
                    Change Password
                  </Link>
                </button>
              </div>
              <form action="" method="" className="w-100">
                <div className="d-flex justify-content- name-user w-100 gap-3">
                  <div className="d-flex flex-column justify-content-between w-100">
                    <label htmlFor="">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter name"
                      className="form-control mt-2 py-4 address-name"
                      name="name"
                      value={name}
                      onChange={onInputChange}
                    />
                    {errors.name && (
                      <div className="text-danger">{errors.name}</div>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <label htmlFor="">Date of birth</label>
                  <input
                    type="date"
                    className="form-control mt-2 py-4 address-name"
                    name="date"
                    value={date}
                    onChange={onInputChange}
                    style={{
                      cursor: "pointer",
                      zIndex: "1000",
                      position: "relative",
                    }}
                  />
                  {errors.date && (
                    <div className="text-danger">{errors.date}</div>
                  )}
                </div>

                <div className="mt-3">
                  <label htmlFor="">Email</label>
                  <input
                    type="email"
                    className="form-control mt-2 py-4 address-name"
                    name="email"
                    value={email}
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
                    name="phone"
                    value={phone}
                    onChange={onInputChange}
                  />
                  {errors.phone && (
                    <div className="text-danger">{errors.phone}</div>
                  )}
                </div>

                <button
                  className="btn btn-success d-flex ms-2 mt-3 py-4 rounded-0 letter-typo"
                  onClick={handleSubmit}
                >
                  Update
                </button>

                {/* <div className="address-name mt-3 border rounded address-account lh-lg">
                  <p className="ms-3 mt-3 mb-1 text-danger fw-bold">
                    Delete account
                  </p>
                  <p className="ms-3">
                    This action will permanently delete your account and all
                    associated data and irreversible. Please be sure before
                    proceeding.
                  </p>
                  <button
                    className="ms-3 mb-3 btn btn-outline-danger d-flex py-4 address-account rounded-0"
                    onClick={() => deleteAccount(data.id)}
                  >
                    Delete your account
                  </button>
                </div> */}
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
export default CustomerAccount;
