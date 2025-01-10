import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./MedicinePolicy.css";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
import Profile from "../../assets/image.png";
import Hamburger from "../../assets/hamburger.svg";
import Cart from "../../assets/Cart.svg";
import UserContext from "../../context/UserContext";

function MedicinePolicy() {
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

  return (
    <>
      <div className="container cart-cart" id="container-custom">
        <div className="container-custom ms-4 ms-lg-0">
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

                <div className="navbar-icons d-sm-flex cart-cart">
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
              <div className="custom-dropdown cart-cart" ref={dropdownRef}>
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

          <main className="container mt-5">
            <h1 className="fw-medium mb-3 text-center container-contact fs-2 lorem-space">
              Medicine Policy
            </h1>
            <nav aria-label="breadcrumb" id="container-contact1">
              <ol className="breadcrumb d-flex flex-wrap gap-0">
                <li className="breadcrumb-item navbar-item fw-medium">
                  <Link target="blank" to="/" className="text-dark">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item navbar-item fw-medium lorem-space text-dark">
                  Medicine policy
                </li>
              </ol>
            </nav>
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid overflow-x-hidden position-relative">
        <div className="container">
          <div className="row gap-3 mt-4 pt-3 d-flex justify-content-xxl-start justify-content-lg-center justify-content-md-center me-1 me-sm-0">
            <div className="col-12 col-md-12 col-lg-12 blog-medicine bg-light h-auto">
              <h3 className="lorem-condition ms-2 ps-1 pt-4 text-start lorem-space fw-normal">
                Medicine Policy
              </h3>

              <div className="lorem-typo lh-lg">
                <ul className="text-start me-sm-2">
                  <li className="mt-2 ms-0 lorem-medicine-policy">
                    We have a wide selection of medicines at Rx Lyte, including
                    both generic and brand-name drugs
                  </li>

                  <li className="mt-2 ms-0 lorem-medicine-policy">
                    We want to give our customers a choice of both cheap generic
                    drugs and name-brand drugs so that we can meet their needs
                    and desires.
                  </li>
                </ul>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  What are brands-name medicines?
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start">
                    <li className="mt-2 ms-0 lorem-medicine-policy">
                      Medications that are sold without a brand name are called
                      generics or generic drugs.
                    </li>

                    <li className="mt-2 ms-0 lorem-medicine-policy">
                      In terms of what they are made of, side effects, how they
                      are taken, and dose, these medicines are the same as their
                      brand-name versions.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 ps- pt-0 text-start lorem-space fw-normal">
                  Low-cost performance
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start">
                    <li className="mt-2 ms-0 lorem-medicine-policy">
                      In contrast to brand-name drugs, whose makers spend a lot
                      of money on marketing and advertising, generic drug makers
                      don't spend any money on these things.
                    </li>

                    <li className="mt-2 ms-0 lorem-medicine-policy">
                      Because of this, generics are cheaper while still being
                      safe, effective, and of high quality.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  Composition and Ingredients That Don't Work
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start">
                    <li className="mt-2 ms-0 lorem-medicine-policy">
                      Guidelines from the World Health Organization (WHO) say
                      that generic drugs might not have the same inactive
                      ingredients as brand-name drugs.
                    </li>

                    <li className="mt-2 ms-0 lorem-medicine-policy">
                      Generic and named meds may have different inactive
                      ingredients, like fillers, colors, stabilizers, and
                      flavorings.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  How you look and what the law says
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start me-2">
                    <li className="mt-2 ms-0 lorem-medicine-policy">
                      Legal trademark rules say that a generic drug can't look
                      exactly like a brand-name drug, even if they both have the
                      same active ingredient and work the same way.
                    </li>

                    <li className="mt-2 ms-0 lorem-medicine-policy">
                      In other words, generic versions may not look the same as
                      brand-name copies.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  Making sure of quality
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start me-2">
                    <li className="mt-2 ms-0 lorem-medicine-policy">
                      In order to be legal, generic medicines must meet the same
                      high quality standards as brand-name medicines.
                    </li>

                    <li className="mt-2 ms-0 lorem-medicine-policy">
                      The World Health Organization (WHO) says that generic
                      drugs must be bioequivalent to their brand-name
                      counterparts. This means that they must have the same
                      safety and performance rating.
                    </li>

                    <li className="mt-2 ms-0 lorem-medicine-policy">
                      At Rx Lyte, all medicines, brand names or generics, must
                      strictly follow WHO guidelines.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-1 pt-0 text-start lorem-space fw-normal">
                  Policy on Prescriptions
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start">
                    <li className="mt-3 ms-0 lorem-medicine-policy">
                      For your comfort and to follow the rules for internet drug
                      shops, we may ask for a legal prescription for some
                      medicines.
                    </li>

                    <li className="mt-2 ms-0 lorem-medicine-policy">
                      Before you buy something from Rx Lyte, please read over
                      the following rules to avoid any problems:
                    </li>

                    <li className="mt-2 ms-0 lorem-medicine-policy">
                      You can send us a scanned copy of the prescription by
                      email at info@Rxlyte.com.
                    </li>

                    <li className="mt-2 ms-0 lorem-medicine-policy">
                      If you don't send us the prescription within 15 days of
                      making the online order, it will be canceled.
                    </li>

                    <li className="mt-2 ms-0 lorem-medicine-policy">
                      One of our customer service reps may call you to clear up
                      any questions or concerns you have about the order.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
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

export default MedicinePolicy;
