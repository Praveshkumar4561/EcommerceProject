import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ThemeManager.css";
import { ThemeIntegration } from "./ThemeIntegration";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ThemeManager = () => {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activating, setActivating] = useState(null);
  const [uploadData, setUploadData] = useState({ name: "", file: null });

  useEffect(() => {
    loadThemes();
  }, []);

  const loadThemes = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://147.93.45.171:1600/themes");
      console.log("API Response:", response);

      let themesData = [];

      if (response.data && response.data.themes) {
        themesData = response.data.themes;
      } else if (Array.isArray(response.data)) {
        themesData = response.data;
      } else if (response.data && typeof response.data === "object") {
        themesData = Object.values(response.data);
      }

      console.log("Processed themes:", themesData);
      setThemes(themesData);
      return themesData;
    } catch (error) {
      console.error("Error loading themes:", error);
      toast.error("Failed to load themes. Please try again.");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadData.name.trim() || !uploadData.file) {
      toast.error("Please provide both theme name and zip file");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("name", uploadData.name.trim());
    formData.append("theme", uploadData.file);

    try {
      const response = await axios.post(
        "http://147.93.45.171:1600/themes/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Theme uploaded successfully");
        await loadThemes();
        setUploadData({ name: "", file: null });
        e.target.reset();
      } else {
        throw new Error(response.data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.response?.data?.error || "Failed to upload theme");
    } finally {
      setUploading(false);
    }
  };

  const handleActivate = async (themeId) => {
    try {
      setActivating(themeId);
      const response = await axios.post(
        `http://147.93.45.171:1600/themes/${themeId}/activate`
      );

      if (response.data && response.data.success) {
        const themeData = response.data.theme || {};
        toast.success("Theme activated successfully");

        try {
          await ThemeIntegration.applyThemeToFrontend(themeId);
          window.location.href = `http://demo.webriefly.com/theme/${
            themeData.folder_name || themeData.name || themeId
          }`;
        } catch (themeError) {
          console.error("Error applying theme:", themeError);
          await loadThemes();
        }
      } else {
        throw new Error(response.data.error || "Activation failed");
      }
    } catch (error) {
      console.error("Activation error:", error);
      toast.error(error.response?.data?.error || "Failed to activate theme");
    } finally {
      setActivating(null);
    }
  };

  const handlePreview = (theme) => {
    if (!theme.folder_name) {
      toast.error("Cannot preview: Theme folder name is missing");
      return;
    }
    window.open(
      `http://147.93.45.171:1600/themes/${theme.folder_name}/index.html`,
      "_blank"
    );
  };

  return (
    <div className="theme-manager">
      <div className="theme-upload card mb-4">
        <div className="card-body">
          <h3 className="card-title">Upload New Theme</h3>
          <form onSubmit={handleUpload}>
            <div className="mb-3">
              <label htmlFor="themeName" className="form-label">
                Theme Name
              </label>
              <input
                type="text"
                id="themeName"
                className="form-control"
                placeholder="Enter theme name"
                value={uploadData.name}
                onChange={(e) =>
                  setUploadData({ ...uploadData, name: e.target.value })
                }
                disabled={uploading}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="themeFile" className="form-label">
                Theme ZIP File
              </label>
              <input
                id="themeFile"
                type="file"
                className="form-control"
                accept=".zip"
                onChange={(e) =>
                  setUploadData({ ...uploadData, file: e.target.files[0] })
                }
                disabled={uploading}
                required
              />
              <div className="form-text">
                Upload a ZIP file containing your theme files
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                uploading || !uploadData.name.trim() || !uploadData.file
              }
            >
              {uploading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Uploading...
                </>
              ) : (
                "Upload Theme"
              )}
            </button>
          </form>
        </div>
      </div>

      <div className="themes-list">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Installed Themes</h3>
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={loadThemes}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {loading && themes.length === 0 ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading themes...</span>
            </div>
            <p className="mt-2">Loading themes...</p>
          </div>
        ) : (
          <div className="row g-4">
            {themes.length > 0 ? (
              themes.map((theme) => (
                <div key={theme.id} className="col-md-6 col-lg-4">
                  <div
                    className={`card h-100 ${
                      theme.is_active ? "border-success" : ""
                    }`}
                  >
                    <div className="card-body d-flex flex-column">
                      <div className="theme-preview mb-3 text-center">
                        {theme.preview_url ? (
                          <img
                            src={theme.preview_url}
                            alt={`${theme.name} preview`}
                            className="img-fluid rounded"
                            style={{ maxHeight: "200px" }}
                          />
                        ) : (
                          <div className="bg-light p-5 text-center text-muted">
                            <i className="bi bi-image fs-1"></i>
                            <p className="mt-2 mb-0">No preview available</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-auto">
                        <h5 className="card-title">
                          {theme.name}
                          {theme.is_active && (
                            <span className="badge bg-success ms-2">
                              Active
                            </span>
                          )}
                        </h5>
                        {theme.description && (
                          <p className="card-text text-muted small">
                            {theme.description}
                          </p>
                        )}
                        <div className="d-flex gap-2 mt-3">
                          <button
                            onClick={() => handlePreview(theme)}
                            className="btn btn-outline-primary btn-sm"
                          >
                            <i className="bi bi-eye me-1"></i> Preview
                          </button>
                          {!theme.is_active && (
                            <button
                              onClick={() => handleActivate(theme.id)}
                              className="btn btn-success btn-sm"
                              disabled={activating === theme.id}
                            >
                              {activating === theme.id ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  Activating...
                                </>
                              ) : (
                                <>
                                  <i className="bi bi-check-circle me-1"></i>{" "}
                                  Activate
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  No themes installed yet. Upload a theme to get started.
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThemeManager;
