import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { useParams } from "react-router-dom";

const Page = () => {
  const { id } = useParams();
  const [pageData, setPageData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Fetching page data for ID:", id);
    const fetchPageData = async () => {
      try {
        const response = await axios.get(
          `http://52.9.253.67:1600/page-seo/${id}`
        );
        setPageData(response.data);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("Page not found.");
        } else {
          setError("Error fetching page data.");
        }
      }
    };

    fetchPageData();
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!pageData) return <div>Loading...</div>;

  return (
    <div>
      <Helmet>
        <title>{pageData.title}</title>
        <meta property="og:title" content={pageData.og_title} />
        <meta property="og:description" content={pageData.og_description} />
        <meta property="og:image" content={pageData.og_image} />
        <meta
          property="og:url"
          content={`http://52.9.253.67:1600/page-seo/${id}`}
        />
      </Helmet>
      <h1>{pageData.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: pageData.content }} />
    </div>
  );
};

export default Page;
