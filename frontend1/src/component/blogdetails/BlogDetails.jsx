import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./BlogDetails.css";
import Tonic from "../../assets/Tonic.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faComment,
  faEnvelope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Hamburger from "../../assets/hamburger.svg";
import Close from "../../assets/Close.webp";
import UserContext from "../../context/UserContext";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import { Helmet } from "react-helmet-async";
import axios from "axios";

function BlogDetails() {
  let { count, setCount } = useContext(UserContext);

  useEffect(() => {
    const cartdata = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/allcartdata"
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

  let alldata = async () => {
    let response = await axios.get(
      "https://demo.webriefly.com/api/blogalldata"
    );
    setWelcome(response.data);
  };
  alldata();

  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);
  const [welcome, setWelcome] = useState([]);

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(
          `https://demo.webriefly.com/api/blogpostdata/${id}`
        );
        setBlog(
          Array.isArray(response.data) ? response.data[0] : response.data
        );
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };
    fetchBlogDetails();
  }, [id]);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/blogpostdata"
        );
        setLatestPosts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching latest posts:", error);
        setLatestPosts([]);
      }
    };
    fetchLatestPosts();
  }, []);

  useEffect(() => {
    const fetchWelcomeData = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/welcomedata"
        );
        setWelcome(response.data);
      } catch (error) {
        console.error("Error fetching welcome data:", error);
      }
    };
    fetchWelcomeData();
  }, []);

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
      .get("https://demo.webriefly.com/api/get-theme-logo")
      .then((response) => {
        if (response.data) {
          setLogoUrl(
            `https://demo.webriefly.com/uploads/${response.data.logo_url}`
          );
          setLogoHeight(response.data.logo_height || "45");
        }
      })
      .catch((error) => console.error("Error fetching logo:", error));
  }, []);

  let [count6, setCount6] = useState(0);

  useEffect(() => {
    const wishlistdata = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/wishlistdata"
        );
        setCount6(response.data.length);
      } catch (error) {
        console.error("Error fetching wishlist data:", error);
      }
    };
    wishlistdata();
  }, []);

  let [cart, setCart] = useState("");

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/get-theme-breadcrumb"
        );
        setCart(response.data);
      } catch (error) {
        console.error("Error fetching breadcrumb settings:", error);
      }
    };
    fetchBreadcrumbData();
  }, []);

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
      await axios.post("https://demo.webriefly.com/api/newsletterpost", letter);
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
      <Helmet>
        <title>In-Depth Blog Insights - Read Expert Articles | Rxlyte</title>
        <meta
          name="description"
          content="Explore in-depth articles, expert tips, and industry insights. Stay updated with the latest blogs on health, wellness, and shopping trends at Rxlyte."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://demo.webriefly.com/blog-details" />
      </Helmet>

      <div
        className="container"
        id="container-customx"
        style={{
          backgroundColor:
            cart?.background_color ||
            (cart?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: cart?.background_image
            ? `url(https://demo.webriefly.com/uploads/${cart.background_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: cart?.breadcrumb_height
            ? `${cart.breadcrumb_height}px`
            : "190px",
        }}
      >
        <div className="container-custom ms-2 pt-lg-4 mt-lg-0 mt-5 pt-5 mb-auto mt-auto me-lg-0 me-0">
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
                    <span className="count-badge mt-2 mt-lg-1 mt-md-1 count-car">
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

          <main className="container mt-4 clutch-detail">
            <nav
              aria-label="breadcrumb"
              id="container-contact1"
              className="ms-0 ps-0 ms-lg-0 ps-lg-0 export-blog1"
            >
              <ol className="breadcrumb d-flex flex-wrap gap-0 link-class mt-3 mt-lg-5">
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
                <li className="breadcrumb-item navbar-item fw-medium lorem-space text-dark cart-cart">
                  Blog
                </li>
                <li className="breadcrumb-item navbar-item1 fw-medium lorem-space text-dark cart-cart overflow-hidden">
                  {Array.isArray(blog) ? (
                    blog.length > 0 ? (
                      blog.map((data, key) => (
                        <span key={key}>{data.name}</span>
                      ))
                    ) : (
                      <span></span>
                    )
                  ) : blog && blog.name ? (
                    <span>{blog.name}</span>
                  ) : (
                    <span></span>
                  )}
                </li>
              </ol>
            </nav>
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid">
        <div className="container p-0">
          <div className="row gap-0 gap-xxl-0 gap-xl-0 me-0 d-flex flex-lg-nowrap flex-md-wrap ms-lg-0 ms-0">
            {blog ? (
              <div
                className="col-12 col-sm-12 col-md-12 col-lg-8 mt-4 details-plant"
                key={blog.id}
              >
                <div className="blog-box1">
                  <img
                    src={`https://demo.webriefly.com/uploads/${blog.image}`}
                    alt="RxLYTE"
                    className="img-fluid w-100 h-100 mb-0"
                  />
                </div>
                <div className="bg-light d-flex flex-column">
                  <div className="d-flex flex-row gap-2 ms-2 mt-0">
                    <FontAwesomeIcon
                      icon={faCalendarDays}
                      className="text-success ms-1 mt-2 pt-lg-1"
                    />
                    <div className="text-start mt-lg-2 mt-1 fw-medium text-dark lorem-space mb-0">
                      {new Date(blog.date).toLocaleDateString()}
                    </div>
                  </div>
                  <h2 className="lorem-dummy ms-2 me-5 text-start lorem-space m-0 fw-normal lh-base mb-0 pb-0 fw-bold mt-lg-1 contact-phone">
                    {blog.name}
                  </h2>
                  <h2 className="english-read ms-2 mt-0 me-5 mb-0 text-start lorem-space lh-lg text-dark contact-phone">
                    {blog.categories}
                  </h2>
                  <h2 className="english-read ms-2 mt-0 me-5 text-start lorem-space text-dark contact-phone">
                    {blog.author_name}
                  </h2>
                  <div className="english-read cart-cart1 ms-2 me-5 mt-1 text-start lh-lg text-dark">
                    {blog.description}
                  </div>
                  <div className="d-flex flex-column">
                    <div className="cart-cart d-flex ms-2 flex-row gap-1">
                      <h2 className="contact-phone">Tags:</h2>
                      {Array.isArray(welcome) && welcome.length > 0 ? (
                        welcome.slice(0, 3).map((tag, key) => (
                          <div className="ms-0" key={key}>
                            <button className="btn btn-transparent border d-flex">
                              <Link
                                to="/blog"
                                className="text-decoration-none text-dark cart-cart"
                              >
                                {tag.name}
                              </Link>
                            </button>
                          </div>
                        ))
                      ) : (
                        <div>No tags</div>
                      )}
                      <div className="review-detail">
                        <h2 className="fw-normal contact-phone ms-2 mt-3 text-start mt-5 pt-0 cart-cart">
                          Reviews
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className="container mt-0">
                    <div className="row">
                      <div className="col-12 col-md-8 col-lg-6 review-page mt-0 rounded-0">
                        <h2 className="fw-normal mb-4 mt-1 lorem-space text-start contact-phone">
                          Write A Review
                        </h2>
                        <form method="post">
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
                                className="form-control fw-medium border-top-0 py-4 control-form lorem-space lorem-write lorem-write1 ps-5"
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

                          <div className="mb-3 cart-cart1 d-flex justify-content-start align-items-start">
                            <Link
                              to="/blog"
                              className="text-light text-decoration-none px-2 d-inline-block bg-comment"
                              style={{ height: "40px", lineHeight: "40px" }}
                            >
                              Post Comment
                            </Link>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div></div>
            )}

            <div className="col-12 col-sm-12 col-md-12 col-lg-4 mt-3 cluthes-wear1">
              <input
                type="search"
                className="form-control border py-4 mt-2 mb-2 cart-cart"
                placeholder="Search..."
              />
              <h5 className="mt-3 text-start">About Me</h5>
              <div className="border rounded p-3 mt-3">
                {blog ? (
                  <div>
                    <div className="d-flex justify-content-lg-center justify-content-md-start w-100 align-items-center">
                      <img
                        src={`https://demo.webriefly.com/uploads/${blog.image}`}
                        alt="RxLYTE"
                        className="w-25 rounded-5"
                      />
                    </div>
                    <div className="d-flex justify-content-lg-center justify-content-md-start align-items-center mt-2 cart-cart">
                      {blog.name
                        ? blog.name.split(" ").slice(0, 4).join(" ")
                        : ""}
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>

              <h5 className="mt-3 text-start">Latest Posts</h5>

              <div className="border rounded p-3 mt-3">
                {Array.isArray(latestPosts) && latestPosts.length > 0 ? (
                  latestPosts.slice(0, 3).map((post, key) => (
                    <div className="d-flex flex-row" key={key}>
                      <img
                        src={`https://demo.webriefly.com/uploads/${post.image}`}
                        alt="RxLYTE"
                        className="w-25 h-25 img-thumbnail me-2 mb-lg-1"
                      />
                      <div className="d-flex flex-column ms-0 cluthes-wear cart-cart text-start">
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                        <span className="text-success text-start">
                          {post.name}
                        </span>
                        <div className="border border-secondary w-100"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No latest posts</div>
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
                    welcome.slice(0, 6).map((tag, key) => (
                      <Link
                        key={key}
                        to="/blog"
                        className="text-decoration-none text-light"
                      >
                        <button className="btn border d-flex btn-data">
                          {tag.name}
                        </button>
                      </Link>
                    ))
                  ) : (
                    <div className="text-start">No tags</div>
                  )}
                </div>
              </div>
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
                  className="btn btn-success-product d-flex cart-cart1 py-4 me-0 ms-1"
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
    </>
  );
}

export default BlogDetails;
