import React, { useEffect, useRef, useState } from "react";
import "./styles/MainPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faCartShopping,
  faBars,
  faTimes,
  faRightFromBracket,
  faPenToSquare,
  faUserGear,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import VerifyModal from "./VerifyModal";
import { jwtDecode } from "jwt-decode";
import { loginSuccess, logout } from "../redux/actions/authActions";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

export default function MainPage({ switchTheme, theme }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModal2Open, setModal2Open] = useState(false);
  const [isVerifyModalOpen, setVerifyModalOpen] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState("");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [userId, setUserId] = useState(null);
  const [isModalUserOpen, setModalUserOpen] = useState(false);
  const [isModalUserLogoutOpen, setModalUserLogoutOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userGender, setUserGender] = useState("");
  const dispatch = useDispatch();

  const token = useSelector((state) => state.auth.token);
  const userId = useSelector((state) => state.auth.userId);
  const name = useSelector((state) => state.auth.fullname);
  const gender = useSelector((state) => state.auth.gender);
  const email = useSelector((state) => state.auth.email);
  const userRole = useSelector((state) => state.auth.role);
  const isLoggedIn = !!token;

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {

      
      dispatch(loginSuccess(token));
    }
  }, [dispatch]);

  // const handleLogout = () => {
  //   dispatch(logout());
  //   setModalUserLogoutOpen(false);
  // };

  // useEffect(() => {
  //   const token = Cookies.get("accessToken");
  //   if (token) {
  //     handleDecodeToken(token);
  //     console.log(token);
  //   }
  //   const storedUserName = Cookies.get("userFullName");
  //   const storedUserGender = Cookies.get("userGender");
  //   if (storedUserName) {
  //     setUserName(storedUserName);
  //   }
  //   if (storedUserGender) {
  //     setUserGender(storedUserGender);
  //   }
  // }, []);

  // const handleDecodeToken = (token) => {
  //   try {
  //     const decodedToken = jwtDecode(token);
  //     console.log(jwtDecode(token));
  //     const userId = decodedToken.userId;
  //     setUserId(userId);
  //     setIsLoggedIn(true);
  //     dispatch(loginSuccess(token, userId));
  //   } catch (error) {
  //     console.error("Error decoding token:", error);
  //   }
  // };

  const handleLogout = () => {
    setModalUserLogoutOpen(false);
    dispatch(logout());
    setUserId(null);
    setIsLoggedIn(false);
    setUserName("");
    setUserGender("");
    Cookies.remove("userFullName");
  };

  const handleVerificationSuccess = (userId) => {
    setUserId(userId);
    setIsLoggedIn(true);
    closeModalUser();
    setModalUserOpen(true);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const open2Modal = () => {
    setModal2Open(true);
  };

  const close2Modal = () => {
    setModal2Open(false);
  };

  const openModalUser = () => {
    setModalUserOpen(true);
    setModalUserLogoutOpen(false);
  };

  const closeModalUser = () => {
    setModalUserOpen(false);
  };

  const openModalUserLogout = () => {
    setModalUserLogoutOpen(true);
  };

  const closeModalUserlogout = () => {
    setModalUserLogoutOpen(false);
  };

  const openVerifyModal = (email) => {
    setEmailForVerification(email);
    setVerifyModalOpen(true);
  };

  const closeVerifyModal = () => {
    setVerifyModalOpen(false);
  };
  const handleUserUpdate = (e) => {
    e.preventDefault();
    fetch(
      `https://icon-karaoke-and-lounge-back.onrender.com/api/users/${email}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: userName,
          gender: userGender,
        }),
      }
    );

    closeModalUser();
    setModalUserOpen(false);
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      const response = await fetch(
        "https://icon-karaoke-and-lounge-back.onrender.com/api/otp/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      if (response.ok) {
        console.log("Email submitted successfully");
        setModal2Open(false);
        openVerifyModal(email);
      } else {
        console.error("Error submitting email");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const modalRef1 = useRef();
  const modalRef2 = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef1.current && !modalRef1.current.contains(event.target)) {
        setModalOpen(false);
      }
      if (modalRef2.current && !modalRef2.current.contains(event.target)) {
        setModal2Open(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prevState) => !prevState);
  };
  const { t, i18n } = useTranslation();

  const changeLang = async (lang) => {
    await i18n.changeLanguage(lang);
    setModalOpen(false);
  };
  return (
    <div className="mainPage" data-theme={theme}>
      <div className="desktop-version">
        <div className="header">
          <div className="mp-header-left-side">
            <div className="mp-header-left-side-top">
              <div className="time">
                <svg
                  className="svg"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#D9B852"
                >
                  <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Zm0-106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
                </svg>
                <p>09:00 - 23:00</p>
              </div>
              <div className="adress">
                <svg
                  className="svg"
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#D9B852"
                >
                  <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q0 133 93.5 226.5T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
                </svg>{" "}
                <p>{t("street")}</p>
              </div>
            </div>
            <hr />
          </div>
          <div className="header-logo">
            {" "}
            <img
              width={"200px"}
              height={"113px"}
              src="./assets/original-icon.png"
              alt=""
            />
          </div>
          <div className="header-right-side">
            <div className="header-right-side-top">
              {userRole === "Admin" ? (
                <Link to="/admin/orders">
                  <FontAwesomeIcon id="basketIcon" icon={faUserGear} />
                </Link>
              ) : null}
              <Link className="basket" to="/basket">
                <FontAwesomeIcon id="basketIcon" icon={faCartShopping} />
              </Link>
              {isLoggedIn ? (
                <button className="user" onClick={openModalUserLogout}>
                  <FontAwesomeIcon icon={faUser} />
                  <span>{name}</span>
                </button>
              ) : (
                <button id="log-in" className="user" onClick={open2Modal}>
                  <FontAwesomeIcon icon={faUser} />
                </button>
              )}
              <a
                href="https://api.whatsapp.com/send/?phone=%2B994553532243&text}"
                target="_blank"
              >
                <img className="call" src="./assets/call (1).png" />
              </a>
              <button className="language" onClick={openModal}>
                {" "}
                <span color="#D9B852"> {t("az")}</span>
                <svg
                  className="svg"
                  xmlns="http://www.w3.org/2000/svg"
                  height="20px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="#D9B852"
                >
                  <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                </svg>
              </button>
            </div>
            <button className="hamburger-menu" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <FontAwesomeIcon icon={faTimes} />
              ) : (
                <FontAwesomeIcon icon={faBars} />
              )}
            </button>
            <hr />
          </div>
        </div>
        <div className="menu-text">MENU</div>
        <div className="buttons">
          <button className="pdf">
            <a href="./assets/restaurant-menu.pdf" download="menu.pdf">
              {t("download pdf")}
            </a>
          </button>
          <Link className="menuLink" to="/menu">
            <motion.button>{t("go to menu")}</motion.button>
          </Link>
        </div>
      </div>
      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link className="basket" to="/basket">
              <FontAwesomeIcon icon={faCartShopping} />
            </Link>
          </li>
          <li>
            {isLoggedIn ? (
              <button className="user" onClick={openModalUserLogout}>
                <FontAwesomeIcon icon={faUser} />
                <span>{name}</span>
              </button>
            ) : (
              <button id="log-in" className="user" onClick={open2Modal}>
                <FontAwesomeIcon icon={faUser} />
              </button>
            )}
          </li>
          <li>
            <a
              href="https://api.whatsapp.com/send/?phone=%2B994553532243&text}"
              target="_blank"
            >
              <img className="call" src="./assets/call (1).png" alt="Call" />
            </a>
          </li>
          <li>
            <button className="language" onClick={openModal}>
              <span style={{ color: "#D9B852" }}>{t("az")}</span>
              <svg
                className="svg"
                xmlns="http://www.w3.org/2000/svg"
                height="20px"
                viewBox="0 -960 960 960"
                width="20px"
                fill="#D9B852"
              >
                <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
              </svg>
            </button>
          </li>
        </ul>
      </div>
      {isModal2Open && (
        <div id="myModal" className="modal2">
          <div className="modal-content2" ref={modalRef2}>
            <button className="close2" onClick={close2Modal}>
              &times;
            </button>
            <div className="modal_info2">
              <div className="choice2">{t("log in")}</div>
              <form onSubmit={handleSubmitEmail}>
                <input
                  type="email"
                  className="emailInput"
                  name="email"
                  placeholder={t("email")}
                  required
                />
                <div className="continue">
                  <button className="continueBtn" type="submit">
                    {t("continue")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div id="myModal" className="modal">
          <div className="modal-content" ref={modalRef1}>
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <div className="vaul-scrollable">
              <div className="rounded-top"></div>
            </div>
            <div className="modal_info">
              <div className="choice">{t("lang")}</div>
              <div className="country">
                <button onClick={() => changeLang("az")} className="flag">
                  <img
                    className="flagIcon"
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOu6G2l2JuTBzwvDDOiDlIN7D9W0bh7PP0NA&s"
                    alt="Azerbaijan Flag"
                  />
                  <span className="languages">Azərbaycanca</span>
                </button>
              </div>
              <div className="country">
                <button onClick={() => changeLang("en")} className="flag">
                  <img
                    className="flagIcon"
                    src="https://upload.wikimedia.org/wikipedia/commons/4/42/Flag_of_the_United_Kingdom.png"
                    alt="UK Flag"
                  />
                  <span className="languages">English</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {isVerifyModalOpen && (
        <VerifyModal
          isOpen={isVerifyModalOpen}
          onClose={closeVerifyModal}
          onSuccess={handleVerificationSuccess}
          email={emailForVerification}
        />
      )}
      {isModalUserOpen && (
        <div id="myModal" className="modal2">
          <div className="modal-content2">
            <button className="close2" onClick={closeModalUser}>
              &times;
            </button>
            <div className="modal_info2">
              <div className="choice2">{t("edit")}</div>
              <form onSubmit={handleUserUpdate}>
                <div className="userName">
                  <input
                    id="userName"
                    type="text"
                    placeholder={t("name n surname")}
                    name="name"
                    onChange={(e) => setUserName(e.target.value)}
                    value={userName}
                  ></input>
                </div>
                <div className="genders">
                  <div className="gender">
                    <label htmlFor="male">{t("male")}</label>
                    <input
                      type="radio"
                      name="gender"
                      id="male"
                      value="male"
                      checked={userGender === "male"}
                      onChange={() => setUserGender("male")}
                    ></input>
                  </div>
                  <div className="gender">
                    <label htmlFor="female">{t("famale")}</label>
                    <input
                      type="radio"
                      name="gender"
                      id="female"
                      value="female"
                      checked={userGender === "female"}
                      onChange={() => setUserGender("female")}
                    ></input>
                  </div>
                </div>
                <div className="continue">
                  <button className="continueBtn" id="conbtn" type="submit">
                    {t("remember me")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {isModalUserLogoutOpen && (
        <div id="myModal" className="modal2">
          <div className="modal-content2">
            <button className="close2" onClick={closeModalUserlogout}>
              &times;
            </button>
            <div className="modal_info2">
              <div className="choice2">{t("my acc")}</div>
              <div className="modal_info">
                <div className="account">
                  <button className="logout">
                    <FontAwesomeIcon className="bracket" icon={faPenToSquare} />
                    <span className="logoutText" onClick={openModalUser}>
                      {t("edit")}
                    </span>
                  </button>
                  <button className="logout" onClick={handleLogout}>
                    <FontAwesomeIcon
                      className="bracket"
                      icon={faRightFromBracket}
                    />
                    <span className="logoutText">{t("log out")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
