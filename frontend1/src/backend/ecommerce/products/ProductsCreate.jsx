import React, { useEffect, useRef, useState } from "react";
import "./ProductsCreate.css";
import Hamburger from "../../../assets/hamburger.svg";
import Logo from "../../../assets/Tonic.svg";
import Cutting from "../../../assets/Cutting.webp";
import {
  faAngleDown,
  faArrowDown,
  faArrowUp,
  faBell,
  faCube,
  faEnvelope,
  faImage,
  faMoon,
  faSave,
  faSignOut,
  faTrashCan,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Shopping from "../../../assets/Shopping.svg";
import { Link, useNavigate } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Helmet } from "react-helmet-async";

function ProductsCreate() {
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
    try {
      toast.success(
        "Functionality to add image from URL needs to be implemented.",
        {
          position: "bottom-right",
          autoClose: 1000,
          progress: true,
          closeOnClick: true,
          draggable: true,
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const [seoImage, setSeoImage] = useState(null);
  const [seoImageUrl, setSeoImageUrl] = useState(null);

  const handleSeoFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSeoImage(file);
      setSeoImageUrl(url);
    }
  };

  const handleSeoCloseClick = (e) => {
    e.stopPropagation();
    setSeoImageUrl(null);
    setSeoImage(null);
  };

  const handleCloseClick = () => {
    setImageUrl(null);
    setImage(null);
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
  let [seo, setSeo] = useState(false);
  let [Specification, setSpecifcation] = useState(false);
  let [payment, setPayment] = useState(false);

  let paymentgateway = () => {
    setPayment(!payment);
  };

  let togglespecification = () => {
    setSpecifcation(!Specification);
  };

  let seodataproduct = () => {
    setSeo(!seo);
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
    "/admin/payments/transactions": "# Payments > Transactions",
    "/admin/payments/logs": "# Payments > Payment Logs",
    "/admin/payments/methods": "# Payments > Payment Methods",
    "/admin/system/users": "# Platform > System > Users",
  };

  const [LogoData, setLogoData] = useState(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/get-theme-logo"
        );
        setLogoData(response.data);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);

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

  let [user, setUser] = useState({
    name: "",
    permalink: "",
    description: "",
    content: "",
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
    tags: "",
    faqs: "",
    attribute: "",
    date: "",
    file: null,
  });

  const [errors, setErrors] = useState({});

  let {
    name,
    permalink,
    description,
    content,
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
    tags,
    faqs,
    attribute,
    date,
    file,
  } = user;

  const validateForm = () => {
    let newErrors = {};
    const requiredFields = {
      name,
      permalink,
      description,
      content,
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
      brand,
      minimumorder,
      maximumorder,
      date,
    };

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

  const getSelectedCategories = () => {
    return Object.entries(checkedItems)
      .filter(([key, value]) => value === true)
      .map(([key]) => key);
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const selectedCategories = getSelectedCategories();
    const formattedAttributes = more
      .filter((attr) => attr.attributeId && attr.attributeValue)
      .map((attr) => {
        const selectedAttr = create.find(
          (item) => item.id === Number(attr.attributeId)
        );
        return `${selectedAttr?.title}:${attr.attributeValue}`;
      })
      .join(",");
    const selectedQuestions = pages
      .filter((p) => selectedIds.includes(p.id))
      .map((p) => p.question);
    let formData = new FormData();
    formData.append("name", name);
    formData.append("permalink", permalink);
    formData.append("description", description);
    formData.append("content", content);
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
    formData.append("tags", selectedTags.join(","));
    formData.append("date", date);
    formData.append("faqs", selectedQuestions.join(", "));
    formData.append("attribute", formattedAttributes);
    formData.append("file", file);
    formData.append("label", selectedLabels.join(","));
    formData.append("label1", selectedCollections.join(","));
    formData.append("categories", selectedCategories.join(","));
    try {
      const response = await axios.post(
        "http://147.93.45.171:1600/productpage",
        formData
      );
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
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const [showEdit2, setShowEdit2] = useState(true);
  const [editorData2, setEditorData2] = useState("");
  const [textAreaData2, setTextAreaData2] = useState("");
  const [editorData1, setEditorData1] = useState(user.content || "");
  const [showEdit1, setShowEdit1] = useState(true);

  const showEditorClicked1 = (e) => {
    e.preventDefault();
    setShowEdit1(!showEdit1);
  };

  const handleEditorChange1 = (event, editor) => {
    const data = editor.getData();
    setEditorData1(data);
    setUser((prev) => ({ ...prev, content: data }));
    setErrors((prev) => ({ ...prev, content: undefined }));
  };

  const handleTextAreaChange1 = (e) => {
    setEditorData1(e.target.value);
    setUser({ ...user, description: e.target.value });
    if (errors.description) {
      setErrors({ ...errors, description: "" });
    }
  };

  const handleEditorChange2 = (event, editor) => {
    const data = editor.getData();
    setEditorData2(data);
    setTextAreaData2(data);
    setUser((prev) => ({ ...prev, description: data }));
  };

  const handleTextAreaChange2 = (e) => {
    setEditorData2(e.target.value);
    setUser({ ...user, description: e.target.value });
    if (errors.description) {
      setErrors({ ...errors, description: "" });
    }
  };

  const showEditorClicked2 = (e) => {
    e.preventDefault();
    setShowEdit2(!showEdit2);
  };

  const descEditorRef = useRef(null);
  const contentEditorRef = useRef(null);

  const handleEditorReady = (editor, target) => {
    if (target === "desc") descEditorRef.current = editor;
    else contentEditorRef.current = editor;
  };

  const mediaUpload = async (e, target = "desc") => {
    e && e.preventDefault();

    const toastOptions = {
      position: "bottom-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeButton: true,
      draggable: true,
      progress: undefined,
    };

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    const getEditor = () =>
      target === "desc" ? descEditorRef.current : contentEditorRef.current;
    const setEditorDataByTarget =
      target === "desc" ? setEditorData2 : setEditorData1;
    const editorDataByTarget = target === "desc" ? editorData2 : editorData1;

    fileInput.addEventListener(
      "change",
      async (ev) => {
        const file = ev.target.files && ev.target.files[0];
        if (!file) {
          fileInput.remove();
          return;
        }

        const MAX_MB = 3;
        if (file.size > MAX_MB * 1024 * 1024) {
          toast.error(`Image too large. Max ${MAX_MB} MB.`, toastOptions);
          fileInput.remove();
          return;
        }

        try {
          const reader = new FileReader();

          reader.onload = () => {
            const dataUrl = reader.result;
            const editor = getEditor();

            if (editor) {
              try {
                editor.model.change((writer) => {
                  let imageEl = null;
                  try {
                    imageEl = writer.createElement("imageBlock", {
                      src: dataUrl,
                      alt: file.name,
                    });
                  } catch (err) {
                    try {
                      imageEl = writer.createElement("image", {
                        src: dataUrl,
                        alt: file.name,
                      });
                    } catch (e) {
                      imageEl = null;
                    }
                  }

                  if (imageEl) {
                    editor.model.insertContent(
                      imageEl,
                      editor.model.document.selection
                    );
                  } else {
                    const html = `<figure class="image"><img src="${dataUrl}" alt="${file.name}"></figure>`;
                    const viewFragment = editor.data.processor.toView(html);
                    const modelFragment = editor.data.toModel(viewFragment);
                    editor.model.insertContent(
                      modelFragment,
                      editor.model.document.selection
                    );
                  }
                });

                const newData = editor.getData();
                setEditorDataByTarget(newData);
                setUser((p) => ({ ...p, content: newData }));
                toast.success("Image inserted successfully", toastOptions);
              } catch (insertErr) {
                console.error("Insert failed:", insertErr);
                toast.error("Could not insert image into editor", toastOptions);
              }
            } else {
              const imgHtml = `<img src="${dataUrl}" alt="${file.name}" />`;
              setEditorDataByTarget((prev) =>
                prev ? prev + imgHtml : imgHtml
              );
              setUser((p) => ({
                ...p,
                content: (editorDataByTarget || "") + imgHtml,
              }));
              toast.info(
                "Editor not ready — image data appended as HTML",
                toastOptions
              );
            }
          };

          reader.onerror = (err) => {
            console.error("FileReader error", err);
            toast.error("Failed to read file", toastOptions);
          };

          reader.readAsDataURL(file);
        } finally {
          fileInput.remove();
        }
      },
      { once: true }
    );

    fileInput.click();
  };

  let [create, setCreate] = useState([]);

  useEffect(() => {
    const attributedata = async () => {
      try {
        let response = await axios.get(
          "http://147.93.45.171:1600/attributesdata"
        );
        setCreate(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    attributedata();
  }, []);

  const [more, setMore] = useState([{ attributeName: "", attributeValue: "" }]);

  const deleteItem = (index) => {
    if (more.length > 1) {
      setMore((prev) => prev.filter((_, i) => i !== index));
    } else {
      console.log("error", error);
    }
  };

  const [searchText, setSearchText] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const parentRefs = useRef({});

  const categories = [
    { name: "New Arrivals" },
    {
      name: "Electronics",
      children: [
        {
          name: "Featured",
          children: ["New Arrivals", "Best Sellers", "Mobile Phone"],
        },
        {
          name: "Computers & Laptops",
          children: [
            "Top Brands",
            "Weekly Best Selling",
            "CPU Heat Pipes",
            "CPU Coolers",
          ],
        },
        {
          name: "Accessories",
          children: [
            "Headphones",
            "Wireless Headphones",
            "TWS Earphones",
            "Smart Watch",
            "Gaming Console",
            "PlayStation",
          ],
        },
      ],
    },
    {
      name: "Gifts",
      children: [],
    },
    {
      name: "Computers",
      children: [
        {
          name: "Accessories",
          children: ["Desktop", "Laptop", "Tablet"],
        },
      ],
    },
    {
      name: "Accessories",
      children: [
        {
          name: "With Bluetooth",
          children: [],
        },
      ],
    },
    {
      name: "Sports",
      children: [],
    },
    {
      name: "Electronic Gadgets",
      children: [
        {
          name: "Microscope",
          children: [],
        },
        {
          name: "Remote Control",
          children: [],
        },
        {
          name: "Monitor",
          children: [],
        },
        {
          name: "Thermometer",
          children: [],
        },
        {
          name: "Backpack",
          children: [],
        },
        {
          name: "Headphones",
          children: [],
        },
      ],
    },
  ];

  const filteredCategories = categories
    .map((mega) => {
      if (mega.name.toLowerCase().includes(searchText.toLowerCase()))
        return mega;

      const filteredChildren = mega.children
        ?.map((mini) => {
          if (mini.name.toLowerCase().includes(searchText.toLowerCase()))
            return mini;

          const filteredGrandChildren = mini.children?.filter((child) =>
            child.toLowerCase().includes(searchText.toLowerCase())
          );

          if (filteredGrandChildren?.length) {
            return { ...mini, children: filteredGrandChildren };
          }

          return null;
        })
        .filter(Boolean);

      if (filteredChildren?.length) {
        return { ...mega, children: filteredChildren };
      }

      return null;
    })
    .filter(Boolean);

  useEffect(() => {
    Object.keys(parentRefs.current).forEach((key) => {
      const ref = parentRefs.current[key];
      if (ref) {
        const allChildren = Object.keys(checkedItems).filter((item) =>
          item.startsWith(key + " >")
        );
        const checkedChildren = allChildren.filter(
          (item) => checkedItems[item]
        );
        ref.indeterminate =
          checkedChildren.length > 0 &&
          checkedChildren.length < allChildren.length;
      }
    });
  }, [checkedItems]);

  const toggleMega = (mega) => {
    const updated = { ...checkedItems };
    const isChecked = !checkedItems[mega.name];
    updated[mega.name] = isChecked;
    mega.children?.forEach((mini) => {
      updated[`${mega.name} > ${mini.name}`] = isChecked;
      mini.children?.forEach((child) => {
        updated[`${mega.name} > ${mini.name} > ${child}`] = isChecked;
      });
    });

    setCheckedItems(updated);
  };

  const toggleMini = (mega, mini) => {
    const updated = { ...checkedItems };
    const miniKey = `${mega.name} > ${mini.name}`;
    const isChecked = !checkedItems[miniKey];

    updated[miniKey] = isChecked;

    mini.children?.forEach((child) => {
      updated[`${miniKey} > ${child}`] = isChecked;
    });

    const allMiniKeys = mega.children.map((m) => `${mega.name} > ${m.name}`);
    const allMinisChecked = allMiniKeys.every((k) => updated[k]);
    updated[mega.name] = allMinisChecked;

    setCheckedItems(updated);
  };

  const toggleChild = (mega, mini, child) => {
    const updated = { ...checkedItems };
    const childKey = `${mega.name} > ${mini.name} > ${child}`;
    updated[childKey] = !checkedItems[childKey];
    const miniKey = `${mega.name} > ${mini.name}`;
    const allChildKeys = mini.children.map((c) => `${miniKey} > ${c}`);
    const allChecked = allChildKeys.every((k) => updated[k]);

    updated[miniKey] = allChecked;
    updated[mega.name] = mega.children.every((m) => {
      const mk = `${mega.name} > ${m.name}`;
      const mChildren = m.children.map((c) => `${mk} > ${c}`);
      return mChildren.every((k) => updated[k]);
    });

    setCheckedItems(updated);
  };

  const [tag1, setTag1] = useState([]);
  const [tags1, setTags1] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

  useEffect(() => {
    const tagsdata = async () => {
      let response = await axios.get(
        "http://147.93.45.171:1600/producttagdata"
      );
      setTag1(response.data);
    };
    tagsdata();
  }, []);

  const handleInputChange1 = (e) => {
    const value = e.target.value;
    setTags1(value);

    const filtered = tag1.filter((tag) =>
      tag.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filtered);
  };

  const handleAddTag = (tagName) => {
    if (!selectedTags.includes(tagName)) {
      setSelectedTags([...selectedTags, tagName]);
    }
    setTags1("");
    setFilteredSuggestions([]);
  };

  const handleRemoveTag = (tagName) => {
    setSelectedTags((prev) => prev.filter((tag) => tag !== tagName));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && tags1.trim() !== "") {
      e.preventDefault();
      const match = tag1.find(
        (tag) => tag.name.toLowerCase() === tags1.trim().toLowerCase()
      );

      if (match) {
        handleAddTag(match.name);
      }
    }
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

  let [count5, setCount5] = useState(0);

  useEffect(() => {
    let orderdata = async () => {
      let response = await axios.get("http://147.93.45.171:1600/checkoutdata");
      setCount5(response.data.length);
    };
    orderdata();
  }, []);

  let [addproducts, setAddProducts] = useState([]);

  let addProduct = (e) => {
    e.preventDefault();
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

  const extendedTypes = ["Checkbox", "RadioButton", "Dropdown"];
  const [options, setOptions] = useState([]);

  const addOptions = (e) => {
    e.preventDefault();
    setOptions((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: "",
        type: "",
        required: false,
        rows: [
          { id: Date.now() + 1, label: "", price: "", priceType: "fixed" },
        ],
        priceRows: [{ id: Date.now() + 2, price: "", priceType: "fixed" }],
      },
    ]);
  };

  const deleteOptions = (optId) => {
    setOptions((prev) => prev.filter((opt) => opt.id !== optId));
  };

  const handleInputChanges = (optId, field, value) => {
    setOptions((prev) =>
      prev.map((opt) => (opt.id === optId ? { ...opt, [field]: value } : opt))
    );
  };

  const handleAddRow = (optId, e) => {
    e.preventDefault();
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === optId
          ? {
              ...opt,
              rows: [
                ...opt.rows,
                { id: Date.now(), label: "", price: "", priceType: "fixed" },
              ],
            }
          : opt
      )
    );
  };

  const handleDeleteRow = (optId, rowId) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === optId
          ? { ...opt, rows: opt.rows.filter((r) => r.id !== rowId) }
          : opt
      )
    );
  };

  const handleChanges = (optId, rowId, field, value) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === optId
          ? {
              ...opt,
              rows: opt.rows.map((r) =>
                r.id === rowId ? { ...r, [field]: value } : r
              ),
            }
          : opt
      )
    );
  };

  const handleAddPrice = (optId, e) => {
    e.preventDefault();
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === optId
          ? {
              ...opt,
              priceRows: [
                ...opt.priceRows,
                { id: Date.now(), price: "", priceType: "fixed" },
              ],
            }
          : opt
      )
    );
  };

  const handlePriceChange = (optId, rowId, field, value) => {
    setOptions((prev) =>
      prev.map((opt) =>
        opt.id === optId
          ? {
              ...opt,
              priceRows: opt.priceRows.map((r) =>
                r.id === rowId ? { ...r, [field]: value } : r
              ),
            }
          : opt
      )
    );
  };

  let [attributes, setAttributes] = useState(false);

  let addAttribute = (e) => {
    e.preventDefault();
    setAttributes(!attributes);
  };

  const [click, setClick] = useState(false);
  const [global, setGlobal] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    const globaldata = async () => {
      const response = await axios.get(
        "http://147.93.45.171:1600/productoptiondata"
      );
      setGlobal(response.data);
    };
    globaldata();
  }, []);

  const globalOptionsClicked = (e) => {
    e.preventDefault();
    const selected = global.find((item) => item.name === selectedOption);
    if (selected) {
      setClick(true);
      setGlobalSelectedData(selected);
    }
  };

  const trashDelete = (e) => {
    e.preventDefault();
    setClick(false);
    setGlobalSelectedData(null);
    setSelectedOption(null);
  };

  const addNewRow = (e) => {
    e.preventDefault();
    const newOption = {
      id: Date.now(),
      label: "",
      price: 0,
      priceType: "fixed",
    };
    setGlobalSelectedData((prevState) => ({
      ...prevState,
      options: [...(prevState.options || []), newOption],
    }));
  };

  const [globalSelectedData, setGlobalSelectedData] = useState({
    status: "Field",
    options: [{ id: Date.now(), price: "", priceType: "fixed" }],
  });

  const addNewRowClicked = (e) => {
    e.preventDefault();
    const newOption = {
      id: Date.now(),
      price: "",
      priceType: "fixed",
    };
    setGlobalSelectedData((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
  };

  const deleteRow = (id) => {
    const updatedOptions = globalSelectedData.options.filter(
      (opt) => opt.id !== id
    );
    setGlobalSelectedData({ ...globalSelectedData, options: updatedOptions });
  };

  const handlePriceTypeChange = (e, index) => {
    const updatedOptions = [...globalSelectedData.options];
    updatedOptions[index].priceType = e.target.value;
    setGlobalSelectedData({ ...globalSelectedData, options: updatedOptions });
  };

  let [faqs1, setFaqs1] = useState(false);

  let faqsClicked = () => {
    setFaqs1(!faqs1);
  };

  const [pages, setPages] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [isOpens, setIsOpens] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(
          "http://147.93.45.171:1600/pagesdatafaqs"
        );
        setPages(
          data.filter((p) => p.status === "published" || p.status === "default")
        );
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpens(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (id) =>
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );

  const headerText = selectedIds.length
    ? pages
        .filter((p) => selectedIds.includes(p.id))
        .map((p) => p.question)
        .join(", ")
    : "Select FAQs";

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
          `http://147.93.45.171:1600/productpagedata?search=${search}`
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

  useEffect(() => {
    if (search1.trim() === "") {
      setProducts1([]);
      return;
    }

    const alldata1 = async () => {
      try {
        setLoading1(true);
        const response = await axios.get(
          `http://147.93.45.171:1600/productpagedata?search=${search}`
        );
        setProducts1(response.data);
      } catch (error) {
        setError1("Failed to fetch products");
        console.error(error);
      } finally {
        setLoading1(false);
      }
    };
    alldata1();
  }, [search1]);

  const [collections, setCollections] = useState([]);
  const [selectedCollections, setSelectedCollections] = useState([]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/collectionsdata"
        );
        setCollections(response.data);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    fetchCollections();
  }, []);

  const handleCheckboxChangeCollections = (collectionName) => {
    if (selectedCollections.includes(collectionName)) {
      setSelectedCollections((prevSelected) =>
        prevSelected.filter((name) => name !== collectionName)
      );
    } else {
      setSelectedCollections((prevSelected) => [
        ...prevSelected,
        collectionName,
      ]);
    }
  };

  const [labels, setLabels] = useState([]);
  const [selectedLabels, setSelectedLabels] = useState([]);

  useEffect(() => {
    const labelsdata = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/productlabelsdata"
        );
        setLabels(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("error", error);
      }
    };
    labelsdata();
  }, []);

  const handleCheckboxChange = (label) => {
    setSelectedLabels((prevState) => {
      if (prevState.includes(label)) {
        return prevState.filter((item) => item !== label);
      } else {
        return [...prevState, label];
      }
    });
  };

  let [brands, setBrands] = useState([]);

  useEffect(() => {
    let brandsdata = async () => {
      try {
        let response = await axios.get("http://147.93.45.171:1600/brandsdata");
        setBrands(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    brandsdata();
  }, []);

  return (
    <>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        />

        <title>New physical product | RxLYTE</title>

        <link
          rel="shortcut icon"
          href="http://demo.webriefly.com/assets/Tonic.svg"
          type="image/svg+xml"
        />
        <meta
          property="og:image"
          content="http://demo.webriefly.com/assets/Tonic.svg"
        />

        <meta
          name="description"
          content="Copyright 2025 © RxLYTE. All rights reserved."
        />
        <meta
          property="og:description"
          content="Copyright 2025 © RxLYTE. All rights reserved."
        />
        <meta property="og:title" content="New physical product | RxLYTE" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="http://demo.webriefly.com/" />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="http://demo.webriefly.com/" />
      </Helmet>

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
            <Link to="/admin/welcome">
              <img
                src={
                  LogoData
                    ? `http://147.93.45.171:1600/src/image/${LogoData.logo_url}`
                    : Logo
                }
                alt="RxLYTE"
                className="hamburger1 ms-3 mt-2 pt-0 pt-lg-1"
                height={LogoData ? LogoData.logo_height : "50"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = Logo;
                }}
              />
            </Link>
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
                className="icon icon-left svg-icon-ti-ti-world me-1 mt- text-lig"
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
              <span className="text-light ps-1 fs-6 cart-cart">
                View website
              </span>
            </Link>
          </div>

          <FontAwesomeIcon
            icon={faMoon}
            className="text-light fs-4 search-box"
          />
          <FontAwesomeIcon
            icon={faBell}
            className="text-light fs-4 search-box"
          />
          <FontAwesomeIcon
            icon={faEnvelope}
            className="text-light fs-4 search-box"
          />
          <div className="d-flex flex-column ms-1">
            <span className="text-light count-value1 d-lg-block d-none">
              {count5}
            </span>
            <Link to="/admin/ecommerce/orders">
              <img
                src={Shopping}
                alt="Shopping"
                className="search-box search-box1"
              />
            </Link>
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
                  className="icon svg-icon-ti-ti-home me-2 mb-1"
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
                  className="icon  svg-icon-ti-ti-shopping-bag me-2 mb-1"
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
                        className="icon  svg-icon-ti-ti-report-analytics me-2"
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
                        className="icon  svg-icon-ti-ti-truck-delivery me-2"
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
                        className="icon  svg-icon-ti-ti-basket-cancel me-2"
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
                        className="icon  svg-icon-ti-ti-basket-down me-2"
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
                        className="icon  svg-icon-ti-ti-truck-loading me-2"
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
                        className="icon  svg-icon-ti-ti-file-invoice me-2"
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
                        className="icon  svg-icon-ti-ti-package me-2"
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
                        className="icon  svg-icon-ti-ti-currency-dollar me-2"
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
                        className="icon  svg-icon-ti-ti-home-check me-2"
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
                        className="icon  svg-icon-ti-ti-archive me-2"
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
                        className="icon  svg-icon-ti-ti-tag me-2"
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
                        className="icon  svg-icon-ti-ti-album me-2"
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
                        className="icon  svg-icon-ti-ti-database me-2"
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
                        className="icon  svg-icon-ti-ti-album me-2"
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
                        className="icon  svg-icon-ti-ti-tags me-2"
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
                        className="icon  svg-icon-ti-ti-registered me-2"
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
                        className="icon  svg-icon-ti-ti-star me-2"
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
                      Reviews
                    </li>
                  </Link>

                  <Link
                    to="/admin/ecommerce/flash-sales"
                    className="text-light text-decoration-none"
                  >
                    <li>
                      <svg
                        className="icon  svg-icon-ti-ti-bolt me-2"
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
                        className="icon  svg-icon-ti-ti-discount me-2"
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
                        className="icon  svg-icon-ti-ti-users me-2"
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
                  className="icon  svg-icon-ti-ti-table-options ms-0 me-1"
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
                        className="icon  svg-icon-ti-ti-point me-2"
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
                        className="icon  svg-icon-ti-ti-point me-1"
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
                        className="icon  svg-icon-ti-ti-point me-2"
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
                className="icon svg-icon-ti-ti-notebook me-2 mb-1"
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
                  className="icon  svg-icon-ti-ti-article me-2 mb-1"
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
                        className="icon  svg-icon-ti-ti-file-text me-2"
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
                        className="icon  svg-icon-ti-ti-folder me-2"
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
                        className="icon  svg-icon-ti-ti-tag me-2"
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
                  className="icon svg-icon-ti-ti-credit-card me-2 mb-1"
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
                      Payment Methods
                    </li>
                  </Link>
                </div>
              )}
            </div>
            <li>
              <Link to="/admin/galleries" className="text-light">
                <svg
                  className="icon svg-icon-ti-ti-camera me-2 mb-1"
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
                  className="icon svg-icon-ti-ti-user-star me-2 mb-1"
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
                  className="icon  svg-icon-ti-ti-ad-circle me-2 mb-1"
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
                        className="icon  svg-icon-ti-ti-point me-2"
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
                    to="/admin/settings/ads"
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
                  className="icon svg-icon-ti-ti-speakerphone me-2 mb-1"
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
                  className="icon svg-icon-ti-ti-mail me-2 mb-1"
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
                  className="icon svg-icon-ti-ti-slideshow me-2 mb-1"
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
                        className="icon  svg-icon-ti-ti-list-check me-2"
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
                        className="icon  svg-icon-ti-ti-folder me-2"
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
                  className="icon svg-icon-ti-ti-mail me-2 mb-1"
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

            <div>
              <li onClick={appearence} style={{ cursor: "pointer" }}>
                <svg
                  className="icon svg-icon-ti-ti-brush me-2 mb-1"
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
                        className="icon  svg-icon-ti-ti-palette me-2"
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
                        className="icon  svg-icon-ti-ti-tournament me-2"
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
                        className="icon  svg-icon-ti-ti-layout me-2"
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
                        className="icon  svg-icon-ti-ti-list-tree me-2"
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
                        className="icon  svg-icon-ti-ti-file-type-css me-2"
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
                        className="icon  svg-icon-ti-ti-file-type-js me-2"
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
                        className="icon  svg-icon-ti-ti-file-type-html me-2"
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
                        className="icon  svg-icon-ti-ti-file-type-txt me-2"
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
                className="icon svg-icon-ti-ti-plug me-2 mb-1"
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
                className="icon svg-icon-ti-ti-tool me-2 mb-1"
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
                  className="icon svg-icon-ti-ti-settings me-2 mb-1"
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
                  className="icon svg-icon-ti-ti-user-shield me-2 mb-1"
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

          <li className="breadcrumb-item fw-medium ms-0">
            <Link to="/admin/ecommerce/products">PRODUCTS</Link>
          </li>

          <li className="breadcrumb-item fw-medium ms-2 text-dark">
            NEW PRODUCT
          </li>
        </ol>
      </nav>

      <div className="container-fluid">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-12 border rounded py-3 testimonial-page name-truck1 text-start me-3 me-md-0 me-lg-0 cart-cart">
              <svg
                className="icon alert-icon svg-icon-ti-ti-info-circle me-2 editor-page"
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
              You are editing{" "}
              <strong className="ms-0 me-1 fw-medium">"English"</strong> version
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        <div className="container">
          <div className="row d-flex flex-row flex-xxl-nowrap flex-xl-nowrap gap-3 w-100 ms-md-1">
            <div className="col-12 col-lg-8 border rounded customer-page customer-page2 cart-cart">
              <form>
                <div className="d-flex flex-row gap-2 name-form text-start flex-wrap flex-md-nowrap flex-lg-nowrap flex-sm-nowrap">
                  <div className="d-flex flex-column mb-3 mt-3 w-100">
                    <label htmlFor="">Name</label>
                    <input
                      type="text"
                      className="form-control py-4 mt-2"
                      id="name-create1"
                      placeholder="Name"
                      name="name"
                      value={name}
                      onChange={onInputChange}
                    />
                    {errors.name && (
                      <small className="text-danger text-start cart-cart mt-1">
                        {errors.name}
                      </small>
                    )}
                  </div>
                </div>

                <div className="d-flex flex-row gap-2 name-form text-start flex-wrap flex-lg-nowrap flex-md-nowrap flex-sm-nowrap">
                  <div className="d-flex flex-column mb-3 mt-lg-1 w-100">
                    <label htmlFor="">Permalink</label>
                    <input
                      type="text"
                      className="form-control mt-2 py-4"
                      name="permalink"
                      value={permalink}
                      onChange={onInputChange}
                    />
                    {errors.permalink && (
                      <small className="text-danger text-start cart-cart mt-1">
                        {errors.permalink}
                      </small>
                    )}
                  </div>
                </div>

                <div className="mb-3 text-start">
                  <label htmlFor="descEditor" className="form-label fw-lighter">
                    Description
                  </label>
                  <div className="d-flex gap-2 flex-row">
                    <button
                      className="btn bg-body border d-flex py-4 mb-2"
                      onClick={showEditorClicked2}
                    >
                      Show/Hide Editor
                    </button>
                    <button
                      className="btn bg-body border d-flex py-4 mb-2 flex-row align-items-center"
                      onClick={(e) => mediaUpload(e, "desc")}
                    >
                      <FontAwesomeIcon icon={faImage} className="me-2" />
                      Add Media
                    </button>
                  </div>
                  {showEdit2 ? (
                    <div className="mb-3">
                      <CKEditor
                        editor={ClassicEditor}
                        onReady={(editor) => handleEditorReady(editor, "desc")}
                        data={editorData2}
                        onChange={handleEditorChange2}
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
                        id="descEditor"
                        className="form-control"
                        placeholder="Short description"
                        name="description"
                        value={stripHtml(editorData2)}
                        onChange={handleTextAreaChange2}
                        style={{ height: "110px" }}
                      />
                    </div>
                  )}
                  {errors.description && (
                    <small className="text-danger text-start cart-cart">
                      {errors.description}
                    </small>
                  )}
                </div>

                <div className="d-flex flex-row gap-2 name-form text-start flex-wrap flex-lg-nowrap flex-md-nowrap flex-sm-nowrap">
                  <div className="d-flex flex-column mb-0 mt-lg-0 w-100 overflow-hidden">
                    <label htmlFor="contentEditor" className="form-label">
                      Content
                    </label>
                    <div className="d-flex gap-2 flex-row mt-2">
                      <button
                        className="btn bg-body border d-flex py-4 mb-2"
                        onClick={showEditorClicked1}
                      >
                        Show/Hide Editor
                      </button>
                      <button
                        className="btn bg-body border d-flex py-4 mb-2 flex-row align-items-center"
                        onClick={(e) => mediaUpload(e, "content")}
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
                    {showEdit1 ? (
                      <div className="mb-3">
                        <CKEditor
                          editor={ClassicEditor}
                          onReady={(editor) =>
                            handleEditorReady(editor, "content")
                          }
                          data={editorData1}
                          onChange={handleEditorChange1}
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
                          id="contentEditor"
                          className="form-control"
                          placeholder="Short description"
                          value={editorData1}
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
                  <div className="d-flex flex-column mb-3 mt-lg-0 w-100">
                    <label htmlFor=""> Start date</label>
                    <input
                      type="date"
                      className="form-control mt-2 py-4"
                      name="date"
                      value={date}
                      onChange={onInputChange}
                    />
                    {errors.date && (
                      <small className="text-danger text-start cart-cart mt-1">
                        {errors.date}
                      </small>
                    )}
                  </div>
                </div>

                <div className="card tags-seo mb-3 mt-2">
                  <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-lg-center align-items-start">
                    <div className="w-100">
                      <h5 className="card-title1 mt-2 text-start">
                        Specification Table
                      </h5>

                      <Link
                        to="#"
                        className="link-primary1 primary2 meta float-end"
                      >
                        <select
                          className="w-100 rounded-1 py-2 mt-2 mt-lg-0 border general-space"
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

                      <div className="border w-100 mt-4 mb-3"></div>

                      {selectedSpec === "None" && (
                        <p className="card-text text-dark text-start">
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
                                <select
                                  className="input-attribute py- form-select"
                                  style={{ height: "49px" }}
                                >
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

                <div className="card mt-4 ms-0 create-tags1">
                  <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <div className="w-100">
                      <h5 className="card-title1 text-start">Overview</h5>
                      <Link
                        to="#"
                        className="link-primary1 primary2 meta float-end"
                      ></Link>
                      <div className="border w-100 mt-3 mb-3"></div>
                      <div className="d-flex mb-4 text-start">
                        <div className="me-2 flex-fill mt-3 mt-md-0 mt-lg-0 ms-0 ms-lg-0 sku-overview1">
                          <label htmlFor="coupon-type" className="form-label">
                            SKU
                          </label>
                          <input
                            type="text"
                            className="form-control py-4 product-att1"
                            name="sku"
                            value={sku}
                            onChange={onInputChange}
                          />
                          {errors.sku && (
                            <small className="text-danger text-start cart-cart">
                              {errors.sku}
                            </small>
                          )}
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
                          {errors.price && (
                            <small className="text-danger text-start cart-cart">
                              {errors.price}
                            </small>
                          )}
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
                          {errors.price_sale && (
                            <small className="text-danger text-start cart-cart">
                              {errors.price_sale}
                            </small>
                          )}
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
                          {errors.cost && (
                            <small className="text-danger text-start cart-cart">
                              {errors.cost}
                            </small>
                          )}
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
                          {errors.barcode && (
                            <small className="text-danger text-start cart-cart">
                              {errors.barcode}
                            </small>
                          )}
                        </div>
                      </div>

                      <div className="border rounded bg-light mt-3 text-start">
                        <label className="ms-3 mt-3">Stock status</label>
                        <div className="d-flex ms-3 mt-2 gap-2 mb-3 stock-radio flex-row flex-wrap">
                          <div className="d-flex align-items-center flex-row">
                            <input
                              id="in-stock"
                              type="radio"
                              className="form-check-input"
                              name="stockstatus"
                              value="In stock"
                              onChange={onInputChange}
                              checked={stockstatus === "In stock"}
                            />
                            <label htmlFor="in-stock" className="ms-1">
                              In stock
                            </label>
                          </div>
                          <div className="d-flex align-items-center flex-row">
                            <input
                              id="out-of-stock"
                              type="radio"
                              className="form-check-input ms-2"
                              name="stockstatus"
                              value="out_of_stock"
                              onChange={onInputChange}
                              checked={stockstatus === "out_of_stock"}
                            />
                            <label htmlFor="out-of-stock" className="ms-1">
                              Out of stock
                            </label>
                          </div>
                          <div className="d-flex align-items-center flex-row">
                            <input
                              id="backorder"
                              type="radio"
                              className="form-check-input ms-2"
                              name="stockstatus"
                              value="backorder"
                              onChange={onInputChange}
                              checked={stockstatus === "backorder"}
                            />
                            <label htmlFor="backorder" className="ms-1">
                              on backorder
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="border rounded mt-3 cart-cart bg-light text-start">
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
                            {errors.weight && (
                              <small className="text-danger text-start cart-cart">
                                {errors.weight}
                              </small>
                            )}
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
                            {errors.length && (
                              <small className="text-danger text-start cart-cart">
                                {errors.length}
                              </small>
                            )}
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
                            {errors.wide && (
                              <small className="text-danger text-start cart-cart">
                                {errors.wide}
                              </small>
                            )}
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
                            {errors.height && (
                              <small className="text-danger text-start cart-cart">
                                {errors.height}
                              </small>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border ms-1 rounded mt-3 mb-3 cart-cart bg-body d-flex flex-column w-100">
                  <div className="d-flex w-100 flex-row flex-nowrap justify-content-evenly">
                    <label className="fw-medium cart-cart ms-4 mt-lg-3 mb-3 mt-4 flex-grow-1 attribute-produc text-start">
                      Attributes
                    </label>

                    <button
                      className="btn border py-4 d-flex mt-4 mt-lg-1 mt-md-2 mb-1 me-2 cart-cart"
                      onClick={addAttribute}
                    >
                      {attributes ? "Cancel" : "Add new attributes"}
                    </button>
                  </div>

                  <div className="border w-100 mt-3 mt-lg-0 mb-1"></div>

                  <div className="mt-1 mb-3 me-4 ms-3 ms-lg-2 text-start">
                    Adding new attributes helps the product to have many
                    options, such as size or color.
                  </div>

                  {attributes && (
                    <>
                      <div className="border bg-light mb-2 ms-2 me-2 rounded product-att">
                        {more.map((attribute, index) => {
                          const selectedAttr = create.find(
                            (attr) => attr.id === Number(attribute.attributeId)
                          );
                          const selectedAttributeIds = more.map(
                            (item) => item.attributeId
                          );
                          const selectedValuesMap = {};
                          more.forEach((item) => {
                            if (item.attributeId) {
                              if (!selectedValuesMap[item.attributeId]) {
                                selectedValuesMap[item.attributeId] = [];
                              }
                              if (item.attributeValue) {
                                selectedValuesMap[item.attributeId].push(
                                  item.attributeValue
                                );
                              }
                            }
                          });

                          return (
                            <div
                              className="attribute-row mb-3 mt-3"
                              key={index}
                            >
                              <div className="attribute-name">
                                <label className="ms-2 mt-2 text-start">
                                  Attribute Name
                                </label>
                                <select
                                  className="form-select product-att2 mt-2 ms-2 mb-2"
                                  style={{ height: "45px" }}
                                  value={attribute.attributeId}
                                  onChange={(e) => {
                                    const newMore = [...more];
                                    newMore[index].attributeId = e.target.value;
                                    newMore[index].attributeValue = "";
                                    setMore(newMore);
                                  }}
                                >
                                  <option value="">Select attribute</option>
                                  {create.map((item) => (
                                    <option
                                      key={item.id}
                                      value={item.id}
                                      disabled={
                                        selectedAttributeIds.includes(
                                          String(item.id)
                                        ) &&
                                        String(item.id) !==
                                          String(attribute.attributeId)
                                      }
                                    >
                                      {item.title}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="attribute-value">
                                <label className="ms-0 ms-lg-2 ms-2 mt-2">
                                  Value
                                </label>
                                <select
                                  className="form-select product-att2 mt-2 ms-2 mb-2"
                                  style={{ height: "45px" }}
                                  value={attribute.attributeValue}
                                  onChange={(e) => {
                                    const newMore = [...more];
                                    newMore[index].attributeValue =
                                      e.target.value;
                                    setMore(newMore);
                                  }}
                                >
                                  <option value="">Select value</option>
                                  {selectedAttr?.options.map((opt, i) => (
                                    <option
                                      key={i}
                                      value={opt.title}
                                      disabled={
                                        selectedValuesMap[
                                          attribute.attributeId
                                        ]?.includes(opt.title) &&
                                        attribute.attributeValue !== opt.title
                                      }
                                    >
                                      {opt.title}
                                    </option>
                                  ))}
                                </select>

                                <div className="attribute-remove">
                                  <FontAwesomeIcon
                                    icon={faTrashCan}
                                    className="bg-danger px-2 py-2 rounded text-light"
                                    onClick={() => deleteItem(index)}
                                    style={{ cursor: "pointer" }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        <button
                          className="btn btn-transparent border mb-2 d-flex py-4 ms-2 mt-0 bg-body mb-3"
                          style={{ maxWidth: "200px" }}
                          onClick={(e) => {
                            e.preventDefault();
                            if (more.length < create.length) {
                              setMore([
                                ...more,
                                { attributeId: "", attributeValue: "" },
                              ]);
                            }
                          }}
                        >
                          Add more attribute
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="border ms-1 rounded mt-3 cart-cart bg-body text-start attribute-product d-flex flex-column mb-3">
                  <div className="d-flex w-100">
                    <label className="fw-medium cart-cart ms-3 mt-3 mb-3 flex-grow-1">
                      Product options
                    </label>
                  </div>
                  <div className="border w-100 mt-0 mb-1" />

                  {options.map((option, index) => (
                    <div
                      className="index-clicked mb-1 pb-3 ms-1 border bg-light p-2 rounded"
                      key={option.id}
                    >
                      <span className="fw-bold">#{index + 1}</span>

                      <div className="row gx-2 gy-0 align-items-center mt-2 d-flex flex-row flex-lg-nowrap flex-md-nowrap flex-wrap">
                        <div className="col-12 col-lg-3 text-start index-clicked1">
                          <label
                            htmlFor={`idx-name-${option.id}`}
                            className="form-label"
                          >
                            Name
                          </label>
                          <input
                            id={`idx-name-${option.id}`}
                            type="text"
                            className="form-control py-4"
                            placeholder="Name"
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

                        <div className="col-12 col-lg-3 text-start index-clicked1">
                          <label
                            htmlFor={`idx-type-${option.id}`}
                            className="form-label"
                          >
                            Type
                          </label>
                          <select
                            id={`idx-type-${option.id}`}
                            className="form-select w-100"
                            style={{ height: "49px" }}
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
                            <option value="Text" disabled>
                              Text
                            </option>
                            <option value="Field">Field</option>
                            <option value="Select" disabled>
                              Select
                            </option>
                            <option value="Dropdown">Dropdown</option>
                            <option value="Checkbox">Checkbox</option>
                            <option value="RadioButton">RadioButton</option>
                          </select>
                        </div>

                        <div className="row d-flex flex-row flex-nowrap justify-content-start align-items-start">
                          <div className="col-6 col-lg-3 d-flex mt-lg-4 mt-0">
                            <div className="form-check">
                              <input
                                id={`idx-required-${option.id}`}
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
                              <label
                                htmlFor={`idx-required-${option.id}`}
                                className="form-check-label ms-1"
                              >
                                Is required?
                              </label>
                            </div>
                          </div>

                          <div className="col-6 col-lg-3 d-flex justify-content-lg-start mt-lg-4 px-0 gap-0 justify-content-start ms-lg-0 trash-can">
                            <button
                              className="btn btn-danger trash-delete"
                              onClick={() => deleteOptions(option.id)}
                            >
                              <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="w-100 me-3 mt-2">
                        {extendedTypes.includes(option.type) ? (
                          <>
                            <table className="table table-striped table-bordered table-lable1">
                              <thead className="bg-body">
                                <tr>
                                  <th className="fw-light text-dark ps-3 py-2">
                                    #
                                  </th>
                                  <th className="fw-light text-dark ps-2">
                                    LABEL
                                  </th>
                                  <th className="fw-light text-dark ps-2">
                                    PRICE
                                  </th>
                                  <th className="fw-light text-dark">
                                    PRICE TYPE
                                  </th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                {option.rows.map((row) => (
                                  <tr key={row.id}>
                                    <td className="d-flex gap-1 py-4">
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
                                            option.id,
                                            row.id,
                                            "label",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </td>
                                    <td>
                                      <input
                                        type="number"
                                        className="form-control py-4"
                                        placeholder="Please fill affect price"
                                        value={row.price}
                                        onChange={(e) =>
                                          handleChanges(
                                            option.id,
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
                                          height: "47px",
                                          cursor: "pointer",
                                          zIndex: 1000,
                                          position: "relative",
                                        }}
                                        value={row.priceType}
                                        onChange={(e) =>
                                          handleChanges(
                                            option.id,
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
                                        onClick={() =>
                                          handleDeleteRow(option.id, row.id)
                                        }
                                      >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <button
                              className="mb-3 ms-1 mt-3 py-3 btn btn-secondary d-flex"
                              onClick={(e) => handleAddRow(option.id, e)}
                            >
                              Add new row
                            </button>
                          </>
                        ) : option.type === "Field" ||
                          option.type === "Text" ? (
                          <>
                            <table className="table table-striped table-bordered table-lable1 w-100">
                              <thead className="bg-body">
                                <tr>
                                  <th className="fw-light text-dark ps-2">
                                    PRICE
                                  </th>
                                  <th className="fw-light text-dark">
                                    PRICE TYPE
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {option.priceRows.map((row) => (
                                  <tr key={row.id}>
                                    <td>
                                      <input
                                        type="text"
                                        className="form-control py-4 cart-cart"
                                        placeholder="Please fill affect price"
                                        value={row.price}
                                        onChange={(e) =>
                                          handlePriceChange(
                                            option.id,
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
                                          height: "50px",
                                          cursor: "pointer",
                                          zIndex: 1000,
                                          position: "relative",
                                        }}
                                        value={row.priceType}
                                        onChange={(e) =>
                                          handlePriceChange(
                                            option.id,
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
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            <button
                              className="mb-3 ms-1 mt-3 py-3 btn btn-secondary d-flex cart-cart"
                              onClick={(e) => handleAddPrice(option.id, e)}
                            >
                              Add new row
                            </button>
                          </>
                        ) : (
                          <p className="ms-3 text-start"></p>
                        )}
                      </div>
                    </div>
                  ))}

                  {click && globalSelectedData && (
                    <div className="index-clicked mb-1 pb-3 ms-1 border bg-light p-2 rounded">
                      <span className="fw-bold">
                        #{globalSelectedData.name}
                      </span>

                      <div className="row gx-2 align-items-center mt-2 d-flex flex-row flex-lg-nowrap flex-md-nowrap">
                        <div className="col-12 col-lg-3 index-clicked1 text-start">
                          <label htmlFor="idx-name" className="form-label">
                            Name
                          </label>
                          <input
                            id="idx-name"
                            type="text"
                            className="form-control py-4"
                            defaultValue={globalSelectedData.name}
                          />
                        </div>

                        <div className="col-12 col-lg-3 mt-3 mt-lg-0 index-clicked1 text-start">
                          <label htmlFor="idx-type" className="form-label">
                            Type
                          </label>
                          <select
                            id="idx-type"
                            className="form-select w-100"
                            style={{ height: "49px" }}
                            defaultValue={globalSelectedData.status}
                            onChange={(e) =>
                              setGlobalSelectedData({
                                ...globalSelectedData,
                                status: e.target.value,
                              })
                            }
                          >
                            <option value="">Please select option</option>
                            <option value="Text" disabled>
                              Text
                            </option>
                            <option value="Field">Field</option>
                            <option value="Select" disabled>
                              Select
                            </option>
                            <option value="Dropdown">Dropdown</option>
                            <option value="Checkbox">Checkbox</option>
                            <option value="RadioButton">RadioButton</option>
                          </select>
                        </div>

                        <div className="row d-flex flex-row flex-nowrap">
                          <div className="col-6 col-lg-3 d-flex mt-lg-4 mt-0">
                            <div className="form-check">
                              <input
                                id="idx-required"
                                type="checkbox"
                                className="form-check-input"
                              />
                              <label
                                htmlFor="idx-required"
                                className="form-check-label ms-1"
                              >
                                Is required?
                              </label>
                            </div>
                          </div>

                          <div className="col-6 col-lg-3 d-flex justify-content-lg-start mt-lg-4 px-0 gap-0 justify-content-start ms-2 ms-lg-0 trash-can">
                            <button
                              className="btn btn-danger trash-delete"
                              onClick={trashDelete}
                            >
                              <FontAwesomeIcon icon={faTrashCan} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {["Dropdown", "Checkbox", "RadioButton"].includes(
                        globalSelectedData.status
                      ) && (
                        <>
                          <table className="table table-striped table-bordered table-lable1 mt-3">
                            <thead className="bg-body">
                              <tr>
                                <th className="fw-light text-dark ps-3 py-2">
                                  #
                                </th>
                                <th className="fw-light text-dark ps-2">
                                  LABEL
                                </th>
                                <th className="fw-light text-dark ps-2">
                                  PRICE
                                </th>
                                <th className="fw-light text-dark">
                                  PRICE TYPE
                                </th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {globalSelectedData.options.map((opt, index) => (
                                <tr key={opt.id}>
                                  <td className="d-flex gap-1 py-4">
                                    <FontAwesomeIcon icon={faArrowUp} />
                                    <FontAwesomeIcon icon={faArrowDown} />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control py-4"
                                      defaultValue={opt.label}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control py-4"
                                      value={opt.price}
                                      onChange={(e) =>
                                        handlePriceChange(e, index)
                                      }
                                    />
                                  </td>
                                  <td>
                                    <select
                                      className="form-select"
                                      style={{
                                        height: "47px",
                                        cursor: "pointer",
                                        zIndex: 1000,
                                        position: "relative",
                                      }}
                                      value={opt.priceType}
                                      onChange={(e) =>
                                        handlePriceTypeChange(e, index)
                                      }
                                    >
                                      <option value="fixed">Fixed</option>
                                      <option value="percent">Percent</option>
                                    </select>
                                  </td>
                                  <td>
                                    <button
                                      className="btn bg-body border px-2 py-3 d-flex p-2"
                                      onClick={() => deleteRow(opt.id)}
                                      style={{
                                        cursor: "pointer",
                                        zIndex: 1000,
                                        position: "relative",
                                      }}
                                    >
                                      <FontAwesomeIcon icon={faTrashCan} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          <button
                            className="btn btn-success d-flex"
                            onClick={addNewRow}
                          >
                            Add new row
                          </button>
                        </>
                      )}

                      {globalSelectedData.status === "Field" && (
                        <>
                          <table className="table table-striped table-bordered table-lable1 w-100 mt-3">
                            <thead className="bg-body">
                              <tr>
                                <th className="fw-light text-dark ps-2">
                                  PRICE
                                </th>
                                <th className="fw-light text-dark">
                                  PRICE TYPE
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {globalSelectedData.options.map((opt, index) => (
                                <tr key={opt.id}>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control py-4 cart-cart"
                                      placeholder="Please fill affect price"
                                    />
                                  </td>
                                  <td>
                                    <select
                                      className="form-select"
                                      style={{
                                        height: "47px",
                                        cursor: "pointer",
                                        zIndex: 1000,
                                        position: "relative",
                                      }}
                                    >
                                      <option value="fixed">Fixed</option>
                                      <option value="percent">Percent</option>
                                    </select>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <button
                            className="btn btn-success d-flex cart-cart"
                            onClick={addNewRowClicked}
                          >
                            Add New Row
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  <div className="d-flex flex-row gap-2 justify-content-start align-items-start w-100 flex-wrap">
                    <button
                      className="btn bg-body border py-4 d-flex add-optionx ms-2 ms-lg-2 ms-md-3"
                      onClick={addOptions}
                    >
                      Add new option
                    </button>

                    <div className="d-flex flex-row flex-md-row align-items-start mb-2 ms-2 ms-md-2">
                      <select
                        className="form-select globally-add1x"
                        style={{
                          zIndex: "100",
                          height: "50px",
                          width: "210px",
                        }}
                        onChange={(e) => setSelectedOption(e.target.value)}
                      >
                        <option value="">Select Global Option</option>
                        {Array.isArray(global) &&
                          global.map((globalItem) => (
                            <option key={globalItem.id} value={globalItem.name}>
                              {globalItem.name}
                            </option>
                          ))}
                      </select>

                      <button
                        className="btn bg-body border py-4 ms-md-2 ms-2 d-flex globally-addx"
                        style={{ whiteSpace: "nowrap", zIndex: "100" }}
                        onClick={globalOptionsClicked}
                      >
                        Add Global Option
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border ms-1 rounded mt-3 cart-cart bg-body attribute-product d-flex flex-column mb-3">
                  <div className="d-flex w-100 text-start">
                    <label
                      htmlFor=""
                      className="fw-medium cart-cart ms-2 mt-3 mb-3 flex-grow-1"
                    >
                      Related Products
                    </label>
                  </div>
                  <div className="border w-100 mt-0 mb-3"></div>
                  <input
                    type="text"
                    className="form-control mb-0 py-4 me-3 ms-3 search-create"
                    placeholder="Search products"
                    name="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  {loading && <p>Loading...</p>}
                  {error && <p>{error}</p>}

                  <div className="product-list">
                    {products.length > 0 ? (
                      products.slice(0, 5).map((product) => {
                        const imageUrl = `http://147.93.45.171:1600/src/image/${product.image}`;
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
                                alt="RxLYTE"
                                onError={(e) =>
                                  (e.target.src =
                                    "http://147.93.45.171:1600/path/to/fallback-image.jpg")
                                }
                                className="product-image img-thumbnail mt-2 ms-2 mb-2"
                              />
                              <h6 className="product-name text-start d-flex flex-row mt-0 ms-2 pt-2">
                                {product.name}
                              </h6>
                              <span className="product-price mt-4 ms-12 pt-2 text-end me-2 sales-font">
                                {product.price}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <span className="mt-2 ms-2"></span>
                    )}
                  </div>
                </div>

                <div className="border ms-1 rounded mt-3 cart-cart bg-body attribute-product d-flex flex-column mb-3 text-start">
                  <div className="d-flex w-100">
                    <label
                      htmlFor=""
                      className="fw-medium cart-cart ms-2 mt-3 mb-3 flex-grow-1"
                    >
                      Cross-selling products
                    </label>
                  </div>
                  <div className="border w-100 mt-0 mb-3"></div>
                  <input
                    type="text"
                    className="form-control mb-0 py-4 me-3 ms-3 search-create"
                    placeholder="Search products"
                    name="search1"
                    value={search1}
                    onChange={(e) => setSearch1(e.target.value)}
                  />
                  {loading1 && <p>Loading...</p>}
                  {error1 && <p>{error1}</p>}

                  <div className="product-list">
                    {products1.length > 0 ? (
                      products1.slice(0, 5).map((product2) => {
                        const imageUrl = `http://147.93.45.171:1600/src/image/${product2.image}`;
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
                                alt="RxLYTE"
                                onError={(e) =>
                                  (e.target.src =
                                    "http://147.93.45.171:1600/path/to/fallback-image.jpg")
                                }
                                className="product-image img-thumbnail mt-2 ms-2 mb-2"
                              />
                              <h6 className="product-name text-start d-flex flex-row mt-1 ms-2 pt-2">
                                {product2.name}
                              </h6>
                              <p className="product-price mt-4 ms-2 pt-2 text-end me-2 sales-font">
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

                <div className="border ms-1 rounded mt-3 cart-cart bg-body attribute-product d-flex flex-column  mb-3 text-start">
                  <div className="d-flex w-100">
                    <label
                      htmlFor=""
                      className="fw-medium cart-cart ms-4 mt-3 mb-3 flex-grow-1"
                    >
                      Product FAQs
                    </label>
                  </div>
                  <div className="border w-100 mt-0 mb-3"></div>

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
                    className="me-auto ms-4 mb-3 btn bg-light border d-flex py-3 px-3 z-3"
                    onClick={addProduct}
                  >
                    Add new
                  </button>

                  <div className="d-flex w-100 flex-column">
                    <span className="ms-4">
                      or{" "}
                      <span
                        className="text-success select-faqs"
                        onClick={faqsClicked}
                      >
                        Select from existing FAQs
                      </span>
                    </span>
                    {faqs1 && (
                      <>
                        <div
                          ref={containerRef}
                          className="ms-4 mt-2 mb-3 position-relative w-100"
                        >
                          <div
                            className="form-select form-faqs1 overflow-y-hidde h-auto"
                            style={{ cursor: "pointer", padding: "8px" }}
                            onClick={() => setIsOpens((open) => !open)}
                          >
                            {headerText}
                          </div>

                          {isOpens && (
                            <div
                              className="border bg-white p-2 position-absolute form-faqs1"
                              style={{
                                maxHeight: 200,
                                overflowY: "auto",
                                zIndex: 1000,
                              }}
                            >
                              {pages.map((p) => (
                                <label key={p.id} className="d-block mb-1">
                                  <input
                                    type="checkbox"
                                    name="faqs"
                                    value={p.id}
                                    checked={selectedIds.includes(p.id)}
                                    onChange={() => toggle(p.id)}
                                    className="me-2 form-check-input"
                                  />
                                  {p.question}
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="card mt-3 seo-metas1 text-start">
                  <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <div className="text-start">
                      <h5 className="card-title1">Search Engine Optimize</h5>
                      <Link
                        to="#"
                        className="link-primary1 primary2 meta float-end"
                        onClick={seodataproduct}
                        style={{ zIndex: "100" }}
                      >
                        Edit SEO meta
                      </Link>
                      <div className="border w-100 mb-2"></div>
                      <p className="card-text text-dark">
                        Setup meta title & description to make your site easy to
                        discovered on search engines such as Google
                        <div className="border w-100 mt-2"></div>
                        {seo && (
                          <>
                            <div className="mt-3">
                              <label htmlFor="">SEO Title</label>
                              <input
                                type="text"
                                className="form-control mt-2 py-4 seo-edit"
                                placeholder="SEO Title"
                              />
                            </div>

                            <div className="mt-3">
                              <label htmlFor="seo-description">
                                SEO Description
                              </label>
                              <textarea
                                id="seo-description"
                                className="form-control mt-2 seo-edit"
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
                                  className="image-placeholder position-relative"
                                  onClick={() => {
                                    if (!seoImageUrl) {
                                      document
                                        .getElementById("fileInputSeo")
                                        .click();
                                    }
                                  }}
                                >
                                  {seoImageUrl ? (
                                    <img
                                      alt="Uploaded preview"
                                      src={seoImageUrl}
                                      width="100"
                                      height="100"
                                      onClick={() =>
                                        document
                                          .getElementById("fileInputSeo")
                                          .click()
                                      }
                                    />
                                  ) : (
                                    <img
                                      src={Cutting}
                                      alt="RxLYTE"
                                      className="w-75 h-75 img-fluid"
                                      onClick={() =>
                                        document
                                          .getElementById("fileInputSeo")
                                          .click()
                                      }
                                    />
                                  )}
                                  {seoImageUrl && (
                                    <FontAwesomeIcon
                                      icon={faXmark}
                                      className="position-absolute top-0 end-0 p-1 cursor-pointer bg-light border me-1 mt-1 rounded-5 text-dark"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("Close icon clicked");
                                        handleSeoCloseClick(e);
                                      }}
                                    />
                                  )}
                                </div>

                                <input
                                  id="fileInputSeo"
                                  type="file"
                                  name="seoFile"
                                  style={{ display: "none" }}
                                  onChange={handleSeoFileChange}
                                />
                                <Link
                                  className="ms-5 text-decoration-none choose-url"
                                  to="#"
                                  onClick={() =>
                                    document
                                      .getElementById("fileInputSeo")
                                      .click()
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
                                className="form-check-input"
                                type="radio"
                                name="check"
                                id="Index"
                              />
                              <label htmlFor="Index" className="ms-2">
                                Index
                              </label>

                              <input
                                className="form-check-input ms-2"
                                type="radio"
                                value="index"
                                name="check"
                                id="No index"
                              />
                              <label htmlFor="No index" className="ms-2">
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

            <div className="col-12 col-sm-12 col-md-12 col-lg-4 d-flex flex-column gap-3 customer-page1 text-start cart-cart">
              <div className="border rounded p-3 customer-page1">
                <h5 className="mt-0 text-start">Publish</h5>
                <div className="border w-100 mt-2 mb-3"></div>
                <div className="d-flex flex-row gap-3 mb-3">
                  <button
                    type="button"
                    className="btn btn-success rounded py-4 px-3 d-flex flex-row align-items-center"
                    onClick={handleSubmit}
                  >
                    <FontAwesomeIcon icon={faSave} className="me-2" /> Save
                  </button>
                  <button className="btn btn-body border rounded py-4 px-3 d-flex flex-row align-items-center">
                    <Link
                      to="/admin/ecommerce/products"
                      className="text-decoration-none text-dark"
                    >
                      <FontAwesomeIcon icon={faSignOut} className="me-2" />
                      Save & Exit
                    </Link>
                  </button>
                </div>
              </div>

              <div className="border rounded p-3 customer-page1">
                <h4 className="mt-0 text-start">Status</h4>
                <div className="border w-100 mt-2 mb-3"></div>

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
                {errors.status && (
                  <small className="text-danger text-start cart-cart mt-1">
                    {errors.status}
                  </small>
                )}
              </div>

              <div className="border rounded p-3 customer-page1">
                <h5 className="card-title fw-lighter text-start">Store</h5>
                <div className="border w-100 mt-2 mb-3"></div>

                <select
                  className="w-100 rounded-1 py-2 border"
                  name="store"
                  value={store}
                  onChange={onInputChange}
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
                {errors.store && (
                  <small className="text-danger text-start cart-cart mt-1">
                    {errors.store}
                  </small>
                )}
              </div>

              <div className="border rounded p-3 customer-page1">
                <h5 className="card-title fw-lighter">Is featured?</h5>
                <div className="border w-100 mt-2 mb-3"></div>

                <div className="form-check form-switch mb-3">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="has-action"
                    name="featured"
                    checked={user.featured}
                    onChange={onInputChange}
                  />
                </div>
              </div>

              <div className="border rounded p-3 customer-page1">
                <h5 className="card-title fw-lighter">Categories</h5>
                <div className="border w-100 mt-2 mb-3"></div>

                <input
                  type="search"
                  className="border cart-cart1 form-control py-4"
                  placeholder="Search"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />

                <div className="d-flex flex-column text-start category-arrive mt-2">
                  {filteredCategories.map((mega) => (
                    <div key={mega.name} className="mb-3">
                      <div className="d-flex flex-row align-items-center gap-2">
                        <input
                          id={`mega-${mega.name}`}
                          type="checkbox"
                          className="form-check-input"
                          ref={(el) => (parentRefs.current[mega.name] = el)}
                          checked={!!checkedItems[mega.name]}
                          onChange={() => toggleMega(mega)}
                        />
                        <label
                          htmlFor={`mega-${mega.name}`}
                          style={{ cursor: "pointer" }}
                        >
                          {mega.name}
                        </label>
                      </div>

                      <div className="ms-3">
                        {mega.children?.map((mini) => (
                          <div key={mini.name}>
                            <div className="d-flex flex-row align-items-center gap-2 mt-2">
                              <input
                                id={`mini-${mega.name}-${mini.name}`}
                                type="checkbox"
                                className="form-check-input"
                                ref={(el) =>
                                  (parentRefs.current[
                                    `${mega.name} > ${mini.name}`
                                  ] = el)
                                }
                                checked={
                                  !!checkedItems[`${mega.name} > ${mini.name}`]
                                }
                                onChange={() => toggleMini(mega, mini)}
                              />
                              <label
                                htmlFor={`mini-${mega.name}-${mini.name}`}
                                style={{ cursor: "pointer" }}
                              >
                                {mini.name}
                              </label>
                            </div>

                            <div className="ms-4">
                              {mini.children?.map((child) => {
                                const childKey = `${mega.name} > ${mini.name} > ${child}`;
                                const childId = `child-${mega.name}-${mini.name}-${child}`;
                                return (
                                  <div
                                    key={child}
                                    className="d-flex flex-row align-items-center gap-2 mt-1"
                                  >
                                    <input
                                      id={childId}
                                      type="checkbox"
                                      className="form-check-input"
                                      checked={!!checkedItems[childKey]}
                                      onChange={() =>
                                        toggleChild(mega, mini, child)
                                      }
                                    />
                                    <label
                                      htmlFor={childId}
                                      style={{ cursor: "pointer" }}
                                    >
                                      {child}
                                    </label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border rounded p-3 customer-page1">
                <h5 className="card-title fw-lighter">Brand</h5>
                <div className="border w-100 mt-2 mb-3"></div>
                <select
                  className="w-100 rounded-1 py-2 border"
                  name="brand"
                  value={brand}
                  onChange={onInputChange}
                >
                  <option value="">Select a brand</option>
                  {Array.isArray(brands) &&
                    brands.length > 0 &&
                    brands.map((brandItem) => (
                      <option key={brandItem.id} value={brandItem.name}>
                        {brandItem.name}
                      </option>
                    ))}
                </select>
                {errors.brand && (
                  <small className="text-danger text-start cart-cart mt-1">
                    {errors.brand}
                  </small>
                )}
              </div>

              <div className="border rounded p-3 customer-page1">
                <h5>Featured image </h5>
                <div className="border w-100 mt-2 mb-3"></div>

                <div className="image-placeholder mt-2 position-relative">
                  {imageUrl ? (
                    <img
                      alt="Uploaded preview"
                      src={imageUrl}
                      width="100"
                      height="100"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    />
                  ) : (
                    <img
                      src={Cutting}
                      alt="Background"
                      className="w-100 h-100 rounded"
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    />
                  )}
                  {imageUrl && (
                    <FontAwesomeIcon
                      icon={faXmark}
                      className="position-absolute top-0 end-0 p-1 cursor-pointer bg-light border me-1 mt-1 rounded-5 text-dark"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCloseClick();
                      }}
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
                  className="ms-2 text-decoration-none choose-url"
                  to="#"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  Choose image
                </Link>
                <span className="ms-3 me-2">or</span>
                <Link
                  to="#"
                  onClick={handleAddFromUrl}
                  className="text-decoration-none choose-url"
                >
                  Add from URL
                </Link>
              </div>

              <div className="border rounded p-3 customer-page1">
                <h5>Product Collections</h5>
                <div className="border w-100 mt-2 mb-2"></div>

                {Array.isArray(collections) && collections.length > 0 ? (
                  collections.map((collection) => {
                    const checkboxId = `collection-${collection.id}`;
                    return (
                      <div
                        key={collection.id}
                        className="d-flex flex-row gap-2 mb-1 align-items-center"
                      >
                        <input
                          type="checkbox"
                          id={checkboxId}
                          className="form-check-input"
                          checked={selectedCollections.includes(
                            collection.name
                          )}
                          onChange={() =>
                            handleCheckboxChangeCollections(collection.name)
                          }
                        />
                        <label htmlFor={checkboxId}>{collection.name}</label>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-start">No collections available</p>
                )}
              </div>

              <div className="border rounded p-3 customer-page1">
                <h5>Labels</h5>
                <div className="border w-100 mt-2 mb-3"></div>

                {Array.isArray(labels) && labels.length > 0 ? (
                  labels.map((label) => (
                    <div
                      key={label.id}
                      className="d-flex flex-row gap-2 mb-1 align-items-center"
                    >
                      <input
                        id={`label-${label.id}`}
                        type="checkbox"
                        className="form-check-input"
                        checked={selectedLabels.includes(label.name)}
                        onChange={() => handleCheckboxChange(label.name)}
                      />
                      <label htmlFor={`label-${label.id}`}>{label.name}</label>
                    </div>
                  ))
                ) : (
                  <p className="text-start">No labels available</p>
                )}
              </div>

              <div className="border rounded p-3 customer-page1">
                <h5>Taxes</h5>
                <div className="border w-100 mt-2 mb-3"></div>

                <div className="d-flex d-flex flex-row gap-2 mb-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="None (0%)"
                  />
                  <label htmlFor="None (0%)">None (0%)</label>
                </div>
                <div className="d-flex d-flex flex-row gap-2 mb-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="VAT (10%)"
                  />
                  <label htmlFor="VAT (10%)">VAT (10%)</label>
                </div>
                <div className="d-flex d-flex flex-row gap-2 mb-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="Import Tax (15%)"
                  />
                  <label htmlFor="Import Tax (15%)">Import Tax (15%)</label>
                </div>
              </div>

              <div className="border rounded p-3 customer-page1">
                <h6>Minimum order quantity</h6>
                <div className="border w-100 mt-2 mb-3"></div>

                <input
                  type="number"
                  className="form-control py-4"
                  placeholder="Maximum quantity"
                  name="minimumorder"
                  value={minimumorder}
                  onChange={onInputChange}
                />
                {errors.minimumorder && (
                  <small className="text-danger text-start cart-cart mt-1">
                    {errors.minimumorder}
                  </small>
                )}
              </div>

              <div className="border rounded p-3 customer-page1 mb-0">
                <h6>Maximum order quantity</h6>
                <div className="border w-100 mt-2 mb-3"></div>

                <input
                  type="number"
                  className="form-control py-4 cart-cart"
                  placeholder="Minimum quantity"
                  name="maximumorder"
                  value={maximumorder}
                  onChange={onInputChange}
                />
                {errors.maximumorder && (
                  <small className="text-danger text-start cart-cart mt-1">
                    {errors.maximumorder}
                  </small>
                )}
              </div>

              <div className="border rounded p-3 customer-page1 mb-4">
                <h6>Tags</h6>
                <div className="border w-100 mt-2 mb-3"></div>

                <input
                  type="search"
                  className="form-control py-4 cart-cart border"
                  placeholder="Write some tags"
                  name="tags"
                  value={tags1}
                  onChange={handleInputChange1}
                  onKeyDown={handleKeyDown}
                />

                <div className="mb-0 mt-1 d-flex flex-wrap gap-2">
                  {selectedTags.map((tag, index) => (
                    <span
                      key={index}
                      className="badge-tags bg-success text-light cart-cart1 px-2 py-1 rounded-pill position-relative"
                      style={{ paddingRight: "22px" }}
                    >
                      {tag}
                      <FontAwesomeIcon
                        icon={faXmark}
                        className="position-absolute top-0 end-0 me-1 mt-0"
                        style={{
                          fontSize: "0.75rem",
                          cursor: "pointer",
                          background: "#fff",
                          color: "#dc3545",
                          borderRadius: "50%",
                          padding: "2px",
                          transform: "translate(50%, -50%)",
                        }}
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </span>
                  ))}
                </div>

                {tags1.length > 0 && filteredSuggestions.length > 0 && (
                  <ul className="list-group mt-0">
                    {filteredSuggestions.map((tag, idx) => (
                      <li
                        key={idx}
                        className="list-group-item list-group-item-action"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleAddTag(tag.name)}
                      >
                        {tag.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default ProductsCreate;
