import React, { useEffect, useRef, useState } from "react";
import "./Welcome.css";
import Hamburger from "../../assets/hamburger.svg";
import Logo from "../../assets/Logo.png";
import {
  faAngleDown,
  faBell,
  faMoon,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Shopping from "../../assets/Shopping.svg";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Welcome() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const resultsRef = useRef(null);
  const navigate = useNavigate();

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

  let [isVisible, setIsVisible] = useState(false);
  let [blog, setBlog] = useState(false);
  let [ads, setAds] = useState(false);
  let [appear, setAppear] = useState(false);
  let [commerce, setCommerce] = useState(false);
  let [days, setDays] = useState(false);
  let [days1, setDays1] = useState(false);
  let [referrar, setReferrar] = useState(false);
  let [Specification, setSpecifcation] = useState(false);
  let [payment, setPayment] = useState(false);

  let paymentgateway = () => {
    setPayment(!payment);
  };

  let togglespecification = () => {
    setSpecifcation(!Specification);
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

  let daysClicked = () => {
    setDays(!days);
  };

  let daysClicked1 = () => {
    setDays1(!days1);
  };

  let referrarClicked = () => {
    setReferrar(!referrar);
  };

  useEffect(() => {
    alldata();
  }, []);

  let [count1, setCount1] = useState("");

  let alldata = async () => {
    let response = await axios.get("http://localhost:1600/alldata");
    setCount1(response.data.length);
  };

  let [count2, setCount2] = useState(0);

  let showdata = async () => {
    let response = await axios.get("http://localhost:1600/productpagedata");
    setCount2(response.data.length);
  };
  showdata();

  let [count4, setCount4] = useState(0);

  let reviews = async () => {
    let response = await axios.get("http://localhost:1600/reviewdata");
    setCount4(response.data.length);
  };
  reviews();

  let [count5, setCount5] = useState(0);

  let orderdata = async () => {
    let response = await axios.get("http://localhost:1600/checkoutdata");
    setCount5(response.data.length);
  };
  orderdata();

  const [displayedCount, setDisplayedCount] = useState(0);

  useEffect(() => {
    if (count5 !== displayedCount) {
      setDisplayedCount(count5);
    }
  }, [count5, displayedCount]);

  return (
    <>
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
              className="hamburger-back pt-2 pe-1 "
              onClick={toggleNavbar}
            />
            <img src={Logo} alt="Logo" className="hamburger1 ms-3 mt-2 pt-1" />
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
              to="http://localhost:5173/"
              target="_blank"
            >
              <svg
                class="icon icon-left svg-icon-ti-ti-world me-1 mt- text-lig"
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
              <span className="text-light ps-1 fs-6">View website</span>
            </Link>
          </div>

          <FontAwesomeIcon
            icon={faMoon}
            className="text-light fs-4 me-2 search-box"
            style={{ cursor: "pointer" }}
          />

          <FontAwesomeIcon
            icon={faBell}
            className="text-light fs-4 me-2 search-box"
            style={{ cursor: "pointer" }}
          />

          <FontAwesomeIcon
            icon={faEnvelope}
            className="text-light fs-4 search-box"
            style={{ cursor: "pointer" }}
          />
          <div className="d-flex flex-column ms-1">
            <span className="text-light count-value1 d-lg-block d-none">
              {count5}
            </span>
            <img
              src={Shopping}
              alt="Shopping"
              className="search-box search-box1"
            />
          </div>
        </div>
      </div>

      <div
        className={`sidebar-container ${
          isNavbarExpanded && isMobile ? "expanded" : ""
        }`}
      >
        <div className="sidebar-back4">
          <ul className="list-unstyled d-flex flex-column text-white ms-4">
            <li>
              <Link to="/admin/welcome" className="text-light">
                <svg
                  class="icon svg-icon-ti-ti-home me-2 mb-1"
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
                  class="icon  svg-icon-ti-ti-shopping-bag me-2 mb-1"
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
                        class="icon  svg-icon-ti-ti-report-analytics me-2"
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
                        class="icon  svg-icon-ti-ti-truck-delivery me-2"
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
                        class="icon  svg-icon-ti-ti-basket-cancel me-2"
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
                        class="icon  svg-icon-ti-ti-basket-down me-2"
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
                        class="icon  svg-icon-ti-ti-truck-loading me-2"
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
                        class="icon  svg-icon-ti-ti-file-invoice me-2"
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
                        class="icon  svg-icon-ti-ti-package me-2"
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
                        class="icon  svg-icon-ti-ti-currency-dollar me-2"
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
                        class="icon  svg-icon-ti-ti-home-check me-2"
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
                        class="icon  svg-icon-ti-ti-archive me-2"
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
                        class="icon  svg-icon-ti-ti-tag me-2"
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
                        class="icon  svg-icon-ti-ti-album me-2"
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
                        class="icon  svg-icon-ti-ti-database me-2"
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
                        class="icon  svg-icon-ti-ti-album me-2"
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
                        class="icon  svg-icon-ti-ti-tags me-2"
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
                        class="icon  svg-icon-ti-ti-registered me-2"
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
                        class="icon  svg-icon-ti-ti-star me-2"
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
                        class="icon  svg-icon-ti-ti-bolt me-2"
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
                        class="icon  svg-icon-ti-ti-discount me-2"
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
                        class="icon  svg-icon-ti-ti-users me-2"
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
                  class="icon  svg-icon-ti-ti-table-options ms-0 me-1"
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
                        class="icon  svg-icon-ti-ti-point me-2"
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
                        class="icon  svg-icon-ti-ti-point me-1"
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
                        class="icon  svg-icon-ti-ti-point me-2"
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

            <Link to="/admin/pages" className="text-light text-decoration-none">
              <li>
                <svg
                  class="icon svg-icon-ti-ti-notebook me-2 mb-1"
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
              </li>
            </Link>

            <div>
              <li onClick={toggleblog} style={{ cursor: "pointer" }}>
                <svg
                  class="icon  svg-icon-ti-ti-article me-2 mb-1"
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
                        class="icon  svg-icon-ti-ti-file-text me-2"
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
                        class="icon  svg-icon-ti-ti-folder me-2"
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
                        class="icon  svg-icon-ti-ti-tag me-2"
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
                  class="icon svg-icon-ti-ti-credit-card me-2 mb-1"
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
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
                  class="icon svg-icon-ti-ti-camera me-2 mb-1"
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
                  class="icon svg-icon-ti-ti-user-star me-2 mb-1"
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
                  class="icon  svg-icon-ti-ti-ad-circle me-2 mb-1"
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
                        class="icon  svg-icon-ti-ti-point me-2"
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
                    to="/admin/ads"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-point me-2"
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
                  class="icon svg-icon-ti-ti-speakerphone me-2 mb-1"
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
                  class="icon svg-icon-ti-ti-mail me-2 mb-1"
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
                  class="icon svg-icon-ti-ti-slideshow me-2 mb-1"
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
                        class="icon  svg-icon-ti-ti-list-check me-2"
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
                        class="icon  svg-icon-ti-ti-folder me-2"
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
                  class="icon svg-icon-ti-ti-mail me-2 mb-1"
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
                class="icon svg-icon-ti-ti-world me-2 mb-1"
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
                class="icon svg-icon-ti-ti-folder me-2 mb-1"
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
                  class="icon svg-icon-ti-ti-brush me-2 mb-1"
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
                  className={`float-end mt-2 pt-2 me-4 icon-down ${
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
                        class="icon  svg-icon-ti-ti-palette me-2"
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
                        class="icon  svg-icon-ti-ti-tournament me-2"
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
                        class="icon  svg-icon-ti-ti-layout me-2"
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
                        class="icon  svg-icon-ti-ti-list-tree me-2"
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
                        class="icon  svg-icon-ti-ti-file-type-css me-2"
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
                        class="icon  svg-icon-ti-ti-file-type-js me-2"
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
                        class="icon  svg-icon-ti-ti-file-type-html me-2"
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
                        class="icon  svg-icon-ti-ti-file-type-txt me-2"
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
                class="icon svg-icon-ti-ti-plug me-2 mb-1"
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
                class="icon svg-icon-ti-ti-tool me-2 mb-1"
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
                  class="icon svg-icon-ti-ti-settings me-2 mb-1"
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
                  class="icon svg-icon-ti-ti-user-shield me-2 mb-1"
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

      <div class="content-home d-flex justify-content-center mt-1">
        <div class="mt-4 ms-lg-2">
          <div class="d-flex flex-row justify-content-between align-items-center mb-3">
            <h4 className="ms-sm-1">DASHBOARD</h4>

            <button className="btn d-flex py-4 border button-widget1 mt-2 me-sm-3 me-3 me-md-3 me-lg-3 me-xl-0 me-xxl-2 mt-lg-0">
              <svg
                className="icon me-2 button-widget21"
                style={{ color: "#4299e1" }}
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
                <path d="M5 4h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1"></path>
                <path d="M5 16h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1"></path>
                <path d="M15 12h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1"></path>
                <path d="M15 4h4a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1"></path>
              </svg>
              Manage Widgets
            </button>
          </div>

          <div
            className="alert alert-primary guest-alert bg-transparent border guest-demo info-box1"
            role="alert"
          >
            <svg
              className="icon guest-alert1 me-1"
              style={{ color: "#4299e1" }}
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
              <path d="M12 8v4"></path>
              <path d="M12 16h.01"></path>
            </svg>
            Hi guest, if you see demo site is destroyed, please help me go here
            and restore demo site to the latest revision! Thank you so much!
          </div>

          <div className="row d-flex flex-row flex-md-wrap me-md-1 me-xl-0">
            <div className="col-md-3 guest-alert2">
              <Link
                to="/admin/ecommerce/orders"
                className="text-decoration-none"
              >
                <div className="info-box orders d-flex flex-column align-items-start py-4 rounded">
                  <p className="letter-space1">Orders</p>
                  <h2
                    className="mt-4 fw-bold letter-space"
                    style={{ fontFamily: "verdana" }}
                  >
                    <div className="number-scroll">
                      <span>{`0${displayedCount}`}</span>
                    </div>
                  </h2>
                </div>
              </Link>
            </div>

            <div className="col-md-3 guest-alert2">
              <Link
                to="/admin/ecommerce/products"
                className="text-decoration-none"
              >
                <div className="info-box products d-flex flex-column align-items-start py-4 rounded">
                  <p className="letter-space1">Products</p>
                  <h2
                    className="mt-4 fw-bold letter-space"
                    style={{ fontFamily: "verdana" }}
                  >
                    {count2}
                  </h2>
                </div>
              </Link>
            </div>

            <div className="col-md-3 guest-alert2">
              <Link to="/admin/customers" className="text-decoration-none">
                <div className="info-box customers d-flex flex-column align-items-start py-4 rounded">
                  <p className="letter-space1">Customers</p>
                  <h2
                    className="mt-4 fw-bold letter-space"
                    style={{ fontFamily: "verdana" }}
                  >
                    0{count1}
                  </h2>
                </div>
              </Link>
            </div>

            <div className="col-md-3 guest-alert2">
              <Link
                to="/admin/ecommerce/reviews"
                className="text-decoration-none"
              >
                <div className="info-box reviews d-flex flex-column align-items-start py-4 rounded">
                  <p className="letter-space1">Reviews</p>
                  <h2
                    className="mt-4 fw-bold"
                    style={{ fontFamily: "verdana" }}
                  >
                    {count4}
                  </h2>
                </div>
              </Link>
            </div>
          </div>

          <div className="analytics-box border rounded">
            <h5>Site Analytics</h5>
            <hr />
            <div className="chart rounded"></div>
            <div className="stats d-flex gap-1 flex-wrap session-para1">
              <div className="stat border mt-3 d-flex flex-row justify-content-start session-para1 align-items-start">
                <i class="fas fa-eye bg-success px-2 py-2 rounded text-light mt-2"></i>
                <div>
                  <p className="sessional ms-2">Sessions</p>
                  <h4 className="sessional1 ms-2">201</h4>
                </div>
              </div>

              <div className="stat border mt-3 d-flex justify-content-start w- align-items-start flex-row ">
                <i class="fas fa-user bg-info px-2 py-2 rounded text-light mt-2"></i>
                <div>
                  <p className="sessional ms-2">Visitors</p>
                  <h4 className="sessional1 ms-2">183</h4>
                </div>
              </div>
              <div className="stat border mt-3 d-flex flex-row justify-content-start w- align-items-start">
                <i class="fas fa-file-alt bg-primary px-2 py-2 rounded text-light mt-2"></i>
                <div>
                  <p className="sessional ms-2 ms-lg-0">Pageviews</p>
                  <h4 className="sessional1 ms-2">699</h4>
                </div>
              </div>
              <div className="stat border mt-3 d-flex flex-row justify-content-start w- align-items-start">
                <i class="fas fa-bolt bg-warning px-2 py-2 rounded text-light mt-2"></i>
                <div>
                  <p className="sessional ms-2">Bounce Rate</p>
                  <h4 className="sessional1 ms-2">56%</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div class="content-welcome">
        <div class="row mt-0 content-most">
          <div class="col-md-6 ms-0 ms-lg-4">
            <div class="card ms-lg-5 mt-0">
              <div class="card-header d-flex justify-content-between align-items-center flex-row w-100">
                <span className="fw-light">Top Most Visit Pages</span>
                <div style={{ position: "relative" }}>
                  <span
                    className="fw-light"
                    style={{
                      cursor: "pointer",
                      zIndex: "1000",
                      position: "relative",
                    }}
                    onClick={daysClicked}
                  >
                    Today <FontAwesomeIcon icon={faAngleDown} />
                  </span>
                  {days && (
                    <div
                      className="border bg-light rounded list-unstyled px-4 mt-4 mt-lg-2"
                      style={{
                        position: "absolute",
                        left: "-1rem",
                        zIndex: 100,
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                    >
                      <li className="fw-light">Today</li>
                      <li className="fw-light">Yesterday</li>
                      <li className="fw-light">This week</li>
                      <li className="fw-light">Last 7 Days</li>
                      <li className="fw-light">This Month</li>
                      <li className="fw-light">Last 30 Days</li>
                      <li className="fw-light">This Year</li>
                    </div>
                  )}
                </div>
              </div>

              <div class="card-body p-0">
                <table class="table mb-0 table-striped">
                  <thead>
                    <tr>
                      <th className="fw-light">#</th>
                      <th className="fw-light">URL</th>
                      <th className="fw-light">VIEWS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>
                        <Link to="#">
                          Shofy - Multipurpose eCommerce Laravel Script
                        </Link>
                      </td>
                      <td>53</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>
                        <Link to="#">MartFury - Laravel Ecommerce system</Link>
                      </td>
                      <td>31</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>
                        <Link to="#">
                          Showcasing Creative Designs and Innovative Projects
                        </Link>
                      </td>
                      <td>29</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>
                        <Link to="#">Web & App developer</Link>
                      </td>
                      <td>24</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>
                        <Link to="#">Ninico - Minimal eCommerce</Link>
                      </td>
                      <td>17</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>
                        <Link to="#">
                          Nest - Laravel Multipurpose eCommerce Script
                        </Link>
                      </td>
                      <td>16</td>
                    </tr>
                    <tr>
                      <td>7</td>
                      <td>
                        <Link to="#">Farmart - Laravel Ecommerce system</Link>
                      </td>
                      <td>15</td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td>
                        <Link to="#">Gerow - Business Consulting</Link>
                      </td>
                      <td>15</td>
                    </tr>
                    <tr>
                      <td>9</td>
                      <td>
                        <Link to="#">Login</Link>
                      </td>
                      <td>15</td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>
                        <Link to="#">Homzen</Link>
                      </td>
                      <td>12</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="col-md-6 content-welcome1 content-browser1">
            <div class="card mt-0 browser-align">
              <div class="card-header d-flex justify-content-between align-items-center flex-row">
                <span className="fw-light">Top Browsers</span>
                <div style={{ position: "relative" }}>
                  <span
                    className="fw-light"
                    style={{ cursor: "pointer" }}
                    onClick={daysClicked1}
                  >
                    Today <FontAwesomeIcon icon={faAngleDown} />
                  </span>
                  {days1 && (
                    <div
                      className="border bg-light rounded list-unstyled px-4 mt-4 mt-lg-2"
                      style={{
                        position: "absolute",
                        left: "-1rem",
                        zIndex: 100,
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                    >
                      <li className="fw-light">Today</li>
                      <li className="fw-light">Yesterday</li>
                      <li className="fw-light">This week</li>
                      <li className="fw-light">Last 7 Days</li>
                      <li className="fw-light">This Month</li>
                      <li className="fw-light">Last 30 Days</li>
                      <li className="fw-light">This Year</li>
                    </div>
                  )}
                </div>
              </div>

              <div class="card-body p-0">
                <table class="table mb-0 table-striped">
                  <thead>
                    <tr>
                      <th className="fw-light">#</th>
                      <th className="fw-light">BROWSER</th>
                      <th className="fw-light text-end">SESSIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Chrome</td>
                      <td className="text-center ps-5">155</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Safari</td>
                      <td className="text-center ps-5">20</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Edge</td>
                      <td className="text-center ps-5">10</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Firefox</td>
                      <td className="text-center ps-5">10</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>Opera</td>
                      <td className="text-center ps-5">4</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>Android Webview</td>
                      <td className="text-center ps-5">3</td>
                    </tr>
                    <tr>
                      <td>7</td>
                      <td>Samsung Internet</td>
                      <td className="text-center ps-5">6</td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td>Samsung Internet</td>
                      <td className="text-center ps-5">4</td>
                    </tr>
                    <tr>
                      <td>9</td>
                      <td>Samsung Internet</td>
                      <td className="text-center ps-5">7</td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>Samsung Internet</td>
                      <td className="text-center ps-5">13</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-welcome">
        <div class="row mt-0 mt-lg-3 content-top">
          <div class="col-md-6 ms-lg-4">
            <div class="card ms-lg-5 mt-0 referrar-header">
              <div class="card-header d-flex justify-content-between align-items-center flex-row">
                <span className="fw-light">Top Referrers</span>
                <div style={{ position: "relative" }}>
                  <span
                    className="fw-light"
                    style={{
                      cursor: "pointer",
                      zIndex: "1000",
                      position: "relative",
                    }}
                    onClick={referrarClicked}
                  >
                    Today <FontAwesomeIcon icon={faAngleDown} />
                  </span>
                  {referrar && (
                    <div
                      className="border bg-light rounded list-unstyled px-4 mt-4 mt-lg-2"
                      style={{
                        position: "absolute",
                        left: "-1rem",
                        zIndex: 100,
                        whiteSpace: "nowrap",
                        cursor: "pointer",
                      }}
                    >
                      <li className="fw-light">Today</li>
                      <li className="fw-light">Yesterday</li>
                      <li className="fw-light">This week</li>
                      <li className="fw-light">Last 7 Days</li>
                      <li className="fw-light">This Month</li>
                      <li className="fw-light">Last 30 Days</li>
                      <li className="fw-light">This Year</li>
                    </div>
                  )}
                </div>
              </div>

              <div class="card-body p-0">
                <table class="table mb-0 table-striped">
                  <thead>
                    <tr>
                      <th className="fw-light">#</th>
                      <th className="fw-light">URL</th>
                      <th className="fw-light text-center">VIEWS</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>(not set)</td>
                      <td className="text-center">53</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>(direct)</td>
                      <td className="text-center">31</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>codecanyon.net</td>
                      <td className="text-center">29</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>google</td>
                      <td className="text-center">24</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>youtube.com</td>
                      <td className="text-center">17</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>shofy.polluxhost.com</td>
                      <td className="text-center">16</td>
                    </tr>
                    <tr>
                      <td>7</td>
                      <td>cracked.io</td>
                      <td className="text-center">15</td>
                    </tr>
                    <tr>
                      <td>8</td>
                      <td>freescriptat.com</td>
                      <td className="text-center">15</td>
                    </tr>
                    <tr>
                      <td>9</td>
                      <td>m.facebook.com</td>
                      <td className="text-center">15</td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>github.com</td>
                      <td className="text-center">4</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="col-md-6 content-welcome1 content-browser1">
            <div class="card mt-0 content-post">
              <div class="card-header d-flex justify-content-between align-items-start">
                <span className="fw-light">Recent Posts</span>
                <div style={{ position: "relative" }}></div>
              </div>

              <div class="card-body p-0">
                <table class="table mb-0 table-striped">
                  <thead>
                    <tr>
                      <th className="fw-light">#</th>
                      <th className="fw-light">Name</th>
                      <th className="fw-light" style={{ whiteSpace: "nowrap" }}>
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>
                        <Link to="#">
                          4 Expert Tips On How To Choose The Right Men’s Wallet
                        </Link>
                      </td>
                      <td>27-09-2024</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>
                        <Link to="#">
                          Sexy Clutches: How to Buy & Wear a Designer Clutch Bag
                        </Link>
                      </td>
                      <td>27-09-2024</td>
                    </tr>

                    <tr>
                      <td>3</td>
                      <td>
                        <Link to="#">The Top 2020 Handbag Trends to Know</Link>
                      </td>
                      <td>27-09-2024</td>
                    </tr>

                    <tr>
                      <td>4</td>
                      <td>
                        <Link to="#">
                          How to Match the Color of Your Handbag With an Outfit
                        </Link>
                      </td>
                      <td>27-09-2024</td>
                    </tr>

                    <tr>
                      <td>5</td>
                      <td>
                        <Link to="#">How to Care for Leather Bags</Link>
                      </td>
                      <td>27-09-2024</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>
                        <Link to="#">
                          We're Crushing Hard on Summer's 10 Biggest Bag Trends
                        </Link>
                      </td>
                      <td>27-09-2024</td>
                    </tr>
                    <tr>
                      <td>7</td>
                      <td>
                        <Link to="#">
                          Essential Qualities of Highly Successful Music
                        </Link>
                      </td>
                      <td>27-09-2024</td>
                    </tr>

                    <tr>
                      <td>8</td>
                      <td>
                        <Link to="#">
                          9 Things I Love About Shaving My Head
                        </Link>
                      </td>
                      <td>27-09-2024</td>
                    </tr>
                    <tr>
                      <td>9</td>
                      <td>
                        <Link to="#">
                          Why Teamwork Really Makes The Dream Work
                        </Link>
                      </td>
                      <td>27-09-2024</td>
                    </tr>
                    <tr>
                      <td>10</td>
                      <td>
                        <Link to="#">The World Caters to Average People</Link>
                      </td>
                      <td>27-09-2024</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="content-welcome">
        <div class="row mt-0 mt-lg-3 content-top">
          <div class="col-md-6 ms-lg-4">
            <div class="card ms-lg-5 mt-0">
              <div class="card-header d-flex justify-content-between align-items-center flex-row">
                <span className="fw-light">Acitivities Logs</span>
                <div style={{ position: "relative" }}></div>
              </div>

              <div class="card-body p-0">
                <table class="table mb-0 table-striped">
                  <tbody>
                    <tr>
                      <td>
                        <Link to="#"> Neal Runolfsson</Link> logged in to the
                        system
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <Link to="#"> Neal Runolfsson</Link> logged in to the
                        system
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <Link to="#"> Neal Runolfsson</Link> logged in to the
                        system
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <Link to="#"> Neal Runolfsson</Link> logged out of the
                        system
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <Link to="#"> Neal Runolfsson</Link> logged in to the
                        system
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <Link to="#"> Neal Runolfsson</Link> logged in to the
                        system
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <Link to="#"> Neal Runolfsson</Link> logged in to the
                        system
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        <Link to="#"> Neal Runolfsson</Link> logged in to the
                        system
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <Link to="#"> Neal Runolfsson</Link> logged in to the
                        system
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td>
                        {" "}
                        <Link to="#"> Neal Runolfsson</Link> logged in to the
                        system
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="col-md-6 content-welcome1 content-browser1">
            <div class="card mt-0 content-post referrar-header1">
              <div class="card-header d-flex justify-content-between align-items-start">
                <span className="fw-light">Request Errors</span>
                <div style={{ position: "relative" }}></div>
              </div>

              <div class="card-body p-0">
                <table class="table mb-0 table-striped">
                  <thead>
                    <tr>
                      <th className="fw-light">#</th>
                      <th className="fw-light">URL</th>
                      <th className="fw-light">Status Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>
                        <Link to="#">https://shofy.botble.com/wp-admin</Link>
                      </td>
                      <td>404</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>
                        <Link to="#">
                          https://shofy.botble.com/product-categories/produc...
                        </Link>
                      </td>
                      <td>404</td>
                    </tr>

                    <tr>
                      <td>3</td>
                      <td>
                        <Link to="#">
                          https://shofy.botble.com/en/blog/product-categorie...
                        </Link>
                      </td>
                      <td>404</td>
                    </tr>

                    <tr>
                      <td>4</td>
                      <td>
                        <Link to="#">
                          https://shofy.botble.com/product-categories/jobs
                        </Link>
                      </td>
                      <td>404</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="container-fluid">
        <div className="container">
          <div className="row gap-2 d-flex flex-row flex-lg-nowrap flex-wrap box-admin mt-0 mb-3">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 border box-admin1">
              <table className="table table-striped">
                <thead>
                  <th
                    className="fw-light pt-3"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Top Most Visit Pages
                  </th>
                  <th className="fw-light pt-3 text-end">Today</th>
                </thead>
                <thead className="bg-danger py-2">
                  <tr>
                    <th className="fw-light">#</th>
                    <th className="fw-light">URL</th>
                    <th className="fw-light text-end">VIEWS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <Link className="shofy-website">
                        Shofy - Multipurpose eCommerce Laravel Script
                      </Link>
                    </td>
                    <td className="text-end">98</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      <Link className="shofy-website">
                        MartFury - Laravel Ecommerce system
                      </Link>
                    </td>
                    <td className="text-end">44</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      <Link className="shofy-website">Flex Home</Link>
                    </td>
                    <td className="text-end">42</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>
                      <Link className="shofy-website">Web & App developer</Link>
                    </td>
                    <td className="text-end">30</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>
                      <Link className="shofy-website">
                        Farmart - Laravel Ecommerce system
                      </Link>
                    </td>
                    <td className="text-end">27</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>
                      <Link className="shofy-website">Login</Link>
                    </td>
                    <td className="text-end">27</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>
                      <Link className="shofy-website">
                        {" "}
                        Showcasing Creative Designs and Innovative Projects
                      </Link>
                    </td>
                    <td className="text-end">21</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>
                      <Link className="shofy-website">
                        Nest - Laravel Multipurpose eCommerce Script
                      </Link>
                    </td>
                    <td className="text-end">19</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>
                      <Link className="shofy-website">Products</Link>
                    </td>
                    <td className="text-end">19</td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>
                      <Link className="shofy-website">Homzen</Link>
                    </td>
                    <td className="text-end">18</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-12 col-sm-12 col-md-12 col-lg-6 border box-admin1 box-admin2">
              <table className="table table-striped">
                <thead className="">
                  <th className="fw-light pt-3">Top Browsers</th>
                  <th className="fw-light pt-3 text-end">Today</th>
                </thead>
                <thead className="bg-danger py-2">
                  <tr>
                    <th className="fw-light">#</th>
                    <th className="fw-light">BROWSER</th>
                    <th className="fw-light text-end">SESSIONS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>Chrome</td>
                    <td className="text-end">236</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>Edge</td>
                    <td className="text-end">19</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>Firefox</td>
                    <td className="text-end">19</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>Safari</td>
                    <td className="text-end">16</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>Opera</td>
                    <td className="text-end">7</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>Samsung Internet</td>
                    <td className="text-end">7</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>Safari (in-app)</td>
                    <td className="text-end">1</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="container">
          <div className="row gap-2 d-flex flex-row flex-lg-nowrap flex-wrap box-admin mt-0 mb-3">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 border box-admin1 box-admin3">
              <table className="table table-striped">
                <thead>
                  <th className="fw-light pt-3">Top Referrers</th>
                  <th className="fw-light pt-3 text-end">Today</th>
                </thead>
                <thead className="bg-danger py-2">
                  <tr>
                    <th className="fw-light">#</th>
                    <th className="fw-light">URL</th>
                    <th className="fw-light text-end">VIEWS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>(direct)</td>
                    <td className="text-end">572</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      <Link className="shofy-website">(not set)</Link>
                    </td>
                    <td className="text-end">407</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      <Link className="shofy-website">codecanyon.net</Link>
                    </td>
                    <td className="text-end">385</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>
                      <Link className="shofy-website">google</Link>
                    </td>
                    <td className="text-end">35</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>
                      <Link className="shofy-website">l.facebook.com</Link>
                    </td>
                    <td className="text-end">23</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>
                      <Link className="shofy-website">botble.ticksy.com</Link>
                    </td>
                    <td className="text-end">21</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>
                      <Link className="shofy-website"> localhost</Link>
                    </td>
                    <td className="text-end">15</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>
                      <Link className="shofy-website">kudo-moto.com</Link>
                    </td>
                    <td className="text-end">5</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>
                      <Link className="shofy-website">
                        kumasicentralmarket.com
                      </Link>
                    </td>
                    <td className="text-end">3</td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>
                      <Link className="shofy-website">checkout.stripe.com</Link>
                    </td>
                    <td className="text-end">2</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="col-12 col-sm-12 col-md-12 col-lg-6 border box-admin1">
              <table className="table table-striped">
                <thead className="">
                  <th
                    className="fw-light pt-3"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Top Browsers
                  </th>
                  <th className="fw-light pt-3 text-end">Today</th>
                </thead>
                <thead className="bg-danger py-2">
                  <tr>
                    <th className="fw-light">#</th>
                    <th className="fw-light">NAME</th>
                    <th
                      className="fw-light text-end"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      CREATED AT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <Link className="shofy-website">
                        4 Expert Tips On How To Choose The Right Men’s Wallet
                      </Link>
                    </td>
                    <td className="text-end">2024-11-24</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      <Link className="shofy-website">
                        Sexy Clutches: How to Buy & Wear a Designer Clutch Bag
                      </Link>
                    </td>
                    <td className="text-end">2024-11-24</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      <Link className="shofy-website">
                        The Top 2020 Handbag Trends to Know
                      </Link>
                    </td>
                    <td className="text-end">2024-11-24</td>
                  </tr>
                  <tr>
                    <td>4</td>
                    <td>
                      <Link className="shofy-website">
                        How to Match the Color of Your Handbag With an Outfit
                      </Link>
                    </td>
                    <td className="text-end">2024-11-24</td>
                  </tr>
                  <tr>
                    <td>5</td>
                    <td>
                      <Link className="shofy-website">
                        How to Care for Leather Bags
                      </Link>
                    </td>
                    <td className="text-end">2024-11-24</td>
                  </tr>
                  <tr>
                    <td>6</td>
                    <td>
                      <Link className="shofy-website">
                        We're Crushing Hard on Summer's 10 Biggest Bag Trends
                      </Link>
                    </td>
                    <td className="text-end">2024-11-24</td>
                  </tr>
                  <tr>
                    <td>7</td>
                    <td>
                      <Link className="shofy-website">
                        Essential Qualities of Highly Successful Music
                      </Link>
                    </td>
                    <td className="text-end">2024-11-24</td>
                  </tr>
                  <tr>
                    <td>8</td>
                    <td>
                      <Link className="shofy-website">
                        9 Things I Love About Shaving My Head
                      </Link>
                    </td>
                    <td className="text-end">2024-11-24</td>
                  </tr>
                  <tr>
                    <td>9</td>
                    <td>
                      <Link className="shofy-website">
                        Why Teamwork Really Makes The Dream Work
                      </Link>
                    </td>
                    <td className="text-end">2024-11-24</td>
                  </tr>
                  <tr>
                    <td>10</td>
                    <td>
                      <Link className="shofy-website">
                        The World Caters to Average People
                      </Link>
                    </td>
                    <td className="text-end">2024-11-24</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="container">
          <div className="row gap-2 d-flex flex-row flex-lg-nowrap flex-wrap box-admin mt-0 mb-3">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 border box-admin1">
              <table className="table table-striped">
                <thead>
                  <th className="fw-light pt-3">Activities Logs</th>
                </thead>
                <tbody></tbody>
              </table>
            </div>

            <div className="col-12 col-sm-12 col-md-12 col-lg-6 border box-admin1">
              <table className="table table-striped">
                <thead className="">
                  <th
                    className="fw-light pt-3"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Request Errors
                  </th>
                </thead>
                <thead className="bg-danger py-2">
                  <tr>
                    <th className="fw-light">#</th>
                    <th className="fw-light">URL</th>
                    <th
                      className="fw-light text-end"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      STATUS CODE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>
                      <Link className="shofy-website">
                        http://localhost:5173/error
                      </Link>
                    </td>
                    <td className="text-end">2024-11-24</td>
                  </tr>
                  <tr>
                    <td>2</td>
                    <td>
                      <Link className="shofy-website">
                        https://shofy.botble.com/vi/tag/nature?layout=list
                      </Link>
                    </td>
                    <td className="text-end">2024-11-24</td>
                  </tr>
                  <tr>
                    <td>3</td>
                    <td>
                      <Link className="shofy-website">
                        https://shofy.botble.com/ar/products?categories%5B...
                      </Link>
                    </td>
                    <td className="text-end">2024-11-24</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Welcome;
