import React, { useContext, useEffect, useRef, useState } from "react";
import "./ProductsEdit.css";
import Hamburger from "../../../assets/hamburger.svg";
import Logo from "../../../assets/Logo.png";
import Cutting from "../../../assets/Cutting.png";
import {
  faAngleDown,
  faArrowDown,
  faArrowUp,
  faBell,
  faCube,
  faEnvelope,
  faImage,
  faMoon,
  faTrashCan,
  faXmark,
  faSave,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Shopping from "../../../assets/Shopping.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import axios from "axios";
import UserContext from "../../../context/UserContext";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function ProductsEdit() {
  const [editorData, setEditorData] = useState("");

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };

  const insertHtml = () => {
    const htmlToInsert = "<p>Your HTML content here</p>";
    setEditorData((prevData) => prevData + htmlToInsert);
  };

  let [seo, setSeo] = useState(false);

  let seodataedit = () => {
    setSeo(!seo);
  };

  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(file);
      setImageUrl(url);
      setUser({ ...user, file: file });
    }
  };

  const handleAddFromUrl = () => {
    alert("Functionality to add image from URL needs to be implemented.");
  };

  let [isVisible, setIsVisible] = useState(false);
  let [blog, setBlog] = useState(false);
  let [ads, setAds] = useState(false);
  let [commerce, setCommerce] = useState(false);
  let [appear, setAppear] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const resultsRef = useRef(null);
  const navigate = useNavigate();
  let [Specification, setSpecifcation] = useState(false);
  let [payment, setPayment] = useState(false);

  let paymentgateway = () => {
    setPayment(!payment);
  };

  let togglespecification = () => {
    setSpecifcation(!Specification);
  };

  const routes = {
    "/admin/welcome": "# Dashboard",
    "/admin/pages": "# Pages",
    "/admin/galleries": "# Galleries",
    "/admin/testimonials": "# Testimonials",
    "/admin/announcements": "# Announcements",
    "/admin/contact": "# Contact",
    "/admin/simple-sliders": "# Simple Sliders",
    "/admin/newsletters": "# NewsLetters",
    "/admin/settings": "# Settings",
    "/admin/system": "# System",
    "/admin/ecommerce/products": "# Ecommerce > Products",
    "/admin/ecommerce/reports": "# Ecommerce > Reports",
    "/admin/ecommerce/orders": "# Ecommerce > Orders",
    "/admin/ecommerce/incomplete-orders": "# Ecommerce > Incomplete Orders",
    "/admin/ecommerce/order-returns": "# Ecommerce > Order Returns",
    "/admin/ecommerce/product-prices": "# Ecommerce > Product Prices",
    "/admin/ecommerce/product-inventory": "# Ecommerce > Product Inventory",
    "/admin/ecommerce/product-categories": "# Ecommerce > Product Categories",
    "/admin/ecommerce/product-tags": "# Ecommerce > Product Tags",
    "/admin/ecommerce/product-attribute": "# Ecommerce > Product Attribute",
    "/admin/ecommerce/product-options": "# Ecommerce > Product Options",
    "/admin/ecommerce/product-collections": "# Ecommerce > Product Collections",
    "/admin/ecommerce/product-labels": "# Ecommerce > Product Labels",
    "/admin/ecommerce/brands": "# Ecommerce > Brands",
    "/admin/ecommerce/reviews": "# Ecommerce > Reviews",
    "/admin/ecommerce/flash-sales": "# Ecommerce > Flash Sales",
    "/admin/ecommerce/discounts": "# Ecommerce > Discounts",
    "/admin/customers": "# Ecommerce > Customers",
    "/admin/blog/posts": "# Blog > Posts",
    "/admin/blog/categories": "# Blog > Categories",
    "/admin/blog/tags": "# Blog > Tags",
    "/admin/ads": "# Ads > Ads",
    "/admin/menus": "# Appearance > Menus",
    "/admin/widgets": "# Appearance > Widgets",
    "/admin/theme/custom-css": "# Appearance > Custom CSS",
    "/admin/theme/custom-js": "# Appearance > Custom JS",
    "/admin/theme/custom-html": "# Appearance > Custom HTML",
    "/admin/theme/robots-txt": "# Appearance > Robots.txt Editor",
    "/admin/theme/options": "# Appearance > Theme Options",
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery("");
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (event) => {
    const input = event.target.value.toLowerCase();
    setQuery(input);
    setIsOpen(true);

    if (input) {
      const filteredResults = Object.entries(routes)
        .filter(([_, name]) => name.toLowerCase().includes(input))
        .map(([_, name]) => name);
      setResults(filteredResults);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (page) => {
    const path = Object.keys(routes).find((key) => routes[key] === page);
    if (path) {
      navigate(path);
      setQuery("");
      setResults([]);
      setIsOpen(false);
    }
  };

  let appearence = () => {
    setAppear(!appear);
  };

  let toggleecommerce = () => {
    setCommerce(!commerce);
  };

  let toggleads = () => {
    setAds(!ads);
  };

  const toggleFAQ = () => {
    setIsVisible(!isVisible);
  };

  const toggleblog = () => {
    setBlog(!blog);
  };

  let { id } = useParams();
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [selectedLabels1, setSelectedLabels1] = useState([]);

  let [user, setUser] = useState({
    name: "",
    permalink: "",
    description: "",
    sku: "",
    price: "",
    price_sale: "",
    cost: "",
    barcode: "",
    stockstatus: "",
    weight: "",
    length: "",
    wide: "",
    height: "",
    status: "",
    store: "",
    featured: false,
    brand: "",
    minimumorder: "",
    maximumorder: "",
    date: "",
    file: null,
  });

  let {
    name,
    permalink,
    description,
    sku,
    price,
    price_sale,
    cost,
    barcode,
    stockstatus,
    weight,
    length,
    wide,
    height,
    status,
    store,
    featured,
    brand,
    minimumorder,
    maximumorder,
    date,
    file,
  } = user;

  let handleSubmit = async () => {
    let formData = new FormData();
    formData.append("name", name);
    formData.append("permalink", permalink);
    formData.append("description", description);
    formData.append("sku", sku);
    formData.append("price", price);
    formData.append("price_sale", price_sale);
    formData.append("cost", cost);
    formData.append("barcode", barcode);
    formData.append("stockstatus", stockstatus);
    formData.append("weight", weight);
    formData.append("length", length);
    formData.append("wide", wide);
    formData.append("height", height);
    formData.append("status", status);
    formData.append("store", store);
    formData.append("featured", featured ? "Yes" : "No");
    formData.append("brand", brand);
    formData.append("minimumorder", minimumorder);
    formData.append("maximumorder", maximumorder);
    formData.append("date", date);
    formData.append("file", file);
    formData.append("label", selectedLabels || "");
    formData.append("label1", selectedLabels1 || "");
    try {
      const response = await axios.put(`http://50.18.56.183:1600/productupdate/${id}`, formData);
      if (response.status === 200) {
        navigate("/admin/ecommerce/products");
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  const onInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCheckboxChange = (label) => {
    setSelectedLabels((prevState) => {
      if (prevState.includes(label)) {
        return prevState.filter((item) => item !== label);
      } else {
        return [...prevState, label];
      }
    });
  };

  const handleCheckboxChange1 = (label1) => {
    setSelectedLabels1((prevState) => {
      if (prevState.includes(label1)) {
        return prevState.filter((item) => item !== label1);
      } else {
        return [...prevState, label1];
      }
    });
  };

  useEffect(() => {
    somedata();
  }, []);

  let somedata = async () => {
    let response = await axios.get(`http://50.18.56.183:1600/productsomedata/${id}`);
    setUser(response.data[0]);
  };

  const [isNavbarExpanded, setIsNavbarExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 992);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleNavbar = () => {
    if (isMobile) {
      setIsNavbarExpanded(!isNavbarExpanded);
    }
  };

  let { count } = useContext(UserContext);

  const [news, setNews] = useState(false);
  const [more, setMore] = useState([{ attributeName: "", attributeValue: "" }]);

  const attributeNew = () => {
    setNews(!news);
  };

  let moreAttribute = () => {
    setMore([...more, { attributeName: "", attributeValue: "" }]);
  };

  const deleteItem = (index) => {
    if (more.length > 1) {
      setMore((prev) => prev.filter((_, i) => i !== index));
    } else {
      console.log("error", error);
    }
  };

  let [addproducts, setAddProducts] = useState([]);

  let addProduct = () => {
    setAddProducts([...addproducts, { question: "", answer: "" }]);
  };

  let handleInputChange = (index, type, value) => {
    const updatedProducts = [...addproducts];
    updatedProducts[index][type] = value;
    setAddProducts(updatedProducts);
  };

  let removeProduct = (index) => {
    const updatedProducts = addproducts.filter((_, i) => i !== index);
    setAddProducts(updatedProducts);
  };

  const [selectedSpec, setSelectedSpec] = useState("None");

  const handleSelectChange = (event) => {
    setSelectedSpec(event.target.value);
  };

  const [options, setOptions] = useState([]);

  const addOptions = () => {
    setOptions([
      ...options,
      {
        id: Date.now(),
        name: "",
        type: "",
        required: false,
      },
    ]);
  };

  const deleteOptions = (id) => {
    setOptions(options.filter((option) => option.id !== id));
  };

  const handleInputChanges = (id, field, value) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, [field]: value } : option
      )
    );
  };

  const [rows, setRows] = useState([
    { id: 1, label: "", price: "0", priceType: "fixed" },
  ]);

  const handleDelete = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const handleChanges = (id, field, value) => {
    setRows((prevRows) =>
      prevRows.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleAddRow = () => {
    const newRow = {
      id: rows.length + 1,
      label: "",
      price: "",
      priceType: "fixed",
    };
    setRows((prevRows) => [...prevRows, newRow]);
  };

  const [showEdit1, setShowEdit1] = useState(true);
  const [showEdit2, setShowEdit2] = useState(true);
  const [editorData1, setEditorData1] = useState("");
  const [editorData2, setEditorData2] = useState("");
  const [textAreaData1, setTextAreaData1] = useState("");
  const [textAreaData2, setTextAreaData2] = useState("");

  const handleTextAreaChange1 = (e) => {
    setTextAreaData1(e.target.value);
  };

  const handleTextAreaChange2 = (e) => {
    setTextAreaData2(e.target.value);
  };

  const showEditorClicked1 = (e) => {
    e.preventDefault();
    setShowEdit1(!showEdit1);
  };

  const showEditorClicked2 = (e) => {
    e.preventDefault();
    setShowEdit2(!showEdit2);
  };

  const mediaUpload = async (e) => {
    e.preventDefault();
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    fileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        try {
          const response = await fetch("/upload", {
            method: "POST",
            body: formData,
          });

          if (!response.ok) {
            throw new Error("Image upload failed");
          }

          const data = await response.json();
          const imageUrl = data.url;

          if (showEdit1) {
            const editor = document.querySelector(
              ".ck-editor__editable"
            ).editor;
            editor.model.change((writer) => {
              const imageElement = writer.createElement("image", {
                src: imageUrl,
              });
              editor.model.insertContent(imageElement);
            });
          } else if (showEdit2) {
            const editor = document.querySelector(
              ".ck-editor__editable"
            ).editor;
            editor.model.change((writer) => {
              const imageElement = writer.createElement("image", {
                src: imageUrl,
              });
              editor.model.insertContent(imageElement);
            });
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    });
  };

  let [create, setCreate] = useState([]);

  const attributedata = async () => {
    try {
      let response = await axios.get("http://50.18.56.183:1600/attributesdata");
      setCreate(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  attributedata();

  let seodataproduct = () => {
    setSeo(!seo);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery("");
        setResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (search.trim() === "") {
      setProducts([]);
      return;
    }

    const alldata = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://50.18.56.183:1600/productpagedata?search=${search}`
        );
        setProducts(response.data);
      } catch (error) {
        setError("Failed to fetch products");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    alldata();
  }, [search]);

  const [search1, setSearch1] = useState("");
  const [products1, setProducts1] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [error1, setError1] = useState("");

  return (
    <>
      <div
        className={`container-fluid navbar-back ${
          isNavbarExpanded && isMobile ? "expanded" : ""
        }`}
      >
        <div
          className="container container-backend d-flex list-unstyled"
          id="hamburger"
        >
          <ul className="list-unstyled">
            <img
              src={Hamburger}
              alt="Hamburger Menu"
              className="hamburger-back pt-2 pe-1"
              onClick={toggleNavbar}
            />
            <img src={Logo} alt="Logo" className="hamburger1 ms-3 mt-2 pt-1" />
          </ul>

          <input
            type="search"
            className="text-light py-4 search-welcome form-control d-none d-lg-block border border-secondary"
            placeholder="Search"
            value={query}
            onChange={handleChange}
          />
          {isOpen && (
            <div className="search-results-container" ref={resultsRef}>
              {results.length > 0 ? (
                <ul className="search-results text-dark">
                  {results.map((page, index) => (
                    <li key={index} onClick={() => handleSelect(page)}>
                      {page}
                    </li>
                  ))}
                </ul>
              ) : (
                query && (
                  <div
                    className="no-results text-dark px-3 py-3"
                    style={{ cursor: "pointer" }}
                  >
                    No result found
                  </div>
                )
              )}
            </div>
          )}

          <div className="d-flex align-items-center border border-secondary py-2 rounded view-website d-lg-block d-none">
            <Link
              className="btn d-flex align-items-center"
              type="button"
              to="/"
              target="_blank"
            >
              <svg
                class="icon icon-left svg-icon-ti-ti-world me-1 mt- text-lig"
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                <path d="M3.6 9h16.8" />
                <path d="M3.6 15h16.8" />
                <path d="M11.5 3a17 17 0 0 0 0 18" />
                <path d="M12.5 3a17 17 0 0 1 0 18" />
              </svg>
              <span className="text-light ps-1 fs-6">View website</span>
            </Link>
          </div>

          <FontAwesomeIcon
            icon={faMoon}
            className="text-light fs-4 me-2 search-box"
          />
          <FontAwesomeIcon
            icon={faBell}
            className="text-light fs-4 me-2 search-box"
          />
          <FontAwesomeIcon
            icon={faEnvelope}
            className="text-light fs-4 search-box"
          />
          <div className="d-flex flex-column ms-1">
            <span className="text-light count-value1 d-lg-block d-none">
              {count}
            </span>
            <img
              src={Shopping}
              alt="Shopping"
              className="search-box search-box1"
            />
          </div>
        </div>
      </div>

      <div
        className={`sidebar-container ${
          isNavbarExpanded && isMobile ? "expanded" : ""
        }`}
      >
        <div className="sidebar-product mt-1">
          <ul className="list-unstyled d-flex flex-column text-white ms-4">
            <li>
              <Link to="/admin/welcome" className="text-light">
                <svg
                  class="icon svg-icon-ti-ti-home me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 12l-2 0l9 -9l9 9l-2 0"></path>
                  <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7"></path>
                  <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6"></path>
                </svg>
                Dashboard
              </Link>
            </li>

            <div>
              <li onClick={toggleecommerce} style={{ cursor: "pointer" }}>
                <svg
                  class="icon  svg-icon-ti-ti-shopping-bag me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M6.331 8h11.339a2 2 0 0 1 1.977 2.304l-1.255 8.152a3 3 0 0 1 -2.966 2.544h-6.852a3 3 0 0 1 -2.965 -2.544l-1.255 -8.152a2 2 0 0 1 1.977 -2.304z"></path>
                  <path d="M9 11v-5a3 3 0 0 1 6 0v5"></path>
                </svg>
                Ecommerce
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`float-end mt-2 pt-1 me-4 icon-down ${
                    commerce ? "rotate" : ""
                  }`}
                  onClick={toggleecommerce}
                />
              </li>
              {commerce && (
                <div className="faq-content d-flex flex-column ms-3 ps-2">
                  <Link
                    to="/admin/ecommerce/reports"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-report-analytics me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M9 5h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2h-2"></path>
                        <path d="M9 3m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                        <path d="M9 17v-5"></path>
                        <path d="M12 17v-1"></path>
                        <path d="M15 17v-3"></path>
                      </svg>
                      Report
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/orders"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-truck-delivery me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M5 17h-2v-4m-1 -8h11v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5"></path>
                        <path d="M3 9l4 0"></path>
                      </svg>
                      Orders
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/incomplete-orders"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-basket-cancel me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M17 10l-2 -6"></path>
                        <path d="M7 10l2 -6"></path>
                        <path d="M12 20h-4.756a3 3 0 0 1 -2.965 -2.544l-1.255 -7.152a2 2 0 0 1 1.977 -2.304h13.999a2 2 0 0 1 1.977 2.304l-.3 1.713"></path>
                        <path d="M10 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                        <path d="M19 19m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
                        <path d="M17 21l4 -4"></path>
                      </svg>
                      Incomplete Orders
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/order-returns"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-basket-down me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M17 10l-2 -6"></path>
                        <path d="M7 10l2 -6"></path>
                        <path d="M12 20h-4.756a3 3 0 0 1 -2.965 -2.544l-1.255 -7.152a2 2 0 0 1 1.977 -2.304h13.999a2 2 0 0 1 1.977 2.304l-.349 1.989"></path>
                        <path d="M10 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                        <path d="M19 16v6"></path>
                        <path d="M22 19l-3 3l-3 -3"></path>
                      </svg>
                      Order Returns
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/shipments"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-truck-loading me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M2 3h1a2 2 0 0 1 2 2v10a2 2 0 0 0 2 2h15"></path>
                        <path d="M9 6m0 3a3 3 0 0 1 3 -3h4a3 3 0 0 1 3 3v2a3 3 0 0 1 -3 3h-4a3 3 0 0 1 -3 -3z"></path>
                        <path d="M9 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M18 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                      </svg>
                      Shipments
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/invoices"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-file-invoice me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                        <path d="M9 7l1 0"></path>
                        <path d="M9 13l6 0"></path>
                        <path d="M13 17l2 0"></path>
                      </svg>
                      Invoices
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/products"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-package me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 3l8 4.5l0 9l-8 4.5l-8 -4.5l0 -9l8 -4.5"></path>
                        <path d="M12 12l8 -4.5"></path>
                        <path d="M12 12l0 9"></path>
                        <path d="M12 12l-8 -4.5"></path>
                        <path d="M16 5.25l-8 4.5"></path>
                      </svg>
                      Products
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/product-prices"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-currency-dollar me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M16.7 8a3 3 0 0 0 -2.7 -2h-4a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6h-4a3 3 0 0 1 -2.7 -2"></path>
                        <path d="M12 3v3m0 12v3"></path>
                      </svg>
                      Product Prices
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/product-inventory"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-home-check me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2"></path>
                        <path d="M19 13.488v-1.488h2l-9 -9l-9 9h2v7a2 2 0 0 0 2 2h4.525"></path>
                        <path d="M15 19l2 2l4 -4"></path>
                      </svg>
                      Product Inventory
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/product-categories"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-archive me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
                        <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10"></path>
                        <path d="M10 12l4 0"></path>
                      </svg>
                      Product Categories
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/product-tags"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-tag me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        <path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3z"></path>
                      </svg>
                      Product Tags
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/product-attribute-sets"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-album me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                        <path d="M12 4v7l2 -2l2 2v-7"></path>
                      </svg>
                      Product Attributes
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/options"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-database me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 6m-8 0a8 3 0 1 0 16 0a8 3 0 1 0 -16 0"></path>
                        <path d="M4 6v6a8 3 0 0 0 16 0v-6"></path>
                        <path d="M4 12v6a8 3 0 0 0 16 0v-6"></path>
                      </svg>
                      Product Options
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/product-collections"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-album me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                        <path d="M12 4v7l2 -2l2 2v-7"></path>
                      </svg>
                      Product Collections
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/product-labels"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-tags me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M3 8v4.172a2 2 0 0 0 .586 1.414l5.71 5.71a2.41 2.41 0 0 0 3.408 0l3.592 -3.592a2.41 2.41 0 0 0 0 -3.408l-5.71 -5.71a2 2 0 0 0 -1.414 -.586h-4.172a2 2 0 0 0 -2 2z"></path>
                        <path d="M18 19l1.592 -1.592a4.82 4.82 0 0 0 0 -6.816l-4.592 -4.592"></path>
                        <path d="M7 10h-.01"></path>
                      </svg>
                      Product Labels
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/brands"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-registered me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                        <path d="M10 15v-6h2a2 2 0 1 1 0 4h-2"></path>
                        <path d="M14 15l-2 -2"></path>
                      </svg>
                      Brands
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/reviews"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-star me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z"></path>
                      </svg>
                      Reviws
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/flash-sales"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-bolt me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"></path>
                      </svg>
                      Flash Sales
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/discounts"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-discount me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M9 15l6 -6"></path>
                        <circle
                          cx="9.5"
                          cy="9.5"
                          r=".5"
                          fill="currentColor"
                        ></circle>
                        <circle
                          cx="14.5"
                          cy="14.5"
                          r=".5"
                          fill="currentColor"
                        ></circle>
                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                      </svg>
                      Discounts
                    </li>
                  </Link>

                  <Link
                    to="/admin/customers"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-users me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
                      </svg>
                      Customers
                    </li>
                  </Link>
                </div>
              )}
            </div>

            <div>
              <li onClick={togglespecification} style={{ cursor: "pointer" }}>
                <svg
                  class="icon  svg-icon-ti-ti-table-options ms-0 me-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M12 21h-7a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v7"></path>
                  <path d="M3 10h18"></path>
                  <path d="M10 3v18"></path>
                  <path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                  <path d="M19.001 15.5v1.5"></path>
                  <path d="M19.001 21v1.5"></path>
                  <path d="M22.032 17.25l-1.299 .75"></path>
                  <path d="M17.27 20l-1.3 .75"></path>
                  <path d="M15.97 17.25l1.3 .75"></path>
                  <path d="M20.733 20l1.3 .75"></path>
                </svg>
                Product Specification
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`float-lg-end mt-2 pt-1 me-4 icon-down ${
                    Specification ? "rotate" : ""
                  }`}
                  onClick={togglespecification}
                />
              </li>

              {Specification && (
                <div className="faq-content d-flex flex-column ms-1 ps-2">
                  <Link
                    to="/admin/ecommerce/specification-groups"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-point me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                      Specification Groups
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/specification-attributes"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-point me-1"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                      Specification Attributes
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/specification-tables"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-point me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                      Specification Tables
                    </li>
                  </Link>
                </div>
              )}
            </div>

            <li>
              <svg
                class="icon svg-icon-ti-ti-notebook me-2 mb-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18"></path>
                <path d="M13 8l2 0"></path>
                <path d="M13 12l2 0"></path>
              </svg>
              <Link to="/admin/pages" className="text-light">
                Pages
              </Link>
            </li>
            <div>
              <li onClick={toggleblog} style={{ cursor: "pointer" }}>
                <svg
                  class="icon  svg-icon-ti-ti-article me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z"></path>
                  <path d="M7 8h10"></path>
                  <path d="M7 12h10"></path>
                  <path d="M7 16h10"></path>
                </svg>
                Blog
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`float-end mt-2 pt-1 me-4 icon-down ${
                    blog ? "rotate" : ""
                  }`}
                  onClick={toggleblog}
                />
              </li>
              {blog && (
                <div className="faq-content d-flex flex-column ms-3 ps-2">
                  <Link
                    to="/admin/blog/posts"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-file-text me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"></path>
                        <path d="M9 9l1 0"></path>
                        <path d="M9 13l6 0"></path>
                        <path d="M9 17l6 0"></path>
                      </svg>
                      Post
                    </li>
                  </Link>

                  <Link
                    to="/admin/blog/categories"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-folder me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"></path>
                      </svg>
                      Categories
                    </li>
                  </Link>

                  <Link
                    to="/admin/blog/tags"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-tag me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M7.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        <path d="M3 6v5.172a2 2 0 0 0 .586 1.414l7.71 7.71a2.41 2.41 0 0 0 3.408 0l5.592 -5.592a2.41 2.41 0 0 0 0 -3.408l-7.71 -7.71a2 2 0 0 0 -1.414 -.586h-5.172a3 3 0 0 0 -3 3z"></path>
                      </svg>
                      Tags
                    </li>
                  </Link>
                </div>
              )}
            </div>

            <div>
              <li onClick={paymentgateway} style={{ cursor: "pointer" }}>
                <svg
                  class="icon svg-icon-ti-ti-credit-card me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"></path>
                  <path d="M3 10l18 0"></path>
                  <path d="M7 15l.01 0"></path>
                  <path d="M11 15l2 0"></path>
                </svg>
                Payments
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`float-end mt-2 pt-1 me-4 icon-down ${
                    payment ? "rotate" : ""
                  }`}
                  onClick={paymentgateway}
                />
              </li>
              {payment && (
                <div className="faq-content d-flex flex-column ms-3 ps-2">
                  <Link
                    to="/admin/payments/transactions"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-point me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                      Transactions
                    </li>
                  </Link>

                  <Link
                    to="/admin/payments/logs"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-point me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                      Payment Logs
                    </li>
                  </Link>

                  <Link
                    to="/admin/payments/methods"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-point me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                      Payment Methods
                    </li>
                  </Link>
                </div>
              )}
            </div>

            <li>
              <Link to="/admin/galleries" className="text-light">
                <svg
                  class="icon svg-icon-ti-ti-camera me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2"></path>
                  <path d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                </svg>
                Galleries
              </Link>
            </li>
            <li>
              <Link to="/admin/testimonials" className="text-light">
                <svg
                  class="icon svg-icon-ti-ti-user-star me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h.5"></path>
                  <path d="M17.8 20.817l-2.172 1.138a.392 .392 0 0 1 -.568 -.41l.415 -2.411l-1.757 -1.707a.389 .389 0 0 1 .217 -.665l2.428 -.352l1.086 -2.193a.392 .392 0 0 1 .702 0l1.086 2.193l2.428 .352a.39 .39 0 0 1 .217 .665l-1.757 1.707l.414 2.41a.39 .39 0 0 1 -.567 .411l-2.172 -1.138z"></path>
                </svg>
                Testimonials
              </Link>
            </li>

            <div>
              <li onClick={toggleads} style={{ cursor: "pointer" }}>
                <svg
                  class="icon  svg-icon-ti-ti-ad-circle me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0"></path>
                  <path d="M7 15v-4.5a1.5 1.5 0 0 1 3 0v4.5"></path>
                  <path d="M7 13h3"></path>
                  <path d="M14 9v6h1a2 2 0 0 0 2 -2v-2a2 2 0 0 0 -2 -2h-1z"></path>
                </svg>
                Ads
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`float-end mt-2 pt-1 me-4 icon-down ${
                    ads ? "rotate" : ""
                  }`}
                  onClick={toggleads}
                />
              </li>
              {ads && (
                <div className="faq-content d-flex flex-column ms-3 ps-2">
                  <Link
                    to="/admin/ads"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-point me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                      Ads
                    </li>
                  </Link>

                  <Link
                    to="/admin/ads"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-point me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
                      </svg>
                      Ads Settings
                    </li>
                  </Link>
                </div>
              )}
            </div>

            <li>
              <Link to="/admin/announcements" className="text-light">
                <svg
                  class="icon svg-icon-ti-ti-speakerphone me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M18 8a3 3 0 0 1 0 6"></path>
                  <path d="M10 8v11a1 1 0 0 1 -1 1h-1a1 1 0 0 1 -1 -1v-5"></path>
                  <path d="M12 8h0l4.524 -3.77a.9 .9 0 0 1 1.476 .692v12.156a.9 .9 0 0 1 -1.476 .692l-4.524 -3.77h-8a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1h8"></path>
                </svg>
                Announcements
              </Link>
            </li>
            <li>
              <Link to="/admin/contacts" className="text-light">
                <svg
                  class="icon svg-icon-ti-ti-mail me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path>
                  <path d="M3 7l9 6l9 -6"></path>
                </svg>
                Contact
              </Link>
            </li>
            <li>
              <Link to="/admin/simple-sliders" className="text-light">
                <svg
                  class="icon svg-icon-ti-ti-slideshow me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M15 6l.01 0"></path>
                  <path d="M3 3m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z"></path>
                  <path d="M3 13l4 -4a3 5 0 0 1 3 0l4 4"></path>
                  <path d="M13 12l2 -2a3 5 0 0 1 3 0l3 3"></path>
                  <path d="M8 21l.01 0"></path>
                  <path d="M12 21l.01 0"></path>
                  <path d="M16 21l.01 0"></path>
                </svg>
                Simple Sliders
              </Link>
            </li>

            <div>
              <li onClick={toggleFAQ} style={{ cursor: "pointer" }}>
                <svg
                  className="icon svg-icon-ti-ti-help-octagon me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M12.802 2.165l5.575 2.389c.48 .206 .863 .589 1.07 1.07l2.388 5.574c.22 .512 .22 1.092 0 1.604l-2.389 5.575c-.206 .48 -.589 .863 -1.07 1.07l-5.574 2.388c-.512 .22 -1.092 .22 -1.604 0l-5.575 -2.389a2.036 2.036 0 0 1 -1.07 -1.07l-2.388 -5.574a2.036 2.036 0 0 1 0 -1.604l2.389 -5.575c.206 -.48 .589 -.863 1.07 -1.07l5.574 -2.388a2.036 2.036 0 0 1 1.604 0z"></path>
                  <path d="M12 16v.01"></path>
                  <path d="M12 13a2 2 0 0 0 .914 -3.782a1.98 1.98 0 0 0 -2.414 .483"></path>
                </svg>
                FAQs
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`float-end mt-2 pt-1 me-4 icon-down ${
                    isVisible ? "rotate" : ""
                  }`}
                  onClick={toggleFAQ}
                />
              </li>
              {isVisible && (
                <div className="faq-content d-flex flex-column ms-3 ps-2">
                  <Link
                    to="/admin/faqs"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-list-check me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M3.5 5.5l1.5 1.5l2.5 -2.5"></path>
                        <path d="M3.5 11.5l1.5 1.5l2.5 -2.5"></path>
                        <path d="M3.5 17.5l1.5 1.5l2.5 -2.5"></path>
                        <path d="M11 6l9 0"></path>
                        <path d="M11 12l9 0"></path>
                        <path d="M11 18l9 0"></path>
                      </svg>
                      FAQs
                    </li>
                  </Link>

                  <Link
                    to="/admin/faq-categories"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-folder me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"></path>
                      </svg>
                      Categories
                    </li>
                  </Link>
                </div>
              )}
            </div>

            <li>
              <Link to="/admin/newsletters" className="text-light">
                <svg
                  class="icon svg-icon-ti-ti-mail me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"></path>
                  <path d="M3 7l9 6l9 -6"></path>
                </svg>
                Newsletters
              </Link>
            </li>
            <li>
              <svg
                class="icon svg-icon-ti-ti-world me-2 mb-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                <path d="M3.6 9h16.8"></path>
                <path d="M3.6 15h16.8"></path>
                <path d="M11.5 3a17 17 0 0 0 0 18"></path>
                <path d="M12.5 3a17 17 0 0 1 0 18"></path>
              </svg>
              Locations
            </li>
            <li>
              <svg
                class="icon svg-icon-ti-ti-folder me-2 mb-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M5 4h4l3 3h7a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2"></path>
              </svg>
              Media
            </li>

            <div>
              <li onClick={appearence} style={{ cursor: "pointer" }}>
                <svg
                  class="icon svg-icon-ti-ti-brush me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M3 21v-4a4 4 0 1 1 4 4h-4"></path>
                  <path d="M21 3a16 16 0 0 0 -12.8 10.2"></path>
                  <path d="M21 3a16 16 0 0 1 -10.2 12.8"></path>
                  <path d="M10.6 9a9 9 0 0 1 4.4 4.4"></path>
                </svg>
                Appearance
                <FontAwesomeIcon
                  icon={faAngleDown}
                  className={`float-end mt-2 pt-1 me-4 icon-down ${
                    appear ? "rotate" : ""
                  }`}
                  onClick={appearence}
                />
              </li>
              {appear && (
                <div className="faq-content d-flex flex-column ms-3 ps-2">
                  <Link
                    to="/admin/theme/all"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-palette me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25"></path>
                        <path d="M8.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        <path d="M12.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                        <path d="M16.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0"></path>
                      </svg>
                      Themes
                    </li>
                  </Link>

                  <Link
                    to="/admin/menus"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-tournament me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M4 4m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M20 10m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M4 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M4 20m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                        <path d="M6 12h3a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-3"></path>
                        <path d="M6 4h7a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-2"></path>
                        <path d="M14 10h4"></path>
                      </svg>
                      Menus
                    </li>
                  </Link>

                  <Link
                    to="/admin/widgets"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-layout me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M4 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v1a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                        <path d="M4 13m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v3a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                        <path d="M14 4m0 2a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-2a2 2 0 0 1 -2 -2z"></path>
                      </svg>
                      Widgets
                    </li>
                  </Link>

                  <Link
                    to="/admin/theme/options"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-list-tree me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M9 6h11"></path>
                        <path d="M12 12h8"></path>
                        <path d="M15 18h5"></path>
                        <path d="M5 6v.01"></path>
                        <path d="M8 12v.01"></path>
                        <path d="M11 18v.01"></path>
                      </svg>
                      Theme Options
                    </li>
                  </Link>

                  <Link
                    to="/admin/theme/custom-css"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-file-type-css me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                        <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4"></path>
                        <path d="M8 16.5a1.5 1.5 0 0 0 -3 0v3a1.5 1.5 0 0 0 3 0"></path>
                        <path d="M11 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75"></path>
                        <path d="M17 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75"></path>
                      </svg>
                      Custom CSS
                    </li>
                  </Link>
                  <Link
                    to="/admin/theme/custom-js"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-file-type-js me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                        <path d="M3 15h3v4.5a1.5 1.5 0 0 1 -3 0"></path>
                        <path d="M9 20.25c0 .414 .336 .75 .75 .75h1.25a1 1 0 0 0 1 -1v-1a1 1 0 0 0 -1 -1h-1a1 1 0 0 1 -1 -1v-1a1 1 0 0 1 1 -1h1.25a.75 .75 0 0 1 .75 .75"></path>
                        <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2h-1"></path>
                      </svg>
                      Custom JS
                    </li>
                  </Link>

                  <Link
                    to="/admin/theme/custom-html"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-file-type-html me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                        <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4"></path>
                        <path d="M2 21v-6"></path>
                        <path d="M5 15v6"></path>
                        <path d="M2 18h3"></path>
                        <path d="M20 15v6h2"></path>
                        <path d="M13 21v-6l2 3l2 -3v6"></path>
                        <path d="M7.5 15h3"></path>
                        <path d="M9 15v6"></path>
                      </svg>
                      Custom HTML
                    </li>
                  </Link>

                  <Link
                    to="/admin/theme/robots-txt"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        class="icon  svg-icon-ti-ti-file-type-txt me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path
                          stroke="none"
                          d="M0 0h24v24H0z"
                          fill="none"
                        ></path>
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                        <path d="M14 3v4a1 1 0 0 0 1 1h4"></path>
                        <path d="M16.5 15h3"></path>
                        <path d="M5 12v-7a2 2 0 0 1 2 -2h7l5 5v4"></path>
                        <path d="M4.5 15h3"></path>
                        <path d="M6 15v6"></path>
                        <path d="M18 15v6"></path>
                        <path d="M10 15l4 6"></path>
                        <path d="M10 21l4 -6"></path>
                      </svg>
                      Robot.text Editor
                    </li>
                  </Link>
                </div>
              )}
            </div>

            <li>
              <svg
                class="icon svg-icon-ti-ti-plug me-2 mb-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M9.785 6l8.215 8.215l-2.054 2.054a5.81 5.81 0 1 1 -8.215 -8.215l2.054 -2.054z"></path>
                <path d="M4 20l3.5 -3.5"></path>
                <path d="M15 4l-3.5 3.5"></path>
                <path d="M20 9l-3.5 3.5"></path>
              </svg>
              Plugins
            </li>
            <li>
              <svg
                class="icon svg-icon-ti-ti-tool me-2 mb-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M7 10h3v-3l-3.5 -3.5a6 6 0 0 1 8 8l6 6a2 2 0 0 1 -3 3l-6 -6a6 6 0 0 1 -8 -8l3.5 3.5"></path>
              </svg>
              Tools
            </li>
            <li>
              <Link to="/admin/settings" className="text-light">
                <svg
                  class="icon svg-icon-ti-ti-settings me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
                  <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"></path>
                </svg>
                Settings
              </Link>
            </li>
            <li>
              <Link to="/admin/system" className="text-light">
                <svg
                  class="icon svg-icon-ti-ti-user-shield me-2 mb-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h2"></path>
                  <path d="M22 16c0 4 -2.5 6 -3.5 6s-3.5 -2 -3.5 -6c1 0 2.5 -.5 3.5 -1.5c1 1 2.5 1.5 3.5 1.5z"></path>
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                </svg>
                Platform Administration
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <nav className="breadcrumb-container text-center">
        <ol className="breadcrumb d-flex flex-wrap">
          <li className="breadcrumb-item fw-normal">
            <Link to="/admin/welcome">DASHBOARD</Link>
          </li>
          <li className="breadcrumb-item fw-normal text-dark">ECOMMERCE</li>

          <li className="breadcrumb-item fw-medium ms-2">
            <Link to="/admin/ecommerce/products">PRODUCTS</Link>
          </li>

          <li className="breadcrumb-item fw-medium ms-2 text-dark">
            EDIT "{user.name}"
          </li>
        </ol>
      </nav>

      <div className="container-fluid">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12 border rounded py-3 testimonial-page name-truck1 text-start me-3 me-md-0 me-lg-0 ">
              <svg
                class="icon alert-icon svg-icon-ti-ti-info-circle me-2 editor-page"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
                <path d="M12 9h.01"></path>
                <path d="M11 12h1v4h1"></path>
              </svg>
              You are editing <strong className="ms-2 me-2">"English"</strong>{" "}
              version
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="container">
          <div className="row d-flex flex-row flex-xxl-nowrap flex-xl-nowrap gap-3 w-100 ms-md-1">
            <div className="col-12 col-lg-8 border rounded customer-page customer-page2">
              <form>
                <div className="d-flex flex-row gap-2 name-form text-start flex-wrap flex-md-nowrap flex-lg-nowrap flex-sm-nowrap">
                  <div className="d-flex flex-column mb-3 mt-3 w-100">
                    <label htmlFor="">Name</label>
                    <input
                      type="text"
                      class="form-control py-4 mt-2"
                      id="name-create1"
                      placeholder="Name"
                      name="name"
                      value={name}
                      onChange={onInputChange}
                    />
                  </div>
                </div>

                <div className="d-flex flex-row gap-2 name-form text-start flex-wrap flex-lg-nowrap flex-md-nowrap flex-sm-nowrap">
                  <div className="d-flex flex-column mb-3 mt-lg-1 w-100">
                    <label htmlFor="">Permalink</label>
                    <input
                      type="text"
                      className="form-control mt-2 py-4"
                      placeholder="https://shofy.botble.com/products/"
                      name="permalink"
                      value={permalink}
                      onChange={onInputChange}
                    />
                  </div>
                </div>

                <div className="d-flex flex-row gap-2 name-form text-start flex-wrap flex-lg-nowrap flex-md-nowrap flex-sm-nowrap overflow-hidden">
                  <div className="d-flex flex-column mb-3 mt-lg-1 w-100">
                    <label htmlFor="">Description </label>
                    <div className="d-flex gap-2 flex-row mt-2">
                      <button
                        className="btn bg-body border d-flex py-4 mb-2"
                        onClick={showEditorClicked1}
                      >
                        Show/Hide Editor
                      </button>
                      <button
                        className="btn bg-body border d-flex py-4 mb-2 flex-row align-items-center"
                        onClick={mediaUpload}
                      >
                        <FontAwesomeIcon icon={faImage} className="me-2" />
                        Add Media
                      </button>
                    </div>
                    {showEdit1 ? (
                      <div className="mb-0">
                        <CKEditor
                          editor={ClassicEditor}
                          data={editorData1}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setEditorData1(data);
                          }}
                          config={{
                            toolbar: [
                              "heading",
                              "fontColor",
                              "fontSize",
                              "fontBackgroundColor",
                              "fontFamily",
                              "bold",
                              "italic",
                              "underline",
                              "strikethrough",
                              "link",
                              "bulletedList",
                              "numberedList",
                              "alignment",
                              "textDirection",
                              "blockQuote",
                              "indent",
                              "outdent",
                              "insertTable",
                              "imageUpload",
                              "mediaEmbed",
                              "undo",
                              "redo",
                              "findAndReplace",
                              "removeFormat",
                              "source",
                              "codeBlock",
                              "fullscreen",
                            ],
                            heading: {
                              options: [
                                {
                                  model: "paragraph",
                                  title: "Paragraph",
                                  className: "ck-heading_paragraph",
                                },
                                {
                                  model: "heading1",
                                  view: "h1",
                                  title: "Heading 1",
                                  className: "ck-heading_heading1",
                                },
                                {
                                  model: "heading2",
                                  view: "h2",
                                  title: "Heading 2",
                                  className: "ck-heading_heading2",
                                },
                                {
                                  model: "heading3",
                                  view: "h3",
                                  title: "Heading 3",
                                  className: "ck-heading_heading3",
                                },
                                {
                                  model: "heading4",
                                  view: "h4",
                                  title: "Heading 4",
                                  className: "ck-heading_heading4",
                                },
                                {
                                  model: "heading5",
                                  view: "h5",
                                  title: "Heading 5",
                                  className: "ck-heading_heading5",
                                },
                                {
                                  model: "heading6",
                                  view: "h6",
                                  title: "Heading 6",
                                  className: "ck-heading_heading6",
                                },
                              ],
                            },
                          }}
                        />
                      </div>
                    ) : (
                      <div className="mb-0">
                        <textarea
                          id="content1"
                          className="form-control text-create"
                          placeholder="Short description"
                          value={textAreaData1}
                          onChange={handleTextAreaChange1}
                          style={{
                            height: "58px",
                            zIndex: "1000",
                            position: "relative",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex flex-row gap-2 name-form text-start flex-wrap flex-lg-nowrap flex-md-nowrap flex-sm-nowrap">
                  <div className="d-flex flex-column mb-0 mt-lg-0 w-100 overflow-hidden">
                    <label htmlFor="">Content</label>
                    <div className="d-flex gap-2 flex-row mt-2">
                      <button
                        className="btn bg-body border d-flex py-4 mb-2"
                        onClick={showEditorClicked2}
                      >
                        Show/Hide Editor
                      </button>

                      <button
                        className="btn bg-body border d-flex py-4 mb-2 flex-row align-items-center"
                        onClick={mediaUpload}
                      >
                        <FontAwesomeIcon icon={faImage} className="me-2" />
                        Add Media
                      </button>

                      <button
                        className="btn bg-body border d-flex py-4 mb-2 flex-row align-items-center"
                        onClick={(e) => e.preventDefault()}
                      >
                        <FontAwesomeIcon icon={faCube} className="me-2" />
                        UI Blocks
                      </button>
                    </div>
                    {showEdit2 ? (
                      <div className="mb-3">
                        <CKEditor
                          editor={ClassicEditor}
                          data={editorData2}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setEditorData2(data);
                          }}
                          config={{
                            toolbar: [
                              "heading",
                              "fontColor",
                              "fontSize",
                              "fontBackgroundColor",
                              "fontFamily",
                              "bold",
                              "italic",
                              "underline",
                              "strikethrough",
                              "link",
                              "bulletedList",
                              "numberedList",
                              "alignment",
                              "textDirection",
                              "blockQuote",
                              "indent",
                              "outdent",
                              "insertTable",
                              "imageUpload",
                              "mediaEmbed",
                              "undo",
                              "redo",
                              "findAndReplace",
                              "removeFormat",
                              "source",
                              "codeBlock",
                              "fullscreen",
                            ],
                            heading: {
                              options: [
                                {
                                  model: "paragraph",
                                  title: "Paragraph",
                                  className: "ck-heading_paragraph",
                                },
                                {
                                  model: "heading1",
                                  view: "h1",
                                  title: "Heading 1",
                                  className: "ck-heading_heading1",
                                },
                                {
                                  model: "heading2",
                                  view: "h2",
                                  title: "Heading 2",
                                  className: "ck-heading_heading2",
                                },
                                {
                                  model: "heading3",
                                  view: "h3",
                                  title: "Heading 3",
                                  className: "ck-heading_heading3",
                                },
                                {
                                  model: "heading4",
                                  view: "h4",
                                  title: "Heading 4",
                                  className: "ck-heading_heading4",
                                },
                                {
                                  model: "heading5",
                                  view: "h5",
                                  title: "Heading 5",
                                  className: "ck-heading_heading5",
                                },
                                {
                                  model: "heading6",
                                  view: "h6",
                                  title: "Heading 6",
                                  className: "ck-heading_heading6",
                                },
                              ],
                            },
                          }}
                        />
                      </div>
                    ) : (
                      <div className="mb-3">
                        <textarea
                          id="content2"
                          className="form-control text-create"
                          placeholder="Short description"
                          value={textAreaData2}
                          onChange={handleTextAreaChange2}
                          style={{
                            height: "58px",
                            zIndex: "1000",
                            position: "relative",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="d-flex flex-row gap-2 name-form text-start flex-wrap flex-lg-nowrap flex-md-nowrap flex-sm-nowrap">
                  <div className="d-flex flex-column mb-3 mt-lg-0 w-100">
                    <label htmlFor=""> Start date</label>
                    <input
                      type="date"
                      className="form-control mt-2 py-4"
                      name="date"
                      value={date}
                      onChange={onInputChange}
                    />
                  </div>
                </div>

                <div class="card tags-seo mb-3 mt-2">
                  <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-lg-center align-items-start">
                    <div>
                      <h5 className="card-title1 mt-2 text-start">
                        Specification Tables
                      </h5>
                      <Link
                        to="#"
                        className="link-primary1 primary2 meta float-end"
                      >
                        <select
                          className="w-100 rounded-1 py-2 border general-space"
                          style={{
                            zIndex: "1000",
                            cursor: "pointer",
                            position: "relative",
                          }}
                          value={selectedSpec}
                          onChange={handleSelectChange}
                        >
                          <option value="None">None</option>
                          <option value="General Specification">
                            General Specification
                          </option>
                          <option value="Technical Specification">
                            Technical Specification
                          </option>
                        </select>
                      </Link>
                      <hr className="mt-4" />

                      {selectedSpec === "None" && (
                        <p className="card-text text-dark">
                          Select the specification table to display in this
                          product
                        </p>
                      )}

                      {selectedSpec === "General Specification" && (
                        <table className="table table-bordered border table-group2 table-striped">
                          <thead className="bg-light">
                            <tr>
                              <th className="fw-light py-2 px-2">GROUP</th>
                              <th className="fw-light">ATTRIBUTE</th>
                              <th className="fw-light">ATTRIBUTE VALUE</th>
                              <th className="fw-light">HIDE</th>
                              <th className="fw-light">SORTING</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Dimensions</td>
                              <td>Height</td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control py-4 input-attribute"
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                />
                              </td>
                              <td>
                                <FontAwesomeIcon icon={faArrowUp} />
                                <FontAwesomeIcon icon={faArrowDown} />
                              </td>
                            </tr>
                            <tr>
                              <td>Dimensions</td>
                              <td>Width</td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control py-4 input-attribute"
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                />
                              </td>
                              <td>
                                <FontAwesomeIcon icon={faArrowUp} />
                                <FontAwesomeIcon icon={faArrowDown} />
                              </td>
                            </tr>
                            <tr>
                              <td>Dimensions</td>
                              <td>Weight</td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control py-4 input-attribute"
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                />
                              </td>
                              <td>
                                <FontAwesomeIcon icon={faArrowUp} />
                                <FontAwesomeIcon icon={faArrowDown} />
                              </td>
                            </tr>
                            <tr>
                              <td>Performance</td>
                              <td>Power</td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control py-4 input-attribute"
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                />
                              </td>
                              <td>
                                <FontAwesomeIcon icon={faArrowUp} />
                                <FontAwesomeIcon icon={faArrowDown} />
                              </td>
                            </tr>
                            <tr>
                              <td>Performance</td>
                              <td>Speed</td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control py-4 input-attribute"
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                />
                              </td>
                              <td>
                                <FontAwesomeIcon icon={faArrowUp} />
                                <FontAwesomeIcon icon={faArrowDown} />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}

                      {selectedSpec === "Technical Specification" && (
                        <table className="table table-bordered border table-group1 table-striped">
                          <thead className="bg-light">
                            <tr>
                              <th className="fw-light py-2 px-2">GROUP</th>
                              <th className="fw-light">ATTRIBUTE</th>
                              <th className="fw-light">ATTRIBUTE VALUE</th>
                              <th className="fw-light">HIDE</th>
                              <th className="fw-light">SORTING</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Battery</td>
                              <td>Battery Life</td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control py-4 input-attribute"
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                />
                              </td>
                              <td>
                                <FontAwesomeIcon icon={faArrowUp} />
                                <FontAwesomeIcon icon={faArrowDown} />
                              </td>
                            </tr>
                            <tr>
                              <td>Display</td>
                              <td>Screen Size</td>
                              <td>
                                <input
                                  type="text"
                                  className="form-control py-4 input-attribute"
                                />
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                />
                              </td>
                              <td>
                                <FontAwesomeIcon icon={faArrowUp} />
                                <FontAwesomeIcon icon={faArrowDown} />
                              </td>
                            </tr>
                            <tr>
                              <td>Display</td>
                              <td>Resolution</td>
                              <td>
                                <select className="input-attribute py- form-select">
                                  <option value="">1920*1080</option>
                                  <option value="">2560*1440</option>
                                  <option value="">3840*2160</option>
                                </select>
                              </td>
                              <td>
                                <input
                                  type="checkbox"
                                  className="form-check-input"
                                />
                              </td>
                              <td>
                                <FontAwesomeIcon icon={faArrowUp} />
                                <FontAwesomeIcon icon={faArrowDown} />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                </div>

                <div class="card mt-4 create-tags1">
                  <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <div className="w-100">
                      <h5 class="card-title1 text-start">Overview</h5>
                      <Link
                        to="#"
                        class="link-primary1 primary2 meta float-end"
                      ></Link>
                      <hr />
                      <div className="d-flex mb-4 text-start">
                        <div className="me-2 flex-fill">
                          <label htmlFor="coupon-type" className="form-label">
                            SKU
                          </label>
                          <input
                            type="text"
                            className="form-control w-aut py-4 sku-overview"
                            name="sku"
                            value={sku}
                            onChange={onInputChange}
                          />
                        </div>

                        <div className="me-2 flex-fill mt-3 mt-md-0 mt-lg-0 ms-0 ms-lg-3 sku-overview1">
                          <label
                            htmlFor="coupon-condition"
                            className="form-label"
                          >
                            Price
                          </label>
                          <input
                            type="text"
                            className="form-control py-4 sku-overview1"
                            id="discount"
                            placeholder="$"
                            name="price"
                            value={price}
                            onChange={onInputChange}
                          />
                        </div>

                        <div className="flex-fill mt-3 mt-md-0 mt-lg-0 sku-overview1">
                          <label
                            htmlFor="coupon-condition"
                            className="form-label"
                          >
                            Price Sale
                          </label>
                          <input
                            type="text"
                            className="form-control py-4 w-au sku-overview1"
                            id="discount"
                            placeholder="$"
                            name="price_sale"
                            value={price_sale}
                            onChange={onInputChange}
                          />
                        </div>
                      </div>
                      <div className="d-flex mb-4 text-start">
                        <div className="me-2 flex-fill cost-item">
                          <label htmlFor="coupon-type" className="form-label">
                            Cost per item
                          </label>
                          <input
                            type="text"
                            className="form-control w- py-4 coupon-barcode1"
                            placeholder="$"
                            name="cost"
                            value={cost}
                            onChange={onInputChange}
                          />
                        </div>

                        <div className="me-2 flex-fill mt-4 mt-md-0 mt-lg-0 cost-item">
                          <label
                            htmlFor="coupon-condition"
                            className="form-label coupon-barcode"
                          >
                            Barcode (ISBN, UPC, GTIN, etc.)
                          </label>
                          <input
                            type="text"
                            className="form-control py-4 w-100 coupon-barcode1"
                            id="discount"
                            placeholder="$"
                            name="barcode"
                            value={barcode}
                            onChange={onInputChange}
                          />
                        </div>
                      </div>

                      <div className="d-flex1 ms-2 text-start">
                        <input type="checkbox" className="form-check-input" />
                        <label htmlFor="" className="ms-2">
                          With storehouse management
                        </label>
                      </div>

                      <div className="border rounded bg-light mt-3 text-start">
                        <label htmlFor="" className="ms-3 mt-3">
                          Stock status
                        </label>
                        <div className="d-flex ms-3 mt-2 gap-2 mb-3 stock-radio flex-row">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="stockstatus"
                            value="In stock"
                            onChange={onInputChange}
                            checked={stockstatus === "In stock"}
                          />
                          <label htmlFor="">In stock</label>
                          <input
                            type="radio"
                            className="ms-2 form-check-input"
                            name="stockstatus"
                            value="out_of_stock"
                            onChange={onInputChange}
                            checked={stockstatus === "out_of_stock"}
                          />
                          <label htmlFor="">Out of stock</label>
                          <input
                            type="radio"
                            className="ms-2 form-check-input"
                            name="stockstatus"
                            value="backorder"
                            onChange={onInputChange}
                            checked={stockstatus === "backorder"}
                          />
                          <label htmlFor="" className="me-lg-0">
                            on backorder
                          </label>
                        </div>
                      </div>

                      <div className="border w-100 rounded mt-3 cart-cart bg-light text-start">
                        <label
                          htmlFor=""
                          className="fw-medium cart-cart ms-3 mt-3"
                        >
                          Shipping
                        </label>
                        <div className="d-flex mb-4 mt-3">
                          <div className="flex-fill ms-2 shipping-label">
                            <label
                              htmlFor="coupon-type"
                              className="form-label ms-2"
                            >
                              Weight (g)
                            </label>
                            <input
                              type="text"
                              className="form-control w-100 py-4 coupon-barcode1"
                              placeholder="g"
                              name="weight"
                              value={weight}
                              onChange={onInputChange}
                            />
                          </div>

                          <div className="me-2 flex-fill mt-4 mt-lg-0 ms-2 shipping-label">
                            <label
                              htmlFor="coupon-condition"
                              className="form-label coupon-barcode"
                            >
                              Length (cm)
                            </label>
                            <input
                              type="text"
                              className="form-control py-4 w-100 coupon-barcode1"
                              id="discount"
                              placeholder="cm"
                              name="length"
                              value={length}
                              onChange={onInputChange}
                            />
                          </div>
                        </div>

                        <div className="d-flex mb-4 mt-3 ms-2">
                          <div className="me-2 flex-fill shipping-label1">
                            <label
                              htmlFor="coupon-type"
                              className="form-label ms-2"
                            >
                              Wide (cm)
                            </label>
                            <input
                              type="text"
                              className="form-control w-100 py-4 coupon-barcode1"
                              placeholder="cm"
                              name="wide"
                              value={wide}
                              onChange={onInputChange}
                            />
                          </div>

                          <div className="me-2 flex-fill mt-4 mt-lg-0 ms- shipping-label1">
                            <label
                              htmlFor="coupon-condition"
                              className="form-label coupon-barcode"
                            >
                              Height (cm)
                            </label>
                            <input
                              type="text"
                              className="form-control py-4 coupon-barcode1"
                              id="discount"
                              placeholder="cm"
                              name="height"
                              value={height}
                              onChange={onInputChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border ms-1 rounded mt-3 mb-3 cart-cart bg-body d-flex flex-column">
                  <div className="d-flex w-100">
                    <label
                      htmlFor=""
                      className="fw-medium cart-cart ms-4 mt-lg-4 mt-4 flex-grow-1 attribute-produc"
                    >
                      Attributes
                    </label>

                    <button
                      className="btn btn-success ms-auto d-flex me-2 mt-0 mt-lg-4 new-attribute new-attribute2 bg-body border text-dark py-4"
                      onClick={attributeNew}
                      style={{ zIndex: "100" }}
                    >
                      {news ? "Cancel" : "Add new attributes"}
                    </button>
                  </div>

                  <hr className="custom-hr mt-0" />

                  <div className="mt-1 mb-3 me-4 ms-3 ms-lg-2">
                    Adding new attributes helps the product to have many
                    options, such as size or color.
                  </div>

                  {news && (
                    <>
                      <div className="border bg-light mb-2 attribute-select rounded">
                        {more.map((attribute, index) => (
                          <div className="d-flex w-100 mb-3 mt-3" key={index}>
                            <div className="d-flex flex-column w-100 me-3">
                              <label htmlFor="" className="ms-2 mt-2">
                                Attribute Name
                              </label>
                              {Array.isArray(create) && create.length > 0 ? (
                                create.slice(0, 1).map((data, key) => (
                                  <div key={key}>
                                    <select
                                      name="attribute"
                                      className="form-select w-75 mt-2 ms-2 mb-2 h-auto"
                                    >
                                      <option value="">Select Attribute</option>
                                      {create.length > 0 ? (
                                        create.map((item) => {
                                          console.log("Item:", item);
                                          console.log(
                                            "Item title:",
                                            item.title
                                          );
                                          return (
                                            <option
                                              key={item.id}
                                              value={item.title}
                                            >
                                              {item.title}
                                            </option>
                                          );
                                        })
                                      ) : (
                                        <option disabled></option>
                                      )}
                                    </select>
                                  </div>
                                ))
                              ) : (
                                <p></p>
                              )}
                            </div>

                            <div className="d-flex flex-column ms-2 ms-lg-0 w-100">
                              <label htmlFor="" className="ms-0 mt-2">
                                Value
                              </label>
                              <select
                                name=""
                                className="form-select w-75 ms-0 mt-2 mb-2 h-auto"
                              >
                                <option value="">Select Attribute</option>
                                <option value="">S</option>
                                <option value="">M</option>
                                <option value="">L</option>
                                <option value="">Xl</option>
                                <option value="">XXL</option>
                              </select>

                              <div
                                className="ms-auto me-5 mt-4 pt-3"
                                style={{ position: "absolute", left: "76rem" }}
                              >
                                <FontAwesomeIcon
                                  icon={faTrashCan}
                                  className="bg-danger px-2 py-2 rounded text-light"
                                  onClick={() => deleteItem(index)}
                                  style={{
                                    cursor: "pointer",
                                    position: "absolute",
                                    top: "15px",
                                    right: "-16px",
                                    zIndex: "100",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}

                        <button
                          className="btn btn-transparent border mb-2 d-flex py-4 ms-2 mt-2 bg-body mb-3"
                          style={{ maxWidth: "200px" }}
                          onClick={moreAttribute}
                        >
                          Add more attribute
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="border ms-1 rounded mt-3 cart-cart bg-body attribute-product d-flex flex-column mb-3">
                  <div className="d-flex w-100">
                    <label
                      htmlFor=""
                      className="fw-medium cart-cart ms-4 mt-3 mb-3 flex-grow-1"
                    >
                      Product options
                    </label>
                  </div>
                  <hr className="custom-hr mt-0" />
                  {options.map((option, index) => (
                    <div
                      key={option.id}
                      className="border bg-light option-product mb-2 d-flex rounded flex-wrap"
                    >
                      <div className="d-flex flex-column py-2 ms-2 mt-1 pb-3 ms-3 w-auto product-opts w-auto">
                        <label htmlFor=""> #{index + 1} Option</label>
                        <input
                          type="text"
                          className="form-control py-4 mt-2"
                          placeholder="name"
                          value={option.name}
                          onChange={(e) =>
                            handleInputChanges(
                              option.id,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="d-flex flex-column py-2 ms-3 mt-0 mt-lg-2">
                        <label htmlFor="">Type</label>
                        <select
                          className="form-select py-4 mt-2 mt-lg-1 product-opt1"
                          value={option.type}
                          onChange={(e) =>
                            handleInputChanges(
                              option.id,
                              "type",
                              e.target.value
                            )
                          }
                        >
                          <option value="">Please select option</option>
                          <option value="Text" className="fw-bold">
                            Text
                          </option>
                          <option value="Field">Field</option>
                          <option value="Select" className="fw-bold">
                            Select
                          </option>
                          <option value="Dropdown">Dropdown</option>
                          <option value="Checkbox">Checkbox</option>
                          <option value="RadioButton">RadioButton</option>
                        </select>
                      </div>

                      <div className="d-flex flex-row mt-md-5 mt-sm-5 mt-lg-0">
                        <div className="d-flex flex-row py-2 ms-3 gap-2 mt-0 mt-lg-5 ms-lg-2">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={option.required}
                            onChange={(e) =>
                              handleInputChanges(
                                option.id,
                                "required",
                                e.target.checked
                              )
                            }
                          />
                          <label htmlFor="">Is required?</label>
                        </div>

                        <div className="d-flex flex-row ms-lg-5 py-2 ms-2 mt-0 gap-2 mt-0 mt-lg-5 ms-0 ps-2">
                          <button
                            className="btn btn-danger d-flex p-2"
                            onClick={() => deleteOptions(option.id)}
                          >
                            <FontAwesomeIcon icon={faTrashCan} />
                          </button>
                        </div>
                      </div>

                      <div className="w-100 ms-3 me-3 mt-2">
                        <table className="table table-striped table-bordered table-lable1">
                          <thead className="bg-body">
                            <tr>
                              <th className="fw-light text-dark ps-3 py-2">
                                #
                              </th>
                              <th className="fw-light text-dark ps-2">LABEL</th>
                              <th className="fw-light text-dark ps-2">PRICE</th>
                              <th className="fw-light text-dark">PRICE TYPE</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {rows.map((row) => (
                              <tr key={row.id}>
                                <td>
                                  <FontAwesomeIcon icon={faArrowUp} />
                                  <FontAwesomeIcon icon={faArrowDown} />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control py-4"
                                    placeholder="Please fill label"
                                    value={row.label}
                                    onChange={(e) =>
                                      handleChanges(
                                        row.id,
                                        "label",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control py-4"
                                    placeholder="Please fill affect price"
                                    value={row.price}
                                    onChange={(e) =>
                                      handleChanges(
                                        row.id,
                                        "price",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <select
                                    className="form-select"
                                    style={{
                                      cursor: "pointer",
                                      zIndex: 1000,
                                      position: "relative",
                                    }}
                                    value={row.priceType}
                                    onChange={(e) =>
                                      handleChanges(
                                        row.id,
                                        "priceType",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="fixed">Fixed</option>
                                    <option value="percent">Percent</option>
                                  </select>
                                </td>

                                <td>
                                  <button
                                    className="btn bg-body border px-2 py-3 d-flex p-2"
                                    style={{
                                      cursor: "pointer",
                                      zIndex: 1000,
                                      position: "relative",
                                    }}
                                    onClick={() => handleDelete(row.id)}
                                  >
                                    <FontAwesomeIcon icon={faTrashCan} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <button
                          className="btn bg-body border d-flex mb-2 py-4"
                          onClick={handleAddRow}
                        >
                          Add new row
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    className="btn bg-body border py-4 d-flex add-option ms-3"
                    onClick={addOptions}
                  >
                    Add new option
                  </button>

                  <div className="d-flex flex-row flex-md-row align-items-start mb-2 ms-md-2 global-select">
                    <select
                      className="form-select px-4 globally-add1"
                      style={{ zIndex: "100" }}
                    >
                      <option value="">Select Global Option</option>
                      <option value="">Warranty</option>
                      <option value="">RAM</option>
                      <option value="">CPU</option>
                      <option value="">HDD</option>
                    </select>

                    <button
                      className="btn bg-body border py-4 ms-md-2 d-flex globally-add"
                      style={{ whiteSpace: "nowrap", zIndex: "100" }}
                    >
                      Add Global Option
                    </button>
                  </div>
                </div>

                <div className="border ms-1 rounded mt-3 cart-cart bg-body attribute-product d-flex flex-column mb-3">
                  <div className="d-flex w-100">
                    <label
                      htmlFor=""
                      className="fw-medium cart-cart ms-4 mt-3 mb-3 flex-grow-1"
                    >
                      Related Products
                    </label>
                  </div>
                  <hr className="custom-hr mt-0" />
                  <input
                    type="text"
                    className="form-control mb-3 py-4 me-auto ms-3 search-create"
                    placeholder="Search products"
                    name="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {loading && <p>Loading...</p>}
                  {error && <p>{error}</p>}

                  <div className="product-list">
                    {products.length > 0 ? (
                      products.map((product) => {
                        const imageUrl = `/api/productpagedata/src/image/${product.image}`;
                        return (
                          <div
                            key={product.id}
                            className="product-card border w-auto h-auto m-1 rounded"
                          >
                            <div
                              className="d-flex flex-row"
                              style={{ cursor: "pointer" }}
                            >
                              <img
                                src={imageUrl}
                                alt="img not found"
                                onError={(e) =>
                                  (e.target.src =
                                    "/api/path/to/fallback-image.jpg")
                                }
                                className="product-image img-thumbnail mt-2 ms-2 mb-2"
                              />
                              <h5 className="product-name d-flex flex-row mt-4 ms-2 pt-2">
                                {product.name}
                              </h5>
                              <p className="product-price mt-4 ms-2 pt-2">
                                {product.price}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span className="mt-2 ms-2"></span>
                    )}
                  </div>
                </div>

                <div className="border ms-1 rounded mt-3 cart-cart bg-body attribute-product d-flex flex-column mb-3">
                  <div className="d-flex w-100">
                    <label
                      htmlFor=""
                      className="fw-medium cart-cart ms-4 mt-3 mb-3 flex-grow-1"
                    >
                      Cross-selling products
                    </label>
                  </div>
                  <hr className="custom-hr mt-0" />
                  <input
                    type="text"
                    className="form-control mb-3 py-4 me-auto ms-3 search-create"
                    placeholder="Search products"
                    name="search1"
                    value={search1}
                    onChange={(e) => setSearch1(e.target.value)}
                  />
                  {loading1 && <p>Loading...</p>}
                  {error1 && <p>{error1}</p>}

                  <div className="product-list">
                    {products1.length > 0 ? (
                      products1.map((product2) => {
                        const imageUrl = `/api/productpagedata/src/image/${product2.image}`;
                        return (
                          <div
                            key={product2.id}
                            className="product-card border w-auto h-auto m-1 rounded"
                          >
                            <div
                              className="d-flex flex-row"
                              style={{ cursor: "pointer" }}
                            >
                              <img
                                src={imageUrl}
                                alt="img not found"
                                onError={(e) =>
                                  (e.target.src =
                                    "/api/path/to/fallback-image.jpg")
                                }
                                className="product-image img-thumbnail mt-2 ms-2 mb-2"
                              />
                              <h5 className="product-name d-flex flex-row mt-4 ms-2 pt-2">
                                {product2.name}
                              </h5>
                              <p className="product-price mt-4 ms-2 pt-2">
                                {product2.price}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span className="mt-2 ms-2"></span>
                    )}
                  </div>
                  <span className="ms-3">
                    <strong>* Price field:</strong> Enter the amount you want to
                    reduce from the original price. Example: If the original
                    price is $100, enter 20 to reduce the price to $80.
                  </span>
                  <span className="ms-3 mb-3">
                    <strong>* Type field:</strong> Choose the discount type:
                    Fixed (reduce a specific amount) or Percent (reduce by a
                    percentage).
                  </span>
                </div>

                <div className="border ms-1 rounded mt-3 cart-cart bg-body attribute-product d-flex flex-column  mb-3">
                  <div className="d-flex w-100">
                    <label
                      htmlFor=""
                      className="fw-medium cart-cart ms-4 mt-3 mb-3 flex-grow-1"
                    >
                      Product FAQs
                    </label>
                  </div>
                  <hr className="custom-hr mt-0" />

                  {addproducts.map((product, index) => (
                    <div
                      key={index}
                      className="input-question border mb-2 bg-light rounded ms-2 position-relative"
                    >
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="remove-icon position-absolute top-0 end-0 m-2 me-3 fs-6 px-2 py-2 rounded cursor-pointer text-dark border"
                        onClick={() => removeProduct(index)}
                      />
                      <label htmlFor="" className="mt-3 ms-3">
                        Question
                      </label>
                      <textarea
                        type="text"
                        className="form-control ms-3 mb-2 mt-2 input-question"
                        style={{ height: "58px" }}
                        value={product.question}
                        onChange={(e) =>
                          handleInputChange(index, "question", e.target.value)
                        }
                      />
                      <label htmlFor="" className="mt-2 ms-3">
                        Answer
                      </label>
                      <textarea
                        type="text"
                        className="form-control ms-3 mb-4 mt-2 input-question"
                        style={{ height: "58px" }}
                        value={product.answer}
                        onChange={(e) =>
                          handleInputChange(index, "answer", e.target.value)
                        }
                      />
                    </div>
                  ))}

                  <button
                    className="me-auto ms-4 mb-3 btn bg-light border d-flex py-4 px-3 z-3"
                    onClick={addProduct}
                  >
                    Add new
                  </button>
                </div>

                <div class="card mt-3 ms- create-tags1 create-display">
                  <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <div>
                      <h5 class="card-title1">Search Engine Optimize</h5>
                      <Link
                        to="#"
                        class="link-primary1 primary2 meta float-end"
                        onClick={seodataproduct}
                        style={{ zIndex: "100" }}
                      >
                        Edit SEO meta
                      </Link>
                      <hr />
                      <p class="card-text text-dark">
                        Setup meta title & description to make your site easy to
                        discovered on search engines such as Google
                        <hr />
                        {seo && (
                          <>
                            <div>
                              <label htmlFor="">SEO Title</label>
                              <input
                                type="text"
                                className="form-control mt-2 py-4 seo-edit"
                              />
                            </div>

                            <div className="mt-3">
                              <label htmlFor="seo-description">
                                SEO Description
                              </label>
                              <textarea
                                id="seo-description"
                                className="form-control mt-2 py-4 seo-edit"
                                placeholder="SEO Description"
                                style={{
                                  height: "100px",
                                  overflow: "auto",
                                  resize: "vertical",
                                  minHeight: "100px",
                                }}
                              />
                            </div>

                            <div>
                              <label className="mt-3 pt-2 ms-2">
                                SEO image
                              </label>
                              <div className="image-card border-0 ps-1">
                                <div
                                  className="image-placeholder"
                                  onClick={() =>
                                    document.getElementById("fileInput").click()
                                  }
                                >
                                  {imageUrl ? (
                                    <img
                                      alt="Uploaded preview"
                                      src={imageUrl}
                                      width="100"
                                      height="100"
                                    />
                                  ) : (
                                    <img
                                      src={Cutting}
                                      alt="404"
                                      className="w-75 h-75 img-fluid"
                                    />
                                  )}
                                </div>
                                <input
                                  id="fileInput"
                                  type="file"
                                  name="file"
                                  style={{ display: "none" }}
                                  onChange={handleFileChange}
                                />
                                <Link
                                  className="ms-5"
                                  to="#"
                                  onClick={() =>
                                    document.getElementById("fileInput").click()
                                  }
                                >
                                  Choose image <br />
                                </Link>
                                <span className="ms-2 me-2 ms-5">or</span>
                                <Link to="#" onClick={handleAddFromUrl}>
                                  Add from URL
                                </Link>
                              </div>
                            </div>

                            <div className="d-flex gap-2 ms-2">
                              <label htmlFor="">Index</label>
                            </div>

                            <div className="ms-2 mt-2 pb-2">
                              <input
                                class="form-check-input"
                                type="radio"
                                name="check"
                                checked
                              />
                              <label htmlFor="" className="ms-2">
                                Index
                              </label>

                              <input
                                className="form-check-input ms-2"
                                type="radio"
                                value="index"
                                name="check"
                              />
                              <label htmlFor="" className="ms-2">
                                No index
                              </label>
                            </div>
                          </>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="col-12 col-sm-12 col-md-12 col-lg-4 d-flex flex-column gap-3 customer-page1">
              <div className="border rounded p-2 customer-page1">
                <h4 className="mt-0 text-start">Publish</h4>
                <hr />
                <div className="d-flex flex-row gap-3 mb-3">
                  <button
                    type="button"
                    className="btn btn-success rounded py-4 px-3 d-flex flex-row align-items-center"
                    onClick={handleSubmit}
                  >
                    <FontAwesomeIcon icon={faSave} className="me-2" /> Save
                  </button>
                  <button className="btn btn-body border rounded py-4 px-3 d-flex flex-row align-items-center">
                    <FontAwesomeIcon icon={faSignOut} className="me-2" />
                    Save & Exit
                  </button>
                </div>
              </div>

              <div className="border rounded p-3 customer-page1">
                <h4 className="mt-0 text-start">Status</h4>
                <hr />
                <select
                  className="w-100 rounded-1 py-2 border"
                  name="status"
                  value={status}
                  onChange={onInputChange}
                >
                  <option value="">Select an option</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              <div className="border rounded p-3 customer-page1">
                <h5 class="card-title fw-lighter text-start">Store</h5>
                <hr />
                <select
                  className="w-100 rounded-1 py-2 border"
                  name="store"
                  value={store}
                  onChange={onInputChange}
                  required
                >
                  <option value="">Select a store</option>
                  <option value="GoPro">GoPro</option>
                  <option value="Global Office">Global Office</option>
                  <option value="Young Shop">Young Shop</option>
                  <option value="Global Store">Global Store</option>
                  <option value="Rebort's Store">Rebort's Store</option>
                  <option value="Stroufer">Stroufer</option>
                  <option value="Starkist">StarKist</option>
                </select>
              </div>

              <div className="border rounded p-3 customer-page1">
                <h5 class="card-title fw-lighter">Is featured?</h5>
                <hr />
                <div class="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="has-action"
                    name="feature"
                    checked={user.feature}
                    onChange={onInputChange}
                  />
                </div>
              </div>

              <div className="border rounded p-3 customer-page1">
                <h5 class="card-title fw-lighter">Brand</h5>
                <hr />
                <select
                  className="w-100 rounded-1 py-2 border"
                  name="brand"
                  value={brand}
                  onChange={onInputChange}
                  required
                >
                  <option value="">Select a brand</option>
                  <option value="FoodPound">FoodPound</option>
                  <option value="iTea JSC">iTea JSC</option>
                  <option value="Soda Brand">Soda Brand</option>
                  <option value="Shofy">Shofy</option>
                  <option value="Soda Brand">Soda Brand</option>
                </select>
              </div>

              <div className="border rounded p-3 customer-page1">
                <h5>Featured image </h5>
                <hr />
                <div
                  className="image-placeholder"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  {imageUrl ? (
                    <img
                      alt="Uploaded preview"
                      src={imageUrl}
                      width="100"
                      height="100"
                    />
                  ) : (
                    <img src={Cutting} className="w-75 h-100" />
                  )}
                </div>
                <input
                  id="fileInput"
                  type="file"
                  name="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <Link
                  to="#"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Choose image
                </Link>
                <span className="ms-2 me-2">or</span>
                <Link to="#" onClick={handleAddFromUrl}>
                  Add from URL
                </Link>
              </div>

              <div className="border rounded p-3 customer-page1">
                <h5>Product collections</h5>
                <hr />
                <div className="d-flex gap-2 mb-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={() =>
                      handleCheckboxChange1("Weekly Gadget Spotlight")
                    }
                  />
                  <label htmlFor="">Weekly Gadget Spotlight</label>
                </div>
                <div className="d-flex gap-2 mb-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={() =>
                      handleCheckboxChange1("Electronic Trendsetters")
                    }
                  />
                  <label htmlFor="">Electronic Trendsetters</label>
                </div>
                <div className="d-flex gap-2 mb-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={() =>
                      handleCheckboxChange1("Digital Workspace Gear")
                    }
                  />
                  <label htmlFor="">Digital Workspace Gear</label>
                </div>
                <div className="d-flex gap-2 mb-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={() => handleCheckboxChange1("Cutting Edge Tech")}
                  />
                  <label htmlFor="">Cutting Edge Tech</label>
                </div>
              </div>

              <div className="border rounded p-3 customer-page1">
                <h5>Labels</h5>
                <hr />
                <div className="d-flex gap-2 mb-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={() => handleCheckboxChange("Hot")}
                  />
                  <label htmlFor="">Hot</label>
                </div>
                <div className="d-flex gap-2 mb-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={() => handleCheckboxChange("New")}
                  />
                  <label htmlFor="">New</label>
                </div>
                <div className="d-flex gap-2 mb-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    onChange={() => handleCheckboxChange("Sale")}
                  />
                  <label htmlFor="">Sale</label>
                </div>
              </div>

              <div className="border rounded p-3 customer-page1">
                <h5>Taxes</h5>
                <hr />
                <div className="d-flex gap-2 mb-1">
                  <input type="checkbox" className="form-check-input" />
                  <label htmlFor="">None (0%)</label>
                </div>
                <div className="d-flex gap-2 mb-1">
                  <input type="checkbox" className="form-check-input" />
                  <label htmlFor="">VAT (10%)</label>
                </div>
                <div className="d-flex gap-2 mb-1">
                  <input type="checkbox" className="form-check-input" />
                  <label htmlFor="">Import Tax (15%)</label>
                </div>
              </div>

              <div className="border rounded p-3 customer-page1">
                <h6>Minimum order quantity</h6>
                <hr />
                <input
                  type="number"
                  className="form-control py-4"
                  placeholder="Maximum quantity"
                  name="minimumorder"
                  value={minimumorder}
                  onChange={onInputChange}
                />
              </div>

              <div className="border rounded p-3 customer-page1">
                <h6>Maximum order quantity</h6>
                <hr />
                <input
                  type="number"
                  className="form-control py-4"
                  placeholder="Minimum quantity"
                  name="maximumorder"
                  value={maximumorder}
                  onChange={onInputChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductsEdit;
