import React, { useEffect, useState } from "react";
import "./AdminReset.css";
import Logo from "../assets/Tonic.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import Mountain from "../assets/mountain.webp";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Helmet } from "react-helmet-async";
import axios from "axios";

function AdminReset() {
  const [email, setEmail] = useState("");

  let [errors, setErrors] = useState({
    username: "",
  });
  let { username } = email;

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = "The email field is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const response = await axios.post(
        "https://demo.webriefly.com/api/forgot-password",
        {
          email: email,
        }
      );
      if (response.ok) {
        toast.success("Password reset link sent to your email!", {
          position: "bottom-right",
          autoClose: 1000,
          ProgressBar: true,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Failed to send reset link. Please try again.", {
          position: "bottom-right",
          autoClose: 1000,
          ProgressBar: true,
          closeOnClick: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.", {
        position: "bottom-right",
        autoClose: 1000,
        ProgressBar: true,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const [LogoData, setLogoData] = useState(null);

  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axios.get(
          "https://demo.webriefly.com/api/get-theme-logo"
        );
        setLogoData(response.data);
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };
    fetchLogo();
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  return (
    <>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        />

        <title>Forgot Password | RxLYTE</title>

        <link
          rel="shortcut icon"
          href="https://demo.webriefly.com/assets/Tonic.svg"
          type="image/svg+xml"
        />
        <meta
          property="og:image"
          content="https://demo.webriefly.com/assets/Tonic.svg"
        />

        <meta
          name="description"
          content="Copyright 2025 © RxLYTE. All rights reserved."
        />
        <meta
          property="og:description"
          content="Copyright 2025 © RxLYTE. All rights reserved."
        />
        <meta property="og:title" content="Testimonials | RxLYTE" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://demo.webriefly.com/" />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://demo.webriefly.com/" />
      </Helmet>

      <div className="container-fluid m-0 p-0">
        <div className="container">
          <div className="row mt-0 d-flex flex-row flex-wrap flex-lg-nowrap flex-md-wrap">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 d-flex flex-column justify-content-center admin-login-image min-vh-100 admin-min admin-min1">
              <div className="d-flex flex-column justify-content-center align-class">
                <div className="d-flex flex-column justify-content-center align-items-lg-center">
                  <img
                    src={
                      LogoData
                        ? `https://demo.webriefly.com/uploads/${LogoData.logo_url}`
                        : Logo
                    }
                    alt="RxLYTE"
                    className="img-fluid"
                    height={LogoData ? LogoData.logo_height : "50"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = Logo;
                    }}
                  />
                  <h6 className="mt-3 ms-2 text-light">Forgot Password</h6>
                </div>

                <div className="align-class">
                  <div className="mt-1 d-flex flex-column align-items-start align-class1 lh-lg">
                    <span className="text-light password-reset">
                      Have you forgotten your password?
                    </span>
                    <span className="text-light password-reset text-start">
                      Please enter your email account. System will send an email
                      with an active link to reset your password.
                    </span>
                  </div>

                  <div className="mt-2 d-flex flex-column align-items-start align-class1">
                    <label htmlFor="" className="text-light">
                      Email <span className="text-danger">*</span>
                    </label>

                    <input
                      type="text"
                      className="form-control mt-2 py-4 admin-login-image admin-min2"
                      placeholder="Enter your email address"
                      name="username"
                      value={email}
                      onChange={handleEmailChange}
                    />
                    {errors.username && (
                      <div className="text-danger mt-2 error-message-admin">
                        {errors.username}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 mb-3 d-flex align-class flex-row">
                  <button
                    className="btn btn-success rounded-1 d-flex admin-login-image py-4 mt-2 align-class1 justify-content-center flex-row flex-nowrap align-items-center"
                    type="button"
                    onClick={handleSubmit}
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="me-2 fs-5" />
                    Submit
                  </button>
                </div>
                <Link className="login-pass" to="/admin">
                  Back to login page
                </Link>
              </div>
              <ToastContainer />
            </div>

            <div className="col-12 col-sm-12 col-md-6 col-lg-6 p-0 d-none d-lg-block">
              <img src={Mountain} alt="login image" className="min-vh-100" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminReset;
