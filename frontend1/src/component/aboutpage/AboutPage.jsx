import React, { useContext, useEffect, useRef, useState } from "react";
import "./AboutPages.css";
import Tonic from "../../assets/Tonic.svg";
import { Link } from "react-router-dom";
import Hamburger from "../../assets/hamburger.svg";
import free from "../../assets/free.webp";
import Cash from "../../assets/Cash.webp";
import Hoursupport from "../../assets/hoursupport.webp";
import Quality from "../../assets/quality.webp";
import Close from "../../assets/Close.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import UserContext from "../../context/UserContext";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import JsonLd from "../JsonLd";
import { Helmet } from "react-helmet";

function AboutUsPage() {
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

  let [user, setUser] = useState([]);
  let [index, setIndex] = useState(0);

  useEffect(() => {
    let showdata = async () => {
      try {
        let response = await axios.get(
          "http://89.116.170.231:1600/gettestimonials"
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };
    showdata();
  }, []);

  let leftAbout = () => {
    setIndex((previndex) => (previndex > 0 ? previndex - 1 : user.length - 1));
  };

  let rightAbout = () => {
    setIndex((previndex) => (previndex < user.length - 1 ? previndex + 1 : 0));
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

  let [about, setAbout] = useState("");

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/get-theme-breadcrumb"
        );
        setAbout(response.data);
      } catch (error) {
        console.error("Error fetching breadcrumb settings:", error);
      }
    };
    fetchBreadcrumbData();
  }, []);

  let [count6, setCount6] = useState("");

  useEffect(() => {
    wishlistdata();
  }, []);

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

  const schemaData = {
    "@context": "http://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        name: "About RxLyte",
        url: "http://srv724100.hstgr.cloud/about",
        description:
          "Learn more about RxLyte, a modern ecommerce platform offering premium healthcare products.",
        mainEntity: {
          "@type": "Organization",
          name: "RxLyte",
          url: "http://srv724100.hstgr.cloud/",
          logo: "http://srv724100.hstgr.cloud/Tonic.svg",
          description:
            "RxLyte is a trusted ecommerce store providing high-quality healthcare products.",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+1-800-654-3210",
            contactType: "customer service",
            areaServed: "US",
            availableLanguage: "English",
          },
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
            name: "About",
            item: "http://srv724100.hstgr.cloud/about",
          },
        ],
      },
    ],
  };

  return (
    <>
      <JsonLd data={schemaData} />

      <Helmet>
        <title>About Us - Learn More About Our eCommerce Brand</title>
        <meta
          name="description"
          content="Discover our story, mission, and values at [Your Brand Name]. We are committed to providing top-quality products and exceptional customer service."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://srv724100.hstgr.cloud/about" />
      </Helmet>

      <div
        className="container"
        id="container-customx"
        style={{
          backgroundColor:
            about?.background_color ||
            (about?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: about?.background_image
            ? `url(http://89.116.170.231:1600/src/image/${about.background_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: about?.breadcrumb_height
            ? `${about.breadcrumb_height}px`
            : "190px",
        }}
      >
        <div className="container-custom ms-2 pt-lg-4 mt-lg-0 mt-5 pt-5 mb-auto mt-auto">
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
                    <span className="count-badge mt-1">{count6}</span>
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
            {about?.enable_breadcrumb === "yes" &&
              about?.breadcrumb_style !== "none" && (
                <>
                  {about?.hide_title !== "yes" && (
                    <h1
                      className={`fw-medium mb-3 text-center container-contact fs-2 container-style ${
                        about?.breadcrumb_style === "without title"
                          ? "d-none"
                          : ""
                      }`}
                    >
                      About Us
                    </h1>
                  )}

                  <nav
                    aria-label="breadcrumb"
                    id="container-contact1"
                    className={`ms-5 ps-3 ms-lg-0 ps-lg-0 ${
                      about?.breadcrumb_style === "without title" ||
                      about?.breadcrumb_style === "align start"
                        ? "d-flex justify-content-start align-items-center w-50"
                        : "d-flex justify-content-center align-items-center"
                    }`}
                  >
                    <ol className="breadcrumb d-flex flex-nowrap flex-row gap-0 overflow-hidden">
                      <li className="breadcrumb-item navbar-item fw-medium p-0">
                        <Link target="_blank" to="/" className="text-dark">
                          Home
                        </Link>
                      </li>
                      <li className="breadcrumb-item navbar-item fw-medium text-dark me-5 p-0">
                        About us
                      </li>
                    </ol>
                  </nav>
                </>
              )}
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-xl text-lg-center mt-3 lorem-about">
        <h2 className="tonic-font fs-5 ms-lg-0 ms-xxl-5 me-lg-0 me-xxl-5 me-xl-5 lh-base cart-cart">
          Rx Tonic is dedicated to assisting individuals in obtaining the
          prescription drugs they need at a reasonable cost.
        </h2>

        <div className="container">
          <div className="row mt-0">
            <div className="col-12">
              <p className="para-class lh-lg text-start">
                We at Rx Tonic think that everyone should have access to
                resaonably priced prescription drugs.Nobody should ever have to
                decide between providing for their family's needs and filling a
                prescription.This explains thee existance of Rx Tonic and the
                ardor with which our staff approaches our mission!
              </p>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <p className="para-class1 text-start lh-lg">
                With over 950 medicines that cover the majority of chronic
                conditions, our fully regulated nonprofit online pharmacy is
                accessible. Prescriptions may be readily mailed in quantities of
                30, 60, 90, or 180 days to your house or the office of your
                physician.
              </p>
            </div>
          </div>
          <div className="row mt-1">
            <div className="col-12">
              <p className="para-class2 text-start lh-lg">
                Because of our dedication to patients and solid relationships
                with pharmaceutical companies and donations, we are able to
                lower the cost of prescriptions for you. Our team comprises more
                than 70 certified pharmacists, pharmacy technicians, and patient
                care advocates, all working together to provide reliable and
                trustworthy healthcare solutions.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid d-flex justify-content-center align-items-center">
        <div className="container text-center container-width h-auto pb-4">
          <h3 className="fw-medium fs-2 mt-4 lorem-about">Our Expertise</h3>

          <div className="row mt-lg-5 d-flex justify-content-lg-end justify-content-center align-items-center gap-lg-3 gap-md-1 flex-row me-1 ms-1 me-lg-4 ms-lg-0">
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 mb-4 box1 bg-light rounded-1 d-flex flex-column align-items-center lorem-about h-auto shadow-lg me-2 me-lg-3 me-xl-0 me-xxl-0">
              <img src={free} alt="RxLYTE" className="mt-3" />

              <p className="fw-normal free-delivery me-5 fs-5 lorem-about">
                Free Delivery
              </p>
            </div>
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 mb-4 box1 bg-light rounded-1 d-flex flex-column align-items-center lorem-about h-auto shadow-lg me-2 ms- me-lg-0">
              <img src={Cash} alt="RxLYTE" className="mt-3" />
              <p className="fw-normal free-delivery fs-5 me-4 lorem-about">
                10% Cash Back
              </p>
            </div>
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 mb-4 box1 bg-light rounded-1 d-flex flex-column align-items-center h-1 lorem-about shadow-lg me-2 me-lg-3 me-xl-0 me-xxl-0">
              <img src={Quality} alt="RxLYTE" className="mt-3" />
              <p className="fw-normal free-delivery fs-5 lorem-about me-4">
                Quality Product
              </p>
            </div>
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 mb-4 box1 bg-light rounded-1 d-flex flex-column align-items-center h-auto lorem-about shadow-lg me-2 me-lg-0">
              <img src={Hoursupport} alt="RxLYTE" className="mt-3" />
              <p className="fw-normal free-delivery fs-5 me-5 pe-2">
                24/7 support
              </p>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-center fw-normal mt-5 lorem-about">
        Client Testimonial
      </h2>

      <div className="container-fluid d-flex justify-content-center">
        <div className="container mt-0 d-flex justify-content-center align-items-center mb-sm-5 me-sm-3">
          {user.length > 0 && (
            <>
              <div
                className="border rounded-5 me-0 me-lg-5 me-sm-4 px-3 py-2 border-success text-success d-flex"
                style={{ cursor: "pointer" }}
                onClick={leftAbout}
              >
                <FontAwesomeIcon icon={faArrowLeft} className="fs-5" />
              </div>

              <div className="row column-div1 rounded-1 bg-body shadow-lg mb-4 mb-sm-0 me-1">
                <div
                  className="col pb-3 d-flex flex-column align-items-center"
                  id="column-div"
                >
                  <img
                    src={`http://89.116.170.231:1600/src/image/${user[index].image}`}
                    alt="RxLYTE"
                    className="mt-4 mb-1 about-name"
                  />
                  <h3 className="fw-medium text-center mt-1 load-rubb1">
                    {user[index].name}
                  </h3>
                  <p className="text-dark text-start lh-lg cart-cart">
                    {user[index].content}
                  </p>
                </div>
              </div>

              <div
                className="border rounded-5 ms-lg-5 ms-xxl-4 ms-xl-4 ms-0 px-3 ms-sm-2 py-2 border-success text-light bg-success d-flex align-items-center"
                style={{ cursor: "pointer" }}
                onClick={rightAbout}
              >
                <FontAwesomeIcon icon={faArrowRight} className="fs-5" />
              </div>
            </>
          )}
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

export default AboutUsPage;
