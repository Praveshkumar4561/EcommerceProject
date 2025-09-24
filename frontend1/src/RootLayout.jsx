import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

function RootLayout() {
  const { pathname } = useLocation();
  const [themeCssUrl, setThemeCssUrl] = (useState < string) | (null > null);

  useEffect(() => {
    if (pathname.startsWith("/admin")) {
      setThemeCssUrl(null);
    } else {
      fetch("http://147.93.45.171:1600/themes/active")
        .then((r) => r.json())
        .then(({ folder_name }) => {
          if (folder_name) {
            setThemeCssUrl(`/themes/${folder_name}/style.css`);
          }
        })
        .catch((err) => {
          console.error("Error fetching active theme:", err);
          setThemeCssUrl(null);
        });
    }
  }, [pathname]);

  return (
    <div>
      {themeCssUrl && <link rel="stylesheet" href={themeCssUrl} />}
      <Outlet />
    </div>
  );
}

export default RootLayout;
