import React, { useEffect, useRef, useState } from "react";
import "./styles/Basket.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faX, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Helmet } from "react-helmet";

export default function Basket() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModal2Open, setModal2Open] = useState(false);
  const [isBasketModalOpen, setBasketModalOpen] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const theOrders = useSelector((state) => state.orders);
  console.log(theOrders);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  let totalPrice = 0;
  const dispatch = useDispatch();

  const handleIncrement = (id) => {
    // if (!isAuthenticated) {
    //   alert("Lütfen sipariş vermek için giriş yapın.");
    //   return;
    // }
    dispatch({
      type: "INCREMENT_COUNT",
      payload: { _id: id },
    });
  };

  const handleDecrement = (id) => {
    dispatch({
      type: "DECREMENT_COUNT",
      payload: { _id: id },
    });
  };

  const handleRemoveFromBasket = (id) => {
    dispatch({ type: "REMOVE_FROM_ORDERS", payload: id });
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

  const openBasketModal = () => {
    if (!isAuthenticated) {
      alert("Sifariş vermək üçün giriş edin.");
      return;
    }
    setBasketModalOpen(true);
  };

  const closeBasketModal = () => {
    setBasketModalOpen(false);
  };

  const extractCountryAndNumber = (value) => {
    const countryLengths = {
      994: 12,
    };

    let countryCode = "";
    let phoneNumber = "";

    for (const code of Object.keys(countryLengths)) {
      if (value.startsWith(code)) {
        countryCode = code;
        phoneNumber = value.substring(code.length);
        break;
      }
    }

    return { countryCode, phoneNumber };
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    const { countryCode, phoneNumber } = extractCountryAndNumber(phoneValue);
    try {
      const response = await axios.post(
        "https://icon-kl-back.onrender.com/api/otp/send",
        { countryCode, phoneNumber }
      );
      console.log("Response:", response);
      if (response.status === 200) {
        console.log("Phone submitted successfully");
        setModal2Open(false);
        setModal2OpenNext(true);
        console.log(phoneValue);
      }
    } catch (error) {
      console.error("Error sending OTP", error);
    }

    console.log("Country Code:", countryCode);
    console.log("Phone Number:", phoneNumber);
  };
  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      const response = await fetch(
        "https://icon-kl-back.onrender.com/api/otp/send",
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

  const handleWhatsAppOrder = () => {
    if (!isAuthenticated) {
      alert("Lütfen sipariş vermek için giriş yapın.");
      return;
    }

    const orderDetails = theOrders
      .map((order, index) => {
        return `${index + 1}. ${order.name} - ${order.count} ədəd, ${
          order.price * order.count
        } AZN`;
      })
      .join("\n");

    let paymentText;
    if (paymentMethod === "cash") {
      paymentText = "Nagd ödəniş";
    } else {
      paymentText = "Kredit kartı ilə ödəniş";
    }

    let message = `Sifarişlər:\n${orderDetails}\nÖdəniş: ${paymentText}\nCəm: ${totalPrice} AZN`;

    const encodedMessage = encodeURIComponent(message);

    const whatsappLink = `https://api.whatsapp.com/send/?phone=%2B994553532243&text=${encodedMessage}`;

    window.open(whatsappLink, "_blank");
    setBasketModalOpen(false);
  };

  const { t, i18n } = useTranslation();

  const changeLang = async (lang) => {
    await i18n.changeLanguage(lang);
    setModalOpen(false);
  };

  return (
    <motion.div
      className="main-container2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", mass: 1, stiffness: 80, damping: 20 }}
    >
      <Helmet>
        <title>Basket</title>
        <meta name="description" content="Your basket items." />
      </Helmet>
      <div className="responsive-header">
        <div className="main-icon-basket">
          <img
            width={"100px"}
            height={"50px"}
            src="./assets/original-icon.png"
            alt="icon"
          />
        </div>
        <Link to="/menu">
          <svg
            className="back-arrow"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 19L5 12L12 5"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Link>
      </div>
      <div className="basket-header">
        <div className="basket-header-left-side">
          <div className="basket-header-left-side-top">
            <div className="basket-time">
              <svg
                className="svg"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#D9B852"
              >
                <path d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z" />
              </svg>
              <p>09:00 - 23:00</p>
            </div>
            <div className="basket-adress">
              <svg
                className="svg"
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#D9B852"
              >
                <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
              </svg>{" "}
              <p>{t("street")}</p>
            </div>
          </div>
          <hr />
        </div>
        <Link className="basket-header-logo" to="/">
          {" "}
          <img
            width={"200px"}
            height={"113px"}
            src="./assets/original-icon.png"
            alt="icon"
          />
        </Link>
        <div className="basket-header-right-side">
          <div className="basket-header-right-side-top">
            {/* <button id="log-in" className="user" onClick={open2Modal}>
              <FontAwesomeIcon icon={faUser} />
            </button> */}
            <button className="basket-language" onClick={openModal}>
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
            <div className="basket-phone" color="#D9B852">
              *9898
            </div>
          </div>
          <hr />
        </div>
      </div>
      <div className="basket_main">
        <div className="basketOrders">
          {theOrders.length === 0 ? (
            <div className="empty-basket">
              <div id="empty">
                <img className="empty" src="./assets/cart.fill (2).png" alt="cart" />
                <div className="texts">
                  <div id="emptyText">{t("pls")}</div>
                  <div id="emptyText">{t("add product")}</div>
                </div>
              </div>
              <Link className="goToMenuLink" to="/menu">
                {t("go to menu")}
              </Link>
            </div>
          ) : (
            <div className="basket-left-side">
              {theOrders.map((order, index) => {
                const foundProduct = theOrders.find(
                  (item) => item._id === order._id
                );
                totalPrice +=
                  order.price * (foundProduct ? foundProduct.count : 1);

                return (
                  <div className="basket-item" key={index}>
                    <div className="order-container">
                      <div className="item-image">
                        {order.image ? (
                          <div className="image">
                            <img
                              className="itemImg"
                              src={order.image}
                              alt={order.name}
                            />
                          </div>
                        ) : (
                          <img
                            className="item-no-img"
                            src={"./assets/no-image.png"}
                            alt={order.name}
                          />
                        )}
                      </div>
                      <div className="item-info">
                        <div className="item-details">
                          <p className="item-name">{foundProduct.name}</p>
                          <span className="description2">
                            Lorem ipsum dolor sit amet.
                          </span>
                        </div>
                        <div className="counter">
                          <div className="counter-main">
                            <button
                              id="count"
                              className="count-decrement-basket"
                              onClick={() => handleDecrement(order._id)}
                            >
                              {foundProduct && foundProduct.count > 1 ? (
                                "-"
                              ) : (
                                <button
                                  onClick={() =>
                                    handleRemoveFromBasket(order._id)
                                  }
                                >
                                  <img src="./assets/trash-icon.png" alt="remove" />
                                </button>
                              )}
                            </button>

                            <div className="item-count">
                              {foundProduct ? foundProduct.count : 1}
                            </div>
                            <button
                              id="count"
                              className="count-increment-basket"
                              onClick={() => handleIncrement(order._id)}
                            >
                              +
                            </button>
                          </div>
                          <div className="item-total-price">
                            {order.price *
                              (foundProduct ? foundProduct.count : 0)}{" "}
                            ₼
                          </div>
                        </div>
                      </div>
                      <div className="icons">
                        <button className="faPen">
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button
                          className="remove"
                          onClick={() => handleRemoveFromBasket(order._id)}
                        >
                          <FontAwesomeIcon icon={faX} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="complete-order">
                <button onClick={openBasketModal}>{t("complete")}</button>
                <FontAwesomeIcon icon={faArrowRight} />
              </div>
            </div>
          )}
        </div>

        {theOrders.length === 0 ? (
          <div className="payment">
            <h1 className="promoText"> {t("promo code")}</h1>
            <div className="promoCode">
              <input
                className="code-disabled"
                type="text"
                placeholder={t("p-code")}
                disabled
              ></input>
              <button className="promoButton-disabled" disabled>
                {t("apply")}
              </button>
            </div>
            <div className="pay">
              <p className="method">{t("select a payment method")}</p>
              <div className="checkboxs-disabled">
                <div>
                  <input
                    type="radio"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                    name="radio"
                    id="radio1"
                    className="radio"
                    disabled
                  />
                  <label htmlFor="radio1">
                    <span className="credit"> {t("cash payment")}</span>
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    checked={paymentMethod === "creditCard"}
                    onChange={() => setPaymentMethod("creditCard")}
                    name="radio"
                    id="radio2"
                    className="radio"
                    disabled
                  />
                  <label htmlFor="radio2">
                    <span className="credit">{t("credit card")}</span>
                  </label>
                </div>
              </div>
              <div className="totalPrice">
                {t("total price")} <b>{totalPrice} ₼</b>{" "}
              </div>
              <button
                className="wp-order-disabled"
                onClick={handleWhatsAppOrder}
                disabled
              >
                {t("order")}
              </button>
            </div>
          </div>
        ) : (
          <div className="payment">
            <h1 className="promoText">{t("promo code")}</h1>
            <div className="promoCode">
              <input
                className="code"
                type="text"
                placeholder={t("p-code")}
              ></input>
              <button className="promoButton"> {t("apply")}</button>
            </div>
            <div className="pay">
              <p className="method">{t("select a payment method")}</p>
              <div className="checkboxs">
                <div>
                  <input
                    type="radio"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                    name="radio"
                    id="radio1"
                    className="radio"
                  />
                  <label htmlFor="radio1">
                    <span className="credit">{t("cash payment")}</span>
                  </label>
                </div>
                <div>
                  <input
                    type="radio"
                    checked={paymentMethod === "creditCard"}
                    onChange={() => setPaymentMethod("creditCard")}
                    name="radio"
                    id="radio2"
                    className="radio"
                  />
                  <label htmlFor="radio2">
                    <span className="credit">{t("credit card")}</span>
                  </label>
                </div>
              </div>
              <div className="totalPrice">
                {t("total price")} <b>{totalPrice} ₼</b>{" "}
              </div>
              <button className="wp-order" onClick={handleWhatsAppOrder}>
                {t("order")}
              </button>
            </div>
          </div>
        )}
      </div>

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
              <div className="choice">Dil seçimi</div>
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
      {isModal2Open && (
        <div id="myModal" className="modal2">
          <div className="modal-content2" ref={modalRef2}>
            <button className="close2" onClick={close2Modal}>
              &times;
            </button>
            <div className="modal_info2">
              <div className="choice2">Giriş et</div>
              {/* <form onSubmit={handlePhoneSubmit}>
                <PhoneInput
                  className="phoneInput"
                  international
                  countryCallingCodeEditable={false}
                  defaultCountry="AZ"
                  value={phoneValue}
                  onChange={setPhoneValue}
                />
                <p className="phoneNumber">
                  Telefon nömrənizi doğrulamaq üçün kod göndərəcəyik
                </p>
                <div className="continue">
                  <button className="continueBtn" type="submit">
                    Davam et
                  </button>
                </div>
              </form> */}
              <form onSubmit={handleSubmitEmail}>
                <input
                  type="email"
                  className="emailInput"
                  name="email"
                  placeholder="E-mailinizi daxil edin"
                  required
                />
                <div className="continue">
                  <button className="continueBtn" type="submit">
                    Davam et
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {isBasketModalOpen && (
        <div className="pop-up-payment">
          <button onClick={closeBasketModal} className="close-payment">
            x
          </button>
          <h1 className="promoText">{t("promo code")}</h1>
          <div className="promoCode">
            <input
              className="code"
              type="text"
              placeholder={t("p-code")}
            ></input>
            <button className="promoButton"> {t("apply")}</button>
          </div>
          <div className="pay">
            <p className="method">{t("select a payment method")}</p>
            <div className="checkboxs">
              <div>
                <input
                  type="radio"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  name="radio"
                  id="radio1"
                  className="radio"
                />
                <label htmlFor="radio1">
                  <span className="credit">{t("cash payment")}</span>
                </label>
              </div>
              <div>
                <input
                  type="radio"
                  checked={paymentMethod === "creditCard"}
                  onChange={() => setPaymentMethod("creditCard")}
                  name="radio"
                  id="radio2"
                  className="radio"
                />
                <label htmlFor="radio2">
                  <span className="credit">{t("credit card")}</span>
                </label>
              </div>
            </div>
            <div className="totalPrice">
              {t("total price")}
              <b>{totalPrice} ₼</b>{" "}
            </div>
            <button className="wp-order" onClick={handleWhatsAppOrder}>
              {t("order")}

              {t("add to basket")}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
