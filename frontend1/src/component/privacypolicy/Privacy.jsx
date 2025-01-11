import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Privacy.css";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
import Profile from "../../assets/image.webp";
import Hamburger from "../../assets/hamburger.svg";
import Cart from "../../assets/Cart.svg";
import UserContext from "../../context/UserContext";

function Privacy() {
  let { count, setCount } = useContext(UserContext);

  useEffect(() => {
    cartdata();
  }, []);

  const cartdata = async () => {
    try {
      const response = await axios.get("http://52.9.253.67:1600/allcartdata");
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
      {}
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

                {}

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

                {}
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
            <h1 className="fw-medium mb-3 text-center container-contact fs-2 lorem-space cart-cart">
              Privacy Policy
            </h1>
            <nav aria-label="breadcrumb" id="container-contact1">
              <ol className="breadcrumb d-flex flex-wrap gap-0 ms-4 ms-lg-0 ps-lg-0">
                <li className="breadcrumb-item navbar-item fw-medium">
                  <Link target="blank" to="/" className="text-dark">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item navbar-item fw-medium lorem-space text-dark">
                  Privacy
                </li>
              </ol>
            </nav>
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid overflow-x-hidden position-relative">
        <div className="container ms-2 ms-lg-0 ms-md-0">
          <div className="row gap-3 mt-4 pt-3 d-flex justify-content-xxl-start justify-content-lg-center justify-content-md-center me-1 me-sm-0">
            <div className="col-12 col-md-12 col-lg-12 blog-privacy bg-light h-auto">
              <h3 className="lorem-privacy ms-2 ps-1 pt-4 text-start lorem-space fw-normal">
                Privacy Policy
              </h3>

              <div className="lorem-typo lh-lg">
                <ul className="text-start me-sm-2">
                  <li className="mt-2 ms-0 lorem-privacy1">
                    Our customers and their privacy are the most important thing
                    to us at Rx Lyte.
                  </li>

                  <li className="mt-2 ms-0 lorem-privacy1">
                    We make sure that the information you give us when you log
                    in is well protected to keep your data safe.
                  </li>

                  <li className="mt-2 ms-0 lorem-privacy1">
                    You can be sure that this information will only be used to
                    improve your shopping experience with us.
                  </li>
                </ul>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  Personal Information We Gather{" "}
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start">
                    <li className="mt-2 ms-0 lorem-privacy1">
                      For the order to go through, we need to get some personal
                      information from you.{" "}
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 ps- pt-0 text-start lorem-space fw-normal">
                  Information about registering{" "}
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start">
                    <li className="mt-2 ms-0 lorem-privacy1">
                      When you sign up for any service that Rx Lyte offers, you
                      give us information about yourself as well.{" "}
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      This could include your name, location, ways to reach you,
                      and interests.{" "}
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  Email Address Details
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start">
                    <li className="mt-2 ms-0 lorem-privacy1">
                      In order to keep records, we may keep the text of your
                      emails, your email address, and your replies.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      These steps are taken when you choose to email us.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  What do they do with your personal data?
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start me-2">
                    <li className="mt-2 ms-0 lorem-privacy1">
                      Our goal is to improve, manage, and grow our business by
                      using the personally identifiable information we collect.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      For our customers, this information is used to improve
                      customer service, let you know about new goods and
                      services, and make your time on our website more
                      enjoyable.{" "}
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      You can choose not to share information with our online
                      pharmacy.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      Customers can change their minds at any time if they no
                      longer want to share personal information if it is no
                      longer needed or useful.{" "}
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      Customers are in the "opt-out" group until they clearly
                      agree (opts-in) to share their information. This means
                      they do not want to share.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      We always let our customers know when a third party is
                      collecting information that can be used to find out who
                      they are.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  What Are Cookies?
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start me-2">
                    <li className="mt-2 ms-0 lorem-privacy1">
                      Websites that you visit can make small text files called
                      cookies. Your computer browser saves them on your device.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      They do many things, such as keeping your login
                      information safe, keeping track of what you do online, and
                      helping websites give you a more personalized experience.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      These files have information in them that lets websites
                      identify your computer and learn about how you use the
                      internet.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      Please go to your browser's settings to change how cookies
                      are used.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-1 pt-0 text-start lorem-space fw-normal">
                  What We Do With The Data We Get From Cookies
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start">
                    <li className="mt-3 ms-0 lorem-privacy1">
                      We use the cookies we send to tell our customers apart and
                      give them a more unique experience.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      There are hypertext links on our site.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy1 ms-2 pt-0 text-start lorem-space fw-normal">
                  On Rx Lyte, you might find linked links that take you to other
                  websites.
                </h3>

                <div className="lorem-typo">
                  <ul className="me-2">
                    <li className="mt-0 ms-0 lorem-privacy1">
                      If you click on these links, you might be taken to sites
                      that have different privacy practices. The Privacy Policy
                      of the site you linked to will govern your privacy after
                      you leave our site.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-1 pt-0 text-start lorem-space fw-normal">
                  Giving Your OK
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start me-2">
                    <li className="mt-0 ms-0 lorem-privacy1">
                      You agree that your personally identifiable information
                      will be collected and used in the ways described in this
                      Privacy Policy when you use our online store and its
                      services.
                    </li>

                    <li className="mt-3 ms-0 lorem-privacy1">
                      Anytime you want, you can change your mind or remove your
                      agreement.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  Notifying People of Changes
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start me-2">
                    <li className="mt-1 ms-0 lorem-privacy1">
                      Rx Lyte looks at the Privacy Policy from time to time and
                      makes changes to it.
                    </li>

                    <li className="mt-2 ms-0 lorem-privacy1">
                      If this Privacy Statement is changed, we will post the
                      changes here and send an email to people who have agreed
                      to receive information from us.
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

export default Privacy;
