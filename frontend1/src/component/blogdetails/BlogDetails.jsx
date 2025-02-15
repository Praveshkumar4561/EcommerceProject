import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./BlogDetails.css";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faComment,
  faEnvelope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Profile from "../../assets/image.webp";
import Hamburger from "../../assets/hamburger.svg";
import Cart from "../../assets/Cart.svg";

import axios from "axios";
import UserContext from "../../context/UserContext";

function BlogDetails() {
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

  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  let [welcome, setWelcome] = useState([]);
  let [detail, setDetail] = useState(false);
  let [detail1, setDetail1] = useState([]);

  let blogsdata = async () => {
    let response = await axios.get("http://89.116.170.231:1600/blogpostdata");
    setDetail(response.data);
    setDetail1(response.data);
  };
  blogsdata();

  let alldata = async () => {
    let response = await axios.get("http://89.116.170.231:1600/blogalldata");
    setWelcome(response.data);
  };
  alldata();

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(
          `http://89.116.170.231:1600/blogpostdata/${id}`
        );
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };
    fetchBlogDetails();
  }, [id]);

  const defaultUrlState = {
    login: "login",
    register: "register",
    changePassword: "user/change-password",
    cart: "cart",
    checkout: "checkout",
    ordersTracking: "orders/tracking",
    wishlist: "wishlist",
    productDetails: "product/details",
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
            `http://89.116.170.231:1600/api/src/image/${response.data.logo_url}`
          );
          setLogoHeight(response.data.logo_height || "45");
        }
      })
      .catch((error) => console.error("Error fetching logo:", error));
  }, []);

  return (
    <>
      <div className="container cart-cart" id="container-custom">
        <div className="container-custom ms-3 ms-lg-0 me-3">
          <header className="d-flex flex-wrap justify-content-between py-2 mb-5 border-bottom bg-body rounded-2 container-custom1">
            <nav className="navbar navbar-expand-lg navbar-light w-100 d-flex flex-row flex-nowrap">
              <div className="container">
                <Link className="navbar-brand d-non d-lg-block" to="/">
                  <img
                    src={logoUrl || image1}
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
                      src={Hamburger}
                      alt="Menu"
                      className="img-fluid hamburger-images"
                    />
                  </span>
                </button>

                <div className="navbar-collapse d-none d-lg-block cart-cart">
                  <ul className="navbar-nav ms-auto">
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
                      <Link className="nav-link" to={`/${url.cart}`}>
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
                    <Link className="nav-link" to={`/${url.cart}`}>
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

          <main className="container mt-4">
            <p className="fw-medium mb-3 text-start mt-lg-5 container-contact ps-lg-5 ms-lg-1 ms-4 me-4 pt-3 lorem-space cart-cart fs-4 expert-blog">
              {Array.isArray(detail1) && detail1.length > 0 ? (
                detail1
                  .slice(0, 1)
                  .map((data, key) => <span key={key}>{data.name}</span>)
              ) : (
                <span></span>
              )}
            </p>
            <nav
              aria-label="breadcrumb"
              id="container-contact1"
              className="ms-5 ps-3 ms-lg-0 ps-lg-0"
            >
              <ol className="breadcrumb d-flex flex-wrap gap-0 link-class mt-5">
                <li className="breadcrumb-item navbar-item fw-bold">
                  <Link
                    target="_blank"
                    to="/"
                    className="text-dark cart-cart fw-medium"
                    style={{ zIndex: "1000", position: "relative" }}
                  >
                    Home
                  </Link>
                </li>
                <li
                  className="breadcrumb-item navbar-item fw-medium lorem-space text-dark cart-cart"
                  style={{ zIndex: "1000", position: "relative" }}
                >
                  Blog Deatils
                </li>
              </ol>
            </nav>
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid">
        <div className="container">
          <div className="row gap-4 me-1 d-flex flex-lg-nowrap flex-md-wrap">
            {Array.isArray(detail1) && detail1.length > 0 ? (
              detail1.slice(0, 1).map((data) => (
                <div
                  className="col-12 col-sm-12 col-md-12 col-lg-8"
                  key={data.id}
                >
                  <div className="blog-box1">
                    <img
                      src={`http://89.116.170.231:1600/api/src/image/${data.image}`}
                      alt="404"
                      className="img-fluid w-100 h-100 mb-0"
                    />
                  </div>

                  <div className="bg-light">
                    <div className="d-flex flex-row gap-2 ms-2 mt-0">
                      <FontAwesomeIcon
                        icon={faCalendarDays}
                        className="text-success ms-1 mt-2 pt-lg-1"
                      />
                      <p className="mt-lg-2 mt-1 fw-medium text-dark lorem-space">
                        {new Date(data.date).toLocaleDateString()}
                      </p>
                    </div>

                    <h2 className="lorem-dummy ms-2 me-5 mt text-start lorem-space fw-normal lh-base">
                      {data.name}
                    </h2>

                    <h4 className="english-read ms-2 mt-1 me-5 text-start lorem-space lh-lg text-dark">
                      {data.categories}
                    </h4>

                    <h4 className="english-read ms-2 mt-0 me-5 text-start lorem-space lh-lg text-dark">
                      {data.author_name}
                    </h4>

                    <p className="english-read ms-2 me-5 text-start lorem-space lh-lg text-dark">
                      {data.description}
                    </p>

                    <div className="d-flex flex-column">
                      <div className="cart-cart d-flex ms-2 flex-row gap-1">
                        <h4>Tags:</h4>
                        {Array.isArray(welcome) && welcome.length > 0 ? (
                          welcome.slice(0, 3).map((data, key) => (
                            <div className="ms-0" key={key}>
                              <button className="btn btn-transparent border d-flex">
                                <Link
                                  to="/blog"
                                  className="text-decoration-none text-dark cart-cart"
                                >
                                  {data.name}
                                </Link>
                              </button>
                            </div>
                          ))
                        ) : (
                          <p></p>
                        )}

                        <div className="review-detail">
                          <h4 className="fw-normal ms-2 mt-3 text-start mt-5 pt-0 cart-cart">
                            Reviews
                          </h4>
                        </div>
                      </div>
                    </div>

                    <div className="container mt-0">
                      <div className="row">
                        <div className="col-12 col-md-8 col-lg-6 review-page mt-0 rounded-0">
                          <h4 className="fw-normal mb-4 mt-1 lorem-space text-start">
                            Write A Review
                          </h4>
                          <form action="" method="post">
                            <div className="row mb-4 mt-3 mb-5">
                              <div className="col-12 col-md-6 position-relative lorem-write1 border-top border-end border-start rounded">
                                <FontAwesomeIcon
                                  icon={faUser}
                                  className="position-absolute text-success"
                                  style={{
                                    left: "35px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    zIndex: 1,
                                  }}
                                />
                                <input
                                  type="text"
                                  className="form-control fw-medium border-top-0 py-4 control-form lorem-space lorem-write lorem-write1 ps-5 "
                                  placeholder="Your Name*"
                                />
                              </div>

                              <div className="col-12 col-md-6 mt-3 mt-md-0 position-relative lorem-write1">
                                <FontAwesomeIcon
                                  icon={faEnvelope}
                                  className="position-absolute text-success"
                                  style={{
                                    left: "34px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    zIndex: 1,
                                  }}
                                />
                                <input
                                  type="email"
                                  className="form-control fw-medium py-4 ps-5 control-form lorem-write mt-md-3 mt-lg-0 border-top border-end border-start"
                                  placeholder="Email Address*"
                                />
                              </div>
                            </div>

                            <div className="col-12 position-relative mb-4">
                              <FontAwesomeIcon
                                icon={faComment}
                                className="position-absolute text-success"
                                style={{
                                  left: "21px",
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  zIndex: 1,
                                }}
                              />
                              <input
                                type="text"
                                className="form-control px-5 fw-medium py-4 lorem-write control-form border-top border-end border-start border-top"
                                placeholder="Write Comment"
                              />
                            </div>

                            <div className="d-flex align-items-center mb-4 ms-1 flex-row">
                              <input
                                type="checkbox"
                                id="save-info"
                                className="me-1 form-check-input"
                              />
                              <label
                                htmlFor="save-info"
                                className="save-para lorem-space text-dark text-start"
                              >
                                Save my name, email, and website in this browser
                                for the next time I comment.
                              </label>
                            </div>

                            <button
                              className="btn rounded text-light px-3 py-4 comment-post d-flex mt-3 mb-4 lorem-space"
                              type="button"
                            >
                              <Link
                                to="/blog"
                                className="text-light text-decoration-none"
                              >
                                Post Comment
                              </Link>
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p></p>
            )}

            <div className="col-12 col-sm-12 col-md-12 col-lg-4">
              <input
                type="search"
                className="form-control border py-4 mt-2 mb-2"
                placeholder="Search..."
              />
              <h5 className="mt-3 text-start">About Me</h5>

              <div className="border rounded p-3 mt-3">
                {Array.isArray(detail1) && detail1.length > 0 ? (
                  detail1.slice(0, 1).map((data) => (
                    <div key={data.id}>
                      <div className="d-flex justify-content-center w-100 align-items-center">
                        <img
                          src={`http://89.116.170.231:1600/api/src/image/${data.image}`}
                          alt="404"
                          className="w-25 rounded-5"
                        />
                      </div>

                      <div className="d-flex justify-content-center align-items-center mt-2 cart-cart">
                        {Array.isArray(data) && data.length > 0 ? (
                          data.name.split(" ").slice(0, 4).join(" ")
                        ) : (
                          <p></p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p></p>
                )}
              </div>

              <h5 className="mt-3 text-start">Latest Posts</h5>

              <div className="border rounded p-3 mt-3">
                {Array.isArray(detail1) && detail1.length > 0 ? (
                  detail1.slice(0, 3).map((data, key) => (
                    <div className="d-flex flex-row" key={key}>
                      <img
                        src={`http://89.116.170.231:1600/api/src/image/${data.image}`}
                        alt="404"
                        className="w-25 h-25 img-thumbnail me-2 mb-2 mb-lg-0"
                      />
                      <div className="d-flex flex-column ms-2 lh-lg">
                        <span>{data.date}</span>
                        <span className="text-success text-start">
                          {data.name}
                        </span>
                        <div className="border border-secondary w-100"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p></p>
                )}
              </div>

              <h5 className="mt-3 text-start cart-cart">Categories</h5>
              <div className="border rounded mt-3 lh-lg">
                <ul className="mt-2 text-start cart-cart bread-list">
                  <li>Crisp Bread & Cake</li>
                  <li>Fashion</li>
                  <li>Electronic</li>
                  <li>Commercial</li>
                  <li>Organic Fruits</li>
                </ul>
              </div>

              <h5 className="mt-3 text-start">Popular Tags</h5>

              <div className="border rounded mt-3 lh-lg">
                <div className="d-flex flex-row flex-wrap mt-2 ms-2 mb-2 gap-1">
                  {Array.isArray(welcome) && welcome.length > 0 ? (
                    welcome.slice(0, 6).map((data, key) => (
                      <Link
                        key={key}
                        to="/blog"
                        className="text-decoration-none text-light"
                      >
                        <button className="btn border d-flex btn-data">
                          {data.name}
                        </button>
                      </Link>
                    ))
                  ) : (
                    <p></p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <p
                className="ps-lg-0 ps-xl-3 ps-xxl-1 me-2 
              text-lg-start text-start pharmacy2 lh-lg"
              >
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

export default BlogDetails;
