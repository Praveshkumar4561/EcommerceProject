import React, { useContext, useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import Profile from "../../assets/image.png";
import Cart from "../../assets/Cart.svg";
import UserContext from "../../context/UserContext";
import Over from "../../assets/Over.png";
import Address from "../../assets/Cart_address.png";
import Cart_order from "../../assets/Cart_request.png";
import Cart_reviews from "../../assets/Cart_reviews.png";
import Cart_download from "../../assets/Cart_download.png";
import Cart_setting from "../../assets/Cart_setting.png";
import Cart_logout from "../../assets/Cart_logout.png";
import Cart_user from "../../assets/Cart_user.png";
import axios from "axios";
import { jsPDF } from "jspdf";

function CustomerView() {
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
      setError("Please select a file first");
      return;
    }
    alert("File uploaded successfully");
  };

  let [view, setView] = useState([]);
  let [cart, setCart] = useState([]);
  let [customer, setCustomer] = useState([]);

  // cancel order

  let cancelOrder = async () => {
    try {
      await axios.delete(`/api/deleteorder`);
      setView([]);
      navigate("/user/orders");
      alert("All products deleted successfully");
    } catch (error) {
      console.error("Error deleting orders:", error);
      alert("Failed to delete orders. Please try again.");
    }
  };

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const showPopup = () => setIsPopupVisible(true);
  const closePopup = () => setIsPopupVisible(false);

  useEffect(() => {
    const cartdata = async () => {
      try {
        const response = await axios.get("/api/checkoutdata");
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
          ? `/api/src/image/${item.image}`
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

  return (
    <>
      <div className="container-fluid overflow-hidden">
        <div className="row align-items-center justify-content-between text-center mt-lg-2 mt-0 pt-lg-1 pt-0">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-md-start align-items-center ps-4 lorem-home">
            {user.length > 0 && (
              <div className="d-block d-lg-block text-start">
                <p className="mb-0 mt-3 mt-lg-0 me-md-3 free-shipping d-flex flex-row">
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
  {Array.isArray(detail) && detail.length > 0 ? (
    detail.slice(0, 1).map((data, key) => (
      <div
        className="d-flex align-items-center gap-3 float-lg-end d-none d-lg-block"
        key={key}
      >
        <div className="free-shipping d-flex flex-row me-3">
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

              <Link to="/cart" className="nav-link d-flex mt-1">
                <img
                  src={Cart}
                  alt="Cart"
                  className="img-fluid profile1 me-2"
                />
                <div className="addcarts-lyte2 ms-3 mt-2">{count}</div>
              </Link>
            </div>
          </span>
        </div>
      </div>
    ))
  ) : (
    <p>No user data available</p>
  )}
</div>





        </div>

        <div className="container">
          <div className="row d-flex justify-content-start text-center align-items-start mt-0">
            <div className="col-12 col-md-8 d-flex align-items-center mb-4 mt-0 d-flex flex-row">
              <img
                src={Tonic}
                alt="404"
                className="img-fluid me-3 me-md-0 mt-0 mt-lg-2"
              />

              <div className="input-welcome-view d-flex flex-row align-items-center mt-3">
                <input
                  type="search"
                  className="form-control p-2 border-1 mt-sm-3 border py-4 input-home rounded-0 d-lg-block d-none me-0"
                  placeholder="Search For Product"
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

        <div className="container lorem-home d-none d-lg-block">
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
                    <Link to="/" className="nav-link fw-medium text-success">
                      Home
                    </Link>
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
                      Contact Us
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
      </div>

      <div className="container-fluid">
        <div className="container">
          <div className="row gap-1 d-flex flex-wrap justify-content-start justify-content-lg-start ms-lg-0 mt-3">
            <div className="col-12 col-sm-12 col-md-12 col-lg-6 customer-dashboard text-start bg-body shadow-lg rounded-0 ms-0">
              <ul className="px-3 py-3 list-lyte">
                <li>
                  <Link to="/user/dashboard" className="text-dark">
                    <img src={Over} alt="404" className="me-2" />
                    Overview
                  </Link>
                </li>

                <li>
                  <Link to="/user/orders" className="text-dark">
                    <img src={Cart_user} alt="404" className="me-2" />
                    Orders
                  </Link>
                </li>

                <li>
                  <Link to="/user/product-reviews" className="text-dark">
                    <img src={Cart_reviews} alt="404" className="me-2" />
                    Reviews
                  </Link>
                </li>

                <li>
                  <Link to="/user/downloads" className="text-dark">
                    <img src={Cart_download} alt="404" className="me-2" />
                    Downloads
                  </Link>
                </li>

                <li>
                  <Link to="/user/order-returns" className="text-dark">
                    <img src={Cart_order} alt="404" className="me-2" />
                    Order Returns Requets
                  </Link>
                </li>

                <li>
                  <Link to="/user/address" className="text-dark">
                    <img src={Address} alt="404" className="me-2" />
                    Addresses
                  </Link>
                </li>

                <li>
                  <Link to={`/user/edit-account/${1}`} className="text-dark">
                    <img src={Cart_setting} alt="404" className="me-2" />
                    Account Settings
                  </Link>
                </li>

                <li>
                  <img src={Cart_logout} alt="404" className="me-2" />
                  Logout
                </li>
              </ul>
            </div>

            <div
  className="col-12 col-sm-12 col-md-12 col-lg-6 bg-body shadow-lg customer-dashboard1 text-start rounded-0 mb-2 ms-lg-2 ms-sm-2 border d-flex flex-column align-items-start py-5 overflow-hidden"
  id="invoice-content"
>
  <div className="d-flex w-100 justify-content-between">
    {Array.isArray(customer) && customer.slice(0, 1).map((data, key) => (
      <div className="d-flex flex-column lh-lg cart-cart" key={key}>
        <div className="d-flex flex-row">
          <span>Order Number: {data.order_number}</span>
        </div>

        <div className="d-flex flex-row">
          <span>
            Time:<span className="cart-cart1">{data.date}</span>
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

    {Array.isArray(customer) && customer.slice(0, 1).map((data, key) => (
      <div className="d-flex flex-column lh-lg cart-cart me-0" key={key}>
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
            <span className="ms-1 fw-bold">{data.phone_number}</span>
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
        {Array.isArray(view) && view.map((data, key) => (
          <tr key={key}>
            <td className="text-start">{data.checkoutId}</td>
            <td className="text-start">
              <img
                src={`/api/src/image/${data.image}`}
                alt=""
                className="img-thumbnail"
              />
            </td>
            <td className="text-start d-flex flex-column">{data.name}</td>

            {Array.isArray(customer) && customer.slice(0, 1).map((data) => (
              <>
                <td style={{ fontFamily: "verdana" }} className="text-start">
                  {data.price}
                </td>
                <td>{data.quantity}</td>
                <td style={{ fontFamily: "verdana" }}>${data.total}</td>
              </>
            ))}
          </tr>
        ))}
      </tbody>

      <div className="d-flex flex-column mt-0 lh-lg total-amount">
        {Array.isArray(view) && view.length > 0 && Array.isArray(customer) && (
          <>
            {customer.map((data) => (
              <>
                <span className="text-start ms-4">
                  Tax:
                  <span style={{ fontFamily: "verdana" }}>${data.tax}</span>
                </span>
                <span className="text-start ms-4 mb-3" style={{ whiteSpace: "nowrap" }}>
                  Total Amount:
                  <span style={{ fontFamily: "verdana" }}>${data.total}</span>
                </span>
              </>
            ))}
          </>
        )}
      </div>
    </table>
  </div>

  <div className="d-flex flex-column bg-light px-3 py-3 mt-2 cart-cart lh-lg order-border">
    The order is currently being processed. For expedited processing, kindly upload a copy of your payment proof:
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
      You can upload the following file types: jpg, jpeg, png, pdf and the max file size is 2MB.
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

export default CustomerView;