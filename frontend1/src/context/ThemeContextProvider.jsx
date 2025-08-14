import React, { useState } from "react";
import ThemeContext from "./ThemeContext";

function ThemeContextProvider({ children }) {
  const [theme, setTheme] = useState("roiser");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContextProvider;
