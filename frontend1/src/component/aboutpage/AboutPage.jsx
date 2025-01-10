import React, { useContext, useEffect, useRef, useState } from "react";
import "./AboutPages.css";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
import { Link } from "react-router-dom";
import Profile from "../../assets/image.png";
import Hamburger from "../../assets/hamburger.svg";
import free from "../../assets/free.png";
import Cash from "../../assets/Cash.png";
import Hoursupport from "../../assets/hoursupport.png";
import Quality from "../../assets/quality.png";
import Cart from "../../assets/Cart.svg";
import UserContext from "../../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function AboutUsPage() {
  let { count, setCount } = useContext(UserContext);

  useEffect(() => {
    cartdata();
  }, []);

  const cartdata = async () => {
    try {
      const response = await axios.get("http://50.18.56.183:1600/allcartdata");
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

  let [user, setUser] = useState([]);
  let [index, setIndex] = useState(0);

  useEffect(() => {
    let showdata = async () => {
      try {
        let response = await axios.get(
          "http://50.18.56.183:1600/gettestimonials"
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

  return (
    <>
      <div className="container" id="container-custom">
        <div className="container-custom ms-3">
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

                <div className="navbar-collapse">
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
                      <Link className="nav-link" to="/blog-details">
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
                    <div className="addcarts ms-1 ps-1 pt-0 pt-xxl-1 pt-xl-1">
                      {count}
                    </div>
                  </Link>
                </div>
              </div>
            </nav>

            {isDropdownOpen && (
              <div className="custom-dropdown rounded-0" ref={dropdownRef}>
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
                    <Link className="nav-link" to="/blog-details">
                      Blog
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/cart-page">
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

          <main className="container mt-5 lorem-about cart-cart">
            <h1
              className="fw-medium mb-3 text-center container-contact fs-2"
              style={{ position: "relative", zIndex: "1000" }}
            >
              About Us
            </h1>
            <nav aria-label="breadcrumb" id="container-contact1">
              <ol className="breadcrumb d-flex flex-wrap gap-0">
                <li
                  className="breadcrumb-item navbar-item fw-medium"
                  style={{ position: "relative", zIndex: "1000" }}
                >
                  <Link target="blank" to="/" className="text-dark">
                    Home
                  </Link>
                </li>
                <li
                  className="breadcrumb-item navbar-item fw-medium text-dark"
                  style={{ position: "relative", zIndex: "1000" }}
                >
                  About us
                </li>
              </ol>
            </nav>
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-xl text-lg-center mt-3 lorem-about">
        <h2 className="tonic-font fs-5 ms-lg-0 ms-xxl-5 me-lg-0 me-xxl-5 me-xl-5 lh-lg">
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
          <div className="row mt-5 d-flex justify-content-lg-end justify-content-center align-items-center gap-0 flex-row me-1 ms-1 me-lg-4 ms-lg-0">
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 mb-4 box1 bg-light rounded-1 d-flex flex-column align-items-center lorem-about h-auto shadow-lg me-2 me-lg-3 me-xl-0 me-xxl-0">
              <img src={free} alt="" className="mt-3" />

              <p className="fw-normal free-delivery me-5 fs-5 lorem-about">
                Free Delivery
              </p>
              {/* <p className="mt-0 px-3 lh-lg text-start lorem-elit">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea nam
                culpa dicta reprehenderit consequuntur maiores laboriosam vero!
              </p> */}
            </div>
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 mb-4 box1 bg-light rounded-1 d-flex flex-column align-items-center lorem-about h-auto shadow-lg me-2 ms- me-lg-0">
              <img src={Cash} alt="" className="mt-3" />
              <p className="fw-normal free-delivery fs-5 me-4 lorem-about">
                10% Cash Back
              </p>
              {/* <p className="mt-0 px-3 lh-lg text-start lorem-elit">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea nam
                culpa dicta reprehenderit consequuntur maiores laboriosam vero!
              </p> */}
            </div>
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 mb-4 box1 bg-light rounded-1 d-flex flex-column align-items-center h-1 lorem-about shadow-lg me-2 me-lg-3 me-xl-0 me-xxl-0">
              <img src={Quality} alt="" className="mt-3" />
              <p className="fw-normal free-delivery fs-5 lorem-about me-4">
                Quality Product
              </p>
              {/* <p className="mt-0 px-3 lh-lg text-start lorem-elit">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea nam
                culpa dicta reprehenderit consequuntur maiores laboriosam vero!
              </p> */}
            </div>
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 mb-4 box1 bg-light rounded-1 d-flex flex-column align-items-center h-auto lorem-about shadow-lg me-2 me-lg-0">
              <img src={Hoursupport} alt="" className="mt-3" />
              <p className="fw-normal free-delivery fs-5 me-5 pe-2">
                24/7 support
              </p>
              {/* <p className="mt-0 px-3 lh-lg text-start lorem-elit">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea nam
                culpa dicta reprehenderit consequuntur maiores laboriosam vero!
              </p> */}
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
                    src={`/api/src/image/${user[index].image}`}
                    alt="404"
                    className="mt-4 mb-1 about-name"
                  />
                  <h3 className="fw-medium text-center mt-1 load-rubb1">
                    {user[index].name}
                  </h3>
                  <p className="text-dark text-start lh-lg load-rubb1">
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

export default AboutUsPage;
