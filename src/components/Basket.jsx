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
import { loginSuccess } from "../redux/actions/authActions";
import Cookies from "js-cookie";
import { notification } from "antd";

export default function Basket() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isModal2Open, setModal2Open] = useState(false);
  const [isBasketModalOpen, setBasketModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const theOrders = useSelector((state) => state.orders);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userId = useSelector((state) => state.auth.userId);
  const { token } = useSelector((state) => state.auth);
  const [promoCode, setPromoCode] = useState("");
  const [isPromoCodeValid, setIsPromoCodeValid] = useState(false);
  const [promoCodeError, setPromoCodeError] = useState("");
  const [promoCodeId, setPromoCodeId] = useState("");
  const [discount, setDiscount] = useState(null);
  const [api, contextHolder] = notification.useNotification();

  let totalPrice = 0;
  const dispatch = useDispatch();

  const promocodeApplied = (type) => {
    api[type]({
      message: type,
      description:
        type === "success"
          ? "Promokod tətbiq edildi!"
          : "Promo kodu tətbiq edilmədi. Xahiş edirik, kodu yoxlayın",
    });
  };

  const handleIncrement = (id) => {
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

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      dispatch(loginSuccess(token));
    }
  }, [dispatch]);

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

  const applyPromoCode = async () => {
    if (!promoCode) {
      setPromoCodeError("Promokodu daxil edin!");
      return;
    }

    try {
      const response = await fetch(
        "https://icon-kl-back.onrender.com/api/promocodes/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code: promoCode }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsPromoCodeValid(true);
        setPromoCodeError("");
        promocodeApplied("success");
        setDiscount(data?.promocode?.discount);
        setPromoCodeId(data?.promocode?._id);
      } else {
        const errorData = await response.json();
        setIsPromoCodeValid(false);
        setPromoCodeError(
          errorData.error.message ||
            "Promo kodu tətbiq edilmədi. Xahiş edirik, kodu yoxlayın."
        );
        promocodeApplied("error");
      }
    } catch (error) {
      promocodeApplied("error");
    }
  };

  const handleOrderSubmit = async () => {
    if (!isAuthenticated) {
      alert("Sifariş vermək üçün giriş edin.");
      return;
    }

    if (promoCode && !isPromoCodeValid) {
      alert("Promo kodu təsdiqlənmədi. Sifarişi göndərə bilmirsiniz.");
      return;
    }

    const orderItems = theOrders.map((order) => ({
      itemId: order._id,
      itemCount: order.count,
    }));

    const calculatedTotalPrice = theOrders.reduce(
      (acc, order) => acc + order.price * order.count,
      0
    );

    const discountedTotalPrice = discount
      ? calculatedTotalPrice - calculatedTotalPrice * (discount / 100)
      : calculatedTotalPrice;

    const orderData = {
      amount: discountedTotalPrice,
      items: orderItems,
      paymentMethod: paymentMethod,
      orderByUserId: userId,
      promocodeId: promoCodeId,
    };
    console.log(orderData);

    try {
      const response = await fetch(
        "https://icon-karaoke-and-lounge-back.onrender.com/api/orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(orderData),
        }
      );

      if (response.ok) {
        console.log("Order placed successfully");
        setBasketModalOpen(false);

        const orderDetails = theOrders
          .map(
            (order, index) =>
              `${index + 1}. ${order.name} - ${order.count} ədəd, ${
                order.price * order.count
              } AZN`
          )
          .join("\n");

        const paymentText =
          paymentMethod === "cash" ? "Nagd ödəniş" : "Kredit kartı ilə ödəniş";

        const message = `Sifarişlər:\n${orderDetails}\nÖdəniş: ${paymentText}\nCəm: ${discountedTotalPrice} AZN`;

        alert(message);
      } else {
        console.error("Error placing order:", response.statusText);
        alert(
          "Sifarişinizi yerləşdirməkdə problem yaşandı. Xahiş edirik yenidən cəhd edin."
        );
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert(
        "Sifarişinizi yerləşdirməkdə problem yaşandı. Xahiş edirik yenidən cəhd edin."
      );
    }
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
                <img
                  className="empty"
                  src="./assets/cart.fill (2).png"
                  alt="cart"
                />
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
                            {order.ingredients && order.ingredients.length > 0
                              ? order.ingredients.join(", ")
                              : "-"}
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
                                  <img
                                    src="./assets/trash-icon.png"
                                    alt="remove"
                                  />
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
                          {/* <FontAwesomeIcon icon={faPen} /> */}
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
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              ></input>
              <button
                onClick={applyPromoCode}
                className="promoButton-disabled"
                disabled
              >
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
              <button className="wp-order" onClick={handleOrderSubmit}>
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
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              ></input>
              <button onClick={applyPromoCode} className="promoButton">
                {" "}
                {t("apply")}
              </button>
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
              <button className="wp-order" onClick={handleOrderSubmit}>
                {t("order")}
              </button>
            </div>
          </div>
        )}
      </div>
      {contextHolder}
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
              value={promoCode}
              onChange={() => setPromoCode(e.target.value)}
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
            <button className="wp-order" onClick={handleOrderSubmit}>
              {t("order")}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
