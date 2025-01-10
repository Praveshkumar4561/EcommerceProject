import React, { useContext, useEffect, useState } from "react";
import "./CustomerDashEdit.css";
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
import Profile from "../../assets/image.png";
import Cart from "../../assets/Cart.svg";
import UserContext from "../../context/UserContext";
import Over from "../../assets/Over.png";
import Address from "../../assets/Cart_address.png";
import Cart_order from "../../assets/Cart_request.png";
import Cart_reviews from "../../assets/Cart_reviews.png";
import Cart_download from "../../assets/Cart_download.png";
import Cart_setting from "../../assets/Cart_setting.png";
import Cart_logout from "../../assets/Cart_logout.png";
import Cart_user from "../../assets/Cart_user.png";
import axios from "axios";

function CustomerDashEdit() {
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

  let navigate = useNavigate();

  let [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    country: "",
    state: "",
    city: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    country: "",
    state: "",
    city: "",
    address: "",
  });

  let { id } = useParams();

  const { name, phone, email, country, state, city, address } = user;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.put(
          `http://50.18.56.183:1600/dashboardedit/${id}`,
          user
        );
        setUser(response.data);
        navigate("/user/address");
      } catch (error) {
        console.error("Error occurred", error);
      }
    }
  };

  useEffect(() => {
    somedata();
  }, []);

  let somedata = async () => {
    let response = await axios.get(
      `http://50.18.56.183:1600/dashboardsome/${id}`,
      user
    );
    setUser(response.data[0]);
  };

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!name) {
      formErrors.name = "Name is required";
      isValid = false;
    }

    if (!phone) {
      formErrors.phone = "Phone number is required";
      isValid = false;
    }

    if (!email) {
      formErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!country) {
      formErrors.country = "Country is required";
      isValid = false;
    }

    if (!state) {
      formErrors.state = "State is required";
      isValid = false;
    }

    if (!state) {
      formErrors.city = "city is required";
      isValid = false;
    }

    if (!address) {
      formErrors.address = "Address is required";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [edit, setEdit] = useState([]);

  useEffect(() => {
    const editData = async () => {
      try {
        let response = await axios.get("http://50.18.56.183:1600/getannounce");
        setEdit(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    editData();
  }, []);

  const leftData = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : edit.length - 1
    );
  };

  const rightData = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < edit.length - 1 ? prevIndex + 1 : 0
    );
  };



   const [auth, setAuth] = useState(true);
   const [message, setMessage] = useState("");
 
   let handleDelete = () => {
     axios.defaults.withCredentials = false;
     axios
       .get("http://50.18.56.183:1600/logout")
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

  let [detail, setDetail] = useState([]);

  let userdata = async () => {
    let response = await axios.get("http://50.18.56.183:1600/alldata");
    setDetail(response.data);
  };
  userdata();

  return (
    <>
      <div className="container-fluid">
        <div className="row align-items-center justify-content-between text-center mt-lg-2 mt-0 pt-0 pt-lg-1">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-md-start align-items-center ps-4 lorem-home">
            {edit.length > 0 && (
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
                    {edit[currentIndex]
                      ? edit[currentIndex].content
                      : "Loading..."}
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
              <div className="no-details"></div>
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

              <div className="input-welcome6 d-flex flex-row align-items-center mt-3">
                <input
                  type="search"
                  className="form-control p-2 border-1 mt-sm-3 border py-4 input-home rounded-0 d-lg-block d-none me-0"
                  placeholder="Search For Product"
                />

                <div className="d-lg-block d-none">
                  <select className="form-select rounded-0 border-0 mt-1">
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

                <li onClick={handleDelete} style={{ cursor: "pointer" }}>
                  <img src={Cart_logout} alt="Logout" className="me-2" />
                  Logout
                </li>
              </ul>
            </div>

            <div className="col-12 col-sm-12 col-md-12 col-lg-6 bg-body shadow-lg customer-dashboard1 text-start rounded-0 mb-2 mb-lg-0 ms-lg-1 ms-sm-0 border d-flex flex-column py-5 overflow-hidden letter-typo ms-md-2">
              <form action="" method="" className="w-100">
                <div className="d-flex justify-content- name-user w-100 gap-3">
                  <div className="d-flex flex-column justify-content-between w-100">
                    <label htmlFor="">Name</label>
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
                  <div className="d-flex flex-column w-100 ms-0 ms-lg- mt-0 mt-lg-0">
                    <label htmlFor="">Phone</label>
                    <input
                      type="number"
                      placeholder="Enter phone"
                      className="form-control mt-2 py-4 address-name"
                      name="phone"
                      value={phone}
                      onChange={onInputChange}
                    />
                    {errors.phone && (
                      <div className="text-danger">{errors.phone}</div>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <label htmlFor="">Email</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    className="form-control mt-2 py-4 address-name"
                    name="email"
                    value={email}
                    onChange={onInputChange}
                  />
                  {errors.email && (
                    <div className="text-danger">{errors.email}</div>
                  )}
                </div>

                <div className="mt-3">
                  <label htmlFor="">Country</label>
                  <select
                    className="form-select mt-2 address-name"
                    style={{ height: "49px" }}
                    name="country"
                    value={country}
                    onChange={onInputChange}
                  >
                    <option value="" selected="">
                      Select country
                    </option>
                    <option value="AF">Afghanistan</option>
                    <option value="AX">Åland Islands</option>
                    <option value="AL">Albania</option>
                    <option value="DZ">Algeria</option>
                    <option value="AS">American Samoa</option>
                    <option value="AD">Andorra</option>
                    <option value="AO">Angola</option>
                    <option value="AI">Anguilla</option>
                    <option value="AQ">Antarctica</option>
                    <option value="AG">Antigua and Barbuda</option>
                    <option value="AR">Argentina</option>
                    <option value="AM">Armenia</option>
                    <option value="AW">Aruba</option>
                    <option value="AU">Australia</option>
                    <option value="AT">Austria</option>
                    <option value="AZ">Azerbaijan</option>
                    <option value="BS">Bahamas</option>
                    <option value="BH">Bahrain</option>
                    <option value="BD">Bangladesh</option>
                    <option value="BB">Barbados</option>
                    <option value="BY">Belarus</option>
                    <option value="BE">Belgium</option>
                    <option value="PW">Belau</option>
                    <option value="BZ">Belize</option>
                    <option value="BJ">Benin</option>
                    <option value="BM">Bermuda</option>
                    <option value="BT">Bhutan</option>
                    <option value="BO">Bolivia</option>
                    <option value="BQ">
                      Bonaire, Saint Eustatius and Saba
                    </option>
                    <option value="BA">Bosnia and Herzegovina</option>
                    <option value="BW">Botswana</option>
                    <option value="BV">Bouvet Island</option>
                    <option value="BR">Brazil</option>
                    <option value="IO">British Indian Ocean Territory</option>
                    <option value="BN">Brunei</option>
                    <option value="BG">Bulgaria</option>
                    <option value="BF">Burkina Faso</option>
                    <option value="BI">Burundi</option>
                    <option value="KH">Cambodia</option>
                    <option value="CM">Cameroon</option>
                    <option value="CA">Canada</option>
                    <option value="CV">Cape Verde</option>
                    <option value="KY">Cayman Islands</option>
                    <option value="CF">Central African Republic</option>
                    <option value="TD">Chad</option>
                    <option value="CL">Chile</option>
                    <option value="CN">China</option>
                    <option value="CX">Christmas Island</option>
                    <option value="CC">Cocos (Keeling) Islands</option>
                    <option value="CO">Colombia</option>
                    <option value="KM">Comoros</option>
                    <option value="CG">Congo (Brazzaville)</option>
                    <option value="CD">Congo (Kinshasa)</option>
                    <option value="CK">Cook Islands</option>
                    <option value="CR">Costa Rica</option>
                    <option value="HR">Croatia</option>
                    <option value="CU">Cuba</option>
                    <option value="CW">Curaçao</option>
                    <option value="CY">Cyprus</option>
                    <option value="CZ">Czech Republic</option>
                    <option value="DK">Denmark</option>
                    <option value="DJ">Djibouti</option>
                    <option value="DM">Dominica</option>
                    <option value="DO">Dominican Republic</option>
                    <option value="EC">Ecuador</option>
                    <option value="EG">Egypt</option>
                    <option value="SV">El Salvador</option>
                    <option value="GQ">Equatorial Guinea</option>
                    <option value="ER">Eritrea</option>
                    <option value="EE">Estonia</option>
                    <option value="ET">Ethiopia</option>
                    <option value="FK">Falkland Islands</option>
                    <option value="FO">Faroe Islands</option>
                    <option value="FJ">Fiji</option>
                    <option value="FI">Finland</option>
                    <option value="FR">France</option>
                    <option value="GF">French Guiana</option>
                    <option value="PF">French Polynesia</option>
                    <option value="TF">French Southern Territories</option>
                    <option value="GA">Gabon</option>
                    <option value="GM">Gambia</option>
                    <option value="GE">Georgia</option>
                    <option value="DE">Germany</option>
                    <option value="GH">Ghana</option>
                    <option value="GI">Gibraltar</option>
                    <option value="GR">Greece</option>
                    <option value="GL">Greenland</option>
                    <option value="GD">Grenada</option>
                    <option value="GP">Guadeloupe</option>
                    <option value="GU">Guam</option>
                    <option value="GT">Guatemala</option>
                    <option value="GG">Guernsey</option>
                    <option value="GN">Guinea</option>
                    <option value="GW">Guinea-Bissau</option>
                    <option value="GY">Guyana</option>
                    <option value="HT">Haiti</option>
                    <option value="HM">
                      Heard Island and McDonald Islands
                    </option>
                    <option value="HN">Honduras</option>
                    <option value="HK">Hong Kong</option>
                    <option value="HU">Hungary</option>
                    <option value="IS">Iceland</option>
                    <option value="IN">India</option>
                    <option value="ID">Indonesia</option>
                    <option value="IR">Iran</option>
                    <option value="IQ">Iraq</option>
                    <option value="IE">Ireland</option>
                    <option value="IM">Isle of Man</option>
                    <option value="IL">Israel</option>
                    <option value="IT">Italy</option>
                    <option value="CI">Ivory Coast</option>
                    <option value="JM">Jamaica</option>
                    <option value="JP">Japan</option>
                    <option value="JE">Jersey</option>
                    <option value="JO">Jordan</option>
                    <option value="KZ">Kazakhstan</option>
                    <option value="KE">Kenya</option>
                    <option value="KI">Kiribati</option>
                    <option value="KW">Kuwait</option>
                    <option value="XK">Kosovo</option>
                    <option value="KG">Kyrgyzstan</option>
                    <option value="LA">Laos</option>
                    <option value="LV">Latvia</option>
                    <option value="LB">Lebanon</option>
                    <option value="LS">Lesotho</option>
                    <option value="LR">Liberia</option>
                    <option value="LY">Libya</option>
                    <option value="LI">Liechtenstein</option>
                    <option value="LT">Lithuania</option>
                    <option value="LU">Luxembourg</option>
                    <option value="MO">Macao</option>
                    <option value="MK">North Macedonia</option>
                    <option value="MG">Madagascar</option>
                    <option value="MW">Malawi</option>
                    <option value="MY">Malaysia</option>
                    <option value="MV">Maldives</option>
                    <option value="ML">Mali</option>
                    <option value="MT">Malta</option>
                    <option value="MH">Marshall Islands</option>
                    <option value="MQ">Martinique</option>
                    <option value="MR">Mauritania</option>
                    <option value="MU">Mauritius</option>
                    <option value="YT">Mayotte</option>
                    <option value="MX">Mexico</option>
                    <option value="FM">Micronesia</option>
                    <option value="MD">Moldova</option>
                    <option value="MC">Monaco</option>
                    <option value="MN">Mongolia</option>
                    <option value="ME">Montenegro</option>
                    <option value="MS">Montserrat</option>
                    <option value="MA">Morocco</option>
                    <option value="MZ">Mozambique</option>
                    <option value="MM">Myanmar</option>
                    <option value="NA">Namibia</option>
                    <option value="NR">Nauru</option>
                    <option value="NP">Nepal</option>
                    <option value="NL">Netherlands</option>
                    <option value="NC">New Caledonia</option>
                    <option value="NZ">New Zealand</option>
                    <option value="NI">Nicaragua</option>
                    <option value="NE">Niger</option>
                    <option value="NG">Nigeria</option>
                    <option value="NU">Niue</option>
                    <option value="NF">Norfolk Island</option>
                    <option value="MP">Northern Mariana Islands</option>
                    <option value="KP">North Korea</option>
                    <option value="NO">Norway</option>
                    <option value="OM">Oman</option>
                    <option value="PK">Pakistan</option>
                    <option value="PS">Palestinian Territory</option>
                    <option value="PA">Panama</option>
                    <option value="PG">Papua New Guinea</option>
                    <option value="PY">Paraguay</option>
                    <option value="PE">Peru</option>
                    <option value="PH">Philippines</option>
                    <option value="PN">Pitcairn</option>
                    <option value="PL">Poland</option>
                    <option value="PT">Portugal</option>
                    <option value="PR">Puerto Rico</option>
                    <option value="QA">Qatar</option>
                    <option value="RE">Reunion</option>
                    <option value="RO">Romania</option>
                    <option value="RU">Russia</option>
                    <option value="RW">Rwanda</option>
                    <option value="BL">Saint Barthélemy</option>
                    <option value="SH">Saint Helena</option>
                    <option value="KN">Saint Kitts and Nevis</option>
                    <option value="LC">Saint Lucia</option>
                    <option value="MF">Saint Martin (French part)</option>
                    <option value="SX">Saint Martin (Dutch part)</option>
                    <option value="PM">Saint Pierre and Miquelon</option>
                    <option value="VC">Saint Vincent and the Grenadines</option>
                    <option value="SM">San Marino</option>
                    <option value="ST">São Tomé and Príncipe</option>
                    <option value="SA">Saudi Arabia</option>
                    <option value="SN">Senegal</option>
                    <option value="RS">Serbia</option>
                    <option value="SC">Seychelles</option>
                    <option value="SL">Sierra Leone</option>
                    <option value="SG">Singapore</option>
                    <option value="SK">Slovakia</option>
                    <option value="SI">Slovenia</option>
                    <option value="SB">Solomon Islands</option>
                    <option value="SO">Somalia</option>
                    <option value="ZA">South Africa</option>
                    <option value="GS">South Georgia/Sandwich Islands</option>
                    <option value="KR">South Korea</option>
                    <option value="SS">South Sudan</option>
                    <option value="ES">Spain</option>
                    <option value="LK">Sri Lanka</option>
                    <option value="SD">Sudan</option>
                    <option value="SR">Suriname</option>
                    <option value="SJ">Svalbard and Jan Mayen</option>
                    <option value="SZ">Swaziland</option>
                    <option value="SE">Sweden</option>
                    <option value="CH">Switzerland</option>
                    <option value="SY">Syria</option>
                    <option value="TW">Taiwan</option>
                    <option value="TJ">Tajikistan</option>
                    <option value="TZ">Tanzania</option>
                    <option value="TH">Thailand</option>
                    <option value="TL">Timor-Leste</option>
                    <option value="TG">Togo</option>
                    <option value="TK">Tokelau</option>
                    <option value="TO">Tonga</option>
                    <option value="TT">Trinidad and Tobago</option>
                    <option value="TN">Tunisia</option>
                    <option value="TR">Turkey</option>
                    <option value="TM">Turkmenistan</option>
                    <option value="TC">Turks and Caicos Islands</option>
                    <option value="TV">Tuvalu</option>
                    <option value="UG">Uganda</option>
                    <option value="UA">Ukraine</option>
                    <option value="AE">United Arab Emirates</option>
                    <option value="GB">United Kingdom (UK)</option>
                    <option value="US">United States (US)</option>
                    <option value="UM">
                      United States (US) Minor Outlying Islands
                    </option>
                    <option value="UY">Uruguay</option>
                    <option value="UZ">Uzbekistan</option>
                    <option value="VU">Vanuatu</option>
                    <option value="VA">Vatican</option>
                    <option value="VE">Venezuela</option>
                    <option value="VN">Vietnam</option>
                    <option value="VG">Virgin Islands (British)</option>
                    <option value="VI">Virgin Islands (US)</option>
                    <option value="WF">Wallis and Futuna</option>
                    <option value="EH">Western Sahara</option>
                    <option value="WS">Samoa</option>
                    <option value="YE">Yemen</option>
                    <option value="ZM">Zambia</option>
                    <option value="ZW">Zimbabwe</option>
                  </select>
                  {errors.country && (
                    <div className="text-danger">{errors.country}</div>
                  )}
                </div>

                <div className="mt-3">
                  <label htmlFor="">State</label>
                  <input
                    type="text"
                    className="form-control mt-2 py-4 address-name"
                    name="state"
                    value={state}
                    onChange={onInputChange}
                  />
                  {errors.state && (
                    <div className="text-danger">{errors.state}</div>
                  )}
                </div>

                <div className="mt-3">
                  <label htmlFor="">City</label>
                  <input
                    type="text"
                    className="form-control mt-2 py-4 address-name"
                    name="city"
                    value={city}
                    onChange={onInputChange}
                  />
                  {errors.city && (
                    <div className="text-danger">{errors.city}</div>
                  )}
                </div>

                <div className="mt-3">
                  <label htmlFor="">Address</label>
                  <input
                    type="text"
                    placeholder="Enter address"
                    className="form-control mt-2 py-4 address-name"
                    name="address"
                    value={address}
                    onChange={onInputChange}
                  />
                  {errors.address && (
                    <div className="text-danger">{errors.address}</div>
                  )}
                </div>

                <div className="mt-3 d-flex flex-row ms-lg-1 gap-2">
                  <input type="checkbox" className="form-check-input" />
                  <label htmlFor="">Use this address as default.</label>
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
export default CustomerDashEdit;
