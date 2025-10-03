import React, { useContext, useEffect, useRef, useState } from "react";
import "./Checkout.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import { parse, format } from "date-fns";
import { Link } from "react-router-dom";
import Tonic from "../../assets/Tonic.svg";
import Hamburger from "../../assets/hamburger.svg";
import Close from "../../assets/Close.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import UserContext from "../../context/UserContext";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import { Helmet } from "react-helmet-async";
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const cartdata = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/allcartdata"
        );
        setCount(response.data.length);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    cartdata();
  }, []);

  const [cart, setCart] = useState([]);
  const [discountData, setDiscountData] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    const fetchDiscountData = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/discountdata"
        );
        setDiscountData(response.data);
      } catch (error) {
        console.error("Error fetching discount data:", error);
      }
    };
    fetchDiscountData();
  }, []);

  const activeDiscounts = Array.isArray(discountData)
    ? discountData.filter((data) => {
        if (!data.end_date) return true;
        const currentDate = new Date();
        const endDate = new Date(data.end_date);
        return endDate >= currentDate;
      })
    : [];

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    } else {
      const fetchCartData = async () => {
        try {
          const response = await axios.get(
            "https://demo.webriefly.com/api/allcartdata"
          );
          const updatedData = response.data.map((item) => ({
            ...item,
            quantity: 1,
          }));
          setCart(updatedData);
          localStorage.setItem("cart", JSON.stringify(updatedData));
        } catch (error) {
          console.error("Error fetching cart data:", error);
        }
      };
      fetchCartData();
    }

    const storedCoupon = localStorage.getItem("appliedCoupon");
    if (storedCoupon) {
      setAppliedCoupon(JSON.parse(storedCoupon));
    }
  }, []);

  const subtotal = cart.reduce((acc, curr) => {
    const price = parseFloat(curr.price.replace("$", "").trim());
    return !isNaN(price) ? acc + price * curr.quantity : acc;
  }, 0);

  const calculatedDiscountAmount = appliedCoupon
    ? subtotal * (parseFloat(appliedCoupon.conditions.replace("%", "")) / 100)
    : 0;

  useEffect(() => {
    setDiscountAmount(calculatedDiscountAmount);
  }, [calculatedDiscountAmount]);

  const updateQuantity = (id, action) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        const updatedQuantity =
          action === "increase" ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: Math.max(updatedQuantity, 1) };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const discountedSubtotal = subtotal - discountAmount;
  const tax = discountedSubtotal * 0.15;
  const total = discountedSubtotal + tax;

  const handleApplyCouponFromList = (coupon) => {
    if (coupon.end_date) {
      const couponEndDate = new Date(coupon.end_date);
      const now = new Date();
      if (couponEndDate < now) {
        toast.error("Coupon code is expired", {
          position: "bottom-right",
          autoClose: 1000,
        });
        return;
      }
    }
    const discountPercent = parseFloat(coupon.conditions.replace("%", ""));
    if (isNaN(discountPercent)) {
      toast.error("Invalid discount condition", {
        position: "bottom-right",
        autoClose: 1000,
      });
      return;
    }

    const calculatedDiscount = subtotal * (discountPercent / 100);
    setDiscountAmount(calculatedDiscount);
    setAppliedCoupon(coupon);
    localStorage.setItem("appliedCoupon", JSON.stringify(coupon));
    toast.success("Coupon applied successfully!", {
      position: "bottom-right",
      autoClose: 1000,
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    localStorage.removeItem("appliedCoupon");
    toast.success("Coupon removed successfully", {
      position: "bottom-right",
      autoClose: 1000,
    });
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
    date: null,
  });

  const [errors, setErrors] = useState({});
  const [container, setContainer] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  let [code, setCode] = useState(false);

  let couponCodes = () => {
    setCode(!code);
  };

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
        "https://demo.webriefly.com/api/checkout",
        orderData
      );
      const orderNumber = response.data.orderNumber;
      const orderDate = user.date ? user.date : new Date().toISOString();
      const updatedCartWithOrder = cart.map((item) => ({
        ...item,
        order_number: orderNumber,
        date: orderDate,
        total: total.toFixed(2),
        tax: tax.toFixed(2),
        email: user.email,
        phone_number: user.phone_number,
        first_name: user.first_name,
        last_name: user.last_name,
        address: user.address,
        apartment: user.apartment,
        country: user.country,
        pincode: user.pincode,
      }));
      localStorage.setItem("cart", JSON.stringify(updatedCartWithOrder));
      setCount(0);
      setCart([]);
      toast.success(
        `Order successfully placed. Your order number is ${orderNumber}`,
        {
          position: "bottom-right",
          autoClose: 1000,
          ProgressBar: true,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        }
      );
    } catch (error) {
      toast.error("Order is not placed", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
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

  const datePickerRef = useRef(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleDateChange = (date) => {
    setUser((prevUser) => ({
      ...prevUser,
      date: date ? format(date, "yyyy-MM-dd HH:mm:ss") : "",
    }));
    setIsCalendarOpen(false);
  };

  const toggleCalendar = () => {
    if (datePickerRef.current) {
      if (isCalendarOpen) {
        datePickerRef.current.setOpen(true);
        setIsCalendarOpen(false);
      } else {
        datePickerRef.current.setOpen(false);
        setIsCalendarOpen(true);
      }
    }
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
      .get("https://demo.webriefly.com/api/get-theme-logo")
      .then((response) => {
        if (response.data) {
          setLogoUrl(
            `https://demo.webriefly.com/uploads/${response.data.logo_url}`
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
          "https://demo.webriefly.com/api/get-theme-breadcrumb"
        );
        setCheck(response.data);
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
          "https://demo.webriefly.com/api/wishlistdata"
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
          "https://demo.webriefly.com/api/cookiesalldata"
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

  let [letter, setLetter] = useState({
    email: "",
  });
  let { email } = letter;

  const [errors1, setErrors1] = useState({});

  const validateForm = () => {
    let newErrors = {};
    const requiredFields = { email };

    for (const field in requiredFields) {
      if (
        !requiredFields[field] ||
        requiredFields[field].toString().trim() === ""
      ) {
        let fieldName = field.charAt(0).toUpperCase() + field.slice(1);
        newErrors[field] = `${fieldName} is required`;
      }
    }
    setErrors1(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  let newsSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      await axios.post("https://demo.webriefly.com/api/newsletterpost", letter);
      toast.success("Newsletter subscribed successfully", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Newsletter is not subscribed", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  let onHandleChange = (e) => {
    setLetter({ ...letter, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>Secure Checkout - Complete Your Purchase | Rxlyte</title>
        <meta
          name="description"
          content="Complete your purchase securely with our fast and safe checkout process. Enjoy hassle-free payments and quick order processing at Rxlyte."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://demo.webriefly.com/checkout" />
      </Helmet>

      <div
        className="container"
        id="container-customx"
        style={{
          backgroundColor:
            check?.background_color ||
            (check?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: check?.background_image
            ? `url(https://demo.webriefly.com/uploads/${check.background_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: check?.breadcrumb_height
            ? `${check.breadcrumb_height}px`
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
                        <Link to="/" className="text-dark">
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

      <div className="d-flex flex-column demo-shipping mt-4 cart-cart1 justify-content-start align-items-start">
        <h2 className="pills text-start">Pill Demo</h2>
        <p className="text-dark text-start">
          Cart/Information/Shipping/Payment
        </p>
      </div>

      <div className="container-fluid overflow-hidden">
        <div className="container ms-0 ms-lg-2">
          <div className="row mt-3 gap-0 d-flex justify-content-lg-start flex-row flex-lg-wrap flex-xl-nowrap flex-xxl-nowrap me-0 me-lg-0">
            <div className="col-12 col-md-6 col-lg-12 col-xl-12 contact-page1 h-auto pb-5">
              <div className="d-flex flex-row justify-content-between cart-cart flex-wrap">
                <h2
                  className="mt-3 ms-lg-2 text-start d-flex fw-medium contact-phone"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Contact Information
                </h2>
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
                {container && Object.keys(container) ? (
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

                    <h2 className="mt-3 ms-lg-3 contact-phone text-start fw-medium cart-cart">
                      Shipping Address
                    </h2>

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
                            type="number"
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
                        <div className="d-flex flex-column w-100 remind-follow">
                          <DatePicker
                            ref={datePickerRef}
                            selected={
                              user.date
                                ? parse(
                                    user.date,
                                    "yyyy-MM-dd HH:mm:ss",
                                    new Date()
                                  )
                                : null
                            }
                            onChange={handleDateChange}
                            onCalendarOpen={() => setIsCalendarOpen(true)}
                            onCalendarClose={() => setIsCalendarOpen(false)}
                            placeholderText="Remind me/Follow-up for next"
                            dateFormat="dd-MM-yyyy"
                            className="form-control fw-medium py-4 border-place1 border-start border-end"
                            popperClassName="custom-datepicker-popper"
                          />

                          <div className="d-flex justify-content-end align-items-end w-100">
                            <FontAwesomeIcon
                              icon={faCalendarDays}
                              className="position-absolute fs-4 me-2 m-0 mb-2 pb-1"
                              onClick={toggleCalendar}
                            />
                          </div>

                          {errors.date && (
                            <span className="text-danger cart-cart">
                              {errors.date}
                            </span>
                          )}
                        </div>

                        <div className="form-floating w-100">
                          <select
                            className="form-select border-place1-check"
                            id="heardAboutUs"
                            defaultValue=""
                          >
                            <option value="">Please select</option>
                            <option value="Returning Customer">
                              Returning Customer
                            </option>
                            <option value="By Google">By Google</option>
                            <option value="I searched on web">
                              I searched on Web
                            </option>
                            <option value="Doctor recommended me">
                              Doctor Recommended Me
                            </option>
                            <option value="Someone referred me">
                              Someone Referred Me
                            </option>
                            <option value="Through Blogs/Forums">
                              Through Blogs/Forums
                            </option>
                            <option value="Others">Others</option>
                          </select>
                          <label
                            htmlFor="heardAboutUs"
                            className="border-place1-check1 text-dark"
                          >
                            <span className="channel-checkout">
                              Heard About Us
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="form-floating w-100 mt-4">
                        <select
                          className="form-select border-place1-check"
                          id="heardAboutUs"
                        >
                          <option value="">Please select</option>
                          <option value="Email">Email</option>
                          <option value="Phone">Phone</option>
                          <option value="WhatsApp">WhatsApp</option>
                          <option value="Sms">Sms</option>
                        </select>
                        <label
                          htmlFor="heardAboutUs"
                          className="border-place1-check1 text-dark"
                        >
                          <span className="channel-checkout">
                            Channel to communicate
                          </span>
                        </label>
                      </div>

                      <div className="d-flex flex-row gap-2 ms-2 mt-3 cart-cart">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="agree"
                          checked={isChecked}
                          onChange={onCheckboxChange}
                        />
                        <div className="d-flex flex-column">
                          <label htmlFor="agree">
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

                    <button className="btn btn-success-product d-flex mt-4 ms-lg-2 px-3 py-4 button-shipping rounded-0">
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
                {Array.isArray(cart) && cart.length > 0
                  ? cart.map((data) => (
                      <React.Fragment key={data.id}>
                        <div className="col d-flex ms-xxl-0 ms-xl-0 ps-xxl-0 ps-xl-2 mt-2 mt-lg-0 ps-1 ps-sm-0 flex-row ms-sm-0">
                          <div className="lorem-border rounded-0">
                            <div className="position-absolute number-item bg-success border text-light rounded-5 px-2">
                              {data.quantity}
                            </div>

                            <img
                              src={`https://demo.webriefly.com/uploads/${data.image}`}
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
                            <h2 className="contact-phone1 cart-cart">
                              {data.name}
                            </h2>
                            <p className="cart-cart">{data.store}</p>
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
                      </React.Fragment>
                    ))
                  : null}

                <div className="process d-flex flex-column me-lg-1 lh-base h-auto">
                  <div className="mt-3 d-flex justify-content-between flex-row w-100">
                    <span className="ms-3">Subtotal:</span>
                    <span className="me-3" style={{ fontFamily: "verdana" }}>
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {appliedCoupon && (
                    <div className="mt-3 d-flex justify-content-between flex-row w-100">
                      <span className="ms-3">Coupon code:</span>
                      <span className="me-3" style={{ fontFamily: "verdana" }}>
                        {appliedCoupon.couponcode}
                      </span>
                    </div>
                  )}

                  {appliedCoupon && (
                    <div className="mt-3 d-flex justify-content-between flex-row w-100">
                      <span className="ms-3">Discount amount:</span>
                      <span className="me-3" style={{ fontFamily: "verdana" }}>
                        ${discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="mt-3 d-flex justify-content-between flex-row w-100">
                    <span className="ms-md-3 ms-3">Tax (Import Tax - 15%)</span>
                    <span className="me-3" style={{ fontFamily: "verdana" }}>
                      ${tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="mt-3 d-flex justify-content-between flex-row w-100">
                    <span className="ms-3">Shipping fee</span>
                    <span className="me-3" style={{ fontFamily: "verdana" }}>
                      $0.00
                    </span>
                  </div>

                  <div className="mt-3 d-flex justify-content-between flex-row w-100 pb-3">
                    <span className="ms-3">Total:</span>
                    <span className="me-3" style={{ fontFamily: "verdana" }}>
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="process-checkout d-flex flex-column me-lg-1 mt-0 lh-base h-auto bg-transparent mb-3">
                  <div className="row gap-2 code-check">
                    {activeDiscounts.filter((data) => data.display === "yes")
                      .length > 0 ? (
                      <>
                        <h4 className="mt-0 text-start">Coupon codes</h4>
                        {activeDiscounts
                          .filter((data) => data.display === "yes")
                          .map((data, key) => (
                            <div
                              className="col-12 col-md-12 col-lg-12 border text-start py-2 rounded lorem-lyte-checkout"
                              key={key}
                              style={
                                appliedCoupon &&
                                appliedCoupon.couponcode === data.couponcode
                                  ? {
                                      backgroundColor: "#1c8aa6",
                                      color: "white",
                                    }
                                  : {}
                              }
                            >
                              <div className="mt-1 text-light p-2 d-flex flex-row flex-nowrap justify-content-between rounded apply-discount">
                                <span className="d-flex justify-content-center align-items-center mt-2 mt-lg-0 mt-md-0 cart-cart1">
                                  Discount {data.conditions} for all orders
                                </span>
                                {appliedCoupon &&
                                appliedCoupon.couponcode === data.couponcode ? (
                                  <button
                                    className="btn btn-danger d-flex cart-cart1 align-items-center"
                                    onClick={handleRemoveCoupon}
                                  >
                                    Remove
                                  </button>
                                ) : (
                                  <button
                                    className="btn btn-success-product d-flex mt-lg-2 mt-0 align-items-center cart-cart1"
                                    onClick={() =>
                                      handleApplyCouponFromList(data)
                                    }
                                  >
                                    Apply
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>

      <h2 className="mt-lg-3 mt-2 mt-sm-3 cart-cart ms-lg-0 ms-0 w-50 mb-3 payment-span text-lg-start text-xl-start text-xxl-center contact-phone">
        Payment method
      </h2>

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

      <footer className="footer text-white pt-4 pb-4 cart-cart mt-4">
        <div className="container text-center text-md-left">
          <div className="row footer-lyte">
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 mx-auto mt-lg-3 mt-0 d-flex flex-column text-start ms-0">
              <img
                src={Tonic}
                alt="Tonic"
                width="190"
                height="190"
                className="img-fluid mb-3"
                style={{ maxWidth: "190px" }}
                loading="lazy"
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
                <div className="d-flex flex-column justify-content-start">
                  <input
                    type="email"
                    placeholder="Email"
                    className="form-control me-2 py-4 cart-cart1"
                    aria-label="Email address"
                    name="email"
                    value={email}
                    onChange={onHandleChange}
                  />
                  {errors1.email && (
                    <small className="text-danger text-start cart-cart mt-1">
                      {errors1.email}
                    </small>
                  )}
                </div>
                <button
                  className="btn btn-success-product d-flex cart-cart1 py-4 me-0 ms-1"
                  type="submit"
                  onClick={newsSubmit}
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
                © {new Date().getFullYear()} Copyright RxLYTE. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Checkout;
