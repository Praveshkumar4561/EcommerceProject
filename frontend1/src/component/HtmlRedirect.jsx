import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const HtmlRedirect = () => {
  const { page } = useParams();
  const navigate = useNavigate();
  const [html, setHtml] = useState("<p>Loading...</p>");

  const cleanupInjected = () => {
    document
      .querySelectorAll("link[data-injected='true']")
      .forEach((el) => el.remove());
    document
      .querySelectorAll("script[data-injected='true']")
      .forEach((el) => el.remove());
  };

  useEffect(() => {
    cleanupInjected();

    const base =
      "/themes/static/radios-electronics-ecommerce-html-template-2023-11-27-05-16-52-utc--1--2025-06-28-16-22-26-utc/radios-html-package/Radios/";
    const cleanPage = (page || "").replace(/[^a-zA-Z0-9_-]/g, "");
    const url = `${base}${cleanPage}.html`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Page not found");
        return res.text();
      })
      .then((text) => {
        const doc = new DOMParser().parseFromString(text, "text/html");

        // Inject CSS
        doc.querySelectorAll("link[rel='stylesheet']").forEach((link) => {
          const newLink = document.createElement("link");
          newLink.rel = "stylesheet";
          newLink.href = link.href;
          newLink.setAttribute("data-injected", "true");
          document.head.appendChild(newLink);
        });

        // Inject JS
        doc.querySelectorAll("script[src]").forEach((script) => {
          const newScript = document.createElement("script");
          newScript.src = script.src;
          newScript.async = false;
          newScript.setAttribute("data-injected", "true");
          document.body.appendChild(newScript);
        });

        setHtml(doc.body.innerHTML);
      })
      .catch(() => setHtml("<h1>404 - Page not found</h1>"));
  }, [page]);

  useEffect(() => {
    const container = document.getElementById("html-content");
    if (!container) return;

    const onClick = (e) => {
      const a = e.target.closest("a[href$='.html']");
      if (!a || !container.contains(a)) return;

      e.preventDefault();
      const href = a.getAttribute("href");
      const pageName = href.replace(/\.html$/, "");
      navigate(`/${pageName}`);
    };

    container.addEventListener("click", onClick);
    return () => container.removeEventListener("click", onClick);
  }, [html, navigate]);

  return <div id="html-content" dangerouslySetInnerHTML={{ __html: html }} />;
};

export default HtmlRedirect;
