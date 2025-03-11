import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Checkout.css";
import Tonic from "../../assets/Tonic.svg";
import Hamburger from "../../assets/hamburger.svg";
import Close from "../../assets/Close.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import UserContext from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import { Helmet } from "react-helmet";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Checkout() {
  let { count, setCount } = useContext(UserContext);
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

  let [cart, setCart] = useState([]);

  useEffect(() => {
    const cartdata = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/allcartdata"
        );
        const updatedData = response.data.map((item) => ({
          ...item,
          quantity: 1,
          total: "",
          tax: "",
        }));
        setCart(updatedData);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    cartdata();
  }, []);

  const subtotal = cart.reduce((acc, curr) => {
    const price = parseFloat(curr.price.replace("$", "").trim());
    return !isNaN(price) ? acc + price * curr.quantity : acc;
  }, 0);
  const tax = subtotal * 0.15;
  const total = subtotal + tax;

  const updateQuantity = (id, action) => {
    const updatedUser = cart.map((item) => {
      if (item.id === id) {
        const updatedQuantity =
          action === "increase" ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: Math.max(updatedQuantity, 1) };
      }
      return item;
    });
    setCart(updatedUser);
  };

  const [user, setUser] = useState({
    email: "",
    phone_number: "",
    first_name: "",
    last_name: "",
    address: "",
    apartment: "",
    country: "",
    pincode: "",
    date: "",
  });

  const [errors, setErrors] = useState({});
  const [container, setContainer] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser((prevUser) => ({
          ...prevUser,
          email: parsedUser.email || "",
          phone_number: parsedUser.phone_number || "",
          first_name: parsedUser.first_name || "",
          last_name: parsedUser.last_name || "",
        }));
        setContainer(parsedUser);
      } catch (err) {
        console.error("Error parsing stored user data:", err);
      }
    }
  }, []);

  const onCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    Object.keys(user).forEach((key) => {
      if (
        key !== "email" &&
        key !== "phone_number" &&
        key !== "first_name" &&
        key !== "last_name" &&
        !user[key]
      ) {
        newErrors[key] = "This field is required.";
      }
    });
    if (!isChecked) {
      newErrors.checkbox = "You must agree to the terms and privacy policy.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    const orderData = {
      ...user,
      cart: cart.map((item) => ({
        image: item.image,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        store: item.store,
        subtotal: item.quantity * parseFloat(item.price.replace("$", "")),
        tax: item.quantity * parseFloat(item.price.replace("$", "")) * 0.15,
      })),
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shippingFee: 0,
      total: total.toFixed(2),
    };
    try {
      const response = await axios.post(
        "http://89.116.170.231:1600/checkout",
        orderData
      );
      setCount(0);
      setCart([]);
      toast.success(
        `Order successfully placed. Your order number is ${response.data.orderNumber}`,
        {
          position: "bottom-right",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        }
      );
    } catch (error) {
      toast.error("Order is not the placed", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  let [selectedPayment, setSelectedPayment] = useState(null);

  const handlePaymentSelection = (paymentMethod) => {
    setSelectedPayment(paymentMethod);
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

  let [check, setCheck] = useState("");

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/get-theme-breadcrumb"
        );
        setCheck(response.data);
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

  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <>
      <Helmet>
        <title>Secure Checkout - Complete Your Purchase | Rxlyte</title>
        <meta
          name="description"
          content="Complete your purchase securely with our fast and safe checkout process. Enjoy hassle-free payments and quick order processing at Rxlyte."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://srv724100.hstgr.cloud/checkout" />
      </Helmet>

      <div
        className="container"
        id="container-customx"
        style={{
          backgroundColor:
            check?.background_color ||
            (check?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: check?.background_image
            ? `url(http://89.116.170.231:1600/src/image/${check.background_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: check?.breadcrumb_height
            ? `${check.breadcrumb_height}px`
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

          <main className="container mt-5 cart-cart container-bread">
            {check?.enable_breadcrumb === "yes" &&
              check?.breadcrumb_style !== "none" && (
                <>
                  {check?.hide_title !== "yes" && (
                    <h1
                      className={`fw-medium mb-3 text-center container-contact fs-2 container-style ${
                        check?.breadcrumb_style === "without title"
                          ? "d-none"
                          : ""
                      }`}
                    >
                      Checkout
                    </h1>
                  )}

                  <nav
                    aria-label="breadcrumb"
                    id="container-contact1"
                    className={`ms-5 ps-3 ms-lg-0 ps-lg-0 ${
                      check?.breadcrumb_style === "without title" ||
                      check?.breadcrumb_style === "align start"
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
                        Checkout
                      </li>
                    </ol>
                  </nav>
                </>
              )}
          </main>
        </div>
      </div>
      <div></div>

      <div className="d-flex flex-column demo-shipping mt-4 cart-cart1">
        <h2 className="pills">Pill Demo</h2>
        <p className="text-dark">Cart/Information/Shipping/Payment</p>
      </div>

      <div className="container-fluid overflow-hidden">
        <div className="container ms-0 ms-lg-2">
          <div className="row mt-3 gap-0 d-flex justify-content-lg-start flex-row flex-lg-nowrap flex-xl-nowrap flex-xxl-nowrap me-0 me-lg-0">
            <div className="col-12 col-md-6 col-lg-12 col-xl-12 contact-page1 h-auto pb-5">
              <div className="d-flex flex-row justify-content-between cart-cart flex-wrap">
                <h4
                  className="mt-3 ms-lg-2 text-start d-flex fw-medium"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Contact Information
                </h4>
                <p className="text-dark pt-5 mb-0 ps-lg-3 cart-cart text-start">
                  Already have an account?
                  <Link
                    className="text-dark text-decoration-none ms-1"
                    to={`/${url.login}`}
                  >
                    Log in
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {container && Object.keys(container).length > 0 ? (
                  <div>
                    <div className="ms-0 ms-lg-2">
                      <input
                        type="email"
                        className="form-control border-start border-end py-4 border-place1 fw-medium text-dark"
                        placeholder="Email"
                        name="email"
                        value={user.email}
                        onChange={onInputChange}
                      />
                    </div>

                    <div className="ms-0 ms-lg-2 mt-3">
                      <input
                        type="text"
                        className="form-control py-4 border-place1 fw-medium text-dark border-start border-end"
                        placeholder="Phone number"
                        name="phone_number"
                        value={user.phone_number}
                        onChange={onInputChange}
                      />
                    </div>

                    <h4 className="mt-3 ms-lg-3 text-start fw-medium cart-cart">
                      Shipping Address
                    </h4>

                    <div className="global-name">
                      <div className="d-flex gap-3 ms-lg-2 ms-0 mt-3">
                        <input
                          type="text"
                          placeholder="First name"
                          className="form-control fw-medium py-4 border-place1 border-start border-end"
                          name="first_name"
                          value={user.first_name}
                          onChange={onInputChange}
                        />
                        <input
                          type="text"
                          placeholder="Last name"
                          className="form-control fw-medium py-4 border-place1 border-start border-end"
                          name="last_name"
                          value={user.last_name}
                          onChange={onInputChange}
                        />
                      </div>

                      <div className="ms-lg-2 ms-0 text-start">
                        <input
                          type="text"
                          placeholder="Address*"
                          className="form-control py-4 mt-4 ms-0 fw-medium border-place1 border-start border-end"
                          name="address"
                          value={user.address}
                          onChange={onInputChange}
                        />
                        {errors.address && (
                          <span className="text-danger cart-cart">
                            {errors.address}
                          </span>
                        )}
                      </div>

                      <div className="ms-lg-2 ms-0 text-start">
                        <input
                          type="text"
                          placeholder="Apartment"
                          className="form-control py-4 mt-4 fw-medium border-place1 border-start border-end"
                          name="apartment"
                          value={user.apartment}
                          onChange={onInputChange}
                        />
                        {errors.apartment && (
                          <span className="text-danger cart-cart">
                            {errors.apartment}
                          </span>
                        )}
                      </div>

                      <div className="d-flex gap-3 ms-lg-2 ms-0 mt-4 text-start">
                        <div className="d-flex flex-column w-100">
                          <input
                            type="text"
                            placeholder="Country"
                            className="form-control fw-medium py-4 border-place1 border-start border-end"
                            name="country"
                            value={user.country}
                            onChange={onInputChange}
                          />
                          {errors.country && (
                            <span className="text-danger cart-cart">
                              {errors.country}
                            </span>
                          )}
                        </div>
                        <div className="d-flex flex-column w-100 text-start">
                          <input
                            type="text"
                            placeholder="Postal Code"
                            className="form-control fw-medium py-4 border-place1 border-start border-end"
                            name="pincode"
                            value={user.pincode}
                            onChange={onInputChange}
                          />
                          {errors.pincode && (
                            <span className="text-danger cart-cart">
                              {errors.pincode}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="d-flex gap-3 ms-lg-2 ms-0 mt-4 text-start">
                        <div className="d-flex flex-column w-100">
                          <DatePicker
                            selected={selectedDate}
                            onChanges={(date) => setSelectedDate(date)}
                            placeholderText="Remind me/Followup for next ord"
                            dateFormat="dd-MM-yyyy"
                            className="form-control fw-medium py-4 border-place1 border-start border-end cart-cart111"
                            name="date"
                            value={user.date}
                            onChange={onInputChange}
                          />
                          <div className="d-flex justify-content-end align-items-end w-100">
                            <FontAwesomeIcon
                              icon={faCalendarDays}
                              className="position-absolute fs-4 me-2 m-0 mb-2 pb-1"
                              onClick={() =>
                                document
                                  .querySelector("input[name='date']")
                                  .focus()
                              }
                            />

                            {errors?.date && (
                              <span className="text-danger cart-cart">
                                {errors.date}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="d-flex flex-column w-100 text-start">
                          <select
                            className="form-select border-place1-check cart-cart"
                            style={{ height: "48.3px" }}
                            defaultValue=""
                          >
                            <option disabled>Heard About Us</option>
                            <option value="">Please select</option>
                            <option value="Returning Customer">
                              Returning Customer
                            </option>
                            <option value="By google">By google</option>
                            <option value="I searched on web">
                              I searched on web
                            </option>
                            <option value="Doctor recommended me">
                              Doctor recommended me
                            </option>
                            <option value="someone referred me">
                              someone referred me
                            </option>
                            <option value="Through Blogs/Forums">
                              Through Blogs/Forums
                            </option>
                            <option value="Others">Others</option>
                          </select>
                        </div>
                      </div>

                      <div className="ms-lg-2 ms-0 text-start">
                        <select
                          className="form-select mt-4 border-place1-check cart-cart"
                          style={{ height: "47px" }}
                        >
                          <option value="">Please select</option>
                          <option value="Email">Email</option>
                          <option value="Phone">Phone</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Sms">Sms</option>
                        </select>
                      </div>

                      <div className="d-flex flex-row gap-2 ms-2 mt-3 cart-cart">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isChecked}
                          onChange={onCheckboxChange}
                        />
                        <div className="d-flex flex-column">
                          <label htmlFor="">
                            I agree to the{" "}
                            <Link
                              className="text-success text-decoration-underline"
                              to="/privacy-policy"
                            >
                              Terms and Privacy Policy.
                            </Link>
                          </label>
                          {errors.checkbox && (
                            <span className="text-danger">
                              {errors.checkbox}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="d-flex flex-row gap-2 text-success mt-3 ms-1 ps-2 cart-cart">
                        <FontAwesomeIcon
                          icon={faArrowLeft}
                          className="mt-1 fs-6"
                        />
                        <Link
                          className="text-success text-decoration-none"
                          to={`/${url.cart}`}
                        >
                          Back to Cart
                        </Link>
                      </div>
                    </div>

                    <button className="btn btn-success d-flex mt-4 ms-lg-2 px-3 py-4 button-shipping rounded-0">
                      Checkout
                    </button>
                  </div>
                ) : (
                  <>
                    <div></div>
                  </>
                )}
              </form>
            </div>

            <div className="col-12 col-md-6 col-lg-12 col-xl-12 col-xxl-3 mt-lg-3 mt-xl-3 mt-md-3 mt-sm-2 mt-xxl-0">
              <div className="container d-flex flex-column justify-content-lg-center mt-lg-0 align-items-lg-start align-items-xxl-center align-items-sm-start">
                {cart.map((data, key) => (
                  <>
                    <div
                      className="col d-flex ms-xxl-0 ms-xl-0 ps-xxl-0 ps-xl-2 mt-2 mt-lg-0 ps-1 ps-sm-0 flex-row ms-sm-0"
                      key={key}
                    >
                      <div className="lorem-border rounded-0">
                        <div className="position-absolute number-item bg-success border text-light rounded-5 px-2">
                          {data.quantity}
                        </div>

                        <img
                          src={`http://89.116.170.231:1600/src/image/${data.image}`}
                          alt="RxLYTE"
                          className="img- border rounded-0 number-item-img"
                        />
                        <p
                          className="fw-medium float-end dollar-price cart-cart"
                          style={{ fontFamily: "verdana" }}
                        >
                          {data.price}
                        </p>
                      </div>
                      <div className="d-flex flex-column gap-0 mt-2 ms-2">
                        <h6 className="fw-bol cart-cart">{data.name}</h6>
                        <p>{data.store}</p>
                      </div>
                    </div>
                    <div
                      className="border rounded-5 me-2 bg-light increment-plus mt-2"
                      style={{ cursor: "pointer" }}
                    >
                      <span
                        className="ms-4 fw-medium fs-4"
                        onClick={() => updateQuantity(data.id, "decrease")}
                      >
                        -
                      </span>
                      <span className="ms-4 fw-medium fs-5">
                        {data.quantity}
                      </span>
                      <span
                        className="ms-4 fw-medium fs-4 me-3"
                        onClick={() => updateQuantity(data.id, "increase")}
                      >
                        +
                      </span>
                    </div>
                  </>
                ))}

                <div className="process d-flex flex-column me-lg-3 lh-base">
                  <div className="mt-4 d-flex justify-content-between flex-row w-100">
                    <span className="ms-3">Subtotal:</span>
                    <span className="me-3" style={{ fontFamily: "verdana" }}>
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-3 d-flex justify-content-between flex-row w-100">
                    <span className="ms-md-3 ms-3">
                      Tax (Import Tax - 15%):
                    </span>
                    <span className="me-3" style={{ fontFamily: "verdana" }}>
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-3 d-flex justify-content-between flex-row w-100">
                    <span className="ms-3">Shipping fee:</span>
                    <span className="me-3" style={{ fontFamily: "verdana" }}>
                      $0.00
                    </span>
                  </div>
                  <div className="mt-3 d-flex justify-content-between flex-row w-100">
                    <span className="ms-3">Total:</span>
                    <span className="me-3" style={{ fontFamily: "verdana" }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>

      <h4 className="mt-lg-3 mt-2 mt-sm-3 cart-cart ms-lg-3 ms-0 w-50 mb-3 payment-span text-lg-start text-xl-start text-xxl-center">
        Payment method
      </h4>

      <div className="container-fluid cart-cart">
        <div className="container">
          <div className="row mt-0">
            <div className="col-12 col-md-12 col-lg-8 border rounded lh-lg bg-light payment-methods ms-lg-1 ms-0">
              <div className="d-flex flex-row mt-2 py-2">
                <input
                  type="radio"
                  className="form-check-input mt-2"
                  name="payment"
                  id="Cash on Delivery (COD)"
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePaymentSelection("COD")}
                />
                <div className="d-flex flex-column ms-1">
                  <label
                    htmlFor="Cash on Delivery (COD)"
                    className="ms-2 text-start"
                    style={{ cursor: "pointer" }}
                  >
                    Cash on Delivery (COD)
                  </label>
                  {selectedPayment === "COD" && (
                    <label htmlFor="" className="ms-2 text-start">
                      Please pay money directly to the postman, if you choose
                      cash on delivery method (COD).
                    </label>
                  )}
                </div>
              </div>

              <div className="border w-100 mt-2"></div>

              <div className="d-flex flex-row mt-2 py-2">
                <input
                  type="radio"
                  className="form-check-input mt-2"
                  name="payment"
                  id="payment-stripe"
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePaymentSelection("Stripe")}
                />
                <div className="d-flex flex-column ms-1">
                  <label
                    htmlFor="payment-stripe"
                    className="ms-2 text-start"
                    style={{ cursor: "pointer" }}
                  >
                    Pay online via Stripe (International and Domestic)
                  </label>
                  {selectedPayment === "Stripe" && (
                    <label htmlFor="" className="ms-2 text-start">
                      You will be redirected to Stripe to complete the payment.
                      (Debit card/Credit card/Online banking)
                    </label>
                  )}
                </div>
              </div>

              <div className="border w-100 mt-2"></div>

              <div className="d-flex flex-row mt-2 py-2">
                <input
                  type="radio"
                  className="form-check-input mt-2"
                  name="payment"
                  id="payment-paypal"
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePaymentSelection("PayPal")}
                />
                <div className="d-flex flex-column ms-1">
                  <label
                    htmlFor="payment-paypal"
                    className="ms-2 text-start"
                    style={{ cursor: "pointer" }}
                  >
                    Fast and safe online payment via PayPal
                  </label>
                  {selectedPayment === "PayPal" && (
                    <label htmlFor="" className="ms-2 text-start">
                      You will be redirected to PayPal to complete the payment.
                    </label>
                  )}
                </div>
              </div>

              <div className="border w-100 mt-2"></div>

              <div className="d-flex flex-row mt-2 py-2">
                <input
                  type="radio"
                  className="form-check-input mt-2"
                  name="payment"
                  id="payment-razorpay"
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePaymentSelection("Razorpay")}
                />
                <div className="d-flex flex-column ms-1">
                  <label
                    htmlFor="payment-razorpay"
                    className="ms-2 text-start"
                    style={{ cursor: "pointer" }}
                  >
                    Payment with Razorpay
                  </label>
                  {selectedPayment === "Razorpay" && (
                    <label htmlFor="" className="ms-2 text-start">
                      Razorpay - Best Payment Solution for Online Payments in
                      India (Debit card/Credit card/Online banking)
                    </label>
                  )}
                </div>
              </div>

              <div className="border w-100 mt-2"></div>

              <div className="d-flex flex-row mt-2 py-2">
                <input
                  type="radio"
                  className="form-check-input mt-2"
                  name="payment"
                  id="payment-paystack"
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePaymentSelection("Paystack")}
                />
                <div className="d-flex flex-column ms-1">
                  <label
                    htmlFor="payment-paystack"
                    className="ms-2 text-start"
                    style={{ cursor: "pointer" }}
                  >
                    Payment with Paystack
                  </label>
                  {selectedPayment === "Paystack" && (
                    <label htmlFor="" className="ms-2 text-start">
                      You will be redirected to Paystack to complete the
                      payment.
                    </label>
                  )}
                </div>
              </div>

              <div className="border w-100 mt-2"></div>

              <div className="d-flex flex-row mt-2 py-2">
                <input
                  type="radio"
                  className="form-check-input mt-2"
                  name="payment"
                  id="payment-mollie"
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePaymentSelection("Mollie")}
                />
                <div className="d-flex flex-column ms-1">
                  <label
                    htmlFor="payment-mollie"
                    className="ms-2 text-start"
                    style={{ cursor: "pointer" }}
                  >
                    Payment with Mollie
                  </label>
                  {selectedPayment === "Mollie" && (
                    <label htmlFor="" className="ms-2 text-start">
                      You will be redirected to Mollie to complete the payment.
                    </label>
                  )}
                </div>
              </div>

              <div className="border w-100 mt-2"></div>

              <div className="d-flex flex-row mt-2 py-2">
                <input
                  type="radio"
                  className="form-check-input mt-2"
                  name="payment"
                  id="payment-sslcommerz"
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePaymentSelection("SSLCommerz")}
                />
                <div className="d-flex flex-column ms-1">
                  <label
                    htmlFor="payment-sslcommerz"
                    className="ms-2 text-start"
                    style={{ cursor: "pointer" }}
                  >
                    Payment with SSLCommerz
                  </label>
                  {selectedPayment === "SSLCommerz" && (
                    <label htmlFor="" className="ms-2 text-start">
                      You will be redirected to SSLCommerz to complete the
                      payment.
                    </label>
                  )}
                </div>
              </div>

              <div className="border w-100 mt-2"></div>

              <div className="d-flex flex-row mt-2 py-2">
                <input
                  type="radio"
                  className="form-check-input mt-2"
                  name="payment"
                  id="payment-bank-transfer"
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePaymentSelection("BankTransfer")}
                />
                <div className="d-flex flex-column ms-1">
                  <label
                    htmlFor="payment-bank-transfer"
                    className="ms-2 text-start"
                    style={{ cursor: "pointer" }}
                  >
                    Bank transfer
                  </label>
                  {selectedPayment === "BankTransfer" && (
                    <label htmlFor="" className="ms-2 text-start">
                      Please send money to our bank account: ACB - 69270 213 19.
                    </label>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
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

export default Checkout;
