import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./BlogPage.css";
import Tonic from "../../assets/Tonic.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import Hamburger from "../../assets/hamburger.svg";
import Close from "../../assets/Close.webp";
import axios from "axios";
import UserContext from "../../context/UserContext";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import JsonLd from "../JsonLd";
import { Helmet } from "react-helmet-async";

function BlogPage() {
  let { count, setCount } = useContext(UserContext);

  useEffect(() => {
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
    cartdata();
  }, []);

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

  let [user, setUser] = useState([]);

  useEffect(() => {
    alldata();
  }, []);

  const alldata = async () => {
    try {
      let response = await axios.get("http://89.116.170.231:1600/blogpostdata");
      const filteredData = response.data.filter(
        (blog) =>
          (blog.status === "Published" || blog.status === "Draft") &&
          String(blog.feature).toLowerCase() === "yes"
      );
      setUser(filteredData);
    } catch (error) {
      console.error("Error fetching blog data:", error);
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

  let [cart, setCart] = useState("");

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/get-theme-breadcrumb"
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
          "http://89.116.170.231:1600/wishlistdata"
        );
        setCount6(response.data.length);
      } catch (error) {
        console.error("Error fetching wishlist data:", error);
      }
    };
    wishlistdata();
  }, []);

  const schemaData = {
    "@context": "http://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "RxLyte",
        url: "http://srv724100.hstgr.cloud/",
        description:
          "RxLyte is a modern ecommerce platform offering a wide range of premium healthcare products.",
        keywords:
          "RxLyte, Ecommerce, premium healthcare, online pharmacy, RxLyte Ecommerce site",
        publisher: {
          "@id": "RxLyte",
        },
      },
      {
        "@type": "Product",
        name: "RxLyte",
        aggregateRating: {
          "@type": "AggregateRating",
          url: "https://rxlye.com/Tonic.svg",
          ratingValue: 4.9,
          bestRating: 5,
          ratingCount: 6324,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "http://srv724100.hstgr.cloud/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "http://srv724100.hstgr.cloud/blog",
          },
        ],
      },

      ...(Array.isArray(user)
        ? user.map((blog) => ({
            "@type": "BlogPosting",
            headline: blog.name,
            image: blog.image,
            description: blog.description,
            url: blog.url,
            datePublished: blog.datePublished,
            author: {
              "@type": "Person",
              name: blog.author_name,
            },
            publisher: {
              "@type": "Organization",
              name: "RxLyte",
              logo: {
                "@type": "ImageObject",
                url: "https://rxlye.com/Tonic.svg",
              },
            },
          }))
        : []),
    ],
  };

  let [ads, setAds] = useState([]);

  useEffect(() => {
    const adspagedata = async () => {
      try {
        const response = await axios.get("http://89.116.170.231:1600/adsdata");
        setAds(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    adspagedata();
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
          "http://89.116.170.231:1600/cookiesalldata"
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
      await axios.post("http://89.116.170.231:1600/newsletterpost", letter);
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
      <JsonLd data={schemaData} />
      <Helmet>
        <title>Latest Trends & Shopping Tips - Read Our Blog | Rxlyte</title>
        <meta
          name="description"
          content="Stay updated with the latest shopping trends, expert tips, and exclusive insights. Read our blog for guides, reviews, and industry news."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://srv724100.hstgr.cloud/blog" />
      </Helmet>

      <div className="container-fluid">
        <div className="container">
          <div className="row m-auto">
            <div className="ad-container m-0">
              {(() => {
                const footerAd = ads.find(
                  (data) =>
                    data.location === "Header(before)" &&
                    new Date(data.expired) > new Date() &&
                    data.status !== "pending"
                );
                return footerAd ? (
                  <div className="ad-card border">
                    <picture className="ad-picture">
                      {footerAd.mobileImage && (
                        <source
                          media="(max-width: 767px)"
                          srcSet={`http://89.116.170.231:1600/src/image/${footerAd.mobileImage}`}
                        />
                      )}
                      {footerAd.desktopImage && (
                        <source
                          media="(min-width: 768px) and (max-width: 991px)"
                          srcSet={`http://89.116.170.231:1600/src/image/${footerAd.desktopImage}`}
                        />
                      )}
                      <img
                        src={`http://89.116.170.231:1600/src/image/${footerAd.image}`}
                        alt="Advertisement"
                        className="ad-img"
                      />
                    </picture>
                    <div className="ad-overlay">
                      <div className="ad-overlay-top">
                        <button className="ad-button btn btn-success d-flex cart-cart1">
                          <Link to="/shop" className="ad-link">
                            {footerAd.button}
                          </Link>
                        </button>
                      </div>
                      <div className="ad-overlay-bottom cart-cart">
                        <h3 className="ad-title">{footerAd.title}</h3>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      </div>

      <div
        className="container"
        id="container-customx"
        style={{
          backgroundColor:
            cart?.background_color ||
            (cart?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: cart?.background_image
            ? `url(http://89.116.170.231:1600/src/image/${cart.background_image})`
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

          <main className="container mt-5 cart-cart container-bread">
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
                      Blog
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
                    <ol className="breadcrumb d-flex flex-nowrap flex-row gap-0 overflow-hidden">
                      <li className="breadcrumb-item navbar-item fw-medium p-0">
                        <Link to="/" className="text-dark">
                          Home
                        </Link>
                      </li>
                      <li className="breadcrumb-item navbar-item fw-medium text-dark p-0">
                        Blog
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
        <div className="container">
          <div className="row m-auto">
            <div className="ad-container m-0">
              {(() => {
                const footerAd = ads.find(
                  (data) =>
                    data.location === "Header(after)" &&
                    new Date(data.expired) > new Date()
                );
                return footerAd ? (
                  <div className="ad-card border">
                    <picture className="ad-picture">
                      {footerAd.mobileImage && (
                        <source
                          media="(max-width: 767px)"
                          srcSet={`http://89.116.170.231:1600/src/image/${footerAd.mobileImage}`}
                        />
                      )}
                      {footerAd.desktopImage && (
                        <source
                          media="(min-width: 768px) and (max-width: 991px)"
                          srcSet={`http://89.116.170.231:1600/src/image/${footerAd.desktopImage}`}
                        />
                      )}
                      <img
                        src={`http://89.116.170.231:1600/src/image/${footerAd.image}`}
                        alt="Advertisement"
                        className="ad-img"
                      />
                    </picture>
                    <div className="ad-overlay">
                      <div className="ad-overlay-top">
                        <button className="ad-button btn btn-success d-flex cart-cart1">
                          <Link to="/shop" className="ad-link">
                            {footerAd.button}
                          </Link>
                        </button>
                      </div>
                      <div className="ad-overlay-bottom cart-cart">
                        <h3 className="ad-title">{footerAd.title}</h3>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid overflow-hidden">
        <div className="container mt-2 pt-4 d-flex justify-content-start ms-0 ms-lg-0">
          <div className="row d-flex">
            {Array.isArray(user) && user.length > 0 ? (
              user.map((blog, index) => (
                <article
                  className="col-12 col-md-12 col-lg-12 blog-tonic mb-5 mb-lg-0 blog-light bg-body"
                  key={index}
                  aria-labelledby={`blog-title-${index}`}
                >
                  <div className="image-page">
                    <img
                      src={`http://89.116.170.231:1600/src/image/${blog.image}`}
                      alt={
                        blog.name
                          ? `Image for ${blog.name}`
                          : `Blog image ${index + 1}`
                      }
                      width="150"
                      height="150"
                      loading="lazy"
                      className="img-fluid w-100 mb-0 img-hover-effect"
                      style={{ objectFit: "cover", aspectRatio: "1 / 1" }}
                    />
                  </div>

                  <div className="box-insidex bg-light mt-0 px-3 py-2">
                    <div className="d-flex gap-lg-2 gap-0 flex-row mb-0">
                      <div className="d-flex flex-row">
                        <FontAwesomeIcon
                          icon={faCalendarDays}
                          className="text-success ms-1 mt-2 pt-1"
                        />
                        <p className="mt-2 fw-medium text-dark ms-2 cart-cart mb-lg-2 mb-0">
                          {new Date(blog.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <h2
                      id={`blog-title-${index}`}
                      className="blog-font fw-medium text-start lorem-text mb-0 mb-lg-2 blog-cal1 fw-bold"
                    >
                      {blog.name.split(" ").slice(0, 8).join(" ")}
                    </h2>

                    <p className="fw-medium text-start lorem-text blog-cal">
                      {blog.description.split("").slice(0, 125).join("")}
                    </p>

                    <div className="d-flex mt-0 align-items-center flex-row">
                      <Link
                        to={`/blog-details/${blog.id}`}
                        className="btn btn-success-accesses rounded text-light mt-0 more-button d-flex align-items-center justify-content-center w-auto mb-4"
                        aria-label={`Read full article about ${blog.name}`}
                      >
                        <span className="visually-hidden">
                          Read full article about{" "}
                        </span>
                        {blog.name.split(" ").slice(0, 2).join(" ")}
                        <span className="visually-hidden"> article</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-center cart-cart">
                No blog posts available.
              </div>
            )}
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

      <div className="container-fluid">
        <div className="container">
          <div className="row">
            <div className="ad-container">
              {(() => {
                const footerAd = ads.find(
                  (data) =>
                    data.location === "Footer(before)" &&
                    new Date(data.expired) > new Date() &&
                    data.status !== "pending"
                );
                return footerAd ? (
                  <div className="ad-card border">
                    <picture className="ad-picture">
                      {footerAd.mobileImage && (
                        <source
                          media="(max-width: 767px)"
                          srcSet={`http://89.116.170.231:1600/src/image/${footerAd.mobileImage}`}
                        />
                      )}
                      {footerAd.desktopImage && (
                        <source
                          media="(min-width: 768px) and (max-width: 991px)"
                          srcSet={`http://89.116.170.231:1600/src/image/${footerAd.desktopImage}`}
                        />
                      )}
                      <img
                        src={`http://89.116.170.231:1600/src/image/${footerAd.image}`}
                        alt="Advertisement"
                        className="ad-img"
                      />
                    </picture>
                    <div className="ad-overlay">
                      <div className="ad-overlay-top">
                        <button className="ad-button btn btn-success d-flex cart-cart1">
                          <Link to="/shop" className="ad-link">
                            {footerAd.button}
                          </Link>
                        </button>
                      </div>
                      <div className="ad-overlay-bottom cart-cart">
                        <h3 className="ad-title">{footerAd.title}</h3>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      </div>

      <footer className="footer pt-4 pb-4 cart-cart mt-4 blog-page-footer">
        <div className="container text-center text-md-left">
          <div className="row footer-lyte">
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 mx-auto mt-lg-3 mt-0 d-flex flex-column text-start ms-0">
              <img
                src={Tonic}
                alt="RxTonic"
                className="img-fluid mb-3"
                style={{ maxWidth: "190px" }}
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
                  className="btn btn-success-accesses d-flex cart-cart1 py-4 me-0 ms-1"
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
                &copy; {new Date().getFullYear()} RxLYTE. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="container-fluid">
        <div className="container">
          <div className="row m-0">
            <div className="ad-container m-0">
              {(() => {
                const footerAd = ads.find(
                  (data) =>
                    data.location === "Footer(after)" &&
                    new Date(data.expired) > new Date() &&
                    data.status !== "pending"
                );
                return footerAd ? (
                  <div className="ad-card border">
                    <picture className="ad-picture">
                      {footerAd.mobileImage && (
                        <source
                          media="(max-width: 767px)"
                          srcSet={`http://89.116.170.231:1600/src/image/${footerAd.mobileImage}`}
                        />
                      )}
                      {footerAd.desktopImage && (
                        <source
                          media="(min-width: 768px) and (max-width: 991px)"
                          srcSet={`http://89.116.170.231:1600/src/image/${footerAd.desktopImage}`}
                        />
                      )}
                      <img
                        src={`http://89.116.170.231:1600/src/image/${footerAd.image}`}
                        alt="Advertisement"
                        className="ad-img"
                      />
                    </picture>
                    <div className="ad-overlay">
                      <div className="ad-overlay-top">
                        <button className="ad-button btn btn-success d-flex cart-cart1">
                          <Link to="/shop" className="ad-link">
                            {footerAd.button}
                          </Link>
                        </button>
                      </div>
                      <div className="ad-overlay-bottom cart-cart">
                        <h3 className="ad-title">{footerAd.title}</h3>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlogPage;
