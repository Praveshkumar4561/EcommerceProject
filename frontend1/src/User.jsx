import React from "react";
import UserContextProvider from "./context/UserContextProvider";
import { Outlet } from "react-router-dom";
import PushNotifications from "./component/PushNotifications";

function User() {
  return (
    <UserContextProvider>
      <PushNotifications/>
      <Outlet />
    </UserContextProvider>
  );
}

export default User;