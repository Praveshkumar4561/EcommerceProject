import axios from "axios";

export const applyTypographyStyles = async () => {
  try {
    const response = await axios.get(
      "http://89.116.170.231:1600/get-font-settings"
    );
    const settings = response.data;
    document.documentElement.style.setProperty(
      "--font-family",
      settings.font_family
    );
    document.documentElement.style.setProperty(
      "--body-font-size",
      `${settings.body_font_size}px`
    );
    document.documentElement.style.setProperty(
      "--h1-font-size",
      `${settings.h1_font_size}px`
    );
    document.documentElement.style.setProperty(
      "--h2-font-size",
      `${settings.h2_font_size}px`
    );
    document.documentElement.style.setProperty(
      "--h3-font-size",
      `${settings.h3_font_size}px`
    );
    document.documentElement.style.setProperty(
      "--h4-font-size",
      `${settings.h4_font_size}px`
    );
    document.documentElement.style.setProperty(
      "--h5-font-size",
      `${settings.h5_font_size}px`
    );
    document.documentElement.style.setProperty(
      "--h6-font-size",
      `${settings.h6_font_size}px`
    );
  } catch (error) {
    console.error("Error fetching typography settings:", error);
  }
};
