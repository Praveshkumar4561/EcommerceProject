import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "./Cart.css";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
import Profile from "../../assets/image.webp";
import Hamburger from "../../assets/hamburger.svg";
import Carts from "../../assets/Cart.svg";
import Close from "../../assets/Close.webp";
import axios from "axios";
import UserContext from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Carthome from "../../assets/Carthome1.webp";
import Wishlists from "../../assets/Wishlists1.webp";
import Accounts from "../../assets/Accounts1.webp";

function Cart() {
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
  let { count, setCount } = useContext(UserContext);

  useEffect(() => {
    const cartdata = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/allcartdata"
        );
        const updatedData = response.data.map((item) => ({
          ...item,
          quantity: 1,
        }));
        setUser(updatedData);
        setCount(response.data.length);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    cartdata();
  }, []);

  const deletedata = async (id) => {
    try {
      await axios.delete(`http://89.116.170.231:1600/deletecart/${id}`);
      const updatedUser = user.filter((item) => item.id !== id);
      setUser(updatedUser);
      toast.success("Product successfully removed on the cart", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Product is not removed on the cart", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const updateQuantity = (id, action) => {
    const updatedUser = user.map((item) => {
      if (item.id === id) {
        const updatedQuantity =
          action === "increase" ? item.quantity + 1 : item.quantity - 1;
        return { ...item, quantity: Math.max(updatedQuantity, 1) };
      }
      return item;
    });
    setUser(updatedUser);
  };

  const subtotal = user.reduce((acc, curr) => {
    const price = parseFloat(curr.price.replace("$", "").trim());
    return !isNaN(price) ? acc + price * curr.quantity : acc;
  }, 0);
  const total = subtotal;

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
            `http://89.116.170.231:1600/src/image/${response.data.logo_url}`
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

  let [cartwish, setCartWish] = useState([]);

  useEffect(() => {
    const wishlistdata = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/wishlistdata"
        );
        setCartWish(response.data.length);
      } catch (error) {
        console.error("Error fetching wishlist data:", error);
      }
    };
    wishlistdata();
  });

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
            ? `url(http://89.116.170.231:1600/src/image/${cart.background_image})`
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
                    <span className="count-badge mt-1">{cartwish}</span>
                    <img
                      src={Wishlists}
                      alt="RxLYTE"
                      className="cart-image profiles1 mt-1 navbar-shop"
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
                      className="profiles1 img-fluid me-3 mt-1 navbar-shop"
                    />
                  </Link>

                  <Link
                    to={`/${url.cart}`}
                    className="nav-link d-flex nav-properties1"
                  >
                    <img
                      src={Carthome}
                      alt="Cart"
                      className="img-fluid profiles1 mt-1 pt-0 navbar-shop"
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
                      Cart
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
                        Cart
                      </li>
                    </ol>
                  </nav>
                </>
              )}
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid">
        <div className="container mt-lg-4 rounded d-flex flex-column align-items-center">
          <div className="row d-flex w-100 me-2">
            {user.length > 0 ? (
              <>
                <div className="col-lg-8 col-12 col-md-12">
                  <div className="table table-container-content">
                    <table className="table mt-2">
                      <thead>
                        <tr className="text-lg-start text-center cart-cart">
                          <th className="fw-medium bg-light">Product</th>
                          <th className="fw-medium bg-light">Price</th>
                          <th className="fw-medium bg-light">Quantity</th>
                          <th className="fw-medium bg-light">Total</th>
                          <th className="bg-light"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(user) && user.length > 0 ? (
                          user.map((data, key) => (
                            <tr className="cart-cart" key={key}>
                              <td className="d-flex align-items-center flex-row flex-row">
                                <div className="digital-table rounded-0 me-3 mb-4">
                                  <img
                                    src={`http://89.116.170.231:1600/src/image/${data.image}`}
                                    alt="RxLYTE"
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="d-flex flex-column">
                                  <span className="digital-band text-start">
                                    {data.name}
                                  </span>
                                  <p className="brown-table text-success digital-band ms-0">
                                    {data.stockstatus}
                                  </p>
                                  <p className="brown-table1 text-dark ms-0 text-start">
                                    Vendor: {data.store}
                                  </p>
                                </div>
                              </td>
                              <td
                                className="table-dollar lh-lg"
                                style={{ fontFamily: "verdana" }}
                              >
                                {data.price}
                                <strike className="ms-2">
                                  {data.price_sale}
                                </strike>
                              </td>

                              <td className="border rounded-5 py-1 px-0">
                                <div
                                  className="border rounded-5 me-2 ms-2 bg-light"
                                  style={{ cursor: "pointer" }}
                                >
                                  <span
                                    className="ms-4 fw-medium fs-4"
                                    onClick={() =>
                                      updateQuantity(data.id, "decrease")
                                    }
                                  >
                                    -
                                  </span>
                                  <span className="ms-4 fw-medium fs-5">
                                    {data.quantity}
                                  </span>
                                  <span
                                    className="ms-4 fw-medium fs-4 me-3"
                                    onClick={() =>
                                      updateQuantity(data.id, "increase")
                                    }
                                  >
                                    +
                                  </span>
                                </div>
                              </td>
                              <td
                                className="lh-lg"
                                style={{ fontFamily: "verdana" }}
                              >
                                $
                                {(
                                  parseFloat(
                                    data.price.replace("$", "").trim()
                                  ) * data.quantity
                                ).toFixed(2)}
                              </td>
                              <td style={{ cursor: "pointer" }}>
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  className="text-danger"
                                  onClick={() => deletedata(data.id)}
                                />
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" className="text-center"></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="col-lg-4 col-md-12 d-flex flex-column align-items-center cart-cart">
                  <h4 className="fw-medium text-center mt-1 cart-cart">
                    Cart Totals
                  </h4>
                  <div className="cart-border mt-3 rounded-0 d-flex flex-column p-3 w-100">
                    <div className="d-flex justify-content-between flex-row">
                      <span className="text-start fs-5">Subtotal:</span>
                      <span
                        className="text-start fs-5"
                        style={{ fontFamily: "verdana" }}
                      >
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-lg-between flex-row justify-content-between">
                      <span className="text-start fs-5">Tax:</span>
                      <span
                        className="text-start fs-5"
                        style={{ fontFamily: "verdana" }}
                      >
                        $0.00
                      </span>
                    </div>
                    <div className="d-flex justify-content-lg-between flex-row justify-content-between mt-3">
                      <span className="text-start fs-5">Total:</span>
                      <span
                        className="text-start fs-5"
                        style={{ fontFamily: "verdana" }}
                      >
                        ${total.toFixed(2)}
                      </span>
                    </div>

                    <button className="btn btn-success cart-cart w-75 w-auto py-4 mt-4 ms-lg-4 d-flex mb-2 rounded-0">
                      <Link
                        className="text-light text-decoration-none"
                        to={`/${url.checkout}`}
                      >
                        Proceed to checkout
                      </Link>
                    </button>

                    <Link
                      className="text-dark text-decoration-underline mt-2"
                      to={`/${url.productDetails}`}
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center cart-cart d-flex flex-column align-items-center">
                <span className="fs-3">Your cart is empty</span>
                <button className="btn btn-success rounded d-flex py-4 cart-cart1 mt-2">
                  <Link
                    className="text-light text-decoration-none"
                    to={`/${url.productDetails}`}
                  >
                    Continue Shopping
                  </Link>
                </button>
              </div>
            )}
          </div>
        </div>
        <ToastContainer />
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
                  <h5 className="mb-3">Company</h5>
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
                  <h5 className="mb-3">Help?</h5>
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
                      <Link className="text-white text-decoration-none">
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

            <div className="col-12 col-md-6 col-lg-3 col-xl-3 mx-auto mt-2 ms-lg-5 mt-lg-5 pt-3 ms-0 footer-list">
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
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <hr className="my-4 me-3" />

          <div className="row align-items-center footer-lyte1">
            <div className="col-md-6 col-lg-7">
              <p className="text-md-start text-center mb-0">
                &copy; {new Date().getFullYear()} RxTonic. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Cart;
