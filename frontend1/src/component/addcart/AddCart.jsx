import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./AddCart.css";
import image1 from "../../assets/Tonic.svg";
import "../../../src/assets/fonts/SanDiego.ttf";
import Tonic from "../../assets/Tonic.svg";
import Profile from "../../assets/image.png";
import Hamburger from "../../assets/hamburger.svg";
import Cart from "../../assets/Cart.svg";
import UserContext from "../../context/UserContext";

function AddCart() {
  let { count, setCount } = useContext(UserContext);

  useEffect(() => {
    cartdata();
  }, []);

  const cartdata = async () => {
    try {
      const response = await axios.get("http://localhost:1600/allcartdata");
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

                <div className="navbar-collapse d-none d-lg-block medium">
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

          {}

          <main className="container mt-5 cart-lorem">
            <h1 className="fw-medium mb-3 text-center container-contact fs-2">
              Add Cart
            </h1>
            <nav aria-label="breadcrumb" id="container-contact1">
              <ol className="breadcrumb d-flex flex-wrap gap-0">
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

      {}

      <div class="container-fluid cart-container d-flex cart-cart">
        <div class="row w-100">
          <div class="col-md-8">
            <div class="cart-title text-start cart-cart fw-medium">
              Shopping Cart
            </div>
            <div class="cart-details">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi,
              quae iste. Qui a quaerat iure ipsum illum ducimus nihil aliquid
              reiciendis maiores necessitatibus nisi odit nemo, sunt
              consequuntur minus quibusdam distinctio et, ipsam illo minima eum
              beatae? Quis, obcaecati dolore sit non quasi molestiae distinctio
              in quae incidunt laudantium, quisquam aliquid et dignissimos nemo
              eaque exercitationem cum, libero ullam doloremque esse minima?
              Tempore esse aliquam neque quas architecto hic! Sapiente, vero
              suscipit molestiae voluptatum deserunt, ullam vitae placeat
              accusamus enim nobis ab harum! Ut, doloremque minus voluptates sed
              mollitia et distinctio quas illum molestiae consequuntur,
              exercitationem pariatur adipisci dicta? Nulla tempora cupiditate,
              enim at sed officiis impedit recusandae aliquid totam expedita
              dignissimos in sunt nobis perferendis corporis et commodi dolores
              quos voluptatem cumque nemo! Modi, fugit accusantium quibusdam
              nulla debitis beatae neque perferendis sapiente, molestiae veniam
              eaque officia. Similique debitis, quo ab pariatur sint accusamus
              optio magni minima distinctio fugit quod cumque illo voluptate
              dolore natus sit enim officia rerum dicta eum. Quidem quibusdam
              rerum, qui vel impedit expedita repudiandae minus magni accusamus
              dignissimos consectetur at quo. Ea amet aliquid libero nobis
              laboriosam quam neque Lorem ipsum, dolor sit amet consectetur
              adipisicing elit. Repudiandae inventore optio at est doloremque
              facilis vel repellat, molestiae animi perspiciatis, veritatis eum
              ratione ipsum. Lorem, ipsum dolor sit amet consectetur adipisicing
              elit. Aliquid
            </div>
          </div>

          <div class="col-md-4 d-flex flex-column mt-lg-2 pt-lg-1 pt-0 mt-0 mt-md-2 order-delivery">
            <div class="delivery-banner flex-grow-1 d-flex w-100">
              <img
                src="https://storage.googleapis.com/a1aa/image/nMM8lYafat3UCS7X7Ru3axBcOYFTMfzGw7RPQW0klfbEJ8TnA.jpg"
                alt="Delivery person on a scooter illustration"
                height="100"
                width="100"
              />
              <div className="ms-3">
                <p className="text-start">
                  {" "}
                  <span style={{ fontFamily: "verdana" }}>$0%</span> delivery
                  charges on this order
                </p>
                <p class="free-delivery1 text-start">
                  Get Free delivery on your first order
                </p>
              </div>
            </div>
            <div class="payment-details flex-grow-1 w-100 mt-md-2">
              <h5>PAYMENT DETAILS</h5>
              <div class="d-flex justify-content-between lh-lg flex-row">
                <span>MRP Total</span>
                <span style={{ fontFamily: "verdana" }}>$ 03.00</span>
              </div>
              <div class="d-flex justify-content-between lh-lg flex-row">
                <span>Additional Discount</span>
                <span style={{ fontFamily: "verdana" }}>-$ 01.00</span>
              </div>
              <div class="d-flex justify-content-between lh-lg flex-row">
                <span>Total Amount</span>
                <span style={{ fontFamily: "verdana" }}>$ 03.00</span>
              </div>
              <div class="d-flex justify-content-between lh-lg flex-row">
                <span>Shipping/Delivery Charges</span>
                <span
                  style={{ fontFamily: "verdana" }}
                  className="ms-lg-5 ms-0 ps-5 ms-md-0 ps-md-2"
                >
                  <s>$ 04.00</s> $ 0.00
                </span>
              </div>
              <div class="d-flex justify-content-between total-payable lh-lg flex-row">
                <span>Total Payable</span>
                <span style={{ fontFamily: "verdana" }}>$ 03.00</span>
              </div>
              <div class="total-savings">
                Total Savings{" "}
                <span style={{ fontFamily: "verdana" }}>$ 01.00</span>
              </div>
              <div class="text-center mt-3">
                <span class="total-payable">
                  Total Payable{" "}
                  <span style={{ fontFamily: "verdana" }}>$ 03.00</span>
                </span>
              </div>
              <div className="d-flex justify-content-lg-center align-items-center justify-content-center">
                <button class="proceed-btn btn d-flex btn-success py-4 px-2 w-auto lorem-home fw-light">
                  PROCEED
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid product-carts cart-lorem">
        <h3 className="mt-sm-5 mt-5 mt-lg-1 pt-sm-4 text-lg-center text-xxl-start ms-xxl-3   text-md-center cart-cart">
          Featured Products
        </h3>
        <div className="container ms-0 ps-0 mb-5">
          <div className="row gap-2 d-flex justify-content-lg-center justify-content-md-center">
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 cards rounded border d-flex justify-content-lg-center justify-content-end align-items-lg-end align-items-center">
              <button className="btn btn-success d-flex mt-4 py-4 button cart-lorem mb-2">
                Add to Cart
              </button>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 cards rounded border d-flex justify-content-lg-center justify-content-end align-items-lg-end align-items-center">
              <button className="btn btn-success ms-5 d-flex mt-4 py-4 button cart-lorem mb-2">
                Add to Cart
              </button>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 cards rounded border d-flex justify-content-lg-center justify-content-end align-items-lg-end align-items-center">
              <button className="btn btn-success py-4 d-flex cart-lorem mb-2">
                Add to Cart
              </button>
            </div>
            <div className="col-12 col-sm-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 cards rounded border d-flex justify-content-lg-center justify-content-end align-items-lg-end align-items-center">
              <button className="btn btn-success d-flex py-4 cart-lorem mb-2">
                Add to Cart
              </button>
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

export default AddCart;
