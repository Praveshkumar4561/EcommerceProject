import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const NewsletterPopup = ({ currentPage }) => {
  const [letter, setLetter] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchNewsletter = async () => {
      try {
        const response = await fetch(
          "http://89.116.170.231:1600/themenewsdata"
        );
        const data = await response.json();

        if (data.status === "success" && data.newsletter) {
          if (
            data.newsletter.display_option === "All Pages" ||
            (data.newsletter.display_option === "Homepage" &&
              currentPage === "home")
          ) {
            const dontShowPopup = localStorage.getItem("dontShowPopup");
            if (!dontShowPopup) {
              setLetter([data.newsletter]);
              setIsVisible(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching newsletter:", error);
      }
    };
    fetchNewsletter();
  }, [currentPage]);

  const handleClosePopup = () => {
    setIsVisible(false);
  };

  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      localStorage.setItem("dontShowPopup", "true");
    } else {
      localStorage.removeItem("dontShowPopup");
    }
  };

  return isVisible && letter.length > 0 ? (
    <div className="container-fluid newsletter-container">
      <div className="container d-flex justify-content-center">
        {letter.map((data, key) => (
          <div
            className="row d-flex flex-row ms-0 newsletter-popup flex-md-wrap"
            key={key}
          >
            <div className="col-12 col-md-6 col-lg-6 p-0 newsletter-popup1 d-none d-lg-block d-md-block">
              <FontAwesomeIcon
                icon={faXmark}
                className="fs-3 mt-2 d-lg-none close-popup"
                onClick={handleClosePopup}
                style={{
                  cursor: "pointer",
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  zIndex: 1000,
                }}
              />
              <img
                src={
                  data.image
                    ? `http://89.116.170.231:1600/src/image/${data.image}`
                    : "/default-popup.jpg"
                }
                alt="Newsletter"
                className="img-fluid image-theme"
              />
            </div>
            <div className="col-12 col-md-6 col-lg-6 text-dark py-md-4 d-flex align-items-start text-start py-md-0 py-4 py-lg-3 news-now bg-light">
              <div className="ms-lg-3 ms-0">
                <div className="d-flex justify-content-end align-items-end">
                  <FontAwesomeIcon
                    icon={faXmark}
                    className="fs-3 close-popup"
                    onClick={handleClosePopup}
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="mt-lg-4 mt-0">
                  <span>{data.popup_subtitle}</span>
                  <h3 className="fw-bold">{data.popup_title}</h3>
                  <span>{data.popup_description}</span>
                  <form>
                    <label>
                      Email Address{" "}
                      <span className="text-danger fw-bold">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="Enter Your Email"
                      className="form-control py-4 mt-2"
                    />
                    <button className="btn btn-success mt-3 w-100 py-3">
                      Subscribe
                    </button>
                    <div className="d-flex flex-row flex-nowrap mt-2 ms-1 align-items-center">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="dontShowPopup"
                        onChange={handleCheckboxChange}
                      />
                      <label htmlFor="dontShowPopup" className="ms-2 pt-1">
                        Don't show this popup again
                      </label>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null;
};

export default NewsletterPopup;
