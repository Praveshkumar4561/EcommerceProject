import React, { useEffect, useState, useRef } from "react";
import "./PaymentMethod.css";
import Hamburger from "../../assets/hamburger.svg";
import Logo from "../../assets/Tonic.svg";
import Credit from "../../assets/credit.webp";
import Cutting from "../../assets/Cutting.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faEnvelope,
  faMoon,
  faAngleDown,
  faSave,
  faArrowRight,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Shopping from "../../assets/Shopping.svg";
import { Link } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Helmet } from "react-helmet-async";

function PaymentMethod() {
  let [isVisible, setIsVisible] = useState(false);
  let [blog, setBlog] = useState(false);
  let [ads, setAds] = useState(false);
  let [commerce, setCommerce] = useState(false);
  let [appear, setAppear] = useState(false);
  let [Specification, setSpecifcation] = useState(false);
  let [payment, setPayment] = useState(false);

  let paymentgateway = () => {
    setPayment(!payment);
  };

  let togglespecification = () => {
    setSpecifcation(!Specification);
  };

  let appearence = () => {
    setAppear(!appear);
  };

  let toggleecommerce = () => {
    setCommerce(!commerce);
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

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const resultsRef = useRef(null);
  let [count5, setCount5] = useState(0);

  useEffect(() => {
    let orderdata = async () => {
      let response = await axios.get("http://89.116.170.231:1600/checkoutdata");
      setCount5(response.data.length);
    };
    orderdata();
  }, []);

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

  let [stripe, setStripe] = useState(false);
  let [paypal, setPaypal] = useState(false);
  let [razorPay, setRazorPay] = useState(false);
  let [payStack, setPayStack] = useState(false);
  let [mollie, setMollie] = useState(false);
  let [ssl, setSsl] = useState(false);

  let stripePayment = () => {
    setStripe(!stripe);
  };

  let paypalPayment = () => {
    setPaypal(!paypal);
  };

  let razorpayPayment = () => {
    setRazorPay(!razorPay);
  };

  let paystackPayment = () => {
    setPayStack(!payStack);
  };

  let molliePayment = () => {
    setMollie(!mollie);
  };

  let sslCommerzPayment = () => {
    setSsl(!ssl);
  };

  const [logos, setLogos] = useState({});

  const handleFileChange = (e, method) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogos((prev) => ({
        ...prev,
        [method]: { file, url },
      }));
    }
  };

  const removeLogo = (e, method) => {
    e.stopPropagation();
    setLogos((prev) => ({
      ...prev,
      [method]: { file: null, url: null },
    }));
  };

  const handleAddFromUrl = (method) => {
    toast.info(`Feature to add image from URL for ${method} not implemented.`, {
      position: "bottom-right",
      autoClose: 1000,
    });
  };

  return (
    <>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        />

        <title>Payments methods | RxLYTE</title>

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
        <meta property="og:title" content="Payments methods | RxLYTE" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://srv724100.hstgr.cloud/" />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://srv724100.hstgr.cloud/" />
      </Helmet>

      <div
        className={`container-fluid navbar-back  ${
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
        <div className="sidebar-payment mt-1">
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
                  className={`float-lg-end mt-2 pt-1 me-4 icon-down ${
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
              <Link to="/admin/pages" className="text-light">
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
                  className={`float-lg-end mt-2 pt-1 me-4 icon-down ${
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
                    payment ? "rotate" : ""
                  }`}
                  onClick={paymentgateway}
                />
              </li>
              {payment && (
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
                  className={`float-lg-end mt-2 pt-1 me-4 icon-down ${
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
                  className={`float-lg-end mt-2 pt-1 me-4 icon-down ${
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
                  className={`float-lg-end mt-2 pt-1 me-4 icon-down ${
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
        <ol className="breadcrumb ms-2 d-flex flex-wrap">
          <li className="breadcrumb-item fw-normal">
            <Link to="/admin/welcome">DASHBOARD</Link>
          </li>
          <li className="breadcrumb-item fw-medium text-dark">
            <Link to="/admin/payments/transactions">PAYMENTS</Link>
          </li>
          <li className="breadcrumb-item fw-medium text-dark">
            PAYMENT METHODS
          </li>
        </ol>
      </nav>

      <div className="container-fluid cart-cart">
        <div className="container payment-gateway">
          <div className="row gap-3 d-flex flex-row flex-lg-nowrap flex-wrap mt-lg-4 ms-lg-5 pe-3 pe-lg-0 ps-lg-4 ">
            <div className="col-12 col-sm-12 co-md-12 col-lg-4 border rounded d-flex flex-column lh-lg text-start  mt-2 mt-xl-0 mt-xxl-0">
              <h4 className="mt-3 fw-bold">Payment methods</h4>
              <span className="pb-2">Setup payment methods for website</span>
            </div>

            <div className="col-12 col-sm-12 col-md-12 col-lg-8 d-flex flex-column gap-3 mt-2 mt-lg-0 mt-lg-2 mt-xl-0 mt-xxl-0 payment-gateway1">
              <div className="border rounded p-2 text-start w-100">
                <label htmlFor="" className="mt-1">
                  Default payment method
                </label>
                <div className="border w-100 mt-2 mb-3"></div>
                <select
                  className="form-select mt-2 w-100 cart-cart"
                  style={{ height: "43px" }}
                >
                  <option value="Cash on Delivery(COD)" selected>
                    Cash on Delivery (COD)
                  </option>
                  <option value="Bank transfer">Bank transfer</option>
                  <option value="Stripe">Stripe</option>
                  <option value="Paypal">Paypal</option>
                  <option value="Razorpay">Razorpay</option>
                  <option value="Paystack">Paystack</option>
                  <option value="Mollie">Mollie</option>
                  <option value="SslCommerz">SslCommerz</option>
                </select>
                <div className="d-flex flex-row gap-3 mb-2"></div>
              </div>

              <div className="border-0 rounded p-1">
                <button
                  className="btn btn-success d-flex rounded py-4 cart-cart px-3 
                d-flex flex-row align-items-center"
                >
                  <FontAwesomeIcon icon={faSave} className="me-2" />
                  Save settings
                </button>
              </div>

              <div className="border rounded p-2 d-flex flex-column">
                <div className="d-flex flex-row align-items-center">
                  <div className="vertical-line">
                    <img src={Credit} alt="RxLYTE" />
                  </div>
                  <img
                    src="https://shofy.botble.com/vendor/core/plugins/stripe/images/stripe.svg"
                    alt="Stripe"
                    style={{ width: "8rem" }}
                  />
                  <div className="d-flex flex-column align-items-center text-start ms-2">
                    <Link
                      className="payment-method"
                      to="https://stripe.com/in"
                      target="_blank"
                    >
                      Stripe
                    </Link>
                    <span>
                      Customer can buy product and pay directly using Visa,
                      Credit card via Stripe
                    </span>
                  </div>
                </div>

                <div className="border w-100 border mt-2"></div>

                <div className="d-flex justify-content-between mt-2 align-items-center text-start flex-row">
                  <span>
                    Use Pay online via Stripe (International and Domestic)
                  </span>
                  <button
                    className="btn btn-body border d-flex px-3 py-4 cart-cart"
                    onClick={stripePayment}
                  >
                    Edit
                  </button>
                </div>

                {stripe && (
                  <>
                    <div className="border w-100 border mt-2"></div>
                    <div className="d-flex flex-row flex-wrap text-start flex-lg-nowrap flex-md-nowrap mt-2 justify-content-between">
                      <div className="d-flex flex-column lh-lg stripe-pay">
                        <span className="fw-bold">
                          Configuration instruction for Stripe
                        </span>
                        <label>To use Stripe, you need:</label>
                        <ol>
                          <li>
                            <Link
                              className="payment-method"
                              to="https://dashboard.stripe.com/register"
                              target="_blank"
                            >
                              Register with stripe
                            </Link>
                          </li>
                          <li>
                            After registration at Stripe, you will have Public,
                            Secret keys
                          </li>
                          <li>
                            Enter Public, Secret keys into the box in right hand
                          </li>
                        </ol>
                        <span className="fw-bold">
                          Stripe Webhook Setup Guide
                        </span>
                        <span>
                          Follow these steps to set up a Stripe webhook
                        </span>
                        <ol>
                          <li>
                            <span className="fw-bold">
                              Login to the Stripe Dashboard:
                            </span>{" "}
                            Access the{" "}
                            <Link
                              className="payment-method"
                              to="https://dashboard.stripe.com/login"
                              target="_blank"
                            >
                              Stripe Dashboard
                            </Link>{" "}
                            and click on the "Add Endpoint" button in the
                            "webhooks" section of the "Developers" tab.
                          </li>
                          <li>
                            <span className="fw-bold">
                              Select Event and Configure Endpoint:
                            </span>{" "}
                            Select the "payment_intent succeeded" event and
                            enter the URL in the "Endpoint URL" field.
                          </li>
                          <li>
                            <span className="fw-bold">Add Endpoint:</span> Click
                            the "Add Endpoint" button to save the webhook.
                          </li>
                          <li>
                            <span className="fw-bold">
                              Copy Signing Secret:
                            </span>{" "}
                            Copy the "Signing Secret" value from the "Webhook
                            Details" section and paste it into the "Stripe
                            Webhook Secret" field in the "Stripe" section of the
                            "Payment" tab in the "Settings" page.
                          </li>
                        </ol>
                      </div>

                      <div className="d-flex flex-column lh-lg ms-3">
                        <div>
                          <label className="fw-bold">Method name</label>
                          <input
                            type="text"
                            className="form-control py-4 mt-1"
                          />
                        </div>

                        <div className="mt-2">
                          <label className="fw-bold">Description</label>
                          <textarea
                            className="form-control mt-1"
                            style={{ height: "70px" }}
                          />
                        </div>

                        <div className="mt-2 d-flex flex-column">
                          <label className="fw-bold">Method logo</label>
                          <div
                            className="image-wrapper-payment mt-2 w-50 border rounded position-relative"
                            onClick={() =>
                              document.getElementById("stripeFileInput").click()
                            }
                          >
                            {logos["stripe"]?.url && (
                              <FontAwesomeIcon
                                icon={faXmark}
                                className="remove-icon1"
                                onClick={(e) => removeLogo(e, "stripe")}
                              />
                            )}
                            <img
                              src={logos["stripe"]?.url || Cutting}
                              alt="Method Logo"
                              className="img-fluid uploaded-image1"
                            />
                          </div>

                          <input
                            id="stripeFileInput"
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={(e) => handleFileChange(e, "stripe")}
                          />

                          <div
                            style={{ cursor: "pointer" }}
                            className="payment-method ms-lg-4 ms-0"
                            onClick={() =>
                              document.getElementById("stripeFileInput").click()
                            }
                          >
                            Choose image <br />
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddFromUrl("stripe");
                              }}
                            >
                              or Add from URL
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="border rounded p-3 d-flex flex-column">
                <div className="d-flex flex-row align-items-center">
                  <div className="vertical-line">
                    <img src={Credit} alt="RxLYTE" />
                  </div>
                  <img
                    src="https://shofy.botble.com/vendor/core/plugins/paypal/images/paypal.svg"
                    alt="Paypal"
                    style={{ width: "8rem" }}
                  />
                  <div className="d-flex flex-column align-items-center text-start ms-3">
                    <Link
                      className="payment-method"
                      target="_blank"
                      to="https://www.paypal.com/in/home"
                    >
                      Paypal
                    </Link>
                    <span>
                      Customer can buy product and pay directly via PayPal
                    </span>
                  </div>
                </div>
                <div className="border w-100 border mt-2"></div>
                <div className="d-flex justify-content-between mt-2 align-items-center text-start flex-row">
                  <span>Use Fast and safe online payment via PayPal</span>
                  <button
                    className="btn btn-body border d-flex px-3 py-4 cart-cart"
                    onClick={paypalPayment}
                  >
                    Edit
                  </button>
                </div>
                {paypal && (
                  <>
                    <div className="border w-100 border mt-2"></div>
                    <div className="d-flex flex-row flex-wrap text-start flex-lg-nowrap flex-md-nowrap mt-2 justify-content-between">
                      <div className="d-flex flex-column lh-lg stripe-pay">
                        <span className="fw-bold">
                          Configuration instruction for Paypal
                        </span>
                        <label>To use Paypal, you need:</label>
                        <ol>
                          <li>
                            <Link
                              className="payment-method"
                              to="https://www.paypal.com/bizsignup/"
                              target="_blank"
                            >
                              Register with paypal
                            </Link>
                          </li>
                          <li>
                            After registration at Paypal, you will have Client
                            ID, Client Secret
                          </li>
                          <li>
                            Enter Client ID, Secret into the box in right hand
                          </li>
                        </ol>
                      </div>

                      <div className="d-flex flex-column lh-lg ms-3">
                        <div>
                          <label className="fw-bold">Method name</label>
                          <input
                            type="text"
                            className="form-control py-4 mt-1"
                          />
                        </div>

                        <div className="mt-2">
                          <label className="fw-bold">Description</label>
                          <textarea
                            className="form-control mt-1"
                            style={{ height: "70px" }}
                          />
                        </div>

                        <div className="mt-2 d-flex flex-column">
                          <label className="fw-bold">Method logo</label>
                          <div
                            className="image-wrapper-payment mt-2 w-50 border rounded position-relative"
                            onClick={() =>
                              document.getElementById("paypalFileInput").click()
                            }
                          >
                            {logos["paypal"]?.url && (
                              <FontAwesomeIcon
                                icon={faXmark}
                                className="remove-icon1"
                                onClick={(e) => removeLogo(e, "paypal")}
                              />
                            )}
                            <img
                              src={logos["paypal"]?.url || Cutting}
                              alt="Method Logo"
                              className="img-fluid uploaded-image1"
                            />
                          </div>

                          <input
                            id="paypalFileInput"
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={(e) => handleFileChange(e, "paypal")}
                          />

                          <div
                            style={{ cursor: "pointer" }}
                            className="payment-method ms-lg-4 ms-0"
                            onClick={() =>
                              document.getElementById("paypalFileInput").click()
                            }
                          >
                            Choose image <br />
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddFromUrl("paypal");
                              }}
                            >
                              or Add from URL
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="border rounded p-3 d-flex flex-column">
                <div className="d-flex flex-row align-items-center">
                  <div className="vertical-line">
                    <img src={Credit} alt="RxLYTE" />
                  </div>
                  <img
                    src="https://shofy.botble.com/vendor/core/plugins/razorpay/images/razorpay.svg"
                    alt="Razorpay"
                    style={{ width: "8rem" }}
                  />
                  <div className="d-flex flex-column align-items-center text-start ms-3">
                    <Link
                      className="payment-method"
                      to="https://razorpay.com/"
                      target="_blank"
                    >
                      Razorpay
                    </Link>
                    <span>
                      Customer can buy product and pay directly using Visa,
                      Credit card via Razorpay
                    </span>
                  </div>
                </div>
                <div className="border w-100 border mt-2"></div>
                <div className="d-flex justify-content-between mt-3 align-items-center text-start flex-row w-100">
                  <span>Use Payment with Razorpay</span>
                  <button
                    className="btn btn-body border d-flex px-3 py-4 cart-cart"
                    onClick={razorpayPayment}
                  >
                    Edit
                  </button>
                </div>
                {razorPay && (
                  <>
                    <div className="border w-100 border mt-2"></div>
                    <div className="d-flex flex-row flex-wrap text-start flex-lg-nowrap flex-md-nowrap mt-2 justify-content-between">
                      <div className="d-flex flex-column lh-lg stripe-pay">
                        <span className="fw-bold">
                          Configuration instruction for Razorpay
                        </span>
                        <label>To use Razorpay, you need:</label>
                        <ol>
                          <li>
                            <Link
                              className="payment-method"
                              to="https://razorpay.com/"
                              target="_blank"
                            >
                              Register an account on Razorpay
                            </Link>
                          </li>
                          <li>
                            After registration at Razorpay, you will have Client
                            ID, Client Secret
                          </li>
                          <li>
                            Enter Client ID, Secret into the box in right hand
                          </li>
                          <li>
                            Then you need to create a new webhook. To create a
                            webhook, go to{" "}
                            <span className="fw-bold">Account Settings </span>{" "}
                            <FontAwesomeIcon icon={faArrowRight} />{" "}
                            <span className="fw-bold">API keys </span>
                            <FontAwesomeIcon icon={faArrowRight} />{" "}
                            <span className="fw-bold">Webhooks</span> and paste
                            the below URL to{" "}
                            <span className="fw-bold"> Webhook URL </span>{" "}
                            field. At{" "}
                            <span className="fw-bold">Active Events</span>{" "}
                            field, check to{" "}
                            <span className="fw-bold"> Payment Events </span>{" "}
                            and <span className="fw-bold">Order Events </span>{" "}
                            checkbox.
                          </li>
                        </ol>
                      </div>

                      <div className="d-flex flex-column lh-lg ms-3">
                        <div>
                          <label className="fw-bold">Method name</label>
                          <input
                            type="text"
                            className="form-control py-4 mt-1"
                          />
                        </div>

                        <div className="mt-2">
                          <label className="fw-bold">Description</label>
                          <textarea
                            className="form-control mt-1"
                            style={{ height: "70px" }}
                          />
                        </div>

                        <div className="mt-2 d-flex flex-column">
                          <label className="fw-bold">Method logo</label>
                          <div
                            className="image-wrapper-payment mt-2 w-50 border rounded position-relative"
                            onClick={() =>
                              document
                                .getElementById("razorpayFileInput")
                                .click()
                            }
                          >
                            {logos["razorpay"]?.url && (
                              <FontAwesomeIcon
                                icon={faXmark}
                                className="remove-icon1"
                                onClick={(e) => removeLogo(e, "razorpay")}
                              />
                            )}
                            <img
                              src={logos["razorpay"]?.url || Cutting}
                              alt="Method Logo"
                              className="img-fluid uploaded-image1"
                            />
                          </div>

                          <input
                            id="razorpayFileInput"
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={(e) => handleFileChange(e, "razorpay")}
                          />

                          <div
                            style={{ cursor: "pointer" }}
                            className="payment-method ms-lg-4 ms-0"
                            onClick={() =>
                              document
                                .getElementById("razorpayFileInput")
                                .click()
                            }
                          >
                            Choose image <br />
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddFromUrl("razorpay");
                              }}
                            >
                              or Add from URL
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="border rounded p-3 d-flex flex-column">
                <div className="d-flex flex-row align-items-center">
                  <div className="vertical-line">
                    <img src={Credit} alt="RxLYTE" />
                  </div>
                  <img
                    src="https://shofy.botble.com/vendor/core/plugins/paystack/images/paystack.png"
                    alt="Paystack"
                    style={{ width: "8rem" }}
                  />
                  <div className="d-flex flex-column align-items-center text-start ms-3">
                    <Link
                      className="payment-method"
                      to="https://paystack.com/"
                      target="_blank"
                    >
                      Paystack
                    </Link>
                    <span>
                      Customer can buy product and pay directly using Visa,
                      Credit card via Paystack
                    </span>
                  </div>
                </div>
                <div className="border w-100 border mt-2"></div>
                <div className="d-flex justify-content-between mt-3 align-items-center text-start flex-row w-100">
                  <span>Use Payment with Paystack</span>
                  <button
                    className="btn btn-body border d-flex px-3 py-4 cart-cart"
                    onClick={paystackPayment}
                  >
                    Edit
                  </button>
                </div>

                {payStack && (
                  <>
                    <div className="border w-100 border mt-2"></div>
                    <div className="d-flex flex-row flex-wrap text-start flex-lg-nowrap flex-md-nowrap mt-2 justify-content-between">
                      <div className="d-flex flex-column lh-lg stripe-pay">
                        <span className="fw-bold">
                          Configuration instruction for Paystack
                        </span>
                        <label>To use Paystack, you need:</label>
                        <ol>
                          <li>
                            <Link
                              className="payment-method"
                              to="https://paystack.com/"
                              target="_blank"
                            >
                              Register an account on Paystack
                            </Link>
                          </li>
                          <li>
                            After registration at Paystack, you will have Public
                            &amp; Secret keys
                          </li>
                          <li>
                            Enter Public, Secret into the box in right hand
                          </li>
                        </ol>
                      </div>

                      <div className="d-flex flex-column lh-lg ms-3">
                        <div>
                          <label className="fw-bold">Method name</label>
                          <input
                            type="text"
                            className="form-control py-4 mt-1"
                          />
                        </div>
                        <div className="mt-2">
                          <label className="fw-bold">Description</label>
                          <textarea
                            className="form-control mt-1"
                            style={{ height: "70px" }}
                          />
                        </div>
                        <div className="mt-2 d-flex flex-column">
                          <label className="fw-bold">Method logo</label>
                          <div
                            className="image-wrapper-payment mt-2 w-50 border rounded position-relative"
                            onClick={() =>
                              document
                                .getElementById("paystackFileInput")
                                .click()
                            }
                          >
                            {logos["paystack"]?.url && (
                              <FontAwesomeIcon
                                icon={faXmark}
                                className="remove-icon1"
                                onClick={(e) => removeLogo(e, "paystack")}
                              />
                            )}
                            <img
                              src={logos["paystack"]?.url || Cutting}
                              alt="Method Logo"
                              className="img-fluid uploaded-image1"
                            />
                          </div>

                          <input
                            id="paystackFileInput"
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={(e) => handleFileChange(e, "paystack")}
                          />

                          <div
                            style={{ cursor: "pointer" }}
                            className="payment-method ms-lg-4 ms-0"
                            onClick={() =>
                              document
                                .getElementById("paystackFileInput")
                                .click()
                            }
                          >
                            Choose image <br />
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddFromUrl("paystack");
                              }}
                            >
                              or Add from URL
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="border rounded p-3 d-flex flex-column">
                <div className="d-flex flex-row align-items-center">
                  <div className="vertical-line">
                    <img src={Credit} alt="RxLYTE" />
                  </div>
                  <img
                    src="https://shofy.botble.com/vendor/core/plugins/mollie/images/mollie.png"
                    alt="Mollie"
                    style={{ width: "8rem" }}
                  />
                  <div className="d-flex flex-column align-items-center text-start ms-3">
                    <Link
                      className="payment-method"
                      to="https://www.mollie.com/"
                      target="_blank"
                    >
                      Mollie
                    </Link>
                    <span>
                      Customer can buy product and pay directly using Visa,
                      Credit card via Mollie
                    </span>
                  </div>
                </div>
                <div className="border w-100 border mt-2"></div>
                <div className="d-flex justify-content-between mt-3 align-items-center text-start flex-row w-100">
                  <span>Use Payment with Mollie</span>
                  <button
                    className="btn btn-body border d-flex px-3 py-4 cart-cart"
                    onClick={molliePayment}
                  >
                    Edit
                  </button>
                </div>

                {mollie && (
                  <>
                    <div className="border w-100 border mt-2"></div>
                    <div className="d-flex flex-row flex-wrap text-start flex-lg-nowrap flex-md-nowrap mt-2 justify-content-between">
                      <div className="d-flex flex-column lh-lg stripe-pay">
                        <span className="fw-bold">
                          Configuration instruction for Mollie
                        </span>
                        <label>To use Mollie, you need:</label>
                        <ol>
                          <li>
                            <Link
                              className="payment-method"
                              to="https://my.mollie.com/dashboard/signup"
                              target="_blank"
                            >
                              Register an account on Mollie
                            </Link>
                          </li>
                          <li>
                            After registration at Mollie, you will have an API
                            key
                          </li>
                          <li>Enter API key into the box in right hand</li>
                        </ol>
                      </div>

                      <div className="d-flex flex-column lh-lg ms-3">
                        <div>
                          <label className="fw-bold">Method name</label>
                          <input
                            type="text"
                            className="form-control py-4 mt-1"
                          />
                        </div>

                        <div className="mt-2">
                          <label className="fw-bold">Description</label>
                          <textarea
                            className="form-control mt-1"
                            style={{ height: "70px" }}
                          />
                        </div>

                        <div className="mt-2 d-flex flex-column">
                          <label className="fw-bold">Method logo</label>
                          <div
                            className="image-wrapper-payment mt-2 w-50 border rounded position-relative"
                            onClick={() =>
                              document.getElementById("mollieFileInput").click()
                            }
                          >
                            {logos["mollie"]?.url && (
                              <FontAwesomeIcon
                                icon={faXmark}
                                className="remove-icon1"
                                onClick={(e) => removeLogo(e, "mollie")}
                              />
                            )}
                            <img
                              src={logos["mollie"]?.url || Cutting}
                              alt="Method Logo"
                              className="img-fluid uploaded-image1"
                            />
                          </div>

                          <input
                            id="mollieFileInput"
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={(e) => handleFileChange(e, "mollie")}
                          />

                          <div
                            style={{ cursor: "pointer" }}
                            className="payment-method ms-lg-4 ms-0"
                            onClick={() =>
                              document.getElementById("mollieFileInput").click()
                            }
                          >
                            Choose image <br />
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddFromUrl("mollie");
                              }}
                            >
                              or Add from URL
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="border rounded p-3 d-flex flex-column">
                <div className="d-flex flex-row align-items-center">
                  <div className="vertical-line">
                    <img src={Credit} alt="RxLYTE" />
                  </div>
                  <img
                    src="https://shofy.botble.com/vendor/core/plugins/sslcommerz/images/sslcommerz.png"
                    alt="SslCommerz"
                    style={{ width: "8rem" }}
                  />
                  <div className="d-flex flex-column align-items-center text-start ms-3">
                    <Link
                      className="payment-method"
                      to="https://sslcommerz.com/"
                      target="_blank"
                    >
                      SslCommerz
                    </Link>
                    <span>
                      Customer can buy product and pay directly using Visa,
                      Credit card via SslCommerz
                    </span>
                  </div>
                </div>
                <div className="border w-100 border mt-2"></div>
                <div className="d-flex justify-content-between mt-3 align-items-center text-start flex-row w-100">
                  <span>Use Payment with SSLCommerz</span>
                  <button
                    className="btn btn-body border d-flex px-3 py-4 cart-cart"
                    onClick={sslCommerzPayment}
                  >
                    Edit
                  </button>
                </div>

                {ssl && (
                  <>
                    <div className="border w-100 border mt-2"></div>
                    <div className="d-flex flex-row flex-wrap text-start flex-lg-nowrap flex-md-nowrap mt-2 justify-content-between">
                      <div className="d-flex flex-column lh-lg stripe-pay">
                        <span className="fw-bold">
                          Configuration instruction for SslCommerz
                        </span>
                        <label>To use SslCommerz, you need:</label>
                        <ol>
                          <li className="d-fle">
                            For registration in Sandbox, click the link <br />
                            <Link
                              className="payment-method"
                              to="https://developer.sslcommerz.com/registration/"
                              target="_blank"
                            >
                              https://developer.sslcommerz.com{" "}
                            </Link>
                            <span>
                              For registration in Production, click the link{" "}
                            </span>
                            <Link
                              className="payment-method"
                              to="https://signup.sslcommerz.com/register"
                              target="_blank"
                            >
                              https://signup.sslcommerz.com/register
                            </Link>
                          </li>
                          <li>
                            After registration at SslCommerz, you will have
                            Store ID and Store Password (API/Secret key)
                          </li>
                          <li>
                            Enter Store ID and Store Password (API/Secret key)
                            into the box in right hand
                          </li>
                        </ol>
                      </div>

                      <div className="mt-2 d-flex flex-column">
                        <div>
                          <label className="fw-bold">Method name</label>
                          <input
                            type="text"
                            className="form-control py-4 mt-1"
                          />
                        </div>

                        <div className="mt-2">
                          <label className="fw-bold">Description</label>
                          <textarea
                            className="form-control mt-1 py-"
                            style={{ height: "70px" }}
                          />
                        </div>

                        <div className="mt-3">
                          <label className="fw-bold">Method logo</label>
                          <div
                            className="image-wrapper-payment mt-2 w-50 border rounded position-relative"
                            onClick={() =>
                              document.getElementById("sslFileInput").click()
                            }
                          >
                            {logos["ssl"]?.url && (
                              <FontAwesomeIcon
                                icon={faXmark}
                                className="remove-icon1"
                                onClick={(e) => removeLogo(e, "ssl")}
                              />
                            )}
                            <img
                              src={logos["ssl"]?.url || Cutting}
                              alt="Method Logo"
                              className="img-fluid uploaded-image1"
                            />
                          </div>

                          <input
                            id="sslFileInput"
                            type="file"
                            name="file"
                            style={{ display: "none" }}
                            onChange={(e) => handleFileChange(e, "ssl")}
                          />

                          <div
                            style={{ cursor: "pointer" }}
                            className="payment-method ms-lg-4 ms-0"
                            onClick={() =>
                              document.getElementById("sslFileInput").click()
                            }
                          >
                            Choose image <br />
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddFromUrl("ssl");
                              }}
                            >
                              or Add from URL
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="border rounded p-3 d-flex flex-column">
                <div className="d-flex flex-row align-items-center">
                  <div className="vertical-line">
                    <img src={Credit} alt="RxLYTE" />
                  </div>
                  <span>Payment methods</span>
                  <div className="d-flex flex-column align-items-center text-start ms-3">
                    <span>
                      Guide customers to pay directly. You can choose to pay by
                      delivery or bank transfer
                    </span>
                  </div>
                </div>

                <div className="border w-100 border mt-2"></div>
                <div className="d-flex justify-content-between mt-3 align-items-center text-start flex-row w-100">
                  <span>Use Cash on delivery (COD)</span>
                  <button className="btn btn-body border d-flex px-3 py-4 cart-cart">
                    Edit
                  </button>
                </div>

                <div className="border w-100 border mt-2"></div>
                <div className="d-flex justify-content-between mt-2 align-items-center text-start flex-row w-100">
                  <span>Use Bank transfer</span>
                  <button className="btn btn-body border d-flex px-3 py-4 cart-cart">
                    Edit
                  </button>
                </div>
              </div>
            </div>
            <div></div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default PaymentMethod;
