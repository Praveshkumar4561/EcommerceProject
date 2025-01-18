import React, { useEffect, useState } from "react";
import "./AdminLogin.css";
import Tonic from "../assets/Tonic.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-regular-svg-icons";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import City from "../assets/city.webp";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function AdminLogin() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  let [isChecked, setisChecked] = useState(true);

  let handleCheckBoxChange = () => {
    setisChecked(!isChecked);
  };

  const [apiError, setApiError] = useState("");
  let navigate = useNavigate();

  let [user, setUser] = useState({
    username: "",
    password: "",
  });

  let [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  let { username, password } = user;

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({ username: storedUser.username, password: storedUser.password });
    }
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated) {
      navigate("/admin/welcome");
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = "The username field is required.";
    if (!password) newErrors.password = "The password field is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const response = await axios.post("http://localhost:1600/adminlogin", {
        username,
        password,
      });
      const token = response.data.token;
      const role = response.data.user.role;
      const expiresIn = response.data.expiresIn;
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(response.data.user));
      if (role === "superadmin") {
        const superAdminExpiryTime = 365 * 24 * 60 * 60 * 1000;
        localStorage.setItem("tokenExpiryTime", superAdminExpiryTime);
        setTimeout(() => {
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("user");
          navigate("/admin/login");
        }, superAdminExpiryTime);
      } else if (role === "admin") {
        const adminExpiryTime = expiresIn * 1000;
        localStorage.setItem("tokenExpiryTime", adminExpiryTime);
        setTimeout(() => {
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("user");
          navigate("/admin/login");
        }, adminExpiryTime);
      }
      navigate("/admin/welcome");
    } catch (error) {
      if (error.response) {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("user");
        setApiError(error.response.data);
      } else {
        setApiError("An error occurred. Please try again.");
      }
    }
  };

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <>
      <div className="container-fluid m-0 p-0">
        <div className="container">
          <div className="row mt-0 d-flex flex-row flex-wrap flex-lg-nowrap flex-md-wrap">
            <div className="col-12 col-sm-12 col-md-6 col-lg-6 d-flex flex-column justify-content-center admin-login-image min-vh-100 admin-min admin-min1">
              <div className="d-flex flex-column justify-content-center align-class">
                <div className="d-flex flex-column justify-content-center align-items-lg-center">
                  <img src={Tonic} alt="404" className="img-fluid" />
                  <h5 className="mt-3 ms-2 text-light">Admin Login</h5>
                </div>

                <div className="align-class">
                  <div className="mt-1 d-flex flex-column align-items-start align-class1">
                    <label htmlFor="" className="text-light">
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
                      <label htmlFor="" className="text-start text-light">
                        Password <span className="text-danger">*</span>
                      </label>

                      <Link
                        className="text-start login-pass"
                        to="/admin/password/reset"
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
                      <div className="text-danger mt-2 error-message-admin">
                        {errors.password}
                      </div>
                    )}
                    {apiError && (
                      <div className="text-danger mt-2 error-message-admin">
                        {apiError}
                      </div>
                    )}
                  </div>

                  <div className="d-flex flex-row flex-nowrap mt-3 justify-content-start align-class1">
                    <input
                      type="checkbox"
                      className="form-check-input admin-min1 px-2 py-2"
                      checked={isChecked}
                      onChange={handleCheckBoxChange}
                    />
                    <label htmlFor="" className="ms-2 text-light">
                      Remember me?
                    </label>
                  </div>
                </div>

                <div className="mt-2 mb-3 d-flex align-class flex-row">
                  <button
                    className="btn btn-success rounded-1 d-flex admin-login-image py-4 mt-2 align-class1 justify-content-center flex-row flex-nowrap align-items-center"
                    type="button"
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
