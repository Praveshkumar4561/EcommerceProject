import { React, useEffect, useState } from "react";
import "../Theme.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faAngleDown,
  faArrowUp,
  faCheck,
  faChevronRight,
  faEnvelope,
  faHeart,
  faLocationDot,
  faPhone,
  faShoppingBag,
  faXmark,
  faPlay,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import freeImg from "../../assets/free.webp";
import cashImg from "../../assets/Cash.webp";
import secureImg from "../../assets/hoursupport.webp";
import qualityImg from "../../assets/quality.webp";
import { Link } from "react-router-dom";

function ThemeAbout() {
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

  const [open, setOpen] = useState(false);

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
          <h1 className="shop-header__title">About Us</h1>
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
                About Us
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <div className="container mt-3 d-flex justify-content-lg-start justify-content-xl-center justify-content-xxl-center justify-content-md-start align-items-center ms-xl-0">
        <div className="row theme-abouts ms-sm-1 d-flex flex-row flex-lg-nowrap flex-wrap">
          <div className="col-12 col-md-6 col-lg-6 border-0 cart-cart p-2 ps-lg-3 p-lg-5 d-flex flex-column text-start theme-abouts1">
            <h3 className="fw-bold me-2 mb-2 section-world">
              CREATING A WORLD WHERE FASHION IS A LIFESTYLE
            </h3>
            <p className="section-world1">
              Fashionable content invites us to embark on a fashion-forward
              journey, where creativity knows no bounds and self-expression is
              celebrated. So, let's dive into the world of fashion, where trends
              are set, boundaries are broken.
            </p>
            <div className="d-flex gap-3 w-100">
              <div className="sells-div">
                <div className="tick-team border d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="fw-bolder sell-icon"
                  />
                </div>
                Fast Growing Sells
              </div>
              <div className="sells-div">
                {" "}
                <div className="tick-team border d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="fw-bolder sell-icon"
                  />
                </div>
                24/7 Quality Services
              </div>
            </div>
            <div className="d-flex gap-3 mt-3 w-100">
              <div className="sells-div">
                <div className="tick-team border d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="fw-bolder sell-icon"
                  />
                </div>
                Skilled Team Members
              </div>
              <div className="sells-div">
                {" "}
                <div className="tick-team border d-flex justify-content-center align-items-center">
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="fw-bolder sell-icon"
                  />
                </div>
                Best Quality Services
              </div>
            </div>
            <div className="mt-4">
              <button
                className="leant-about cart-cart1 rounded-1"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                <span>Learn More</span>
              </button>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-6 border p-0 theme-video">
            <div className="ratio ratio-16x9 ratio-video">
              <FontAwesomeIcon
                icon={faPlay}
                className="custom-play-btn"
                onClick={() => setOpen(true)}
              />
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1"
                title="Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          {open && (
            <div className="video-overlay">
              <button className="close-btn" onClick={() => setOpen(false)}>
                <FontAwesomeIcon icon={faXmark} />
              </button>
              <div className="overlay-content">
                <iframe
                  width="100%"
                  height="100%"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0&modestbranding=1"
                  title="Video Fullscreen"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container team-section d-flex justify-content-center justify-content-sm-start align-items-center cart-cart h-auto">
        <div className="row mb-5 pb-2 ms-0 d-flex justify-content-center flex-row">
          <h3 className="text-center mb-3 fw-bold mt-5">MEET WITH TEAM</h3>

          <div className="col-12 col-sm-6 col-md-6 col-lg-3 team-meet1 rounded">
            <img
              src="https://avatars.mds.yandex.net/i?id=672f7cbe49b6fea7460a085d9ee6c92d4bcb78c6-4077357-images-thumbs&n=13"
              alt="client"
              className="img-fluid rounded"
            />
            <div className="d-flex flex-column align-items-center text-center mt-2 lh-lg">
              <span>DESIGN DIRECTOR</span>
              <h3 className="fw-bold henry-wilson">Henry David Wilson</h3>
              <hr className="mt-0 mb-3 w-100" />
              <div className="d-flex flex-row flex-nowrap justify-content-center gap-3">
                <Link
                  to="https://www.facebook.com/"
                  target="_blank"
                  aria-label="Facebook"
                >
                  <FontAwesomeIcon
                    icon={faFacebookF}
                    className="border px-2 py-2 rounded-5 text-dark social-media"
                  />
                </Link>
                <Link
                  to="https://www.instagram.com/"
                  target="_blank"
                  aria-label="Instagram"
                >
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="border px-2 py-2 rounded-5 text-dark social-media"
                  />
                </Link>
                <Link
                  to="https://x.com/"
                  target="_blank"
                  aria-label="Twitter (X)"
                >
                  <FontAwesomeIcon
                    icon={faXTwitter}
                    className="border px-2 py-2 rounded-5 text-dark social-media"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-6 col-lg-3  team-meet1 rounded">
            <img
              src="https://avatars.mds.yandex.net/i?id=6a17dbb7b295532c539d0595861191da32c58fc6-5025999-images-thumbs&n=13"
              alt="client"
              className="img-fluid rounded"
            />
            <div className="d-flex flex-column align-items-center text-center mt-2 lh-lg">
              <span>DESIGN DIRECTOR</span>
              <h3 className="fw-bold henry-wilson">Travis Head</h3>
              <hr className="mt-0 mb-3 w-100" />
              <div className="d-flex flex-row flex-nowrap align-items-center justify-content-center gap-3">
                <Link
                  to="https://www.facebook.com/"
                  target="_blank"
                  aria-label="Facebook"
                >
                  <FontAwesomeIcon
                    icon={faFacebookF}
                    className="border px-2 py-2 rounded-5 text-dark social-media"
                  />
                </Link>
                <Link
                  to="https://www.instagram.com/"
                  target="_blank"
                  aria-label="Instagram"
                >
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="border px-2 py-2 rounded-5 text-dark social-media"
                  />
                </Link>
                <Link
                  to="https://x.com/"
                  target="_blank"
                  aria-label="Twitter (X)"
                >
                  <FontAwesomeIcon
                    icon={faXTwitter}
                    className="border px-2 py-2 rounded-5 text-dark social-media"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-6 col-lg-3  team-meet1 rounded">
            <img
              src="https://avatars.mds.yandex.net/i?id=daf759b83fcc1bc07f5c5f079c0044917a9b700e-9601198-images-thumbs&n=13"
              alt="client"
              className="img-fluid rounded"
            />
            <div className="d-flex flex-column align-items-center text-center mt-2 lh-lg">
              <span>DESIGN DIRECTOR</span>
              <h3 className="fw-bold henry-wilson">Smirthi Mandhana</h3>
              <hr className="mt-0 mb-3 w-100" />
              <div className="d-flex flex-row flex-nowrap align-items-center justify-content-center gap-3">
                <Link
                  to="https://www.facebook.com/"
                  target="_blank"
                  aria-label="Facebook"
                >
                  <FontAwesomeIcon
                    icon={faFacebookF}
                    className="border px-2 py-2 rounded-5 text-dark social-media"
                  />
                </Link>
                <Link
                  to="https://www.instagram.com/"
                  target="_blank"
                  aria-label="Instagram"
                >
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="border px-2 py-2 rounded-5 text-dark social-media"
                  />
                </Link>
                <Link
                  to="https://x.com/"
                  target="_blank"
                  aria-label="Twitter (X)"
                >
                  <FontAwesomeIcon
                    icon={faXTwitter}
                    className="border px-2 py-2 rounded-5 text-dark social-media"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-6 col-md-6 col-lg-3  team-meet1 rounded">
            <img
              src="https://avatars.mds.yandex.net/i?id=726f9422cd5c7906b31ffb50c2fd28005ccbf5e6-4936140-images-thumbs&n=13"
              alt="client"
              className="img-fluid rounded"
            />
            <div className="d-flex flex-column align-items-center text-center mt-2 lh-lg">
              <span>DESIGN DIRECTOR</span>
              <h3 className="fw-bold henry-wilson">Henry Klassen</h3>
              <hr className="mt-0 mb-3 w-100" />
              <div className="d-flex flex-row flex-nowrap align-items-center justify-content-center gap-3">
                <Link
                  to="https://www.facebook.com/"
                  target="_blank"
                  aria-label="Facebook"
                >
                  <FontAwesomeIcon
                    icon={faFacebookF}
                    className="border px-2 py-2 rounded-5 text-dark social-media"
                  />
                </Link>
                <Link
                  to="https://www.instagram.com/"
                  target="_blank"
                  aria-label="Instagram"
                >
                  <FontAwesomeIcon
                    icon={faInstagram}
                    className="border px-2 py-2 rounded-5 text-dark social-media"
                  />
                </Link>
                <Link
                  to="https://x.com/"
                  target="_blank"
                  aria-label="Twitter (X)"
                >
                  <FontAwesomeIcon
                    icon={faXTwitter}
                    className="border px-2 py-2 rounded-5 text-dark social-media"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5 discounts-grow cart-cart">
        <div className="row align-items-center mt-lg-4 mt-0 mb-0">
          <div className="col-12 col-md-4 text-center">
            <div className="feature-card text-center">
              <div className="feature-number sales-font">01</div>
              <h5 className="mt-3 fw-bold service-support">
                24/7 SUPPORT SERVICE
              </h5>
              <p className="mt-2 understand-harm">
                Understanding the sometimes harmful methods of modern
                agriculture, we started a niche for quality organic produce
                grown.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4 text-center order-md-2 order-index">
            <img
              src="https://avatars.mds.yandex.net/i?id=672f7cbe49b6fea7460a085d9ee6c92d4bcb78c6-4077357-images-thumbs&n=13"
              alt="client"
              className="img-fluid"
            />
          </div>

          <div className="col-12 col-md-4 text-center order-md-3">
            <div className="feature-card text-center">
              <div className="feature-number sales-font mt-3 mt-lg-0">03</div>
              <h5 className="mt-3 fw-bold service-support">
                BEST OFFER & DISCOUNT
              </h5>
              <p className="mt-2 understand-harm">
                Understanding the sometimes harmful methods of modern
                agriculture, we started a niche for quality organic produce
                grown.
              </p>
            </div>
          </div>
        </div>

        <div className="row align-items-lg-start align-items-xl-center align-items-xxl-center mt-0">
          <div className="col-12 col-md-4 text-center order-0 order-md-1 order-index">
            <img
              src="https://avatars.mds.yandex.net/i?id=672f7cbe49b6fea7460a085d9ee6c92d4bcb78c6-4077357-images-thumbs&n=13"
              alt="404"
              className="img-fluid"
            />
          </div>

          <div className="col-12 col-md-4 text-center order-md-2 mt-3 mt-lg-0">
            <div className="feature-card text-center">
              <div className="feature-number sales-font">02</div>
              <h5 className="mt-3 fw-bold service-support">WHO WE ARE?</h5>
              <p className="mt-2 understand-harm">
                Understanding the sometimes harmful methods of modern
                agriculture, we started a niche for quality organic produce
                grown.
              </p>
            </div>
          </div>

          <div className="col-12 col-md-4 text-center order-md-3 order-index">
            <img
              src="https://avatars.mds.yandex.net/i?id=672f7cbe49b6fea7460a085d9ee6c92d4bcb78c6-4077357-images-thumbs&n=13"
              alt="client"
              className="img-fluid"
            />
          </div>
        </div>
      </div>

      <div className="container about-testi d-flex justify-content-center justify-content-sm-start align-items-center cart-cart h-auto w-100 m-0 mt-4">
        <div className="row mb-5 pb-2 ms-0 d-flex justify-content-lg-center justify-content-md-start w-100 flex-row">
          <h3 className="text-center mb-3 fw-bold mt-5">HAPPY CUSTOMERS</h3>

          <div className="col-12 col-sm-12 text-start col-md-6 col-lg-4 happy-stars mt-lg-3 mt-0 mb-4 ps-0">
            <div className="testimonial-box-theme">
              <h3 className="stars-quality">
                Product Quality
                <span className="stars-theme">★★★★★</span>
              </h3>
              <p className="quote-theme">
                “This is genuinely the first theme bought for which I did not
                have to write one line of code. I would recommend everybody”
              </p>
            </div>
          </div>

          <div className="col-12 col-sm-12 text-start col-md-6 col-lg-4 happy-stars mt-lg-3 mb-4 ps-0">
            <div className="testimonial-box-theme">
              <h3 className="stars-quality">
                Product Quality
                <span className="stars-theme">★★★★★</span>
              </h3>
              <p className="quote-theme">
                “This is genuinely the first theme bought for which I did not
                have to write one line of code. I would recommend everybody”
              </p>
            </div>
          </div>

          <div className="col-12 col-sm-12 text-start col-md-6 col-lg-4 happy-stars mt-3 mb-0 ps-0">
            <div className="testimonial-box-theme">
              <h3 className="stars-quality">
                Product Quality
                <span className="stars-theme">★★★★★</span>
              </h3>
              <p className="quote-theme">
                “This is genuinely the first theme bought for which I did not
                have to write one line of code. I would recommend everybody”
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container my-4 mt-5 d-flex justify-content-center align-items-center">
        <div className="row row-cols-2 row-cols-md-5 d-flex flex-row image-theme">
          <div className="col border text-center p-0">
            <img
              src="https://avatars.mds.yandex.net/i?id=17dcfc05c358c2ed9559667c2def99dc6bb1f3c8-9221446-images-thumbs&n=13"
              alt="customer"
              className="img-fluid"
            />
          </div>
          <div className="col border text-center p-0">
            <img
              src="https://avatars.mds.yandex.net/i?id=2431e82efb91a4e2ff0cc42a72ea375e05e3a12e-5588720-images-thumbs&n=13"
              alt="customer"
              className="img-fluid"
            />
          </div>
          <div className="col border text-center p-0">
            <img
              src="https://avatars.mds.yandex.net/i?id=a0f6f7e3904f1f6c2955e058dd1eceb4f477ab66-4117155-images-thumbs&n=13"
              alt="customer"
              className="img-fluid"
            />
          </div>
          <div className="col border text-center p-0">
            <img
              src="https://avatars.mds.yandex.net/i?id=815578133ef26a5c7e150843ff23769d-4895906-images-thumbs&n=13"
              alt="customer"
              className="img-fluid"
            />
          </div>
          <div className="col border text-center p-0">
            <img
              src="https://avatars.mds.yandex.net/i?id=074d835cb85bfd3a119dae049d10a4c88aa0782d-3809718-images-thumbs&n=13"
              alt="customer"
              className="img-fluid"
            />
          </div>
          <div className="col border text-center p-0">
            <img
              src="https://avatars.mds.yandex.net/i?id=a0f6f7e3904f1f6c2955e058dd1eceb4f477ab66-4117155-images-thumbs&n=13"
              alt="customer"
              className="img-fluid"
            />
          </div>
          <div className="col border text-center p-0">
            <img
              src="https://avatars.mds.yandex.net/i?id=f6c5b704fc6cd09433c17da6646cbaa66e12572c-4419167-images-thumbs&n=13"
              alt="customer"
              className="img-fluid"
            />
          </div>
          <div className="col border text-center p-0">
            <img
              src="https://avatars.mds.yandex.net/i?id=e5bfdc597282216a04e5288f3ad1618a7ea1b063-12533415-images-thumbs&n=13"
              alt="customer"
              className="img-fluid"
            />
          </div>
          <div className="col border text-center p-0">
            <img
              src="https://avatars.mds.yandex.net/i?id=e5bfdc597282216a04e5288f3ad1618a7ea1b063-12533415-images-thumbs&n=13"
              alt="customer"
              className="img-fluid"
            />
          </div>
          <div className="col border text-center p-0">
            <img
              src="https://avatars.mds.yandex.net/i?id=f8923528b0c5dc4c74a3af72e0470331e44727ad-5356799-images-thumbs&n=13"
              alt="customer"
              className="img-fluid"
            />
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

export default ThemeAbout;
