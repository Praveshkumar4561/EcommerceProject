import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import "./Cart.css";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
import Profile from "../../assets/image.png";
import Hamburger from "../../assets/hamburger.svg";
import Carts from "../../assets/Cart.svg";
import axios from "axios";
import UserContext from "../../context/UserContext";

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
    setIsDropdownOpen(!isDropdownOpen);
  };

  const [user, setUser] = useState([]);
  let { count, setCount } = useContext(UserContext);

  useEffect(() => {
    const cartdata = async () => {
      try {
        const response = await axios.get("/api/allcartdata");
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
      await axios.delete(`/api/deletecart/${id}`);
      const updatedUser = user.filter((item) => item.id !== id);
      setUser(updatedUser);
      console.log("Updated cart:", updatedUser);
    } catch (error) {
      console.error("Error deleting product:", error);
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

  return (
    <>
      <div className="container" id="container-custom">
        <div className="container-custom">
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
                      src={Carts}
                      alt="Cart"
                      className="img-fluid profiles1 mt-1"
                    />
                    <div className="addcarts ms-1 ps-1 pt-lg-1">{count}</div>
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
                    <Link className="nav-link" to="/blog">
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

          <main className="container mt-5">
            <h1
              className="fw-medium mb-3 text-center container-contact fs-2 cart-cart"
              style={{ zIndex: "1000", position: "relative" }}
            >
              Cart
            </h1>
            <nav aria-label="breadcrumb" id="container-contact1">
              <ol
                className="breadcrumb d-flex flex-wrap gap-0 cart-cart"
                style={{ zIndex: "1000", position: "relative" }}
              >
                <li className="breadcrumb-item navbar-item fw-medium">
                  <Link target="blank" to="/" className="text-dark">
                    Home
                  </Link>
                </li>

                <li className="breadcrumb-item navbar-item fw-medium text-dark">
                  Cart
                </li>
              </ol>
            </nav>
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
                        {user.map((data, key) => (
                          <tr className="cart-cart" key={key}>
                            <td className="d-flex align-items-center flex-row flex-row">
                              <div className="digital-table rounded-0 me-3 mb-4">
                                <img
                                  src={`/api/src/image/${data.image}`}
                                  alt=""
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
                                parseFloat(data.price.replace("$", "").trim()) *
                                data.quantity
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
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* <div className="d-flex">
                    <div className="container d-flex flex-column justify-content-md-center align-items-start justify-content-lg-center mt-1">
                      <h4 className="fw-b me-5 cart-cart">Add Promo Code</h4>
                      <div className="d-flex flex-row">
                        <input
                          type="text"
                          className="rounded me-2 ms-0 ms-lg-0 mt-2 form-control py-4 mb-2 rounded-0 cart-cart"
                          placeholder="Enter promo code"
                        />
                        <button className="btn btn-success px-3 mt-2 d-flex py-4 cart-cart rounded-0">
                          Apply
                        </button>
                      </div>
                    </div>
                  </div> */}
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
                        to="/checkout"
                      >
                        Proceed to checkout
                      </Link>
                    </button>

                    <Link
                      className="text-dark text-decoration-underline mt-2"
                      to="/product-details"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center cart-cart d-flex flex-column align-items-center">
                <span className="fs-3">Your cart is empty</span>
                <button className="btn btn-dark rounded-0 d-flex py-4 cart-cart mt-2">
                  <Link
                    className="text-light text-decoration-none"
                    to="/product-details"
                  >
                    Continue Shopping
                  </Link>
                </button>
              </div>
            )}
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

export default Cart;
