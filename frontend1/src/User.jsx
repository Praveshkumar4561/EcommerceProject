import React from "react";
import UserContextProvider from "./context/UserContextProvider";
import { Outlet } from "react-router-dom";

function User() {
  return (
    <UserContextProvider>
      <Outlet />
    </UserContextProvider>
  );
}

export default User;