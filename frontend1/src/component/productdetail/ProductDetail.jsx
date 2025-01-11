import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ProductDetail.css";
import image1 from "../../assets/Tonic.svg";
import Tonic from "../../assets/Tonic.svg";
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
import Profile from "../../assets/image.webp";
import Hamburger from "../../assets/hamburger.svg";
import Cart from "../../assets/Cart.svg";
import UserContext from "../../context/UserContext";
import axios from "axios";

function ProductDetail() {
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

  const [activeTab, setActiveTab] = useState("description");

  const renderContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <>
            <div className="container">
              <div className="row mt-lg-2 mt-0 me-lg-3 w-auto">
                <div className="col-12">
                  <div className="car bg-body rounded">
                    {shop.length > 0 && (
                      <div className="card-body h-auto product-viva1 mt-2">
                        <h4 className="card-title fs-5 fw-medium text-start">
                          Product Description
                        </h4>
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
                              `/api/src/image/${detail[0].image}`
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
        "http://50.18.56.183:1600/productpagedata"
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
          "http://50.18.56.183:1600/productpagedata"
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
  const navigate = useNavigate();
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
      await axios.post("http://50.18.56.183:1600/addcart", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Product successfully added in the cart");
      navigate("/cart");
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

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
      const response = await axios.post(
        "http://50.18.56.183:1600/wishlistpost",
        formData
      );
      alert("Product successfully added to the wishlist");
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  let [user, setUser] = useState([]);

  let tagdata = async () => {
    let response = await axios.get("http://50.18.56.183:1600/producttagdata");
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
        "http://50.18.56.183:1600/addcart",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Product successfully added in the cart");
      console.log("Item added to cart:", response.data);
      navigate("/cart");
      detailsdata();
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  let [label, setLabel] = useState([]);

  let labeldata = async () => {
    let response = await axios.get(
      "http://50.18.56.183:1600/productlabelsdata"
    );
    setLabel(response.data);
  };
  labeldata();

  return (
    <>
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
                    <div className="addcarts ms-1 ps-1 pt-0 pt-lg-1">
                      {count}
                    </div>
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

          <main className="container mt-5 cart-cart">
            <nav aria-label="breadcrumb" id="container-contact1">
              <ol
                className="breadcrumb d-flex flex-wrap gap-0 mt-lg-3"
                style={{ position: "relative", zIndex: "1000" }}
              >
                <li className="breadcrumb-item navbar-item fw-medium">
                  <Link to="/" className="text-dark">
                    Home
                  </Link>
                </li>
                <li className="breadcrumb-item navbar-item fw-medium text-dark">
                  <Link to="/product-details" className="text-dark">
                    Products
                  </Link>
                </li>

                {Array.isArray(shop) && shop.length > 0 ? (
                  shop.slice(0, 1).map((data, key) => (
                    <li
                      className="breadcrumb-item navbar-item fw-medium text-dark"
                      key={key}
                    >
                      {selectedName || data.name}
                    </li>
                  ))
                ) : (
                  <li className="breadcrumb-item navbar-item fw-medium text-dark"></li>
                )}
              </ol>
            </nav>
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
                    className="d-flex flex-lg-column flex-row flex-md-column gap-3"
                    style={{ cursor: "pointer" }}
                  >
                    {Array.isArray(shop) && shop.length > 0 ? (
                      shop.slice(0, 4).map((data, key) => (
                        <div
                          className="box me-0"
                          key={key}
                          onClick={() =>
                            applyImage(
                              `/api/src/image/${data.image}`,
                              data.name,
                              data.description,
                              data.price,
                              data.store,
                              data.price_sale
                            )
                          }
                        >
                          <img
                            src={`/api/src/image/${data.image}`}
                            alt=""
                            className="border"
                          />
                        </div>
                      ))
                    ) : (
                      <p>No products available</p>
                    )}
                  </div>
                  <img
                    src={selectedImage || `/api/src/image/${shop[0]?.image}`}
                    alt="404"
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
                        <h2 className="fw-bol mt-4 pt-3 me-md-5 me-lg-5 me-xxl-4 pe-lg-5 ms-4 ms-lg-0 ps-2 ps-lg-0 ms-lg-0 googles1 cart-cart text-start">
                          {selectedName || shop[0]?.name}
                        </h2>
                      </div>

                      <h4
                        className="mt-0 pt-0 text-success fw-medium d-flex flex-row me-auto"
                        style={{ fontFamily: "verdana" }}
                      >
                        {selectedStore || shop[0]?.store}
                      </h4>

                      <p className="text-dark text-start lh-lg cart-cart">
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
                <Link to="/checkout" className="text-decoration-none">
                  <button className="cart-cart px-2 py-2 rounded btn d-flex py-4 rounded-0 mt-3 btn-success text-light mt-2 cart-style">
                    Buy Now
                  </button>
                </Link>
              </div>

              <div className="mt-2 cart-cart">
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
                    to="/product-details"
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
                        to="/product-details"
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
                    ? `/api/src/image/${data.image}`
                    : "/api/src/image/default-image.jpg";
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
                        <Link to="/product-details">
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
        <div className="container mt-5 description p-3 h-auto pb-5">
          <div className="row d-flex flex-row w-100">
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 col-xxl-3 text-sm-center product-viva d-flex flex-row lh-lg"></div>
          </div>

          <div className="container-fluid description-product cart-cart">
            <div className="container mt-0 description h-auto pb-1">
              <div className="row d-flex flex-row w-100 cart-cart mt-0">
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

              <div className="container">
                <div className="row mt-lg-2 mt-0 me-lg-3 w-auto">
                  <div className="col-12">
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
                      className="col-12 col-lg-3 col-md-6 text-center border rounded feature-watch"
                      key={index}
                    >
                      <div className="feature-box rounded-0 position-relative rounded-1">
                        <Link to="/product-details">
                          <button
                            className="position-absolute end-0 btn d-flex mt-2 rounded-0 cart-cart product-label text-light"
                            style={{ backgroundColor: labelColor }}
                          >
                            {data.label}
                          </button>
                          <img
                            src={`/api/src/image/${
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
                })
              ) : (
                <p>No products available</p>
              )}
            </div>
          ) : (
            <p className="text-center"></p>
          )}
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

export default ProductDetail;
