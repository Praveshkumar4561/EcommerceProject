import React, { useEffect, useState } from "react";
import UserContextProvider from "./context/UserContextProvider";
import { Outlet } from "react-router-dom";
import PushNotifications from "./component/PushNotifications";
import axios from "axios";
import { Helmet } from "react-helmet-async";

function Users() {
  const [customCSS, setCustomCSS] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://89.116.170.231:1600/get-custom-code"
        );
        setCustomCSS(response.data.custom_css || "");
      } catch (error) {
        console.error("Error fetching CSS:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <UserContextProvider>
      <PushNotifications />
      <Helmet>
        <style>{customCSS}</style>
      </Helmet>
      <Outlet />
    </UserContextProvider>
  );
}

export default Users;
