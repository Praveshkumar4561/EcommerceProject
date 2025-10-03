import { useParams } from "react-router-dom";

const CURRENT_THEME = "theme1";

export default function HtmlPageViewer() {
  const { page } = useParams();

  const src = `https://demo.webriefly.com/api/themes/${CURRENT_THEME}/html/${page}.html`;

  return (
    <iframe
      src={src}
      style={{ width: "100%", height: "100vh", border: "none" }}
      title={page}
    />
  );
}
