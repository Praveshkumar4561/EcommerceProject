import { React, useEffect, useState } from "react";
import "../Theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faArrowUp,
  faBars,
  faChevronRight,
  faEnvelope,
  faHeart,
  faLocationDot,
  faPhone,
  faShoppingBag,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import freeImg from "../../assets/free.webp";
import cashImg from "../../assets/Cash.webp";
import secureImg from "../../assets/hoursupport.webp";
import qualityImg from "../../assets/quality.webp";
import { Link } from "react-router-dom";

function ThemeCart() {
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
                <Link to="/theme/blog-lists" className="text-light">
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
          <h1 className="shop-header__title">Cart</h1>
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
                Cart
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* <div className="cart-section bg-free py-5 text-start mt-3 cart-cart">
        <div className="container cart-inner">
          <div className="bg-add p-4 rounded shipped-progress">
            <p className="mb-2">
              Add <strong>$59.69</strong> to cart and get free shipping
            </p>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className="progress-bar bg-danger"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>
          </div>

          <div className="row text-start">
            <div className="col-lg-8 border">
              <div className="table-responsive rounded">
                <table className="table mb-0">
                  <thead className="text-uppercase small text-muted bg-light">
                    <tr>
                      <th></th>
                      <th>Product</th>
                      <th className="text-center">Price</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-end">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <button className="btn btn-link text-danger p-0">
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </td>
                      <td className="d-flex align-items-center">
                        <div
                          className="me-3"
                          style={{
                            width: "80px",
                            height: "80px",
                            background: "#ccc",
                          }}
                        />
                        <span>Power Guard Fortress</span>
                      </td>
                      <td className="text-center">$550.00</td>
                      <td className="text-center">
                        <input
                          type="number"
                          className="form-control form-control-sm text-center"
                          defaultValue={1}
                          min={1}
                          style={{ width: "70px" }}
                        />
                      </td>
                      <td className="text-end">$550.00</td>
                    </tr>

                    <tr>
                      <td>
                        <button className="btn btn-link text-danger p-0">
                          <FontAwesomeIcon icon={faTimes} />
                        </button>
                      </td>
                      <td className="d-flex align-items-center">
                        <div
                          className="me-3"
                          style={{
                            width: "80px",
                            height: "80px",
                            background: "#ccc",
                          }}
                        />
                        <span>Quantum Sound Enigma</span>
                      </td>
                      <td className="text-center">$550.00</td>
                      <td className="text-center">
                        <input
                          type="number"
                          className="form-control form-control-sm text-center"
                          defaultValue={1}
                          min={1}
                          style={{ width: "70px" }}
                        />
                      </td>
                      <td className="text-end">$550.00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="d-flex flex-nowrap w-100 gap-2 align-items-center bg-white rounded p-4 mt-3">
                <div className="d-flex flex-row justify-content-start">
                  <input
                    type="text"
                    className="form-control coupon-form"
                    placeholder="Coupon Code"
                  />
                  <button className="btn d-flex btn-message cart-cart ms-2 apply-btn">
                    Apply Coupon
                  </button>
                </div>
                <div className="d-flex justify-content-end ms-auto">
                  <button className="btn d-flex cart-cart ms-2 apply-btn">
                    UPDATE CART
                  </button>
                </div>
              </div>
            </div>

            <div className="col-lg-4 text-start total-cart">
              <div className="bg-add rounded p-4">
                <h5 className="mb-4">Cart Totals</h5>
                <div className="row mb-3">
                  <div className="col-6">Subtotal</div>
                  <div className="col-6 text-end">$1100.00</div>

                  <div className="col-6">Shipping</div>
                  <div className="col-6">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="shipping"
                        id="freeShip"
                      />
                      <label className="form-check-label" htmlFor="freeShip">
                        Free Shipping
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="shipping"
                        id="flatRate"
                      />
                      <label className="form-check-label" htmlFor="flatRate">
                        Flat Rate
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="shipping"
                        id="localPickup"
                      />
                      <label className="form-check-label" htmlFor="localPickup">
                        Local Pickup
                      </label>
                    </div>
                    <small className="text-muted">
                      Shipping options will be updated during checkout
                    </small>
                  </div>
                </div>

                <div className="row">
                  <div className="col-6">Total</div>
                  <div className="col-6 text-end fw-bold">$724.00</div>
                </div>

                <button className="btn btn-danger w-100 mt-3 d-flex">
                  Proceed To Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* <div className="mx-auto container ms-md-0 mt-5 cart-cart d-flex justify-content-start justify-content-xl-center justify-content-xxl-center">
        <div className="cart-grid cart-container">
          <div className="progress-wrapper p-3 bg-light rounded">
            <p className="mb-2">
              Add <span className="text-danger fw-bold sales-font">$59.69</span>{" "}
              to cart and get free shipping
            </p>
            <div className="progress" style={{ height: "6px" }}>
              <div
                className="progress-bar bg-danger"
                role="progressbar"
                style={{ width: "75%" }}
              />
            </div>
          </div>

          <div className="cart-totals border rounded p-4">
            <h5 className="fw-bold mb-3">CART TOTALS</h5>
            <div className="d-flex justify-content-between border-bottom flex-row py-2">
              <span>SUBTOTAL</span>
              <span className="sales-font">$1100.00</span>
            </div>
            <div className="py-2 border-bottom">
              <strong>SHIPPING</strong>

              <div className="d-flex flex-column gap-1 ms-5 ps-5">
                <div className="d-flex flex-row gap-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="shipping"
                    id="free"
                  />
                  <label className="form-check-label" htmlFor="free">
                    Free Shipping
                  </label>
                </div>

                <div className="d-flex flex-row gap-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="shipping"
                    id="flat"
                  />
                  <label className="form-check-label" htmlFor="flat">
                    Flat Rate
                  </label>
                </div>

                <div className="d-flex flex-row gap-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="shipping"
                    id="free"
                  />
                  <label className="form-check-label" htmlFor="pickup">
                    Local Pickup
                  </label>
                </div>
              </div>

              <small className="text-muted d-block mt-2 ms-5 ps-5">
                Shipping options will be updated during checkout
              </small>

              <Link
                to="#"
                className="d-inline-block mt-2 text-decoration-none text-dark"
              >
                Calculate Shipping
              </Link>
            </div>

            <div className="d-flex justify-content-between flex-row flex-nowrap py-2">
              <strong>TOTAL</strong>
              <strong className="text-danger sales-font fw-bold">
                $724.00
              </strong>
            </div>
            <button className="btn cart-cart w-100 d-flex btn-message d-flex align-items-center mt-3   text-light">
              Proceed To Checkout
            </button>
          </div>

          <div className="table-wrapper">
            <div className="table-responsive overflow-x-scroll border rounded p-3">
              <table className="table align-middle text-center mb-0 table-responsive">
                <thead className="bg-light">
                  <tr>
                    <th />
                    <th className="text-start">PRODUCTS</th>
                    <th>PRICE</th>
                    <th>QUANTITY</th>
                    <th>SUBTOTAL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <span className="text-danger fs-4" role="button">
                        ×
                      </span>
                    </td>
                    <td className="text-start d-flex align-items-center gap-2 flex-row flex-nowrap">
                      <div
                        style={{
                          width: "80px",
                          height: "80px",
                          background: "#aaa",
                        }}
                        className="d-flex justify-content-center align-items-center text-white fw-bold"
                      >
                        80X80
                      </div>
                      <div>
                        <strong>Quantum Sound Enigma</strong>
                      </div>
                    </td>
                    <td className="sales-font">$550.00</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        defaultValue={1}
                        style={{ maxWidth: "80px" }}
                      />
                    </td>
                    <td className="sales-font">$230.50</td>
                  </tr>
                  <tr>
                    <td colSpan={5}>
                      <div className="d-flex flex-nowrap w-100 gap-2 align-items-start ms-0 bg-white rounded pt-3 pb-3 mt-0">
                        <div className="d-flex flex-row justify-content-start">
                          <input
                            type="text"
                            className="form-control coupon-form"
                            placeholder="Coupon Code"
                          />
                          <button className="btn d-flex justify-content-center align-items-center btn-message cart-cart ms-2 apply-btn">
                            Apply Coupon
                          </button>
                        </div>
                        <div className="ms-lg-auto me-0">
                          <button className="btn d-flex cart-cart btn-message align-items-center apply-btn1 text-light">
                            UPDATE CART
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div> */}

      <div className="container py-4 cart-container">
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-lg-8">
            <div className="mb-4 p-4 bg-light rounded">
              <p className="mb-2 text-start">
                Add <span className="text-danger fw-bold">$59.69</span> to cart
                and get free shipping
              </p>
              <div className="progress" style={{ height: "8px" }}>
                <div
                  className="progress-bar bg-danger"
                  role="progressbar"
                  style={{ width: "75%" }}
                  aria-valuenow={75}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>

            <div className="mb-3 bg-white rounded shadow-sm w-100">
              <div className="table-responsive">
                <table className="table mb-0 border">
                  <thead className="thead-light">
                    <tr>
                      <th />
                      <th>PRODUCTS</th>
                      <th>PRICE</th>
                      <th>QUANTITY</th>
                      <th>SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span style={{ cursor: "pointer" }}>×</span>
                      </td>
                      <td className="d-flex align-items-center">
                        <div
                          className="bg-secondary text-white d-flex align-items-center justify-content-center me-3"
                          style={{ width: "80px", height: "80px" }}
                        >
                          80X80
                        </div>
                        <span className="fw-bold">Power Guard Fortress</span>
                      </td>
                      <td>$550.00</td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          style={{ width: "60px" }}
                        />
                      </td>
                      <td>$230.50</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="row gx-2 gy-2 align-items-center">
              <div className="col-12 col-md-8">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Coupon Code"
                  />
                  <button className="btn btn-danger" type="button">
                    Apply Coupon
                  </button>
                </div>
              </div>
              <div className="col-12 col-md-4 text-md-end">
                <button
                  className="btn btn-outline-secondary px-4"
                  type="button"
                >
                  Update Cart
                </button>
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-4 mt-4 mt-lg-0">
            <div className="bg-white rounded shadow-sm border p-4">
              <h5 className="mb-3">CART TOTALS</h5>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>$1100.00</span>
              </div>
              <div className="mb-3">
                <p className="mb-1">Shipping</p>
                {["Free Shipping", "Flat Rate", "Local Pickup"].map(
                  (opt, idx) => (
                    <div className="form-check" key={idx}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="shipOptions"
                        id={`shipOpt${idx}`}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`shipOpt${idx}`}
                      >
                        {opt}
                      </label>
                    </div>
                  )
                )}
                <small className="text-muted d-block mt-2">
                  Shipping options will be updated during checkout
                </small>
                <button className="btn btn-link p-0 mt-2" type="button">
                  Calculate Shipping
                </button>
              </div>
              <hr />
              <div className="d-flex justify-content-between mb-3 fw-bold">
                <span>Total</span>
                <span>$724</span>
              </div>
              <button className="btn btn-danger btn-block w-100" type="button">
                Proceed To Checkout
              </button>
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

export default ThemeCart;
