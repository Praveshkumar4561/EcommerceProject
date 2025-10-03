import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./TermsCondition.css";
import Tonic from "../../assets/Tonic.svg";
import Hamburger from "../../assets/hamburger.svg";
import Close from "../../assets/Close.webp";
import UserContext from "../../context/UserContext";
import axios from "axios";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import { Helmet } from "react-helmet-async";

function TermsCondition() {
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

  let [cookie, setCookie] = useState([]);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (consent) {
      return;
    }

    const cookiedata = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/cookiesalldata"
        );
        setCookie([response.data]);
      } catch (error) {
        console.error("error", error);
      }
    };
    cookiedata();
  }, []);

  const handleCookieAccept = (data) => {
    localStorage.setItem("cookieConsent", JSON.stringify(data));
    setCookie((prevCookie) =>
      prevCookie.filter((item) => item.cookie !== "yes")
    );
  };

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
        <title>Terms & Conditions - User Agreement & Policies | Rxlyte</title>
        <meta
          name="description"
          content="Read our Terms & Conditions to understand your rights, responsibilities, and policies for using Rxlyte. Stay informed and shop with confidence."
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://demo.webriefly.com/terms-conditions"
        />
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
        <div className="container-custom ms-2 pt-lg-4 mt-lg-0 mt-5 pt-5 mb-auto mt-auto me-lg-0 me-2">
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
                    <span className="count-badge mt-2 mt-lg-1">{count6}</span>
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
                      Terms Condition
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
                    <ol className="breadcrumb d-flex flex-nowrap flex-row gap-0 overflow-hidden">
                      <li className="breadcrumb-item navbar-item fw-medium p-0">
                        <Link to="/" className="text-dark">
                          Home
                        </Link>
                      </li>
                      <li className="breadcrumb-item navbar-item fw-medium text-dark me-4 p-0">
                        Terms
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
              <h2 className="lorem-condition ms-2 ps-1 pt-4 text-start lorem-space fw-normal">
                Terms and Conditions
              </h2>

              <div className="lorem-typo lh-lg">
                <ul className="text-start me-sm-2 ms-4">
                  <li className="mt-2 ms-0 lorem-terms">
                    Before you do any business with RxLyte, please read the
                    terms and conditions listed below very carefully.
                  </li>

                  <li className="mt-2 ms-0 lorem-terms">
                    Please keep in mind that RxLyte can change its website,
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
                  <ul className="text-start ms-4">
                    <li className="mt-2 ms-0 lorem-terms">
                      RxLyte gets its goods from trustworthy manufacturers in
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
                  <ul className="text-start ms-4">
                    <li className="mt-2 ms-0 lorem-terms">
                      The generic drugs that RxLyte sells have the same
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
                  <ul className="text-start ms-4">
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
                  <ul className="text-start me-2 ms-4">
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
                      call RxLyte.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-2 pt-0 text-start lorem-space fw-normal">
                  Agreement to the Terms
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start me-2 ms-4">
                    <li className="mt-2 ms-0 lorem-terms">
                      You agree to these terms and conditions freely when you
                      buy something from our online medicine shop.
                    </li>

                    <li className="mt-2 ms-0 lorem-terms">
                      The fact that you are using RxLyte means that you have
                      read and agree to all of its policies.
                    </li>
                  </ul>
                </div>

                <h3 className="lorem-privacy ms-1 pt-0 text-start lorem-space fw-normal">
                  The information about you
                </h3>

                <div className="lorem-typo">
                  <ul className="text-start ms-4">
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
                      To protect customers' privacy, RxLyte uses SSL security to
                      keep all personally identifiable information safe while
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
                  <ul className="me-2 ms-4">
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
                  <ul className="text-start me-2 ms-4">
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

                <h4 className="lorem-privacy ms-3 pt-0 text-start lorem-space fw-normal">
                  Costs and schedules for shipping
                </h4>

                <div className="lorem-typo">
                  <ul className="text-start me-2 ms-4">
                    <li className="mt-1 ms-0 lorem-terms">
                      Shipping costs are based on the weight of the package for
                      all sales. Shipping may take up to 4 business days.
                    </li>
                  </ul>
                </div>

                <h4 className="lorem-privacy ms-2 ms-3 pt-0 text-start lorem-space fw-normal">
                  Changes to rates
                </h4>
                <div className="lorem-typo">
                  <ul className="text-start me-2 ms-4">
                    <li className="mt-1 ms-0 lorem-terms">
                      Because of things we can't control, shipping rates and
                      rules may change.
                    </li>
                  </ul>
                </div>

                <h4 className="lorem-privacy ms-2 ms-3 pt-0 text-start lorem-space fw-normal">
                  Shipping Address by Default
                </h4>
                <div className="lorem-typo">
                  <ul className="text-start me-2 ms-4">
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

      <div className="container-fluid">
        <div className="container">
          <div className="row theme-allow cart-cart">
            {Array.isArray(cookie) && cookie.length > 0
              ? cookie.map((data, key) => {
                  if (data.cookie !== "yes") return null;
                  const cardStyle = {
                    backgroundColor: data.backgroundColor,
                    color: data.textColor,
                    ...(data.style === "Minimal" && {
                      width: "388px",
                      height: "135px",
                      marginLeft: "2px",
                    }),
                  };

                  return (
                    <div
                      className="col-12 col-lg-12 col-md-12 border d-flex justify-content-center gap-5 align-items-center"
                      key={key}
                      style={cardStyle}
                    >
                      <div className="d-flex align-items-center justify-content-between w-100">
                        <span
                          className={
                            data.style === "Full Width"
                              ? "message-cookie ms-1"
                              : ""
                          }
                        >
                          {data.message}.
                        </span>
                        <button
                          className={`btn btn-dark d-flex cart-cart allow-site mt-1 button-cook mb-2 mt-2 btn-outline-light ${
                            data.style === "Full Width"
                              ? "button-cook-position"
                              : ""
                          }`}
                          onClick={() => handleCookieAccept(data)}
                        >
                          {data.button_text}
                        </button>
                      </div>
                    </div>
                  );
                })
              : null}
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
                  className="btn btn-success-accesses d-flex cart-cart1 py-4 me-0 ms-1"
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

export default TermsCondition;
