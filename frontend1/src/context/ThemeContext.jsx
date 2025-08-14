import React, { createContext, useContext, useState, useEffect } from "react";

const themes = {
  roiser:
    "roiser-multipurpose-ecommerce-html5-template-2024-08-20-06-31-54-utc-2025-06-12-15-16-08-utc/roiser-html-package/roiser",

  radios:
    "radios-electronics-ecommerce-html-template-2023-11-27-05-16-52-utc--1--2025-06-28-16-22-26-utc/radios-html-package/Radios",

  pesco:
    "pesco-ecommerce-html-rtl-template-2025-03-20-04-13-07-utc-2025-06-12-15-13-00-utc/Main_File/Template",
};

const ThemeContext = createContext({
  theme: "roiser",
  folder: themes.roiser,
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("roiser");

  useEffect(() => {
    const stored = localStorage.getItem("selectedTheme");
    if (stored && themes[stored]) setTheme(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedTheme", theme);
  }, [theme]);

  const changeTheme = (newTheme) => {
    if (themes[newTheme]) setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, folder: themes[theme], setTheme: changeTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;
