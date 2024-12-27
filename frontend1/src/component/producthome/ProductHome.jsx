import React, { useContext, useEffect, useRef, useState } from "react";
import "./ProductHome.css";
import { Link } from "react-router-dom";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
import Point from "../../assets/point.png";
import Over from "../../assets/Over.png";
import Electronic from "../../assets/Electronic.png";
import gift from "../../assets/gift.png";
import computer from "../../assets/computer.png";
import Smart from "../../assets/Smart.png";
import camera from "../../assets/camera.png";
import cook from "../../assets/cook.png";
import access from "../../assets/access.png";
import gadgets from "../../assets/gadgets.png";
import filter from "../../assets/filter.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Profile from "../../assets/image.png";
import Dot from "../../assets/dot.png";
import Hamburger from "../../assets/hamburger.svg";
import Cart from "../../assets/Cart.svg";
import UserContext from "../../context/UserContext";
import axios from "axios";

function ProductHome() {
  let { count, setCount } = useContext(UserContext);

  useEffect(() => {
    cartdata();
  }, []);

  const cartdata = async () => {
    try {
      const response = await axios.get("http://localhost:1600/allcartdata");
      setCount(response.data.length);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };
  cartdata();

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
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [user, setUser] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      let response = await axios.get("http://localhost:1600/brandsdata");
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
    let response = await axios.get("http://localhost:1600/productpagedata");
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
    let response = await axios.get("http://localhost:1600/productpagedata");
    setHome(response.data);
  };
  homedata();

  return (
    <>
      <div className="container" id="container-custom">
        <div className="container-custom ms-2">
          <header className="d-flex flex-wrap justify-content-between py-2 mb-5 border-bottom bg-body rounded-2 container-custom1">
            <nav className="navbar navbar-expand-lg navbar-light w-100">
              <div className="container">
                <Link className="navbar-brand d-non d-lg-block" to="#">
                  <img src={image1} alt="Tonic Logo" className="img-fluid" />
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
                      src={Hamburger}
                      alt="Menu"
                      className="img-fluid hamburger-image"
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
                      <Link className="nav-link" to={`/blog-details/${1}`}>
                        Pages
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/blog">
                        Blog
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/cart">
                        Cart
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/contact-us">
                        Contact
                      </Link>
                    </li>
                  </ul>
                </div>

                <div className="navbar-icons d-sm-flex">
                  <Link to="/login" className="nav-link">
                    <img
                      src={Profile}
                      alt="Profile"
                      className="profiles img-fluid me-3"
                    />
                  </Link>
                  <Link to="/cart" className="nav-link d-flex nav-properties1">
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
                    <Link className="nav-link" to={`/blog-details/${1}`}>
                      Pages
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/blog">
                      Blog
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/cart">
                      Cart
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

          {}

          <main className="container mt-5 cart-cart">
            <h1 className="fw-medium mb-3 text-center container-contact fs-2">
              Products
            </h1>
            <nav aria-label="breadcrumb" id="container-contact1">
              <ol className="breadcrumb d-flex flex-wrap gap-0">
                <li className="breadcrumb-item navbar-item fw-medium">
                  <Link target="blank" to="/" className="text-dark">
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
                src={`http://localhost:1600/src/image/${user[currentImageIndex]?.image}`}
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
            {user.slice(0, 5).map((data, key) => (
              <div
                className="col-6 col-sm-6 col-md-4 col-lg-2 border admin-product d-flex justify-content-center align-items-center"
                key={key}
              >
                <img
                  src={`http://localhost:1600/src/image/${data.image}`}
                  alt={`Product Image ${key + 1}`}
                  className="img-fluid"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="container mb-5">
          {image.slice(0, 1).map((data, key) => (
            <div className="row ms-lg-0 gap-4 d-flex flex-row" key={key}>
              <div className="col-6 col-sm-4 col-md-3 col-lg-2 border show-product border">
                <img
                  src={`http://localhost:1600/src/image/${data.image}`}
                  alt={`Product Image ${key + 1}`}
                />
                <div className="position-absolute ms-4 mt-2 fw-bold">
                  HeadPhones
                </div>
              </div>

              <div className="col-6 col-sm-4 col-md-3 col-lg-2 border show-product">
                <img
                  src={`http://localhost:1600/src/image/${
                    image[key + 1]?.image
                  }`}
                  alt={`Product Image ${key + 2}`}
                />
                <div className="position-absolute ms-4 mt-2 fw-bold">
                  Digital Watch
                </div>
              </div>

              <div className="col-6 col-sm-4 col-md-3 col-lg-2 border show-product mt-4">
                <img
                  src={`http://localhost:1600/src/image/${
                    image[key + 2]?.image
                  }`}
                  alt={`Product Image ${key + 2}`}
                />
                <div className="position-absolute ms-5 mt-2 fw-bold">
                  Soundbar
                </div>
              </div>

              <div className="col-6 col-sm-4 col-md-3 col-lg-2 border show-product">
                <img
                  src={`http://localhost:1600/src/image/${
                    image[key + 3]?.image
                  }`}
                  alt={`Product Image ${key + 2}`}
                />
                <div className="position-absolute ms-5 mt-2 fw-bold">
                  EarPhones
                </div>
              </div>

              <div className="col-6 col-sm-4 col-md-3 col-lg-2 border show-product mt-4">
                <img
                  src={`http://localhost:1600/src/image/${
                    image[key + 4]?.image
                  }`}
                  alt={`Product Image ${key + 2}`}
                />
                <div className="position-absolute ms-4 mt-2 fw-bold">
                  Mobile Phone
                </div>
              </div>
            </div>
          ))}
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
                // onClick={handleFilterToggle}
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
                  <img src={filter} alt="" className="me-1" />
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
                      <img src={gift} alt="" className="me-2 mb-1" />
                      Gifts
                    </li>

                    <li>
                      <img src={computer} alt="" className="me-2 mb-1" />
                      Computers
                    </li>

                    <li>
                      <img src={Smart} alt="" className="me-2 mb-1" />
                      Smartphones & Tablets
                    </li>

                    <li>
                      <img src={Electronic} alt="" className="me-2 mb-1" />
                      TV,Video & Music
                    </li>

                    <li>
                      <img src={camera} alt="" className="me-2 mb-1" />
                      Cameras
                    </li>

                    <li>
                      <img src={cook} alt="" className="me-2 mb-1" />
                      Cooking
                    </li>

                    <li>
                      <img src={computer} alt="" className="me-2 mb-1" />
                      Accessories
                    </li>

                    <li>
                      <img src={access} alt="" className="me-2 mb-1" />
                      Sports
                    </li>

                    <li>
                      <img src={gadgets} alt="" className="me-2 mb-1" />
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
            {home.map((data) => (
              <>
                <div className="col-6 col-sm-6 col-md-4 col-lg-3 border rounded-0 digital-hello rounded">
                  <img
                    src={`http://localhost:1600/src/image/${data.image}`}
                    alt=""
                    className="ms-5"
                  />
                </div>
              </>
            ))}
          </div>
        </div>
      </div>

      {}

      <div className="container-fluid bg-dark text-light py-5 mt-4 mb-0 d-flex justify-content-center align-items-center lorem-contact rounded-0">
        <div className="container text-center">
          <div className="row justify-content-center">
            <div className="col-lg-3 col-md-6 col-12 d-flex flex-column align-items-start mb-4 list-contact2">
              <img
                src={Tonic}
                alt="About Us"
                className="img-fluid mb-2 me-5 pe-5 about-rx"
              />
              <h4 className="me-5 pe-5">About Us</h4>
              <p className="mt-2 pharmacy2 text-start lh-lg">
                We assert that our online pharmacy, RxTonic.com, complies with
                all local legal requirements while delivering healthcare
                services over the internet platform. To provide our consumers
                the finest pharmaceutical care possible,all pharmaceutical firms
                and drug manufacturers have accredited facilities and trained
                pharmacists on staff.
              </p>
            </div>

            <div className="col-lg-3 col-md-6 col-6 d-flex flex-column align-items-lg-center mb-lg-4 list-contact mt-md-4 pt-md-3 mt-lg-0 pt-lg-0 mt-xxl-1 pt-xxl-0 list-contact3">
              <h4 className="mt-lg-5 mt-md-2 company-footer">Company</h4>
              <ul className="mt-2 lh-lg text-start pharmacy3 ms-lg-0 ms-md-5 pharmacy-about pharmacy-list1 pharmacy-link">
                <li className="pharmacy2">
                  <Link to="/about" className="text-light">
                    About Us
                  </Link>
                </li>

                <li className="pharmacy2">
                  <Link to="/blog" className="text-light">
                    Blog
                  </Link>
                </li>

                <li className="pharmacy2">
                  <Link to="#" className="text-light">
                    Payment Security
                  </Link>
                </li>

                <li className="pharmacy2">
                  <Link to="#" className="text-light">
                    Affiliate Marketing
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 col-6 d-flex flex-column align-items-lg-center align-items-start mb-lg-4 list-contact list-contact1 help-sitemap">
              <h4 className="mt-lg-4 pt-lg-4 mt-3 mt-sm-0 mt-md-0">Help?</h4>
              <ul className="mt-2 lh-lg text-start me-4 pe-2 pharmacy3">
                <li className="pharmacy2">
                  <Link to="/faqs" className="text-light">
                    FAQ
                  </Link>
                </li>
                <li className="pharmacy2">
                  <Link to="#" className="text-light">
                    Sitemap
                  </Link>
                </li>
                <li className="pharmacy2">
                  <Link to="/contact-us" className="text-light">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="col-lg-3 col-md-6 d-flex flex-column align-items-lg-center mb-4 signup-news mt-lg-1">
              <h4
                className="mb-2 mt-lg-4 pt-lg-3 me-sm-4"
                style={{ whiteSpace: "nowrap" }}
              >
                Sign Up for Newsletter
              </h4>
              <p className="ps-lg-0 ps-xl-3 ps-xxl-1 me-2 text-lg-start text-sm-end pharmacy2 lh-lg">
                Get updates by subscribing to our weekly newsletter.
              </p>
              <div className="d-flex flex-row signup-text">
                <input
                  type="email"
                  placeholder="Email address"
                  className="form-control mb-2 py-4 ms-lg-2 rounded-0 cart-cart"
                />
                <button className="btn btn-success d-flex px-lg-2 py-4 me-0 ms-1 rounded-0 cart-cart">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductHome;
