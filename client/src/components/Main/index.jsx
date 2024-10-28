import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import Users from "../Users/Users";
import UsersData from "../Users/UsersData";
import CVForm from "./Form";
import defaultManImage from "./img/user-man.png";
import defaultWomanImage from "./img/user-woman.png";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Main = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [dane, ustawDane] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [loggedInUserId, setLoggedInUserId] = useState("");
  const [showCVForm, setShowCVForm] = useState(false);
  const [currentView, setCurrentView] = useState("home");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserProfile(token);
    } else {
      console.error("Token not found in localStorage");
      navigate("/login");
    }
  }, []);

  const fetchUserProfile = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/users/details",
        {
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );

      const userData = response.data.data;
      setUserDetails(userData);
      setProfileImage(
        userData.profileImage ||
          (userData.gender === "male" ? defaultManImage : defaultWomanImage)
      );
      setUserName(`${userData.firstName} ${userData.lastName}`);
      setJobPosition(userData.jobPosition || "");
      setLoggedInUserId(userData._id);

      console.log("User Data: ", userData);
      console.log("Work Position: ", userData.workExperience?.position);
    } catch (error) {
      handleErrors(error);
    }
  };

  const handleErrors = (error) => {
    if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status <= 500
    ) {
      navigate("/login");
    } else {
      console.error(error);
    }
  };

  const handleGetUsers = async (e) => {
    e.preventDefault();
    setUserDetails([]);
    setShowCVForm(false);
    setCurrentView("users");
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const config = {
          method: "get",
          url: "http://localhost:8080/api/users",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        };
        const { data: res } = await axios(config);
        ustawDane(res.data);
      } catch (error) {
        handleErrors(error);
      }
    } else {
      console.error("Token not found in localStorage");
      navigate("/login");
    }
  };

  const handleGetUserDetails = async (e) => {
    e.preventDefault();
    ustawDane([]);
    setShowCVForm(false);
    setCurrentView("userDetails");
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const config = {
          method: "get",
          url: "http://localhost:8080/api/users/details",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        };
        const { data: res } = await axios(config);
        setUserDetails(res.data);
        setLoggedInUserId(res.data._id);
      } catch (error) {
        handleErrors(error);
      }
    } else {
      console.error("Token not found in localStorage");
      navigate("/login");
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    ustawDane([]);
    setUserDetails([]);
    const token = localStorage.getItem("token");

    if (
      token &&
      window.confirm("Are you sure you want to delete your account?")
    ) {
      try {
        const config = {
          method: "delete",
          url: "http://localhost:8080/api/users/delete-account",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        };
        const { data: res } = await axios(config);
        alert(res.message);
        localStorage.removeItem("token");
        navigate("/login");
      } catch (error) {
        handleErrors(error);
      }
    } else {
      console.error("Token not found in localStorage");
      navigate("/login");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCVFormSubmit = (success) => {
    setShowCVForm(false);
    if (success) {
      toast.success("Data saved successfully!");
    } else {
      toast.error("There was an error saving the data.");
    }
  };

  const downloadCV = () => {
    console.log("Download CV button clicked");
    const cvElement = document.querySelector(`.${styles.cvContainer}`);
    if (cvElement) {
      console.log("CV container found");
      html2canvas(cvElement)
        .then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF();
          pdf.addImage(imgData, "PNG", 0, 0);
          pdf.save("CV.pdf");
        })
        .catch((error) => {
          console.error("Error generating PDF: ", error);
        });
    } else {
      console.error("CV container not found.");
    }
  };

  return (
    <div className={styles.main_container}>
      <div className={styles.leftSide}>
        <div className={styles.profile}>
          <img
            src={profileImage}
            alt="Profile"
            className={styles.profile_image}
          />
          <div className={styles.user_info}>
            <h2>{userName}</h2>
            <p>{jobPosition}</p>
            <div className={styles.social_media}>
              <a href="#link1">
                <i className="fab fa-linkedin fa-lg"></i>
              </a>
              <a href="#link2">
                <i className="fab fa-twitter fa-lg"></i>
              </a>
              <a href="#link3">
                <i className="fab fa-facebook fa-lg"></i>
              </a>
            </div>
            <br />
            <button className={styles.download_cv_btn} onClick={downloadCV}>
              Download CV
            </button>
          </div>
        </div>
        <footer className={styles.footer}>
          {"© 2020 All rights reserved."}
        </footer>
      </div>
      <div className={styles.centerSide}>
        {currentView === "home" ? (
          !showCVForm ? (
            <>
              <button
                className={styles.white_btn_welcome}
                onClick={() => setShowCVForm(true)}
              >
                <i className="fas fa-plus"></i>
              </button>
              <h3 className={styles.addEditWelcome}>Add/Edit your data</h3>
            </>
          ) : (
            <CVForm onSubmit={handleCVFormSubmit} />
          )
        ) : currentView === "users" ? (
          dane.length > 0 ? (
            <Users users={dane} />
          ) : null
        ) : currentView === "userDetails" ? (
          userDetails._id ? (
            <UsersData
              userDetails={userDetails}
              loggedInUserId={loggedInUserId}
            />
          ) : null
        ) : null}
      </div>
      <ToastContainer />
      <div className={styles.rightSideMenu}>
        <nav className={styles.navbar}>
          <button
            className={styles.white_btn}
            onClick={() => setCurrentView("home")}
          >
            <i className="fas fa-home"></i>
          </button>
          <button className={styles.white_btn} onClick={handleGetUsers}>
            <i className="fas fa-users"></i>
          </button>
          <button className={styles.white_btn} onClick={handleGetUserDetails}>
            <i className="fas fa-user"></i>
          </button>
          <button className={styles.white_btn} onClick={handleDeleteAccount}>
            <i className="fas fa-trash-alt"></i>
          </button>
          <button className={styles.white_btn} onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Main;
