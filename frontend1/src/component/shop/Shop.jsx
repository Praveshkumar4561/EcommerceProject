import React, { useContext, useEffect, useRef, useState } from "react";
import "./Shop.css";
import { Link } from "react-router-dom";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
import free from "../../assets/free.webp";
import Cash from "../../assets/Cash.webp";
import Close from "../../assets/Close.webp";
import Discount from "../../assets/discount.webp";
import Hoursupport from "../../assets/hoursupport.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faHeart } from "@fortawesome/free-solid-svg-icons";
import Hamburger from "../../assets/hamburger.svg";
import axios from "axios";
import UserContext from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import JsonLd from "../JsonLd";

function Shop() {
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

  let [image, setImage] = useState([]);

  useEffect(() => {
    productimage();
  }, []);

  let productimage = async () => {
    let response = await axios.get(
      "http://89.116.170.231:1600/productpagedata"
    );
    setImage(response.data);
  };

  let [detail, setDetail] = useState([]);

  useEffect(() => {
    detailsdata();
  }, []);

  let detailsdata = async () => {
    try {
      let response = await axios.get(
        "http://89.116.170.231:1600/productpagedata"
      );
      setDetail(response.data);
    } catch (error) {
      console.error("Error occurred", error);
    }
  };

  let { count, setCount } = useContext(UserContext);

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
      const response = await axios.post(
        "http://89.116.170.231:1600/addcart",
        formData
      );
      setCount((prevCount) => prevCount + 1);
      toast.success("Product successfully added on the cart", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Product is not added on the cart", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  let [label, setLabel] = useState([]);

  useEffect(() => {
    let labeldata = async () => {
      let response = await axios.get(
        "http://89.116.170.231:1600/productlabelsdata"
      );
      setLabel(response.data);
    };
    labeldata();
  });

  let addWishlistItem = async (data) => {
    const formData = new FormData();
    formData.append("product_name", data.name);
    formData.append("store", data.store);
    formData.append("price", data.price);
    formData.append("price_sale", data.price_sale);
    formData.append("sku", data.sku);
    const imageFileName = data.image ? data.image.split("/").pop() : null;
    if (imageFileName) {
      formData.append("image", imageFileName);
    } else {
      console.log("No image file available for this product.");
    }
    try {
      const response = await axios.post(
        "http://89.116.170.231:1600/wishlistpost",
        formData
      );
      setCount6((prevCount) => prevCount + 1);
      toast.success("Product successfully added on the wishlist", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Product is not added on the wishlist", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
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
            `http://89.116.170.231:1600/src/image/${response.data.logo_url}`
          );
          setLogoHeight(response.data.logo_height || "45");
        }
      })
      .catch((error) => console.error("Error fetching logo:", error));
  }, []);

  let [user, setUser] = useState("");

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/get-theme-breadcrumb"
        );
        setUser(response.data);
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

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/get-theme-breadcrumb"
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching breadcrumb settings:", error);
      }
    };
    fetchBreadcrumbData();
  }, []);

  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
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
            name: "Shop",
            item: "http://srv724100.hstgr.cloud/shop",
          },
        ],
      },
      ...detail.slice(0, 5).map((item) => ({
        "@type": "Product",
        name: item.name,
        image: item.image,
        description: item.description,
        brand: {
          "@type": "Brand",
          name: item.brand,
        },
        sku: item.sku,
        offers: {
          "@type": "Offer",
          url: item.url || window.location.href,
          priceCurrency: "USD",
          price: item.price_sale ? item.price_sale : item.price,
          priceValidUntil: item.saleEndDate || undefined,
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: item.ratingValue || 4.9,
          bestRating: item.bestRating || 5,
          ratingCount: item.ratingCount || 5842,
        },
      })),
    ],
  };

  return (
    <>
      <JsonLd data={schemaData} />

      <div
        className="container"
        id="container-customx"
        style={{
          backgroundColor:
            user?.background_color ||
            (user?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: user?.background_image
            ? `url(http://89.116.170.231:1600/src/image/${user.background_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: user?.breadcrumb_height
            ? `${user.breadcrumb_height}px`
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
                    <span className="count-badge mt-2 mt-lg-1 pt-0 mt-md-1">
                      {count6}
                    </span>
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
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={Carthome}
                      alt="Cart"
                      className="img-fluid profiles1 mt-1 pt-0 navbar-shop cart-image"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="addcarts ps-2 pt-lg-0 mt-lg-0 count-badge1">
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
            {user?.enable_breadcrumb === "yes" &&
              user?.breadcrumb_style !== "none" && (
                <>
                  {user?.hide_title !== "yes" && (
                    <h1
                      className={`fw-medium mb-3 text-center container-contact fs-2 container-style ${
                        user?.breadcrumb_style === "without title"
                          ? "d-none"
                          : ""
                      }`}
                    >
                      Shop
                    </h1>
                  )}

                  <nav
                    aria-label="breadcrumb"
                    id="container-contact1"
                    className={`ms-5 ps-3 ms-lg-0 ps-lg-0 ${
                      user?.breadcrumb_style === "without title" ||
                      user?.breadcrumb_style === "align start"
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
                      <li className="breadcrumb-item navbar-item fw-medium text-dark p-0">
                        Shop
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
        <div className="container mb-5">
          {Array.isArray(image) && image.length > 0 && (
            <div className="row ms-lg-0 gap-4 d-flex flex-row">
              {image.slice(0, 5).map((data, key) => (
                <div
                  className="col-6 col-sm-4 col-md-3 col-lg-2 border show-product"
                  key={key}
                >
                  <Link to={`/${url.productDetails}`} className="text-dark">
                    <img
                      src={`http://89.116.170.231:1600/src/image/${data.image}`}
                      alt={`Product Image ${key + 1}`}
                    />
                    <div className="position-absolute ms-4 mt-2 fw-bold d-flex flex-row flex-md-nowrap w-100 cart-cart1">
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
          <div className="row gap-2 gap-lg-2 d-flex flex-row flex-wrap">
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 border rounded bg-light d-flex flex-row py-lg-0 py-xxl-1 py-xl-3 shop-icon me-auto align-items-md-center">
              <img src={free} alt="RxLYTE" className="img-fluid mt-4 mb-4" />
              <div className="d-flex flex-column mt-4 ms-3 text-start">
                <span>Free Delivery</span>
                <span>Orders from all item</span>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 border rounded bg-light d-flex flex-row py-lg-0 shop-icon me-auto align-items-md-center py-xxl-1 py-xl-1">
              <img
                src={Cash}
                alt="RxLYTE"
                className="img-fluid w-25 mt-4 mb-4"
              />
              <div className="d-flex flex-column mt-2 mt-lg-4 ms-3 text-start">
                <span>Return & Refund</span>
                <span>Money-back guarantee</span>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 border rounded bg-light d-flex flex-row py-lg-1 py-0 shop-icon me-auto align-items-md-center">
              <img
                src={Discount}
                alt="RxLYTE"
                className="img-fluid mt-2 mb-4 w-25 rounded-5 pt-3"
              />
              <div className="d-flex flex-column mt-4 ms-3 text-start">
                <span>Member Discount</span>
                <span>
                  Every order over{" "}
                  <span style={{ fontFamily: "verdana" }}>$140.00</span>
                </span>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-3 border rounded bg-light d-flex flex-row py-lg-1 py-0 shop-icon me-auto align-items-md-center">
              <img
                src={Hoursupport}
                alt="RxLYTE"
                className="img-fluid mt-3 mb-4 w-25 pt-2"
              />
              <div className="d-flex flex-column mt-4 ms-2 ps-1 text-start">
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
                ? `http://89.116.170.231:1600/src/image/${data.image}`
                : "/path/to/default-image.jpg";
              return (
                <div
                  className="col-12 col-lg-3 col-md-6 text-center border rounded feature-watch px-0 px-lg-1"
                  key={index}
                >
                  <div className="feature-box rounded-0 position-relative rounded-1">
                    {data.label && (
                      <button
                        className="position-absolute me-2 end-0 btn d-flex mt-2 rounded-0 cart-cart product-label text-light"
                        style={{ backgroundColor: labelColor }}
                      >
                        {data.label}
                      </button>
                    )}
                    <Link to={`/${url.productDetails}`}>
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
                    <h6 className="mt-0 lh-base text-start text-lg-start">
                      SKU:{data.sku || "Product Name"}
                    </h6>
                    <div
                      className="d-flex justify-content-start justify-content-lg-start mb-2 gap-1 mt-2 flex-row"
                      style={{ fontFamily: "verdana" }}
                    >
                      <h6 className="me-1">{data.price || "Price"}</h6>
                      <strike className="text-danger fw-medium">
                        {data.price_sale || "$54"}
                      </strike>
                    </div>
                  </div>
                </div>
              );
            })}
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

export default Shop;
