import React, { useContext, useEffect, useRef, useState } from "react";
import "./CustomerView.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faPhoneVolume,
  faBars,
  faMagnifyingGlass,
  faArrowLeft,
  faArrowRight,
  faX,
  faGreaterThan,
} from "@fortawesome/free-solid-svg-icons";
import Tonic from "../../assets/Tonic.svg";
import { Link, useNavigate } from "react-router-dom";
import Over from "../../assets/Over.webp";
import Address from "../../assets/Cart_address.webp";
import Cart_order from "../../assets/Cart_request.webp";
import Cart_reviews from "../../assets/Cart_reviews.webp";
import Cart_download from "../../assets/Cart_download.webp";
import Cart_setting from "../../assets/Cart_setting.webp";
import Cart_logout from "../../assets/Cart_logout.webp";
import Cart_user from "../../assets/Cart_user.webp";
import axios from "axios";
import { PDFDocument, StandardFonts } from "pdf-lib";
import Close from "../../assets/Close.webp";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";
import Hamburger from "../../assets/hamburger.svg";
import { Helmet } from "react-helmet-async";
import UserContext from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CustomerView() {
  let { count, setCount } = useContext(UserContext);

  useEffect(() => {
    const cartdata = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/allcartdata"
        );
        setCount(response.data.length);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    cartdata();
  }, []);

  const [user, setUser] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/getannounce"
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const now = new Date();
    const filtered = user.filter((user) => {
      return user.active === "yes" && new Date(user.end_date) >= now;
    });
    setFilteredAnnouncements(filtered);
    if (filtered.length > 0) {
      setCurrentIndex(0);
    }
  }, [user]);

  const leftData = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : filteredAnnouncements.length - 1
    );
  };

  const rightData = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < filteredAnnouncements.length - 1 ? prevIndex + 1 : 0
    );
  };

  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const allowedTypes = [
        "image/jpg",
        "image/jpeg",
        "image/png",
        "application/pdf",
      ];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError(
          "Invalid file type only jpg, jpeg, png, and pdf files are allowed."
        );
        setFile(null);
        return;
      }
      if (selectedFile.size > 2 * 1024 * 1024) {
        setError("File size exceeds 2MB.");
        setFile(null);
        return;
      }
      setError("");
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please upload a file", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }
    try {
      toast.success("File uploaded successfully", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Error uploading file", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [reasonError, setReasonError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const showPopup = () => {
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setReason("");
    setDescription("");
    setReasonError("");
    setDescriptionError("");
  };

  const cancelOrder = async (id) => {
    setReasonError("");
    setDescriptionError("");
    let valid = true;
    if (!reason) {
      setReasonError("Please fill this field");
      valid = false;
    }
    if (!description) {
      setDescriptionError("Please fill this field");
      valid = false;
    }
    if (!valid) return;

    try {
      await axios.delete(`https://demo.webriefly.com/api/deleteorder1/${id}`);
      toast.success("Order cancelled successfully", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
      localStorage.removeItem("cart");
      closePopup();
    } catch (error) {
      toast.error("Data is not deleted", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const navigate = useNavigate();

  let handleDelete = () => {
    axios.defaults.withCredentials = true;
    axios
      .get("https://demo.webriefly.com/api/logout")
      .then((res) => {
        if (res.data.Status === "Success") {
          localStorage.removeItem("token");
          localStorage.removeItem("userDetails");
          localStorage.removeItem("user");
          localStorage.removeItem("auth");
          localStorage.removeItem("cart");
          navigate(`/${url.login}`);
        } else {
        }
      })
      .catch((err) => {
        console.log("Error during logout:", err);
      });
  };

  let [detail, setDetail] = useState([]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const isAuthenticated = localStorage.getItem("auth");
      if (!storedUser || isAuthenticated !== "true") {
        navigate("/login");
      } else if (storedUser && storedUser.tokenExpiration) {
        if (Date.now() > storedUser.tokenExpiration) {
          localStorage.removeItem("user");
          localStorage.removeItem("auth");
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        } else {
          setDetail(storedUser);
        }
      } else {
        console.log("No tokenExpiration found in localStorage.");
      }
    };
    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 1000);
    return () => clearInterval(intervalId);
  }, [navigate]);

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
      .get("https://demo.webriefly.com/api/get-theme-logo")
      .then((response) => {
        if (response.data) {
          setLogoUrl(
            `https://demo.webriefly.com/uploads/${response.data.logo_url}`
          );
          setLogoHeight(response.data.logo_height || "45");
        }
      })
      .catch((error) => console.error("Error fetching logo:", error));
  }, []);

  let [count6, setCount6] = useState(0);

  useEffect(() => {
    const wishlistdata = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/wishlistdata"
        );
        setCount6(response.data.length);
      } catch (error) {
        console.error("Error fetching wishlist data:", error);
      }
    };
    wishlistdata();
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
      await axios.post("https://demo.webriefly.com/api/newsletterpost", letter);
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

  const [product, setProduct] = useState([]);
  let [search, setSearch] = useState("");
  let [search1, setSearch1] = useState("");
  const searchContainerRef = useRef(null);

  useEffect(() => {
    if (search) {
      searchbar();
    } else {
      homedata();
    }
  }, [search]);

  let searchbar = async () => {
    let response = await axios.get(
      `https://demo.webriefly.com/api/productsearch/${search}`
    );
    setSearch1(response.data);
  };

  const homedata = async () => {
    try {
      let response = await axios.get(
        "https://demo.webriefly.com/api/productpagedata"
      );
      const filteredData = response.data.filter(
        (product) =>
          product.status === "Published" || product.status === "Draft"
      );
      setProduct(filteredData);
    } catch (error) {
      console.error("Error fetching blog data:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchClick = () => {
    navigate("/product-categories");
  };

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem("cart");
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    }
  }, []);

  const fetchImageAsBase64 = async (url) => {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Image load failed"));
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.readAsDataURL(blob);
    });
  };

  const sanitizePrice = (price) => {
    if (!price) return 0;
    return parseFloat(price.replace(/[^0-9.]/g, ""));
  };

  const buildPdfBytes = async (invoiceData) => {
    if (!Array.isArray(invoiceData) || invoiceData.length === 0) {
      console.warn("No invoice data available");
      return null;
    }

    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    for (let i = 0; i < invoiceData.length; i++) {
      const data = invoiceData[i];
      let page = pdfDoc.addPage([595, 842]);
      const { width, height } = page.getSize();
      let y = height - 40;

      const addNewPageIfNeeded = () => {
        if (y < 80) {
          page = pdfDoc.addPage([595, 842]);
          y = height - 40;
        }
      };

      page.drawText(`Invoice Code: #${data.id || "NA"}`, {
        x: 14,
        y,
        font: fontBold,
        size: 16,
      });

      page.drawText(`Order Number: ${data.order_number || "NA"}`, {
        x: width - 200,
        y,
        font: fontBold,
        size: 16,
      });

      y -= 30;

      const customerLines = [
        `Customer: ${data.first_name || ""} ${data.last_name || ""}`,
        `Phone: ${data.phone_number || ""}`,
        `Email: ${data.email || ""}`,
        `Address: ${data.address || ""} ${data.apartment || ""} ${
          data.country || ""
        } ${data.pincode || ""}`,
        `Issue Date: ${
          data.date
            ? new Date(data.date).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : "NA"
        }`,
        `Store: ${data.store || "Unknown Store"}`,
      ];

      if (data.name) customerLines.push(`Product Name: ${data.name}`);
      if (data.quantity !== undefined)
        customerLines.push(`Quantity: ${data.quantity}`);

      customerLines.forEach((line) => {
        addNewPageIfNeeded();
        page.drawText(line, { x: 14, y, font, size: 12 });
        y -= 18;
      });

      y -= 16;

      for (let j = 0; j < (data.cart?.length || 0); j++) {
        const item = data.cart[j];
        addNewPageIfNeeded();

        const imageUrl = item.image?.startsWith("http")
          ? item.image
          : `/uploads/${item.image}`;
        const productName =
          item.name || item.product_name || item.title || "Unnamed Product";
        const price = sanitizePrice(item.price_sale || item.price);
        const total = item.quantity * price;

        page.drawText(String(j + 1), { x: 14, y, font, size: 11 });

        if (item.image) {
          try {
            const base64Image = await fetchImageAsBase64(imageUrl);
            const imageBytes = Uint8Array.from(atob(base64Image), (c) =>
              c.charCodeAt(0)
            );
            const embeddedImage = await pdfDoc.embedJpg(imageBytes);
            page.drawImage(embeddedImage, {
              x: 40,
              y: y - 10,
              width: 40,
              height: 40,
            });
          } catch (err) {
            page.drawText("Image Err", { x: 40, y, font, size: 9 });
          }
        }

        page.drawText(productName, { x: 120, y, font, size: 11 });
        page.drawText(`$${price.toFixed(2)}`, {
          x: 300,
          y,
          font,
          size: 11,
        });
        page.drawText(String(item.quantity), { x: 360, y, font, size: 11 });
        page.drawText(`$${total.toFixed(2)}`, {
          x: 420,
          y,
          font,
          size: 11,
        });

        y -= 50;
      }

      y -= 10;

      page.drawText(`Tax: $${sanitizePrice(data.tax).toFixed(2)}`, {
        x: 14,
        y,
        font,
        size: 12,
      });

      y -= 18;

      page.drawText(`Total Amount: $${sanitizePrice(data.total).toFixed(2)}`, {
        x: 14,
        y,
        font: fontBold,
        size: 12,
      });

      y -= 18;

      page.drawText(`Grand Total: $${sanitizePrice(data.total).toFixed(2)}`, {
        x: 14,
        y,
        font: fontBold,
        size: 12,
      });
    }

    return await pdfDoc.save();
  };

  const downloadInvoice = async () => {
    const bytes = await buildPdfBytes(orders);
    if (!bytes) return;
    const blob = new Blob([bytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Invoice-${orders[0]?.order_number || "download"}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printInvoice = async () => {
    const bytes = await buildPdfBytes(orders);
    if (!bytes) return;
    const blobUrl = URL.createObjectURL(
      new Blob([bytes], { type: "application/pdf" })
    );
    const win = window.open(blobUrl, "_blank");
    if (win) {
      win.onload = () => {
        win.focus();
        win.print();
      };
    }
  };

  return (
    <>
      <Helmet>
        <title>Order Details - Track Your Purchase | Rxlyte</title>
        <meta
          name="description"
          content="View detailed information about your order, including shipping status, payment details, and product summary. Track your purchase securely on Rxlyte."
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href="https://demo.webriefly.com/user/orders/view"
        />
      </Helmet>

      <div
        className="container d-lg-none d-block"
        id="container-customx1"
        style={{
          backgroundColor:
            user?.background_color ||
            (user?.background_image ? "transparent" : "#f2f5f7"),
          backgroundImage: user?.background_image
            ? `url(https://demo.webriefly.com/uploads/${user.background_image})`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: user?.breadcrumb_height
            ? `${user.breadcrumb_height}px`
            : "190px",
        }}
      >
        {filteredAnnouncements.length > 0 ? (
          <div className="d-block d-lg-block text-start pt-2 pb-2">
            <div className="mb-0 mt-0 mt-lg-0 me-md-3 free-shipping cart-cart d-flex flex-row ms-0 ms-lg-0">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="me-2 text-success fs-6 d-block d-lg-block mt-1"
                style={{
                  cursor: "pointer",
                  position: "relative",
                  zIndex: "1000",
                }}
                onClick={leftData}
              />
              <FontAwesomeIcon
                icon={faArrowRight}
                className="me-2 text-success fs-6 d-block d-lg-block mt-1"
                style={{
                  cursor: "pointer",
                  position: "relative",
                  zIndex: "1000",
                }}
                onClick={rightData}
              />
              <div className="ms-0">
                {filteredAnnouncements[currentIndex]?.content
                  ? filteredAnnouncements[currentIndex].content
                      .split(" ")
                      .slice(0, 6)
                      .join(" ")
                  : ""}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-start">No announcements available.</div>
        )}

        <div className="container-custom ms-2 pt-lg-4 mt-lg-0 mt-5 pt-5 mb-auto mt-auto me-lg-0 me-2">
          <header className="d-flex flex-wrap justify-content-between py-2 mb-5 border-bottom bg-body rounded-2 container-custom1 me-4">
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

                <div className="navbar-icons1 d-sm-flex mt-0 mt-md-0 gap-0 navbar-mobile">
                  <Link
                    to={`/${url.wishlist}`}
                    className="position-relative text-decoration-none me-3 mt-0 wishlist-home"
                  >
                    <span className="count-badge mt-2 pt-sm-2 pt-0 pt-md-0 mt-md-2">
                      {count6}
                    </span>
                    <img
                      src={Wishlists}
                      alt="RxLYTE"
                      className="cart-image profiles1 mt-2 mt-lg-1 mt-md-"
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
                      className="profiles1 img-fluid me-3 mt-1"
                    />
                  </Link>

                  <Link
                    to={`/${url.cart}`}
                    className="nav-link d-flex nav-properties1"
                  >
                    <img
                      src={Carthome}
                      alt="Cart"
                      className="img-fluid profiles1 mt-1 pt-1 pt-md-0"
                    />
                    <div className="addcarts ms-1 ps-1 pt-sm-1 pt-lg-1 pt-0 pt-md-0 count-badge1">
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
        </div>
      </div>

      <div className="container-fluid">
        <div className="row align-items-start justify-content-between text-center mt-lg-0 mt-0 pt-0 pt-lg-0 bg-light ms-0 me-0">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-md-start align-items-start ps-lg-2 ps-0 mt-2 mt-lg-1 lorem-home d-lg-block d-none">
            {filteredAnnouncements.length > 0 ? (
              <div className="d-block d-lg-block text-start pt-2 pb-2">
                <div className="mb-0 mt-0 mt-lg-0 me-md-3 free-shipping cart-cart d-flex flex-row ms-0 ms-lg-0">
                  <FontAwesomeIcon
                    icon={faArrowLeft}
                    className="me-2 text-success fs-6 d-block d-lg-block mt-1"
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      zIndex: "1000",
                    }}
                    onClick={leftData}
                  />
                  <FontAwesomeIcon
                    icon={faArrowRight}
                    className="me-2 text-success fs-6 d-block d-lg-block mt-1"
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      zIndex: "1000",
                    }}
                    onClick={rightData}
                  />
                  <div className="ms-0">
                    {filteredAnnouncements[currentIndex]?.content
                      ? filteredAnnouncements[currentIndex].content
                          .split(" ")
                          .slice(0, 6)
                          .join(" ")
                      : ""}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-start">No announcements available.</div>
            )}
          </div>

          <div className="col-12 col-md-6 d-flex justify-content-md-end mt-2 mt-md-0 lorem-home d-md-none d-lg-block d-none">
            {detail && detail.first_name ? (
              <div className="d-flex align-items-center float-end gap-0 d-none d-lg-block mt-1">
                <div className="free-shipping d-flex flex-row me-3 mt-21">
                  <span className="d-flex align-items-center gap-2">
                    <div className="d-sm-flex pt-1">
                      <Link to={`/${url.userDashboard}`} className="nav-link">
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
                          className="profile-lyte1 img-fluid me-0 ms-1 border rounded-5 py-1 bg-success"
                        >
                          {detail.first_name.charAt(0).toUpperCase()}
                        </div>
                      </Link>

                      <div className="d-flex flex-column me-0">
                        <span className="me-4 pe-2">
                          Hello {detail.first_name}
                        </span>
                        <span className="ms-4">
                          {detail.email || "No Email"}
                        </span>
                      </div>

                      <div className="d-flex flex-row gap-2 mt-1">
                        <div className="d-flex flex-row gap-2">
                          <Link
                            to={`/${url.wishlist}`}
                            className="position-relative text-decoration-none me-3 mt-0 wishlist-home"
                          >
                            <span className="count-badge mt-2">{count6}</span>
                            <img
                              src={Wishlists}
                              alt="RxLYTE"
                              className="cart-image1 profiles1 mt-2"
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
                              className="cart-image2 img-fluid me-3 mt-1"
                            />
                          </Link>

                          <Link
                            to={`/${url.cart}`}
                            className="nav-link d-flex nav-properties1"
                          >
                            <img
                              src={Carthome}
                              alt="Cart"
                              className="img-fluid cart-image mt-1 pt-1 mt-lg-2 pt-md-0"
                            />
                            <div className="addcarts ms-1 mt-1 ps-1 count-badge1 count-cart">
                              {count}
                            </div>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </span>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-row justify-content-lg-end align-items-end float-end gap-4 mt-1">
                <Link to={`/${url.wishlist}`}>
                  <span
                    className="position-absolute ms-1 ps-1 mt-0 count-badge1"
                    style={{ fontFamily: "verdana" }}
                  >
                    {count6}
                  </span>
                  <img
                    src={Wishlists}
                    alt="RxLYTE"
                    className="mt-3 cart-image1"
                  />
                </Link>

                <Link to={`/${url.login}`}>
                  <img
                    src={Accounts}
                    alt="RxLYTE"
                    className="cart-image2 mt-2"
                  />
                </Link>

                <Link to={`/${url.cart}`}>
                  <span
                    className="position-absolute ms-2 mt-0 count-badge1"
                    style={{ fontFamily: "verdana" }}
                  >
                    {count}
                  </span>
                  <img
                    src={Carthome}
                    alt="RxLYTE"
                    className="mt-3 cart-image"
                  />
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="container bg-light d-lg-block d-none">
          <div className="row d-flex justify-content-start text-center align-items-start mt-0 mb-lg-0 mb-2">
            <div className="col-12 col-md-8 d-flex align-items-center mb-2 mt-0 flex-row">
              <Link className="navbar-brand d-non d-lg-block" to="/">
                <img
                  src={logoUrl || Tonic}
                  alt="Tonic Logo"
                  className="img-fluid me-3 me-md-0 mt-0"
                  style={{ height: `${logoHeight}px`, width: "280px" }}
                />
              </Link>

              <div
                ref={searchContainerRef}
                className="search-container cart-cart position-relative"
              >
                <div className="input-welcome1-home search-container position-relative d-flex flex-row align-items-center mt-1">
                  <input
                    type="search"
                    className="form-control p-2 border-1 mt-sm-3 border py-4 input-home rounded-0 d-lg-block d-none border-end-0 me- pe-2 cart-cart"
                    placeholder="Search For Product"
                    name="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <div className="d-lg-block d-none w-75">
                    <select
                      id="categorySelect"
                      className="form-select rounded-0 mt-3"
                      style={{ height: "49px" }}
                      aria-label="Category selection"
                    >
                      {[
                        "All Categories",
                        "New Arrivals",
                        "Electronics",
                        "Featured",
                        "Best Sellers",
                        "Mobile Phone",
                        "Computers & Laptops",
                        "Top Brands",
                        "Weekly Best Selling",
                        "CPU Heat Pipes",
                        "CPU Coolers",
                        "Accessories",
                        "Headphones",
                        "Wireless Headphones",
                        "TWS Headphones",
                        "Smart Watch",
                        "Gaming Console",
                        "Playstation",
                        "Gifts",
                        "Desktop",
                        "Laptop",
                        "Tablet",
                        "SmartPhones & Tablets",
                        "TV Video & Music",
                        "Cameras",
                        "Cooking",
                        "With Bluetooth",
                        "Sports",
                        "Electronics Gadgets",
                        "Microscope",
                        "Remote Control",
                        "Monitor",
                        "Thermometer",
                        "Backpack",
                      ].map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="d-flex d-lg-block d-none">
                    <button
                      className="ms-0 btn btn-success-accesses d-flex mt-3 py-4 px-3 rounded-0 justify-content-center align-items-center"
                      onClick={handleSearchClick}
                      aria-label="Search"
                    >
                      <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                  </div>
                </div>

                {search && Array.isArray(search1) && (
                  <div className="search-results-search d-flex flex-column justify-content-center">
                    {search1.length > 0 ? (
                      <>
                        {search1.slice(0, 4).map((product, idx) => (
                          <Link
                            key={idx}
                            to="/product-categories"
                            className="text-dark text-decoration-none"
                          >
                            <div className="search-result-item d-flex align-items-center p-2 border-bottom">
                              <img
                                src={`https://demo.webriefly.com/uploads/${product.image}`}
                                alt={product.name}
                                className="ms-2 img-thumbnail"
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                }}
                              />
                              <div className="search-result-details text-start ms-0">
                                <h6 className="mb-1">{product.name}</h6>
                                <div className="d-flex flex-row gap-3 sales-font">
                                  <div className="price fw-bold mb-0">
                                    {product.price}
                                  </div>
                                  {product.price_sale && (
                                    <div className="price-sale text-danger fw-bold mb-0">
                                      {product.price_sale}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                        <div className="border w-100 pb-4 pt-3 all-result text-center">
                          <Link to="/product-categories">View all results</Link>
                        </div>
                      </>
                    ) : (
                      <div className="text-center text-dark py-3">
                        No result found!
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container lorem-home d-none d-lg-block bg-light pb-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
            <div className="d-flex flex-column flex-md-row align-items-center mb-3 mb-md-0 ">
              <div className="dropdown d-inline-block position-relative">
                <button
                  type="button"
                  className="btn btn-success-accesses d-flex align-items-center me-3 py-4 rounded-0 cart-cart"
                  id="categoryDropdown"
                  aria-label="Browse Categories"
                >
                  <FontAwesomeIcon
                    icon={faBars}
                    className="me-2"
                    aria-hidden="true"
                  />
                  <span className="cart-cart1">Browse Categories</span>
                  <FontAwesomeIcon
                    icon={faAngleDown}
                    className="ms-2"
                    aria-hidden="true"
                  />
                </button>

                <ul
                  className="dropdown-menu rounded-0 lh-lg"
                  aria-labelledby="categoryDropdown"
                >
                  <li>
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Electronics
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Gifts
                    </Link>
                  </li>

                  <li className="dropdown-submenus position-relative">
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Computers{" "}
                      <FontAwesomeIcon
                        icon={faGreaterThan}
                        className="float-end pt-2 computer-font"
                      />
                    </Link>
                    <ul className="dropdown-menus submenus rounded-0 lh-lg">
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?desktop"
                        >
                          Desktop
                        </Link>
                      </li>

                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?laptop"
                        >
                          Laptop
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?tablet"
                        >
                          Tablet
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?accessories"
                        >
                          Accessories
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      SmartPhones & Tablets
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Tv, Video & Music
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Cameras
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Cooking
                    </Link>
                  </li>

                  <li className="dropdown-submenus position-relative">
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Accessories
                      <FontAwesomeIcon
                        icon={faGreaterThan}
                        className="float-end pt-2 computer-font"
                      />
                    </Link>
                    <ul className="dropdown-menus submenus rounded-0 lh-lg">
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?with-bluetooth"
                        >
                          With Bluetooth
                        </Link>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Sports
                    </Link>
                  </li>

                  <li className="dropdown-submenus position-relative">
                    <Link
                      className="dropdown-item text-dark"
                      to="/product-categories"
                    >
                      Electronics Gadgets
                      <FontAwesomeIcon
                        icon={faGreaterThan}
                        className="float-end pt-2 computer-font"
                      />
                    </Link>
                    <ul className="dropdown-menus submenus rounded-0 lh-lg">
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?microscope"
                        >
                          Microscope
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?remote-control"
                        >
                          Remote Control
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?monitor"
                        >
                          Monitor
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?thermometer"
                        >
                          Thermometer
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?backpack"
                        >
                          Backpack
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item text-dark"
                          to="/product-categories?headphones"
                        >
                          Headphones
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>

              <nav>
                <ul className="nav-list d-flex flex-wrap mb-0 gap-3 gap-md-4 ">
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

            <div className="d-none d-md-flex align-items-center mt-3 mt-md-0 d-lg-none d-xl-block d-xxl-block d-lg-block d-none me-3">
              <span className="d-flex">
                <FontAwesomeIcon
                  icon={faPhoneVolume}
                  className="text-success me-3 mt-1 fw-medium"
                />
                <span
                  className="fw-medium d-lg-none d-xl-block d-xxl-block"
                  style={{ fontFamily: "verdana" }}
                >
                  1800-654-3210
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="container">
          <div className="row gap-1 d-flex flex-wrap justify-content-start justify-content-lg-start me-sm-1 ms-lg-0 mt-3 me-1 me-md-0">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 customer-dashboard text-start bg-body shadow-lg rounded-0 ms-0">
              <ul className="px-3 py-3 list-lyte">
                <li>
                  <Link to={`/${url.userDashboard}`} className="text-dark">
                    <img src={Over} alt="Over" className="me-2" />
                    Overview
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userOrders}`} className="text-dark">
                    <img src={Cart_user} alt="Cart_user" className="me-2" />
                    Orders
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userProductReviews}`} className="text-dark">
                    <img
                      src={Cart_reviews}
                      alt="Cart_reviews"
                      className="me-2"
                    />
                    Reviews
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userDownloads}`} className="text-dark">
                    <img
                      src={Cart_download}
                      alt="Cart_download"
                      className="me-2"
                    />
                    Downloads
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userOrderReturns}`} className="text-dark">
                    <img src={Cart_order} alt="Cart_order" className="me-2" />
                    Order Returns Requets
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userAddress}`} className="text-dark">
                    <img src={Address} alt="Address" className="me-2" />
                    Addresses
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userEditAccount}`} className="text-dark">
                    <img
                      src={Cart_setting}
                      alt="Cart_setting"
                      className="me-2"
                    />
                    Account Settings
                  </Link>
                </li>

                <li onClick={handleDelete} style={{ cursor: "pointer" }}>
                  <img src={Cart_logout} alt="Cart_logout" className="me-2" />
                  Logout
                </li>
              </ul>
            </div>

            <div
              className="col-12 col-sm-12 col-md-12 col-lg-6 bg-body shadow-lg customer-dashboard1 text-start rounded-0 mb-2 ms-lg-2 ms-sm-2 border d-flex flex-column align-items-start py-5 overflow-hidden"
              id="invoice-content"
            >
              <div className="d-flex w-100 justify-content-between">
                {Array.isArray(orders) &&
                  orders.slice(0, 1).map((data, key) => (
                    <div
                      className="d-flex flex-column lh-lg cart-cart"
                      key={key}
                    >
                      <div className="d-flex flex-row">
                        <span>Order Number: {data.order_number}</span>
                      </div>

                      <div className="d-flex flex-row">
                        <span>
                          Time:{" "}
                          <span className="cart-cart1">
                            {new Date(data.date).toLocaleDateString("en-CA")}
                          </span>
                        </span>
                      </div>

                      <div className="d-flex flex-row">
                        <span>Order Status:</span>
                      </div>

                      <div className="d-flex flex-row">
                        <span>Payment method:</span>
                      </div>
                      <div className="d-flex flex-row">
                        <span>
                          Payment status:{" "}
                          <span className="badge badge-success fw-light cart-cart1 py-2">
                            Pending
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}

                {Array.isArray(orders) &&
                  orders.slice(0, 1).map((data, key) => (
                    <div
                      className="d-flex flex-column lh-lg cart-cart me-0"
                      key={key}
                    >
                      <div className="d-flex flex-row">
                        <span>
                          Full Name:
                          <span className="ms-1 fw-bold">
                            {data.first_name} {data.last_name}
                          </span>
                        </span>
                      </div>
                      <div className="d-flex flex-row">
                        <span>
                          Phone:
                          <span className="ms-1 fw-bold">
                            {data.phone_number}
                          </span>
                        </span>
                      </div>
                      <div className="d-flex flex-row">
                        <span>
                          Address:
                          <span className="ms-1 fw-bold">
                            {data.address} {data.apartment} {data.country}{" "}
                            {data.pincode}
                          </span>
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              <h4 className="mt-3 cart-cart mb-3 mb-lg-0">Products</h4>
              <div className="cart-cart text-center table-view">
                <table className="table table-borderless table-view table-striped border mt-lg-3 mt-0">
                  <thead className="bg-light border">
                    <tr>
                      <th className="fw-light ps-3 py-2 text-start">id</th>
                      <th className="fw-light text-start">Image</th>
                      <th className="fw-light text-start">Product</th>
                      <th className="fw-light text-start">Amount</th>
                      <th className="fw-light">Quantity</th>
                      <th className="fw-light text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(orders) &&
                      orders.map((data, key) => (
                        <tr key={key}>
                          <td className="text-start">{data.id}</td>
                          <td className="text-start">
                            <img
                              src={`https://demo.webriefly.com/uploads/${data.image}`}
                              alt="RxLYTE"
                              className="img-thumbnail view-orders"
                            />
                          </td>
                          <td className="text-start d-flex flex-column">
                            {data.name}
                          </td>

                          {Array.isArray(orders) &&
                            orders.slice(0, 1).map((data) => (
                              <>
                                <td
                                  style={{ fontFamily: "verdana" }}
                                  className="text-start"
                                >
                                  {data.price}
                                </td>
                                <td>{data.quantity}</td>
                                <td style={{ fontFamily: "verdana" }}>
                                  ${data.total}
                                </td>
                              </>
                            ))}
                        </tr>
                      ))}
                  </tbody>

                  <div className="d-flex flex-column mt-1 lh-lg total-amount">
                    {Array.isArray(orders) &&
                      orders.length > 0 &&
                      (() => {
                        const totalTax = orders.reduce(
                          (acc, order) => acc + Number(order.tax || 0),
                          0
                        );
                        const totalAmount = orders.reduce(
                          (acc, order) => acc + Number(order.total || 0),
                          0
                        );
                        return (
                          <>
                            <span className="text-start ms-2">
                              Tax:{" "}
                              <span style={{ fontFamily: "verdana" }}>
                                ${totalTax.toFixed(2)}
                              </span>
                            </span>
                            <span
                              className="text-start ms-2 mb-3"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              Total Amount:{" "}
                              <span style={{ fontFamily: "verdana" }}>
                                ${totalAmount.toFixed(2)}
                              </span>
                            </span>
                          </>
                        );
                      })()}
                  </div>
                </table>
              </div>

              <div className="d-flex flex-column bg-light px-3 py-3 mt-2 cart-cart lh-lg order-border">
                The order is currently being processed. For expedited
                processing, kindly upload a copy of your payment proof:
                <div className="d-flex flex-row flex-wrap flex-md-nowrap me-md-3">
                  <div className="border rounded-0 file-choose bg-body">
                    <input
                      type="file"
                      className="mt-2 mb-2 ms-2 cart-cart"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                    />
                  </div>
                  <button
                    className="btn btn-success-product d-flex rounded-0 cart-cart1 py-4 upload-btn mt-1 ms-2"
                    onClick={handleUpload}
                  >
                    Upload
                  </button>
                </div>
                {error && <span className="text-danger">{error}</span>}
                <span style={{ fontSize: "12px" }} className="mt-1">
                  You can upload the following file types: jpg, jpeg, png, pdf
                  and the max file size is 2MB.
                </span>
              </div>

              <div className="d-flex flex-row gap-2 mt-4 ms-1">
                <button
                  className="btn btn-success-product d-flex rounded-0 py-4 cart-cart"
                  onClick={printInvoice}
                >
                  Print Invoice
                </button>

                <button
                  className="btn btn-success-product d-flex rounded-0 py-4 cart-cart"
                  onClick={downloadInvoice}
                >
                  Download Invoice
                </button>

                <button
                  className="btn btn-danger d-flex rounded-0 py-4 cart-cart"
                  onClick={() => {
                    setSelectedOrderId(orders[0].id);
                    showPopup();
                  }}
                >
                  Cancel order
                </button>
              </div>

              {isPopupVisible && (
                <div className="popup-overlay">
                  <div className="popup-content border px-2 py-2 rounded mt-3 ms-lg-5 ms-2 me-2 d-flex flex-column cart-cart order-invoice1">
                    <div className="d-flex justify-content-between flex-row w-100">
                      <h4 className="mt-1">Cancel Order</h4>
                      <FontAwesomeIcon
                        icon={faX}
                        className="mt-2 me-2"
                        style={{ cursor: "pointer" }}
                        onClick={closePopup}
                      />
                    </div>
                    <span className="mt-1">
                      Please provide a reason for the cancellation.
                    </span>
                    <hr />
                    <div>
                      <label htmlFor="reason">
                        Choose a Reason for Order Cancellation{" "}
                        <span className="text-danger fw-bold">*</span>
                      </label>
                      <select
                        id="reason"
                        className="form-select mt-2 order-invoice rounded-0"
                        style={{ height: "50px" }}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      >
                        <option value="">Choose a reason...</option>
                        <option value="change-mind">
                          Changed mind or no longer needed the product
                        </option>
                        <option value="found-better-price">
                          Found a better price elsewhere
                        </option>
                        <option value="out-of-stock">
                          Product out of stock
                        </option>
                        <option value="shipping-delays">Shipping delays</option>
                        <option value="incorrect-address">
                          Incorrect or incomplete shipping address
                        </option>
                        <option value="customer-requested">
                          Customer requested cancellation
                        </option>
                        <option value="not-as-described">
                          Product not as described
                        </option>
                        <option value="payment-issues">
                          Payment issues or declined transaction
                        </option>
                        <option value="unforeseen-circumstances">
                          Unforeseen circumstances or emergencies
                        </option>
                        <option value="technical-issues">
                          Technical issues during the checkout process
                        </option>
                        <option value="other">Other</option>
                      </select>
                      {reasonError && (
                        <div
                          className="text-danger cart-cart1 ms-1 mt-1"
                          style={{ fontSize: "0.9em" }}
                        >
                          {reasonError}
                        </div>
                      )}
                    </div>

                    <div className="mt-2 pb-0 ms-2">
                      <label htmlFor="description">Description</label>
                      <textarea
                        id="description"
                        className="form-control mt-2 mb-3 order-invoice rounded-0"
                        style={{ height: "76px" }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      ></textarea>
                      {descriptionError && (
                        <div
                          className="text-danger cart-cart1 ms-1"
                          style={{ fontSize: "0.9em" }}
                        >
                          {descriptionError}
                        </div>
                      )}
                    </div>
                    <hr />

                    <div className="d-flex gap-2 justify-content-end flex-row w-100">
                      <button
                        className="btn btn-secondary d-flex rounded-0 py-4 cart-cart1"
                        onClick={closePopup}
                      >
                        Close
                      </button>
                      <button
                        type="button"
                        className="btn btn-success-product d-flex rounded-0 py-4 cart-cart1"
                        onClick={() => cancelOrder(selectedOrderId)}
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>

      <footer className="footer pt-4 pb-4 cart-cart mt-4 details-user">
        <div className="container text-center text-md-left">
          <div className="row footer-lyte">
            <div className="col-12 col-md-6 col-lg-3 col-xl-3 mx-auto mt-lg-3 mt-0 d-flex flex-column text-start ms-0">
              <img
                src={Tonic}
                alt="Tonic"
                width="190"
                height="190"
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
                  <h2 className="mb-2 pb-0 about-blog">Help?</h2>
                  <ul className="lh-lg footer-list p-0">
                    <li>
                      <Link
                        to="/faqs"
                        className="text-white text-decoration-none"
                      >
                        FAQ's
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-white text-decoration-none"
                        to="/sitemap"
                      >
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
                    <small className="text-danger text-start cart-cart mt-1">
                      {errors.email}
                    </small>
                  )}
                </div>
                <button
                  className="btn btn-success-product d-flex cart-cart1 py-4 me-0 ms-1"
                  type="submit"
                  onClick={newsSubmit}
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
                © {new Date().getFullYear()} Copyright RxLYTE. All rights
                reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default CustomerView;
