import React, { useContext, useEffect, useRef, useState } from "react";
import "./ProductHome.css";
import { Link } from "react-router-dom";

import Tonic from "../../assets/Tonic.svg";
import Point from "../../assets/point.webp";
import Over from "../../assets/Over.webp";
import Electronic from "../../assets/Electronic.webp";
import gift from "../../assets/gift.webp";
import computer from "../../assets/computer.webp";
import Smart from "../../assets/Smart.webp";
import camera from "../../assets/camera.webp";
import cook from "../../assets/cook.webp";
import access from "../../assets/access.webp";
import gadgets from "../../assets/gadgets.webp";
import filter from "../../assets/filter.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

import Dot from "../../assets/dot.webp";
import Hamburger from "../../assets/hamburger.svg";

import Close from "../../assets/Close.webp";
import axios from "axios";
import UserContext from "../../context/UserContext";

function ProductHome() {
  let { count, setCount } = useContext(UserContext);

  useEffect(() => {
    cartdata();
  }, []);

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

  const [user, setUser] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      let response = await axios.get("http://89.116.170.231:1600/brandsdata");
      setUser(response.data);
    };
    fetchData();
  }, []);

  const leftImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? user.length - 1 : prevIndex - 1
    );
  };

  const rightImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === user.length - 1 ? 0 : prevIndex + 1
    );
  };

  let [image, setImage] = useState([]);

  let productimage = async () => {
    let response = await axios.get(
      "http://89.116.170.231:1600/productpagedata"
    );
    setImage(response.data);
  };

  useEffect(() => {
    productimage();
  }, []);

  const [showFilter, setShowFilter] = useState(false);

  const handleFilterToggle = () => {
    setShowFilter(!showFilter);
  };

  const handleCancel = () => {
    setShowFilter(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setShowFilter(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  let [home, setHome] = useState([]);

  let homedata = async () => {
    let response = await axios.get(
      "http://89.116.170.231:1600/productpagedata"
    );
    setHome(response.data);
  };
  homedata();

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

  return (
    <>
      <div className="container" id="container-custom">
        <div className="container-custom ms-2">
          <header className="d-flex flex-wrap justify-content-between py-2 mb-5 border-bottom bg-body rounded-2 container-custom1">
            <nav className="navbar navbar-expand-lg navbar-light w-100 d-flex flex-row flex-nowrap">
              <div className="container">
                <Link className="navbar-brand d-non d-lg-block" to="/">
                  <img
                    src={logoUrl || Tonic}
                    alt="Tonic Logo"
                    className="img-fluid me-3 me-md-0 mt-0 mt-lg-0"
                    style={{ height: `${logoHeight}px`, width: "200px" }}
                  />
                </Link>

                <button
                  type="button"
                  className="navbar-toggler py-0 px-1 d-lg-none"
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
                  <Link to={`/${url.login}`} className="nav-link">
                    <img
                      src={Profile}
                      alt="Profile"
                      className="profiles img-fluid me-3"
                    />
                  </Link>
                  <Link
                    to={`/${url.cart}`}
                    className="nav-link d-flex nav-properties1"
                  >
                    <img
                      src={Cart}
                      alt="Cart"
                      className="img-fluid profiles1 mt-1"
                    />
                    <div className="addcarts ms-1 ps-1 pt-lg-1">{count}</div>
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

          <main className="container mt-5 cart-cart">
            <h1 className="fw-medium mb-3 text-center container-contact fs-2">
              Products
            </h1>
            <nav
              aria-label="breadcrumb"
              id="container-contact1"
              className="ms-5 ps-3 ms-lg-0 ps-lg-0"
            >
              <ol className="breadcrumb d-flex flex-wrap gap-0">
                <li className="breadcrumb-item navbar-item fw-medium">
                  <Link target="_blank" to="/" className="text-dark">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item navbar-item fw-medium text-dark">
                  Products
                </li>
              </ol>
            </nav>
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid overflow-hidden">
        <div className="container">
          <div className="row mt-lg-5 me-1 pt-lg-3 d-flex justify-content-center d-flex flex-row d-lg-none">
            <div
              className="col-2 col-sm-2 col-md-1 col-lg-1 border admin-product1 rounded-0 mt-lg-5 bg-light d-flex justify-content-center py-2 position-relative"
              style={{ cursor: "pointer" }}
              onClick={leftImage}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </div>

            <div className="col-12 col-sm-12 col-md-6 col-lg-6 border admin-product d-flex justify-content-center align-items-center">
              <img
                src={`http://89.116.170.231:1600/src/image/${user[currentImageIndex]?.image}`}
                alt={`Product Image ${currentImageIndex + 1}`}
                className="img-fluid"
              />
            </div>

            <div
              className="col-2 col-sm-2 col-md-1 col-lg-6 border admin-product1 admin-product2 mt-lg-5 mt-0 mt-md-5 py-2 position-relative bg-light d-flex justify-content-center"
              style={{ cursor: "pointer" }}
              onClick={rightImage}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </div>
          </div>

          <div className="row mt-lg-5 pt-lg-3 d-flex justify-content-center d-none d-lg-flex">
            {Array.isArray(user) && user.length > 0 ? (
              user.slice(0, 5).map((data, key) => (
                <div
                  className="col-6 col-sm-6 col-md-4 col-lg-2 border admin-product d-flex justify-content-center align-items-center"
                  key={key}
                >
                  <img
                    src={`http://89.116.170.231:1600/src/image/${data.image}`}
                    alt={`Product Image ${key + 1}`}
                    className="img-fluid"
                  />
                </div>
              ))
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="container mb-5">
          {Array.isArray(image) && image.length > 0 ? (
            image.slice(0, 1).map((data, key) => {
              const labels = [
                "HeadPhones",
                "Digital Watch",
                "Soundbar",
                "EarPhones",
                "Mobile Phone",
              ];
              const productLabel = labels[key] || "Product";
              const nextImage = image[key + 1] || {};
              const nextImage2 = image[key + 2] || {};
              const nextImage3 = image[key + 3] || {};
              const nextImage4 = image[key + 4] || {};

              return (
                <div className="row ms-lg-0 gap-4 d-flex flex-row" key={key}>
                  <div className="col-6 col-sm-4 col-md-3 col-lg-2 border show-product position-relative">
                    <img
                      src={`http://89.116.170.231:1600/src/image/${
                        data.image || "default-image.jpg"
                      }`}
                      alt={`Product Image ${key + 1}`}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <div className="position-absolute ms-4 mt-2 fw-bold">
                      {productLabel}
                    </div>
                  </div>

                  <div className="col-6 col-sm-4 col-md-3 col-lg-2 border show-product position-relative">
                    {nextImage.image && (
                      <img
                        src={`http://89.116.170.231:1600/src/image/${
                          nextImage.image || "default-image.jpg"
                        }`}
                        alt={`Product Image ${key + 2}`}
                        className="w-100 h-100 object-fit-cover"
                      />
                    )}
                    <div className="position-absolute ms-4 mt-2 fw-bold">
                      {labels[key + 1] || "Product"}
                    </div>
                  </div>

                  <div className="col-6 col-sm-4 col-md-3 col-lg-2 border show-product mt-4 position-relative">
                    {nextImage2.image && (
                      <img
                        src={`http://89.116.170.231:1600/src/image/${
                          nextImage2.image || "default-image.jpg"
                        }`}
                        alt={`Product Image ${key + 3}`}
                        className="w-100 h-100 object-fit-cover"
                      />
                    )}
                    <div className="position-absolute ms-5 mt-2 fw-bold">
                      {labels[key + 2] || "Product"}
                    </div>
                  </div>

                  <div className="col-6 col-sm-4 col-md-3 col-lg-2 border show-product position-relative">
                    {nextImage3.image && (
                      <img
                        src={`http://89.116.170.231:1600/src/image/${
                          nextImage3.image || "default-image.jpg"
                        }`}
                        alt={`Product Image ${key + 4}`}
                        className="w-100 h-100 object-fit-cover"
                      />
                    )}
                    <div className="position-absolute ms-5 mt-2 fw-bold">
                      {labels[key + 3] || "Product"}
                    </div>
                  </div>

                  <div className="col-6 col-sm-4 col-md-3 col-lg-2 border show-product mt-4 position-relative">
                    {nextImage4.image && (
                      <img
                        src={`http://89.116.170.231:1600/src/image/${
                          nextImage4.image || "default-image.jpg"
                        }`}
                        alt={`Product Image ${key + 5}`}
                        className="w-100 h-100 object-fit-cover"
                      />
                    )}
                    <div className="position-absolute ms-4 mt-2 fw-bold">
                      {labels[key + 4] || "Product"}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No images available</p>
          )}
        </div>
      </div>

      <div className="container-fluid">
        <div className="container">
          <div className="row d-flex justify-content-between align-items-center mb-3">
            <div className="position-relative d-flex flex-row flex-wrap w-100">
              <input
                type="text"
                className="form-control py-4 mt-4 rounded-0 input-container d-lg-block d-none"
                placeholder="Search..."
              />
              <button
                className="nav-product active ms-0 ms-lg-4 border h-25 mt-4 px-2 py-2"
                type="button"
              >
                <img src={Dot} alt="filter" />
              </button>
              <button
                className="nav-product active ms-1 ms-lg-3 border h-25 mt-4 px-2 py-2"
                type="button"
              >
                <img src={Point} alt="settings" />
              </button>

              <div className="d-flex flex-row ms-lg-auto me-1 ms-md-3 ms-2">
                <select
                  className="mt-4 ms-0 form-select"
                  style={{
                    height: "43px",
                    letterSpacing: "1px",
                    wordSpacing: "2px",
                  }}
                >
                  <option value="Default">Default</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Newest">Newest</option>
                  <option value="Price: low to high">Price: low to high</option>
                  <option value="Price: high to low">Price: high to low</option>
                  <option value="Name: A-Z">Name: A-Z</option>
                  <option value="Name: Z-A">Name: Z-A</option>
                  <option value="Rating: low to high">
                    Rating: low to high
                  </option>
                  <option value="Rating: high to low">
                    Rating: high to low
                  </option>
                </select>
              </div>

              <div>
                <select
                  className="mt-4 ms-3 form-select px-lg-3 px-4"
                  style={{
                    height: "43px",
                    letterSpacing: "1px",
                    wordSpacing: "2px",
                  }}
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="36">36</option>
                </select>
              </div>

              <div className="d-lg-none d-block">
                <button
                  className="ms-lg-2 ms-2 ms-md-4 mt-4 btn btn-dark px-1 d-flex py-3 rounded-0 d-flex flex-row align-items-center"
                  style={{ letterSpacing: "1px" }}
                  onClick={handleFilterToggle}
                >
                  <img src={filter} alt="RxLYTE" className="me-1" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`container-fluid filter-container ${
          showFilter ? "active" : ""
        }`}
      >
        <div className="container">
          <div className="row d-flex justify-content-start ms-0 gap-2 flex-row">
            <div
              className="col-12 col-md-4 border digital-hello1 py-3 rounded d-flex flex-column"
              style={{ display: showFilter ? "block" : "none" }}
            >
              <div className="w-100 bg-black">
                <button
                  className="btn btn-li mb-3 d-lg-none mt-2 bg-transparent text-light border-0"
                  style={{ fontSize: "16px" }}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>

              <span className="fw-bold mt-2">Price Filter</span>
              <div className="border mt-3"></div>
              <div className="mt-3">
                Price: USD<span style={{ fontFamily: "verdana" }}>0</span>-USD
                <span style={{ fontFamily: "verdana" }}>2,200</span>
              </div>

              <div className="mt-3 list-fliter text-start lh-lg">
                <span className="fw-bold">Categories</span>
                <hr />
                <div className="float-start ms-2 ms-md-0 ms-lg-1">
                  <ul className="list-filter1">
                    <li>
                      <img
                        src={Over}
                        alt="new arrivals"
                        className="me-2 mb-1"
                      />
                      New Arrivals
                    </li>

                    <li>
                      <img
                        src={Electronic}
                        alt="electronics"
                        className="me-2 mb-1"
                      />
                      Electronics
                    </li>

                    <li>
                      <img src={gift} alt="RxLYTE" className="me-2 mb-1" />
                      Gifts
                    </li>

                    <li>
                      <img src={computer} alt="RxLYTE" className="me-2 mb-1" />
                      Computers
                    </li>

                    <li>
                      <img src={Smart} alt="RxLYTE" className="me-2 mb-1" />
                      Smartphones & Tablets
                    </li>

                    <li>
                      <img
                        src={Electronic}
                        alt="RxLYTE"
                        className="me-2 mb-1"
                      />
                      TV,Video & Music
                    </li>

                    <li>
                      <img src={camera} alt="RxLYTE" className="me-2 mb-1" />
                      Cameras
                    </li>

                    <li>
                      <img src={cook} alt="RxLYTE" className="me-2 mb-1" />
                      Cooking
                    </li>

                    <li>
                      <img src={computer} alt="RxLYTE" className="me-2 mb-1" />
                      Accessories
                    </li>

                    <li>
                      <img src={access} alt="RxLYTE" className="me-2 mb-1" />
                      Sports
                    </li>

                    <li>
                      <img src={gadgets} alt="RxLYTE" className="me-2 mb-1" />
                      Electronic Gadgets
                    </li>
                  </ul>
                </div>

                <div>
                  <span className="fw-bold">Brands</span>
                  <hr />
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">FoodPound</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">iTea JSC</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">Soda Brand</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">Shofy</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">Soda Brand</label>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="fw-bold">Tags</span>
                  <hr />
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">Printer</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">Office</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">Electronic</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">Iphone</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">It</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">Mobile</label>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="fw-bold">Color</span>
                  <hr />
                  <div className="d-flex flex-row gap-2">
                    <div className="border green-div mt-1 bg-success"></div>
                    <label htmlFor="">Green</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <div className="border green-div green-div1 mt-1 "></div>
                    <label htmlFor="">Blue</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <div className="border green-div mt-1 bg-danger"></div>
                    <label htmlFor="">Red</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <div className="border green-div mt-1 bg-dark"></div>
                    <label htmlFor="">Black</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <div className="border green-div green-div2 mt-1"></div>
                    <label htmlFor="">Brown</label>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="fw-bold">Weight</span>
                  <hr />
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">1 KG</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">2 KG</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">3 KG</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">4 KG</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">5 KG</label>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="fw-bold">Size</span>
                  <hr />
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">S</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">M</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">L</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">XL</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">XXL</label>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="fw-bold">Boxes</span>
                  <hr />
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">1 Box</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">2 Boxes</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">3 Boxes</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">4 Boxes</label>
                  </div>
                  <div className="d-flex flex-row gap-2">
                    <input type="checkbox" className="form-check-input mt-2" />
                    <label htmlFor="">5 Boxes</label>
                  </div>
                </div>
              </div>
            </div>
            {Array.isArray(user) && user.length > 0 ? (
              user.map((data) => (
                <>
                  <div className="col-6 col-sm-6 col-md-4 col-lg-3 border rounded-0 digital-hello rounded">
                    <img
                      src={`http://89.116.170.231:1600/src/image/${data.image}`}
                      alt="RxLYTE"
                      className="ms-5"
                    />
                  </div>
                </>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center"></td>
              </tr>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-dark text-white pt-4 pb-4 cart-cart mt-4">
        <div className="container text-center text-md-left">
          <div className="row footer-lyte">
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 mx-auto mt-lg-3 mt-0 d-flex flex-column text-start ms-0">
              <img
                src={Tonic}
                alt="RxTonic"
                className="img-fluid mb-3"
                style={{ maxWidth: "190px" }}
              />
              <h4 className="mb-2">About Us</h4>
              <p className="text-start lh-lg footer-list">
                <li>
                  We assert that our online pharmacy, RxTonic.com, complies with
                  all local legal requirements while delivering healthcare
                  services over the internet platform. To provide our consumers
                  the finest pharmaceutical care possible,all pharmaceutical
                  firms and drug manufacturers have accredited facilities and
                  trained pharmacists on staff.
                </li>
              </p>
            </div>

            <div className="col-12 col-md-6 col-lg-4 mt-md-5 pt-md-2 mt-lg-0 pt-lg-0">
              <div className="d-flex flex-row flex-lg-nowrap w-100 gap-2 mt-lg-5 pt-lg-4">
                <div className="text-start">
                  <h5 className="mb-2 pb-0">Company</h5>
                  <ul className="lh-lg footer-list p-0">
                    <li>
                      <Link
                        to="/about"
                        className="text-white text-decoration-none"
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/blog"
                        className="text-white text-decoration-none"
                      >
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link className="text-white text-decoration-none">
                        Payment Security
                      </Link>
                    </li>
                    <li>
                      <Link className="text-white text-decoration-none">
                        Affiliate Marketing
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="text-start ms-5 ps-5 ps-lg-0">
                  <h5 className="mb-2 pb-0">Help?</h5>
                  <ul className="lh-lg footer-list p-0">
                    <li>
                      <Link
                        to="/faqs"
                        className="text-white text-decoration-none"
                      >
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-white text-decoration-none"
                        to="/sitemap"
                      >
                        Sitemap
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/contact-us"
                        className="text-white text-decoration-none"
                      >
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3 col-xl-3 mx-auto mt-lg-2 mt-0 ms-lg-5 mt-lg-5 pt-lg-4 pt-1 ms-0 footer-list">
              <h5 className="mb-lg-3 mb-3 text-start">
                Sign Up for Newsletter
              </h5>
              <form className="d-flex flex-row flex-nowrap">
                <input
                  type="email"
                  placeholder="Email address"
                  className="form-control me-2 py-4 cart-cart1"
                  aria-label="Email address"
                />
                <button
                  className="btn btn-success d-flex cart-cart1 py-4 me-0"
                  type="submit"
                  onClick={(e) => e.preventDefault()}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <hr className="my-4 me-3" />

          <div className="row align-items-center footer-lyte1">
            <div className="col-md-6 col-lg-7">
              <p className="text-md-start text-lg-start text-start mb-0">
                &copy; {new Date().getFullYear()} RxTonic. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default ProductHome;
