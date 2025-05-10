import React, { useEffect, useState } from "react";
import "./AdminLogin.css";
import Tonic from "../assets/Tonic.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import City from "../assets/city.webp";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function AdminLogin() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "", password: "" });
  const { username, password } = user;
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const togglePasswordVisibility = () => setPasswordVisible((v) => !v);
  const [isChecked, setChecked] = useState(true);

  const handleCheckBoxChange = () => {
    const next = !isChecked;
    setChecked(next);
    if (next) {
      localStorage.setItem("user", JSON.stringify({ username, password }));
    } else {
      localStorage.removeItem("user");
    }
  };

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (stored) {
      setUser({ username: stored.username, password: stored.password });
      setChecked(true);
    }
    if (localStorage.getItem("isAuthenticated")) {
      navigate("/admin/welcome");
    }
  }, [navigate]);

  const validateForm = () => {
    const errs = {};
    if (!username) errs.username = "The username(or email) field is required.";
    if (!password) errs.password = "The password field is required.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    setApiError("");
    if (!validateForm()) return;

    try {
      const { data } = await axios.post(
        "http://89.116.170.231:1600/adminlogin",
        {
          username,
          password,
        }
      );
      const { token, user: userData, expiresIn } = data;
      const { role } = userData;
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", token);
      const ms =
        (role === "superadmin" ? 365 : expiresIn / (24 * 60 * 60)) *
        24 *
        60 *
        60 *
        1000;
      localStorage.setItem("tokenExpiryTime", ms);
      setTimeout(() => {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        navigate("/admin/login");
      }, ms);
      navigate("/admin/welcome");
    } catch (err) {
      let msg = "Username or password is incorrect.";
      if (err.response?.data) {
        const d = err.response.data;
        if (typeof d === "string") msg = d;
        else if (d.error) msg = d.error;
      }
      setApiError(msg);
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const location = useLocation();
  const baseUrl = "http://srv724100.hstgr.cloud";

  return (
    <>
      <Helmet>
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"
        />
        <title>Admin | RxLYTE</title>

        <link
          rel="shortcut icon"
          href={`${baseUrl}/assets/Tonic.svg`}
          type="image/svg+xml"
        />
        <meta property="og:image" content={`${baseUrl}/assets/Tonic.svg`} />

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
        <meta property="og:url" content={`${baseUrl}${location.pathname}`} />

        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`${baseUrl}${location.pathname}`} />
      </Helmet>

      <div className="container-fluid m-0 p-0">
        <div className="container">
          <div className="row mt-0 d-flex flex-row flex-wrap flex-lg-nowrap flex-md-wrap">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 d-flex flex-column justify-content-center admin-login-image min-vh-100 admin-min admin-min1">
              <div className="d-flex flex-column justify-content-center align-class">
                <div className="d-flex flex-column justify-content-center align-items-lg-center">
                  <img src={Tonic} alt="RxLYTE" className="img-fluid" />
                  <h5 className="mt-3 ms-2 text-light">Admin Login</h5>
                </div>

                <div className="align-class">
                  <div className="mt-1 d-flex flex-column align-items-start align-class1">
                    <label className="text-light">
                      Email/Username <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control mt-2 py-4 admin-login-image admin-min2"
                      placeholder="Enter your username or email address"
                      name="username"
                      value={username}
                      onChange={onInputChange}
                    />
                    {errors.username && (
                      <div className="text-danger mt-2 error-message-admin">
                        {errors.username}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 d-flex flex-column align-items-start align-class1 input-container">
                    <div className="d-flex flex-row flex-nowrap justify-content-between w-100">
                      <label className="text-start text-light">
                        Password <span className="text-danger">*</span>
                      </label>
                      <Link
                        to="/admin/password/reset"
                        className="text-start login-pass"
                      >
                        Lost your password?
                      </Link>
                    </div>

                    <div className="input-wrapper">
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        className="form-control mt-2 py-4 admin-login-image admin-min3"
                        placeholder="Enter your password"
                        name="password"
                        value={password}
                        onChange={onInputChange}
                      />
                      <FontAwesomeIcon
                        icon={isPasswordVisible ? faEyeSlash : faEye}
                        className="text-light password-icon1"
                        onClick={togglePasswordVisibility}
                      />
                    </div>
                    {errors.password && (
                      <div className="error text-danger mt-1">
                        {errors.password}
                      </div>
                    )}
                    {apiError && (
                      <div className="error text-danger mt-1">{apiError}</div>
                    )}

                    <div className="d-flex flex-row flex-nowrap mt-3 justify-content-start align-class1">
                      <input
                        type="checkbox"
                        className="form-check-input admin-min1 px-2 py-2"
                        id="Remember me"
                        checked={isChecked}
                        onChange={handleCheckBoxChange}
                      />
                      <label className="ms-2 text-light" htmlFor="Remember me">
                        Remember me?
                      </label>
                    </div>
                  </div>

                  <div className="mt-2 mb-3 d-flex align-class flex-row">
                    <button
                      type="button"
                      className="btn btn-success rounded-1 d-flex admin-login-image py-4 mt-2 align-class1 justify-content-center flex-row flex-nowrap align-items-center"
                      onClick={handleSubmit}
                    >
                      <FontAwesomeIcon
                        icon={faArrowRightToBracket}
                        className="me-2 fs-5"
                      />
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-12 col-md-6 col-lg-6 p-0 d-none d-lg-block">
              <img src={City} alt="login image" className="min-vh-100" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
