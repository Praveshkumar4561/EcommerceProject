import React, { useContext, useEffect, useRef, useState } from "react";
import "./Cart.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import UserContext from "../../context/UserContext";
import Tonic from "../../assets/Tonic.svg";
import Hamburger from "../../assets/hamburger.svg";
import Close from "../../assets/Close.webp";
import axios from "axios";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import { Helmet } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Cart() {
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

  const [user, setUser] = useState([]);
  const { count, setCount } = useContext(UserContext);
  const [discountData, setDiscountData] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  useEffect(() => {
    const fetchDiscountData = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/discountdata"
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
    const fetchCartData = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/allcartdata"
        );
        const apiCart = response.data.map((item) => ({
          ...item,
          quantity: 1,
        }));
        const storedCart = localStorage.getItem("cart");
        let mergedCart = apiCart;
        if (storedCart) {
          const localCart = JSON.parse(storedCart);
          mergedCart = apiCart.map((item) => {
            const localItem = localCart.find((i) => i.id === item.id);
            return localItem ? { ...item, quantity: localItem.quantity } : item;
          });
          localCart.forEach((localItem) => {
            if (!mergedCart.find((item) => item.id === localItem.id)) {
              mergedCart.push(localItem);
            }
          });
        }
        setUser(mergedCart);
        setCount(mergedCart.length);
        localStorage.setItem("cart", JSON.stringify(mergedCart));
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchCartData();
  }, [setCount]);

  const subtotal = user.reduce((acc, curr) => {
    const price = parseFloat(curr.price.replace("$", "").trim());
    return !isNaN(price) ? acc + price * curr.quantity : acc;
  }, 0);
  const finalTotal = subtotal - discountAmount;

  useEffect(() => {
    const savedCoupon = localStorage.getItem("appliedCoupon");
    if (savedCoupon && discountData.length > 0 && subtotal > 0) {
      const couponFromStorage = JSON.parse(savedCoupon);
      const coupon = discountData.find(
        (item) =>
          item.couponcode.toUpperCase() ===
          couponFromStorage.couponcode.toUpperCase()
      );
      if (coupon) {
        const discountPercent = parseFloat(coupon.conditions.replace("%", ""));
        const calculatedDiscount = subtotal * (discountPercent / 100);
        setDiscountAmount(calculatedDiscount);
        setCouponApplied(true);
        setAppliedCoupon(coupon);
        setPromoCode(coupon.couponcode);
      }
    }
  }, [discountData, subtotal]);

  const updateQuantity = (id, action) => {
    const updatedUser = user.map((item) => {
      if (item.id === id) {
        const updatedQuantity =
          action === "increase" ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: Math.max(updatedQuantity, 1) };
      }
      return item;
    });
    setUser(updatedUser);
    localStorage.setItem("cart", JSON.stringify(updatedUser));
  };

  const handleApplyCoupon = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a coupon code", {
        position: "bottom-right",
        autoClose: 1000,
        progressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    const coupon = discountData.find(
      (item) => item.couponcode.toUpperCase() === promoCode.toUpperCase()
    );
    if (!coupon) {
      toast.error("Invalid coupon code", {
        position: "bottom-right",
        autoClose: 1000,
        progressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    if (coupon.end_date) {
      const couponEndDate = new Date(coupon.end_date);
      const now = new Date();
      if (couponEndDate < now) {
        toast.error("Coupon code is expired", {
          position: "bottom-right",
          autoClose: 1000,
          progressBar: true,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
    }
    const discountPercent = parseFloat(coupon.conditions.replace("%", ""));
    if (isNaN(discountPercent)) {
      toast.error("Invalid discount condition", {
        position: "bottom-right",
        autoClose: 1000,
        progressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    const calculatedDiscount = subtotal * (discountPercent / 100);
    setDiscountAmount(calculatedDiscount);
    setCouponApplied(true);
    setAppliedCoupon(coupon);
    setPromoCode(coupon.couponcode);
    localStorage.setItem("appliedCoupon", JSON.stringify(coupon));
    toast.success("Coupon code applied successfully!", {
      position: "bottom-right",
      autoClose: 1000,
    });
  };

  const handleApplyCouponFromList = (coupon) => {
    if (coupon.end_date) {
      const couponEndDate = new Date(coupon.end_date);
      const now = new Date();
      if (couponEndDate < now) {
        toast.error("Coupon code is expired", {
          position: "bottom-right",
          autoClose: 1000,
          progressBar: true,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
    }
    const discountPercent = parseFloat(coupon.conditions.replace("%", ""));
    if (isNaN(discountPercent)) {
      toast.error("Invalid discount condition", {
        position: "bottom-right",
        autoClose: 1000,
        progressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    const calculatedDiscount = subtotal * (discountPercent / 100);
    setDiscountAmount(calculatedDiscount);
    setCouponApplied(true);
    setAppliedCoupon(coupon);
    setPromoCode(coupon.couponcode);
    localStorage.setItem("appliedCoupon", JSON.stringify(coupon));
    toast.success("Coupon applied successfully!", {
      position: "bottom-right",
      autoClose: 1000,
      progressBar: true,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleRemoveCoupon = () => {
    setCouponApplied(false);
    setDiscountAmount(0);
    setAppliedCoupon(null);
    setPromoCode("");
    localStorage.removeItem("appliedCoupon");
    toast.success("Coupon removed successfully", {
      position: "bottom-right",
      autoClose: 1000,
      progressBar: true,
      closeOnClick: true,
      draggable: true,
      progress: undefined,
    });
  };

  const deletedata = async (id) => {
    try {
      await axios.delete(`http://147.93.45.171:1600/deletecart/${id}`);
      const updatedUser = user.filter((item) => item.id !== id);
      setUser(updatedUser);
      setCount(updatedUser.length);
      localStorage.setItem("cart", JSON.stringify(updatedUser));
      toast.success("Product successfully removed from the cart", {
        position: "bottom-right",
        autoClose: 1000,
        progressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Product was not removed from the cart", {
        position: "bottom-right",
        autoClose: 1000,
        progressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
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
      .get("http://147.93.45.171:1600/get-theme-logo")
      .then((response) => {
        if (response.data) {
          setLogoUrl(
            `http://147.93.45.171:1600/src/image/${response.data.logo_url}`
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
          "http://147.93.45.171:1600/get-theme-breadcrumb"
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
          "http://147.93.45.171:1600/wishlistdata"
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
          "http://147.93.45.171:1600/cookiesalldata"
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

  const [errors, setErrors] = useState({});

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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  let newsSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      await axios.post("http://147.93.45.171:1600/newsletterpost", letter);
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

  let onInputChange = (e) => {
    setLetter({ ...letter, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Helmet>
        <title>Your Shopping Cart - Secure Checkout | Rxlyte</title>
        <meta
          name="description"
          content="Review the items in your cart and proceed to secure checkout at Rxlyte. Enjoy a seamless shopping experience with safe payments and fast delivery."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://srv689968.hstgr.cloud/cart" />
      </Helmet>

      <div
        className="container"
        id="container-custom"
        style={{
          backgroundColor:
            cart?.background_color ||
            (cart?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: cart?.background_image
            ? `url(http://147.93.45.171:1600/src/image/${cart.background_image})`
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
                      Cart
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
                        Cart
                      </li>
                    </ol>
                  </nav>
                </>
              )}
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid">
        <div className="container mt-lg-4 rounded d-flex flex-column align-items-lg-center">
          <div className="row w-100">
            {user.length > 0 ? (
              <>
                <div className="col-lg-9 col-12 col-md-12">
                  <div className="table table-container-content">
                    <table className="table mt-2">
                      <thead>
                        <tr className="text-lg-start text-center cart-cart">
                          <th className="fw-medium bg-light">Product</th>
                          <th className="fw-medium bg-light">Price</th>
                          <th className="fw-medium bg-light">Quantity</th>
                          <th className="fw-medium bg-light">Total</th>
                          <th className="bg-light"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(user) && user.length > 0 ? (
                          user.map((data, key) => (
                            <tr className="cart-cart" key={key}>
                              <td className="d-flex align-items-center flex-row">
                                <div
                                  className="rounded-0 me-3 mb-4"
                                  style={{ width: "150px", height: "70px" }}
                                >
                                  <img
                                    src={`http://147.93.45.171:1600/src/image/${data.image}`}
                                    alt="Product"
                                    className="img-fluid image-mobile"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "contain",
                                    }}
                                  />
                                </div>

                                <div className="d-flex flex-column">
                                  <span className="digital-band text-start">
                                    {data.name}
                                  </span>
                                  <p className="brown-table text-success digital-band ms-0">
                                    {data.stockstatus}
                                  </p>
                                  <p className="brown-table1 text-dark ms-0 text-start">
                                    Vendor: {data.store}
                                  </p>
                                </div>
                              </td>
                              <td
                                className="table-dollar lh-lg"
                                style={{ fontFamily: "verdana" }}
                              >
                                {data.price}
                                <strike className="ms-2">
                                  {data.price_sale}
                                </strike>
                              </td>
                              <td className="border py-1 px-0">
                                <div
                                  className="border rounded-5 me-2 ms-2 bg-light"
                                  style={{ cursor: "pointer" }}
                                >
                                  <span
                                    className="ms-4 fw-medium fs-4"
                                    onClick={() =>
                                      updateQuantity(data.id, "decrease")
                                    }
                                  >
                                    -
                                  </span>
                                  <span className="ms-4 fw-medium fs-5">
                                    {data.quantity}
                                  </span>
                                  <span
                                    className="ms-4 fw-medium fs-4 me-3"
                                    onClick={() =>
                                      updateQuantity(data.id, "increase")
                                    }
                                  >
                                    +
                                  </span>
                                </div>
                              </td>
                              <td
                                className="lh-lg"
                                style={{ fontFamily: "verdana" }}
                              >
                                $
                                {(
                                  parseFloat(
                                    data.price.replace("$", "").trim()
                                  ) * data.quantity
                                ).toFixed(2)}
                              </td>
                              <td style={{ cursor: "pointer" }}>
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  className="text-danger"
                                  onClick={() => deletedata(data.id)}
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center cart-cart">
                              Your cart is empty.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex">
                    <div className="container d-flex flex-column justify-content-md-center align-items-start justify-content-lg-center mt-1">
                      <h2 className="cart-cart contact-phone">
                        Add promo code
                      </h2>
                      <div className="d-flex flex-row">
                        <input
                          type="text"
                          className="rounded me-2 ms-0 ms-lg-0 mt-2 form-control py-4 mb-2 rounded-0 cart-cart"
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                        />
                        <button
                          className="btn btn-success-product px-3 mt-2 d-flex py-4 cart-cart1 rounded-0"
                          onClick={handleApplyCoupon}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3 col-md-12 col-12 d-flex flex-column align-items-start cart-cart cart-totals">
                  <h2 className="contact-phone fw-medium text-center mt-1 mb-0 cart-cart">
                    Cart Totals
                  </h2>
                  <div className="cart-border mt-3 rounded-0 d-flex flex-column p-3 w-100">
                    <div className="d-flex justify-content-between w-100 flex-row">
                      <span className="text-start fs-5">Subtotal:</span>
                      <span
                        className="text-start fs-5"
                        style={{ fontFamily: "verdana" }}
                      >
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="border mt-3 mb-2 w-100 border-secondary"></div>
                    <div className="d-flex justify-content-lg-between flex-row w-100 justify-content-between">
                      <span className="text-start fs-5">Tax:</span>
                      <span
                        className="text-start fs-5"
                        style={{ fontFamily: "verdana" }}
                      >
                        $0.00
                      </span>
                    </div>
                    {couponApplied && appliedCoupon && (
                      <div className="d-flex justify-content-between flex-row w-100 mt-2">
                        <div className="d-flex flex-column justify-content-start align-items-start">
                          <span className="text-start">Coupon</span>
                        </div>
                        <span
                          className="text-start fs-6"
                          style={{ fontFamily: "verdana" }}
                        >
                          -${discountAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="d-flex justify-content-lg-between w-100 flex-row justify-content-between mt-2">
                      <span className="text-start fs-5">Total:</span>
                      <span
                        className="text-start fs-5"
                        style={{ fontFamily: "verdana" }}
                      >
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>

                    <Link
                      to="/checkout"
                      className="btn btn-success-product cart-cart d-flex justify-content-lg-start justify-content-center align-items-center mb-2 mt-4 ms-lg-1 rounded-0 text-light text-decoration-none"
                      style={{ minHeight: "48px", minWidth: "48px" }}
                    >
                      Proceed to checkout
                    </Link>

                    <Link
                      className="text-dark text-decoration-underline mt-0"
                      to={`/${url.productDetails}`}
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>

                <div className="container cart-cart">
                  <div className="row gap-1 d-flex flex-row flex-lg-wrap flex-wrap lorem-lyte1">
                    {activeDiscounts.length > 0 ? (
                      <>
                        <h5 className="ms-lg-0 mt-0 mt-lg-0">Coupon codes</h5>
                        {activeDiscounts.map((data, key) => (
                          <div
                            className="col-12 col-md-6 col-lg-3 border text-start py-2 rounded lorem-lyte"
                            key={key}
                            style={
                              appliedCoupon &&
                              appliedCoupon.couponcode === data.couponcode
                                ? { backgroundColor: "#1c8aa6", color: "white" }
                                : {}
                            }
                          >
                            <div
                              className="mt-1 p-2 d-flex flex-row flex-nowrap justify-content-between rounded apply-discount"
                              style={
                                appliedCoupon &&
                                appliedCoupon.couponcode === data.couponcode
                                  ? {
                                      backgroundColor: "#212529",
                                      color: "white",
                                    }
                                  : {}
                              }
                            >
                              <span className="d-flex justify-content-center align-items-center mt-2 mt-lg-0 mt-md-0 cart-cart1 text-light">
                                Discount {data.conditions} for all orders
                              </span>
                              {appliedCoupon &&
                              appliedCoupon.couponcode === data.couponcode ? (
                                <button
                                  className="btn btn-danger d-flex cart-cart1"
                                  onClick={handleRemoveCoupon}
                                >
                                  Remove
                                </button>
                              ) : (
                                <button
                                  className="btn btn-success-product d-flex cart-cart1"
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
              </>
            ) : (
              <div className="text-center cart-cart d-flex flex-column align-items-center">
                <span className="fs-3">Your cart is empty</span>
                <button className="btn btn-success-product rounded d-flex py-4 cart-cart1 mt-2">
                  <Link
                    className="text-light text-decoration-none"
                    to={`/${url.productDetails}`}
                  >
                    Continue Shopping
                  </Link>
                </button>
              </div>
            )}
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
                      <Link to="/about">About Us</Link>
                    </li>
                    <li>
                      <Link to="/blog">Blog</Link>
                    </li>
                    <li>
                      <Link>Payment Security</Link>
                    </li>
                    <li>
                      <Link>Affiliate Marketing</Link>
                    </li>
                  </ul>
                </div>

                <div className="text-start ms-5 ps-5 ps-lg-0">
                  <h2 className="mb-2 pb-0 about-blog">Help?</h2>
                  <ul className="lh-lg footer-list p-0">
                    <li>
                      <Link to="/faqs" className="text-decoration-none">
                        FAQ's
                      </Link>
                    </li>
                    <li>
                      <Link className="text-decoration-none" to="/sitemap">
                        Sitemap
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact-us" className="text-decoration-none">
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
                    onChange={onInputChange}
                  />
                  {errors.email && (
                    <small className="text-danger-access text-start cart-cart mt-1">
                      {errors.email}
                    </small>
                  )}
                </div>
                <button
                  className="btn btn-success-product d-flex cart-cart1 py-4 me-0 ms-1"
                  type="submit"
                  onClick={newsSubmit}
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <hr className="my-4 me-3" />

          <div className="row align-items-center footer-lyte1">
            <div className="col-md-6 col-lg-7">
              <div className="text-md-start text-lg-start text-start mb-0">
                © {new Date().getFullYear()} Copyright RxLYTE. All rights
                reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Cart;
