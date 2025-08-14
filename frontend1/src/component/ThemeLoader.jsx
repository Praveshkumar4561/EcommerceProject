import React, { useEffect, useState } from "react";
import axios from "axios";

const ThemeLoader = () => {
  const [theme, setTheme] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActiveTheme = async () => {
      try {
        const response = await axios.get(
          "http://147.93.45.171:1600/themes/active"
        );
        if (response.data) {
          setTheme(response.data);
        }
      } catch (error) {
        console.error("Error loading active theme:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActiveTheme();
  }, []);

  useEffect(() => {
    if (!theme?.folder_name) return;

    // Load CSS
    const cssLink = document.createElement("link");
    cssLink.rel = "stylesheet";
    cssLink.href = `/themes/${theme.folder_name}/style.css`;
    document.head.appendChild(cssLink);

    // Load JS
    const jsScript = document.createElement("script");
    jsScript.src = `/themes/${theme.folder_name}/main.js`;
    jsScript.async = true;
    document.body.appendChild(jsScript);

    // Cleanup function
    return () => {
      document.head.removeChild(cssLink);
      document.body.removeChild(jsScript);
    };
  }, [theme]);

  // No need to render anything, this is just for side effects
  return null;
};

export default ThemeLoader;
