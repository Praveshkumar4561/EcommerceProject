import React, { useEffect, useMemo, useState } from "react";
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
  faClock,
  faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import freeImg from "../../assets/free.webp";
import cashImg from "../../assets/Cash.webp";
import secureImg from "../../assets/hoursupport.webp";
import qualityImg from "../../assets/quality.webp";
import { Link } from "react-router-dom";
import axios from "axios";

function ThemeShopGrid() {
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

  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("Default");
  const [items, setItems] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const MIN_PRICE = 30;
  const MAX_PRICE = 150;
  const DEFAULT_PRICE = 150;

  const [price, setPrice] = useState(DEFAULT_PRICE);

  const handleChange = (e) => {
    setPrice(Number(e.target.value));
  };

  const [labels, setLabels] = useState([]);

  useEffect(() => {
    let labelsdata = async () => {
      let response = await axios.get(
        "http://147.93.45.171:1600/productlabelsdata"
      );
      setLabels(response.data);
    };
    labelsdata();
  }, []);

  async function fetchFilteredProducts() {
    try {
      const { data } = await axios.post(
        "http://147.93.45.171:1600/combinedfilter",
        {
          sort: sortOption,
          brands: selectedBrands,
          size: selectedSize,
          category: selectedCategories,
          minPrice: MIN_PRICE,
          maxPrice: price,
        }
      );
      setItems(data);
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchFilteredProducts();
  }, [sortOption, selectedBrands, selectedSize, selectedCategories, price]);

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedCategories((prev) => [...prev, value]);
    } else {
      setSelectedCategories((prev) => prev.filter((cat) => cat !== value));
    }
  };

  useEffect(() => {
    axios.get("http://147.93.45.171:1600/productcatdata").then((res) => {
      setCategoryList(
        res.data.filter((c) => ["Published", "Draft"].includes(c.status))
      );
    });
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = {};
    items.forEach((item) => {
      const cats = item.categories
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
      cats.forEach((catName) => {
        counts[catName] = (counts[catName] || 0) + 1;
      });
    });
    return counts;
  }, [items]);

  const sizes = ["S", "M", "L", "XL", "XXL"];
  const sizeCounts = useMemo(() => {
    const counts = sizes.reduce((acc, s) => ({ ...acc, [s]: 0 }), {});
    items.forEach((item) => {
      item.attribute
        .split(",")
        .map((a) => a.split(":").map((str) => str.trim()))
        .forEach(([key, val]) => {
          if (key === "Size" && counts.hasOwnProperty(val)) {
            counts[val]++;
          }
        });
    });
    return counts;
  }, [items]);

  const [brands, setBrands] = useState([]);

  useEffect(() => {
    async function fetchBrands() {
      try {
        const { data } = await axios.get(
          "http://147.93.45.171:1600/brandsdata"
        );
        setBrands(data);
      } catch (err) {
        console.error("Failed to load brands:", err);
      }
    }
    fetchBrands();
  }, []);

  const brandCounts = useMemo(() => {
    const counts = {};
    items.forEach((item) => {
      const b = item.brand?.trim();
      if (!b) return;
      counts[b] = (counts[b] || 0) + 1;
    });
    return counts;
  }, [items]);

  const [isGrid, setIsGrid] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;
  const totalPages = Math.ceil(items.length / postsPerPage);

  const paginatedPosts = items.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const pageWindowSize = 3;

  let windowStart;
  if (currentPage > totalPages - (pageWindowSize - 1)) {
    windowStart = Math.max(1, totalPages - (pageWindowSize - 1));
  } else {
    windowStart = currentPage;
  }

  const visiblePages = Array.from(
    { length: Math.min(pageWindowSize, totalPages) },
    (_, i) => windowStart + i
  );

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

              <div className="ms-3 icon-btn border">
                <FontAwesomeIcon icon={faPhone} />
              </div>
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
          <h1 className="shop-header__title">Shop Grid</h1>
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
                Shop Grid
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <div className="container d-flex justify-content-lg-center justify-content-md-center align-items-center cart-cart ms-lg-0">
        <div className="row gap-0 blog-lists-theme d-flex justify-content-lg-start justify-content-xl-center justify-content-xxl-center justify-content-md-start ms-0 me-0 me-lg-0 me-md-0 ">
          <div className="col-12 col-lg-8 p-0 blog-system text-start me-2 me-lg-0 d-flex flex-column mb-3">
            <div className="d-flex justify-content-between align-items-center flex-row flex-nowrap mb-3 w-100">
              <div className="d-flex align-items-center flex-row">
                <div className="grdi-pad d-flex flex-row flex-nowrap">
                  <button
                    type="button"
                    className={`btn grid-outline p-1 ${
                      isGrid ? "" : "text-muted"
                    }`}
                    onClick={() => setIsGrid(true)}
                    aria-label="Grid View"
                  >
                    <svg width="20" height="17" viewBox="0 0 20 17">
                      <rect width="5" height="3" fill="currentColor" />
                      <rect y="7" width="5" height="3" fill="currentColor" />
                      <rect y="14" width="5" height="3" fill="currentColor" />
                      <rect x="7.72" width="5" height="3" fill="currentColor" />
                      <rect
                        x="7.72"
                        y="7"
                        width="5"
                        height="3"
                        fill="currentColor"
                      />
                      <rect
                        x="7.72"
                        y="14"
                        width="5"
                        height="3"
                        fill="currentColor"
                      />
                      <rect x="15" width="5" height="3" fill="currentColor" />
                      <rect
                        x="15"
                        y="7"
                        width="5"
                        height="3"
                        fill="currentColor"
                      />
                      <rect
                        x="15"
                        y="14"
                        width="5"
                        height="3"
                        fill="currentColor"
                      />
                    </svg>
                  </button>

                  <button
                    type="button"
                    className={`btn grid-outline p-1 ${
                      !isGrid ? "" : "text-muted"
                    }`}
                    onClick={() => setIsGrid(false)}
                    aria-label="List View"
                  >
                    <svg width="20" height="17" viewBox="0 0 20 17">
                      <rect x="0" width="5" height="3" fill="currentColor" />
                      <rect
                        x="0"
                        y="7"
                        width="5"
                        height="3"
                        fill="currentColor"
                      />
                      <rect
                        x="0"
                        y="14"
                        width="5"
                        height="3"
                        fill="currentColor"
                      />
                      <rect
                        x="7.72"
                        width="13"
                        height="3"
                        fill="currentColor"
                      />
                      <rect
                        x="7.72"
                        y="7"
                        width="13"
                        height="3"
                        fill="currentColor"
                      />
                      <rect
                        x="7.72"
                        y="14"
                        width="13"
                        height="3"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>

                <span className="ms-2 shown-results">
                  Showing{" "}
                  <span className="sales-font">
                    1–{items.length} of {items.length}
                  </span>{" "}
                  results
                </span>
              </div>

              <select
                id="sort-select"
                className="form-select w-auto me-lg-1"
                style={{ height: "48px", minWidth: "168px" }}
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                  fetchFilteredProducts();
                }}
              >
                <option value="Default">Default Shorting</option>
                <option value="Oldest">Most Popular</option>
                <option value="Newest">Date</option>
                <option value="Price: low to high">Trending</option>
                <option value="Price: high to low">Featured</option>
                <option value="Name: A-Z">Discounted</option>
              </select>
            </div>

            <div className="row gap-1 me-0 ms-0 mt-0 d-flex flex-md-row w-100">
              {Array.isArray(paginatedPosts) && paginatedPosts.length > 0 ? (
                paginatedPosts.map((data) => {
                  const productLabel = labels.find(
                    (item) => item.name === data.label
                  );
                  const labelColor = productLabel
                    ? productLabel.color
                    : "green";

                  return (
                    <div
                      key={data.id}
                      className={`mb-3 border p-3 rounded ${
                        isGrid
                          ? "col-12 col-md-6 col-lg-4 grid-theme-system"
                          : "col-12 list-theme-system d-flex align-items-center"
                      }`}
                    >
                      <div className="list-image flex-shrink-0 position-relative">
                        <img
                          src={`http://147.93.45.171:1600/src/image/${data.image}`}
                          alt={data.name}
                          className="img-fluid w-100"
                          loading="lazy"
                        />
                        {data.label && (
                          <span
                            className="image-label-btn cart-cart1"
                            style={{
                              backgroundColor: labelColor,
                              fontSize: "14px",
                              zIndex: 2,
                            }}
                          >
                            {data.label}
                          </span>
                        )}
                      </div>

                      <div className="list-content text-start">
                        <hr className="w-100" />
                        <span className="shown-content">{data.store}</span>
                        <h3 className="mb-2 fw-bold name-nvidia">
                          {data.name}
                        </h3>
                        <div className="d-flex flex-row flex-nowrap gap-2 sales-font">
                          <span className="shown-content1 fw-bold">
                            {data.price_sale}
                          </span>
                          <span className="color-roiser fw-bold">
                            {data.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-start cart-cart">
                  No products available
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="d-flex justify-content-center flex-row flex-nowrap w-100 align-items-center gap-1 my-1">
                {visiblePages.map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`primary-cluthch border${
                      currentPage === pageNum ? " active" : ""
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  className="btn rounded-0 angle-ended border d-flex justify-content-center align-items-center"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  <FontAwesomeIcon icon={faAngleRight} />
                </button>
              </div>
            )}
          </div>

          <div className="col-12 col-sm-12 col-md-12 col-lg-4 d-flex flex-column blog-system1 text-start">
            <div className="sidebar-wrapper1 w-100">
              <div className="border px-4 py-4 mt-0 rounded sticky-widget radio-fifteen">
                <h3 className="category-blogs">Categories</h3>
                <hr className="w-100 mt-3" />

                {categoryList.length > 0 ? (
                  categoryList.map((cat, idx) => {
                    const name = cat.name;
                    const count = categoryCounts[name] || 0;

                    return (
                      <div
                        key={cat.id || idx}
                        className="d-flex justify-content-between flex-row align-items-center py-1"
                      >
                        <label className="d-flex align-items-center flex-row">
                          <input
                            type="checkbox"
                            id={`cat-${cat.id || idx}`}
                            name="category"
                            value={name}
                            checked={selectedCategories.includes(name)}
                            onChange={handleCategoryChange}
                          />
                          <span className="ms-1">{name}</span>
                        </label>
                        <span className="sales-font">({count})</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center">No categories available</div>
                )}
              </div>

              <div className="border px-4 py-4 mt-3 rounded w-100">
                <h3 className="category-blogs">Filter by price</h3>
                <hr className="w-100 mt-3" />
                <input
                  type="range"
                  className="price-filter-range"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  value={price}
                  onChange={handleChange}
                />
                <div className="price-filter-footer">
                  <div className="text-start fw-bold">
                    Price:{" "}
                    <span className="sales-font fw-bold pt-2">
                      ${MIN_PRICE} - ${MAX_PRICE}
                    </span>
                  </div>
                  <span className="price-filter-max sales-font fw-bold">
                    ${price}
                  </span>
                </div>
              </div>

              <div className="border px-4 py-4 mt-3 rounded sticky-widget radio-fifteen">
                <h3 className="category-blogs">Item Size</h3>
                <hr className="w-100 mt-3" />

                {sizes.map((size) => (
                  <div
                    key={size}
                    className="d-flex justify-content-between align-items-center mb-2 pb-1 flex-row flex-nowrap"
                  >
                    <label className="d-flex align-items-center flex-row flex-nowrap">
                      <input
                        type="radio"
                        name="size"
                        id={`size-${size}`}
                        value={size}
                        checked={selectedSize === size}
                        onChange={(e) => setSelectedSize(e.target.value)}
                      />
                      <span className="ms-1">{size}</span>
                    </label>
                    <span className="sales-font">({sizeCounts[size]})</span>
                  </div>
                ))}
              </div>

              <div className="border px-4 py-4 mt-3 rounded sticky-widget radio-fifteen">
                <h3 className="category-blogs">Brands</h3>
                <hr className="w-100 mt-3" />
                {brands.length > 0 ? (
                  brands.map((data, index) => (
                    <div
                      key={index}
                      className="d-flex justify-content-between align-items-center flex-row"
                    >
                      <label className="d-flex align-items-center flex-row pb-2">
                        <input
                          type="checkbox"
                          id={`brand-${index}`}
                          name="brand"
                          value={data.name}
                          checked={selectedBrands.includes(data.name)}
                          onChange={(e) => {
                            const brand = e.target.value;
                            setSelectedBrands((prev) =>
                              e.target.checked
                                ? [...prev, brand]
                                : prev.filter((b) => b !== brand)
                            );
                          }}
                        />
                        <span className="ms-1">{data.name}</span>
                      </label>
                      <span className="sales-font">
                        ({brandCounts[data.name] || 0})
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center">No brands available</div>
                )}
              </div>

              <div className="border px-4 py-4 mt-3 rounded">
                <h3 className="category-blogs">Brands</h3>
                <hr className="w-100 mt-3" />
                {Array.isArray(items) && items.length > 0 ? (
                  items.slice(0, 3).map((data, idx) => (
                    <div className="d-flex flex-row mt-0" key={data.id ?? idx}>
                      <img
                        src={`http://147.93.45.171:1600/src/image/${data.image}`}
                        alt={
                          data.name
                            ? `Image for ${data.name}`
                            : `Blog image ${idx + 1}`
                        }
                        className="img-thumbnail mb-2 latest-photos"
                        loading="lazy"
                      />
                      <div className="d-flex flex-column ms-3">
                        <div className="d-flex flex-row align-items-center">
                          <FontAwesomeIcon icon={faClock} className="me-2" />
                          <span className="hedaer-fashion mt-1">
                            {(() => {
                              const d = new Date(data.date);
                              return `${d.getDate()} ${d.toLocaleString(
                                "default",
                                {
                                  month: "long",
                                }
                              )}, ${d.getFullYear()}`;
                            })()}
                          </span>
                        </div>
                        <span className="fw-bold">
                          {data.name.split(" ").slice(0, 8).join(" ")}
                        </span>
                        <div className="d-flex flex-row flex-nowrap sales-font">
                          <span className="alert-theme">{data.price_sale}</span>
                          <span className="color-roiser fw-bold">
                            {data.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center cart-cart">
                    No blog posts available.
                  </div>
                )}
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

export default ThemeShopGrid;
