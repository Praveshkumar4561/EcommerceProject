import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { applyTypographyStyles } from "../src/typography";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import HomePage from "./component/homepage/HomePage.jsx";
import AboutPage from "./component/aboutpage/AboutPage.jsx";
import Shop from "./component/shop/Shop.jsx";
import ProductDetail from "./component/productdetail/ProductDetail.jsx";
import Cart from "./component/cart/Cart.jsx";
import Checkout from "./component/checkout/Checkout.jsx";
import Login from "./component/login/Login.jsx";
import BlogPage from "./component/blogpage/BlogPage.jsx";
import BlogDetails from "./component/blogdetails/BlogDetails.jsx";
import Faqs from "./component/faqs/Faqs.jsx";
import ErrorPage from "./component/errorpage/ErrorPage.jsx";
import ContactUs from "./component/contactus/ContactUs.jsx";
// import AddCart from "./component/addcart/AddCart.jsx";
import User from "./User.jsx";
import Welcome from "./backend/welcome/Welcome.jsx";
import PlatForm from "./backend/platform/PlatForm.jsx";
import Settings from "./backend/settings/Settings.jsx";
import Announcement from "./backend/announcements/Announcement.jsx";
import AnnouncementCreate from "./backend/announcements/AnnouncementCreate.jsx";
import AnnouncementEdit from "./backend/announcements/AnnouncementEdit.jsx";
import Testimonial from "./backend/testimonials/Testimonial.jsx";
import TestimonialCreate from "./backend/testimonials/TestimonialCreate.jsx";
import TestimonialEdit from "./backend/testimonials/TestimonialEdit.jsx";
import Galleries from "./backend/gallery/Galleries.jsx";
import GalleryCreate from "./backend/gallery/GalleryCreate.jsx";
import GalleryEdit from "./backend/gallery/GalleryEdit.jsx";
import SimpleSliders from "./backend/simplesliders/SimpleSliders.jsx";
import SimpleSlidersCreate from "./backend/simplesliders/SimpleSlidersCreate.jsx";
import SimpleSlidersEdit from "./backend/simplesliders/SimpleSlidersEdit.jsx";
import NewsLetters from "./backend/newsletters/NewsLetters.jsx";
import ContactPage from "./backend/contact/ContactPage.jsx";
import ContactsCreate from "./backend/contact/ContactsCreate.jsx";
import ContactsEdit from "./backend/contact/ContactEdit.jsx";
import Pages from "./backend/pagespage/Pages.jsx";
import PagesCreate from "./backend/pagespage/PagesCreate.jsx";
import PagesEdit from "./backend/pagespage/PagesEdit.jsx";
import FaqBack from "./backend/faqs/FaqBack.jsx";
import FaqCreate from "./backend/faqs/FaqCreate.jsx";
import FaqsEdit from "./backend/faqs/FaqsEdit.jsx";
import FaqCategory from "./backend/faqs/FaqCategory.jsx";
import FaqCategoryCreate from "./backend/faqs/FaqCategoryCreate.jsx";
import FaqCategoryEdit from "./backend/faqs/FaqCategoryEdit.jsx";
import BlogTags from "./backend/blog/BlogTags.jsx";
import BlogTagsCreate from "./backend/blog/BlogTagsCreate.jsx";
import BlogTagsEdit from "./backend/blog/BlogTagsEdit.jsx";
import BlogPost from "./backend/blog/BlogPost.jsx";
import BlogPostCreate from "./backend/blog/BlogPostCreate.jsx";
import BlogPostEdit from "./backend/blog/BlogPostEdit.jsx";
import BlogCategory from "./backend/blog/BlogCategory.jsx";
import AdsPage from "./backend/ads/AdsPage.jsx";
import AdsCreate from "./backend/ads/AdsCreate.jsx";
import AdsEdit from "./backend/ads/AdsPageEdit.jsx";
import IncompleteOrders from "./backend/ecommerce/incompleteorder/IncompleteOrders.jsx";
import ProductTags from "./backend/ecommerce/producttags/ProductTags.jsx";
import ProductTagsCreate from "./backend/ecommerce/producttags/ProductTagsCreate.jsx";
import ProductTagsEdit from "./backend/ecommerce/producttags/ProductTagsEdit.jsx";
import ProductOptions from "./backend/ecommerce/productoptions/ProductOptions.jsx";
import ProductOptionscreate from "./backend/ecommerce/productoptions/ProductOptionscreate.jsx";
import OrderReturns from "./backend/ecommerce/orderreturns/OrderReturns.jsx";
import ProductCollections from "./backend/ecommerce/productcollections/ProductCollections.jsx";
import ProductCollectionsCreate from "./backend/ecommerce/productcollections/ProductCollectionsCreate.jsx";
import ProductCollectionsEdit from "./backend/ecommerce/productcollections/ProductCollectionsEdit.jsx";
import ProductLabels from "./backend/ecommerce/productlabels/ProductLabels.jsx";
import ProductLabelsCreate from "./backend/ecommerce/productlabels/ProductLabelsCreate.jsx";
import ProductLabelsEdit from "./backend/ecommerce/productlabels/ProductLabelsEdit.jsx";
import Brands from "./backend/ecommerce/brands/Brands.jsx";
import BrandsCreate from "./backend/ecommerce/brands/BrandsCreate.jsx";
import BrandsEdit from "./backend/ecommerce/brands/BrandsEdit.jsx";
import ProductOptionsEdit from "./backend/ecommerce/productoptions/ProductOptionsEdit.jsx";
import ProductAttributes from "./backend/ecommerce/productattributes/ProductAttributes.jsx";
import ProductAttributesCreate from "./backend/ecommerce/productattributes/ProductAttributesCreate.jsx";
import ProductAttributesEdit from "./backend/ecommerce/productattributes/ProductAttributesEdit.jsx";
import FlashSales from "./backend/ecommerce/flashsales/FlashSales.jsx";
import FlashSalesCreate from "./backend/ecommerce/flashsales/FlashSalesCreate.jsx";
import FlashSalesEdit from "./backend/ecommerce/flashsales/FlashSalesEdit.jsx";
import Customers from "./backend/ecommerce/customers/Customers.jsx";
import CustomerCreate from "./backend/ecommerce/customers/CustomerCreate.jsx";
import CustomerEdit from "./backend/ecommerce/customers/CustomersEdit.jsx";
import Reviews from "./backend/ecommerce/reviews/Reviews.jsx";
import ReviewsCreate from "./backend/ecommerce/reviews/ReviewsCreate.jsx";
import ReviewsView from "./backend/ecommerce/reviews/ReviewsView.jsx";
import Discounts from "./backend/ecommerce/discounts/Discounts.jsx";
import DiscountsCreate from "./backend/ecommerce/discounts/DiscountsCreate.jsx";
import DiscountsEdit from "./backend/ecommerce/discounts/DiscountsEdit.jsx";
import Reports from "./backend/ecommerce/reports/Reports.jsx";
import Products from "./backend/ecommerce/products/Products.jsx";
import ProductsCreate from "./backend/ecommerce/products/ProductsCreate.jsx";
import ProductsEdit from "./backend/ecommerce/products/ProductsEdit.jsx";
import ProductPrices from "./backend/ecommerce/productprices/ProductPrices.jsx";
import ProductInventory from "./backend/ecommerce/productinventory/ProductInventory.jsx";
import ProductCategory from "./backend/ecommerce/productcategories/ProductCategory.jsx";
import Menus from "./backend/appearance/menus/Menus.jsx";
import MenusCreate from "./backend/appearance/menus/MenusCreate.jsx";
import MenusEdit from "./backend/appearance/menus/MenusEdit.jsx";
import CustomCss from "./backend/appearance/codeeditor/CustomCss.jsx";
import RobotTxt from "./backend/appearance/codeeditor/RobotTxt.jsx";
import CustomJs from "./backend/appearance/codeeditor/CustomJs.jsx";
import CustomHtml from "./backend/appearance/codeeditor/CustomHtml.jsx";
import Widgets from "./backend/appearance/widgets/Widgets.jsx";
import General from "./backend/appearance/themeoptions/general/General.jsx";
import ThemePage from "./backend/appearance/themeoptions/themepage/ThemePage.jsx";
import BreadCrumb from "./backend/appearance/themeoptions/breadcrumb/BreadCrumb.jsx";
import ThemeLogo from "./backend/appearance/themeoptions/logo/ThemeLogo.jsx";
import MarketPlace from "./backend/appearance/themeoptions/marketplace/MarketPlace.jsx";
import BlogOptions from "./backend/appearance/themeoptions/blogoptions/BlogOptions.jsx";
import ThemeCookie from "./backend/appearance/themeoptions/cookieconsent/ThemeCookie.jsx";
import ThemeNewsLetters from "./backend/appearance/themeoptions/newsletters/ThemeNewsLetters.jsx";
import Typography from "./backend/appearance/themeoptions/themetypography/Typography.jsx";
import ThemeEcommerce from "./backend/appearance/themeoptions/ecommerceUrls/ThemeEcommerce.jsx";
import SocialLinks from "./backend/appearance/themeoptions/themesociallinks/SocialLinks.jsx";
import SocialSharing from "./backend/appearance/themeoptions/themesocialsharing/SocialSharing.jsx";
import ThemeFacebook from "./backend/appearance/themeoptions/facebookintegration/ThemeFacebook.jsx";
import Ecommerce from "./backend/appearance/themeoptions/themeecommerce/Ecommerce.jsx";
import ThemeStyles from "./backend/appearance/themeoptions/themestyles/ThemeStyles.jsx";
import Privacy from "./component/privacypolicy/Privacy.jsx";
import TermsCondition from "./component/termsandconditions/TermsCondition.jsx";
import MedicinePolicy from "./component/medicinepolicy/MedicinePolicy.jsx";
import Page from "./component/Pages.jsx";
import Shipment from "./backend/ecommerce/shipments/Shipment.jsx";
import Invoice from "./backend/ecommerce/invoice/Invoice.jsx";
import InvoiceEdit from "./backend/ecommerce/invoice/InvoiceEdit.jsx";
import Orders from "./backend/ecommerce/orders/Orders.jsx";
import OrdersCreate from "./backend/ecommerce/orders/OrdersCreate.jsx";
import CustomerDetails from "./component/customerdetails/CustomerDetails.jsx";
import CustomerOrder from "./component/customerdetails/CustomerOrder.jsx";
import CustomerReview from "./component/customerdetails/CustomerReview.jsx";
import CustomerDownload from "./component/customerdetails/CustomerDownload.jsx";
import CustomerRequest from "./component/customerdetails/CustomerRequest.jsx";
import CustomerAddress from "./component/customerdetails/CustomerAddress.jsx";
import CustomerAddressCreate from "./component/customerdetails/CustomerAddressCreate.jsx";
import CustomerDashEdit from "./component/customerdetails/CustomerDashEdit.jsx";
import CustomerAccount from "./component/customerdetails/CustomerAccount.jsx";
import CustomerPassword from "./component/customerdetails/CustomerPassword.jsx";
import ProductHome from "./component/producthome/ProductHome.jsx";
import AdminTheme from "./backend/appearance/AdminTheme/AdminTheme.jsx";
import CustomerView from "./component/customerdetails/CustomerView.jsx";
import SpecificationGroupCreate from "./backend/productspecification/SpecificationGroupCreate.jsx";
import SpecificationGroup from "./backend/productspecification/SpecificationGroup.jsx";
import SpecificationEdit from "./backend/productspecification/SpecificationEdit.jsx";
import SpecificationTable from "./backend/productspecification/SpecificationTable.jsx";
import SpecificationTableCreate from "./backend/productspecification/SpecificationTableCreate.jsx";
import SpecificationTableEdit from "./backend/productspecification/SpecificationTableEdit.jsx";
import SpecificationAttributes from "./backend/productspecification/SpecificationAttributes.jsx";
import SpecificationAttributeCreate from "./backend/productspecification/SpecificationAttributeCreate.jsx";
import SpecificationAttributeEdit from "./backend/productspecification/SpecificationAttributeEdit.jsx";
import OrdersEdit from "./backend/ecommerce/orders/OrdersEdit.jsx";
import ShipmentEdit from "./backend/ecommerce/shipments/ShipmentEdit.jsx";
import Transactions from "./backend/payments/Transactions.jsx";
import PaymentLog from "./backend/payments/PaymentLog.jsx";
import TransactionsEdit from "./backend/payments/TransactionsEdit.jsx";
import PaymentMethod from "./backend/payments/PaymentMethod.jsx";
import AdminLogin from "./backend/AdminLogin.jsx";
import AdminReset from "./backend/AdminReset.jsx";
import ProtectedRoute from "./component/ProtectedRoute";
import Wishlist from "./component/wishlist/Wishlist.jsx";
import DynamicPage from "./component/dynamicpage/DynamicPage.jsx";
import axios from "axios";

