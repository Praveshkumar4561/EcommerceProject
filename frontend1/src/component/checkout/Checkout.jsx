import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Checkout.css";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
import Profile from "../../assets/image.png";
import Hamburger from "../../assets/hamburger.svg";
import Cart from "../../assets/Cart.svg";
import UserContext from "../../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

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
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    cartdata();
  }, []);

  const cartdata = async () => {
    try {
      const response = await axios.get("/api/allcartdata");
      setCount(response.data.length);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };
  cartdata();

  let [cart, setCart] = useState([]);

  useEffect(() => {
    const cartdata = async () => {
      try {
        const response = await axios.get("/api/allcartdata");
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
    const userdata = async () => {
      try {
        const response = await axios.get("/api/alldata");
        if (response.data && response.data.length > 0) {
          setContainer(response.data);
          setUser((prevUser) => ({
            ...prevUser,
            email: response.data[0].email,
            phone_number: response.data[0].phone_number,
            first_name: response.data[0].first_name,
            last_name: response.data[0].last_name,
          }));
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    userdata();
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
      const response = await axios.post("/api/checkout", orderData);
      if (response.data && response.data.orderNumber) {
        alert(
          `Order successfully placed. Your order number is 
          ${response.data.orderNumber}`
        );
      } else {
        alert("Error creating order.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
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

  return (
    <>
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
                    <div className="addcarts ms-1 ps-1 pt-lg-1 pt-0">
                      {count}
                    </div>
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

          <main className="container mt-5">
            <h1
              className="fw-medium mb-3 text-center container-contact-check fs-2"
              style={{ position: "relative", zIndex: "1000" }}
            >
              Checkout
            </h1>
            <nav aria-label="breadcrumb" id="container-contact1-check">
              <ol className="breadcrumb breadcrumb-check d-flex flex-wrap gap-0">
                <li
                  className="breadcrumb-item breadcrumb-item-check navbar-item fw-bold"
                  style={{ position: "relative", zIndex: "1000" }}
                >
                  <Link target="_blank" to="/" className="text-dark fw-medium">
                    Home
                  </Link>
                </li>
                <li
                  className="breadcrumb-item navbar-item fw-medium text-dark"
                  style={{ position: "relative", zIndex: "1000" }}
                >
                  Checkout
                </li>
              </ol>
            </nav>
          </main>
        </div>
      </div>
      <div></div>

      <div className="d-flex flex-column demo-shipping mt-4 cart-cart">
        <h2 className="">Pill Demo</h2>
        <p className="text-dark">Cart / Information / Shipping / Payment</p>
      </div>

      <div className="container-fluid overflow-hidden">
        <div className="container ms-0 ms-lg-2">
          <div className="row mt-3 gap-0 d-flex justify-content-lg-start me-0 me-lg-0">
            <div className="col-12 col-md-6 col-lg-12 col-xl-12 contact-page1 h-auto pb-5">
              <div className="d-flex flex-row justify-content-between cart-cart">
                <h4
                  className="mt-3 ms-lg-2 text-start d-flex fw-medium"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Contact Information
                </h4>
                <p className="text-dark pt-5 mb-0 ps-lg-3 cart-cart">
                  Already have an account?
                  <Link
                    className="text-dark text-decoration-none ms-1"
                    to="/login"
                  >
                    Log in
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                {container.slice(0, 1).map((data, key) => (
                  <div key={key}>
                    <div className="ms-0 ms-lg-2">
                      <input
                        type="email"
                        className="form-control border-start border-end py-4 border-place1 fw-medium text-dark"
                        placeholder="Email"
                        name="email"
                        value={user.email || data.email}
                        onChange={onInputChange}
                      />
                    </div>

                    <div className="ms-0 ms-lg-2 mt-4">
                      <input
                        type="text"
                        className="form-control py-4 border-place1 fw-medium text-dark border-start border-end"
                        placeholder="Phone number"
                        name="phone_number"
                        value={user.phone_number || data.phone_number}
                        onChange={onInputChange}
                      />
                    </div>

                    <h4 className="mt-3 ms-lg-3 text-start fw-medium cart-cart">
                      Shipping Address
                    </h4>

                    <div className="global-name">
                      <div className="d-flex gap-5 ms-lg-2 ms-0 mt-3">
                        <input
                          type="text"
                          placeholder="First name"
                          className="form-control fw-medium py-4 border-place1 border-start border-end"
                          name="first_name"
                          value={user.first_name || data.first_name}
                          onChange={onInputChange}
                        />
                        <input
                          type="text"
                          placeholder="Last name"
                          className="form-control fw-medium py-4 border-place1 border-start border-end"
                          name="last_name"
                          value={user.last_name || data.last_name}
                          onChange={onInputChange}
                        />
                      </div>

                      <div className="ms-lg-2 ms-0">
                        <input
                          type="text"
                          placeholder="Address"
                          className="form-control py-4 mt-5 ms-0 fw-medium border-place1 border-start border-end"
                          name="address"
                          value={user.address}
                          onChange={onInputChange}
                        />
                        {errors.address && (
                          <span className="text-danger">{errors.address}</span>
                        )}
                      </div>

                      <div className="ms-lg-2 ms-0">
                        <input
                          type="text"
                          placeholder="Apartment"
                          className="form-control py-4 mt-5 fw-medium border-place1 border-start border-end"
                          name="apartment"
                          value={user.apartment}
                          onChange={onInputChange}
                        />
                        {errors.apartment && (
                          <span className="text-danger">
                            {errors.apartment}
                          </span>
                        )}
                      </div>

                      <div className="d-flex gap-5 ms-lg-2 ms-0 mt-5">
                        <input
                          type="text"
                          placeholder="Country"
                          className="form-control fw-medium py-4 border-place1 border-start border-end"
                          name="country"
                          value={user.country}
                          onChange={onInputChange}
                        />
                        {errors.country && (
                          <span className="text-danger">{errors.country}</span>
                        )}

                        <input
                          type="number"
                          placeholder="Postal Code"
                          className="form-control fw-medium py-4 border-place1 border-start border-end"
                          name="pincode"
                          value={user.pincode}
                          onChange={onInputChange}
                        />
                        {errors.pincode && (
                          <span className="text-danger">{errors.pincode}</span>
                        )}
                      </div>

                      <div className="ms-lg-2 ms-0">
                        <input
                          type="datetime-local"
                          className="form-control py-4 mt-5 fw-medium border-place1 border-start border-end"
                          name="date"
                          value={user.date}
                          onChange={onInputChange}
                        />
                        {errors.date && (
                          <span className="text-danger">{errors.date}</span>
                        )}
                      </div>

                      <div className="d-flex flex-row gap-2 ms-2 mt-3 cart-cart">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={isChecked}
                          onChange={onCheckboxChange}
                        />
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
                          <span className="text-danger">{errors.checkbox}</span>
                        )}
                      </div>

                      <div className="d-flex flex-row gap-2 text-success mt-3 ms-1 ps-2 cart-cart">
                        <FontAwesomeIcon
                          icon={faArrowLeft}
                          className="mt-1 fs-6"
                        />
                        <Link
                          className="text-success text-decoration-none"
                          to="/cart"
                        >
                          Back to Cart
                        </Link>
                      </div>
                    </div>

                    <button className="btn btn-success d-flex mt-4 ms-lg-2 px-3 py-4 button-shipping rounded-0">
                      Checkout
                    </button>
                  </div>
                ))}
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
                          src={`/api/src/image/${data.image}`}
                          alt=""
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

                <div className="process d-flex flex-column me-lg-3 lh-lg">
                  <div className="mt-4 d-flex justify-content-between flex-row w-100">
                    <span className="ms-3">Subtotal:</span>
                    <span className="me-3" style={{ fontFamily: "verdana" }}>
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-3 d-flex justify-content-between flex-row w-100">
                    <span className="ms-3">Tax (Import Tax - 15%):</span>
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
      </div>

      <h4 className="mt-lg-3 mt-0 mt-sm-3 cart-cart ms-lg-3 ms-0 w-50 text-lg-center text-center">
        Payment method
      </h4>

      <div className="container-fluid cart-cart ">
        <div className="container">
          <div className="row">
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

export default Checkout;
