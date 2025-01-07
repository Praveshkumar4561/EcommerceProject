import React, { useContext, useEffect, useRef, useState } from "react";
import "./HomePage.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faPhoneVolume,
  faArrowRightLong,
  faBars,
  faMagnifyingGlass,
  faArrowLeft,
  faArrowRight,
  faCartShopping,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import Panic from "../../assets/Panic Attacks.png";
import { Link, useNavigate } from "react-router-dom";
import Generic from "../../assets/Lytes.svg";
import PainRelief from "../../assets/Latest.svg";
import Tonic from "../../assets/Tonic.svg";
import Support from "../../assets/Support.svg";
import Payments from "../../assets/Payments.svg";
import Returns from "../../assets/Returns.svg";
import Shipping from "../../assets/Shipping.svg";
import Profile from "../../assets/image.png";
import Cart from "../../assets/Cart.svg";
import UserContext from "../../context/UserContext";

function HomePage() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [rotatedIndexes, setRotatedIndexes] = useState([]);

  const faqsAnswer = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
    setRotatedIndexes((prev) => {
      const newIndexes = [...prev];
      if (newIndexes.includes(index)) {
        newIndexes.splice(newIndexes.indexOf(index), 1);
      } else {
        newIndexes.push(index);
      }
      return newIndexes;
    });
  };

  let [faqs, setFaqs] = useState([]);

  useEffect(() => {
    const faqdata = async () => {
      try {
        const response = await axios.get("/api/pagesdatafaqs");
        setFaqs(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    faqdata();
  }, []);

  let [blog, setBlog] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 3;

  useEffect(() => {
    const showdata = async () => {
      try {
        let answer = await axios.get("/api/blogpostdata");
        setBlog(answer.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    showdata();
  }, []);

  const indexOfLastPost = currentPage * blogsPerPage;
  const indexOfFirstPost = indexOfLastPost - blogsPerPage;
  const currentBlogs = blog.slice(indexOfFirstPost, indexOfLastPost);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < Math.ceil(blog.length / blogsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const [user, setUser] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const alldata = async () => {
      let response = await axios.get("/api/getannounce");
      setUser(response.data);
    };
    alldata();
  }, []);

  const leftData = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : user.length - 1
    );
  };

  const rightData = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < user.length - 1 ? prevIndex + 1 : 0
    );
  };

  let [detail, setDetail] = useState([]);

  let userdata = async () => {
    let response = await axios.get("/api/alldata");
    setDetail(response.data);
  };
  userdata();

  let { count, setCount } = useContext(UserContext);

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

  const [product, setProduct] = useState([]);

  let homedata = async () => {
    try {
      let response = await axios.get("/api/productpagedata");
      setProduct(response.data);
    } catch (error) {
      console.error("Error occurred", error);
    }
  };
  homedata();

  let [label, setLabel] = useState([]);

  let labeldata = async () => {
    let response = await axios.get("/api/productlabelsdata");
    setLabel(response.data);
  };
  labeldata();

  let { navigate } = useNavigate();

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
      <div className="container-fluid">
        <div className="row align-items-center justify-content-between text-center mt-lg-0 mt-0 pt-0 pt-lg-0 bg-light ms-0 me-0">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-md-start align-items-center ps-2 lorem-home mt-2">
            {user.length > 0 && (
              <div className="d-block d-lg-block text-start">
                <p className="mb-0 mt-0 mt-lg-3 me-md-3 free-shipping d-flex flex-row">
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="me-2 text-success fs-6 d-block d-lg-block mt-1"
                    style={{ cursor: "pointer" }}
                    onClick={leftData}
                  />
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="me-2 text-success fs-6 d-block d-lg-block mt-1"
                    style={{ cursor: "pointer" }}
                    onClick={rightData}
                  />
                  <div className="ms-0">{user[currentIndex].content}</div>
                </p>
              </div>
            )}
          </div>

          <div className="col-12 col-md-6 d-flex justify-content-md-end align-items-center mt-2 mt-md-0 lorem-home d-md-none d-lg-block">
            {detail.slice(0, 1).map((data, key) => (
              <div
                className="d-flex align-items-center gap-3 float-lg-end d-none d-lg-block"
                key={key}
              >
                <div className="free-shipping d-flex flex-row me-3 mt-2">
                  <span className="d-flex align-items-center gap-2">
                    <div className="d-sm-flex ms-auto d-flex">
                      <Link to="/user/dashboard" className="nav-link">
                        {data.first_name ? (
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              color: "white",
                              fontSize: "18px",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            className="profile-lyte1 img-fluid me-0 border rounded-5 py-1 bg-success"
                          >
                            {data.first_name.charAt(0).toUpperCase()}
                          </div>
                        ) : (
                          <img
                            src={Profile}
                            alt="Profile"
                            className="profile-lyte1 img-fluid me-0 border rounded-5 py-1"
                          />
                        )}
                      </Link>

                      <div className="d-flex flex-column me-4">
                        <span className="me-4 pe-2">
                          Hello {data.first_name || "User"}
                        </span>
                        <span className="ms-4">{data.email}</span>
                      </div>

                      <Link to="/cart" className="nav-link d-flex mt-2">
                        <img
                          src={Cart}
                          alt="Cart"
                          className="img-fluid profile1 me-2"
                        />
                        <div className="addcarts-lyte2 ms-3 mt-3">{count}</div>
                      </Link>
                    </div>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="container bg-light">
          <div className="row d-flex justify-content-start text-center align-items-start mt-0 mb-lg-0 mb-2">
            <div className="col-12 col-md-8 d-flex align-items-center mb-4 mt-0 d-flex flex-row">
              <img
                src={Tonic}
                alt="404"
                className="img-fluid me-3 me-md-0 mt-0 mt-lg-2"
              />

              <div className="input-welcome1 d-flex flex-row align-items-center mt-0">
                <input
                  type="search"
                  className="form-control p-2 border-1 mt-sm-3 border py-4 input-home rounded-0 d-lg-block d-none me-0"
                  placeholder="Search For Product"
                  name="search"
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="d-lg-block d-none">
                  <select className="form-select rounded-0 border-0 mt-1">
                    <option value="All Categories">All Categories</option>
                    <option value="New Arrivals">New Arrivals</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Featured">Featured</option>
                    <option value="Best Sellers">Best Sellers</option>
                    <option value="Mobile Phone">Mobile Phone</option>
                    <option value="Computers & Laptops">
                      Computers & Laptops
                    </option>
                    <option value="Top Brands">Top Brands</option>
                    <option value="Weekly Best Selling">
                      Weekly Best Selling
                    </option>
                    <option value="CPU Heat Pipes">CPU Heat Pipes</option>
                    <option value="CPU Coolers">CPU Coolers</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Headphones">Headphones</option>
                    <option value="Wireless Headphones">
                      Wireless Headphones
                    </option>
                    <option value="TWS Headphones">TWS Headphones</option>
                    <option value="Smart Watch">Smart Watch</option>
                    <option value="Gaming Console">Gaming Console</option>
                    <option value="Playstation">Playstation</option>
                    <option value="Gifts">Gifts</option>
                    <option value="Computers">Computers</option>
                    <option value="Desktop">Desktop</option>
                    <option value="Laptop">Laptop</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Accessories">Accessories</option>
                    <option value="SmartPhones & Tablets">
                      SmartPhones & Tablets
                    </option>
                    <option value="TV Video & Music">TV Video & Music</option>
                    <option value="Cameras">Cameras</option>
                    <option value="Cooking">Cooking</option>
                    <option value="Accessories">Accessories</option>
                    <option value="With Bluetooth">With Bluetooth</option>
                    <option value="Sports">Sports</option>
                    <option value="Electronics Gadgets">
                      Electronics Gadgets
                    </option>
                    <option value="Microscope">Microscope</option>
                    <option value="Remote Control">Remote Control</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Thermometer">Thermometer</option>
                    <option value="Backpack">Backpack</option>
                    <option value="Headphones">Headphones</option>
                  </select>
                </div>

                <div className="d-flex d-lg-block d-none">
                  <button className="ms-1 btn btn-success d-flex mt-3 py-4 px-3 rounded-0 justify-content-center align-items-center">
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container lorem-home d-none d-lg-block bg-light pb-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="d-flex flex-column flex-md-row align-items-center mb-3 mb-md-0 ">
              <div className="dropdown d-inline-block">
                <button
                  className="btn btn-success d-flex align-items-center me-3 py-4 rounded-0 cart-cart"
                  id="categoryDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FontAwesomeIcon icon={faBars} className="me-2" />
                  BROWSE CATEGORIES
                  <FontAwesomeIcon icon={faAngleDown} className="ms-2" />
                </button>

                <ul
                  className="dropdown-menu rounded-0 lh-lg"
                  aria-labelledby="categoryDropdown"
                >
                  <li>
                    <Link className="dropdown-item" href="#">
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Electronics
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Gifts
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      href="#"
                      aria-labelledby="categoryDropdown"
                    >
                      Computers
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      SmartPhones & Tablets
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Tv,Vido & Music
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Cameras
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Cooking
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Accessories
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Sports
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" href="#">
                      Electronics Gadgets
                    </Link>
                  </li>
                </ul>
              </div>

              <nav>
                <ul className="nav-list d-flex flex-wrap mb-0 gap-3 gap-md-4">
                  <li className="nav-item">
                    <div className="nav-link-wrapper">
                      <Link to="/" className="nav-link fw-medium text-success">
                        Home
                      </Link>
                    </div>
                  </li>

                  <li className="nav-item">
                    <Link to="/shop" className="nav-link fw-medium">
                      Shop
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/blog" className="nav-link fw-medium">
                      Blog
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to="/privacy-policy" className="nav-link fw-medium">
                      Privacy Policy
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link to="/contact-us" className="nav-link fw-medium">
                      Contact
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="d-none d-md-flex align-items-center mt-3 mt-md-0">
              <FontAwesomeIcon
                icon={faPhoneVolume}
                className="text-success me-2 mt-0 fw-medium"
              />
              <span className="fw-medium" style={{ fontFamily: "verdana" }}>
                1800-654-3210
              </span>
            </div>
          </div>
        </div>

        <div className="container-grid ms-0 ms-lg-0 lorem-home mt-0 w-100 ms-0">
          <div
            className="grid1 d-flex flex-column col-12 col-md-12 col-lg-8 col-xl-8 col-xxl-6 mt-lg-3 mt-0 me-4 me-lg-0 rounded-0"
            id="grid2"
          >
            <h3 className="fw-bold mt-5 ms-5 pt-4 text-start">
              Get rid of your <br /> Panic Attacks
            </h3>
            <p className="card-text1 ms-5 fs-6 text-start">Starting at $5.99</p>
            <button className="btn btn-success d-flex ms-5 py-4   flex-row align-items-center">
              Shop Now
              <FontAwesomeIcon
                icon={faArrowRightLong}
                className="ms-2 mt-0 pt-1"
              />
            </button>
            <img src={Panic} alt="Panic Attacks" className="img-fluid" />
          </div>

          <div
            className="grid1 d-flex flex-column justify-content-start col-12 col-md-12 col-lg-8 col-xl-8 col-xxl-6 me-4 me-lg-0 rounded-0"
            id="grid3"
          >
            <h3 className="fw-bold ms-4 mt-4 text-start">
              Buy Generic <br /> Medicines
            </h3>
            <p className="card-text1 ms-4 fs-6 text-start">Starting at $5.99</p>
            <button className="btn btn-success d-flex ms-4 py-4 flex-row align-items-center">
              Shop Now
              <FontAwesomeIcon
                icon={faArrowRightLong}
                className="ms-2 mt-0 pt-1"
              />
            </button>
            <img src={Generic} alt="Generic Medicines" className="img-fluid" />
          </div>

          <div
            className="grid1 d-flex flex-row justify-content-start col-12 col-md-12 col-lg-8 col-xl-8 col-xxl-6 me-4 me-lg-0 h-auto rounded-0"
            id="grid4"
          >
            <img
              src={PainRelief}
              alt="Generic Medicines"
              className="img-fluid"
            />
            <div className="d-flex flex-column grid-doctor">
              <p className="text-success fw-bold mt-lg-2 fs-5 ms-5 ps-1 product-lyte text-start">
                Hot Product
              </p>
              <h3 className="fw-bold pain-relief ms-5 ps-1 mt-0 text-start">
                Buy Pain Relief <br /> Medicines
              </h3>
              <p className="card-text1 ms-2 mb-1 percent-rupee ms-5 ps-2 text-start">
                $199.00/60%
              </p>
              <button className="btn btn-success d-flex ms-4 py-4 flex-row align-items-center">
                Shop Now
                <FontAwesomeIcon
                  icon={faArrowRightLong}
                  className="ms-2 mt-0 pt-1"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="container-fluid mt-3 mt-lg-0 cart-cart">
          <h3 className="mt-lg-4 mt-0 text-center">Featured Products</h3>
          <div className="container">
            <div className="row row-cols-1 row-cols-sm-2 mt-0 row-cols-md-4 gap-2 g-3 d-flex flex-row flex-wrap me-md-2 me-lg-0">
              {product.slice(0, 4).map((data, index) => {
                const productLabel = label.find(
                  (item) => item.name === data.label
                );
                const labelColor = productLabel ? productLabel.color : "green";
                return (
                  <div
                    className="col-12 col-lg-3 col-md-6 text-center border rounded feature-watch"
                    key={index}
                  >
                    <div className="feature-box rounded-0 position-relative rounded-1">
                      <button
                        className="position-absolute end-0 btn d-flex mt-2 rounded-0 cart-cart product-label text-light"
                        style={{ backgroundColor: labelColor }}
                      >
                        {data.label}
                      </button>
                      <Link to="/product-details">
                        <img
                          src={`/api/src/image/${data.image}`}
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

        <div className="container-fluid mt-3 mt-lg-0 cart-cart">
          <h3 className="mt-lg-4 mt-0 text-center">Trending Products</h3>
          <div className="container">
            <div className="row row-cols-1 row-cols-sm-2 mt-0 row-cols-md-4 gap-2 g-3 d-flex flex-row flex-wrap me-md-2 me-lg-0">
              {product.slice(0, 8).map((data, index) => {
                const productLabel = label.find(
                  (item) => item.name === data.label
                );
                const labelColor = productLabel ? productLabel.color : "green";
                return (
                  <div
                    className="col-12 col-lg-3 col-md-6 text-center border rounded feature-watch"
                    key={index}
                  >
                    <div className="feature-box rounded-0 position-relative rounded-1">
                      <button
                        className="position-absolute end-0 btn d-flex mt-2 rounded-0 cart-cart product-label text-light"
                        style={{ backgroundColor: labelColor }}
                      >
                        {data.label}
                      </button>
                      <Link to="/product-details">
                        <img
                          src={`/api/src/image/${data.image}`}
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
      </div>

      <div className="container-fluid mt-3 mt-lg-0 cart-cart">
        <h3 className="mt-lg-4 mt-0 text-center">Best Selling Item</h3>
        <div className="container">
          <div className="row row-cols-1 row-cols-sm-2 mt-0 row-cols-md-4 gap-2 g-3 d-flex flex-row flex-wrap me-md-2 me-lg-0">
            {product.slice(0, 4).map((data, index) => {
              const productLabel = label.find(
                (item) => item.name === data.label
              );
              const labelColor = productLabel ? productLabel.color : "green";
              return (
                <div
                  className="col-12 col-lg-3 col-md-6 text-center border rounded feature-watch"
                  key={index}
                >
                  <div className="feature-box rounded-0 position-relative rounded-1">
                    <button
                      className="position-absolute end-0 btn d-flex mt-2 rounded-0 cart-cart product-label text-light"
                      style={{ backgroundColor: labelColor }}
                    >
                      {data.label}
                    </button>
                    <Link to="/product-details">
                      <img
                        src={`/api/src/image/${data.image}`}
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

      <div className="container-fluid full-height d-flex justify-content-center align-items-center">
        <div className="container">
          <div className="row mt-lg-4">
            <div className="col-12 d-flex justify-content-center">
              <div className="custom-container text-center-custom lorem-home h-auto pb-4">
                <h1 className="fw-normal fs-1 mt-4">FAQs</h1>
                <div>
                  {faqs.map((item, index) => (
                    <div
                      key={index}
                      id="custom-border1"
                      className="ms-lg-3 ms-2 mt-4 rounded-2 border d-flex flex-column w-100 h-auto"
                    >
                      <div className="d-flex align-items-center">
                        <h4 className="fs-4 mb-0 text-start ms-0 p-2 fw-normal ms-md-0">
                          {item.question}
                        </h4>
                        <div className="custom-button1">
                          <button
                            className="border rounded py-2 ms-2 px-2 bg-success text-light"
                            onClick={() => faqsAnswer(index)}
                          >
                            <FontAwesomeIcon
                              icon={faAngleDown}
                              className={`fs-2 ${
                                rotatedIndexes.includes(index) ? "rotate" : ""
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                      {activeIndex === index && (
                        <div className="mt-2 ms-2 text-start">
                          <p>{item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid lorem-home">
        <div className="container">
          <h2 className="text-center mt-4 fw-medium">Latest Blogs</h2>
          <div className="row mt-3 d-flex justify-content-start lorem-home1 flex-row gap-3 gap-xxl-4 me-lg-0 me-0 ms-lg-1">
            {currentBlogs.map((post, index) => (
              <div
                key={index}
                className="col-12 col-xxl-4 col-lg-4 col-12 col-md-4 custom-height3 border mb-3 d-flex flex-column align-items-center text-center ms-lg- latest-read ms-md-3 mt-md-2"
              >
                <img
                  src={`/api/src/image/${post.image}`}
                  alt={`img${index + 1}`}
                  className="img-fluid w-100"
                />
                <div className="latest-moree">
                  <h4 className="fw-medium fs-4 mt-2 lh-base text-start ms-4">
                    {post.name}
                  </h4>
                  <p className="text-dark text-start mt-0 px-4">
                    {post.description}
                  </p>
                  <Link
                    to={`/blog-details/${post.id}`}
                    className="text-decoration-none mt-1"
                  >
                    <h3 className="read-more ms-5 mt-4">
                      <button className="btn-success rounded text-light py-2 mt-2 more-button">
                        Read more
                      </button>
                    </h3>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination d-flex justify-content-center flex-row flex-nowrap mt-1">
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="mt-2 me-2 text-success"
              style={{ cursor: "pointer" }}
              onClick={goToPreviousPage}
              disabled={currentPage === 1} // Disable left arrow if on the first page
            />
            {/* Display the page buttons */}
            <button
              onClick={() => paginate(1)}
              className={`btn ${
                currentPage === 1 ? "btn-success d-flex" : "btn-secondary"
              } mx-2`}
            >
              1
            </button>
            <button
              onClick={() => paginate(2)}
              className={`btn ${
                currentPage === 2 ? "btn-success d-flex" : "btn-secondary"
              } mx-2`}
            >
              2
            </button>
            <button
              onClick={() => paginate(3)}
              className={`btn ${
                currentPage === 3 ? "btn-success d-flex" : "btn-secondary"
              } mx-2`}
            >
              3
            </button>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="mt-2 text-success"
              style={{ cursor: "pointer" }}
              onClick={goToNextPage}
              disabled={currentPage === Math.ceil(blog.length / blogsPerPage)} // Disable right arrow if on the last page
            />
          </div>
        </div>
      </div>

      <div className="container-fluid mt-4">
        <div className="container bg-light h-auto p-2 lorem-ho" id="background">
          <div className="row text-center d-flex flex-row d-sm-flex">
            <div className="col-12 col-md-6 col-lg-3 mt-4">
              <div className="d-flex justify-content-center justify-content-sm-start align-items-center icon-text-container ms-2">
                <img
                  src={Shipping}
                  alt=""
                  className="img-fluid text-center-custom111 image1 ms-lg-5 ms-xxl-0 ms-xl-0"
                />
                <h3
                  className="text-center-custom"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Free Shipping
                </h3>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3 mt-4 ms-lg-5 ps-lg-4 ps-xl-0 px-xxl-0 ms-xl-0 ms-xxl-0">
              <div className="d-flex justify-content-center align-items-center icon-text-container ms-md-5 ms-lg-0 mb-md-2 justify-content-sm-start">
                <img
                  src={Returns}
                  alt="404"
                  className="img-fluid image image1 me-md-4 ms-lg-4 me-lg-0"
                />
                <h3
                  className="text-center pt-lg-0 d-flex flex-row me-md-4 returns-easy"
                  style={{ whiteSpace: "nowrap" }}
                >
                  Easy Returns
                </h3>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3 mt-4 ms-md-0 ms-lg-4 ms-xl-0">
              <div className="d-flex justify-content-center align-items-center icon-text-container ms-md-0 ms-lg-0 justify-content-sm-start">
                <div className="icon-container bg-light returns-easy1 ms-lg-5 mt-sm-3 ms-xl-0 ms-xxl-0">
                  <img
                    src={Payments}
                    alt="img not found"
                    className="img-flu image2 mt-md-4 mb-md-4 pb-md-2 mt-lg-2 mb-lg-5 ms-lg-1 payment-image"
                  />
                </div>
                <h3 className="text-center-custom d-flex mt-1 mt-sm-0 d-flex flex-row returns-easy2 mt-lg-1">
                  Secure <p className="ms-2">Payment</p>
                </h3>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3 mt-4 pt-2">
              <div className="d-flex justify-content-center align-items-center icon-text-container mb-md-4 justify-content-sm-start">
                <div className="icon-container bg-light">
                  <img
                    src={Support}
                    alt=""
                    className="img-fluid image2 ms-2 ms-md-3 custom-support"
                  />
                </div>
                <h3
                  className="image3 support-hour ms-1"
                  style={{ whiteSpace: "nowrap" }}
                >
                  24/7 Support
                </h3>
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
export default HomePage;
