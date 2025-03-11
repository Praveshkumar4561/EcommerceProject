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
import { jsPDF } from "jspdf";
import UserContext from "../../context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Close from "../../assets/Close.webp";
import Carthome from "../../assets/Carthome.webp";
import Wishlists from "../../assets/Wishlists.webp";
import Accounts from "../../assets/Accounts.webp";

import Hamburger from "../../assets/hamburger.svg";
import { Helmet } from "react-helmet";

function CustomerView() {
  let { count, setCount } = useContext(UserContext);

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

  const [user, setUser] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const alldata = async () => {
      let response = await axios.get("http://89.116.170.231:1600/getannounce");
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
    try {
      toast.success("File uploaded successfully", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("", {});
    }
  };

  let [view, setView] = useState([]);
  let [cart, setCart] = useState([]);
  let [customer, setCustomer] = useState([]);

  let cancelOrder = async () => {
    try {
      await axios.delete(`http://89.116.170.231:1600/deleteorder`);
      toast.success("All products deleted successfully", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("Data is not submitted", {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const showPopup = () => setIsPopupVisible(true);
  const closePopup = () => setIsPopupVisible(false);

  useEffect(() => {
    const cartdata = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/checkoutdata"
        );
        const flattenedData = response.data.flatMap((checkout) =>
          checkout.cartItems.map((item) => ({
            ...item,
            checkoutId: checkout.id,
            total: item.price * item.quantity,
          }))
        );
        setCart(flattenedData);
        setView(flattenedData);
        setCustomer(response.data);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    cartdata();
  }, []);

  const printInvoice = () => {
    const printableContent = document.getElementById("invoice-content");
    if (printableContent) {
      const clonedContent = printableContent.cloneNode(true);
      const printWindow = window.open("", "", "height=800,width=1000");
      printWindow.document.write("<html><head><title>Invoice</title>");
      printWindow.document.write(`
        <style>
          .order-border, 
          .btn-success, 
          .btn-danger {
            display: none !important;
          }
  
          .invoice-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-top: 10px;
          }
  
          .order-column, 
          .customer-column {
            display: flex;
            flex-direction: column;
          }
  
          .order-column span, 
          .customer-column span {
            font-weight: bold;
            margin-bottom: 8px;
          }
  
          .total-amount {
            display: flex;
            flex-direction: column;
            margin-top: 20px;
          }
  
          @media print {
            .invoice-details {
              grid-template-columns: 1fr 1fr;
            }
  
            .order-column span, .customer-column span {
              font-size: 14px;
            }
  
            .total-amount {
              font-size: 14px;
              margin-top: 20px;
            }
            .order-border,
            .btn-success,
            .btn-danger {
              display: none !important;
            }
  
            .invoice-row {
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
          }
        </style>
      `);
      printWindow.document.write("</head><body>");
      printWindow.document.write(clonedContent.innerHTML);
      printWindow.document.close();
      printWindow.print();
    } else {
      console.error("Invoice content not found!");
    }
  };

  const downloadInvoice = () => {
    const doc = new jsPDF();
    if (!Array.isArray(view) || view.length === 0) {
      console.error("View data is missing or empty");
      return;
    }
    if (!Array.isArray(customer) || customer.length === 0) {
      console.error("Customer data is missing or empty");
      return;
    }
    let yOffset = 22;
    const customerData = customer[0];
    if (!customerData) {
      console.error("Customer data is missing!");
      return;
    }
    const orderNumber = customerData.order_number || "N/A";
    const date = customerData.date || "N/A";
    const orderStatus = "N/A";
    const paymentMethod = "N/A";
    const paymentStatus = "N/A";
    const fullName = `${customerData.first_name || "N/A"} ${
      customerData.last_name || "N/A"
    }`;
    const phone = customerData.phone_number || "N/A";
    const address = customerData.address || "N/A";
    const issueDate = customerData.date
      ? new Date(customerData.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "N/A";
    doc.setFontSize(16);
    doc.text(`Order Number: ${orderNumber}`, 14, yOffset);
    yOffset += 8;
    doc.text(`Time: ${date}`, 14, yOffset);
    yOffset += 8;
    doc.text(`Order Status: ${orderStatus}`, 14, yOffset);
    yOffset += 8;
    doc.text(`Payment Method: ${paymentMethod}`, 14, yOffset);
    yOffset += 8;
    doc.text(`Payment Status: ${paymentStatus}`, 14, yOffset);
    yOffset += 8;
    doc.text(`Full Name: ${fullName}`, 14, yOffset);
    yOffset += 8;
    doc.text(`Phone: ${phone}`, 14, yOffset);
    yOffset += 8;
    doc.text(`Address: ${address}`, 14, yOffset);
    yOffset += 8;
    doc.text(`Issue Date: ${issueDate}`, 14, yOffset);
    yOffset += 12;
    doc.setFontSize(12);
    doc.text("Products", 14, yOffset);
    yOffset += 8;
    doc.setFontSize(10);
    doc.text("ID", 14, yOffset);
    doc.text("Image", 24, yOffset);
    doc.text("Product", 50, yOffset);
    doc.text("Amount", 90, yOffset);
    doc.text("Quantity", 120, yOffset);
    doc.text("Total", 150, yOffset);
    yOffset += 8;
    if (view.length > 0) {
      view.forEach((item) => {
        console.log("Checking product data:", item);
        const itemName = item.name || "N/A";
        const itemImage = item.image
          ? `http://89.116.170.231:1600/src/image/${item.image}`
          : "http://example.com/default.jpg";
        const itemAmount = parseFloat(item.price.replace("$", "")) || 0;
        const itemQuantity = parseInt(item.quantity, 10) || 0;
        const itemTotal = (itemAmount * itemQuantity).toFixed(2);
        doc.text(item.checkoutId.toString(), 14, yOffset);
        doc.addImage(itemImage, "JPEG", 24, yOffset - 4, 12, 12);
        doc.text(itemName, 50, yOffset);
        doc.text(`$${itemAmount.toFixed(2)}`, 90, yOffset);
        doc.text(itemQuantity.toString(), 120, yOffset);
        doc.text(`$${itemTotal}`, 150, yOffset);
        yOffset += 8;
        if (yOffset > 250) {
          doc.addPage();
          yOffset = 22;
        }
      });
    } else {
      console.error("No products in view data or invalid format.");
    }
    const tax = parseFloat(customerData.tax) || 0;
    const totalAmount = parseFloat(customerData.total) || 0;
    const grandTotal = parseFloat(customerData.total) || 0;
    yOffset += 8;
    doc.text(`Tax: $${tax.toFixed(2)}`, 14, yOffset);
    yOffset += 8;
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 14, yOffset);
    yOffset += 8;
    doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, 14, yOffset);
    doc.save(`Invoice ${view[0].invoice_number || ""}.pdf`);
  };

  const [auth, setAuth] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  let handleDelete = () => {
    axios.defaults.withCredentials = true;
    axios
      .get("http://89.116.170.231:1600/logout")
      .then((res) => {
        if (res.data.Status === "Success") {
          localStorage.removeItem("token");
          localStorage.removeItem("userDetails");
          localStorage.removeItem("user");
          localStorage.removeItem("auth");
          setAuth(false);
          setMessage("Logged out successfully!");
          navigate(`/${url.login}`);
        } else {
          setMessage(res.data.Error);
        }
      })
      .catch((err) => {
        console.log("Error during logout:", err);
        setMessage("Logout failed, please try again.");
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
          console.log("Token expired. Logging out...");
          localStorage.removeItem("user");
          localStorage.removeItem("auth");
          toast.error("Session expired. Please log in again.");
          navigate("/login");
        } else {
          setDetail(storedUser);
          setAuth(true);
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

  return (
    <>
      <Helmet>
        <title>Order Details - Track Your Purchase | Rxlyte</title>
        <meta
          name="description"
          content="View detailed information about your order, including shipping status, payment details, and product summary. Track your purchase securely on Rxlyte."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://srv724100.hstgr.cloud/user/view" />
      </Helmet>

      <div
        className="container d-lg-none d-block"
        id="container-customx1"
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
        {user.length > 0 && (
          <div className="d-block d-lg-block text-start pt-2 pb-2">
            <p className="mb-0 mt-0 mt-lg-0 me-md-3 free-shipping cart-cart d-flex flex-row ms-0 ms-lg-0">
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="me-2 text-success fs-6 d-block d-lg-block mt-1"
                style={{ cursor: "pointer", position: "relative", zIndex: "1" }}
                onClick={leftData}
              />
              <FontAwesomeIcon
                icon={faArrowRight}
                className="me-2 text-success fs-6 d-block d-lg-block mt-1"
                style={{ cursor: "pointer", position: "relative", zIndex: "1" }}
                onClick={rightData}
              />
              <div className="ms-0">
                {user[currentIndex].content.split(" ").slice(0, 6).join(" ")}
              </div>
            </p>
          </div>
        )}

        <div className="container-custom ms-2 pt-lg-4 mt-lg-0 mt-5 pt-5 mb-auto mt-auto">
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

                <div className="navbar-icons1 d-sm-flex mt-1 mt-md-0 gap-0 navbar-mobile">
                  <Link
                    to={`/${url.wishlist}`}
                    className="position-relative text-decoration-none me-3 mt-0 wishlist-home"
                  >
                    <span className="count-badge mt-1">{count6}</span>
                    <img
                      src={Wishlists}
                      alt="RxLYTE"
                      className="cart-image profiles1 mt-1"
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
                      className="img-fluid profiles1 mt-1 pt-1 "
                    />
                    <div className="addcarts ms-1 ps-1 pt-lg-1 count-badge1">
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
      <div></div>

      <div className="container-fluid">
        <div className="row align-items-start justify-content-between text-center mt-lg-0 mt-0 pt-0 pt-lg-0 bg-light ms-0 me-0">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-md-start align-items-start ps-lg-2 ps-0 mt-2 mt-lg-3 lorem-home d-lg-block d-none">
            {user.length > 0 && (
              <div className="d-block d-lg-block text-start pt-0">
                <p className="mb-0 mt-0 mt-lg-0 me-md-3 free-shipping d-flex flex-row ms-2 ms-lg-0">
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
                  <div className="ms-0">
                    {user[currentIndex].content
                      .split(" ")
                      .slice(0, 7)
                      .join(" ")}
                  </div>
                </p>
              </div>
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

                      <div className="d-flex flex-row gap-2">
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
                            <div className="addcarts ms-1 ps-1 count-badge1 count-cart">
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
                  style={{ height: `${logoHeight}px`, width: "200px" }}
                />
              </Link>

              <div className="input-welcome1-home position-relative start-501 d-flex flex-row align-items-center mt-1">
                <input
                  type="search"
                  className="form-control p-2 border-1 mt-sm-3 border py-4 input-home rounded-0 d-lg-block d-none border-end-0 me- pe-2"
                  placeholder="Search For Product"
                  name="search"
                  onChange={(e) => setSearch(e.target.value)}
                />

                <div className="d-lg-block d-none w-75">
                  <select
                    className="form-select rounded-0 border-0 mt-3 border-start-0"
                    style={{ height: "49px" }}
                  >
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
                  <button className="ms-0 btn btn-success d-flex mt-3 py-4 px-3 rounded-0 justify-content-center align-items-center">
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
                    <Link className="dropdown-item" to="#">
                      New Arrivals
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Electronics
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Gifts
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to="#"
                      aria-labelledby="categoryDropdown"
                    >
                      Computers
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      SmartPhones & Tablets
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Tv,Vido & Music
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Cameras
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Cooking
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Accessories
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Sports
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Electronics Gadgets
                    </Link>
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

            <div className="d-none d-md-flex align-items-center mt-3 mt-md-0 d-lg-none d-xl-block d-xxl-block d-lg-block d-none">
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
          <div className="row gap-1 d-flex flex-wrap justify-content-start justify-content-lg-start ms-lg-0 mt-3">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 customer-dashboard text-start bg-body shadow-lg rounded-0 ms-0">
              <ul className="px-3 py-3 list-lyte">
                <li>
                  <Link to={`/${url.userDashboard}`} className="text-dark">
                    <img src={Over} alt="RxLYTE" className="me-2" />
                    Overview
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userOrders}`} className="text-dark">
                    <img src={Cart_user} alt="RxLYTE" className="me-2" />
                    Orders
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userProductReviews}`} className="text-dark">
                    <img src={Cart_reviews} alt="RxLYTE" className="me-2" />
                    Reviews
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userDownloads}`} className="text-dark">
                    <img src={Cart_download} alt="RxLYTE" className="me-2" />
                    Downloads
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userOrderReturns}`} className="text-dark">
                    <img src={Cart_order} alt="RxLYTE" className="me-2" />
                    Order Returns Requets
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userAddress}`} className="text-dark">
                    <img src={Address} alt="RxLYTE" className="me-2" />
                    Addresses
                  </Link>
                </li>

                <li>
                  <Link to={`/${url.userEditAccount}`} className="text-dark">
                    <img src={Cart_setting} alt="RxLYTE" className="me-2" />
                    Account Settings
                  </Link>
                </li>

                <li onClick={handleDelete} style={{ cursor: "pointer" }}>
                  <img src={Cart_logout} alt="Logout" className="me-2" />
                  Logout
                </li>
              </ul>
            </div>

            <div
              className="col-12 col-sm-12 col-md-12 col-lg-6 bg-body shadow-lg customer-dashboard1 text-start rounded-0 mb-2 ms-lg-2 ms-sm-2 border d-flex flex-column align-items-start py-5 overflow-hidden"
              id="invoice-content"
            >
              <div className="d-flex w-100 justify-content-between">
                {Array.isArray(customer) &&
                  customer.slice(0, 1).map((data, key) => (
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
                            {new Date(data.date).toISOString().split("T")[0]}{" "}
                            {new Date(data.date).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })}
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
                        <span>Payment status:</span>
                      </div>
                    </div>
                  ))}

                {Array.isArray(customer) &&
                  customer.slice(0, 1).map((data, key) => (
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
                          <span className="ms-1 fw-bold">{data.address}</span>
                        </span>
                      </div>
                    </div>
                  ))}
              </div>

              <h4 className="mt-3 cart-cart mb-3 mb-lg-0">Products</h4>
              <div className="w-100 cart-cart text-center table-container-content">
                <table className="table table-borderless table-striped border mt-lg-3 mt-0">
                  <thead className="bg-light border">
                    <tr>
                      <th className="fw-light ps-3 py-2 text-start">#</th>
                      <th className="fw-light text-start">Image</th>
                      <th className="fw-light text-start">Product</th>
                      <th className="fw-light text-start">Amount</th>
                      <th className="fw-light">Quantity</th>
                      <th className="fw-light text-center">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(view) &&
                      view.map((data, key) => (
                        <tr key={key}>
                          <td className="text-start">{data.checkoutId}</td>
                          <td className="text-start">
                            <img
                              src={`http://89.116.170.231:1600/src/image/${data.image}`}
                              alt="RxLYTE"
                              className="img-thumbnail"
                            />
                          </td>
                          <td className="text-start d-flex flex-column">
                            {data.name}
                          </td>

                          {Array.isArray(customer) &&
                            customer.slice(0, 1).map((data) => (
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

                  <div className="d-flex flex-column mt-0 lh-lg total-amount">
                    {Array.isArray(view) &&
                      view.length > 0 &&
                      Array.isArray(customer) && (
                        <>
                          {customer.map((data) => (
                            <>
                              <span className="text-start ms-4">
                                Tax:
                                <span style={{ fontFamily: "verdana" }}>
                                  ${data.tax}
                                </span>
                              </span>
                              <span
                                className="text-start ms-4 mb-3"
                                style={{ whiteSpace: "nowrap" }}
                              >
                                Total Amount:
                                <span style={{ fontFamily: "verdana" }}>
                                  ${data.total}
                                </span>
                              </span>
                            </>
                          ))}
                        </>
                      )}
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
                      className="mt-2 mb-2 ms-2"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileChange}
                    />
                  </div>
                  <button
                    className="btn btn-success d-flex rounded-0 cart-cart py-4 upload-btn mt-1 ms-2"
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
                  className="btn btn-success d-flex rounded-0 py-4 cart-cart"
                  onClick={printInvoice}
                >
                  Print Invoice
                </button>
                <button
                  className="btn btn-success d-flex rounded-0 py-4 cart-cart"
                  onClick={downloadInvoice}
                >
                  Download Invoice
                </button>
                <button
                  className="btn btn-danger d-flex rounded-0 py-4 cart-cart"
                  onClick={showPopup}
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
                      <label htmlFor="">
                        Choose a Reason for Order Cancellation{" "}
                        <span className="text-danger fw-bold">*</span>
                      </label>

                      <select
                        className="form-select mt-2 order-invoice rounded-0"
                        style={{ height: "50px" }}
                      >
                        <option value="" selected="">
                          Choose a reason...
                        </option>
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
                    </div>

                    <div className="mt-3 ms-2">
                      <label htmlFor="">Description</label>
                      <textarea
                        className="form-control mt-2 mb-3 order-invoice rounded-0"
                        style={{ height: "76px" }}
                      ></textarea>
                    </div>
                    <hr />

                    <div className="d-flex gap-2 justify-content-end flex-row w-100">
                      <button
                        className="btn btn-secondary d-flex rounded-0 py-4 cart-cart"
                        onClick={closePopup}
                      >
                        Close
                      </button>
                      <button
                        className="btn btn-success d-flex rounded-0 py-4 cart-cart"
                        onClick={cancelOrder}
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
                  <h5 className="mb-2 pb-0">Company</h5>
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
                  <h5 className="mb-2 pb-0">Help?</h5>
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
                  onClick={(e) => e.preventDefault()}
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

export default CustomerView;
