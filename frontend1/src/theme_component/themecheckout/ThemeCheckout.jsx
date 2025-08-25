import React, { useEffect, useState } from "react";
import "../Theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faArrowUp,
  faChevronRight,
  faEnvelope,
  faHeart,
  faLocationDot,
  faPhone,
  faShoppingBag,
  faXmark,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import freeImg from "../../assets/free.webp";
import cashImg from "../../assets/Cash.webp";
import secureImg from "../../assets/hoursupport.webp";
import qualityImg from "../../assets/quality.webp";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

function ThemeCheckout() {
  const [pos, setPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const move = (e) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const [currOpen, setCurrOpen] = useState(false);
  const [language, setLanguage] = useState("Language");
  const [currency, setCurrency] = useState("Currency");
  const [langOpen, setLangOpen] = useState(false);
  const languages = ["English", "Bangla", "Arabic"];
  const currencies = ["Dollar", "Rupee", "Taka"];
  const [catOpen, setCatOpen] = useState(false);
  const categories = ["Electronics", "Clothing", "Home", "Books"];
  let [cart, setCart] = useState(0);
  let [wishlist, setWishlist] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowArrow(window.pageYOffset > 100);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [fixed, setFixed] = useState(false);

  useEffect(() => {
    const onScroll = () => setFixed(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth <= 992) {
        setIsSticky(window.scrollY > 200);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const sizingData = [
    { name: "Surge Shield Safeguard", category: "Headphone", price: 500.0 },
    { name: "Nova Sound Elegance", category: "UPS System", price: 500.0 },
    { name: "Pure Pod Harmony", category: "Headset Mic", price: 500.0 },
  ];
  const subtotal = sizingData.reduce((sum, p) => sum + p.price, 0);
  const shipping = 50.0;
  const total = subtotal + shipping;

  return (
    <>
      <header className="top-bar">
        <div className="top-bar__section top-bar__left">
          <ul>
            <li>
              <Link to="/theme/about" className="text-light">
                About
              </Link>
            </li>
            <li>
              <Link to="/theme/contact" className="text-light">
                My Account
              </Link>
            </li>
            <li>
              <Link to="/theme/wishlist" className="text-light">
                Wishlist
              </Link>
            </li>
            <li>
              <Link to="/theme/checkout" className="text-light">
                Checkout
              </Link>
            </li>
          </ul>
        </div>

        <div className="top-bar__section top-bar__center">
          Free shipping for all orders of 150$
        </div>

        <div className="top-bar__section top-bar__right">
          <ul>
            <li>Store Location</li>

            <li className="dropdown">
              <button
                className="dropdown__button"
                onClick={() => {
                  setLangOpen(!langOpen);
                  setCurrOpen(false);
                }}
              >
                {language}{" "}
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={langOpen ? "rotated" : ""}
                />
              </button>

              {langOpen && (
                <ul className="dropdown__menu">
                  <li className="dropdown__menu-header">{language}</li>
                  {languages.map((l) => (
                    <li
                      key={l}
                      className="dropdown__menu-item"
                      onClick={() => {
                        setLanguage(l);
                        setLangOpen(false);
                      }}
                    >
                      {l}
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li className="dropdown">
              <button
                className="dropdown__button"
                onClick={() => {
                  setCurrOpen(!currOpen);
                  setLangOpen(false);
                }}
              >
                {currency}{" "}
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={currOpen ? "rotated" : ""}
                />
              </button>

              {currOpen && (
                <ul className="dropdown__menu">
                  <li className="dropdown__menu-header">{currency}</li>
                  {currencies.map((c) => (
                    <li
                      key={c}
                      className="dropdown__menu-item"
                      onClick={() => {
                        setCurrency(c);
                        setCurrOpen(false);
                      }}
                    >
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
      </header>

      <header className="site-header">
        <div className="site-header__top bg-light">
          <Link to="/theme" className="text-decoration-none">
            <div className="logo d-none d-lg-block">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="#e53e3e">
                <path
                  d="M7 4v-2h-4v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96
                        0 1.1.9 2 2 2h12v-2h-11.42c-.14 0-.25-.11-.25-.25l.03-.12
                        .9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49
                        c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1h-14zm0
                        16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                />
              </svg>
              <span className="ms-2 cart-cart">ROISER</span>
            </div>
          </Link>

          <div className="search-block">
            <div
              className="categories-dropdown"
              onClick={() => setCatOpen(!catOpen)}
            >
              All Categories{" "}
              <FontAwesomeIcon
                icon={faAngleDown}
                className={catOpen ? "rotated" : ""}
              />
              {catOpen && (
                <ul className="categories-menu mt-0">
                  {categories.map((c) => (
                    <li key={c} onClick={() => setCatOpen(false)}>
                      {c}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <input
              type="search"
              className="search-input cart-cart1 border"
              placeholder="Search here…"
            />
            <button className="search-btn mb-1 mt-1 cart-cart">
              SEARCH HERE
            </button>
          </div>

          <div className="contact-block">
            <div className="d-flex align-items-center">
              <div className="call-us d-flex flex-column cart-cart">
                <span>Call Us Now:</span>
                <span>+(258) 2159‑2159</span>
              </div>

              <Link
                to="tel:+25821592159"
                className="ms-3 icon-btn border"
                style={{ textDecoration: "none" }}
              >
                <FontAwesomeIcon icon={faPhone} />
              </Link>
            </div>

            <div className="phone-border border"></div>

            <Link className="text-dark" to="/theme/wishlist">
              <div className="icon-btn border">
                <FontAwesomeIcon icon={faHeart} className="rounded-5" />
                <span className="badge pt-1">{wishlist}</span>
              </div>
            </Link>

            <div className="phone-border border"></div>

            <Link className="text-dark" to="/theme/cart">
              <div className="icon-btn border">
                <FontAwesomeIcon icon={faShoppingBag} className="rounded-5 " />
                <span className="badge pt-1">{cart}</span>
              </div>
            </Link>

            <div className="cart-total d-flex flex-column cart-cart">
              <span>Your cart</span>
              <span className="sales-font">$00.00</span>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-center bg-light me-md-0">
          <nav className={`site-header__nav ${fixed ? " is-fixed" : ""}`}>
            <ul className="cart-cart">
              <li className="link-header">
                <Link to="/theme">Home</Link>
              </li>

              <li className="link-header">
                <Link to="/theme/shop">Shop</Link>
              </li>

              <li>Women</li>
              <li>Men</li>
              <li>Pages</li>
              <li className="link-header">
                <Link to="/theme/blog-lists" className="text-light">
                  Blog
                </Link>
              </li>
              <li className="link-header">
                <Link to="/theme/contact">Contact</Link>
              </li>
            </ul>
            <div className="promo-btn">
              Get 30% Discount Now{" "}
              <span className="sale-pill fw-bold">SALE</span>
            </div>
          </nav>
        </div>

        <hr className="d-lg-none d-block m-0" />

        <div
          id="mobileHeader"
          className={`roiser-header d-block d-lg-none shadow-sm bg-light py-3 ${
            isSticky ? "sticky" : ""
          }`}
        >
          <div className="logo d-flex justify-content-between flex-row flex-nowrap m-2">
            <Link to="/theme" className="text-decoration-none text-dark">
              <div className="d-flex align-items-center flex-row">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="#e53e3e">
                  <path d="M7 4v-2h-4v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2h-11.42c-.14 0-.25-.11-.25-.25l.03-.12 .9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49 c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1h-14zm0 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                </svg>
                <span className="fw-bold ms-2">ROISER</span>
              </div>
            </Link>
            <FontAwesomeIcon
              icon={faBars}
              className="theme-hamburger"
              onClick={() => setMenuOpen(true)}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>

        <div
          className={`mobile-drawer${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          <nav
            className="mobile-drawer__nav"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="logo d-flex flex-row justify-content-between">
              <Link to="/theme" className="text-decoration-none text-dark">
                <div>
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="#e53e3e"
                  >
                    <path
                      d="M7 4v-2h-4v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96
                        0 1.1.9 2 2 2h12v-2h-11.42c-.14 0-.25-.11-.25-.25l.03-.12
                        .9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49
                        c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1h-14zm0
                        16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
                    />
                  </svg>
                  <span className="ms-2 text-dark cart-cart">ROISER</span>
                </div>
              </Link>
              <FontAwesomeIcon
                icon={faXmark}
                className="roiser-mark fs-4 mark-open border"
                onClick={() => setMenuOpen(false)}
              />
            </div>

            <ul className="mt-2 sidebar-women cart-cart1 link-header1">
              <li className="link-header1">
                <Link to="/theme">Home</Link>
              </li>
              <li className="link-header1">
                <Link to="/theme/shop">Shop</Link>
              </li>
              <li>Women</li>
              <li>Men</li>
              <li>Pages</li>
              <li>
                <Link to="/theme/blog-lists" className="text-dark">
                  Blog
                </Link>
              </li>
              <li className="link-header1">
                <Link to="/theme/contact">Contact</Link>
              </li>
            </ul>

            <div className="d-flex flex-column mt-3 lh-lg cart-cart">
              <div className="d-flex flex-row align-items-center">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="me-2 location-dot border"
                />
                <span className="side-address">Address:</span>
                <span className="ms-1 country-span mt-1"> Amterdem,109-74</span>
              </div>

              <div className="d-flex flex-row align-items-center mt-3">
                <Link
                  to="tel:+25821592159"
                  className="me-2 location-dot border"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    textDecoration: "none",
                  }}
                >
                  <FontAwesomeIcon icon={faPhone} />
                </Link>
                <span className="side-address">Phone:</span>{" "}
                <span className="ms-1 mt-1 sidebar-women1 country-span">
                  +(258) 2159‑2159
                </span>
              </div>

              <div className="d-flex flex-row align-items-center mt-3">
                <Link
                  to="mailto:info@example.com"
                  className="me-2 location-dot border"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    textDecoration: "none",
                  }}
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                </Link>
                <span className="side-address">Email:</span>{" "}
                <span className="ms-1 mt-1 sidebar-women1 country-span">
                  info@example.com
                </span>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <section className="shop-header">
        <div className="shop-header__overlay" />
        <div className="shop-header__inner">
          <h1 className="shop-header__title">Checkout</h1>
          <nav className="shop-header__breadcrumb" aria-label="breadcrumb">
            <ol className="shop-breadcrumb me-2 me-lg-0 me-md-0 me-sm-5">
              <li className="shop-breadcrumb__item">
                <Link to="/theme">Home</Link>
              </li>
              <FontAwesomeIcon icon={faChevronRight} className="ms-2 me-2" />
              <li
                className="shop-breadcrumb__item shop-breadcrumb__item--active"
                aria-current="page"
              >
                Checkout
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="border cart-cart checkout-major text-start">
          Returning customers?{" "}
          <Link
            className="fw-bold text-decoration-underline text-dark"
            to="/theme/login"
          >
            Click here
          </Link>{" "}
          to login
        </div>
      </div>

      <div className="container my-0 checkout-theme-new cart-cart">
        <div className="row">
          <div className="col-12 col-lg-6 text-start">
            <h4 className="mb-3 text-start fw-bold">Billing Details</h4>
            <form method="post">
              <div className="mb-4">
                <label htmlFor="email" className="form-label">
                  Email Address*
                </label>
                <input
                  type="email"
                  className="form-control py-4"
                  id="email"
                  required
                />
              </div>

              <div className="row gx-lg-3 d-flex flex-row">
                <div className="col-12 col-md-6 col-lg-6 mb-4 text-start">
                  <label htmlFor="firstName" className="form-label">
                    First Name*
                  </label>
                  <input
                    type="text"
                    className="form-control py-4"
                    id="firstName"
                    required
                  />
                </div>
                <div className="col-12 col-md-6 col-lg-6 mb-4 text-start">
                  <label htmlFor="lastName" className="form-label">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    className="form-control py-4"
                    id="lastName"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="company" className="form-label">
                  Company Name (Optional)
                </label>
                <input
                  type="text"
                  className="form-control py-4"
                  id="company"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="country" className="form-label">
                  Country / Region*
                </label>
                <input
                  type="text"
                  className="form-control py-4"
                  id="state"
                  placeholder="United States (US)"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="address1" className="form-label">
                  Street Address*
                </label>
                <input
                  type="text"
                  className="form-control mb-2 py-4"
                  id="address1"
                  placeholder="House number and street name"
                  required
                />

                <input
                  type="text"
                  className="form-control py-4 mt-3"
                  id="address2"
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  required
                />
              </div>

              <div className="col-12 mb-4 text-start">
                <label htmlFor="city" className="form-label">
                  Town / City*
                </label>
                <input
                  type="text"
                  className="form-control py-4"
                  id="city"
                  required
                />
              </div>

              <div className="col-12 mb-4 text-start custom-select">
                <label htmlFor="state" className="form-label">
                  State*
                </label>
                <select
                  id="state"
                  className="form-select select-paris"
                  required
                >
                  <option value="California">California</option>
                  <option value="Paris">Paris</option>
                  <option value="New York">New York</option>
                  <option value="Dhaka">Dhaka</option>
                </select>
              </div>

              <div className="col-12 mb-4 text-start">
                <label htmlFor="zip" className="form-label">
                  Zip Code*
                </label>
                <input
                  type="text"
                  className="form-control py-4"
                  id="zip"
                  required
                />
              </div>

              <div className="col-12 mb-4 text-start">
                <label htmlFor="phone" className="form-label">
                  Phone*
                </label>
                <input
                  type="tel"
                  className="form-control py-4"
                  id="phone"
                  required
                />
              </div>

              <div className="col-12 mb-3 text-start">
                <label htmlFor="">Order Notes*</label>
                <textarea
                  className="form-control arae-theme mt-3"
                  required
                ></textarea>
              </div>
            </form>
          </div>

          <div className="col-12 col-lg-6 text-start">
            <h4 className="mb-4 mt-2 mt-lg-0 fw-bold">Your Order</h4>
            <div className="p-3 bg-light border">
              <div className="d-flex flex-row justify-content-between w-100 flex-nowrap fw-bold border-bottom pb-4 mb-3">
                <div className="order-box">Product</div>
                <div className="order-box">Price</div>
              </div>

              {sizingData.map((item, idx) => (
                <div
                  key={idx}
                  className="d-flex flex-row align-items-center mb-3"
                >
                  <div className="d-flex flex-lg-row align-items-lg-center flex-sm-column flex-md-row w-100 flex-column">
                    <div
                      className="me-3 flex-shrink-0"
                      style={{
                        width: 80,
                        height: 80,
                        backgroundColor: "#ccc",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      80×80
                    </div>

                    <div className="d-flex flex-row w-100 align-items-center">
                      <div className="flex-grow-1">
                        <div className="text-uppercase mt-2 mt-lg-0 text-danger small">
                          {item.category}
                        </div>

                        <div className="fw-semibold">{item.name}</div>
                      </div>
                      <div className="text-end fw-semibold sales-font order-left1">
                        ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <hr className="w-100" />

              <div className="d-flex justify-content-between flex-row flex-nowrap mb-2 py-2">
                <div className="order-left1">Subtotal</div>
                <div className="fw-semibold order-box sales-font order-left1  ">
                  ${subtotal.toFixed(2)}
                </div>
              </div>

              <hr className="w-100" />

              <div className="d-flex justify-content-between flex-row flex-nowrap mb-2 py-2">
                <div className="order-left1">Shipping</div>
                <div className="fw-semibold sales-font">
                  <span className="order-left1">Flat rate:</span> $
                  {shipping.toFixed(2)}
                </div>
              </div>

              <hr className="w-100" />

              <div className="d-flex justify-content-between flex-row flex-nowrap py-2">
                <div className="order-left1">Total Price:</div>
                <div className="sales-font color-roiser fw-bold">
                  ${total.toFixed(2)}
                </div>
              </div>

              <div className="payment-methods-theme d-flex flex-column">
                <div className="d-flex flex-row mt-3 gap-2">
                  <input type="radio" id="bank_transfer" name="paymentMethod" />
                  <label htmlFor="bank_transfer" className="fw-bold">
                    Direct Bank Transfer
                  </label>
                </div>

                <span className="shipped-until mt-1 text-start">
                  Make your payment directly into our bank account. Please use
                  your Order ID as the payment reference. Your order will not be
                  shipped until the funds have cleared in our account.
                </span>

                <div className="d-flex flex-row gap-2 mb-3">
                  <input
                    type="radio"
                    id="check_payments"
                    name="paymentMethod"
                    value="bank_transfer"
                  />
                  <label htmlFor="check_payments" className="fw-bold">
                    Check Payments
                  </label>
                </div>

                <div className="d-flex flex-row gap-2 mb-3">
                  <input
                    type="radio"
                    id="cash_on_delivery"
                    name="paymentMethod"
                    value="cash_on_delivery"
                  />
                  <label htmlFor="cash_on_delivery" className="fw-bold">
                    Cash On Delivery
                  </label>
                </div>

                <div className="d-flex flex-row gap-2 mb-2">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="paypal"
                  />
                  <label htmlFor="paypal" className="fw-bold">
                    Paypal
                  </label>
                </div>
              </div>

              <span className="shipped-until">
                Your personal data will be used to process your order, support
                your experience throughout this website, and for other purposes
                described in our privacy policy.
              </span>

              <div className="d-flex flex-row flex-nowrap gap-2 mt-2 payment-methods-theme1">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="terms_conditions"
                />
                <label htmlFor="terms_conditions">
                  I have read and agree terms and conditions *
                </label>
              </div>

              <div className="mt-3">
                <button className="btn btn-message w-100 d-flex cart-cart1">
                  Place Your Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="custom-cursor"
        style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      />

      {showArrow && (
        <div
          className="fixed-arrow mb-3 me-2"
          onClick={scrollToTop}
          title="Back to top"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </div>
      )}

      <footer className="footer-wrapper text-dark cart-cart mt-3">
        <div className="footer-inner pt-5 mb-4">
          <div className="row text-start text-md-left bg-body py-3 pb-0 d-flex flex-row ms-2 me-2">
            <div className="col-12 col-sm-6 col-md-6 mb-3 col-lg-3">
              <div className="d-flex align-items-start">
                <div className="w-100 d-flex align-items-center align-items-sm-start flex-row flex-nowrap ms-md-0 ms-2">
                  <img
                    src={freeImg}
                    alt="Free Shipping"
                    className="img-fluid mb-2 ship-theme"
                    loading="lazy"
                  />
                  <div className="d-flex flex-column text-start ms-2">
                    <h4 className="mb-1 fw-bold">Free Shipping</h4>
                    <h6 className="shipped-order">
                      Free shipping on orders over $65.00
                    </h6>
                  </div>
                  <div className="border order-over mt-2"></div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-6 mb-3 col-lg-3">
              <div className="d-flex align-items-start">
                <div className="text-center w-100 d-flex align-items-center align-items-sm-start flex-row ms-2 flex-nowrap">
                  <img
                    src={cashImg}
                    alt="Free Returns"
                    className="img-fluid mb-2 ship-theme"
                    loading="lazy"
                  />
                  <div className="d-flex flex-column text-start ms-2">
                    <h4 className="mb-1 fw-bold">Free Returns</h4>
                    <h6 className="shipped-order">
                      30‑days free return policy
                    </h6>
                  </div>
                  <div className="border order-over mt-2 ms-3"></div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-6 mb-3 col-lg-3">
              <div className="d-flex align-items-start">
                <div className="text-center w-100 d-flex align-items-center align-items-sm-start flex-row ms-2 ms-md-0 flex-nowrap">
                  <img
                    src={secureImg}
                    alt="Secured Payments"
                    className="img-fluid mb-2 ship-theme"
                    loading="lazy"
                  />
                  <div className="d-flex flex-column text-start ms-2">
                    <h4 className="mb-1 fw-bold">Secured Payments</h4>
                    <h6 className="shipped-order">
                      We accept all major credit cards
                    </h6>
                  </div>
                  <div className="border order-over mt-2"></div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-6 mb-3 col-lg-3">
              <div className="d-flex align-items-start">
                <div className="text-center w-100 d-flex align-items-center align-items-sm-start flex-row ms-2 flex-nowrap">
                  <img
                    src={qualityImg}
                    alt="Customer Service"
                    className="img-fluid mb-2 ship-theme"
                    loading="lazy"
                  />
                  <div className="d-flex flex-column text-start ms-2">
                    <h4 className="mb-1 fw-bold">Customer Service</h4>
                    <h6 className="shipped-order">
                      Top notch customer service
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-inner pb-4">
          <div className="row ms-1 ms-lg-0 ms-md-0 me-md-1 d-flex flex-md-row">
            <div className="col-12 col-md-6 col-lg-3 mb-0 text-start">
              <h5 className="fw-bold">About Store</h5>
              <div className="d-flex mb-2">
                <div className="footer-call me-3 fw-bolder">
                  <FontAwesomeIcon icon={faPhone} />
                </div>

                <div>
                  <small>Have Question? Call Us 24/7</small>
                  <div className="h5 mb-0 color-roiser fw-bold">
                    +258 3692 2569
                  </div>
                </div>
              </div>
              <ul className="footer-days">
                <li>
                  <strong>Monday - Friday:</strong> 8:00am - 6:00pm
                </li>
                <li>
                  <strong>Saturday:</strong> 8:00am - 6:00pm
                </li>
                <li>
                  <strong>Sunday:</strong> Service Closed
                </li>
              </ul>
            </div>
            <div className="col-12 col-md-3 col-lg-2 mb-0 text-start">
              <h5 className="fw-bold">Our Stores</h5>
              <ul className="footer-days footer-days1">
                <li>New York</li>
                <li>London SF</li>
                <li>Los Angeles</li>
                <li>Chicago</li>
                <li>Las Vegas</li>
              </ul>
            </div>
            <div className="col-12 col-md-3 col-lg-2 mb-0 text-start">
              <h5 className="fw-bold">Shop Categories</h5>
              <ul className="footer-days footer-days1">
                <li>New Arrivals</li>
                <li>Best Selling</li>
                <li>Vegetables</li>
                <li>Fresh Meat</li>
                <li>Fresh Seafood</li>
              </ul>
            </div>
            <div className="col-12 mb-md-4 pb-md-3 col-md-6 col-lg-2 text-start">
              <h5 className="fw-bold">Useful Links</h5>
              <ul className="footer-days footer-days1">
                <li>Privacy Policy</li>
                <li>Terms & Conditions</li>
                <li>Contact Us</li>
                <li>Latest News</li>
                <li>Our Sitemap</li>
              </ul>
            </div>
            <div className="col-12 col-md-6 col-lg-3 mb-0 text-start d-flex flex-column">
              <h5 className="fw-bold">Our Newsletter</h5>
              <p>
                Subscribe to the mailing list to receive updates on the new
                arrivals and other discounts
              </p>
              <form className="newsletter-theme w-100">
                <div className="position-relative subscribe-email">
                  <input
                    type="email"
                    className="form-control pe-5 address-add cart-cart1"
                    placeholder="Email address"
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-subscribe position-absolute d-flex top-50 end-0 translate-middle-y me-1 cart-cart1"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
              <small>I would like to receive news and special offer</small>
            </div>
          </div>
        </div>

        <div className="bg-white py-3 ms-2 me-0 border-top">
          <div className="footer-inner d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="mb-0 mb-md-0 d-flex flex-row">
              <small>Payment System:</small>
            </div>
            <div>
              <small>
                © Copyright & Design 2024{" "}
                <span className="text-danger">Roirer</span>. All Rights
                Reserved.
              </small>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default ThemeCheckout;