function App() {
  useEffect(() => {
    applyTypographyStyles();
  }, []);

  const [selectedHomepage, setSelectedHomepage] = useState(
    localStorage.getItem("selectedHomepage") || ""
  );
  const [pageSettings, setPageSettings] = useState("");

  useEffect(() => {
    const fetchPageSettings = async () => {
      try {
        const response = await fetch("http://89.116.170.231:1600/get-homepage");
        const data = await response.json();
        if (data.homepageSettings) {
          setPageSettings(data.homepageSettings);
          if (!localStorage.getItem("selectedHomepage")) {
            setSelectedHomepage(data.homepageSettings.homepage || "home");
            localStorage.setItem(
              "selectedHomepage",
              data.homepageSettings.homepage || "home"
            );
          }
        }
      } catch (error) {
        console.error("Error fetching homepage settings:", error);
      }
    };
    fetchPageSettings();
  }, []);

  const defaultUrlState = JSON.parse(localStorage.getItem("urlState")) || {
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
  const storedUrlState = localStorage.getItem("urlState");
  const urlState = storedUrlState
    ? JSON.parse(storedUrlState)
    : defaultUrlState;

  useEffect(() => {
    axios
      .get("http://89.116.170.231:1600/get-theme-logo")
      .then((response) => {
        if (response.data && response.data.favicon_url) {
          updateFavicon(response.data.favicon_url);
        }
      })
      .catch((error) => console.error("Error fetching favicon:", error));
  }, []);

  const updateFavicon = (faviconUrl) => {
    let favicon = document.querySelector("link[rel='icon']");
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.rel = "icon";
      document.head.appendChild(favicon);
    }
    favicon.href = `http://89.116.170.231:1600/api/src/image/${faviconUrl}`;
    favicon.setAttribute("sizes", "200x200");
  };

  return (
    <RouterProvider
      router={createBrowserRouter(
        createRoutesFromElements(
          <>
            <Route>
              <Route path="*" element={<Navigate to="/error" />} />
            </Route>

            <Route path="/admin">
              <Route path="" element={<Navigate to="/admin/login" />} />
              <Route path="/admin/login" element={<AdminLogin />} />
            </Route>

            <Route path="/" element={<User />}>
              <Route path="/:name" element={<DynamicPage />} />
              <Route path="/admin/*" element={<ProtectedRoute />}>
                <Route path="welcome" element={<Welcome />} />
                <Route path="system" element={<PlatForm />} />
                <Route path="settings" element={<Settings />} />
                <Route path="announcements" element={<Announcement />} />
                <Route path="testimonials" element={<Testimonial />} />
                <Route path="galleries" element={<Galleries />} />
                <Route path="simple-sliders" element={<SimpleSliders />} />
                <Route path="newsletters" element={<NewsLetters />} />
                <Route path="contacts" element={<ContactPage />} />
                <Route path="pages" element={<Pages />} />
                <Route path="faqs" element={<FaqBack />} />
                <Route path="faq-categories" element={<FaqCategory />} />
                <Route path="ads" element={<AdsPage />} />
                <Route path="customers" element={<Customers />} />
                <Route path="menus" element={<Menus />} />
                <Route path="widgets" element={<Widgets />} />
              </Route>

              <Route path="/admin/password">
                <Route path="reset" element={<AdminReset />} />
              </Route>

              <Route path="/admin/theme/*" element={<ProtectedRoute />}>
                <Route path="custom-css" element={<CustomCss />} />
                <Route path="robots-txt" element={<RobotTxt />} />
                <Route path="custom-js" element={<CustomJs />} />
                <Route path="custom-html" element={<CustomHtml />} />
                <Route path="options" element={<General />} />
                <Route path="all" element={<AdminTheme />} />
              </Route>

              <Route path="/admin/payments/*" element={<ProtectedRoute />}>
                <Route path="transactions" element={<Transactions />} />
                <Route path="logs" element={<PaymentLog />} />
                <Route path="methods" element={<PaymentMethod />} />
              </Route>

              <Route path="/admin/payments/*" element={<ProtectedRoute />}>
                <Route path="transactions/:id" element={<TransactionsEdit />} />
              </Route>

              <Route path="/admin/theme/options/*" element={<ProtectedRoute />}>
                <Route
                  path="opt-text-subsection-general"
                  element={<General />}
                />
                <Route
                  path="opt-text-subsection-page"
                  element={<ThemePage />}
                />
                <Route
                  path="opt-text-subsection-breadcrumb"
                  element={<BreadCrumb />}
                />
                <Route
                  path="opt-text-subsection-logo"
                  element={<ThemeLogo />}
                />
                <Route
                  path="opt-text-subsection-marketplace"
                  element={<MarketPlace />}
                />
                <Route
                  path="opt-text-subsection-blog"
                  element={<BlogOptions />}
                />
                <Route
                  path="opt-text-subsection-cookie-consent"
                  element={<ThemeCookie />}
                />
                <Route
                  path="opt-text-subsection-newsletter-popup"
                  element={<ThemeNewsLetters />}
                />
                <Route
                  path="opt-text-subsection-typography"
                  element={<Typography />}
                />
                <Route
                  path="opt-text-subsection-ecommerce-slug"
                  element={<ThemeEcommerce />}
                />
                <Route
                  path="opt-text-subsection-social-links"
                  element={<SocialLinks />}
                />
                <Route
                  path="opt-text-subsection-social-sharing"
                  element={<SocialSharing />}
                />
                <Route
                  path="opt-text-subsection-facebook-integration"
                  element={<ThemeFacebook />}
                />
                <Route
                  path="opt-text-subsection-ecommerce"
                  element={<Ecommerce />}
                />
                <Route
                  path="opt-text-subsection-styles"
                  element={<ThemeStyles />}
                />
              </Route>

              <Route path="/admin/menus/*" element={<ProtectedRoute />}>
                <Route path="create" element={<MenusCreate />} />
                <Route path="edit/:id" element={<MenusEdit />} />
              </Route>

              <Route path="/admin/customers/*" element={<ProtectedRoute />}>
                <Route path="create" element={<CustomerCreate />} />
                <Route path="edit/:id" element={<CustomerEdit />} />
              </Route>

              <Route path="/admin/ecommerce/*" element={<ProtectedRoute />}>
                <Route
                  path="incomplete-orders"
                  element={<IncompleteOrders />}
                />
                <Route path="product-tags" element={<ProductTags />} />
                <Route path="options" element={<ProductOptions />} />
                <Route path="order-returns" element={<OrderReturns />} />
                <Route
                  path="product-collections"
                  element={<ProductCollections />}
                />
                <Route path="product-labels" element={<ProductLabels />} />
                <Route path="brands" element={<Brands />} />
                <Route
                  path="product-attribute-sets"
                  element={<ProductAttributes />}
                />
                <Route path="flash-sales" element={<FlashSales />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="discounts" element={<Discounts />} />
                <Route path="reports" element={<Reports />} />
                <Route path="products" element={<Products />} />
                <Route path="product-prices" element={<ProductPrices />} />
                <Route
                  path="product-inventory"
                  element={<ProductInventory />}
                />
                <Route
                  path="product-categories"
                  element={<ProductCategory />}
                />
                <Route path="shipments" element={<Shipment />} />
                <Route path="invoices" element={<Invoice />} />
                <Route path="orders" element={<Orders />} />
                <Route
                  path="specification-groups"
                  element={<SpecificationGroup />}
                />
                <Route
                  path="specification-tables"
                  element={<SpecificationTable />}
                />
                <Route
                  path="specification-attributes"
                  element={<SpecificationAttributes />}
                />
              </Route>

              <Route
                path="/admin/ecommerce/shipments/*"
                element={<ProtectedRoute />}
              >
                <Route path="edit/:id" element={<ShipmentEdit />} />
              </Route>

              <Route
                path="/admin/ecommerce/specification-groups/*"
                element={<ProtectedRoute />}
              >
                <Route path="create" element={<SpecificationGroupCreate />} />
              </Route>

              <Route
                path="/admin/ecommerce/specification-groups/*"
                element={<ProtectedRoute />}
              >
                <Route path="edit/:id" element={<SpecificationEdit />} />
              </Route>

              <Route
                path="/admin/ecommerce/specification-tables/*"
                element={<ProtectedRoute />}
              >
                <Route path="create" element={<SpecificationTableCreate />} />
              </Route>

              <Route
                path="/admin/ecommerce/specification-tables/*"
                element={<ProtectedRoute />}
              >
                <Route path="edit/:id" element={<SpecificationTableEdit />} />
              </Route>

              <Route
                path="/admin/ecommerce/specification-attributes/*"
                element={<ProtectedRoute />}
              >
                <Route
                  path="create"
                  element={<SpecificationAttributeCreate />}
                />
              </Route>

              <Route
                path="/admin/ecommerce/specification-attributes/*"
                element={<ProtectedRoute />}
              >
                <Route
                  path="edit/:id"
                  element={<SpecificationAttributeEdit />}
                />
              </Route>

              <Route
                path="/admin/ecommerce/orders/*"
                element={<ProtectedRoute />}
              >
                <Route path="create" element={<OrdersCreate />} />
              </Route>

              <Route
                path="/admin/ecommerce/orders/*"
                element={<ProtectedRoute />}
              >
                <Route path="edit/:id" element={<OrdersEdit />} />
              </Route>

              <Route
                path="/admin/ecommerce/invoices/*"
                element={<ProtectedRoute />}
              >
                <Route path="edit/:id" element={<InvoiceEdit />} />
              </Route>

              <Route
                path="/admin/ecommerce/products/*"
                element={<ProtectedRoute />}
              >
                <Route path="create" element={<ProductsCreate />} />
                <Route path="edit/:id" element={<ProductsEdit />} />
              </Route>

              <Route
                path="/admin/ecommerce/discounts/*"
                element={<ProtectedRoute />}
              >
                <Route path="create" element={<DiscountsCreate />} />
                <Route path="edit/:id" element={<DiscountsEdit />} />
              </Route>

              <Route
                path="/admin/ecommerce/reviews/*"
                element={<ProtectedRoute />}
              >
                <Route path="create" element={<ReviewsCreate />} />
                <Route path="view/:id" element={<ReviewsView />} />
              </Route>

              <Route
                path="/admin/ecommerce/flash-sales/*"
                element={<ProtectedRoute />}
              >
                <Route path="create" element={<FlashSalesCreate />} />
                <Route path="edit/:id" element={<FlashSalesEdit />} />
              </Route>

              <Route
                path="/admin/ecommerce/product-attribute-sets/*"
                element={<ProtectedRoute />}
              >
                <Route path="create" element={<ProductAttributesCreate />} />
                <Route path="edit/:id" element={<ProductAttributesEdit />} />
              </Route>

              <Route
                path="/admin/ecommerce/brands/*"
                element={<ProtectedRoute />}
              >
                <Route path="create" element={<BrandsCreate />} />
                <Route path="edit/:id" element={<BrandsEdit />} />
              </Route>

              <Route
                path="/admin/ecommerce/product-collections/*"
                element={<ProtectedRoute />}
              >
                <Route path="create" element={<ProductCollectionsCreate />} />
                <Route path="edit/:id" element={<ProductCollectionsEdit />} />
              </Route>

              <Route
                path="/admin/ecommerce/product-labels/*"
                element={<ProtectedRoute />}
              >
                <Route path="create" element={<ProductLabelsCreate />} />
                <Route path="edit/:id" element={<ProductLabelsEdit />} />
              </Route>

              <Route
                path="/admin/ecommerce/product-tags/*"
                element={<ProtectedRoute />}
              >
                <Route path="create" element={<ProductTagsCreate />} />
                <Route path="edit/:id" element={<ProductTagsEdit />} />
              </Route>

              <Route
                path="/admin/ecommerce/options/*"
                element={<ProtectedRoute />}
              >
                <Route path="create" element={<ProductOptionscreate />} />
                <Route path="edit/:id" element={<ProductOptionsEdit />} />
              </Route>

              <Route path="/admin/announcements/*" element={<ProtectedRoute />}>
                <Route path="create" element={<AnnouncementCreate />} />
                <Route path="edit/:id" element={<AnnouncementEdit />} />
              </Route>

              <Route path="/admin/testimonials/*" element={<ProtectedRoute />}>
                <Route path="create" element={<TestimonialCreate />} />
                <Route path="edit/:id" element={<TestimonialEdit />} />
              </Route>

              <Route path="/admin/galleries/*" element={<ProtectedRoute />}>
                <Route path="create" element={<GalleryCreate />} />
                <Route path="edit/:id" element={<GalleryEdit />} />
              </Route>

              <Route
                path="/admin/simple-sliders/*"
                element={<ProtectedRoute />}
              >
                <Route path="create" element={<SimpleSlidersCreate />} />
                <Route path="edit/:id" element={<SimpleSlidersEdit />} />
              </Route>

              <Route path="/admin/contacts/*" element={<ProtectedRoute />}>
                <Route path="create" element={<ContactsCreate />} />
                <Route path="edit/:id" element={<ContactsEdit />} />
              </Route>

              <Route path="/admin/pages/*" element={<ProtectedRoute />}>
                <Route path="create" element={<PagesCreate />} />
                <Route path="edit/:id" element={<PagesEdit />} />
              </Route>

              <Route path="/admin/faqs/*" element={<ProtectedRoute />}>
                <Route path="create" element={<FaqCreate />} />
                <Route path="edit/:id" element={<FaqsEdit />} />
              </Route>

              <Route
                path="/admin/faq-categories/*"
                element={<ProtectedRoute />}
              >
                <Route path="create" element={<FaqCategoryCreate />} />
                <Route path="edit/:id" element={<FaqCategoryEdit />} />
              </Route>

              <Route path="/admin/blog/*" element={<ProtectedRoute />}>
                <Route path="tags" element={<BlogTags />} />
                <Route path="posts" element={<BlogPost />} />
                <Route path="categories" element={<BlogCategory />} />
              </Route>

              <Route path="/admin/blog/tags/*" element={<ProtectedRoute />}>
                <Route path="create" element={<BlogTagsCreate />} />
                <Route path="edit/:id" element={<BlogTagsEdit />} />
              </Route>

              <Route path="/admin/blog/posts/*" element={<ProtectedRoute />}>
                <Route path="create" element={<BlogPostCreate />} />
                <Route path="edit/:id" element={<BlogPostEdit />} />
              </Route>

              <Route path="/admin/ads/*" element={<ProtectedRoute />}>
                <Route path="create" element={<AdsCreate />} />
                <Route path="edit/:id" element={<AdsEdit />} />
              </Route>

              <Route path="/">
                <Route
                  path="/"
                  element={
                    selectedHomepage === "about" ? (
                      <AboutPage />
                    ) : selectedHomepage === "shop" ? (
                      <Shop />
                    ) : selectedHomepage === "blog" ? (
                      <BlogPage />
                    ) : selectedHomepage === "contact-us" ? (
                      <ContactUs />
                    ) : selectedHomepage === "faqs" ? (
                      <Faqs />
                    ) : (
                      <HomePage />
                    )
                  }
                />
                <Route
                  path="/about"
                  element={
                    selectedHomepage === "about" ? (
                      <Navigate to="/" replace />
                    ) : (
                      <AboutPage />
                    )
                  }
                />

                <Route
                  path="/shop"
                  element={
                    selectedHomepage === "shop" ? (
                      <Navigate to="/" replace />
                    ) : (
                      <Shop />
                    )
                  }
                />

                <Route
                  path="/blog"
                  element={
                    selectedHomepage === "blog" ? (
                      <Navigate to="/" replace />
                    ) : (
                      <BlogPage />
                    )
                  }
                />

                <Route
                  path="/contact-us"
                  element={
                    selectedHomepage === "contact-us" ? (
                      <Navigate to="/" replace />
                    ) : (
                      <ContactUs />
                    )
                  }
                />

                <Route
                  path="/faqs"
                  element={
                    selectedHomepage === "faqs" ? (
                      <Navigate to="/" replace />
                    ) : (
                      <Faqs />
                    )
                  }
                />

                <Route
                  path="/"
                  element={
                    <Navigate to={`/${urlState.productDetails}`} replace />
                  }
                />

                <Route
                  path={`/${urlState.productDetails}`}
                  element={<ProductDetail />}
                />

                <Route
                  path="/"
                  element={<Navigate to={`/${urlState.wishlist}`} replace />}
                />
                <Route path={`/${urlState.wishlist}`} element={<Wishlist />} />

                <Route
                  path="/"
                  element={<Navigate to={`/${urlState.cart}`} replace />}
                />
                <Route path={`/${urlState.cart}`} element={<Cart />} />

                <Route
                  path="/"
                  element={<Navigate to={`/${urlState.checkout}`} replace />}
                />
                <Route path={`/${urlState.checkout}`} element={<Checkout />} />
                <Route path="/blog-details/:id" element={<BlogDetails />} />
                <Route path="/error" element={<ErrorPage />} />

                <Route
                  path="/"
                  element={<Navigate to={`/${urlState.login}`} replace />}
                />
                <Route path={`/${urlState.login}`} element={<Login />} />
                {/* <Route path="/addcart" element={<AddCart />} /> */}
                <Route path="/privacy-policy" element={<Privacy />} />
                <Route path="/terms-condition" element={<TermsCondition />} />
                <Route path="/medicine-policy" element={<MedicinePolicy />} />
                <Route path="/page-seo/:id" element={<Page />} />
                <Route path="/products" element={<ProductHome />} />
              </Route>

              <Route path="/user">
                <Route
                  index
                  element={
                    <Navigate to={`/${urlState.userDashboard}`} replace />
                  }
                />

                <Route
                  path={`/${urlState.userDashboard}`}
                  element={<CustomerDetails />}
                />

                <Route
                  index
                  element={<Navigate to={`/${urlState.userOrders}`} replace />}
                />

                <Route
                  path={`/${urlState.userOrders}`}
                  element={<CustomerOrder />}
                />

                <Route
                  index
                  element={
                    <Navigate to={`/${urlState.userProductReviews}`} replace />
                  }
                />

                <Route
                  path={`/${urlState.userProductReviews}`}
                  element={<CustomerReview />}
                />

                <Route
                  index
                  element={
                    <Navigate to={`/${urlState.userOrderReturns}`} replace />
                  }
                />
                <Route
                  path={`/${urlState.userOrderReturns}`}
                  element={<CustomerRequest />}
                />

                <Route
                  index
                  element={
                    <Navigate to={`/${urlState.userDownloads}`} replace />
                  }
                />
                <Route
                  path={`/${urlState.userDownloads}`}
                  element={<CustomerDownload />}
                />

                <Route
                  index
                  element={<Navigate to={`/${urlState.userAddress}`} replace />}
                />
                <Route
                  path={`/${urlState.userAddress}`}
                  element={<CustomerAddress />}
                />

                <Route
                  index
                  element={
                    <Navigate to={`/${urlState.userEditAccount}`} replace />
                  }
                />
                <Route
                  path={`/${urlState.userEditAccount}`}
                  element={<CustomerAccount />}
                />

                <Route
                  index
                  element={
                    <Navigate to={`/${urlState.changePassword}`} replace />
                  }
                />
                <Route
                  path={`/${urlState.changePassword}`}
                  element={<CustomerPassword />}
                />
              </Route>

              <Route path="/user/orders">
                <Route path="view/:id" element={<CustomerView />} />
              </Route>

              <Route path="/user/address">
                <Route path="create" element={<CustomerAddressCreate />} />
                <Route path="edit/:id" element={<CustomerDashEdit />} />
              </Route>
            </Route>
          </>
        )
      )}
    />
  );
}

export default App;
