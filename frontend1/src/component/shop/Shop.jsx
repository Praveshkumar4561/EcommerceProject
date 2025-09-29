import React, { useContext, useEffect, useRef, useState } from "react";
import "./Shop.css";
import { Link } from "react-router-dom";
import Tonic from "../../assets/Tonic.svg";
import free from "../../assets/free.webp";
import Cash from "../../assets/Cash.webp";
import Close from "../../assets/Close.webp";
import Discount from "../../assets/discount.webp";
import Hoursupport from "../../assets/hoursupport.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons";
import Hamburger from "../../assets/hamburger.svg";
import UserContext from "../../context/UserContext";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import JsonLd from "../JsonLd";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Shop() {
  useEffect(() => {
    const cartdata = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/allcartdata"
        );
        setCount(response.data.length);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    cartdata();
  }, []);

  let [image, setImage] = useState([]);

  useEffect(() => {
    productimage();
  }, []);

  let productimage = async () => {
    let response = await axios.get("http://147.93.45.171:1600/productpagedata");
    setImage(response.data);
  };

  let [detail, setDetail] = useState([]);

  useEffect(() => {
    const detailsdata = async () => {
      try {
        let response = await axios.get(
          "http://147.93.45.171:1600/productpagedata"
        );
        const filteredData = response.data.filter(
          (detail) => detail.status === "Published" || detail.status === "Draft"
        );
        setDetail(filteredData);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    detailsdata();
  }, []);

  let { count, setCount } = useContext(UserContext);

  const addCartItem = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("store", data.store);
    formData.append("price", data.price);
    formData.append("price_sale", data.price_sale);
    if (data.image) {
      formData.append("image", data.image);
    } else {
      console.log("No image file available for this product.");
    }
    try {
      await axios.post("http://147.93.45.171:1600/addcart", formData);
      setCount((prevCount) => prevCount + 1);
      toast.success("Product successfully added on the cart", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Product is not added on the cart", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  let [label, setLabel] = useState([]);

  useEffect(() => {
    const labeldata = async () => {
      try {
        let response = await axios.get(
          "http://147.93.45.171:1600/productlabelsdata"
        );
        const filteredData = response.data.filter(
          (label) => label.status === "Published" || label.status === "Draft"
        );
        setLabel(filteredData);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    labeldata();
  }, []);

  let addWishlistItem = async (data) => {
    const formData = new FormData();
    formData.append("product_name", data.name);
    formData.append("store", data.store);
    formData.append("price", data.price);
    formData.append("price_sale", data.price_sale);
    formData.append("sku", data.sku);
    const imageFileName = data.image ? data.image.split("/").pop() : null;
    if (imageFileName) {
      formData.append("image", imageFileName);
    } else {
      console.log("No image file available for this product.");
    }
    try {
      await axios.post("http://147.93.45.171:1600/wishlistpost", formData);
      setCount6((prevCount) => prevCount + 1);
      toast.success("Product successfully added on the wishlist", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Product is not added on the wishlist", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
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

  let [user, setUser] = useState("");

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/get-theme-breadcrumb"
        );
        setUser(response.data);
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

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/get-theme-breadcrumb"
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching breadcrumb settings:", error);
      }
    };
    fetchBreadcrumbData();
  }, []);

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "http://demo.webriefly.com/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Shop",
            item: "http://demo.webriefly.com/shop",
          },
        ],
      },

      ...(Array.isArray(detail)
        ? detail.slice(0, 5).map((item) => ({
            "@type": "Product",
            name: item.name,
            image: item.image,
            description: item.description,
            brand: {
              "@type": "Brand",
              name: item.brand,
            },
            sku: item.sku,
            offers: {
              "@type": "Offer",
              url: item.url || window.location.href,
              priceCurrency: "USD",
              price: item.price_sale ? item.price_sale : item.price,
              priceValidUntil: item.saleEndDate || undefined,
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: item.ratingValue || 4.9,
              bestRating: item.bestRating || 5,
              ratingCount: item.ratingCount || 5842,
            },
          }))
        : []),
    ],
  };

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [styles, setStyles] = useState({
    primaryColor: "#971c1c",
    headerBackgroundColor: "#######",
    headerTextColor: "#7e1616",
    headerBorder: "#2b0303",
    stickyHeader: "no",
    stickyHeaderMobile: "no",
    headerMainColor: "#ffffff",
    headerMainTextColor: "#000000",
    headerMenuTextColor: "#000000",
    headerMenuColor: "#000000",
  });

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

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/get-theme-breadcrumb"
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching breadcrumb settings:", error);
      }
    };
    fetchBreadcrumbData();
  }, []);

  useEffect(() => {
    axios
      .get("http://147.93.45.171:1600/themestylesdata")
      .then((res) => setStyles(res.data))
      .catch((err) => console.error("Error fetching styles:", err));
  }, []);

  const containerStyle = {
    backgroundColor:
      user?.background_color ||
      (user?.background_image ? "transparent" : "#f2f5f7"),
    backgroundImage: user?.background_image
      ? `url(http://147.93.45.171:1600/src/image/${user.background_image})`
      : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: user?.breadcrumb_height ? `${user.breadcrumb_height}px` : "190px",
    ...(styles.stickyHeader === "yes" && {
      position: "sticky",
      top: 0,
      zIndex: 1000,
    }),
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const headerStyle = {
    backgroundColor: styles.headerBackgroundColor || "#ffffff",
    color: styles.headerMainTextColor || "#000000",
    ...(isMobile &&
      styles.stickyHeaderMobile === "yes" && {
        position: "sticky",
        top: 10,
        zIndex: 1000,
      }),
  };

  const menuStyle = {
    color: styles.headerMenuTextColor,
    backgroundColor: styles.headerMenu,
  };

  const navLinkStyle = {
    color: styles.headerMainTextColor,
  };

  const navLinkStyle1 = {
    color: styles.headerMenuTextColor,
  };

  let [ads, setAds] = useState([]);

  useEffect(() => {
    const adspagedata = async () => {
      try {
        const response = await axios.get("http://147.93.45.171:1600/adsdata");
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
      <JsonLd data={schemaData} />

      <Helmet>
        <title>Shop Online - Best Deals & Latest Collections | RxLyte</title>
        <meta
          name="description"
          content="Explore our latest collection and shop online for the best deals on top-quality products. Fast shipping & secure checkout available."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://demo.webriefly.com/shop" />
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
                if (!footerAd) return null;

                const cardClass =
                  footerAd.ads_size === "full-width"
                    ? "ad-card full-width-card"
                    : "ad-card";

                return (
                  <div className="ad-card-container">
                    <div className={cardClass}>
                      <picture className="ad-picture">
                        {footerAd.mobileImage && (
                          <source
                            media="(max-width: 767px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.mobileImage}`}
                          />
                        )}
                        {footerAd.desktopImage && (
                          <source
                            media="(min-width: 768px) and (max-width: 991px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.desktopImage}`}
                          />
                        )}
                        <img
                          src={`http://147.93.45.171:1600/src/image/${footerAd.image}`}
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
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="container" id="container-customx" style={containerStyle}>
        <div className="container-custom ms-2 pt-lg-0 mt-lg-0 mt-5 pt-5 mb-auto mt-auto">
          <header
            style={headerStyle}
            className="d-flex flex-wrap justify-content-between py-2 mt-lg-4 border-bottom rounded-2 container-custom1"
          >
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
                  ref={toggleButtonRef}
                  type="button"
                  className="navbar-toggler py-0 px-1 d-lg-none dropdown-burger"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                      <Link className="nav-link" to="/" style={navLinkStyle}>
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/shop"
                        style={navLinkStyle}
                      >
                        Shop
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/blog"
                        style={navLinkStyle}
                      >
                        Blog
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/privacy-policy"
                        style={navLinkStyle}
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/contact-us"
                        style={navLinkStyle}
                      >
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
                    <span className="count-badge mt-2 mt-lg-0 pt-lg-2 pt-0 mt-md-1">
                      {count6}
                    </span>
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
                    <div className="addcarts ps-2 pt-lg-0 mt-lg-0 count-badge1">
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
                style={menuStyle}
              >
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link" to="/" style={navLinkStyle1}>
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/shop" style={navLinkStyle1}>
                      Shop
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/blog" style={navLinkStyle1}>
                      Blog
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/privacy-policy"
                      style={navLinkStyle1}
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link"
                      to="/contact-us"
                      style={navLinkStyle1}
                    >
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </header>

          <main className="container mt-5 pt-5 cart-cart container-bread position-relative">
            {user?.enable_breadcrumb === "yes" &&
              user?.breadcrumb_style !== "none" && (
                <>
                  {user?.hide_title !== "yes" && (
                    <h1
                      className={`fw-medium mb-3 text-center container-contact fs-2 container-style ${
                        user?.breadcrumb_style === "without title"
                          ? "d-none"
                          : ""
                      }`}
                    >
                      Shop
                    </h1>
                  )}

                  <nav
                    aria-label="breadcrumb"
                    id="container-contact1"
                    className={`ms-5 ps-3 ms-lg-0 ps-lg-0 ${
                      user?.breadcrumb_style === "without title" ||
                      user?.breadcrumb_style === "align start"
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
                        Shop
                      </li>
                    </ol>
                  </nav>
                </>
              )}
          </main>
        </div>
      </div>

      <div className="container-fluid">
        <div className="container">
          <div className="row m-auto">
            <div className="ad-container m-0">
              {(() => {
                const footerAd = ads.find(
                  (data) =>
                    data.location === "Header(after)" &&
                    new Date(data.expired) > new Date() &&
                    data.status !== "pending"
                );
                if (!footerAd) return null;

                const cardClass =
                  footerAd.ads_size === "full-width"
                    ? "ad-card full-width-card"
                    : "ad-card";

                return (
                  <div className="ad-card-container">
                    <div className={cardClass}>
                      <picture className="ad-picture">
                        {footerAd.mobileImage && (
                          <source
                            media="(max-width: 767px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.mobileImage}`}
                          />
                        )}
                        {footerAd.desktopImage && (
                          <source
                            media="(min-width: 768px) and (max-width: 991px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.desktopImage}`}
                          />
                        )}
                        <img
                          src={`http://147.93.45.171:1600/src/image/${footerAd.image}`}
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
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="container mb-5">
          {Array.isArray(image) && image.length > 0 && (
            <div className="row ms-lg-0 gap-4 d-flex flex-row">
              {image.slice(0, 5).map((data, key) => (
                <div
                  className="col-6 col-sm-4 col-md-3 col-lg-2 border show-product"
                  key={key}
                >
                  <Link
                    to="/product-categories"
                    className="text-dark"
                    aria-label={`View details for ${data.image}`}
                  >
                    <img
                      src={`http://147.93.45.171:1600/src/image/${data.image}`}
                      alt={`Product ${key + 1}: ${data.image}`}
                      srcSet={`
                      http://147.93.45.171:1600/src/image/${data.image}?w=150&h=150&fit=cover 150w,
                      http://147.93.45.171:1600/src/image/${data.image}?w=204&h=204&fit=cover 204w,
                      http://147.93.45.171:1600/src/image/${data.image}?w=300&h=300&fit=cover 300w
                    `}
                      sizes="(max-width: 600px) 150px, (max-width: 1024px) 204px, 300px"
                    />
                    <div className="position-absolute ms-4 mt-2 fw-bold d-flex flex-row flex-md-nowrap w-100 cart-cart1">
                      {key === 0 && "HeadPhones"}
                      {key === 1 && "Digital Watch"}
                      {key === 2 && "Soundbar"}
                      {key === 3 && "EarPhones"}
                      {key === 4 && "Mobile Phone"}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
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
          <div className="row gap-2 gap-lg-2 d-flex flex-row flex-wrap">
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 border rounded bg-light d-flex flex-row py-lg-0 py-xxl-1 py-xl-3 shop-icon me-auto align-items-md-center">
              <img
                src={free}
                alt="RxLYTE"
                className="img-fluid mt-4 mb-2 mb-lg-4"
              />
              <div className="d-flex flex-column mt-4 mt-md-0 mt-lg-2 ms-3 text-start">
                <span>Free Delivery</span>
                <span>Orders from all item</span>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-6 col-lg-3 border rounded bg-light d-flex flex-row py-lg-0 shop-icon me-auto align-items-md-center py-xxl-1 py-xl-1">
              <img
                src={Cash}
                alt="RxLYTE"
                className="img-fluid w-25 mt-4 mb-2 mb-lg-4"
              />
              <div className="d-flex flex-column mt-4 mt-md-0 mt-lg-2 ms-3 text-start">
                <span>Return & Refund</span>
                <span>Money-back guarantee</span>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-6 col-lg-3 border rounded bg-light d-flex flex-row py-lg-1 py-0 shop-icon me-auto align-items-md-center pb-md-3">
              <img
                src={Discount}
                alt="RxLYTE"
                className="img-fluid mt-3 mt-lg-0 mb-1 customer-homeimage1"
              />

              <div className="d-flex flex-column mt-4 ms-3 text-start pb-3">
                <span>Member Discount</span>
                <span>
                  Every order over{" "}
                  <span style={{ fontFamily: "verdana" }}>$140.00</span>
                </span>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-6 col-lg-3 border rounded bg-light d-flex flex-row py-lg-0 shop-icon me-auto align-items-md-center py-xxl-1 py-xl-1">
              <img
                src={Hoursupport}
                alt="RxLYTE"
                className="img-fluid w-25 mt-3 mb-lg-1 mb-xxl-4 mb-xl-4 pb-2"
              />
              <div className="d-flex flex-column mt-4 mt-md-0 mt-lg-2 ms-3 text-start">
                <span>Support 24/7</span>
                <span>Contact us 24 hours a day</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-3 mt-lg-0 cart-cart">
        <h2 className="mt-lg-3 mb-0 mt-0 text-start about-trend">
          Trending Products
        </h2>
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 mt-0 row-cols-md-4 gap-2 g-3 d-flex flex-row flex-wrap me-md-2 me-lg-0">
            {Array.isArray(detail) && detail.length > 0 ? (
              detail.map((data, index) => {
                const productLabel = label.find(
                  (item) => item.name === data.label
                );
                const labelColor = productLabel ? productLabel.color : "green";
                const productImage = data.image
                  ? `http://147.93.45.171:1600/src/image/${data.image}`
                  : "/path/to/default-image.jpg";

                return (
                  <div
                    className="col-12 col-lg-3 col-md-6 text-center border rounded feature-watch px-0 px-lg-1"
                    key={index}
                  >
                    <div className="feature-box rounded-0 position-relative rounded-1">
                      {data.label && (
                        <button
                          className="position-absolute me-2 end-0 btn d-flex mt-2 rounded px-2 cart-cart product-label text-light"
                          style={{ backgroundColor: labelColor }}
                        >
                          {data.label}
                        </button>
                      )}

                      <Link to={`/${url.productDetails}`}>
                        <img
                          src={productImage}
                          className=" w-100 h-100 object-fit-cover border-0 image-watch"
                          style={{ cursor: "pointer" }}
                          alt={
                            data.name
                              ? `${data.name} product image`
                              : "Product image"
                          }
                          loading="lazy"
                        />
                      </Link>

                      <button
                        className="position-absolute me-1 btn btn-light wishlist-button wishlist-button1 text-light btn-success"
                        onClick={() => addWishlistItem(data)}
                      >
                        <FontAwesomeIcon icon={faHeart} />
                        <div className="wishlist-button-content">
                          Add to Wishlist
                        </div>
                      </button>

                      <div className="add-to-cart-button-container">
                        <button
                          className="add-to-cart-button mt-4 d-flex flex-row cart-cart1"
                          style={{ whiteSpace: "nowrap" }}
                          onClick={() => addCartItem(data)}
                        >
                          <FontAwesomeIcon
                            icon={faCartShopping}
                            className="me-2 mt-0"
                          />
                          Add to Cart
                        </button>
                      </div>
                    </div>
                    <div className="border w-100"></div>
                    <div className="ms-3">
                      <h3 className="mt-2 mb-0 lh-base text-start text-lg-start price-row">
                        {data.store || "Product Store"}
                      </h3>
                      <h4 className="mt-0 lh-base text-start text-lg-start fw-bold price-name">
                        {data.name.split(" ").slice(0, 6).join(" ")}
                      </h4>
                      <h4 className="mt-1 lh-base text-start text-lg-start price-row">
                        SKU:{data.sku || "Product Name"}
                      </h4>
                      <div
                        className="d-flex justify-content-start justify-content-lg-start mb-2 gap-1 mt-1 flex-row"
                        style={{ fontFamily: "verdana" }}
                      >
                        <span className="me-1 price-amount">
                          {data.price || "Price"}
                        </span>
                        <strike className="text-danger-access fw-medium">
                          {data.discountPrice || "$54"}
                        </strike>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center">No products available.</p>
            )}
          </div>
        </div>
        <ToastContainer />
      </div>

      <div className="container-fluid">
        <div className="container">
          <div className="row m-auto">
            <div className="ad-container m-0">
              {(() => {
                const footerAd = ads.find(
                  (data) =>
                    data.location === "Footer(before)" &&
                    new Date(data.expired) > new Date() &&
                    data.status !== "pending"
                );
                if (!footerAd) return null;

                const cardClass =
                  footerAd.ads_size === "full-width"
                    ? "ad-card full-width-card"
                    : "ad-card";

                return (
                  <div className="ad-card-container">
                    <div className={cardClass}>
                      <picture className="ad-picture">
                        {footerAd.mobileImage && (
                          <source
                            media="(max-width: 767px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.mobileImage}`}
                          />
                        )}
                        {footerAd.desktopImage && (
                          <source
                            media="(min-width: 768px) and (max-width: 991px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.desktopImage}`}
                          />
                        )}
                        <img
                          src={`http://147.93.45.171:1600/src/image/${footerAd.image}`}
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
                  </div>
                );
              })()}
            </div>
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
                © {new Date().getFullYear()} Copyright RxLYTE. All rights
                reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="container-fluid">
        <div className="container">
          <div className="row m-auto">
            <div className="ad-container m-0">
              {(() => {
                const footerAd = ads.find(
                  (data) =>
                    data.location === "Footer(after)" &&
                    new Date(data.expired) > new Date() &&
                    data.status !== "pending"
                );
                if (!footerAd) return null;

                const cardClass =
                  footerAd.ads_size === "full-width"
                    ? "ad-card full-width-card"
                    : "ad-card";

                return (
                  <div className="ad-card-container mb-2">
                    <div className={cardClass}>
                      <picture className="ad-picture">
                        {footerAd.mobileImage && (
                          <source
                            media="(max-width: 767px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.mobileImage}`}
                          />
                        )}
                        {footerAd.desktopImage && (
                          <source
                            media="(min-width: 768px) and (max-width: 991px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.desktopImage}`}
                          />
                        )}
                        <img
                          src={`http://147.93.45.171:1600/src/image/${footerAd.image}`}
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
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Shop;
