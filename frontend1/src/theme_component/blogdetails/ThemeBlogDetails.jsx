import { React, useEffect, useState } from "react";
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
  faUser,
  faComments,
  faCircleUser,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import freeImg from "../../assets/free.webp";
import cashImg from "../../assets/Cash.webp";
import secureImg from "../../assets/hoursupport.webp";
import qualityImg from "../../assets/quality.webp";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ThemeBlogDetails() {
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
  const [cart, setCart] = useState(0);
  const [wishlist, setWishlist] = useState(0);
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

  const { id } = useParams();
  const [allPosts, setAllPosts] = useState([]);
  const [post, setPost] = useState(null);
  const [post1, setPost1] = useState(null);
  const [user, setUser] = useState([]);
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    axios
      .get(`http://147.93.45.171:1600/blogpostdata/${id}`)
      .then((res) => setPost(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    const latestpostdata = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/latestblogdata"
        );
        setPost1(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    latestpostdata();
  }, []);

  useEffect(() => {
    axios.get("http://147.93.45.171:1600/blogalldata").then((res) => {
      setTags(
        res.data.filter((t) => ["Published", "Draft"].includes(t.status))
      );
    });
  }, []);

  useEffect(() => {
    axios.get("http://147.93.45.171:1600/allcategorydata").then((res) => {
      setCategoryList(
        res.data.filter((c) => ["Published", "Draft"].includes(c.status))
      );
    });
  }, []);

  useEffect(() => {
    let filtered = allPosts;
    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(term) ||
          (b.content && b.content.toLowerCase().includes(term))
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((b) => {
        const cats = b.categories.split(",").map((s) => s.trim().toLowerCase());
        return selectedCategories
          .map((s) => s.toLowerCase())
          .some((sel) => cats.includes(sel));
      });
    }

    setUser(filtered);
  }, [allPosts, search, selectedCategories]);

  const handleCategoryChange = (catName) => {
    setSelectedCategories((prev) =>
      prev.includes(catName)
        ? prev.filter((c) => c !== catName)
        : [...prev, catName]
    );
  };

  const [comment, setComment] = useState({
    names: "",
    email: "",
    message: "",
  });
  const { names, email, message } = comment;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://147.93.45.171:1600/commentpost/${id}`, comment);
      toast.success("Message successfully posted!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Failed to post Message!", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      console.error("Error posting comment:", error);
    }
  };

  const onInputChange = (e) => {
    setComment({ ...comment, [e.target.name]: e.target.value });
  };

  let [comments, setComments] = useState([]);

  useEffect(() => {
    let commentdata = async () => {
      try {
        const response = await axios.get(
          `http://147.93.45.171:1600/commentsdatagets/${id}`
        );
        setComments(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    commentdata();

    const interval = setInterval(() => {
      commentdata();
    }, 100);
    return () => clearInterval(interval);
  }, []);

  if (!post) {
    return null;
  }

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
          <h1 className="shop-header__title">Blog Details</h1>
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
                Blog Details
              </li>
            </ol>
          </nav>
        </div>
      </section>

      <div className="container d-flex justify-content-lg-center justify-content-md-center align-items-center cart-cart ms-lg-0">
        <div className="row gap-0 blog-lists-theme d-flex justify-content-lg-start justify-content-xl-center justify-content-xxl-center justify-content-md-start ms-0 me-1 me-lg-0 me-md-0">
          <div className="col-12 col-sm-12 col-md-12 col-lg-8 blog-system text-start d-flex flex-column h-auto p-0 mb-3 bg-light">
            <div className="details-themex mb-0 w-100">
              <img
                src={`http://147.93.45.171:1600/src/image/${post.image}`}
                alt={`Image for ${post.name ?? "blog post"}`}
                className="img-fluid"
                loading="lazy"
              />
            </div>

            <div className="p-3">
              <div className="d-flex flex-wrap align-items-center text-muted flex-row flex-nowrap mb-2">
                <div className="me-lg-4 me-2 gap-2 d-flex align-items-center flex-row">
                  <FontAwesomeIcon icon={faClock} />
                  <span className="mt-0 color-month">
                    {(() => {
                      const d = new Date(post.date);
                      return `${d.getDate()} ${d.toLocaleString("default", {
                        month: "long",
                      })}, ${d.getFullYear()}`;
                    })()}
                  </span>
                </div>

                <div className="d-flex align-items-center flex-row">
                  <FontAwesomeIcon icon={faUser} className="mt-0" />
                  <span className="ms-2 color-month">{post.categories}</span>
                </div>
              </div>

              <h2 className="fw-bold ms-0 name-design">{post.name}</h2>

              <div className="name-design1 ms-0 me-3">{post.description}</div>

              <div className="block-quote-theme ms-0">"{post.author_name}"</div>

              <div className="name-design1 mb-0 ms-0">
                {(post.content ?? "").trim().toLowerCase() !== "null" &&
                post.content.trim() !== ""
                  ? post.content
                  : "No content available."}
              </div>

              <div className="row mb-0 comment-details ms-0 gap-1 d-flex flex-lg-nowrap flex-md-nowrap ">
                <div className="col-12 col-md-6 mb-1 comment-details1 p-0 d-flex flex-md-row">
                  <img
                    src="https://avatars.mds.yandex.net/i?id=2431e82efb91a4e2ff0cc42a72ea375e05e3a12e-5588720-images-thumbs&n=13"
                    alt="customer"
                    className="img-fluid border"
                  />
                </div>
                <div className="col-12 col-md-6 mb-3 comment-details1 p-0 d-flex flex-md-row">
                  <img
                    src="https://avatars.mds.yandex.net/i?id=815578133ef26a5c7e150843ff23769d-4895906-images-thumbs&n=13"
                    alt="customer"
                    className="img-fluid"
                  />
                </div>
              </div>

              <div className="d-flex flex-row justify-content-between mb-lg-2 mb-0 mt-1 align-items-center flex-wrap">
                <div className="d-flex gap-2 flex-row">
                  <button className="btn btn-birthday btn-body text-dark border">
                    Dream
                  </button>
                  <button className="btn btn-birthday btn-body text-dark border">
                    Rings
                  </button>
                  <button className="btn btn-birthday btn-body text-dark border">
                    Birthday
                  </button>
                </div>
                <div className="d-flex flex-row gap-3 me-4 mt-2 mt-lg-0 ms-2 ms-lg-0 pe-1 align-items-center">
                  <span>Follow Us:</span>
                  <Link
                    to="https://www.facebook.com/"
                    target="_blank"
                    aria-label="Facebook"
                  >
                    <FontAwesomeIcon
                      icon={faFacebookF}
                      className="facebook-follow text-dark"
                    />
                  </Link>

                  <Link
                    to="https://x.com/"
                    target="_blank"
                    aria-label="Twitter (X)"
                  >
                    <FontAwesomeIcon
                      icon={faXTwitter}
                      className="facebook-follow text-dark"
                    />
                  </Link>

                  <Link
                    to="https://x.com/"
                    target="_blank"
                    aria-label="Twitter (X)"
                  >
                    <FontAwesomeIcon
                      icon={faLinkedinIn}
                      className="facebook-follow text-dark"
                    />
                  </Link>

                  <Link
                    to="https://www.instagram.com/"
                    target="_blank"
                    aria-label="Instagram"
                  >
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className="facebook-follow text-dark"
                    />
                  </Link>
                </div>
              </div>

              <div className="d-flex flex-column">
                <h3 className="mb-3 mt-3 name-design">
                  COMMENTS{" "}
                  <span className="sales-font">({comments.length})</span>
                </h3>
                {Array.isArray(comments) && comments.length > 0 ? (
                  comments.map((data, index) => (
                    <div
                      key={index}
                      className="d-flex flex-row flex-wrap flex-lg-nowrap flex-md-nowrap mb-3 w-100"
                    >
                      <div className="d-flex flex-row flex-md-nowrap flex-wrap">
                        <img
                          src="https://avatars.mds.yandex.net/i?id=5f3007b894cac40c9eb36c0e5f2faddf5f59c434-4355070-images-thumbs&n=13"
                          alt="Client"
                          className="img-fluid mountain-comment border h-auto"
                        />
                        <div className="d-flex flex-column ms-2 text-start">
                          <span className="name-design1 mt-1 mb-0">
                            <FontAwesomeIcon
                              icon={faCircleUser}
                              className="me-2"
                            />
                            {(() => {
                              const d = new Date(data.created_at);
                              return `${d.getDate()} ${d.toLocaleString(
                                "default",
                                { month: "long" }
                              )}, ${d.getFullYear()}`;
                            })()}
                          </span>
                          <span className="fw-bold">{data.names}</span>
                          <span className="name-design1">
                            {data.message.split(" ").slice(0, 24).join(" ")}.
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-start"></div>
                )}

                <h3 className="mb-1 name-design">Add a Review</h3>
                <div className="text-mute name-design1">
                  Your email address will not be published. Required fields are
                  marked *
                </div>

                <form
                  className="row g-0 mt-0 w-100"
                  method="post"
                  onSubmit={handleSubmit}
                >
                  <div className="d-flex flex-column">
                    <div className="d-flex flex-wrap flex-lg-nowrap flex-md-nowrap gap-3 w-100">
                      <div className="d-flex flex-md-row flex-md-nowrap w-100 gap-3">
                        <div className="position-relative w-100">
                          <input
                            type="text"
                            className="form-control py-4 pe-5"
                            placeholder="Your Name"
                            name="names"
                            value={names}
                            onChange={onInputChange}
                            required
                          />
                          <FontAwesomeIcon
                            icon={faUser}
                            className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                          />
                        </div>

                        <div className="position-relative w-100 ">
                          <input
                            type="email"
                            className="form-control py-4 pe-5 cart-cart"
                            placeholder="Your Email"
                            name="email"
                            value={email}
                            onChange={onInputChange}
                            required
                          />
                          <FontAwesomeIcon
                            icon={faEnvelope}
                            className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="position-relative w-100 mt-3 mt-lg-3">
                      <textarea
                        className="form-control pe-5 cart-cart text-details"
                        placeholder="Message"
                        name="message"
                        value={message}
                        onChange={onInputChange}
                        required
                      />
                      <FontAwesomeIcon
                        icon={faComments}
                        className="position-absolute top-0 end-0 translate-middle-y me-3 mt-4 text-muted"
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-start mb-3">
                    <button
                      type="submit"
                      className="btn btn-danger px-3 mt-3 py-4 d-flex w-auto cart-cart btn-message"
                    >
                      Submit Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="col-12 col-sm-12 col-md-12 col-lg-4 d-flex flex-column blog-system1 text-start ms-2">
            <div className=" border px-4 py-4 rounded w-100">
              <input
                type="search"
                placeholder="Search"
                className="form-control rounded-0 border py-4 cart-cart"
              />
            </div>

            <div className="border px-4 py-4 mt-3 rounded w-100">
              <h3 className="category-blogs">Category</h3>
              <hr className="w-100 mt-3" />
              <div className="d-flex flex-column lh-lg">
                {categoryList.length > 0 ? (
                  categoryList.map((cat, idx) => {
                    const inputId = `category-${idx}`;
                    return (
                      <div
                        className="d-flex flex-row gap-2 align-items-center"
                        key={inputId}
                      >
                        <input
                          type="checkbox"
                          id={inputId}
                          className="form-check-input checked-reverse"
                          onChange={() => handleCategoryChange(cat.name)}
                          checked={selectedCategories.includes(cat.name)}
                        />
                        <label htmlFor={inputId}>{cat.name}</label>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center cart-cart">
                    No blog category available.
                  </div>
                )}
              </div>
            </div>

            <div className="border px-4 py-4 mt-3 rounded">
              <h3 className="category-blogs">Latest Post</h3>
              <hr className="w-100 mt-3" />
              {Array.isArray(post1) && post1.length > 0 ? (
                [...post1]
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .slice(0, 3)
                  .map((data, idx) => (
                    <div className="d-flex flex-row mt-0" key={data.id ?? idx}>
                      <img
                        src={`http://147.93.45.171:1600/src/image/${data.image}`}
                        alt={
                          data.name
                            ? `Image for ${data.name}`
                            : `Blog image ${idx + 1}`
                        }
                        className="img-fluid mb-2 latest-photos"
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
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center cart-cart">
                  No blog posts available.
                </div>
              )}
            </div>

            <div className=" border px-4 py-4 mt-3 rounded">
              <h3 className="category-blogs">Instagram Posts</h3>
              <hr className="w-100 mt-3" />
              <div className="d-flex flex-row flex-wrap gap-2">
                <div className="instam-wrap border"></div>
                <div className="instam-wrap border"></div>
                <div className="instam-wrap border"></div>
                <div className="instam-wrap border"></div>
                <div className="instam-wrap border"></div>
                <div className="instam-wrap border"></div>
                <div className="instam-wrap border"></div>
                <div className="instam-wrap border"></div>
              </div>
            </div>

            <div className=" border px-4 py-4 mt-3 rounded tags‑widget">
              <h3 className="category-blogs">Tags</h3>
              <hr className="w-100 mt-3" />
              <div className="d-flex flex-row flex-wrap gap-2">
                {Array.isArray(tags) && tags.length > 0 ? (
                  tags.map((data, key) => (
                    <div
                      key={key}
                      className="border rounded px-3 py-2 design-tags"
                    >
                      {data.name}
                    </div>
                  ))
                ) : (
                  <div className="text-center cart-cart">
                    No blog tags available.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
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

export default ThemeBlogDetails;
