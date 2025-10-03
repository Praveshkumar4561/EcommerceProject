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
  faStar,
  faEye,
  faArrowRightArrowLeft,
  faTruck,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import freeImg from "../../assets/free.webp";
import cashImg from "../../assets/Cash.webp";
import secureImg from "../../assets/hoursupport.webp";
import qualityImg from "../../assets/quality.webp";
import { Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ThemeShopDetails() {
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

  const [user, setUser] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState("");

  useEffect(() => {
    const productpagedata = async () => {
      try {
        let response = await axios.get(
          "https://demo.webriefly.com/api/productpagedata"
        );
        const filteredData = response.data.filter(
          (product) =>
            product.status === "Published" || product.status === "Draft"
        );
        setUser(filteredData);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    productpagedata();
  }, []);

  const [labels, setLabels] = useState([]);

  useEffect(() => {
    let labelsdata = async () => {
      let response = await axios.get(
        "https://demo.webriefly.com/api/productlabelsdata"
      );
      setLabels(response.data);
    };
    labelsdata();
  }, []);

  const handleImageClick = (index) => {
    setTransitionDirection(
      index > currentIndex ? "right-to-left" : "left-to-right"
    );
    setCurrentIndex(index);
  };

  const [activeTab, setActiveTab] = useState("Description");
  const tabs = ["Description", "Additional information", "Reviews"];
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const activeRating = hover || rating;

  const [review, setReview] = useState({
    first_name: "",
    email: "",
    comment: "",
  });

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setReview({
      ...review,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { first_name, email, comment } = review;
    if (!first_name || !email || !comment) {
      toast.error("Please fill all required fields.", {
        position: "bottom-right",
        autoClose: 1000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("user_name", first_name);
    formData.append("email", email);
    formData.append("star", rating);
    formData.append("comment", comment);

    try {
      const response = await axios.post(
        "https://demo.webriefly.com/api/reviewdatasubmit",
        formData
      );
      if (response.status === 200) {
        toast.success("Review submitted successfully!", {
          position: "bottom-right",
          autoClose: 1000,
        });
        setReview({ first_name: "", email: "", comment: "" });
        setRating(5);
        setHover(0);
      } else {
        toast.error("Submission failed. Try again.", {
          position: "bottom-right",
          autoClose: 1000,
        });
      }
    } catch (error) {
      toast.error("Something went wrong while submitting the review.", {
        position: "bottom-right",
        autoClose: 1000,
      });
    }
  };

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
          <h1 className="shop-header__title">Shop Details</h1>
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
                Shop Details
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <div className="container d-flex justify-content-lg-center justify-content-sm-center ms-0 justify-content-xl-center align-items-center cart-cart">
        {Array.isArray(user) && user.length > 0 ? (
          [user[currentIndex]].map((data, index) => (
            <div
              className="row shop-detail-theme detail-responsive gap-0 d-flex flex-row flex-wrap flex-lg-nowrap flex-lg-row"
              key={index}
            >
              <div className="col-12 col-md-12 col-lg-6 d-flex flex-row flex-lg-nowrap border flex-wrap p-2 text-start justify-content-md-start">
                <div className="d-flex flex-md-row w-100">
                  <div className="d-flex flex-lg-column flex-column border-removed1 align-items-center align-items-md-start flex-wrap gap-2 mb-2">
                    {user.slice(0, 3).map((item, imgIndex) => {
                      const productLabel = labels.find(
                        (l) => l.name === item.label
                      );
                      const labelColor = productLabel
                        ? productLabel.color
                        : "green";
                      return (
                        <div
                          key={imgIndex}
                          className="sidebar-shop border position-relative"
                          onClick={() => handleImageClick(imgIndex)}
                          style={{ cursor: "pointer" }}
                        >
                          <img
                            src={`https://demo.webriefly.com/uploads/${item.image}`}
                            alt={item.name}
                            className="img-fluid"
                          />
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className={`full-details-theme ms-0 ms-md-2 ms-lg-1 d-flex justify-content-lg-center align-items-center w-100 image-transition ${transitionDirection} position-relative`}
                  >
                    <img
                      src={`https://demo.webriefly.com/uploads/${data.image}`}
                      alt={data.name}
                      className="img-fluid"
                    />
                    {data.label &&
                      (() => {
                        const productLabel = labels.find(
                          (l) => l.name === data.label
                        );
                        const labelColor = productLabel
                          ? productLabel.color
                          : "green";
                        return (
                          <button
                            type="button"
                            className="image-label-btn btn btn-sm position-absolute rounded-5 cart-cart1 ms-2"
                            style={{
                              top: "10px",
                              right: "10px",
                              backgroundColor: labelColor,
                              color: "#fff",
                              width: "60px",
                            }}
                          >
                            {data.label}
                          </button>
                        );
                      })()}
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-12 col-lg-6 h-100 d-flex flex-column p-2 pt-3 pt-lg-1 ps-lg-3 text-start">
                <span className="modern-dress mb-1">{data.brand}</span>
                <h3 className="modern-poncho">{data.name}</h3>
                <div className="d-flex flex-row gap-1 flex-nowrap w-100">
                  <FontAwesomeIcon icon={faStar} className="mt-1 text-danger" />
                  <FontAwesomeIcon icon={faStar} className="mt-1 text-danger" />
                  <FontAwesomeIcon icon={faStar} className="mt-1 text-danger" />
                  <FontAwesomeIcon icon={faStar} className="mt-1 text-danger" />
                  <FontAwesomeIcon icon={faStar} className="mt-1 text-danger" />
                  <span className="ms-2">(1 customer review)</span>
                </div>
                <div className="d-flex flex-row product-info-theme align-items-center">
                  <h4>{data.price}</h4>
                  <span>{data.price_sale}</span>
                </div>
                <hr className="w-100" />
                <div className="eget-lorem d-flex flex-column mb-0">
                  <p>{data.description.split(" ").slice(0, 25).join(" ")}.</p>

                  <div className="d-flex flex-row align-items-center gap-2 flex-nowrap">
                    <FontAwesomeIcon icon={faEye} />
                    <span>28 people are viewing this right now</span>
                  </div>

                  <hr className="w-100" />

                  <div className="d-flex flex-column stock-left">
                    <span>
                      Only {data.minimumorder} items left in stock! Only{" "}
                      {data.minimumorder} items left in stock!
                    </span>
                    <div className="border w-100 mt-2 rounded progress-now"></div>
                  </div>

                  <div className="d-flex flex-row arrow-dhl-part m-0 p-0">
                    <ul className="text-start p-0 mt-3">
                      <li>
                        <FontAwesomeIcon
                          icon={faArrowRightArrowLeft}
                          className="me-2 pe-2"
                        />
                        Free returns
                      </li>
                      <li>
                        <FontAwesomeIcon icon={faTruck} className="me-2" />
                        Free shipping via DHL, fully insured
                      </li>
                      <li>
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="me-2 pe-1"
                        />
                        All taxes and customs duties included
                      </li>
                    </ul>
                  </div>

                  <div className="product-btn-theme w-100 d-flex flex-row flex-nowrap gap-2">
                    <form>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        className="form-number"
                      />
                    </form>
                    <button className="rounded-5 btn border d-flex align-items-center cart-cart">
                      Add To Cart
                    </button>
                  </div>

                  <div className="w-100 mt-4">
                    <button className="btn btn-message rounded-1 d-flex align-items-center cart-cart w-100 d-flex">
                      Buy The Item Now
                    </button>
                  </div>

                  <div className="d-flex flex-row flex-nowrap gap-3 mt-3 meta-theme">
                    <Link to="#">Compare</Link>
                    <Link to="#">Ask a question</Link>
                    <Link to="#">Share</Link>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="d-flex mt-5">No products available</div>
        )}
      </div>

      <div className="container d-flex justify-content-center align-items-center mt-4">
        <div className="row shop-detail-theme1">
          <div className="d-flex flex-row flex-nowrap justify-content-start tab-navigation mb-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? "active-tab" : ""}`}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
          <hr className="w-100" />

          {activeTab === "Description" &&
            (Array.isArray(user) && user.length > 0 && user[currentIndex] ? (
              <div className="description-tab cart-cart d-flex flex-row flex-lg-nowrap gap-2  flex-wrap">
                <div className="desciprion-div rounded">
                  {user[currentIndex].description}
                </div>
                <div className="desciprion-div1 rounded">
                  <img
                    src={`https://demo.webriefly.com/uploads/${user[currentIndex].image}`}
                    alt="Image"
                    className="w-100 rounded border"
                  />
                </div>
              </div>
            ) : (
              <div className="d-flex mt-5">No products available</div>
            ))}

          {activeTab === "Additional information" && (
            <div className="information-tab cart-cart1">
              <div className="table-responsive">
                <table className="table table-bordered table-waist table-secondary align-middle text-center">
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Size</th>
                      <th scope="col">Bust</th>
                      <th scope="col">Waist</th>
                      <th scope="col">Hip</th>
                    </tr>
                  </thead>

                  <tbody>
                    {(() => {
                      const product = user[currentIndex];
                      const standardSizes = ["S", "M", "L", "XL", "XXL"];
                      const sizeDataMap = {};
                      if (product && product.attribute) {
                        const attributes = product.attribute.split(",") || [];
                        const attrMap = {};
                        for (let attr of attributes) {
                          const [key, value] = attr
                            .split(":")
                            .map((s) => s.trim());
                          if (key && value) {
                            attrMap[key.toLowerCase()] = value;
                          }
                        }
                        const size = attrMap["size"];
                        if (size) {
                          sizeDataMap[size.toUpperCase()] = {
                            bust: attrMap["bust"] || "--",
                            waist: attrMap["waist"] || "--",
                            hip: attrMap["hip"] || "--",
                          };
                        }
                      }

                      return standardSizes.map((sizeLabel) => {
                        const data = sizeDataMap[sizeLabel] || {
                          bust: "--",
                          waist: "--",
                          hip: "--",
                        };

                        return (
                          <tr key={`${product?.id || 0}-${sizeLabel}`}>
                            <td>{sizeLabel}</td>
                            <td className="sales-font">{data.bust}</td>
                            <td className="sales-font">{data.waist}</td>
                            <td className="sales-font">{data.hip}</td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Reviews" && (
            <div className="d-flex flex-row flex-wrap flex-lg-nowrap flex-md-wrap gap-2 cart-cart">
              <div className="border reviews-theme-new rounded px-3 py-3 lh-lg">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Corrupti facilis aliquam nam amet eaque maiores nihil id ipsum
                distinctio labore vero, explicabo voluptate omnis libero
                nesciunt rem provident voluptatibus quasi qui quaerat dolor
              </div>
              <div className="reviews-theme-new1 p-1 ps-lg-3 pt-3 rounded">
                <form onSubmit={handleSubmit}>
                  <h4 className="fw-bold mb-1">Review this product</h4>
                  <span>
                    Your email address will not be published. Required fields
                    are marked *
                  </span>

                  <div className="d-flex flex-row flex-nowrap align-items-center mt-1">
                    <span>Your rating:</span>
                    <div className="ms-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesomeIcon
                          key={star}
                          icon={faStar}
                          className="me-1"
                          style={{ cursor: "pointer" }}
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHover(star)}
                          onMouseLeave={() => setHover(0)}
                          color={star <= activeRating ? "#e53e3e" : "#ccc"}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-4 mt-3">
                    <label htmlFor="first_name" className="visually-hidden">
                      Name
                    </label>
                    <input
                      id="first_name"
                      type="text"
                      name="first_name"
                      className="form-control rounded mt-1 py-4 cart-cart"
                      placeholder="Your Name"
                      value={review.first_name}
                      onChange={onInputChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="email" className="visually-hidden">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      className="form-control rounded mt-1 py-4 cart-cart"
                      placeholder="Your Email"
                      value={review.email}
                      onChange={onInputChange}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="comment" className="visually-hidden">
                      Comment
                    </label>
                    <textarea
                      id="comment"
                      name="comment"
                      className="form-control rounded mt-1 py-2 cart-cart"
                      placeholder="Comment"
                      style={{ height: "120px", resize: "none" }}
                      value={review.comment}
                      onChange={onInputChange}
                      required
                    />
                  </div>

                  <div className="d-flex flex-row flex-nowrap mt-0 gap-2 text-start">
                    <input
                      type="checkbox"
                      id="save_info"
                      className="form-check-input custom-checkbox-theme"
                      required
                    />
                    <label htmlFor="save_info" className="save-info">
                      Save my name, email, and website in this browser for next
                      time I comment.
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="mt-3 cart-cart1 btn d-flex align-items-center btn-message"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}
          <ToastContainer />
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

export default ThemeShopDetails;
