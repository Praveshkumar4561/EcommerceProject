import React, { useContext, useEffect, useRef, useState } from "react";
import "./Shop.css";
import { Link, useNavigate } from "react-router-dom";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
import Shipping from "../../assets/Shipping.svg";
import Support from "../../assets/Support.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons";
import Profile from "../../assets/image.png";
import Hamburger from "../../assets/hamburger.svg";
import Cart from "../../assets/Cart.svg";
import UserContext from "../../context/UserContext";
import axios from "axios";

function Shop() {
  let { count, setCount } = useContext(UserContext);

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

  useEffect(() => {
    cartdata();
  }, []);

  const cartdata = async () => {
    try {
      const response = await axios.get("/api/allcartdata");
      setCount(response.data.length);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };
  cartdata();

  let [image, setImage] = useState([]);

  let productimage = async () => {
    let response = await axios.get("/api/productpagedata");
    setImage(response.data);
  };

  useEffect(() => {
    productimage();
  }, []);

  let { navigate } = useNavigate();

  let [detail, setDetail] = useState([]);

  let detailsdata = async () => {
    try {
      let response = await axios.get("/api/productpagedata");
      setDetail(response.data);
    } catch (error) {
      console.error("Error occurred", error);
    }
  };
  detailsdata();

  const addCartItem = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("store", data.store);
    formData.append("price", data.price);
    formData.append("price_sale", data.price_sale);
    if (data.image) {
      formData.append("image", data.image);
    } else {
      console.log("No image file available for this product.");
    }
    try {
      const response = await axios.post("/api/addcart", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Product successfully added in the cart");
      navigate("/cart");
      detailsdata();
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  let [label, setLabel] = useState([]);

  let labeldata = async () => {
    let response = await axios.get("/api/productlabelsdata");
    setLabel(response.data);
  };
  labeldata();

  let addWishlistItem = async (data) => {
    const formData = new FormData();
    formData.append("product_name", data.name);
    const imageFileName = data.image ? data.image.split("/").pop() : null;
    if (imageFileName) {
      formData.append("image", imageFileName);
    } else {
      console.log("No image file available for this product.");
    }
    try {
      const response = await axios.post("/api/wishlistpost", formData);
      alert("Product successfully added to the wishlist");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  return (
    <>
      <div className="container" id="container-custom">
        <div className="container-custom ms-2">
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

          <main className="container mt-5 cart-cart">
            <h1 className="fw-medium mb-3 text-center container-contact fs-2">
              Shop
            </h1>
            <nav aria-label="breadcrumb" id="container-contact1">
              <ol className="breadcrumb d-flex flex-wrap gap-0">
                <li className="breadcrumb-item navbar-item fw-medium">
                  <Link target="blank" to="/" className="text-dark">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item navbar-item fw-medium text-dark">
                  Shop
                </li>
              </ol>
            </nav>
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid">
        <div className="container mb-5">
          {Array.isArray(image) && image.length > 0 && (
            <div className="row ms-lg-0 gap-4 d-flex flex-row">
              {image.slice(0, 5).map((data, key) => (
                <div
                  className="col-6 col-sm-4 col-md-3 col-lg-2 border show-product"
                  key={key}
                >
                  <Link to="/product-details" className="text-dark">
                    <img
                      src={`/api/src/image/${data.image}`}
                      alt={`Product Image ${key + 1}`}
                    />
                    <div className="position-absolute ms-4 mt-2 fw-bold">
                      {key === 0 && "HeadPhones"}
                      {key === 1 && "Digital Watch"}
                      {key === 2 && "Soundbar"}
                      {key === 3 && "EarPhones"}
                      {key === 4 && "Mobile Phone"}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container-fluid">
        <div className="container">
          <div className="row gap-0 gap-lg-2 d-flex flex-row flex-wrap">
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 border rounded bg-light d-flex flex-row py-lg-1 py-xxl-3 py-xl-3 shop-icon me-auto">
              <img src={Shipping} alt="" className="img-fluid mt-4 mb-4" />
              <div className="d-flex flex-column mt-4 ms-3 pt-">
                <span>Free Delivery</span>
                <span>Orders from all item</span>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 border rounded bg-light d-flex flex-row py-3 shop-icon me-auto">
              <img src={Shipping} alt="" className="img-fluid" />
              <div className="d-flex flex-column mt-2 mt-lg-4 ms-3">
                <span>Return & Refund</span>
                <span>Money-back guarantee</span>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 border rounded bg-light d-flex flex-row py-3 shop-icon me-auto">
              <img src={Shipping} alt="" className="img-fluid mt-3 mb-4" />
              <div className="d-flex flex-column mt-4 ms-1">
                <span>Member Discount</span>
                <span>Every order over $140.00</span>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 border rounded bg-light d-flex flex-row py-3 shop-icon me-auto">
              <img src={Support} alt="" className="img-fluid mt-3 mb-4" />
              <div className="d-flex flex-column mt-4 ms-1">
                <span>Support 24/7</span>
                <span>Contact us 24 hours a day</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-3 mt-lg-0 cart-cart">
        <h3 className="mt-lg-4 mt-0 text-start">Trending Products</h3>
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 mt-0 row-cols-md-4 gap-2 g-3 d-flex flex-row flex-wrap me-md-2 me-lg-0">
            {detail.map((data, index) => {
              const productLabel = label.find(
                (item) => item.name === data.label
              );
              const labelColor = productLabel ? productLabel.color : "green";
              const productImage = data.image
                ? `/api/src/image/${data.image}`
                : "/path/to/default-image.jpg";
              return (
                <div
                  className="col-12 col-lg-3 col-md-6 text-center border rounded feature-watch"
                  key={index}
                >
                  <div className="feature-box rounded-0 position-relative rounded-1">
                    {data.label && (
                      <button
                        className="position-absolute end-0 btn d-flex mt-2 rounded-0 cart-cart product-label text-light"
                        style={{ backgroundColor: labelColor }}
                      >
                        {data.label}
                      </button>
                    )}
                    <Link to="/product-details">
                      <img
                        src={productImage}
                        alt={data.name || "Product Image"}
                        className="w-100 h-100 object-fit-cover border-0 image-watch"
                        style={{ cursor: "pointer" }}
                      />
                    </Link>
                    <button
                      className="position-absolute me-1 btn btn-light wishlist-button wishlist-button1 text-light btn-success"
                      onClick={() => addWishlistItem(data)}
                    >
                      <FontAwesomeIcon icon={faHeart} />
                      <div className="wishlist-button-content">
                        Add to Wishlist
                      </div>
                    </button>
                    <div className="add-to-cart-button-container">
                      <button
                        className="add-to-cart-button mt-4 d-flex flex-row"
                        style={{ whiteSpace: "nowrap" }}
                        onClick={() => addCartItem(data)}
                      >
                        <FontAwesomeIcon
                          icon={faCartShopping}
                          className="me-2 mt-0"
                        />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <hr />
                  <div className="ms-3">
                    <h6 className="mt-2 mb-0 lh-base text-start text-lg-start">
                      {data.store || "Product Name"}
                    </h6>
                    <h5 className="mt-0 lh-base text-start text-lg-start">
                      {data.name || "Product Name"}
                    </h5>
                    <div
                      className="d-flex justify-content-start justify-content-lg-start mb-2 gap-1 mt-2 flex-row"
                      style={{ fontFamily: "verdana" }}
                    >
                      <h6 className="me-1">{data.price || "Price"}</h6>
                      <strike className="text-danger fw-medium">
                        {data.discountPrice || "$54"}
                      </strike>
                    </div>
                  </div>
                </div>
              );
            })}
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

export default Shop;
