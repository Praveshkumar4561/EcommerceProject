import React, { useContext, useEffect, useRef, useState } from "react";
import "./ProductHome.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Tonic from "../../assets/Tonic.svg";
import Point from "../../assets/point.webp";
import Over from "../../assets/Over.webp";
import Electronic from "../../assets/Electronic.webp";
import gift from "../../assets/gift.webp";
import computer from "../../assets/computer.webp";
import Smart from "../../assets/Smart.webp";
import camera from "../../assets/camera.webp";
import cook from "../../assets/cook.webp";
import access from "../../assets/access.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faCartShopping,
  faFilter,
  faHeart,
  faPlus,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import Dot from "../../assets/dot.webp";
import Hamburger from "../../assets/hamburger.svg";
import Close from "../../assets/Close.webp";
import UserContext from "../../context/UserContext";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import { Helmet } from "react-helmet-async";
import { Range } from "react-range";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductHome() {
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

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const leftImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? user.length - 1 : prevIndex - 1
    );
  };

  const rightImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === user.length - 1 ? 0 : prevIndex + 1
    );
  };

  const [showFilter, setShowFilter] = useState(false);

  const handleFilterToggle = () => {
    setShowFilter(!showFilter);
  };

  const handleCancel = () => {
    setShowFilter(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 992) {
        setShowFilter(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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
      await axios.post("http://89.116.170.231:1600/newsletterpost", letter);
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

  let [count6, setCount6] = useState(0);

  useEffect(() => {
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
    wishlistdata();
  }, []);

  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("Default");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedCategory, setselectedCategory] = useState("");
  const [values, setValues] = useState([0, 1000]);
  const [image, setImage] = useState([]);
  const [useTagsFilter, setUseTagsFilter] = useState(false);
  const [brands, setBrands] = useState([]);
  const [user, setUser] = useState([]);
  const [attribute, setAttribute] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedBoxes, setSelectedBoxes] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");

  useEffect(() => {
    let attributedata = async () => {
      let response = await axios.get(
        "http://89.116.170.231:1600/attributesdata"
      );
      setAttribute(response.data);
    };
    attributedata();
  }, []);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/brandsdata"
        );
        setBrands(response.data);
        setUser(response.data);
      } catch (error) {
        console.error("Brand fetch error:", error);
      }
    };
    fetchBrands();
  }, []);

  const searchbar = async () => {
    let response = await axios.get(
      `http://89.116.170.231:1600/productsearch/${search}`
    );
    setImage(response.data);
  };

  const handleChange = (newValues) => {
    setValues(newValues);
  };

  const [tags, setTags] = useState([]);

  useEffect(() => {
    const tagsdata = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/producttagdata"
        );
        setTags(response.data);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };
    tagsdata();
  }, []);

  const fetchFilteredProducts = async () => {
    try {
      const [minPrice, maxPrice] = values;
      const response = await axios.post(
        "http://89.116.170.231:1600/combinedfilter",
        {
          brands: selectedBrands,
          tags: selectedTags,
          category: selectedCategory,
          minPrice,
          maxPrice,
          sort: sortOption,
          color: selectedColor,
          size: selectedSize,
          boxes: selectedBoxes,
          weight: selectedWeight,
        }
      );
      setImage(response.data);
    } catch (error) {
      console.error("Product fetch error:", error);
    }
  };

  useEffect(() => {
    if (search) {
      searchbar();
    } else {
      fetchFilteredProducts();
    }
  }, [
    search,
    selectedBrands,
    selectedTags,
    useTagsFilter,
    values,
    sortOption,
    selectedCategory,
    selectedColor,
    selectedSize,
    selectedBoxes,
    selectedWeight,
  ]);

  const handleCategorySelect = (category) => {
    setselectedCategory((prev) => (prev === category ? "" : category));
  };

  const [rounds, setRounds] = useState([]);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/productpagedata"
        );
        setRounds(response.data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };
    fetchProductData();
  }, []);

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
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Product is not added on the wishlist", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

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
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Product is not added on the cart", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  let [label, setLabel] = useState([]);

  useEffect(() => {
    const labeldata = async () => {
      try {
        let response = await axios.get(
          "http://89.116.170.231:1600/productlabelsdata"
        );
        const filteredData = response.data.filter(
          (label) => label.status === "Published" || label.status === "Draft"
        );
        setLabel(filteredData);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    labeldata();
  }, []);

  let [plus, setPlus] = useState(false);
  let [plus1, setPlus1] = useState(false);
  let [plus2, setPlus2] = useState(false);
  let [plus3, setPlus3] = useState(false);
  let [plus4, setPlus4] = useState(false);
  let [plus5, setPlus5] = useState(false);
  let [plus6, setPlus6] = useState(false);

  let plusClicked = () => {
    setPlus(!plus);
  };

  let plusClicked1 = () => {
    setPlus1(!plus1);
  };

  let plusClicked2 = () => {
    setPlus2(!plus2);
  };

  let plusClicked3 = () => {
    setPlus3(!plus3);
  };

  let plusClicked4 = () => {
    setPlus4(!plus4);
  };

  let plusClicked5 = () => {
    setPlus5(!plus5);
  };

  let plusClicked6 = () => {
    setPlus6(!plus6);
  };

  return (
    <>
      <Helmet>
        <title>Products | RxLYTE</title>
        <meta
          name="description"
          content="Explore detailed information about our top-quality products. Buy online with secure checkout and fast delivery at Rxlyte."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://srv724100.hstgr.cloud/products" />
      </Helmet>

      <div
        className="container"
        id="container-customx"
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
                      Products
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

      {/* <div className="container-fluid overflow-hidden">
        <div className="container">
          <div className="row mt-lg-5 me-1 pt-lg-3 d-flex justify-content-center d-flex flex-row d-lg-none flex-nowrap ms-1">
            <div
              className="col-2 col-sm-2 col-md-1 col-lg-1 border admin-product1 rounded-0 mt-lg-5 bg-light d-flex justify-content-center py-2 position-relativ"
              style={{ cursor: "pointer" }}
              onClick={leftImage}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </div>

            <div className="col-12 col-sm-12 col-md-6 col-lg-6 border admin-product d-flex rounded">
              <img
                src={`http://89.116.170.231:1600/src/image/${user[currentImageIndex]?.image}`}
                alt={`Product Image ${currentImageIndex + 1}`}
                className="img-fluid"
              />
            </div>

            <div
              className="col-2 col-sm-2 col-md-1 col-lg-6 border admin-product1 admin-product2 mt-lg-5 mt-0 mt-md-5 py-2 position-relative bg-light d-flex justify-content-center"
              style={{ cursor: "pointer" }}
              onClick={rightImage}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </div>
          </div>

          <div className="row mt-lg-5 pt-lg-3 d-flex justify-content-center d-none d-lg-flex gap-1 flex-row flex-lg-nowrap">
            {Array.isArray(user) && user.length > 0 ? (
              user.slice(0, 5).map((data, key) => (
                <div
                  className="col-6 col-sm-6 col-md-4 col-lg-2 border admin-product d-flex justify-content-center align-items-center rounded"
                  key={key}
                >
                  <img
                    src={`http://89.116.170.231:1600/src/image/${data.image}`}
                    alt={`Product Image ${key + 1}`}
                    className="img-fluid"
                  />
                </div>
              ))
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div> */}

      <div className="container-fluid overflow-hidden">
        <div className="container">
          <div className="row mt-lg-5 me-1 pt-lg-3 d-flex justify-content-center d-flex flex-row d-lg-none flex-nowrap ms-1">
            <div
              className="col-2 col-sm-2 col-md-1 col-lg-1 border admin-product1 rounded-0 mt-lg-5 bg-light d-flex justify-content-center py-2 position-relativ"
              style={{ cursor: "pointer" }}
              onClick={leftImage}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </div>

            <div className="col-12 col-sm-12 col-md-6 col-lg-6 border admin-product d-flex rounded">
              <img
                src={`http://89.116.170.231:1600/src/image/${user[currentImageIndex]?.image}`}
                alt={`Product Image ${currentImageIndex + 1}`}
                className="img-fluid"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div
              className="col-2 col-sm-2 col-md-1 col-lg-6 border admin-product1 admin-product2 mt-lg-5 mt-0 mt-md-5 py-2 position-relative bg-light d-flex justify-content-center"
              style={{ cursor: "pointer" }}
              onClick={rightImage}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </div>
          </div>

          <div className="row mt-lg-5 pt-lg-3 d-flex justify-content-center d-none d-lg-flex gap-1 flex-row flex-lg-nowrap">
            {Array.isArray(user) && user.length > 0 ? (
              user.slice(0, 5).map((data, key) => (
                <div
                  className="col-6 col-sm-6 col-md-4 col-lg-2 border admin-product d-flex justify-content-center align-items-center rounded"
                  key={key}
                >
                  <img
                    src={`http://89.116.170.231:1600/src/image/${data.image}`}
                    alt={`Product Image ${key + 1}`}
                    className="img-fluid"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                      aspectRatio: "1 / 1",
                    }}
                  />
                </div>
              ))
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="container mb-5">
          {Array.isArray(rounds) && rounds.length > 0 ? (
            rounds.slice(0, 1).map((data, key) => {
              const labels = [
                "HeadPhones",
                "Digital Watch",
                "Soundbar",
                "EarPhones",
                "Mobile Phone",
              ];
              const productLabel = labels[key] || "Product";
              const nextImage = rounds[key + 1] || {};
              const nextImage2 = rounds[key + 2] || {};
              const nextImage3 = rounds[key + 3] || {};
              const nextImage4 = rounds[key + 4] || {};

              return (
                <div className="row ms-lg-0 gap-4 d-flex flex-row" key={key}>
                  <div className="col-6 col-sm-4 col-md-3 col-lg-2 border show-product position-relative">
                    <img
                      src={`http://89.116.170.231:1600/src/image/${data.image}`}
                      alt={`Product Image ${key + 1}`}
                      className="w-100 h-100 object-fit-cover"
                    />
                    <div className="position-absolute ms-4 mt-2 fw-bold">
                      {productLabel}
                    </div>
                  </div>

                  <div className="col-6 col-sm-4 col-md-3 col-lg-2 border show-product position-relative mt-md-3">
                    {nextImage.image && (
                      <img
                        src={`http://89.116.170.231:1600/src/image/${nextImage.image}`}
                        alt={`Product Image ${key + 2}`}
                        className="w-100 h-100 object-fit-cover"
                      />
                    )}
                    <div className="position-absolute ms-4 mt-2 fw-bold">
                      {labels[key + 1]}
                    </div>
                  </div>

                  <div className="col-6 col-sm-4 col-md-3 col-lg-2 mt-5 mt-md-3 mt-lg-4 border show-product position-relative">
                    {nextImage2.image && (
                      <img
                        src={`http://89.116.170.231:1600/src/image/${nextImage2.image}`}
                        alt={`Product Image ${key + 3}`}
                        className="w-100 h-100 object-fit-cover"
                      />
                    )}
                    <div className="position-absolute ms-3 ms-lg-5 mt-2 fw-bold">
                      {labels[key + 2]}
                    </div>
                  </div>

                  <div className="col-6 col-sm-4 col-md-3 col-lg-2 mt-5 mt-lg-4 border show-product position-relative">
                    {nextImage3.image && (
                      <img
                        src={`http://89.116.170.231:1600/src/image/${nextImage3.image}`}
                        alt={`Product Image ${key + 4}`}
                        className="w-100 h-100 object-fit-cover"
                      />
                    )}
                    <div className="position-absolute ms-3 ms-lg-5 mt-2 fw-bold">
                      {labels[key + 3]}
                    </div>
                  </div>

                  <div className="col-6 col-sm-4 col-md-3 col-lg-2 mt-lg-4 border show-product mt-4 position-relative mt-md-5">
                    {nextImage4.image && (
                      <img
                        src={`http://89.116.170.231:1600/src/image/${nextImage4.image}`}
                        alt={`Product Image ${key + 5}`}
                        className="w-100 h-100 object-fit-cover"
                      />
                    )}
                    <div className="position-absolute ms-4 mt-2 fw-bold">
                      {labels[key + 4]}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-start">No products available</p>
          )}
        </div>
      </div>

      {showFilter && (
        <div className="filter-backdrop" onClick={handleCancel}></div>
      )}

      <div className="container-fluid">
        <div className="container">
          <div className="row d-flex justify-content-between align-items-center mb-3">
            <div className="position-relative d-flex flex-row flex-wrap w-100">
              <input
                type="search"
                className="form-control py-4 mt-4 rounded input-container border ms-0 d-lg-block d-none cart-cart"
                placeholder="Search..."
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="nav-product active ms-0 ms-lg-4 border h-25 mt-4 px-2 py-2"
                type="button"
              >
                <img src={Dot} alt="filter" />
              </button>

              <button
                className="nav-product active ms-1 ms-lg-3 border h-25 mt-4 px-2 py-2"
                type="button"
              >
                <img src={Point} alt="settings" />
              </button>

              <div className="d-flex flex-row ms-lg-auto me-2 ms-md-3 ms-2">
                <label htmlFor="sort-select" className="visually-hidden" />
                <select
                  id="sort-select"
                  className="form-select mb-3 mt-4"
                  style={{ height: "48px" }}
                  value={sortOption}
                  onChange={(e) => {
                    setSortOption(e.target.value);
                    fetchFilteredProducts();
                  }}
                >
                  <option value="Default">Default</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Newest">Newest</option>
                  <option value="Price: low to high">Price: low to high</option>
                  <option value="Price: high to low">Price: high to low</option>
                  <option value="Name: A-Z">Name: A-Z</option>
                  <option value="Name: Z-A">Name: Z-A</option>
                </select>
              </div>

              <div className="d-lg-none d-block">
                <button
                  className="ms-lg-2 ms-0 ms-md-4 mt-0 btn btn-dark px-1 rounded-0 d-flex flex-row align-items-center cart-cart1 mt-4 mt-md-4"
                  onClick={handleFilterToggle}
                  style={{ height: "48px" }}
                >
                  <FontAwesomeIcon icon={faFilter} className="me-2 ms-1" />
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="container">
          <div className="row me-0">
            <div
              className={`category-new ${
                showFilter ? "mobile-visible" : "mobile-hidden"
              } d-lg-block`}
            >
              <div
                className="border-0 rounded d-flex flex-column bg-light p-3 cart-cart text-start h-auto"
                style={{ height: "100%", width: "100%" }}
              >
                <div className="d-md-none d-flex justify-content-end mb-2">
                  <button
                    className="btn btn-danger text-light cart-cart1 border-0 d-flex"
                    style={{ fontSize: "16px" }}
                    onClick={handleCancel}
                  >
                    Close
                  </button>
                </div>

                <div className="d-lg-none d-md-block d-block w-100 mt-2">
                  <input
                    type="search"
                    className="form-control py-4 mt-0 mb-3 rounded border ms-0 cart-cart1"
                    placeholder="Search..."
                    name="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="d-flex flex-column">
                  <h2 className="mb-3 fw-bold text-start home-product">
                    Categories
                  </h2>

                  <div className="list-filters">
                    <ul className="mb-4" style={{ paddingLeft: 0 }}>
                      <li className="mb-2">
                        <div
                          className="d-flex justify-content-between align-items-start flex-row"
                          onClick={() => handleCategorySelect("New Arrivals")}
                          style={{
                            cursor: "pointer",
                            fontWeight:
                              selectedCategory === "Headphones"
                                ? "bold"
                                : "normal",
                          }}
                        >
                          <span>
                            <img
                              src={Over}
                              width="20"
                              className="me-2"
                              alt="Over"
                            />
                            New Arrivals
                          </span>
                        </div>
                      </li>

                      <li className="mb-2">
                        <div className="d-flex justify-content-between align-items-start flex-row">
                          <span
                            onClick={() => handleCategorySelect("Electronics")}
                          >
                            <img
                              src={computer}
                              width="20"
                              className="me-2"
                              alt="computer"
                            />
                            Electronics
                          </span>

                          <div style={{ width: "20px", textAlign: "right" }}>
                            <FontAwesomeIcon
                              className="toggle-icon"
                              icon={plus3 ? faMinus : faPlus}
                              onClick={plusClicked3}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </div>

                        {plus3 && (
                          <ul className="ms-3 mt-1 p-0 line-cate">
                            <li className="mb-1 fw-bold">
                              <span
                                onClick={() => handleCategorySelect("Featured")}
                              >
                                {" "}
                                Featured
                              </span>
                              <FontAwesomeIcon
                                className="toggle-icon3"
                                icon={plus4 ? faMinus : faPlus}
                                style={{ cursor: "pointer" }}
                                onClick={plusClicked4}
                              />
                              {plus4 && (
                                <div className="ms-4">
                                  <li
                                    className="mb-1"
                                    onClick={() =>
                                      handleCategorySelect("New Arrivals")
                                    }
                                  >
                                    New Arrivals
                                  </li>
                                  <li
                                    className="mb-1"
                                    onClick={() =>
                                      handleCategorySelect("Best Sellers")
                                    }
                                  >
                                    Best Sellers
                                  </li>
                                  <li
                                    className="mb-1"
                                    onClick={() =>
                                      handleCategorySelect("Mobile Phone")
                                    }
                                  >
                                    Mobile Phone
                                  </li>
                                </div>
                              )}
                            </li>

                            <li className="mb-1 fw-bold">
                              <span
                                onClick={() =>
                                  handleCategorySelect("Computers & Laptops")
                                }
                              >
                                Computers & Laptops
                              </span>
                              <FontAwesomeIcon
                                className="toggle-icon2"
                                icon={plus5 ? faMinus : faPlus}
                                onClick={plusClicked5}
                                style={{ cursor: "pointer" }}
                              />
                              {plus5 && (
                                <div className="ms-4">
                                  <li
                                    className="mb-1"
                                    onClick={() =>
                                      handleCategorySelect("Top Brands")
                                    }
                                  >
                                    Top Brands
                                  </li>
                                  <li
                                    className="mb-1"
                                    onClick={() =>
                                      handleCategorySelect(
                                        "Weekly Best Selling"
                                      )
                                    }
                                  >
                                    Weekly Best Selling
                                  </li>
                                  <li
                                    className="mb-1"
                                    onClick={() =>
                                      handleCategorySelect("CPU Heat Pipes")
                                    }
                                  >
                                    CPU Heat Pipes
                                  </li>
                                  <li
                                    className="mb-1"
                                    onClick={() =>
                                      handleCategorySelect("CPU Coolers")
                                    }
                                  >
                                    CPU Coolers
                                  </li>
                                </div>
                              )}
                            </li>

                            <li className="mb-1 fw-bold">
                              <span
                                onClick={() =>
                                  handleCategorySelect("Accessories")
                                }
                              >
                                Accessories
                              </span>
                              <FontAwesomeIcon
                                className="toggle-icon1"
                                icon={plus6 ? faMinus : faPlus}
                                onClick={plusClicked6}
                                style={{ cursor: "pointer" }}
                              />
                              {plus6 && (
                                <div className="ms-4">
                                  <li
                                    className="mb-1"
                                    onClick={() =>
                                      handleCategorySelect("Headphones")
                                    }
                                  >
                                    Headphones
                                  </li>
                                  <li
                                    className="mb-1"
                                    onClick={() =>
                                      handleCategorySelect(
                                        "Wireless Headphones"
                                      )
                                    }
                                  >
                                    Wireless Headphones
                                  </li>
                                  <li
                                    className="mb-1"
                                    onClick={() =>
                                      handleCategorySelect("TWS Earphones")
                                    }
                                  >
                                    TWS Earphones
                                  </li>
                                  <li
                                    className="mb-1"
                                    onClick={() =>
                                      handleCategorySelect("Smart Watch")
                                    }
                                  >
                                    Smart Watch
                                  </li>
                                </div>
                              )}
                            </li>

                            <li
                              className="mb-1 fw-bold"
                              onClick={() =>
                                handleCategorySelect("Gaming Console")
                              }
                            >
                              Gaming Console
                            </li>

                            <li
                              className="mb-1 fw-bold"
                              onClick={() =>
                                handleCategorySelect("Play Station")
                              }
                            >
                              Play Station
                            </li>
                          </ul>
                        )}
                      </li>

                      <li
                        className="mb-2"
                        onClick={() => handleCategorySelect("Gifts")}
                      >
                        <img
                          src={gift}
                          width="20"
                          className="me-2"
                          alt="gift"
                        />{" "}
                        Gifts
                      </li>

                      <li className="mb-2">
                        <div className="d-flex justify-content-between align-items-start flex-row">
                          <span
                            onClick={() => handleCategorySelect("Computers")}
                          >
                            <img
                              src={computer}
                              width="20"
                              className="me-2"
                              alt="computer"
                            />
                            Computers
                          </span>
                          <div style={{ width: "20px", textAlign: "right" }}>
                            <FontAwesomeIcon
                              className="toggle-icon"
                              icon={plus ? faMinus : faPlus}
                              onClick={plusClicked}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </div>

                        {plus && (
                          <ul className="ms-3 mt-1 p-0 line-cate fw-bold">
                            <li
                              className="mb-1"
                              onClick={() => handleCategorySelect("Desktop")}
                            >
                              Desktop
                            </li>
                            <li
                              className="mb-1"
                              onClick={() => handleCategorySelect("Laptop")}
                            >
                              Laptop
                            </li>
                            <li
                              className="mb-1"
                              onClick={() => handleCategorySelect("Tablet")}
                            >
                              Tablet
                            </li>
                            <li
                              className="mb-1"
                              onClick={() =>
                                handleCategorySelect("Accessories")
                              }
                            >
                              Accessories
                            </li>
                          </ul>
                        )}
                      </li>

                      <li
                        className="mb-2"
                        onClick={() =>
                          handleCategorySelect("Smartphones & Tablets")
                        }
                      >
                        <img
                          src={Smart}
                          width="20"
                          className="me-2"
                          alt="Smart"
                        />{" "}
                        Smartphones & Tablets
                      </li>

                      <li
                        className="mb-2"
                        onClick={() => handleCategorySelect("Video & Music")}
                      >
                        <img
                          src={Electronic}
                          width="20"
                          className="me-2"
                          alt="Electronic"
                        />{" "}
                        TV, Video & Music
                      </li>

                      <li
                        className="mb-2"
                        onClick={() => handleCategorySelect("Cameras")}
                      >
                        <img
                          src={camera}
                          width="20"
                          className="me-2"
                          alt="camera"
                        />{" "}
                        Cameras
                      </li>

                      <li
                        className="mb-2"
                        onClick={() => handleCategorySelect("Cooking")}
                      >
                        <img
                          src={cook}
                          width="20"
                          className="me-2"
                          alt="cook"
                        />{" "}
                        Cooking
                      </li>

                      <li className="mb-2">
                        <div className="d-flex justify-content-between align-items-start flex-row">
                          <span
                            onClick={() => handleCategorySelect("Accessories")}
                          >
                            <img
                              src={computer}
                              width="20"
                              className="me-2"
                              alt="computer"
                            />
                            Accessories
                          </span>
                          <div style={{ width: "20px", textAlign: "right" }}>
                            <FontAwesomeIcon
                              className="toggle-icon"
                              icon={plus1 ? faMinus : faPlus}
                              onClick={plusClicked1}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </div>

                        {plus1 && (
                          <ul className="ms-3 mt-2 p-0">
                            <li
                              className="mb-1 fw-bold"
                              onClick={() =>
                                handleCategorySelect("With Bluetooth")
                              }
                            >
                              With Bluetooth
                            </li>
                          </ul>
                        )}
                      </li>

                      <li
                        className="mb-2"
                        onClick={() => handleCategorySelect("Sports")}
                      >
                        <img
                          src={access}
                          width="20"
                          className="me-2"
                          alt="access"
                        />{" "}
                        Sports
                      </li>

                      <li className="mb-2">
                        <div className="d-flex justify-content-between align-items-start flex-row">
                          <span
                            onClick={() =>
                              handleCategorySelect("Electronic Gadgets")
                            }
                          >
                            <img
                              src={computer}
                              width="20"
                              className="me-2"
                              alt="computer"
                            />
                            Electronic Gadgets
                          </span>
                          <div style={{ width: "20px", textAlign: "right" }}>
                            <FontAwesomeIcon
                              className="toggle-icon"
                              icon={plus2 ? faMinus : faPlus}
                              onClick={plusClicked2}
                              style={{ cursor: "pointer" }}
                            />
                          </div>
                        </div>

                        {plus2 && (
                          <ul className="ms-3 mt-1 p-0 line-cate fw-bold">
                            <li
                              className="mb-1"
                              onClick={() => handleCategorySelect("Microscope")}
                            >
                              Microscope
                            </li>
                            <li
                              className="mb-1"
                              onClick={() =>
                                handleCategorySelect("Remote Control")
                              }
                            >
                              Remote Control
                            </li>
                            <li
                              className="mb-1"
                              onClick={() => handleCategorySelect("Monitor")}
                            >
                              Monitor
                            </li>
                            <li
                              className="mb-1"
                              onClick={() =>
                                handleCategorySelect("Thermometer")
                              }
                            >
                              Thermometer
                            </li>
                            <li
                              className="mb-1"
                              onClick={() => handleCategorySelect("Backpack")}
                            >
                              Backpack
                            </li>
                            <li
                              className="mb-1"
                              onClick={() => handleCategorySelect("Headphones")}
                            >
                              Headphones
                            </li>
                          </ul>
                        )}
                      </li>
                    </ul>
                  </div>

                  <div className="lh-lg mt-0 w-100 border p-2 rounded mb-3">
                    <h2 className="mb-3 fw-bold text-start home-product">
                      Brand
                    </h2>
                    <div className="border w-100 mt-0 mb-2"></div>

                    <label htmlFor="brand-select" className="visually-hidden" />
                    <select
                      id="brand-select"
                      className="form-select weight-option mb-3 mt-3 w-100"
                      value={selectedBrands[0] || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === "") {
                          setSelectedBrands([]);
                        } else {
                          setSelectedBrands([value]);
                        }
                      }}
                    >
                      <option value="">Select a brand</option>
                      {Array.isArray(brands) &&
                        brands.map((brand, index) => (
                          <option key={index} value={brand.name}>
                            {brand.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="lh-lg mt-0 w-100 border p-2 rounded mb-3">
                    <h2 className="mb-3 fw-bold text-start home-product">
                      Tags
                    </h2>
                    <div className="border w-100 mt-0 mb-2"></div>
                    <label htmlFor="tag-select" className="visually-hidden" />
                    <select
                      id="tag-select"
                      className="form-select weight-option mb-3 mt-3 w-100"
                      value={selectedTags[0] || ""}
                      onChange={(e) => {
                        const tag = e.target.value;
                        if (tag === "") {
                          setSelectedTags([]);
                          setUseTagsFilter(false);
                        } else {
                          setSelectedTags([tag]);
                          setUseTagsFilter(true);
                        }
                      }}
                    >
                      <option value="">Select a tag</option>
                      {Array.isArray(tags) &&
                        tags.map((tag, index) => (
                          <option key={index} value={tag.name}>
                            {tag.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div
                    style={{ width: "310px", margin: "0px auto" }}
                    className="ms-0 mb-4"
                  >
                    <h2 className="fw-bold text-start home-product">Price</h2>
                    <div className="border w-100 mt-0 mb-2"></div>
                    <label htmlFor="price-select" className="visually-hidden" />
                    <div
                      style={{ marginBottom: "13px" }}
                      className="sales-font"
                    >
                      ${values[0]}.00 - ${values[1]}.00
                    </div>

                    <Range
                      step={1}
                      min={0}
                      max={1000}
                      values={values}
                      onChange={(values) => handleChange(values)}
                      renderTrack={({ props, children }) => {
                        const { key, ...rest } = props;
                        return (
                          <div
                            key={key}
                            {...rest}
                            style={{
                              ...props.style,
                              height: "6px",
                              background: "#ccc",
                              borderRadius: "3px",
                            }}
                          >
                            <div
                              style={{
                                position: "absolute",
                                height: "6px",
                                background: "#4caf50",
                                borderRadius: "3px",
                                left: `${(values[0] / 1000) * 100}%`,
                                width: `${
                                  ((values[1] - values[0]) / 1000) * 100
                                }%`,
                              }}
                            />
                            {children}
                          </div>
                        );
                      }}
                      renderThumb={({ props, isDragged }) => {
                        const { key, ...rest } = props;
                        return (
                          <div
                            key={key}
                            {...rest}
                            style={{
                              ...props.style,
                              height: "20px",
                              width: "20px",
                              borderRadius: "50%",
                              backgroundColor: isDragged ? "#4caf50" : "#888",
                            }}
                          />
                        );
                      }}
                    />
                  </div>

                  <div className="mt-0 lh-lg w-100 border p-2 rounded">
                    <h2 className="mb-3 fw-bold text-start home-product">
                      Color
                    </h2>
                    <div className="border w-100 mt-2 mb-2"></div>
                    <label htmlFor="color-select" className="visually-hidden" />

                    <select
                      id="color-select"
                      className="form-select mt-2 weight-option mb-3 mt-3 w-100"
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                    >
                      <option value="">Select a color</option>
                      {attribute
                        .find((attr) => attr.title.toLowerCase() === "color")
                        ?.options.map((opt, index) => (
                          <option key={index} value={opt.title}>
                            {opt.title}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="lh-lg mt-3 w-100 border p-2 rounded">
                    <h2 className="mb-3 fw-bold text-start home-product">
                      Weight
                    </h2>
                    <div className="border w-100 mt-2 mb-2"></div>
                    <label
                      htmlFor="weight-select"
                      className="visually-hidden"
                    />

                    <select
                      id="weight-select"
                      className="form-select weight-option mb-3 mt-3 w-100"
                      value={selectedWeight}
                      onChange={(e) => setSelectedWeight(e.target.value)}
                    >
                      <option value="">Select weight</option>
                      {attribute
                        .find((attr) => attr.title.toLowerCase() === "weight")
                        ?.options.map((opt, index) => (
                          <option key={index} value={opt.title}>
                            {opt.title}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="lh-lg mt-3 w-100 border p-2 rounded">
                    <h2 className="mb-3 fw-bold text-start home-product">
                      Size
                    </h2>
                    <div className="border w-100 mt-2 mb-2"></div>
                    <label htmlFor="size-select" className="visually-hidden" />

                    <select
                      id="size-select"
                      className="form-select weight-option mb-3 mt-3 w-100"
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                    >
                      <option value="">Select size</option>
                      {attribute
                        .find((attr) => attr.title.toLowerCase() === "size")
                        ?.options.map((opt, index) => (
                          <option key={index} value={opt.title}>
                            {opt.title}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="lh-lg mt-3 w-100 mb-3 border p-2 rounded">
                    <h2 className="mb-3 fw-bold text-start home-product">
                      Boxes
                    </h2>
                    <div className="border w-100 mt-2 mb-2"></div>
                    <label htmlFor="boxes-select" className="visually-hidden" />

                    <select
                      id="boxes-select"
                      className="form-select weight-option mb-3 mt-3 w-100"
                      value={selectedBoxes}
                      onChange={(e) => setSelectedBoxes(e.target.value)}
                    >
                      <option value="">Select box size</option>
                      {attribute
                        .find((attr) => attr.title.toLowerCase() === "boxes")
                        ?.options.map((opt, index) => (
                          <option key={index} value={opt.title}>
                            {opt.title}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-8 col-lg-8 me-0 cart-cart">
              <div className="row mt-0 d-flex flex-row">
                {Array.isArray(image) && image.length > 0 ? (
                  image
                    .filter(
                      (data) =>
                        data.status === "Published" || data.status === "Draft"
                    )
                    .slice(0, 12)
                    .map((data, index) => {
                      const productLabel = label.find(
                        (item) => item.name === data.label
                      );
                      const labelColor = productLabel
                        ? productLabel.color
                        : "green";
                      const productImage = data.image
                        ? `http://89.116.170.231:1600/src/image/${data.image}`
                        : "/path/to/default-image.jpg";

                      return (
                        <div
                          key={index}
                          className="col-12 col-sm-6 col-md-6 col-lg-8 product-cate mb-2"
                        >
                          <div className="border rounded">
                            <div className="p-1 position-relative custom-hover-box">
                              {data.label && (
                                <span
                                  className="position-absolute top-0 end-0 m-2 px-2 py-1 text-light rounded cart-cart small"
                                  style={{
                                    backgroundColor: labelColor,
                                    fontSize: "15px",
                                    zIndex: 2,
                                  }}
                                >
                                  {data.label}
                                </span>
                              )}

                              <img
                                src={productImage}
                                alt={data.name}
                                className="card-img-top img-fluid"
                              />

                              <div className="custom-wishlist-container">
                                <button
                                  className="custom-wishlist-button"
                                  onClick={() => addWishlistItem(data)}
                                >
                                  <FontAwesomeIcon icon={faHeart} />
                                </button>
                                <div className="wishlist-tooltip cart-cart">
                                  Add to Wishlist
                                </div>
                              </div>

                              <button
                                className="btn text-light custom-cart-button cart-cart1"
                                onClick={() => addCartItem(data)}
                              >
                                <FontAwesomeIcon
                                  icon={faCartShopping}
                                  className="me-2"
                                />
                                Add to Cart
                              </button>
                            </div>

                            <div className="border w-100"></div>
                            <div className="card-body d-flex flex-column box-filter text-start p-2">
                              <span className="fw-bold">{data.name}</span>
                              <span className="fw-bold">{data.store}</span>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="fw-bold sales-font">
                                  {data.price}
                                </span>
                                <span className="fw-bold sales-font me-auto ms-2 text-decoration-line-through text-danger">
                                  {data.price_sale}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="col-12 text-start">
                    <p>No Products Available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>

      <footer className="footer pt-4 pb-4 cart-cart mt-4">
        <div className="container text-center text-md-left">
          <div className="row footer-lyte">
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 mx-auto mt-lg-3 mt-0 d-flex flex-column text-start ms-0">
              <img
                src={Tonic}
                alt="RxTonic"
                className="img-fluid mb-3"
                style={{ maxWidth: "190px" }}
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
                &copy; {new Date().getFullYear()} RxLYTE. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default ProductHome;
