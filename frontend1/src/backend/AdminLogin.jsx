import React from "react";
import "./AdminLogin.css";

function AdminLogin() {
  return (
    <>
      <div className="container-fluid vh-100 d-flex justify-content-center align-items-center">
        <div className="row admin_login">
          <div className="border rounded">
            <p className="text-center mt-3">Admin Login page</p>
            <label htmlFor="" className="mt-2 mb-2">
              Email
            </label>
            <input type="text" className="form-control mt-2 mb-5 py-4 w-" />
            <label htmlFor="">Password</label>
            <input type="text" className="form-control mt-2 mb-5 py-4" />
            <button className="btn btn-success d-flex py-4 mb-5">Login</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
