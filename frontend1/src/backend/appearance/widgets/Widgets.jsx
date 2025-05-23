import React, { useEffect, useRef, useState } from "react";
import "./Widgets.css";
import Hamburger from "../../../assets/hamburger.svg";
import Logo from "../../../assets/Tonic.svg";
import "font-awesome/css/font-awesome.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faBell,
  faEnvelope,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import Shopping from "../../../assets/Shopping.svg";
import { Link, useNavigate } from "react-router-dom";
import Cutting from "../../../assets/Cutting.webp";
import Grid from "../../../assets/grid.webp";
import Slider from "../../../assets/slider.webp";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";

function Widgets() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const resultsRef = useRef(null);
  let [Specification, setSpecifcation] = useState(false);
  let [payment1, setPayment1] = useState(false);
  let [isVisible, setIsVisible] = useState(false);
  let [blog, setBlog] = useState(false);
  let [ads, setAds] = useState(false);
  let [appear, setAppear] = useState(false);
  let [commerce, setCommerce] = useState(false);

  let paymentgateway = () => {
    setPayment1(!payment1);
  };

  let togglespecification = () => {
    setSpecifcation(!Specification);
  };

  const routes = {
    "/admin/welcome": "# Dashboard",
    "/admin/pages": "# Pages",
    "/admin/galleries": "# Galleries",
    "/admin/testimonials": "# Testimonials",
    "/admin/announcements": "# Announcements",
    "/admin/contact": "# Contact",
    "/admin/simple-sliders": "# Simple Sliders",
    "/admin/newsletters": "# NewsLetters",
    "/admin/settings": "# Settings",
    "/admin/system": "# System",
    "/admin/ecommerce/products": "# Ecommerce > Products",
    "/admin/ecommerce/reports": "# Ecommerce > Reports",
    "/admin/ecommerce/orders": "# Ecommerce > Orders",
    "/admin/ecommerce/incomplete-orders": "# Ecommerce > Incomplete Orders",
    "/admin/ecommerce/order-returns": "# Ecommerce > Order Returns",
    "/admin/ecommerce/product-prices": "# Ecommerce > Product Prices",
    "/admin/ecommerce/product-inventory": "# Ecommerce > Product Inventory",
    "/admin/ecommerce/product-categories": "# Ecommerce > Product Categories",
    "/admin/ecommerce/product-tags": "# Ecommerce > Product Tags",
    "/admin/ecommerce/product-attribute": "# Ecommerce > Product Attribute",
    "/admin/ecommerce/product-options": "# Ecommerce > Product Options",
    "/admin/ecommerce/product-collections": "# Ecommerce > Product Collections",
    "/admin/ecommerce/product-labels": "# Ecommerce > Product Labels",
    "/admin/ecommerce/brands": "# Ecommerce > Brands",
    "/admin/ecommerce/reviews": "# Ecommerce > Reviews",
    "/admin/ecommerce/flash-sales": "# Ecommerce > Flash Sales",
    "/admin/ecommerce/discounts": "# Ecommerce > Discounts",
    "/admin/customers": "# Ecommerce > Customers",
    "/admin/blog/posts": "# Blog > Posts",
    "/admin/blog/categories": "# Blog > Categories",
    "/admin/blog/tags": "# Blog > Tags",
    "/admin/ads": "# Ads > Ads",
    "/admin/menus": "# Appearance > Menus",
    "/admin/widgets": "# Appearance > Widgets",
    "/admin/theme/custom-css": "# Appearance > Custom CSS",
    "/admin/theme/custom-js": "# Appearance > Custom JS",
    "/admin/theme/custom-html": "# Appearance > Custom HTML",
    "/admin/theme/robots-txt": "# Appearance > Robots.txt Editor",
    "/admin/theme/options": "# Appearance > Theme Options",
    "/admin/payments/transactions": "# Payments > Transactions",
    "/admin/payments/logs": "# Payments > Payment Logs",
    "/admin/payments/methods": "# Payments > Payment Methods",
    "/admin/system/users": "# Platform > System > Users",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery("");
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (event) => {
    const input = event.target.value.toLowerCase();
    setQuery(input);
    setIsOpen(true);

    if (input) {
      const filteredResults = Object.entries(routes)
        .filter(([_, name]) => name.toLowerCase().includes(input))
        .map(([_, name]) => name);
      setResults(filteredResults);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (page) => {
    const path = Object.keys(routes).find((key) => routes[key] === page);
    if (path) {
      navigate(path);
      setQuery("");
      setResults([]);
      setIsOpen(false);
    }
  };

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(file);
      setImageUrl(url);
      setUser({ ...user, file: file });
    }
  };

  const handleAddFromUrl = () => {
    try {
      toast.success(
        "Functionality to add image from URL needs to be implemented. ",
        {
          position: "bottom-right",
          autoClose: 1000,
          ProgressBar: true,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        }
      );
    } catch (error) {}
  };

  let toggleecommerce = () => {
    setCommerce(!commerce);
  };

  let appearence = () => {
    setAppear(!appear);
  };

  let toggleads = () => {
    setAds(!ads);
  };

  const toggleFAQ = () => {
    setIsVisible(!isVisible);
  };

  const toggleblog = () => {
    setBlog(!blog);
  };

  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 992);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleNavbar = () => {
    if (isMobile) {
      setIsNavbarExpanded(!isNavbarExpanded);
    }
  };

  let [sidebar, setSidebar] = useState(false);
  let [footer, setFooter] = useState(false);
  let [search, setSearch] = useState(false);
  let [blogAbout, setBlogAbout] = useState(false);
  let [blogPost, setBlogPost] = useState(false);
  let [blogCategory, setBlogCategory] = useState(false);
  let [tags, setTags] = useState(false);
  let [site, setInformation] = useState(false);
  let [custom, setCustom] = useState(false);
  let [custom1, setCustom1] = useState(false);
  let [contact, setContact] = useState(false);
  let [productCategory, setProductCategory] = useState(false);
  let [productCategory1, setProductCategory1] = useState(false);
  let [productCategory2, setProductCategory2] = useState(false);
  let [productCategory3, setProductCategory3] = useState(false);
  let [footers1, setFooters1] = useState(false);
  let [footer2, setFooter2] = useState(false);
  let [copyright, setCopyRight] = useState(false);
  let [payment, setPayment] = useState(false);
  let [newsletters, setNewsLetters] = useState(false);
  let [lists, setLists] = useState(false);
  let [pageWidgets, setPageWidgets] = useState(false);
  let [productDetails, setProductDetails] = useState(false);
  let [brands, setBrands] = useState(false);
  let [sidebar1, setSidebar1] = useState(false);
  let [customProduct1, setCustomProducts1] = useState(false);
  let [bottomCategory, setBottomCategory] = useState(false);
  let [bottomCategory1, setBottomCategory1] = useState(false);
  let [productCusrsor, setProductCursor] = useState(false);
  let [productTop, setProductTop] = useState(false);
  let [productBottom, setProductBottom] = useState(false);
  let [productPrimary, setProductPrimary] = useState(false);
  const [rotateState, setRotateState] = useState({
    blog: false,
    footer: false,
    footer1: false,
    footers: false,
    footers1: false,
    footers2: false,
    details: false,
    list: false,
    bottom: false,
    category: false,
    sidebar: false,
    brand: false,
    products: false,
    tag: false,
    tag1: false,
    primary: false,
    info: false,
    ecommerce: false,
    news: false,
    site: false,
    payment: false,
    blog1: false,
    about: false,
    posts: false,
    blogcat: false,
    blogtag: false,
    primary1: false,
    custom: false,
    menu: false,
    contact: false,
    productcate1: false,
    productcate2: false,
    productcate3: false,
    productcate4: false,
  });

  let blogsidebar = () => {
    setSidebar(!sidebar);
    setRotateState((prev) => ({ ...prev, blog: !prev.blog }));
  };

  let footerclicked = () => {
    setFooter(!footer);
    setRotateState((prev) => ({ ...prev, footer: !prev.footer }));
  };

  let searchblog = () => {
    setSearch(!search);
    setRotateState((prev) => ({ ...prev, blog1: !prev.blog1 }));
  };

  let blogaboutclick = () => {
    setBlogAbout(!blogAbout);
    setRotateState((prev) => ({ ...prev, about: !prev.about }));
  };

  let blogposts = () => {
    setBlogPost(!blogPost);
    setRotateState((prev) => ({ ...prev, posts: !prev.posts }));
  };

  let blogCategoryClicked = () => {
    setBlogCategory(!blogCategory);
    setRotateState((prev) => ({ ...prev, blogcat: !prev.blogcat }));
  };

  let tagsClicked = () => {
    setTags(!tags);
    setRotateState((prev) => ({ ...prev, blogtag: !prev.blogtag }));
  };

  let siteInformation = () => {
    setInformation(!site);
    setRotateState((prev) => ({ ...prev, primary1: !prev.primary1 }));
  };

  let customMenu = () => {
    setCustom(!custom);
    setRotateState((prev) => ({ ...prev, custom: !prev.custom }));
  };

  let customMenu1 = () => {
    setCustom1(!custom1);
    setRotateState((prev) => ({ ...prev, menu: !prev.menu }));
  };

  let contactClicked = () => {
    setContact(!contact);
    setRotateState((prev) => ({ ...prev, contact: !prev.contact }));
  };

  let productCategoryClicked = () => {
    setProductCategory(!productCategory);
    setRotateState((prev) => ({ ...prev, productcate1: !prev.productcate1 }));
  };

  let productCategoryClicked1 = () => {
    setProductCategory1(!productCategory1);
    setRotateState((prev) => ({ ...prev, productcate2: !prev.productcate2 }));
  };

  let productCategoryClicked2 = () => {
    setProductCategory2(!productCategory2);
    setRotateState((prev) => ({ ...prev, productcate3: !prev.productcate3 }));
  };

  let productCategoryClicked3 = () => {
    setProductCategory3(!productCategory3);
    setRotateState((prev) => ({ ...prev, productcate4: !prev.productcate4 }));
  };

  let footers = () => {
    setFooters1(!footers1);
    setRotateState((prev) => ({ ...prev, footers: !prev.footers }));
  };

  let footerclicked1 = () => {
    setFooter2(!footer2);
    setRotateState((prev) => ({ ...prev, footer1: !prev.footer1 }));
  };

  let copyrightclicked = () => {
    setCopyRight(!copyright);
    setRotateState((prev) => ({ ...prev, copyright: !prev.copyright }));
  };

  let paymentClicked = () => {
    setPayment(!payment);
    setRotateState((prev) => ({ ...prev, payment: !prev.payment }));
  };

  let newsletterClicked = () => {
    setNewsLetters(!newsletters);
    setRotateState((prev) => ({ ...prev, news: !prev.news }));
  };

  let listproduct = () => {
    setLists(!lists);
    setRotateState((prev) => ({ ...prev, list: !prev.list }));
  };

  let pagewidgets = () => {
    setPageWidgets(!pageWidgets);
    setRotateState((prev) => ({ ...prev, details: !prev.details }));
  };

  let productdetails = () => {
    setProductDetails(!productDetails);
    setRotateState((prev) => ({ ...prev, info: !prev.info }));
  };

  let brandedclicked = () => {
    setBrands(!brands);
    setRotateState((prev) => ({ ...prev, ecommerce: !prev.ecommerce }));
  };

  let sidebarClicked = () => {
    setSidebar1(!sidebar1);
    setRotateState((prev) => ({ ...prev, bottom: !prev.bottom }));
  };

  let customproducts1 = () => {
    setCustomProducts1(!customProduct1);
    setRotateState((prev) => ({ ...prev, category: !prev.category }));
  };

  let bottomCategoryClicked = () => {
    setBottomCategory(!bottomCategory);
    setRotateState((prev) => ({ ...prev, sidebar: !prev.sidebar }));
  };

  let bottomCategoryClicked1 = () => {
    setBottomCategory1(!bottomCategory1);
    setRotateState((prev) => ({ ...prev, brand: !prev.brand }));
  };

  let productCusrsorClicked = () => {
    setProductCursor(!productCusrsor);
    setRotateState((prev) => ({ ...prev, products: !prev.products }));
  };

  let productTopClicked = () => {
    setProductTop(!productTop);
    setRotateState((prev) => ({ ...prev, tag: !prev.tag }));
  };

  let productBottomClicked = () => {
    setProductBottom(!productBottom);
    setRotateState((prev) => ({ ...prev, tag1: !prev.tag1 }));
  };

  let productPrimaryCliked = () => {
    setProductPrimary(!productPrimary);
    setRotateState((prev) => ({ ...prev, primary: !prev.primary }));
  };

  let [count5, setCount5] = useState(0);

  useEffect(() => {
    let orderdata = async () => {
      let response = await axios.get("http://89.116.170.231:1600/checkoutdata");
      setCount5(response.data.length);
    };
    orderdata();
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        />

        <title>Widgets | RxLYTE</title>

        <link
          rel="shortcut icon"
          href="http://srv724100.hstgr.cloud/assets/Tonic.svg"
          type="image/svg+xml"
        />
        <meta
          property="og:image"
          content="http://srv724100.hstgr.cloud/assets/Tonic.svg"
        />

        <meta
          name="description"
          content="Copyright 2025 © RxLYTE. All rights reserved."
        />
        <meta
          property="og:description"
          content="Copyright 2025 © RxLYTE. All rights reserved."
        />

        <meta property="og:title" content="Widgets | RxLYTE" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://srv724100.hstgr.cloud/" />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://srv724100.hstgr.cloud/" />
      </Helmet>

      <div
        className={`container-fluid navbar-back ${
          isNavbarExpanded && isMobile ? "expanded" : ""
        }`}
      >
        <div
          className="container container-backend d-flex list-unstyled"
          id="hamburger"
        >
          <ul className="list-unstyled">
            <img
              src={Hamburger}
              alt="Hamburger Menu"
              className="hamburger-back pt-2 pe-1"
              onClick={toggleNavbar}
            />
            <Link to="/admin/welcome">
              <img
                src={Logo}
                alt="RxLYTE"
                className="hamburger1 ms-3 mt-2 pt-0 pt-lg-1"
              />
            </Link>
          </ul>

          <input
            type="search"
            className="text-light py-4 search-welcome form-control d-none d-lg-block border border-secondary"
            placeholder="Search"
            value={query}
            onChange={handleChange}
          />
          {isOpen && (
            <div className="search-results-container" ref={resultsRef}>
              {results.length > 0 ? (
                <ul className="search-results text-dark">
                  {results.map((page, index) => (
                    <li key={index} onClick={() => handleSelect(page)}>
                      {page}
                    </li>
                  ))}
                </ul>
              ) : (
                query && (
                  <div
                    className="no-results text-dark px-3 py-3"
                    style={{ cursor: "pointer" }}
                  >
                    No result found
                  </div>
                )
              )}
            </div>
          )}

          <div className="d-flex align-items-center border border-secondary py-2 rounded view-website d-lg-block d-none">
            <Link
              className="btn d-flex align-items-center"
              type="button"
              to="/"
              target="_blank"
            >
              <svg
                className="icon icon-left svg-icon-ti-ti-world me-1 mt- text-lig"
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                <path d="M3.6 9h16.8" />
                <path d="M3.6 15h16.8" />
                <path d="M11.5 3a17 17 0 0 0 0 18" />
                <path d="M12.5 3a17 17 0 0 1 0 18" />
              </svg>
              <span className="text-light ps-1 fs-6 cart-cart">
                View website
              </span>
            </Link>
          </div>

          <FontAwesomeIcon
            icon={faMoon}
            className="text-light fs-4 me-2 search-box"
          />
          <FontAwesomeIcon
            icon={faBell}
            className="text-light fs-4 me-2 search-box"
          />
          <FontAwesomeIcon
            icon={faEnvelope}
            className="text-light fs-4 search-box"
          />
          <div className="d-flex flex-column ms-1">
            <span className="text-light count-value1 d-lg-block d-none">
              {count5}
            </span>
            <Link to="/admin/ecommerce/orders">
              <img
                src={Shopping}
                alt="Shopping"
                className="search-box search-box1"
              />
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`sidebar-container ${
          isNavbarExpanded && isMobile ? "expanded" : ""
        }`}
      >
        <div className="sidebar-back mt-1">
          <ul className="list-unstyled d-flex flex-column text-white ms-4">
            <li>
              <Link to="/admin/welcome" className="text-light">
                <svg
                  className="icon svg-icon-ti-ti-home me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
                  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
                  <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
                </svg>
                Dashboard
              </Link>
            </li>

            <div>
              <li onClick={toggleecommerce} style={{ cursor: "pointer" }}>
                <svg
                  className="icon  svg-icon-ti-ti-shopping-bag me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z"></path>
                  <path d="M9 11v-5a3 3 0 0 1 6 0v5"></path>
                </svg>
                Ecommerce
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`float-end mt-2 pt-1 me-4 icon-down ${
                    commerce ? "rotate" : ""
                  }`}
                  onClick={toggleecommerce}
                />
              </li>
              {commerce && (
                <div className="faq-content d-flex flex-column ms-3 ps-2">
                  <Link
                    to="/admin/ecommerce/reports"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-report-analytics me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                        <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                        <path d="M9 17v-5"></path>
                        <path d="M12 17v-1"></path>
                        <path d="M15 17v-3"></path>
                      </svg>
                      Report
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/orders"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-truck-delivery me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"></path>
                        <path d="M3 9l4 0"></path>
                      </svg>
                      Orders
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/incomplete-orders"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-basket-cancel me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M17 10l-2 -6"></path>
                        <path d="M7 10l2 -6"></path>
                        <path d="M12 20h-4.756a3 3 0 0 1 -2.965 -2.544l-1.255 -7.152a2 2 0 0 1 1.977 -2.304h13.999a2 2 0 0 1 1.977 2.304l-.3 1.713"></path>
                        <path d="M10 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                        <path d="M19 19m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                        <path d="M17 21l4 -4"></path>
                      </svg>
                      Incomplete Orders
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/order-returns"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-basket-down me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M17 10l-2 -6"></path>
                        <path d="M7 10l2 -6"></path>
                        <path d="M12 20h-4.756a3 3 0 0 1 -2.965 -2.544l-1.255 -7.152a2 2 0 0 1 1.977 -2.304h13.999a2 2 0 0 1 1.977 2.304l-.349 1.989"></path>
                        <path d="M10 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                        <path d="M19 16v6"></path>
                        <path d="M22 19l-3 3l-3 -3"></path>
                      </svg>
                      Order Returns
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/shipments"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-truck-loading me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M2 3h1a2 2 0 0 1 2 2v10a2 2 0 0 0 2 2h15"></path>
                        <path d="M9 6m0 3a3 3 0 0 1 3 -3h4a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-4a3 3 0 0 1 -3 -3z"></path>
                        <path d="M9 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M18 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                      </svg>
                      Shipments
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/invoices"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-file-invoice me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                        <path d="M9 7l1 0"></path>
                        <path d="M9 13l6 0"></path>
                        <path d="M13 17l2 0"></path>
                      </svg>
                      Invoices
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/products"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-package me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"></path>
                        <path d="M12 12l8 -4.5"></path>
                        <path d="M12 12l0 9"></path>
                        <path d="M12 12l-8 -4.5"></path>
                        <path d="M16 5.25l-8 4.5"></path>
                      </svg>
                      Products
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/product-prices"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-currency-dollar me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2"></path>
                        <path d="M12 3v3m0 12v3"></path>
                      </svg>
                      Product Prices
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/product-inventory"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-home-check me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2"></path>
                        <path d="M19 13.488v-1.488h2l-9 -9l-9 9h2v7a2 2 0 0 0 2 2h4.525"></path>
                        <path d="M15 19l2 2l4 -4"></path>
                      </svg>
                      Product Inventory
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/product-categories"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-archive me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
                        <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10"></path>
                        <path d="M10 12l4 0"></path>
                      </svg>
                      Product Categories
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/product-tags"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-tag me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        <path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3z"></path>
                      </svg>
                      Product Tags
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/product-attribute-sets"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-album me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                        <path d="M12 4v7l2 -2l2 2v-7"></path>
                      </svg>
                      Product Attributes
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/options"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-database me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 6m-8 0a8 3 0 1 0 16 0a8 3 0 1 0 -16 0"></path>
                        <path d="M4 6v6a8 3 0 0 0 16 0v-6"></path>
                        <path d="M4 12v6a8 3 0 0 0 16 0v-6"></path>
                      </svg>
                      Product Options
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/product-collections"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-album me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                        <path d="M12 4v7l2 -2l2 2v-7"></path>
                      </svg>
                      Product Collections
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/product-labels"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-tags me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M3 8v4.172a2 2 0 0 0 .586 1.414l5.71 5.71a2.41 2.41 0 0 0 3.408 0l3.592 -3.592a2.41 2.41 0 0 0 0 -3.408l-5.71 -5.71a2 2 0 0 0 -1.414 -.586h-4.172a2 2 0 0 0 -2 2z"></path>
                        <path d="M18 19l1.592 -1.592a4.82 4.82 0 0 0 0 -6.816l-4.592 -4.592"></path>
                        <path d="M7 10h-.01"></path>
                      </svg>
                      Product Labels
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/brands"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-registered me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                        <path d="M10 15v-6h2a2 2 0 1 1 0 4h-2"></path>
                        <path d="M14 15l-2 -2"></path>
                      </svg>
                      Brands
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/reviews"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-star me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
                      </svg>
                      Reviws
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/flash-sales"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-bolt me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"></path>
                      </svg>
                      Flash Sales
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/discounts"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-discount me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M9 15l6 -6"></path>
                        <circle
                          cx="9.5"
                          cy="9.5"
                          r=".5"
                          fill="currentColor"
                        ></circle>
                        <circle
                          cx="14.5"
                          cy="14.5"
                          r=".5"
                          fill="currentColor"
                        ></circle>
                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                      </svg>
                      Discounts
                    </li>
                  </Link>

                  <Link
                    to="/admin/customers"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-users me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                      </svg>
                      Customers
                    </li>
                  </Link>
                </div>
              )}
            </div>

            <div>
              <li onClick={togglespecification} style={{ cursor: "pointer" }}>
                <svg
                  className="icon  svg-icon-ti-ti-table-options ms-0 me-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M12 21h-7a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v7"></path>
                  <path d="M3 10h18"></path>
                  <path d="M10 3v18"></path>
                  <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                  <path d="M19.001 15.5v1.5"></path>
                  <path d="M19.001 21v1.5"></path>
                  <path d="M22.032 17.25l-1.299 .75"></path>
                  <path d="M17.27 20l-1.3 .75"></path>
                  <path d="M15.97 17.25l1.3 .75"></path>
                  <path d="M20.733 20l1.3 .75"></path>
                </svg>
                Product Specification
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`float-lg-end mt-2 pt-1 me-4 icon-down ${
                    Specification ? "rotate" : ""
                  }`}
                  onClick={togglespecification}
                />
              </li>

              {Specification && (
                <div className="faq-content d-flex flex-column ms-1 ps-2">
                  <Link
                    to="/admin/ecommerce/specification-groups"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-point me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                      Specification Groups
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/specification-attributes"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-point me-1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                      Specification Attributes
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/specification-tables"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-point me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                      Specification Tables
                    </li>
                  </Link>
                </div>
              )}
            </div>

            <li>
              <svg
                className="icon svg-icon-ti-ti-notebook me-2 mb-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18"></path>
                <path d="M13 8l2 0"></path>
                <path d="M13 12l2 0"></path>
              </svg>
              <Link to="/admin/pages" className="text-light">
                Pages
              </Link>
            </li>
            <div>
              <li onClick={toggleblog} style={{ cursor: "pointer" }}>
                <svg
                  className="icon  svg-icon-ti-ti-article me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
                  <path d="M7 8h10"></path>
                  <path d="M7 12h10"></path>
                  <path d="M7 16h10"></path>
                </svg>
                Blog
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`float-end mt-2 pt-1 me-4 icon-down ${
                    blog ? "rotate" : ""
                  }`}
                  onClick={toggleblog}
                />
              </li>
              {blog && (
                <div className="faq-content d-flex flex-column ms-3 ps-2">
                  <Link
                    to="/admin/blog/posts"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-file-text me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                        <path d="M9 9l1 0"></path>
                        <path d="M9 13l6 0"></path>
                        <path d="M9 17l6 0"></path>
                      </svg>
                      Post
                    </li>
                  </Link>

                  <Link
                    to="/admin/blog/categories"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-folder me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"></path>
                      </svg>
                      Categories
                    </li>
                  </Link>

                  <Link
                    to="/admin/blog/tags"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-tag me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        <path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3z"></path>
                      </svg>
                      Tags
                    </li>
                  </Link>
                </div>
              )}
            </div>

            <div>
              <li onClick={paymentgateway} style={{ cursor: "pointer" }}>
                <svg
                  className="icon svg-icon-ti-ti-credit-card me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"></path>
                  <path d="M3 10l18 0"></path>
                  <path d="M7 15l.01 0"></path>
                  <path d="M11 15l2 0"></path>
                </svg>
                Payments
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`float-end mt-2 pt-1 me-4 icon-down ${
                    payment1 ? "rotate" : ""
                  }`}
                  onClick={paymentgateway}
                />
              </li>
              {payment1 && (
                <div className="faq-content d-flex flex-column ms-3 ps-2">
                  <Link
                    to="/admin/payments/transactions"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-point me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                      Transactions
                    </li>
                  </Link>

                  <Link
                    to="/admin/payments/logs"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-point me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                      Payment Logs
                    </li>
                  </Link>

                  <Link
                    to="/admin/payments/methods"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-point me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                      Payment Methods
                    </li>
                  </Link>
                </div>
              )}
            </div>
            <li>
              <Link to="/admin/galleries" className="text-light">
                <svg
                  className="icon svg-icon-ti-ti-camera me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"></path>
                  <path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                </svg>
                Galleries
              </Link>
            </li>
            <li>
              <Link to="/admin/testimonials" className="text-light">
                <svg
                  className="icon svg-icon-ti-ti-user-star me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h.5"></path>
                  <path d="M17.8 20.817l-2.172 1.138a.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.193a.392 .392 0 0 1 .702 0l1.086 2.193l2.428 .352a.39 .39 0 0 1 .217 .665l-1.757 1.707l.414 2.41a.39 .39 0 0 1 -.567 .411l-2.172 -1.138z"></path>
                </svg>
                Testimonials
              </Link>
            </li>

            <div>
              <li onClick={toggleads} style={{ cursor: "pointer" }}>
                <svg
                  className="icon  svg-icon-ti-ti-ad-circle me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0"></path>
                  <path d="M7 15v-4.5a1.5 1.5 0 0 1 3 0v4.5"></path>
                  <path d="M7 13h3"></path>
                  <path d="M14 9v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z"></path>
                </svg>
                Ads
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`float-end mt-2 pt-1 me-4 icon-down ${
                    ads ? "rotate" : ""
                  }`}
                  onClick={toggleads}
                />
              </li>
              {ads && (
                <div className="faq-content d-flex flex-column ms-3 ps-2">
                  <Link
                    to="/admin/ads"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-point me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                      Ads
                    </li>
                  </Link>

                  <Link
                    to="/admin/settings/ads"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-point me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                      Ads Settings
                    </li>
                  </Link>
                </div>
              )}
            </div>

            <li>
              <Link to="/admin/announcements" className="text-light">
                <svg
                  className="icon svg-icon-ti-ti-speakerphone me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M18 8a3 3 0 0 1 0 6"></path>
                  <path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5"></path>
                  <path d="M12 8h0l4.524 -3.77a.9 .9 0 0 1 1.476 .692v12.156a.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8"></path>
                </svg>
                Announcements
              </Link>
            </li>
            <li>
              <Link to="/admin/contacts" className="text-light">
                <svg
                  className="icon svg-icon-ti-ti-mail me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path>
                  <path d="M3 7l9 6l9 -6"></path>
                </svg>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/admin/simple-sliders" className="text-light">
                <svg
                  className="icon svg-icon-ti-ti-slideshow me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M15 6l.01 0"></path>
                  <path d="M3 3m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"></path>
                  <path d="M3 13l4 -4a3 5 0 0 1 3 0l4 4"></path>
                  <path d="M13 12l2 -2a3 5 0 0 1 3 0l3 3"></path>
                  <path d="M8 21l.01 0"></path>
                  <path d="M12 21l.01 0"></path>
                  <path d="M16 21l.01 0"></path>
                </svg>
                Simple Sliders
              </Link>
            </li>

            <div>
              <li onClick={toggleFAQ} style={{ cursor: "pointer" }}>
                <svg
                  className="icon svg-icon-ti-ti-help-octagon me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M12.802 2.165l5.575 2.389c.48 .206 .863 .589 1.07 1.07l2.388 5.574c.22 .512 .22 1.092 0 1.604l-2.389 5.575c-.206 .48 -.589 .863 -1.07 1.07l-5.574 2.388c-.512 .22 -1.092 .22 -1.604 0l-5.575 -2.389a2.036 2.036 0 0 1 -1.07 -1.07l-2.388 -5.574a2.036 2.036 0 0 1 0 -1.604l2.389 -5.575c.206 -.48 .589 -.863 1.07 -1.07l5.574 -2.388a2.036 2.036 0 0 1 1.604 0z"></path>
                  <path d="M12 16v.01"></path>
                  <path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483"></path>
                </svg>
                FAQs
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`float-end mt-2 pt-1 me-4 icon-down ${
                    isVisible ? "rotate" : ""
                  }`}
                  onClick={toggleFAQ}
                />
              </li>
              {isVisible && (
                <div className="faq-content d-flex flex-column ms-3 ps-2">
                  <Link
                    to="/admin/faqs"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-list-check me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M3.5 5.5l1.5 1.5l2.5 -2.5"></path>
                        <path d="M3.5 11.5l1.5 1.5l2.5 -2.5"></path>
                        <path d="M3.5 17.5l1.5 1.5l2.5 -2.5"></path>
                        <path d="M11 6l9 0"></path>
                        <path d="M11 12l9 0"></path>
                        <path d="M11 18l9 0"></path>
                      </svg>
                      FAQs
                    </li>
                  </Link>

                  <Link
                    to="/admin/faq-categories"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-folder me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"></path>
                      </svg>
                      Categories
                    </li>
                  </Link>
                </div>
              )}
            </div>

            <li>
              <Link to="/admin/newsletters" className="text-light">
                <svg
                  className="icon svg-icon-ti-ti-mail me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path>
                  <path d="M3 7l9 6l9 -6"></path>
                </svg>
                Newsletters
              </Link>
            </li>
            <li>
              <svg
                className="icon svg-icon-ti-ti-world me-2 mb-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                <path d="M3.6 9h16.8"></path>
                <path d="M3.6 15h16.8"></path>
                <path d="M11.5 3a17 17 0 0 0 0 18"></path>
                <path d="M12.5 3a17 17 0 0 1 0 18"></path>
              </svg>
              Locations
            </li>
            <li>
              <svg
                className="icon svg-icon-ti-ti-folder me-2 mb-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"></path>
              </svg>
              Media
            </li>

            <div>
              <li onClick={appearence} style={{ cursor: "pointer" }}>
                <svg
                  className="icon svg-icon-ti-ti-brush me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M3 21v-4a4 4 0 1 1 4 4h-4"></path>
                  <path d="M21 3a16 16 0 0 0 -12.8 10.2"></path>
                  <path d="M21 3a16 16 0 0 1 -10.2 12.8"></path>
                  <path d="M10.6 9a9 9 0 0 1 4.4 4.4"></path>
                </svg>
                Appearance
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`float-end mt-2 pt-1 me-4 icon-down ${
                    appear ? "rotate" : ""
                  }`}
                  onClick={appearence}
                />
              </li>
              {appear && (
                <div className="faq-content d-flex flex-column ms-3 ps-2">
                  <Link
                    to="/admin/theme/all"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-palette me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25"></path>
                        <path d="M8.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        <path d="M12.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        <path d="M16.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                      </svg>
                      Themes
                    </li>
                  </Link>

                  <Link
                    to="/admin/menus"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-tournament me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M4 4m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M20 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M4 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M4 20m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M6 12h3a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-3"></path>
                        <path d="M6 4h7a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-2"></path>
                        <path d="M14 10h4"></path>
                      </svg>
                      Menus
                    </li>
                  </Link>

                  <Link
                    to="/admin/widgets"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-layout me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M4 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                        <path d="M4 13m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                        <path d="M14 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                      </svg>
                      Widgets
                    </li>
                  </Link>

                  <Link
                    to="/admin/theme/options"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-list-tree me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M9 6h11"></path>
                        <path d="M12 12h8"></path>
                        <path d="M15 18h5"></path>
                        <path d="M5 6v.01"></path>
                        <path d="M8 12v.01"></path>
                        <path d="M11 18v.01"></path>
                      </svg>
                      Theme Options
                    </li>
                  </Link>

                  <Link
                    to="/admin/theme/custom-css"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-file-type-css me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                        <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4"></path>
                        <path d="M8 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0"></path>
                        <path d="M11 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75"></path>
                        <path d="M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75"></path>
                      </svg>
                      Custom CSS
                    </li>
                  </Link>
                  <Link
                    to="/admin/theme/custom-js"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-file-type-js me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                        <path d="M3 15h3v4.5a1.5 1.5 0 0 1 -3 0"></path>
                        <path d="M9 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75"></path>
                        <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-1"></path>
                      </svg>
                      Custom JS
                    </li>
                  </Link>

                  <Link
                    to="/admin/theme/custom-html"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-file-type-html me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                        <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4"></path>
                        <path d="M2 21v-6"></path>
                        <path d="M5 15v6"></path>
                        <path d="M2 18h3"></path>
                        <path d="M20 15v6h2"></path>
                        <path d="M13 21v-6l2 3l2 -3v6"></path>
                        <path d="M7.5 15h3"></path>
                        <path d="M9 15v6"></path>
                      </svg>
                      Custom HTML
                    </li>
                  </Link>

                  <Link
                    to="/admin/theme/robots-txt"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-file-type-txt me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                        <path d="M16.5 15h3"></path>
                        <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4"></path>
                        <path d="M4.5 15h3"></path>
                        <path d="M6 15v6"></path>
                        <path d="M18 15v6"></path>
                        <path d="M10 15l4 6"></path>
                        <path d="M10 21l4 -6"></path>
                      </svg>
                      Robot.text Editor
                    </li>
                  </Link>
                </div>
              )}
            </div>

            <li>
              <svg
                className="icon svg-icon-ti-ti-plug me-2 mb-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9.785 6l8.215 8.215l-2.054 2.054a5.81 5.81 0 1 1 -8.215 -8.215l2.054 -2.054z"></path>
                <path d="M4 20l3.5 -3.5"></path>
                <path d="M15 4l-3.5 3.5"></path>
                <path d="M20 9l-3.5 3.5"></path>
              </svg>
              Plugins
            </li>
            <li>
              <svg
                className="icon svg-icon-ti-ti-tool me-2 mb-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5"></path>
              </svg>
              Tools
            </li>
            <li>
              <Link to="/admin/settings" className="text-light">
                <svg
                  className="icon svg-icon-ti-ti-settings me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                </svg>
                Settings
              </Link>
            </li>
            <li>
              <Link to="/admin/system" className="text-light">
                <svg
                  className="icon svg-icon-ti-ti-user-shield me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h2"></path>
                  <path d="M22 16c0 4 -2.5 6 -3.5 6s-3.5 -2 -3.5 -6c1 0 2.5 -.5 3.5 -1.5c1 1 2.5 1.5 3.5 1.5z"></path>
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                </svg>
                Platform Administration
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <nav className="breadcrumb-container text-center">
        <ol className="breadcrumb d-flex flex-wrap">
          <li className="breadcrumb-item fw-normal">
            <Link to="/admin/welcome">DASHBOARD</Link>
          </li>
          <li className="breadcrumb-item fw-normal text-dark">APPEARANCE</li>

          <li className="breadcrumb-item fw-medium ms-2 text-dark">WIDGETS</li>
        </ol>
      </nav>

      <div className="container container-widget create-tag1 cart-cart">
        <div
          className="alert alert-info bg-body editor-page border d-flex create-tag1 d-flex wigets-name2 ms-1 ms-lg-0"
          id="role-announce"
          role="alert"
        >
          <span>
            <svg
              className="icon alert-icon svg-icon-ti-ti-info-circle me-1 editor-page"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
              <path d="M12 9h.01"></path>
              <path d="M11 12h1v4h1"></path>
            </svg>

            <span>
              To activate a widget drag and drop it to a sidebar. To deactivate
              a widget, open it in sidebar and click delete button.
            </span>
          </span>
        </div>

        <h4 className="fw-medium">Available Widgets</h4>

        <div className="row ms-1 me-1 ms-lg-0 gap-1">
          <div className="col-12 col-lg-3 border rounded py-3 mb-3 mb-lg-0 text-start name-widgets">
            Simple Menu
          </div>

          <div className="col-12 col-lg-3 border rounded py-3 mb-3 mb-lg-0 text-start name-widgets">
            Text
          </div>

          <div className="col-12 col-lg-3 border rounded py-4 mb-3 mb-lg-0 text-start name-widgets">
            Blog Sidebar
            <FontAwesomeIcon
              icon={faAngleUp}
              className="faangle1 bg-light px-2 rounded float-end mt-1"
              style={{
                cursor: "pointer",
                transform: rotateState.blog ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
              onClick={blogsidebar}
            />
            <label htmlFor="" className="custom-widgets">
              Customize the blog page with this sidebar widget.
            </label>
            <hr />
            {sidebar && (
              <>
                <div className="border rounded py-2 mt-2">
                  <label htmlFor="" className="ms-2">
                    Blog Search
                  </label>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="float-end me-3 mt-1"
                    style={{
                      cursor: "pointer",
                      transform: rotateState.blog1
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onClick={searchblog}
                  />
                  <hr />
                  {search && (
                    <div className="d-flex justify-content-around mb-2 ms-2 ms-lg-0 blog-delete">
                      <button className="btn btn-light py-4 px-3 d-flex">
                        Delete
                      </button>
                      <button className="btn btn-success py-4 px-3 d-flex">
                        Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="border mt-2 py-2 rounded mt-3">
                  <label htmlFor="" className="ms-2">
                    Blog About Me
                  </label>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="float-end me-3 mt-1 pe-1"
                    style={{
                      cursor: "pointer",
                      transform: rotateState.about
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onClick={blogaboutclick}
                  />
                  <hr />
                  {blogAbout && (
                    <div className="ms-2 ps-1">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        className="form-control mt-2 px-2 py-4 name-blog"
                        placeholder="Name"
                      />

                      <label htmlFor="name" className="mt-3">
                        About URL
                      </label>
                      <input
                        type="text"
                        className="form-control mt-2 px-2 py-4 name-blog"
                        placeholder="URL"
                      />

                      <label htmlFor="name" className="mt-3">
                        Author Avatar
                      </label>
                      <div
                        className="image-placeholder mt-2 w-75"
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
                      >
                        {imageUrl ? (
                          <img
                            alt="Uploaded preview"
                            src={imageUrl}
                            width="100"
                            height="100"
                          />
                        ) : (
                          <img src={Cutting} className="w-75 h-75" />
                        )}
                      </div>
                      <input
                        id="fileInput"
                        type="file"
                        name="file"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                      <Link
                        className="text-decoration-none ms-1 avatar"
                        to="#"
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
                      >
                        Choose image <br />
                      </Link>
                      <span className="ms-2 me-2 text-decoration-none">or</span>
                      <Link
                        to="#"
                        onClick={handleAddFromUrl}
                        className="text-decoration-none avatar"
                      >
                        Add from URL
                      </Link>
                      <br />

                      <label htmlFor="name" className="mt-3">
                        Author Name
                      </label>
                      <input
                        type="text"
                        className="form-control mt-2 py-4 px-2 name-blog"
                        placeholder="Author name"
                      />

                      <label htmlFor="name" className="mt-3">
                        Author Role
                      </label>
                      <input
                        type="text"
                        className="form-control mt-2 py-4 px-2 name-blog"
                        placeholder="Author role"
                      />

                      <label htmlFor="name" className="mt-3">
                        Author Description
                      </label>
                      <textarea
                        type="text"
                        className="form-control mt-2 py-3 px-2 name-blog"
                        placeholder="Short description"
                      />

                      <label htmlFor="name" className="mt-3">
                        Author Signature
                      </label>

                      <div
                        className="image-placeholder mt-2 w-75"
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
                      >
                        {imageUrl ? (
                          <img
                            alt="Uploaded preview"
                            src={imageUrl}
                            width="100"
                            height="100"
                          />
                        ) : (
                          <img src={Cutting} className="w-75 h-75" />
                        )}
                      </div>
                      <input
                        id="fileInput"
                        type="file"
                        name="file"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                      <Link
                        className="text-decoration-none ms-1 avatar"
                        to="#"
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
                      >
                        Choose image <br />
                      </Link>
                      <span className="ms-2 me-2 text-decoration-none">or</span>
                      <Link
                        to="#"
                        onClick={handleAddFromUrl}
                        className="text-decoration-none avatar"
                      >
                        Add from URL
                      </Link>

                      <div className="d-flex justify-content-around mt-3">
                        <button className="btn btn-light py-4 px-3 d-flex">
                          Delete
                        </button>
                        <button className="btn btn-success py-4 px-3 d-flex">
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border rounded py-2 mt-3">
                  <label htmlFor="" className="ms-2">
                    Blog Posts
                  </label>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="float-end me-3 pe-1 mt-1"
                    style={{
                      cursor: "pointer",
                      transform: rotateState.posts
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onClick={blogposts}
                  />
                  <hr />
                  {blogPost && (
                    <div className="ms-2 ps-1">
                      <label htmlFor="name" className="text-start">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control mt-2 py-3 px-2 py-4 name-blog"
                        placeholder="Name"
                      />

                      <label htmlFor="name" className="mt-3">
                        Type
                      </label>
                      <select className="form-select mt-2 px-2 py-4 name-blog">
                        <option value="Latest">Latest</option>
                        <option value="Featured">Featured</option>
                        <option value="Popular">Popular</option>
                        <option value="Recent">Recent</option>
                      </select>

                      <label htmlFor="name" className="mt-3">
                        Limit
                      </label>
                      <input
                        type="number"
                        className="form-control mt-2 py-3 px-2 py-4 name-blog"
                      />

                      <div className="d-flex justify-content-around mt-3 mb-2">
                        <button className="btn btn-light py-4 px-3 d-flex">
                          Delete
                        </button>
                        <button className="btn btn-success py-4 px-3 d-flex">
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border rounded mt-3">
                  <label htmlFor="" className="ms-2 py-2">
                    Blog Categories
                  </label>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="float-end me-3 mt-3 pe-1"
                    style={{
                      cursor: "pointer",
                      transform: rotateState.blogcat
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onClick={blogCategoryClicked}
                  />
                  <hr />
                  {blogCategory && (
                    <div className="ms-2 ps-1">
                      <label htmlFor="name" className="text-start">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control mt-2 py-3 py-4 px-2 name-blog"
                        placeholder="Name"
                      />

                      <label htmlFor="name" className="mt-3">
                        Choose categories
                      </label>
                      <select className="form-select mt-2 px-2 py-4 name-blog">
                        <option value="Crisp Bread & Cake">
                          Crisp Bread & Cake
                        </option>
                        <option value="Fashion">Fashion</option>
                        <option value="Electronic">Electronic</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Organic Fruits">Organic Fruits</option>
                        <option value="Ecological">Ecological</option>
                      </select>

                      <label htmlFor="name" className="mt-3">
                        Display posts count?
                      </label>
                      <select className="form-select mt-2 px-2 py-4 name-blog">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>

                      <div className="d-flex justify-content-around mt-3 mb-3">
                        <button className="btn btn-light py-4 px-3 d-flex">
                          Delete
                        </button>
                        <button className="btn btn-success py-4 px-3 d-flex">
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border rounded  mt-3">
                  <label htmlFor="" className="ms-2 py-2">
                    Tags
                  </label>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="float-end me-3 mt-3 pe-2"
                    style={{
                      cursor: "pointer",
                      transform: rotateState.blogtag
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onClick={tagsClicked}
                  />
                  <hr />
                  {tags && (
                    <div className="ms-2 ps-1">
                      <label htmlFor="name" className="text-start">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control mt-2 py-3 py-4 px-2 name-blog"
                        placeholder="Name"
                      />

                      <label htmlFor="name" className="mt-3">
                        Number tags to display
                      </label>
                      <input
                        type="number"
                        className="form-control mt-2 py-3 py-4 px-2 name-blog"
                      />

                      <div className="d-flex justify-content-around mt-3 mb-3">
                        <button className="btn btn-light py-4 px-3 d-flex">
                          Delete
                        </button>
                        <button className="btn btn-success py-4 px-3 d-flex">
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="col-12 col-lg-3 border rounded py-4 mb-3 mb-lg-0 text-start name-widgets">
            Footer Primary sidebar
            <FontAwesomeIcon
              icon={faAngleUp}
              className="ms-4 ps-1 bg-light faangle11 float-end me-2 pe-1 pe-lg-0 mt-1"
              style={{
                cursor: "pointer",
                transform: rotateState.footer
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
              onClick={footerclicked}
            />
            <label htmlFor="" className="custom-widgets">
              Customize the footer content with this sidebar widget.
            </label>
            <hr />
            {footer && (
              <>
                <div className="border rounded py-2 mt-2">
                  <label htmlFor="" className="ms-2">
                    Site Information
                  </label>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="float-end me-3 mt-1"
                    style={{
                      cursor: "pointer",
                      transform: rotateState.primary1
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onClick={siteInformation}
                  />
                  <hr />
                  {site && (
                    <div className="ms-2 ps-1">
                      <label htmlFor="name" className="mt-0">
                        Logo
                      </label>
                      <div
                        className="image-placeholder mt-2 w-75"
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
                      >
                        {imageUrl ? (
                          <img
                            alt="Uploaded preview"
                            src={imageUrl}
                            width="100"
                            height="100"
                          />
                        ) : (
                          <img src={Cutting} className="w-75 h-75" />
                        )}
                      </div>
                      <input
                        id="fileInput"
                        type="file"
                        name="file"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                      <Link
                        className="text-decoration-none ms-1 avatar"
                        to="#"
                        onClick={() =>
                          document.getElementById("fileInput").click()
                        }
                      >
                        Choose image <br />
                      </Link>
                      <span className="ms-2 me-2 text-decoration-none">or</span>
                      <Link
                        to="#"
                        onClick={handleAddFromUrl}
                        className="text-decoration-none avatar"
                      >
                        Add from URL
                      </Link>

                      <label htmlFor="" className="ms-2 toggle-hide">
                        Leave empty to use the default logo in Theme Options.
                      </label>

                      <label htmlFor="name" className="mt-3">
                        Logo height (default: 35px)
                      </label>
                      <input
                        type="number"
                        className="form-control mt-2 py-4 px-2 name-blog"
                      />

                      <label htmlFor="name" className="mt-3">
                        About
                      </label>
                      <textarea
                        type="text"
                        className="form-control mt-2 py-3 px-2 name-blog  "
                        placeholder="Short description"
                      />

                      <input
                        type="checkbox"
                        className="mt-3 ms-1 form-check-input"
                      />
                      <label htmlFor="" className="ms-2 mt-2 pt-1">
                        Show social links
                      </label>

                      <label className="mt-2 ms-1 toggle-hide">
                        Toggle to display or hide social links on your site.
                        Configure the links in Theme Options Social Links.
                      </label>

                      <div className="d-flex justify-content-around mt-3">
                        <button className="btn btn-light py-4 px-3 d-flex">
                          Delete
                        </button>
                        <button className="btn btn-success py-4 px-3 d-flex">
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border mt-3 py-2 rounded">
                  <label htmlFor="" className="ms-2">
                    Custom Menu
                  </label>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="float-end me-3 mt-1"
                    style={{
                      cursor: "pointer",
                      transform: rotateState.custom
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onClick={customMenu}
                  />
                  <hr />
                  {custom && (
                    <div className="ms-2 ps-1">
                      <label htmlFor="name" className="text-start">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control mt-2 py-3 py-4 px-2 name-blog"
                        placeholder="Name"
                      />

                      <label htmlFor="name" className="mt-3">
                        Menu
                      </label>
                      <select
                        className="select-search-full form-select mt-2 px-2 py-4 name-blog"
                        data-allow-clear="false"
                        id="menu_id"
                        name="menu_id"
                        tabindex="0"
                        aria-hidden="false"
                      >
                        <option value="main-menu">Main menu</option>
                        <option value="my-account" selected="selected">
                          My Account
                        </option>
                        <option value="information">Information</option>
                        <option value="main-menu-vi">Thực đơn chính</option>
                        <option value="my-account-vi">Tài khoản của tôi</option>
                      </select>

                      <div className="d-flex justify-content-around mt-3 mb-3">
                        <button className="btn btn-light py-4 px-3 d-flex">
                          Delete
                        </button>
                        <button className="btn btn-success py-4 px-3 d-flex">
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border rounded py-2 mt-3">
                  <label htmlFor="" className="ms-2">
                    Custom Menu
                  </label>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="me-3 mt-1 float-end"
                    style={{
                      cursor: "pointer",
                      transform: rotateState.menu
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onClick={customMenu1}
                  />
                  <hr />
                  {custom1 && (
                    <div className="ms-2 ps-1">
                      <label htmlFor="name" className="text-start">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control mt-2 py-3 py-4 px-2 name-blog"
                        placeholder="Name"
                      />

                      <label htmlFor="name" className="mt-3">
                        Menu
                      </label>

                      <select
                        className="select-search-full form-select select2-hidden-accessible mt-2 px-2 py-4 name-blog"
                        data-allow-clear="false"
                        id="menu_id"
                        name="menu_id"
                        data-select2-id="select2-data-menu_id"
                        tabindex="-1"
                        aria-hidden="true"
                      >
                        <option
                          value="main-menu"
                          data-select2-id="select2-data-31-hxlm"
                        >
                          Main menu
                        </option>
                        <option
                          value="my-account"
                          data-select2-id="select2-data-32-sgj6"
                        >
                          My Account
                        </option>
                        <option
                          value="information"
                          selected="selected"
                          data-select2-id="select2-data-12-5k0n"
                        >
                          Information
                        </option>
                      </select>

                      <div className="d-flex justify-content-around mt-3 mb-3">
                        <button className="btn btn-light py-4 px-3 d-flex">
                          Delete
                        </button>
                        <button className="btn btn-success py-4 px-3 d-flex">
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border rounded mt-3">
                  <label htmlFor="" className="ms-2 py-2">
                    Site Contact
                  </label>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="float-end me-3 mt-2 pt-1"
                    style={{
                      cursor: "pointer",
                      transform: rotateState.contact
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onClick={contactClicked}
                  />
                  <hr />
                  {contact && (
                    <div className="ms-2 ps-1">
                      <label htmlFor="name" className="text-start">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control mt-2 py-3 py-4 px-2 name-blog"
                        placeholder="Name"
                      />

                      <label htmlFor="name" className="text-start mt-3">
                        Phone label
                      </label>
                      <input
                        type="text"
                        className="form-control mt-2 py-3 py-4 px-2 name-blog"
                      />

                      <label htmlFor="name" className="text-start mt-3">
                        Phone number
                      </label>
                      <input
                        type="number"
                        className="form-control mt-2 py-3 py-4 px-2 name-blog"
                      />
                      <label htmlFor="" className="toggle-hide mt-2 ms-1 me-2">
                        If you need multiple phones, please use slash (/) to
                        separate them. e.g: 012345566/0345678923
                      </label>

                      <label htmlFor="name" className="text-start mt-3">
                        Email address
                      </label>
                      <input
                        type="text"
                        className="form-control mt-2 py-3 py-4 px-2 name-blog"
                      />

                      <p className="toggle-hide mt-2 ms-1 me-1">
                        If you need multiple emails, please use slash (/) to
                        separate them. e.g: contact@demo.com/ <br />{" "}
                        hello@abc.com
                      </p>

                      <label htmlFor="name" className="text-start mt-0">
                        Address
                      </label>
                      <input
                        type="text"
                        className="form-control mt-2 py-3 py-4 px-2 name-blog"
                      />

                      <div className="d-flex justify-content-around mt-3 mb-3">
                        <button className="btn btn-light py-4 px-3 d-flex">
                          Delete
                        </button>
                        <button className="btn btn-success py-4 px-3 d-flex">
                          Save
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border rounded  mt-3">
                  <label htmlFor="" className="ms-2 py-2">
                    Product Categories
                  </label>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="float-end me-3 mt-2 pt-1 pe-"
                    style={{
                      cursor: "pointer",
                      transform: rotateState.productcate1
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onClick={productCategoryClicked}
                  />
                  <hr />
                  {productCategory && (
                    <>
                      <label htmlFor="" className="ms-2 mb-2">
                        Style
                      </label>
                      <div className="d-flex flex-column gap-2 mb-3 ms-2 me-2 bg-light">
                        <div className="d-flex gap-2">
                          <div className="widgets border rounded">
                            <img
                              src={Slider}
                              alt="RxLYTE"
                              className="img-fluid rounded py-2"
                            />
                          </div>

                          <div className="widgets border rounded">
                            <img
                              src={Grid}
                              alt="RxLYTE"
                              className="img-fluid rounded py-2"
                            />
                          </div>
                          <div className="widgets border rounded">
                            <img
                              src={Slider}
                              alt="RxLYTE"
                              className="img-fluid rounded py-2"
                            />
                          </div>
                        </div>

                        <label htmlFor="">Name</label>
                        <input
                          type="text"
                          className="form-control py-4 name-blog"
                        />

                        <div
                          className="d-flex flex-column ms-2 overflow-y-scroll"
                          style={{ height: "30rem" }}
                        >
                          <div className="d-lg-flex mt-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              New Arrivals
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Electronics
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Featured
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              New Arrivals
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Best Sellers
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Mobile Phone
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Computers & Laptops
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Top Brands
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Weekly Best Selling
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              CPU Heat Pipes
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              CPU Coolers
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Accessories
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Headphones
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Wireless Headphones
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              TWS Headphones
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Smart Watch
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Gaming Console
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Playstation
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Gifts
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Computers
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Desktop
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Laptop
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Tablet
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Accessories
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Smart Phones & Tablets
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              TV Video & Music
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Cameras
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Cooking
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Accessories
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              With Bluetooth
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Sports
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Electronic Gadgets
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Microscope
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Remote Control
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Monitor
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Thermometer
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Backpack
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Headphones
                            </label>
                          </div>
                        </div>
                        <div className="d-flex justify-content-around mt-3 mb-3">
                          <button className="btn btn-light py-4 px-3 d-flex border-dark">
                            Delete
                          </button>
                          <button className="btn btn-success py-4 px-3 d-flex">
                            Save
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="border rounded  mt-3">
                  <label htmlFor="" className="ms-2 py-2">
                    Product Categories
                  </label>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="float-end me-3 mt-2 pt-1"
                    style={{
                      cursor: "pointer",
                      transform: rotateState.productcate2
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onClick={productCategoryClicked1}
                  />
                  <hr />
                  {productCategory1 && (
                    <>
                      <label htmlFor="" className="ms-2 mb-2">
                        Style
                      </label>
                      <div className="d-flex flex-column gap-2 mb-3 ms-2 me-2 bg-light">
                        <div className="d-flex gap-2">
                          <div className="widgets border rounded">
                            <img
                              src={Slider}
                              alt="RxLYTE"
                              className="img-fluid rounded py-2"
                            />
                          </div>

                          <div className="widgets border rounded">
                            <img
                              src={Grid}
                              alt="RxLYTE"
                              className="img-fluid rounded py-2"
                            />
                          </div>
                          <div className="widgets border rounded">
                            <img
                              src={Slider}
                              alt="RxLYTE"
                              className="img-fluid rounded py-2"
                            />
                          </div>
                        </div>

                        <label htmlFor="">Name</label>
                        <input
                          type="text"
                          className="form-control py-4 name-blog"
                        />

                        <div
                          className="d-flex flex-column ms-2 overflow-y-scroll"
                          style={{ height: "30rem" }}
                        >
                          <div className="d-lg-flex mt-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              New Arrivals
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Electronics
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Featured
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              New Arrivals
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Best Sellers
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Mobile Phone
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Computers & Laptops
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Top Brands
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Weekly Best Selling
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              CPU Heat Pipes
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              CPU Coolers
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Accessories
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Headphones
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Wireless Headphones
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              TWS Headphones
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Smart Watch
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Gaming Console
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Playstation
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Gifts
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Computers
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Desktop
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Laptop
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Tablet
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Accessories
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Smart Phones & Tablets
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              TV Video & Music
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Cameras
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Cooking
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Accessories
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              With Bluetooth
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Sports
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Electronic Gadgets
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Microscope
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Remote Control
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Monitor
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Thermometer
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Backpack
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Headphones
                            </label>
                          </div>
                        </div>
                        <div className="d-flex justify-content-around mt-3 mb-3">
                          <button className="btn btn-light py-4 px-3 d-flex border-dark">
                            Delete
                          </button>
                          <button className="btn btn-success py-4 px-3 d-flex">
                            Save
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="border rounded  mt-3">
                  <label htmlFor="" className="ms-2 py-2">
                    Product Categories
                  </label>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="float-end me-3 mt-2 pt-1"
                    style={{
                      cursor: "pointer",
                      transform: rotateState.productcate3
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onClick={productCategoryClicked2}
                  />
                  <hr />
                  {productCategory2 && (
                    <>
                      <label htmlFor="" className="ms-2 mb-2">
                        Style
                      </label>
                      <div className="d-flex flex-column gap-2 mb-3 ms-2 me-2 bg-light">
                        <div className="d-flex gap-2">
                          <div className="widgets border rounded">
                            <img
                              src={Slider}
                              alt="RxLYTE"
                              className="img-fluid rounded py-2"
                            />
                          </div>

                          <div className="widgets border rounded">
                            <img
                              src={Grid}
                              alt="RxLYTE"
                              className="img-fluid rounded py-2"
                            />
                          </div>
                          <div className="widgets border rounded">
                            <img
                              src={Slider}
                              alt="RxLYTE"
                              className="img-fluid rounded py-2"
                            />
                          </div>
                        </div>

                        <label htmlFor="">Name</label>
                        <input
                          type="text"
                          className="form-control py-4 name-blog"
                        />

                        <div
                          className="d-flex flex-column ms-2 overflow-y-scroll"
                          style={{ height: "30rem" }}
                        >
                          <div className="d-lg-flex mt-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              New Arrivals
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Electronics
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Featured
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              New Arrivals
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Best Sellers
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Mobile Phone
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Computers & Laptops
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Top Brands
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Weekly Best Selling
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              CPU Heat Pipes
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              CPU Coolers
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Accessories
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Headphones
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Wireless Headphones
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              TWS Headphones
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Smart Watch
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Gaming Console
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Playstation
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Gifts
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Computers
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Desktop
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Laptop
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Tablet
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Accessories
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Smart Phones & Tablets
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              TV Video & Music
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Cameras
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Cooking
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Accessories
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              With Bluetooth
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Sports
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Electronic Gadgets
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Microscope
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Remote Control
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Monitor
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Thermometer
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Backpack
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Headphones
                            </label>
                          </div>
                        </div>
                        <div className="d-flex justify-content-around mt-3 mb-3">
                          <button className="btn btn-light py-4 px-3 d-flex border-dark">
                            Delete
                          </button>
                          <button className="btn btn-success py-4 px-3 d-flex">
                            Save
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="border rounded  mt-3">
                  <label htmlFor="" className="ms-2 py-2">
                    Product Categories
                  </label>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="float-end me-3 mt-2 pt-1"
                    style={{
                      cursor: "pointer",
                      transform: rotateState.productcate4
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                    }}
                    onClick={productCategoryClicked3}
                  />
                  <hr />
                  {productCategory3 && (
                    <>
                      <label htmlFor="" className="ms-2 mb-2">
                        Style
                      </label>
                      <div className="d-flex flex-column gap-2 mb-3 ms-2 me-2 bg-light">
                        <div className="d-flex gap-2">
                          <div className="widgets border rounded">
                            <img
                              src={Slider}
                              alt="RxLYTE"
                              className="img-fluid rounded py-2"
                            />
                          </div>

                          <div className="widgets border rounded">
                            <img
                              src={Grid}
                              alt="RxLYTE"
                              className="img-fluid rounded py-2"
                            />
                          </div>
                          <div className="widgets border rounded">
                            <img
                              src={Slider}
                              alt="RxLYTE"
                              className="img-fluid rounded py-2"
                            />
                          </div>
                        </div>

                        <label htmlFor="">Name</label>
                        <input
                          type="text"
                          className="form-control py-4 name-blog"
                        />

                        <div
                          className="d-flex flex-column ms-2 overflow-y-scroll"
                          style={{ height: "30rem" }}
                        >
                          <div className="d-lg-flex mt-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              New Arrivals
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Electronics
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Featured
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              New Arrivals
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Best Sellers
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Mobile Phone
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Computers & Laptops
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Top Brands
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Weekly Best Selling
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              CPU Heat Pipes
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              CPU Coolers
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Accessories
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Headphones
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Wireless Headphones
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              TWS Headphones
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-5">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Smart Watch
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Gaming Console
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-3">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Playstation
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Gifts
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Computers
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Desktop
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Laptop
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Tablet
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Accessories
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Smart Phones & Tablets
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              TV Video & Music
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Cameras
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Cooking
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Accessories
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-4">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              With Bluetooth
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Sports
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Electronic Gadgets
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Microscope
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Remote Control
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Monitor
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Thermometer
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Backpack
                            </label>
                          </div>

                          <div className="d-lg-flex mt-2 ms-2">
                            <input
                              type="checkbox"
                              className="form-check-input"
                            />
                            <label htmlFor="" className="ms-2">
                              Headphones
                            </label>
                          </div>
                        </div>
                        <div className="d-flex justify-content-around mt-3 mb-3">
                          <button className="btn btn-light py-4 px-3 d-flex border-dark">
                            Delete
                          </button>
                          <button className="btn btn-success py-4 px-3 d-flex">
                            Save
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="container">
            <div className="row d-flex mt-1 gap-1">
              <div className="col-12 col-lg-3 border rounded py-3 mb-3 mb-lg-0 text-start name-widgets">
                Blog about Me
              </div>

              <div className="col-12 col-lg-3 border rounded py-3 mb-3 mb-lg-0 text-start name-widgets">
                Blog Categories
              </div>

              <div className="col-12 col-lg-3 border rounded py-4 mb-3 mb-lg-0 text-start name-widgets  ">
                Footer Top Sidebar
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className="faangle21 bg-light px-2 rounded float-end mt-1"
                  style={{
                    cursor: "pointer",
                    transform: rotateState.footers
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={footers}
                />
                <label htmlFor="" className="custom-widgets">
                  Engage visitors before they reach the footer with this widget.
                </label>
                <hr />
                {footers1 && (
                  <>
                    <div className="border mt-2 py-2 rounded mt-3">
                      <label htmlFor="" className="ms-2">
                        Newsletters form
                      </label>
                      <FontAwesomeIcon
                        icon={faAngleDown}
                        className="float-end me-3 mt-1 pe-1"
                        style={{
                          cursor: "pointer",
                          transform: rotateState.news
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                        onClick={newsletterClicked}
                      />
                      <hr />
                      {newsletters && (
                        <div className="ms-2 ps-1">
                          <label htmlFor="name">Title</label>
                          <input
                            type="text"
                            className="form-control mt-2 px-2 py-4 name-blog"
                            placeholder="Title"
                          />

                          <label htmlFor="name" className="mt-3">
                            SubTitle
                          </label>
                          <input
                            type="text"
                            className="form-control mt-2 px-2 py-4 name-blog"
                            placeholder="URL"
                          />

                          <label htmlFor="name" className="mt-3">
                            Shape image 1
                          </label>
                          <div
                            className="image-placeholder mt-2 w-75"
                            onClick={() =>
                              document.getElementById("fileInput").click()
                            }
                          >
                            {imageUrl ? (
                              <img
                                alt="Uploaded preview"
                                src={imageUrl}
                                width="100"
                                height="100"
                              />
                            ) : (
                              <img src={Cutting} className="w-75 h-75" />
                            )}
                          </div>
                          <input
                            id="fileInput"
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                          <Link
                            className="text-decoration-none ms-1 avatar"
                            to="#"
                            onClick={() =>
                              document.getElementById("fileInput").click()
                            }
                          >
                            Choose image <br />
                          </Link>
                          <span className="ms-2 me-2 text-decoration-none">
                            or
                          </span>
                          <Link
                            to="#"
                            onClick={handleAddFromUrl}
                            className="text-decoration-none avatar"
                          >
                            Add from URL
                          </Link>
                          <br />

                          <label htmlFor="name" className="mt-3">
                            Shape image 2
                          </label>
                          <div
                            className="image-placeholder mt-2 w-75"
                            onClick={() =>
                              document.getElementById("fileInput").click()
                            }
                          >
                            {imageUrl ? (
                              <img
                                alt="Uploaded preview"
                                src={imageUrl}
                                width="100"
                                height="100"
                              />
                            ) : (
                              <img src={Cutting} className="w-75 h-75" />
                            )}
                          </div>
                          <input
                            id="fileInput"
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                          <Link
                            className="text-decoration-none ms-1 avatar"
                            to="#"
                            onClick={() =>
                              document.getElementById("fileInput").click()
                            }
                          >
                            Choose image <br />
                          </Link>
                          <span className="ms-2 me-2 text-decoration-none">
                            or
                          </span>
                          <Link
                            to="#"
                            onClick={handleAddFromUrl}
                            className="text-decoration-none avatar"
                          >
                            Add from URL
                          </Link>

                          <label htmlFor="name" className="mt-3">
                            Shape image 3
                          </label>
                          <div
                            className="image-placeholder mt-2 w-75"
                            onClick={() =>
                              document.getElementById("fileInput").click()
                            }
                          >
                            {imageUrl ? (
                              <img
                                alt="Uploaded preview"
                                src={imageUrl}
                                width="100"
                                height="100"
                              />
                            ) : (
                              <img src={Cutting} className="w-75 h-75" />
                            )}
                          </div>
                          <input
                            id="fileInput"
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                          <Link
                            className="text-decoration-none ms-1 avatar"
                            to="#"
                            onClick={() =>
                              document.getElementById("fileInput").click()
                            }
                          >
                            Choose image <br />
                          </Link>
                          <span className="ms-2 me-2 text-decoration-none">
                            or
                          </span>
                          <Link
                            to="#"
                            onClick={handleAddFromUrl}
                            className="text-decoration-none avatar"
                          >
                            Add from URL
                          </Link>

                          <label htmlFor="name" className="mt-3">
                            Shape image 4
                          </label>
                          <div
                            className="image-placeholder mt-2 w-75"
                            onClick={() =>
                              document.getElementById("fileInput").click()
                            }
                          >
                            {imageUrl ? (
                              <img
                                alt="Uploaded preview"
                                src={imageUrl}
                                width="100"
                                height="100"
                              />
                            ) : (
                              <img src={Cutting} className="w-75 h-75" />
                            )}
                          </div>
                          <input
                            id="fileInput"
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                          <Link
                            className="text-decoration-none ms-1 avatar"
                            to="#"
                            onClick={() =>
                              document.getElementById("fileInput").click()
                            }
                          >
                            Choose image <br />
                          </Link>
                          <span className="ms-2 me-2 text-decoration-none">
                            or
                          </span>
                          <Link
                            to="#"
                            onClick={handleAddFromUrl}
                            className="text-decoration-none avatar"
                          >
                            Add from URL
                          </Link>

                          <div className="d-flex justify-content-around mt-3">
                            <button className="btn btn-light py-4 px-3 d-flex">
                              Delete
                            </button>
                            <button className="btn btn-success py-4 px-3 d-flex">
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="col-12 col-lg-3 border rounded py-4 mb-3 mb-lg-0 text-start name-widgets">
                Footer Bottom Sidebar
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className="ms-4 ps-1 bg-light faangle11 float-end me-2 pe-1 pe-lg-0 mt-1"
                  style={{
                    cursor: "pointer",
                    transform: rotateState.footer1
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={footerclicked1}
                />
                <label htmlFor="" className="custom-widgets">
                  Display copyright text and partner images in the lower section
                  of your website's footer.
                </label>
                <hr />
                {footer2 && (
                  <>
                    <div className="border rounded py-2 mt-2">
                      <label htmlFor="" className="ms-2">
                        Site Copyright
                      </label>
                      <FontAwesomeIcon
                        icon={faAngleDown}
                        className="float-end me-3 mt-1"
                        style={{
                          cursor: "pointer",
                          transform: rotateState.copyright
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                        onClick={copyrightclicked}
                      />
                      <hr />
                      {copyright && (
                        <>
                          <label htmlFor="name" className="mt-3 ms-3">
                            Image
                          </label>
                          <div
                            className="image-placeholder mt-2 ms-3 w-75"
                            onClick={() =>
                              document.getElementById("fileInput").click()
                            }
                          >
                            {imageUrl ? (
                              <img
                                alt="Uploaded preview"
                                src={imageUrl}
                                width="100"
                                height="100"
                              />
                            ) : (
                              <img src={Cutting} className="w-75 h-75" />
                            )}
                          </div>
                          <input
                            id="fileInput"
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                          <Link
                            className="text-decoration-none ms-3 ps-1 avatar"
                            to="#"
                            onClick={() =>
                              document.getElementById("fileInput").click()
                            }
                          >
                            Choose image <br />
                          </Link>
                          <span className="ms-3 ps-1 me-2 text-decoration-none">
                            or
                          </span>
                          <Link
                            to="#"
                            onClick={handleAddFromUrl}
                            className="text-decoration-none avatar"
                          >
                            Add from URL
                          </Link>
                          <div className="d-flex justify-content-around mt-3">
                            <button className="btn btn-light py-4 px-3 d-flex">
                              Delete
                            </button>
                            <button className="btn btn-success py-4 px-3 d-flex">
                              Save
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="border mt-3 py-2 rounded">
                      <label htmlFor="" className="ms-2">
                        Site Accepted Payments
                      </label>
                      <FontAwesomeIcon
                        icon={faAngleDown}
                        className="float-end me-3 mt-1"
                        style={{
                          cursor: "pointer",
                          transform: rotateState.payment
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                        onClick={paymentClicked}
                      />
                      <hr />
                      {payment && (
                        <div className="ms-2 ps-1">
                          <label htmlFor="name" className="mt-3">
                            URL
                          </label>
                          <input
                            type="text"
                            className="form-control mt-2 py-3 py-4 px-2 name-blog"
                            placeholder="URL"
                          />

                          <div className="d-flex justify-content-around mt-3 mb-3">
                            <button className="btn btn-light py-4 px-3 d-flex">
                              Delete
                            </button>
                            <button className="btn btn-success py-4 px-3 d-flex">
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row d-flex mt-1 gap-1">
              <div className="col-12 col-lg-3 border rounded py-3 mb-3 mb-lg-0 text-start name-widgets">
                Blog Posts
              </div>

              <div className="col-12 col-lg-3 border rounded py-3 mb-3 mb-lg-0 text-start name-widgets">
                Blog Search
              </div>

              <div className="col-12 col-lg-3 border rounded py-4 mb-3 mb-lg-0 text-start name-widgets">
                Product details sidebar
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className="faangle21 bg-light px-2 rounded float-end mt-1"
                  style={{
                    cursor: "pointer",
                    transform: rotateState.details
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={pagewidgets}
                />
                <label htmlFor="" className="custom-widgets">
                  Customize the product details page with this sidebar widget.
                </label>
                <hr />
                {pageWidgets && (
                  <>
                    <div className="border mt-2 py-2 rounded mt-3 bg-light">
                      <label htmlFor="" className="ms-2">
                        Product detail info
                      </label>
                      <FontAwesomeIcon
                        icon={faAngleDown}
                        className="float-end me-3 mt-1 pe-1"
                        style={{
                          cursor: "pointer",
                          transform: rotateState.info
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                        onClick={productdetails}
                      />
                      <hr />
                      {productDetails && (
                        <div className="ms-2 ps-1">
                          <label htmlFor="Instructions">Instructions</label>
                          <div className="border rounded me-2 mt-2 pb-3 name-blog">
                            <label htmlFor="Instructions" className="ms-2 mt-2">
                              Message
                            </label>
                            <input
                              type="text"
                              className="form-control mt-2 px-2 py-4 name-blog ms-2"
                            />
                          </div>

                          <div className="border rounded me-2 mt-4 pb-3 name-blog">
                            <label htmlFor="Instructions" className="ms-2 mt-2">
                              Message
                            </label>
                            <input
                              type="text"
                              className="form-control mt-2 px-2 py-4 name-blog ms-2"
                            />
                          </div>

                          <button className="btn-success d-flex rounded mt-2 text-light">
                            Add new
                          </button>

                          <label htmlFor="Instructions" className="ms-2 mt-3">
                            Description
                          </label>
                          <textarea
                            type="text"
                            className="form-control mt-2 px-2 py-4 name-blog ms-2"
                          />

                          <label htmlFor="name" className="mt-3">
                            Image
                          </label>
                          <div
                            className="image-placeholder mt-2 w-75"
                            onClick={() =>
                              document.getElementById("fileInput").click()
                            }
                          >
                            {imageUrl ? (
                              <img
                                alt="Uploaded preview"
                                src={imageUrl}
                                width="100"
                                height="100"
                              />
                            ) : (
                              <img src={Cutting} className="w-75 h-75" />
                            )}
                          </div>
                          <input
                            id="fileInput"
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                          <Link
                            className="text-decoration-none ms-1 avatar"
                            to="#"
                            onClick={() =>
                              document.getElementById("fileInput").click()
                            }
                          >
                            Choose image <br />
                          </Link>
                          <span className="ms-2 me-2 text-decoration-none">
                            or
                          </span>
                          <Link
                            to="#"
                            onClick={handleAddFromUrl}
                            className="text-decoration-none avatar"
                          >
                            Add from URL
                          </Link>
                          <br />

                          <div className="d-flex justify-content-around mt-3 mb-2">
                            <button className="btn btn-light py-4 px-3 d-flex border">
                              Delete
                            </button>
                            <button className="btn btn-success py-4 px-3 d-flex">
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="col-12 col-lg-3 border rounded py-4 mb-3 mb-lg-0 text-start name-widgets">
                Products listing top <br /> sidebar
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className="ms-4 ps-1 bg-light float-end me-2 pe-1 pe-lg-0"
                  style={{
                    cursor: "pointer",
                    transform: rotateState.list
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={listproduct}
                />
                <label htmlFor="" className="custom-widgets">
                  Customize the products listing page with this sidebar widget.
                </label>
                <hr />
                {lists && (
                  <>
                    <div className="border rounded py-2 mt-2 bg-light">
                      <label htmlFor="" className="ms-2">
                        Ecommerce Brands
                      </label>
                      <FontAwesomeIcon
                        icon={faAngleDown}
                        className="float-end me-3 mt-1"
                        style={{
                          cursor: "pointer",
                          transform: rotateState.ecommerce
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                          transition: "transform 0.3s ease",
                        }}
                        onClick={brandedclicked}
                      />
                      <hr />
                      {brands && (
                        <>
                          <label htmlFor="" className="ms-2 ms-2">
                            Choose brands to display
                          </label>
                          <div className="border rounded ms-2 me-3 mt-2 p-2 name-blog">
                            <input
                              type="checkbox"
                              className="form-check-input ms-2 mt-2"
                            />
                            <label htmlFor="" className="mt-1 ms-2">
                              FoodPound
                            </label>
                            <br />
                            <input
                              type="checkbox"
                              className="form-check-input ms-2 mt-2"
                            />
                            <label htmlFor="" className="mt-1 ms-2">
                              iTea JSC
                            </label>
                            <br />

                            <input
                              type="checkbox"
                              className="form-check-input ms-2 mt-2"
                            />
                            <label htmlFor="" className="mt-1 ms-2">
                              Soda Brand
                            </label>
                            <br />

                            <input
                              type="checkbox"
                              className="form-check-input ms-2 mt-2"
                            />
                            <label htmlFor="" className="mt-1 ms-2">
                              Shofy
                            </label>
                            <br />

                            <input
                              type="checkbox"
                              className="form-check-input ms-2 mt-2"
                            />
                            <label htmlFor="" className="mt-1 ms-2 mb-1">
                              Soda Brand
                            </label>
                          </div>

                          <label htmlFor="" className="ms-3 mt-2">
                            Display type
                          </label>
                          <br />
                          <input
                            type="radio"
                            className="form-check-input ms-3 mt-2"
                            name="grid"
                          />
                          <label htmlFor="" className="ms-2 mt-1">
                            Slider
                          </label>

                          <input
                            type="radio"
                            className="form-check-input ms-4 mt-2"
                            name="grid"
                          />
                          <label htmlFor="" className="ms-2 mt-1">
                            Grid
                          </label>

                          <div className="d-flex justify-content-around mt-3">
                            <button className="btn btn-light py-4 px-3 d-flexm border d-flex">
                              Delete
                            </button>
                            <button className="btn btn-success py-4 px-3 d-flex">
                              Save
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row d-flex mt-1 gap-1">
              <div className="col-12 col-lg-3 border rounded py-3 mb-3 mb-lg-0 text-start name-widgets">
                Tags
              </div>

              <div className="col-12 col-lg-3 border rounded py-3 mb-3 mb-lg-0 text-start name-widgets">
                Custom Menu
              </div>

              <div className="col-12 col-lg-3 border rounded py-4 mb-3 mb-lg-0 text-start name-widgets">
                Products listing bottom sidebar
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className="faangle21 bg-light px-2 rounded float-end mt-1"
                  style={{
                    cursor: "pointer",
                    transform: rotateState.bottom
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={sidebarClicked}
                />
                <label htmlFor="" className="custom-widgets">
                  Customize the products listing page with this sidebar widget.
                </label>
                <hr />
                {sidebar1 && (
                  <>
                    <div
                      className="mt-2 py-2 rounded mt-3 bg-light"
                      style={{ border: "1px dotted black", cursor: "pointer" }}
                    >
                      <p className="ms-3 mt-3 text-start">
                        Drag and drop widgets to this area.
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="col-12 col-lg-3 border rounded py-4 mb-3 mb-lg-0 text-start name-widgets">
                Products by category top sidebar
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className="ms-4 ps-1 bg-light float-end me-2 pe-1 pe-lg-0"
                  style={{
                    cursor: "pointer",
                    transform: rotateState.category
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={customproducts1}
                />
                <label htmlFor="" className="custom-widgets">
                  Customize the products by category page with this sidebar
                  widget.
                </label>
                <hr />
                {customProduct1 && (
                  <div
                    className="mt-2 py-2 rounded mt-3 bg-light"
                    style={{ border: "1px dotted black", cursor: "pointer" }}
                  >
                    <p className="ms-3 mt-3 text-start">
                      Drag and drop widgets to this area.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row d-flex mt-1 gap-1">
              <div className="col-12 col-lg-3 border rounded py-3 mb-3 mb-lg-0 text-start name-widgets">
                Ecommerce Brands
              </div>

              <div className="col-12 col-lg-3 border rounded py-3 mb-3 mb-lg-0 text-start name-widgets">
                Newsletters form
              </div>

              <div className="col-12 col-lg-3 border rounded py-4 mb-3 mb-lg-0 text-start name-widgets">
                Products by category <br /> bottom sidebar
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className="faangle21 bg-light px-2 rounded float-end mt-1"
                  style={{
                    cursor: "pointer",
                    transform: rotateState.sidebar
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={bottomCategoryClicked}
                />
                <label htmlFor="" className="custom-widgets">
                  Customize the products by category page with this sidebar
                  widget.
                </label>
                <hr />
                {bottomCategory && (
                  <>
                    <div
                      className="mt-2 py-2 rounded mt-3 bg-light"
                      style={{ border: "1px dotted black", cursor: "pointer" }}
                    >
                      <p className="ms-3 mt-3 text-start">
                        Drag and drop widgets to this area.
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="col-12 col-lg-3 border rounded py-4 mb-3 mb-lg-0 text-start name-widgets">
                Products by brand top sidebar
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className="ms-4 ps-1 bg-light float-end me-2 pe-1 pe-lg-0"
                  style={{
                    cursor: "pointer",
                    transform: rotateState.brand
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={bottomCategoryClicked1}
                />
                <label htmlFor="" className="custom-widgets">
                  Customize the products by brand page with this sidebar widget.
                </label>
                <hr />
                {bottomCategory1 && (
                  <div
                    className="mt-2 py-2 rounded mt-3 bg-light"
                    style={{ border: "1px dotted black", cursor: "pointer" }}
                  >
                    <p className="ms-3 mt-3 text-start">
                      Drag and drop widgets to this area.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row d-flex mt-1 gap-1">
              <div className="col-12 col-lg-3 border rounded py-3 mb-3 mb-lg-0 text-start name-widgets">
                Product Categories
              </div>

              <div className="col-12 col-lg-3 border rounded py-3 mb-3 mb-lg-0 text-start name-widgets">
                Product Detail info
              </div>

              <div className="col-12 col-lg-3 border rounded py-4 mb-3 mb-lg-0 text-start name-widgets">
                Products by brand bottom sidebar
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className="faangle21 bg-light px-2 rounded float-end mt-1"
                  style={{
                    cursor: "pointer",
                    transform: rotateState.products
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={productCusrsorClicked}
                />
                <label htmlFor="" className="custom-widgets">
                  Customize the products by brand page with this sidebar widget.
                </label>
                <hr />
                {productCusrsor && (
                  <>
                    <div
                      className="mt-2 py-2 rounded mt-3 bg-light"
                      style={{ border: "1px dotted black", cursor: "pointer" }}
                    >
                      <p className="ms-3 mt-3 text-start">
                        Drag and drop widgets to this area.
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="col-12 col-lg-3 border rounded py-4 mb-3 mb-lg-0 text-start name-widgets">
                Products by tag top <br /> sidebar
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className="ms-4 ps-1 bg-light float-end me-2 pe-1 pe-lg-0"
                  style={{
                    cursor: "pointer",
                    transform: rotateState.tag
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={productTopClicked}
                />
                <label htmlFor="" className="custom-widgets">
                  Customize the products by tag page with this sidebar widget.
                </label>
                <hr />
                {productTop && (
                  <div
                    className="mt-2 py-2 rounded mt-3 bg-light"
                    style={{ border: "1px dotted black", cursor: "pointer" }}
                  >
                    <p className="ms-3 mt-3 text-start">
                      Drag and drop widgets to this area.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row d-flex mt-1 gap-1">
              <div className="col-12 col-lg-3 border rounded py-3 mb-3 mb-lg-0 text-start name-widgets">
                Site Accepted Payments
              </div>

              <div className="col-12 col-lg-3 border rounded py-3 mb-3 mb-lg-0 text-start name-widgets">
                Site Contact
              </div>

              <div className="col-12 col-lg-3 border rounded py-4 mb-3 mb-lg-0 text-start name-widgets">
                Products by tag bottom sidebar
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className="faangle21 bg-light px-2 rounded float-end mt-1"
                  style={{
                    cursor: "pointer",
                    transform: rotateState.tag1
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={productBottomClicked}
                />
                <label htmlFor="" className="custom-widgets">
                  Customize the products by tag page with this sidebar widget.
                </label>
                <hr />
                {productBottom && (
                  <>
                    <div
                      className="mt-2 py-2 rounded mt-3 bg-light"
                      style={{ border: "1px dotted black", cursor: "pointer" }}
                    >
                      <p className="ms-3 mt-3 text-start">
                        Drag and drop widgets to this area.
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="col-12 col-lg-3 border rounded py-4 mb-3 mb-lg-0 text-start name-widgets">
                Primary sidebar <br />
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className="ms-4 ps-1 bg-light float-end me-2 pe-1 pe-lg-0"
                  style={{
                    cursor: "pointer",
                    transform: rotateState.primary
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                  onClick={productPrimaryCliked}
                />
                <label htmlFor="" className="custom-widgets">
                  Primary sidebar section
                </label>
                <hr />
                {productPrimary && (
                  <div
                    className="mt-2 py-2 rounded mt-3 bg-light"
                    style={{ border: "1px dotted black", cursor: "pointer" }}
                  >
                    <p className="ms-3 mt-3 text-start">
                      Drag and drop widgets to this area.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row d-flex mt-1 gap-1">
              <div className="col-12 col-lg-3 border rounded py-3 mb-3 mb-lg-0 text-start name-widgets">
                Site Copyright
              </div>

              <div className="col-12 col-lg-3 border rounded py-3 mb-3 mb-lg-0 text-start name-widgets">
                Site information
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default Widgets;
