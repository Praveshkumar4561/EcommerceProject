import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./ProductDetail.css";
import Tonic from "../../assets/Tonic.svg";
import Close from "../../assets/Close.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightLong,
  faCartShopping,
  faCircleInfo,
  faHeart,
  faImage,
  faStar,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import Hamburger from "../../assets/hamburger.svg";
import axios from "axios";
import UserContext from "../../context/UserContext";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import JsonLd from "../JsonLd";
import { Helmet } from "react-helmet-async";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ProductDetail() {
  let { count, setCount } = useContext(UserContext);
  let [tags, setTags] = useState([]);

  useEffect(() => {
    const cartdata = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/allcartdata"
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

  let [count6, setCount6] = useState(0);

  useEffect(() => {
    const wishlistdata = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/wishlistdata"
        );
        setCount6(response.data.length);
      } catch (error) {
        console.error("Error fetching wishlist data:", error);
      }
    };
    wishlistdata();
  }, []);

  const [reviewText, setReviewText] = useState("");
  const stored = localStorage.getItem("registeredUser");
  const user = stored ? JSON.parse(stored) : null;
  const isLoggedIn = !!user?.email;

  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const activeRating = hover > rating ? hover : rating;

  const [photos, setPhotos] = useState([]);
  const fileInputRef = useRef(null);
  const maxPhotos = 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    if (!reviewText) {
      toast.error("Please fill all required fields.", {
        position: "bottom-right",
        autoClose: 1000,
        progressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    const user = JSON.parse(localStorage.getItem("registeredUser"));
    const first_name = user?.first_name || "";
    const email = user?.email || "";
    if (!first_name || !email || !reviewText) {
      toast.error("Please fill all required fields.", {
        position: "bottom-right",
        autoClose: 1000,
        progressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    const formData = new FormData();
    formData.append("user_name", first_name);
    formData.append("email", email);
    formData.append("star", rating);
    formData.append("comment", reviewText);
    formData.append("totalImages", photos.length);
    photos.forEach((photo) => {
      formData.append("images", photo.file);
    });

    try {
      const response = await axios.post(
        "http://147.93.45.171:1600/reviewdatasubmit",
        formData
      );
      if (response.status === 200) {
        toast.success("Review submitted successfully!", {
          position: "bottom-right",
          autoClose: 1000,
          ProgressBar: true,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        });
        setReviewText("");
        setPhotos([]);
        setRating(1);
        setHover(0);
      } else {
        toast.error("Submission failed. Try again.", {
          position: "bottom-right",
          autoClose: 1000,
          progressBar: true,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error("Something went wrong while submitting the review.", {
        position: "bottom-right",
        autoClose: 1000,
        progressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Each photo must be less than 2 MB.", {
        position: "bottom-right",
        autoClose: 1000,
        progressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    const dup = photos.find(
      (p) =>
        p.file.name === file.name &&
        p.file.size === file.size &&
        p.file.lastModified === file.lastModified
    );
    if (dup) {
      toast.error("This photo is already uploaded.", {
        position: "bottom-right",
        autoClose: 1000,
        progressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    const url = URL.createObjectURL(file);
    setPhotos((prev) =>
      prev.length < maxPhotos ? [...prev, { file, url }] : prev
    );
    e.target.value = "";
  };

  const handleRemovePhoto = (i) => {
    setPhotos((prev) => prev.filter((_, idx) => idx !== i));
  };

  let [reviews, setReviews] = useState([]);

  useEffect(() => {
    let reviewdata = async () => {
      let response = await axios.get("http://147.93.45.171:1600/reviewdata");
      setReviews(response.data);
    };
    reviewdata();
    const interval = setInterval(() => {
      reviewdata();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const validStars = reviews
    .map((r) => Number(r.star))
    .filter((s) => !isNaN(s) && s >= 1 && s <= 5);

  const totalReviews = validStars.length;

  const starCounts = [5, 4, 3, 2, 1].reduce((acc, star) => {
    acc[star] = validStars.filter((s) => s === star).length;
    return acc;
  }, {});

  const averageRating =
    totalReviews > 0
      ? (validStars.reduce((sum, s) => sum + s, 0) / totalReviews).toFixed(2)
      : "0.00";

  const getPercentage = (count) =>
    totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(2) : "0.00";

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
              <div className="row mt-lg-2 mt-0 me-lg-3 w-auto p-2">
                <div className="col-12">
                  <div className="car bg-body rounded">
                    <div className="d-flex flex-row gap-2 flex-wrap flex-lg-nowrap flex-md-nowrap">
                      <div className="border rounded p-3 text-start d-flex flex-column detail-review">
                        <h5 className="mt-2">Customer Reviews</h5>

                        <div className="d-flex flex-row flex-md-wrap align-items-center gap-1 mt-0 mb-1 sales-font">
                          <h4 className="fw-bold mb-0">{averageRating}</h4>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <FontAwesomeIcon
                              key={i}
                              icon={faStar}
                              className={
                                i <= Math.round(averageRating)
                                  ? "text-warning"
                                  : "text-secondary"
                              }
                            />
                          ))}
                          <span className="ms-2 review-span">
                            ({totalReviews} Reviews)
                          </span>
                        </div>

                        <div className="mt-1 w-100">
                          {[5, 4, 3, 2, 1].map((star) => (
                            <div
                              key={star}
                              className="d-flex flex-row align-items-center gap-2 mb-1"
                            >
                              <div
                                style={{ width: "60px" }}
                                className="sales-font star-size"
                              >
                                {star} Star{star > 1 ? "s" : ""}
                              </div>
                              <div
                                className="flex-grow-1 bg-light-product rounded"
                                style={{ height: "10px" }}
                              >
                                <div
                                  className="rounded"
                                  style={{
                                    width: `${getPercentage(
                                      starCounts[star] || 0
                                    )}%`,
                                    height: "100%",
                                    backgroundColor: "#f6c343",
                                  }}
                                ></div>
                              </div>
                              <div
                                style={{ width: "60px", textAlign: "right" }}
                                className="sales-font"
                              >
                                {getPercentage(starCounts[star] || 0)}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="border-0 rounded p-2 detail-review1 text-start d-flex flex-column line-review">
                        <form onSubmit={handleSubmit}>
                          <h4 className="fw-bold mb-1">Add your review</h4>
                          <span>
                            Your email address will not be published. Required
                            fields are marked *
                          </span>

                          {!isLoggedIn && (
                            <div className="mb-0 text-danger fw-bold">
                              Please login to write review!
                            </div>
                          )}

                          <div className="d-flex flex-row flex-nowrap align-items-center mt-1">
                            <span>Your rating:</span>
                            <div className="ms-2">
                              {[1, 2, 3, 4, 5].map((star, index) => (
                                <FontAwesomeIcon
                                  key={index}
                                  icon={faStar}
                                  className="me-1"
                                  style={{
                                    color:
                                      star <= activeRating ? "#fab528" : "#ccc",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => setRating(star)}
                                  onMouseEnter={() => {
                                    if (star > rating) {
                                      setHover(star);
                                    }
                                  }}
                                  onMouseLeave={() => setHover(0)}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="mt-1">
                            <label htmlFor="review">Review:</label>
                            <textarea
                              className="form-control rounded-0 mt-1 py-2 cart-cart1 review-none"
                              placeholder="Write your review"
                              value={reviewText}
                              onChange={(e) =>
                                isLoggedIn && setReviewText(e.target.value)
                              }
                              style={{ height: "120px", resize: "none" }}
                              required
                              disabled={!isLoggedIn}
                            />
                          </div>

                          <div>
                            <div className="d-flex flex-row flex-wrap">
                              {photos.map((photo, index) => (
                                <div
                                  key={index}
                                  className="mt-3 dotted-border d-flex flex-column lh-1 text-start py-2 px-2 position-relative"
                                  style={{
                                    marginRight: "10px",
                                    minWidth: "100px",
                                    minHeight: "100px",
                                    backgroundColor: "#f8f9fa",
                                  }}
                                >
                                  <img
                                    src={photo.url}
                                    alt={`Uploaded ${index}`}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                    loading="lazy"
                                  />
                                  <div
                                    className="position-absolute top-0 end-0 p-1"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleRemovePhoto(index)}
                                  >
                                    <FontAwesomeIcon
                                      icon={faTimes}
                                      className="text-danger"
                                    />
                                  </div>
                                </div>
                              ))}
                              {photos.length < maxPhotos && (
                                <div
                                  className="mt-3 dotted-border d-flex flex-column lh-1 text-start py-2 px-2"
                                  onClick={handleUploadClick}
                                  style={{
                                    cursor: "pointer",
                                    minWidth: "100px",
                                    minHeight: "100px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <FontAwesomeIcon
                                    icon={faImage}
                                    className="fs-5 ms-lg-0 ps-lg-0"
                                  />
                                  <span className="text-center mt-1 lh-sm photos-upload">
                                    {photos.length === 0
                                      ? "Upload photos"
                                      : `${photos.length}/${maxPhotos}`}
                                  </span>
                                </div>
                              )}
                            </div>

                            <input
                              type="file"
                              accept="image/*"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              style={{ display: "none" }}
                            />

                            <div className="border rounded-0 mt-3 px-2 py-2 d-flex bg-light-product flex-row align-items-center">
                              <FontAwesomeIcon
                                icon={faCircleInfo}
                                className="me-2"
                              />
                              You can upload up to {maxPhotos} photos, each
                              photo maximum size is 2 MB.
                            </div>
                          </div>

                          <button className="mt-2 cart-cart1 btn btn-success-product d-flex align-items-center btn-submits">
                            Submit
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-column mt-3">
                  <h4 className="fw-bold text-start">Images from customer</h4>
                  {Array.isArray(reviews) && reviews.length > 0 ? (
                    <div className="d-flex flex-row flex-wrap gap-2 mt-2">
                      {reviews
                        .filter((data) => data.image)
                        .map((data, key) => (
                          <img
                            key={key}
                            src={`http://147.93.45.171:1600/src/image/${data.image}`}
                            alt="Customer Upload"
                            className="img-thumbnail"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                            loading="lazy"
                          />
                        ))}
                      <div className="text-start d-flex flex-column"></div>
                    </div>
                  ) : (
                    <span>No customer images available.</span>
                  )}
                  <div className="col-12 d-flex flex-column"></div>
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
                              `http://147.93.45.171:1600/src/image/${detail[0].image}`
                            }
                            alt="Product"
                            className="img-fluid"
                            loading="lazy"
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

  useEffect(() => {
    const detailsdata = async () => {
      try {
        let response = await axios.get(
          "http://147.93.45.171:1600/productpagedata"
        );
        const filteredData = response.data.filter(
          (detail) => detail.status === "Published" || detail.status === "Draft"
        );
        setDetail(filteredData);
      } catch (error) {
        console.error("Error fetching blog data", error);
      }
    };
    detailsdata();
  }, []);

  let [shop, setShop] = useState([]);

  useEffect(() => {
    const shopdata = async () => {
      try {
        let response = await axios.get(
          "http://147.93.45.171:1600/productpagedata"
        );
        const filteredData = response.data.filter(
          (shop) => shop.status === "Published" || shop.status === "Draft"
        );
        setShop(filteredData);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    shopdata();
  }, []);

  let [counts, setCounts] = useState(0);

  const increment = () => {
    if (counts < 500) {
      setCounts(counts + 1);
    }
  };

  const decrement = () => {
    if (counts > 1) {
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

  const addCartItem = async (product) => {
    let formData = new FormData();
    const name = product?.name || selectedName || "";
    const store = product?.store || selectedStore || "";
    const price = product?.price || selectedPrice || "";
    const price_sale = product?.price_sale || selectedSale || "";
    const imagePath = product?.image || selectedImage || "";
    const imageFileName = imagePath.split("/").pop();

    formData.append("name", name);
    formData.append("store", store);
    formData.append("price", price);
    formData.append("price_sale", price_sale);
    if (imageFileName) {
      formData.append("image", imageFileName);
    }

    try {
      const response = await axios.post(
        "http://147.93.45.171:1600/addcart",
        formData
      );
      if (response.status === 200) {
        setCount((prevCount) => prevCount + 1);
        toast.success("Product successfully added to cart", {
          position: "bottom-right",
          autoClose: 1000,
          closeOnClick: true,
          draggable: true,
        });
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (error) {
      toast.error("Product could not be added to the cart", {
        position: "bottom-right",
        autoClose: 1000,
        closeOnClick: true,
        draggable: true,
      });
    }
  };

  useEffect(() => {
    if (selectedSku) {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const cartItems = JSON.parse(storedCart);
        const existingProduct = cartItems.find(
          (item) => item.sku === selectedSku
        );
        if (existingProduct) {
          setCounts(existingProduct.quantity);
        } else {
          setCounts(0);
        }
      } else {
        setCounts(0);
      }
    }
  }, [selectedSku]);

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
        "http://147.93.45.171:1600/wishlistpost",
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
      detailsdata();
    } catch (error) {}
  };

  useEffect(() => {
    const tagdata = async () => {
      try {
        let response = await axios.get(
          "http://147.93.45.171:1600/producttagdata"
        );
        const filteredData = response.data.filter(
          (user) => user.status === "Published" || user.status === "Draft"
        );
        setTags(filteredData);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };
    tagdata();
  }, []);

  let [label, setLabel] = useState([]);

  useEffect(() => {
    const labeldata = async () => {
      try {
        let response = await axios.get(
          "http://147.93.45.171:1600/productlabelsdata"
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
      .get("http://147.93.45.171:1600/get-theme-logo")
      .then((response) => {
        if (response.data) {
          setLogoUrl(
            `http://147.93.45.171:1600/src/image/${response.data.logo_url}`
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
          "http://147.93.45.171:1600/get-theme-breadcrumb"
        );
        setBread(response.data);
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
            item: "http://srv689968.hstgr.cloud/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Products",
            item: "http://srv689968.hstgr.cloud/product/details",
          },
        ],
      },
      ...detail.map((item) => ({
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

  let [ads, setAds] = useState([]);

  useEffect(() => {
    const adspagedata = async () => {
      try {
        const response = await axios.get("http://147.93.45.171:1600/adsdata");
        setAds(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    adspagedata();
  }, []);

  let [attribute, setAttribute] = useState([]);

  useEffect(() => {
    let attribues = async () => {
      let response = await axios.get(
        "http://147.93.45.171:1600/attributesdata1"
      );
      setAttribute(response.data);
    };
    attribues();
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
          "http://147.93.45.171:1600/cookiesalldata"
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
      await axios.post("http://147.93.45.171:1600/newsletterpost", letter);
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

  let [flash, setFlash] = useState([]);

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const fetchFlashSales = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/allflashdata"
        );
        const data = response.data;
        setFlash(data);
      } catch (error) {
        console.error("Error fetching flash sales:", error);
      }
    };
    fetchFlashSales();

    const interval = setInterval(() => {
      fetchFlashSales();
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!flash.products || !flash.sales || flash.products.length === 0) return;
    const selectedProductName = (selectedName || shop[0]?.name)?.toLowerCase();
    const matchingProduct = flash.products.find(
      (p) => p.product_name.toLowerCase() === selectedProductName
    );
    if (!matchingProduct) return;
    const matchingSale = flash.sales.find(
      (sale) => sale.id === matchingProduct.flashsale_id
    );
    if (!matchingSale) return;
    const endDate = new Date(matchingSale.end_date).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate - now;
      if (distance < 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 100);
    return () => clearInterval(interval);
  }, [selectedName, shop, flash]);

  return (
    <>
      <JsonLd data={schemaData} />

      <Helmet>
        <title>Product Details - Buy Quality Products Online | Rxlyte</title>
        <meta
          name="description"
          content="Explore detailed information about our top-quality products. Buy online with secure checkout and fast delivery at Rxlyte."
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="http://srv689968.hstgr.cloud/product-details"
        />
      </Helmet>

      <div
        className="container"
        id="container-customx"
        style={{
          backgroundColor:
            user?.background_color ||
            (user?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: user?.background_image
            ? `url(http://147.93.45.171:1600/src/image/${user.background_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: user?.breadcrumb_height
            ? `${user.breadcrumb_height}px`
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
                    loading="lazy"
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
                      loading="lazy"
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
                      loading="lazy"
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
                      loading="lazy"
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
                      loading="lazy"
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
                        <Link to="/" className="text-dark">
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

      <div className="container-fluid">
        <div className="container">
          <div className="row m-auto">
            <div className="ad-container m-0">
              {(() => {
                const footerAd = ads.find(
                  (data) =>
                    data.location === "Header(after)" ||
                    data.location === "Detail Page(before)" ||
                    (data.location === "Listing Page(before)" &&
                      new Date(data.expired) > new Date() &&
                      data.status !== "pending")
                );
                if (!footerAd) return null;

                const cardClass =
                  footerAd.ads_size === "full-width"
                    ? "ad-card full-width-card"
                    : "ad-card";

                return (
                  <div className="ad-card-container">
                    <div className={cardClass}>
                      <picture className="ad-picture">
                        {footerAd.mobileImage && (
                          <source
                            media="(max-width: 767px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.mobileImage}`}
                          />
                        )}
                        {footerAd.desktopImage && (
                          <source
                            media="(min-width: 768px) and (max-width: 991px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.desktopImage}`}
                          />
                        )}
                        <img
                          src={`http://147.93.45.171:1600/src/image/${footerAd.image}`}
                          alt="Advertisement"
                          className="ad-img"
                          loading="lazy"
                        />
                      </picture>
                      <div className="ad-overlay">
                        <div className="ad-overlay-top">
                          <button className="ad-button btn btn-success-product d-flex cart-cart1">
                            <Link to="/shop" className="ad-link">
                              {footerAd.button}
                            </Link>
                          </button>
                        </div>
                        <div className="ad-overlay-bottom cart-cart">
                          <h3 className="ad-title">{footerAd.title}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid overflow-hidden d-flex justify-content-center align-items-center position-relative overflow-x-hidden">
        <div className="container d-flex justify-content-center">
          <div className="row mt-lg-5 mt-4 d-flex flex me-md-1">
            {Array.isArray(shop) && shop.length > 0 ? (
              shop.slice(0, 1).map((key) => (
                <div
                  className="col-12 col-lg-6 col-md-6 shop-div d-flex gap-3 d-flex w-100 position-relative border"
                  key={key}
                >
                  <div
                    className="d-flex flex-lg-column flex-row flex-md-column gap-1 gap-lg-2 flex-sm-column flex-wrap mt-0"
                    style={{ cursor: "pointer" }}
                  >
                    {Array.isArray(shop) && shop.length > 0 ? (
                      shop.slice(0, 4).map((data, key) => (
                        <div
                          className="box me-0"
                          key={key}
                          onClick={() =>
                            applyImage(
                              `http://147.93.45.171:1600/src/image/${data.image}`,
                              data.name,
                              data.description,
                              data.price,
                              data.store,
                              data.price_sale
                            )
                          }
                        >
                          <img
                            src={`http://147.93.45.171:1600/src/image/${data.image}`}
                            alt="RxLYTE"
                            className="border"
                            loading="lazy"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-start text-start">
                        No products available
                      </p>
                    )}
                  </div>
                  <img
                    src={
                      selectedImage ||
                      `http://147.93.45.171:1600/src/image/${shop[0]?.image}`
                    }
                    alt={`${shop[0]?.name || "RxLYTE"} product shot`}
                    className="head-image"
                    width={shop[0]?.naturalWidth}
                    height={shop[0]?.naturalHeight}
                    loading="lazy"
                  />
                </div>
              ))
            ) : (
              <p className="text-start">No shop data available</p>
            )}

            <div className="col-12 col-lg-6 col-md-6 single-shop bg-light-product pb-4">
              <div className="d-flex align-items-start align-items-lg-start flex-column h-auto">
                {Array.isArray(shop) && shop.length > 0 ? (
                  shop.slice(0, 1).map((item, idx) => (
                    <React.Fragment key={idx}>
                      <div className="d-flex flex-row pe-lg-0">
                        <h2 className="mt-2 pt-3 me-md-5 me-lg-0 me-xxl-4 pe-lg-5 ms-0 ms-lg-0 ps-0 ps-lg-0 cart-cart text-start home-detail ms-md-5 mb-1 ps-md-5">
                          {selectedName || item.name}
                        </h2>
                      </div>

                      <h3 className="mt-0 pt-0 text-success fw-medium d-flex flex-row me-auto ms-lg-0 store-detail">
                        {selectedStore || item.store}
                      </h3>

                      <p className="text-dark text-start mb-0 lh-lg cart-cart me-2 pe-3 pe-lg-0 ms-lg-1">
                        {selectedDescription || item.description}
                      </p>

                      <div className="d-flex flex-row gap-2 me-auto sales-font">
                        <h4 className="mt-0 pt-0 text-success fw-medium d-flex flex-row ms-0 ms-md-0 me-auto">
                          {selectedPrice || item.price}
                        </h4>
                        <h4 className="mt-0 pt-0 text-danger fw-medium d-flex flex-row ms-0 dollar-rupeex me-auto">
                          <strike>{selectedSale || item.price_sale}</strike>
                        </h4>
                      </div>

                      {flash.products?.some(
                        (p) =>
                          (selectedName || item.name).toLowerCase() ===
                          p.product_name.toLowerCase()
                      ) && (
                        <div
                          role="region"
                          aria-labelledby="flash-sale-heading"
                          className="w-100 border border-danger d-flex flex-column mb-2 mt-1 p-2 cart-cart1 rounded-0 flash-cart"
                        >
                          <h5
                            id="flash-sale-heading"
                            className="text-danger fw-bold"
                          >
                            Flash Sale ends in:
                          </h5>
                          <p className="text-danger sales-font mt-1 fw-bold">
                            {countdown.days}D : {countdown.hours}H :{" "}
                            {countdown.minutes}M : {countdown.seconds}S
                          </p>
                        </div>
                      )}

                      <div className="me-auto cart-cart mt-2">
                        <h4>Quantity:</h4>
                      </div>
                    </React.Fragment>
                  ))
                ) : (
                  <p className="mt-3 cart-cart text-start">
                    No shop details available
                  </p>
                )}
              </div>

              <div className="d-flex flex-row googles">
                {Array.isArray(shop) && shop.length > 0 ? (
                  shop.slice(0, 1).map((data, idx) => (
                    <React.Fragment key={idx}>
                      <div
                        className="plus bg-success text-white fw-bold px-3 py-3"
                        role="button"
                        tabIndex={0}
                        aria-label="Decrease quantity"
                        onClick={decrement}
                      >
                        –
                      </div>
                      <div
                        className="plus bg-secondary text-light fw-light px-3 py-3"
                        style={{ fontFamily: "verdana" }}
                      >
                        {counts}
                      </div>
                      <div
                        className="plus bg-success text-light fw-bold px-3 py-3"
                        role="button"
                        tabIndex={0}
                        aria-label="Increase quantity"
                        onClick={increment}
                      >
                        +
                      </div>
                      <button
                        className="cart-cart1 px-2 py-2 rounded btn d-flex py-4 rounded-0 btn-success-product text-light mt-2 cart-style cart-style1"
                        style={{ marginLeft: "13%" }}
                        onClick={() => addCartItem(data)}
                        aria-label={`Add ${data.name || "product"} to cart`}
                      >
                        Add To Cart
                      </button>
                    </React.Fragment>
                  ))
                ) : (
                  <p className="text-center cart-cart ms-5">
                    No items available for purchase
                  </p>
                )}
              </div>

              <div className="mt-3 cart-cart text-start">
                <h4>SKU: {selectedSku || detail[0]?.sku}</h4>
              </div>

              <div className="d-flex flex-row flex-wrap justify-content-start mt-2 ms-0 ps-0 cart-cart">
                <h4>Attributes:</h4>
                {Array.isArray(attribute) && attribute.length > 0 ? (
                  attribute.map((attr, i) => (
                    <span
                      key={i}
                      className="d-flex flex-row text-dark ms-1 mt-1 gap-0"
                    >
                      <Link
                        to={`/${url.productDetails}`}
                        className="text-dark text-decoration-none"
                      >
                        {attr.title},
                      </Link>
                    </span>
                  ))
                ) : (
                  <p>No tags available</p>
                )}
              </div>

              <div className="d-flex flex-row flex-wrap justify-content-start mt-2 ms-0 lh- cart-cart">
                <h4>Tag:</h4>
                {Array.isArray(tags) && tags.length > 0 ? (
                  tags.map((tag, i) => (
                    <span
                      key={i}
                      className="d-flex flex-row text-dark ms-1 mt-1 gap-0"
                    >
                      <Link
                        to={`/${url.productDetails}`}
                        className="text-dark text-decoration-none"
                      >
                        {tag.name},
                      </Link>
                    </span>
                  ))
                ) : (
                  <p>No tags available</p>
                )}
              </div>

              <div className="d-flex flex-row flex-wrap justify-content-start mt-0 ms-0 mt-2 lh- cart-cart">
                <h4>Share:</h4>
                <div className="d-flex flex-row text-dark ms-1 mt-0 gap-2">
                  <Link
                    to="https://www.facebook.com/"
                    target="_blank"
                    aria-label="Facebook"
                  >
                    <FontAwesomeIcon
                      icon={faFacebookF}
                      className="border px-2 py-2 rounded-5 text-dark"
                    />
                  </Link>
                  <Link
                    to="https://www.instagram.com/"
                    target="_blank"
                    aria-label="Instagram"
                  >
                    <FontAwesomeIcon
                      icon={faInstagram}
                      className="border px-2 py-2 rounded-5 text-dark"
                    />
                  </Link>
                  <Link
                    to="https://x.com/"
                    target="_blank"
                    aria-label="Twitter (X)"
                  >
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
            <div className="row row-cols-1 row-cols-sm-2 mt-0 row-cols-md-4 gap-2 g-3 d-flex flex-row flex-wrap me-md-2 me-lg-0 ">
              {Array.isArray(shop) && shop.length > 0 ? (
                detail.slice(0, 6).map((data, index) => {
                  const productLabel = label.find(
                    (item) => item.name === data.label
                  );
                  const labelColor = productLabel
                    ? productLabel.color
                    : "green";
                  const imageUrl = data.image
                    ? `http://147.93.45.171:1600/src/image/${data.image}`
                    : "http://147.93.45.171:1600/src/image/default-image.jpg";
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
                            className="position-absolute end-0 btn d-flex mt-2 rounded px-2 cart-cart product-label text-light"
                            style={{ backgroundColor: labelColor }}
                          >
                            {data.label}
                          </button>
                          <img
                            src={imageUrl}
                            alt={`Product Image ${index + 1}`}
                            className="w-100 h-100 object-fit-cover border-0 image-watch"
                            style={{ cursor: "pointer" }}
                            loading="lazy"
                          />
                        </Link>
                      </div>

                      <div className="border w-100"></div>

                      <h4 className="mt-0 lh-base text-start text-lg-start fw-bold price-name mt-2">
                        {getFormattedName(data.name || "Product Name", index)}
                      </h4>

                      <div
                        className="d-flex justify-content-start justify-content-lg-start mb-1 gap-1 mt-0 flex-row"
                        style={{ fontFamily: "verdana" }}
                      >
                        <span className="me-1">{data.price || "Price"}</span>
                        <strike className="text-danger fw-medium">
                          {data.discountPrice || "$54"}
                        </strike>
                      </div>

                      <button
                        className="d-flex btn btn-success-product justify-content-start mb-0 rounded-0 cart-cart align-self-start"
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
                        aria-label={`Buy now: ${data?.name || "product"}`}
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
                  <ul
                    className="row w-100 cart-cart d-flex flex-row flex-wrap mb-0"
                    role="tablist"
                  >
                    {["description", "additional Info", "reviews", "image"].map(
                      (tab) => (
                        <li
                          className="col-12 col-md-6 col-lg-3 text-sm-center product-viva d-flex"
                          key={tab}
                          role="presentation"
                        >
                          <button
                            className={`fw-medium fs-5 bg-transparent border-0 text-start ${
                              activeTab === tab
                                ? "text-success text-decoration-underline"
                                : ""
                            }`}
                            onClick={() => setActiveTab(tab)}
                            role="tab"
                            id={`tab-${tab.replace(/\s+/g, "-").toLowerCase()}`}
                            aria-controls={`panel-${tab
                              .replace(/\s+/g, "-")
                              .toLowerCase()}`}
                            aria-selected={activeTab === tab}
                          >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                          </button>
                        </li>
                      )
                    )}
                  </ul>

                  {["description", "additional Info", "reviews", "image"].map(
                    (tab) => (
                      <div
                        key={tab}
                        id={`panel-${tab.replace(/\s+/g, "-").toLowerCase()}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${tab
                          .replace(/\s+/g, "-")
                          .toLowerCase()}`}
                        hidden={activeTab !== tab}
                      ></div>
                    )
                  )}
                </div>
              </div>

              <div className="container card-details">
                <div className="row mt-lg-2 card-details mt-0 me-lg-3 me-0">
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
                            className="position-absolute end-0 btn d-flex mt-2 me-2 rounded px-2 cart-cart product-label text-light"
                            style={{ backgroundColor: labelColor }}
                          >
                            {data.label}
                          </button>

                          <img
                            src={`http://147.93.45.171:1600/src/image/${
                              data.image || "default-image.jpg"
                            }`}
                            alt={
                              data.name && data.name.trim() !== ""
                                ? `Image for ${data.name}`
                                : "Product image"
                            }
                            className="w-100 h-100 object-fit-cover border-0 image-watch"
                            style={{ cursor: "pointer" }}
                            loading="lazy"
                          />
                        </Link>

                        <button
                          className="position-absolute me-1 btn btn-light wishlist-button wishlist-button1 text-light btn-success-product"
                          onClick={() => addWishlistItem(data)}
                        >
                          <FontAwesomeIcon icon={faHeart} />
                          <div className="wishlist-button-content">
                            Add to Wishlist
                          </div>
                        </button>

                        <div className="add-to-cart-button-container">
                          <button
                            className="add-to-cart-button mt-4 d-flex flex-row cart-cart1"
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
                      <div className="border w-100"></div>
                      <div className="ms-3">
                        <h3 className="mt-2 mb-0 lh-base text-start text-lg-start price-row">
                          {data.store || "Product Store"}
                        </h3>
                        <h4 className="mt-0 lh-base text-start text-lg-start fw-bold price-name">
                          {data.name.split(" ").slice(0, 6).join(" ")}
                        </h4>
                        <h4 className="mt-1 lh-base text-start text-lg-start price-row">
                          SKU:{data.sku || "Product Name"}
                        </h4>
                        <div
                          className="d-flex justify-content-start justify-content-lg-start mb-2 gap-1 mt-1 flex-row"
                          style={{ fontFamily: "verdana" }}
                        >
                          <span className="me-1 price-amount">
                            {data.price || "Price"}
                          </span>
                          <strike className="text-danger-access fw-medium">
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
        <ToastContainer />
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

      <div className="container-fluid">
        <div className="container">
          <div className="row m-auto">
            <div className="ad-container m-0">
              {(() => {
                const footerAd = ads.find(
                  (data) =>
                    data.location === "Footer(before)" ||
                    data.location === "Detail Page(after)" ||
                    (data.location === "Listing Page(after)" &&
                      new Date(data.expired) > new Date() &&
                      data.status !== "pending")
                );
                if (!footerAd) return null;

                const cardClass =
                  footerAd.ads_size === "full-width"
                    ? "ad-card full-width-card"
                    : "ad-card";

                return (
                  <div className="ad-card-container">
                    <div className={cardClass}>
                      <picture className="ad-picture">
                        {footerAd.mobileImage && (
                          <source
                            media="(max-width: 767px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.mobileImage}`}
                          />
                        )}
                        {footerAd.desktopImage && (
                          <source
                            media="(min-width: 768px) and (max-width: 991px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.desktopImage}`}
                          />
                        )}
                        <img
                          src={`http://147.93.45.171:1600/src/image/${footerAd.image}`}
                          alt="Advertisement"
                          className="ad-img"
                          loading="lazy"
                        />
                      </picture>
                      <div className="ad-overlay">
                        <div className="ad-overlay-top">
                          <button className="ad-button btn btn-success-product d-flex cart-cart1">
                            <Link to="/shop" className="ad-link">
                              {footerAd.button}
                            </Link>
                          </button>
                        </div>
                        <div className="ad-overlay-bottom cart-cart">
                          <h3 className="ad-title">{footerAd.title}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
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
                  className="btn btn-success-product d-flex cart-cart1 py-4 me-0 ms-1"
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

      <div className="container-fluid">
        <div className="container">
          <div className="row m-auto">
            <div className="ad-container m-0">
              {(() => {
                const footerAd = ads.find(
                  (data) =>
                    data.location === "Footer(after)" &&
                    new Date(data.expired) > new Date() &&
                    data.status !== "pending"
                );
                if (!footerAd) return null;

                const cardClass =
                  footerAd.ads_size === "full-width"
                    ? "ad-card full-width-card"
                    : "ad-card";

                return (
                  <div className="ad-card-container mb-2">
                    <div className={cardClass}>
                      <picture className="ad-picture">
                        {footerAd.mobileImage && (
                          <source
                            media="(max-width: 767px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.mobileImage}`}
                          />
                        )}
                        {footerAd.desktopImage && (
                          <source
                            media="(min-width: 768px) and (max-width: 991px)"
                            srcSet={`http://147.93.45.171:1600/src/image/${footerAd.desktopImage}`}
                          />
                        )}
                        <img
                          src={`http://147.93.45.171:1600/src/image/${footerAd.image}`}
                          alt="Advertisement"
                          className="ad-img"
                          loading="lazy"
                        />
                      </picture>
                      <div className="ad-overlay">
                        <div className="ad-overlay-top">
                          <button className="ad-button btn btn-success-product d-flex cart-cart1">
                            <Link to="/shop" className="ad-link">
                              {footerAd.button}
                            </Link>
                          </button>
                        </div>
                        <div className="ad-overlay-bottom cart-cart">
                          <h3 className="ad-title">{footerAd.title}</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
