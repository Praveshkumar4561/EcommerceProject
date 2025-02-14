import { useState, useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import DynamicPage from "./DynamicPage";
import ErrorPage from "../errorpage/ErrorPage";

const DynamicRoutes = () => {
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    axios
      .get("http://89.116.170.231:1600/pagesdata")
      .then((res) => setRoutes(res.data.map((p) => p.name)))
      .catch(() => setRoutes([]));
  }, []);

  if (routes.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {routes.map((name) => (
        <Route
          key={name}
          path={`/${name}`}
          element={<DynamicPage name={name} />}
        />
      ))}

      <Route path="*" element={<Navigate to={<ErrorPage />} />} />
    </Routes>
  );
};

export default DynamicRoutes;
