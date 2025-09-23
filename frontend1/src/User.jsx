import React from "react";
import UserContextProvider from "./context/UserContextProvider";
import { Outlet } from "react-router-dom";

function User() {
  return (
    <UserContextProvider>
      <div style={{ width: "100%", minHeight: "100vh", height: "100%" }}>
        <Outlet />
      </div>
    </UserContextProvider>
  );
}

export default User;
