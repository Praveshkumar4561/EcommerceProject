import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { HelmetProvider } from "react-helmet-async";
import ThemeContextProvider from "./context/ThemeContextProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeContextProvider>
        <App />
      </ThemeContextProvider>
    </HelmetProvider>
  </StrictMode>
);
