import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./TermsCondition.css";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
import Profile from "../../assets/image.webp";
import Hamburger from "../../assets/hamburger.svg";
import Cart from "../../assets/Cart.svg";
import UserContext from "../../context/UserContext";
import axios from "axios";

function TermsCondition() {
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

  let [cart, setCart] = useState("");

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/get-theme-breadcrumb"
        );
        setCart(response.data);
      } catch (error) {
        console.error("Error fetching breadcrumb settings:", error);
      }
    };
    fetchBreadcrumbData();
  }, []);

  return (
    <>
      <div
        className="container"
        id="container-custom"
        style={{
          backgroundColor:
            cart?.background_color ||
            (cart?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: cart?.background_image
            ? `url(http://89.116.170.231:1600/api/src/image/${cart.background_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: cart?.breadcrumb_height
            ? `${cart.breadcrumb_height}px`
            : "190px",
        }}
      >
        <div className="container-custom ms-2 pt-lg-4 mt-lg-0 mt-5 pt-5 mb-auto mt-auto">
          <header className="d-flex flex-wrap justify-content-between py-2 mb-5 border-bottom bg-body rounded-2 container-custom1">
            <nav className="navbar navbar-expand-lg navbar-light w-100 d-flex flex-row flex-nowrap">
              <div className="container">
                <Link className="navbar-brand d-non d-lg-block" to="/">
                  <img
                    src={logoUrl || image1}
                    alt="Tonic Logo"
                    className="img-fluid"
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

          <main className="container mt-5 cart-cart">
            {cart?.enable_breadcrumb === "yes" &&
              cart?.breadcrumb_style !== "none" && (
                <>
                  {cart?.hide_title !== "yes" && (
                    <h1
                      className={`fw-medium mb-3 text-center container-contact fs-2 container-style ${
                        cart?.breadcrumb_style === "without title"
                          ? "d-none"
                          : ""
                      }`}
                    >
                      Terms and Conditions
                    </h1>
                  )}

                  <nav
                    aria-label="breadcrumb"
                    id="container-contact1"
                    className={`ms-5 ps-3 ms-lg-0 ps-lg-0 ${
                      cart?.breadcrumb_style === "without title" ||
                      cart?.breadcrumb_style === "align start"
                        ? "d-flex justify-content-start align-items-center w-50"
                        : "d-flex justify-content-center align-items-center"
                    }`}
                  >
                    <ol className="breadcrumb d-flex flex-wrap gap-0">
                      <li className="breadcrumb-item navbar-item fw-medium">
                        <Link target="_blank" to="/" className="text-dark">
                          Home
                        </Link>
                      </li>
                      <li className="breadcrumb-item navbar-item fw-medium text-dark">
                        Terms Condition
                      </li>
                    </ol>
                  </nav>
                </>
              )}
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid overflow-x-hidden position-relative">
        <div className="container">
          <div className="row gap-3 mt-4 pt-3 d-flex justify-content-xxl-start justify-content-lg-center justify-content-md-center me-1 me-sm-0">
            <div className="col-12 col-md-12 col-lg-12 blog-condition bg-light h-auto">
              <h3 className="lorem-condition ms-2 ps-1 pt-4 text-start lorem-space fw-normal">
                Terms and Conditions
              </h3>

              <div className="lorem-typo lh-lg">
                <ul className="text-start me-sm-2">
                  <li className="mt-2 ms-0 lorem-terms">
                    Before you do any business with Rx Lyte, please read the
                    terms and conditions listed below very carefully.
                  </li>

                  <li className="mt-2 ms-0 lorem-terms">
                    Please keep in mind that Rx Lyte can change its website,
                    rules, and laws at any time and for any reason.
                  </li>

                  <li className="mt-2 ms-0 lorem-terms">
                    Before you buy something from us, you should always check
                    the most recent version of our terms and conditions.
                  </li>
                </ul>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  Things Being Sold
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start">
                    <li className="mt-2 ms-0 lorem-terms">
                      Rx Lyte gets its goods from trustworthy manufacturers in
                      India and other places, making sure they meet FDA and WHO
                      standards.
                    </li>

                    <li className="mt-2 ms-0 lorem-terms">
                      People can buy in bulk, but they can only use the goods
                      for their own purposes; they can't sell them to others.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 ps- pt-0 text-start lorem-space fw-normal">
                  Quality and Composition of the Product
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start">
                    <li className="mt-2 ms-0 lorem-terms">
                      The generic drugs that Rx Lyte sells have the same
                      chemicals as the brand-name drugs sold in the US.
                    </li>

                    <li className="mt-2 ms-0 lorem-terms">
                      A lot of Indian drug companies buy rights from the big
                      drug companies to make protected prescription drugs, which
                      they then sell for a low price.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  News about billing and orders
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start">
                    <li className="mt-2 ms-0 lorem-terms">
                      Your credit card will be charged right away after the buy,
                      and you'll get an email confirming payment information.
                    </li>

                    <li className="mt-2 ms-0 lorem-terms">
                      Please keep in mind that we don't ship orders within 24
                      hours so that you have time to update, change, or delete
                      your address and/or the item you ordered.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  Terms of Service
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start me-2">
                    <li className="mt-2 ms-0 lorem-terms">
                      People who use our services agree that the medicines they
                      buy are only for their own use and not to be sold again.
                    </li>

                    <li className="mt-2 ms-0 lorem-terms">
                      The person using the medicine knows and agrees that it is
                      made and packed in different countries. The place of
                      origin is clearly written on the package.
                    </li>

                    <li className="mt-2 ms-0 lorem-terms">
                      People who want to take medicine should talk to a doctor
                      or nurse first.
                    </li>

                    <li className="mt-2 ms-0 lorem-terms">
                      If you use our services, you agree to follow all local and
                      foreign rules about shopping for and using medicines.
                    </li>

                    <li className="mt-2 ms-0 lorem-terms">
                      If there are any problems with a sale, buyers must first
                      call Rx Lyte.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  Agreement to the Terms
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start me-2">
                    <li className="mt-2 ms-0 lorem-terms">
                      You agree to these terms and conditions freely when you
                      buy something from our online medicine shop.
                    </li>

                    <li className="mt-2 ms-0 lorem-terms">
                      The fact that you are using Rx Lyte means that you have
                      read and agree to all of its policies.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-1 pt-0 text-start lorem-space fw-normal">
                  The information about you
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start">
                    <li className="mt-3 ms-0 lorem-terms">
                      Your privacy and security are very important to us.
                    </li>

                    <li className="mt-2 ms-0 lorem-terms">
                      The information we get from customers is only used to make
                      shopping better for them.
                    </li>

                    <li className="mt-2 ms-0 lorem-terms">
                      Rest assured that we will not share any information that
                      could be used to identify you with a third party unless
                      the law requires it.
                    </li>

                    <li className="mt-2 ms-0 lorem-terms">
                      To protect customers' privacy, Rx Lyte uses SSL security
                      to keep all personally identifiable information safe while
                      it's being sent. To keep credit card information safe and
                      private, it is kept in a computer that is protected and
                      not connected to the internet.Not connected to the
                      internet.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-terms ms-2 pt-0 text-start lorem-space fw-normal">
                  Giving Your OK
                </h3>

                <div className="lorem-typo">
                  <ul className="me-2">
                    <li className="mt-0 ms-0 lorem-terms">
                      If you use our services, you agree that we can receive and
                      use your personally identifiable information in the ways
                      that we explain in our Privacy Policy.
                    </li>
                    <li className="mt-0 ms-0 lorem-terms">
                      If this policy is changed, it will be quickly posted on
                      this page to let people know.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-1 pt-0 text-start lorem-space fw-normal">
                  Your Thoughts
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start me-2">
                    <li className="mt-0 ms-0 lorem-terms">
                      We value what you have to say. Please email us at
                      info@Rxlyte.com if you have any questions or comments
                      about our terms and conditions.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  How to Ship Things
                </h3>

                <h4 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  Costs and schedules for shipping
                </h4>

                <div className="lorem-typo">
                  <ul className="text-start me-2">
                    <li className="mt-1 ms-0 lorem-terms">
                      Shipping costs are based on the weight of the package for
                      all sales. Shipping may take up to 4 business days.
                    </li>
                  </ul>
                </div>

                <h4 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  Changes to rates
                </h4>
                <div className="lorem-typo">
                  <ul className="text-start me-2">
                    <li className="mt-1 ms-0 lorem-terms">
                      Because of things we can't control, shipping rates and
                      rules may change.
                    </li>
                  </ul>
                </div>

                <h4 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  Shipping Address by Default
                </h4>
                <div className="lorem-typo">
                  <ul className="text-start me-2">
                    <li className="mt-1 ms-0 lorem-terms">
                      The last address that was used for sending is the usual
                      shipping address. If you want to change your postal
                      address, you can do so by clicking the "Select A Different
                      Address" button.
                    </li>

                    <li className="mt-1 ms-0 lorem-terms">
                      You will be able to choose a different address from the
                      ones that are already saved, or you can add a new one.
                    </li>
                  </ul>
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

export default TermsCondition;
