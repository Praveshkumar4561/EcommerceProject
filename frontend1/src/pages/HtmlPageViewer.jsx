import { useParams } from "react-router-dom";

const CURRENT_THEME = "theme1";

export default function HtmlPageViewer() {
  const { page } = useParams();

  const src = `http://147.93.45.171:1600/themes/${CURRENT_THEME}/html/${page}.html`;

  return (
    <iframe
      src={src}
      style={{ width: "100%", height: "100vh", border: "none" }}
      title={page}
    />
  );
}
