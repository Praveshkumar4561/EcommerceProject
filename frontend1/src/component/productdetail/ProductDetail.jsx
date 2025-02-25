import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./ProductDetail.css";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
import Close from "../../assets/Close.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRightLong,
  faCartShopping,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import Hamburger from "../../assets/hamburger.svg";
import axios from "axios";
import UserContext from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Carthome from "../../assets/Carthome1.webp";
import Wishlists from "../../assets/Wishlists1.webp";
import Accounts from "../../assets/Accounts1.webp";

function ProductDetail() {
  let { count, setCount } = useContext(UserContext);

  useEffect(() => {
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
  });

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

  const [activeTab, setActiveTab] = useState("description");

  const renderContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <>
            <div className="container m-0 p-0 card-details">
              <div className="row mt-lg-2 mt-0 me-lg-3">
                <div className="col-12">
                  <div className="car bg-body rounded">
                    {shop.length > 0 && (
                      <div className="card-body card-details h-auto mt-0">
                        <h2 className="card-title fw-light text-start">
                          Product Description
                        </h2>
                        <p className="text-dark lh-lg text-start">
                          {selectedDescription || shop[0].description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "additional Info":
        return (
          <>
            <div className="container">
              <div className="row mt-lg-2 mt-0 me-lg-3 w-auto">
                <div className="col-12">
                  <div className="car bg-body rounded">
                    <div className="card-body h-auto product-viva1 mt-2">
                      <h4 className="card-titlxe fs- fw-medium text-start">
                        Additional Information
                      </h4>

                      <ul className="lh-lg d-flex flex-column">
                        <li className="text-dark text-start">
                          <FontAwesomeIcon
                            icon={faArrowRightLong}
                            className="me-2 fs-5 ms-1 lorem-ipsum text-dark"
                          />
                          Wipe clean with a damp cloth.
                        </li>
                        <li className="text-start">
                          <FontAwesomeIcon
                            icon={faArrowRightLong}
                            className="me-lg-2 fs-5 ms-1 lorem-ipsum text-success"
                          />{" "}
                          Avoid exposure to harsh chemicals or extreme
                          temperatures.
                        </li>
                        <li className="text-start">
                          <FontAwesomeIcon
                            icon={faArrowRightLong}
                            className="me-lg-2 fs-5 ms-1 lorem-ipsum text-dark"
                          />{" "}
                          Customer support available 24/7 for any inquiries or
                          issues.
                        </li>
                        <li className="text-start">
                          <FontAwesomeIcon
                            icon={faArrowRightLong}
                            className="me-lg-2 fs-5 ms-1 lorem-ipsum text-dark"
                          />{" "}
                          Compatible with most devices and accessories (please
                          check specifications for details).
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "reviews":
        return (
          <>
            <div className="container">
              <div className="row mt-lg-2 mt-0 me-lg-3 w-auto">
                <div className="col-12">
                  <div className="car bg-body rounded">
                    <div className="card-body h-auto product-viva1 mt-2">
                      <h4 className="card-titlxe fs- fw-medium text-start">
                        User Reviews
                      </h4>

                      <ul className="lh-lg d-flex flex-column">
                        <li className="text-dark text-start">
                          ⭐️⭐️⭐️⭐️⭐️ <br />{" "}
                          <span className="fw-bold">Jane D :</span> Absolutely
                          love this product! The quality is outstanding and it
                          fits perfectly in my space. Highly recommend.
                        </li>
                        <li className="text-start">
                          ⭐️⭐️⭐️⭐️ <br />{" "}
                          <span className="fw-bold">Mark S :</span> Great value
                          for the price. It works well for my needs, although I
                          wish it came in more colors.
                        </li>
                        <li className="text-start">
                          ⭐️⭐️⭐️⭐️⭐️ <br />{" "}
                          <span className="fw-bold">Emily R :</span> I bought
                          this for my office, and it has transformed the space.
                          Stylish and functional!"
                        </li>
                        <li className="text-start">
                          ⭐️⭐️⭐️
                          <br /> <span className="fw-bold">Tom L :</span> It's a
                          good product, but I had some trouble with the
                          assembly. Customer service was helpful, though.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case "image":
        return (
          <>
            <div className="container">
              <div className="row mt-lg-2 mt-0 me-lg-3 w-auto">
                <div className="col-12">
                  <div className="ca1rd bg-body rounded">
                    <div className=" h-auto product-viva1 mt-2">
                      {detail.length > 0 && (
                        <div>
                          <img
                            src={
                              selectedImage ||
                              `http://89.116.170.231:1600/src/image/${detail[0].image}`
                            }
                            alt="Product"
                            className="img-fluid"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  let [detail, setDetail] = useState([]);

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
  detailsdata();

  let [shop, setShop] = useState([]);

  useEffect(() => {
    const shopdata = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/productpagedata"
        );
        setShop(response.data);
      } catch (error) {
        console.error("Error occurred", error);
      }
    };
    shopdata();
  }, []);

  let increment = () => {
    if (counts === 100) {
      setCounts(counts(100));
    } else {
      setCounts(counts + 1);
    }
  };

  let decrement = () => {
    if (counts === 100) {
      setCounts(counts(100));
    } else {
      setCounts(counts - 1);
    }
  };

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedSale, setSelectedSale] = useState("");
  const [selectedSku, setSelectedSku] = useState("");
  let [counts, setCounts] = useState(1);

  const applyImage = (
    imageUrl,
    name,
    description,
    price,
    store,
    price_sale,
    sku
  ) => {
    setSelectedImage(imageUrl);
    setSelectedName(name);
    setSelectedDescription(description);
    setSelectedPrice(price);
    setSelectedStore(store);
    setSelectedSale(price_sale);
    setSelectedSku(sku);
  };

  const addCartItem = async () => {
    const imageFileName = selectedImage.split("/").pop();
    const formData = new FormData();
    formData.append("name", selectedName);
    formData.append("store", selectedStore);
    formData.append("price", selectedPrice);
    formData.append("price_sale", selectedSale);
    if (imageFileName) {
      formData.append("image", imageFileName);
    } else {
      console.log("No image file available for this product.");
    }
    try {
      const response = await axios.post(
        "http://89.116.170.231:1600/addcart",
        formData
      );
      toast.success("Product successfully added on the cart", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Product is not added on the cart", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

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
      toast.success("Product successfully added on the wishlist", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      detailsdata();
    } catch (error) {
      toast.error("Product is not added on the wishlist", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  let [user, setUser] = useState([]);

  let tagdata = async () => {
    let response = await axios.get("http://89.116.170.231:1600/producttagdata");
    setUser(response.data);
  };
  tagdata();

  const addCartItem1 = async (data) => {
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
      toast.success("Product successfully added on the cart", {
        position: "bottom-right",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      detailsdata();
    } catch (error) {
      toast.error("Product is not added on the cart", {
        position: "bottom-right",
        autoClose: 1500,
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

  let [bread, setBread] = useState("");

  useEffect(() => {
    const fetchBreadcrumbData = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/get-theme-breadcrumb"
        );
        setBread(response.data);
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
                    <span className="count-badge mt-2 mt-lg-1">{cartwish}</span>
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

          <main className="container mt-5 cart-cart container-bread">
            {bread?.enable_breadcrumb === "yes" &&
              bread?.breadcrumb_style !== "none" && (
                <>
                  {bread?.hide_title !== "yes" && (
                    <h1
                      className={`fw-medium mb-3 text-center container-contact fs-2 container-style ${
                        bread?.breadcrumb_style === "without title"
                          ? "d-none"
                          : ""
                      }`}
                    >
                      Products
                    </h1>
                  )}

                  <nav
                    aria-label="breadcrumb"
                    id="container-contact1"
                    className={`ms-5 ps-3 ms-lg-0 ps-lg-0 ${
                      bread?.breadcrumb_style === "without title" ||
                      bread?.breadcrumb_style === "align start"
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
                        Products
                      </li>
                    </ol>
                  </nav>
                </>
              )}
          </main>
        </div>
      </div>
      <div></div>

      <div className="container-fluid overflow-hidden d-flex justify-content-center align-items-center position-relative overflow-x-hidden">
        <div className="container d-flex justify-content-center">
          <div className="row mt-5 d-flex flex me-md-1">
            {Array.isArray(shop) && shop.length > 0 ? (
              shop.slice(0, 1).map((key) => (
                <div
                  className="col-12 col-lg-6 col-md-6 shop-div d-flex gap-2 d-flex w-100 border"
                  key={key}
                >
                  <div
                    className="d-flex flex-lg-column flex-row flex-md-column gap-1 gap-lg-3 flex-wrap"
                    style={{ cursor: "pointer" }}
                  >
                    {Array.isArray(shop) && shop.length > 0 ? (
                      shop.slice(0, 4).map((data, key) => (
                        <div
                          className="box me-0"
                          key={key}
                          onClick={() =>
                            applyImage(
                              `http://89.116.170.231:1600/src/image/${data.image}`,
                              data.name,
                              data.description,
                              data.price,
                              data.store,
                              data.price_sale
                            )
                          }
                        >
                          <img
                            src={`http://89.116.170.231:1600/src/image/${data.image}`}
                            alt="RxLYTE"
                            className="border"
                          />
                        </div>
                      ))
                    ) : (
                      <p>No products available</p>
                    )}
                  </div>
                  <img
                    src={
                      selectedImage ||
                      `http://89.116.170.231:1600/src/image/${shop[0]?.image}`
                    }
                    alt="RxLYTE"
                    className="mb-lg-3"
                  />
                </div>
              ))
            ) : (
              <p>No shop data available</p>
            )}

            <div className="col-12 col-lg-6 col-md-6 single-shop bg-light pb-4">
              <div className="d-flex align-items-center flex-column h-auto">
                {Array.isArray(shop) && shop.length > 0 ? (
                  shop.slice(0, 1).map((key) => (
                    <>
                      <div
                        className="d-flex flex-row me- pe-41 pe-lg-0 googles1"
                        key={key}
                      >
                        <h3 className="mt-2 pt-3 me-md-5 me-lg-5 me-xxl-4 pe-lg-5 ms-0 ms-lg-0 ps-0 ps-lg-0 ms-lg-0 cart-cart text-start home-detail me-auto">
                          {selectedName || shop[0]?.name}
                        </h3>
                      </div>

                      <h4
                        className="mt-0 pt-0 text-success fw-medium d-flex flex-row me-auto"
                        style={{ fontFamily: "verdana" }}
                      >
                        {selectedStore || shop[0]?.store}
                      </h4>

                      <p className="text-dark text-start lh-lg cart-cart me-2">
                        {selectedDescription || shop[0]?.description}
                      </p>

                      <div className="d-flex flex-row gap-2 me-auto">
                        <h3
                          className="mt-0 pt-0 text-success fw-medium d-flex flex-row ms-0 dollar-rupee me-auto"
                          style={{ fontFamily: "verdana" }}
                        >
                          {selectedPrice || shop[0]?.price}
                        </h3>

                        <h3
                          className="mt-0 pt-0 text-success fw-medium d-flex flex-row ms-0 dollar-rupee me-auto"
                          style={{ fontFamily: "verdana" }}
                        >
                          <strike>{selectedSale || shop[0]?.price_sale}</strike>
                        </h3>
                      </div>

                      <div className="me-auto cart-cart">
                        <h4>Quantity:</h4>
                      </div>
                    </>
                  ))
                ) : (
                  <p>No shop details available</p>
                )}
              </div>

              <div className="d-flex flex-row googles">
                {Array.isArray(shop) && shop.length > 0 ? (
                  shop.slice(0, 1).map((data) => (
                    <>
                      <div
                        className="plus bg-success text-white fw-bold px-3 py-3"
                        onClick={() => decrement()}
                      >
                        -
                      </div>
                      <div
                        className="plus bg-secondary text-light fw-light px-3 py-3"
                        style={{ fontFamily: "verdana" }}
                      >
                        {counts}
                      </div>
                      <div
                        className="plus bg-success text-light fw-bold px-3 py-3"
                        onClick={() => increment()}
                      >
                        +
                      </div>

                      <button
                        className="cart-cart px-2 py-2 rounded btn d-flex py-4 rounded-0 btn-success text-light mt-2 cart-style cart-style1"
                        style={{ marginLeft: "13%" }}
                        onClick={() => addCartItem(data)}
                      >
                        Add To Cart
                      </button>
                    </>
                  ))
                ) : (
                  <p>No items available for purchase</p>
                )}
              </div>

              <div>
                <Link to={`/${url.checkout}`} className="text-decoration-none">
                  <button className="cart-cart px-2 py-2 rounded btn d-flex py-4 rounded-0 mt-3 btn-success text-light mt-2 cart-style">
                    Buy Now
                  </button>
                </Link>
              </div>

              <div className="mt-2 cart-cart text-start">
                {Array.isArray(detail) && detail.length > 0 ? (
                  detail.slice(0, 1).map((data) => (
                    <>
                      <h4>SKU:{selectedSku || data.sku}</h4>
                    </>
                  ))
                ) : (
                  <p>No SKU information available</p>
                )}
              </div>

              <div className="d-flex flex-row flex-wrap justify-content-start mt-3 ms-0 ps-0 cart-cart">
                <h4>Categories:</h4>
                <div className="d-flex flex-row text-dark ms-1 mt-0 gap-1 pt-1">
                  <Link
                    className="d-flex flex-row text-dark text-decoration-none"
                    to={`/${url.productDetails}`}
                  >
                    <p>Electronics,</p>
                    <p>Laptop,</p>
                    <p>Accessories,</p>
                    <p>Microscope</p>
                  </Link>
                </div>
              </div>

              <div className="d-flex flex-row flex-wrap justify-content-start mt-0 ms-0 ps-1 lh- cart-cart">
                <h4>Tag:</h4>
                {Array.isArray(user) && user.length > 0 ? (
                  user.map((data, key) => (
                    <div
                      className="d-flex flex-row text-dark ms-1 mt-1 gap-0"
                      key={key}
                    >
                      <Link
                        to={`/${url.productDetails}`}
                        className="text-dark text-decoration-none"
                      >
                        <p>{data.name},</p>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p>No tags available</p>
                )}
              </div>

              <div className="d-flex flex-row flex-wrap justify-content-start mt-0 ms-0 ps-1 lh- cart-cart">
                <h4>Share:</h4>
                <div className="d-flex flex-row text-dark ms-1 mt-0 gap-2">
                  <Link to="https://www.facebook.com/" target="_blank">
                    <FontAwesomeIcon
                      icon={faFacebookF}
                      className="border px-2 py-2 rounded-5 text-dark"
                    />
                  </Link>
                  <Link to="https://www.instagram.com/" target="_blank">
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className="border px-2 py-2 rounded-5 text-dark"
                    />
                  </Link>
                  <Link to="https://x.com/" target="_blank">
                    <FontAwesomeIcon
                      icon={faXTwitter}
                      className="border px-2 py-2 rounded-5 text-dark"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-3 mt-lg-0 cart-cart">
        <h3 className="fw-light text-center mt-lg-4 pt-2">Bought Together</h3>
        <div className="container">
          {Array.isArray(detail) && detail.length > 0 ? (
            <div className="row row-cols-1 row-cols-sm-2 mt-0 row-cols-md-4 gap-2 g-3 d-flex flex-row flex-wrap me-md-2 me-lg-0">
              {Array.isArray(shop) && shop.length > 0 ? (
                detail.slice(0, 6).map((data, index) => {
                  const productLabel = label.find(
                    (item) => item.name === data.label
                  );
                  const labelColor = productLabel
                    ? productLabel.color
                    : "green";
                  const imageUrl = data.image
                    ? `http://89.116.170.231:1600/src/image/${data.image}`
                    : "http://89.116.170.231:1600/src/image/default-image.jpg";
                  const getFormattedName = (name, index) => {
                    const words = name.split(" ");
                    if (index === 0) return words.slice(0, 4).join(" ");
                    if (index === 1) return words.slice(0, 2).join(" ");
                    if (index === 2) return words.slice(0, 5).join(" ");
                    return name;
                  };
                  return (
                    <div
                      className="col-12 col-lg-3 col-md-6 text-center border-0 feature-box2 d-flex flex-column justify-content-between"
                      key={index}
                    >
                      <div
                        className="feature-box rounded-0 position-relative rounded-1"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          applyImage(
                            imageUrl,
                            data.name,
                            data.description,
                            data.price,
                            data.store,
                            data.price_sale,
                            data.sku
                          )
                        }
                      >
                        <Link to={`/${url.productDetails}`}>
                          <button
                            className="position-absolute end-0 btn d-flex mt-2 rounded-0 cart-cart product-label text-light"
                            style={{ backgroundColor: labelColor }}
                          >
                            {data.label}
                          </button>
                          <img
                            src={imageUrl}
                            alt={`Product Image ${index + 1}`}
                            className="w-100 h-100 object-fit-cover border-0 image-watch"
                            style={{ cursor: "pointer" }}
                          />
                        </Link>
                      </div>
                      <hr />

                      <h5 className="mt-1 lh-base text-start text-lg-start">
                        {getFormattedName(data.name || "Product Name", index)}
                      </h5>

                      <div
                        className="d-flex justify-content-center justify-content-lg-start mb-1 gap-1 mt-0 flex-row"
                        style={{ fontFamily: "verdana" }}
                      >
                        <h6 className="me-1">{data.price || "Price"}</h6>
                        <strike className="text-danger fw-medium">
                          {data.discountPrice || "$54"}
                        </strike>
                      </div>

                      <button
                        className="d-flex btn btn-success justify-content-start mb-0 rounded-0 cart-cart align-self-start"
                        onClick={() =>
                          applyImage(
                            imageUrl,
                            data.name,
                            data.description,
                            data.price,
                            data.store,
                            data.price_sale,
                            data.sku
                          )
                        }
                      >
                        Buy Now
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-center">No shop data available</p>
              )}
            </div>
          ) : (
            <p className="text-center">No detail data available</p>
          )}
        </div>
      </div>

      <div className="container-fluid description-product cart-cart">
        <div className="container mt-5 description p-2 h-auto pb-1 pb-lg-4">
          <div className="row d-flex flex-row">
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 text-sm-center product- d-flex flex-row lh-lg"></div>

            <div className="container-fluid description-product cart-cart card-details">
              <div className="container mt-0 description h-auto pb-1">
                <div className="row d-flex flex-row flex-wrap w-100 cart-cart mt-0 card-details">
                  {["description", "additional Info", "reviews", "image"].map(
                    (tab) => (
                      <div
                        className="col-12 col-md-6 col-lg-3 text-sm-center product-viva d-flex"
                        key={tab}
                      >
                        <li
                          className={`fw-medium fs-5 ${
                            activeTab === tab
                              ? "text-success text-decoration-underline"
                              : ""
                          }`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </li>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="container">
                <div className="row mt-lg-2 card-details mt-0 me-lg-3">
                  <div className="col-12 m-0 card-details">
                    <div className="bg-body rounded">
                      <div className="h-auto product-viva p-0 mt-2">
                        {renderContent()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid mt-3 mt-lg-0 cart-cart">
        <h3 className="mt-lg-4 mt-0 text-center">Best Selling Item</h3>
        <div className="container">
          {Array.isArray(detail) && detail.length > 0 ? (
            <div className="row row-cols-1 row-cols-sm-2 mt-0 row-cols-md-4 gap-2 g-3 d-flex flex-row flex-wrap me-md-2 me-lg-0">
              {Array.isArray(detail) && detail.length > 0 ? (
                detail.slice(0, 4).map((data, index) => {
                  const productLabel = label.find(
                    (item) => item.name === data.label
                  );
                  const labelColor = productLabel
                    ? productLabel.color
                    : "green";
                  return (
                    <div
                      className="col-12 col-lg-3 col-md-6 text-center border rounded feature-watch px-0 px-lg-1"
                      key={index}
                    >
                      <div className="feature-box rounded-0 position-relative rounded-1">
                        <Link to={`/${url.productDetails}`}>
                          <button
                            className="position-absolute end-0 btn d-flex mt-2 me-2 rounded-0 cart-cart product-label text-light"
                            style={{ backgroundColor: labelColor }}
                          >
                            {data.label}
                          </button>
                          <img
                            src={`http://89.116.170.231:1600/src/image/${
                              data.image || "default-image.jpg"
                            }`}
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
                            onClick={() => addCartItem1(data)}
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
                })
              ) : (
                <p>No products available</p>
              )}
            </div>
          ) : (
            <p className="text-center"></p>
          )}
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

export default ProductDetail;
