import React, { useEffect, useRef, useState } from "react";
import "./styles/Menu.css";
import { Link } from "react-router-dom";
import "rsuite/dist/rsuite.css";
import { FreeMode, Keyboard, Mousewheel } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { useDispatch } from "react-redux";
import { Pagination, Stack } from "@mui/material";
import {
  incrementCount,
  decrementCount,
  addToOrder,
} from "./../redux/actions/action";
import { motion } from "framer-motion";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import debounce from "lodash.debounce";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

export default function Menu() {
  const [input, setInput] = useState("");
  const [isModal4Open, setModal4Open] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalPrdctOpen, setModalPrdctOpen] = useState(false);
  const dispatch = useDispatch();
  const [expanded, setExpanded] = React.useState(false);
  const [activeTab, setActiveTab] = useState({});
  const [tabButtonStatus, setTabButtonStatus] = useState(false);
  const [items, setItems] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);



  const handleAddToCartFromSearchList = (product) => {
    dispatch(addToOrder({ ...product, count: 1 }));
    setCountNumber(1);
  };

  const [categories, setCategories] = useState([]);
  const [nextPage, setNextPage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage, setCategoriesPerPage] = useState(4);

  useEffect(() => {
    const updateCategoriesPerPage = () => {
      if (window.innerWidth > 1024) {
        setCategoriesPerPage(4);
      } else if (window.innerWidth > 430) {
        setCategoriesPerPage(6);
      } else {
        setCategoriesPerPage(19);
      }
    };
    updateCategoriesPerPage();
    window.addEventListener("resize", updateCategoriesPerPage);

    return () => {
      window.removeEventListener("resize", updateCategoriesPerPage);
    };
  }, []);

  const indexOfLastCategories = currentPage * categoriesPerPage;
  const indexOfFirstCategories = indexOfLastCategories - categoriesPerPage;
  const currentItems = categories.slice(
    indexOfFirstCategories,
    indexOfLastCategories
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(categories.length / categoriesPerPage); i++) {
    pageNumbers.push(i);
  }

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
    console.log(`Page changed to: ${pageNumber}`);
  };

  const openModal = (product) => {
    setActiveProduct(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalPrdctOpen(false);
  };

  const openPrdctModal = (product) => {
    setActiveProduct(product);
    setModalPrdctOpen(true);
  };

  const closePrdctModal = () => {
    setModalPrdctOpen(false);
    setActiveProduct(null);
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
        closePrdctModal();
      }
      if (
        filterModalRef.current &&
        !filterModalRef.current.contains(event.target)
      ) {
        setModal4Open(false);
      }
      if (
        detailsModalRef.current &&
        !detailsModalRef.current.contains(event.target)
      ) {
        setModalPrdctOpen(false);
      }
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target)
      ) {
        setSearchListVisible(isSearchListVisible);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleExpanded = () => {
    setExpanded(!expanded);
    setSearchListVisible(!isSearchListVisible);
  };

  const handleClickOutside = (event) => {};
  const searchBoxRef = useRef();
  const modalRef = useRef();
  const filterModalRef = useRef();
  const detailsModalRef = useRef();

  const [sliderValue, setSliderValue] = useState([1, 25]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const names = [
    "Qabıqlı balıqlar",
    "Yumurta",
    "Balıq",
    "Süd",
    "Fıstıq",
    "Soya",
    "Qoz-fındıq",
    "Buğda",
    "Qlütenli taxıllar",
    "Sulfitlər",
    "Qarabaşaq yarması",
    "Kərəviz",
    "Acıpaxla",
    "Molyusklar qabıqlı balıqlar",
    "Xardal",
    "Küncüt",
  ];
  function getStyles(name, personName) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
    };
  }

  const [personName, setPersonName] = React.useState([]);

  const resetFilters = () => {
    setActiveButtons([false, false, false, false, false]);
    setPersonName([]);
    setSliderValue([1, 25]);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(typeof value === "string" ? value.split(",") : value);
  };

  const tabClickHandler = (name) => {
    setCurrentPage(1);
    const selectedItem = categories.find((category) => category.name === name);
    if (selectedItem) {
      setActiveTab(selectedItem);
    }
  };

  const tabButtonsHandler = () =>
    setTabButtonStatus((prevStatus) => !prevStatus);

  const isActive = (name) => {
    return activeTab.name === name;
  };

  const open4Modal = () => {
    setModal4Open(true);
  };

  const close4Modal = () => {
    setModal4Open(false);
  };

  const [activeButtons, setActiveButtons] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);

  const handleButtonClick = (index) => {
    const newActiveButtons = [...activeButtons];
    newActiveButtons[index] = !newActiveButtons[index];
    setActiveButtons(newActiveButtons);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  const fetchData = async (value) => {
    try {
      const response = await fetch(
        `https://icon-karaoke-and-lounge-back.onrender.com/api/categories-with-items`
      );
      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Data is not in expected format (array)");
      }

      const items = [];

      data.forEach((category) => {
        if (category.items && Array.isArray(category.items)) {
          category.items.forEach((item) => {
            if (
              item.name &&
              item.name.toLowerCase().includes(value.toLowerCase())
            ) {
              items.push(item);
            }
          });
        }
      });

      setItems(items);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const debouncedFetchData = debounce(fetchData, 300);

  const handleKeyUp = (event) => {
    const value = event.target.value;
    setInput(value);

    if (value) {
      debouncedFetchData(value);
    } else {
      setItems([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [isSearchListVisible, setSearchListVisible] = useState(false);

  const [countNumber, setCountNumber] = useState(1);

  const handleIncrement = () => {
    setCountNumber(countNumber + 1);
  };

  const handleDecrement = () => {
    if (countNumber > 1) {
      setCountNumber(countNumber - 1);
    }
  };

  const handleAddToCart = () => {
    if (activeProduct) {
      dispatch(addToOrder({ ...activeProduct, count: countNumber }));
      setCountNumber(1);
      setModalPrdctOpen(false);
      console.log(setCountNumber);
    }
  };

  useEffect(() => {
    fetch(
      "https://icon-karaoke-and-lounge-back.onrender.com/api/categories-with-items"
    )
      .then((response) => response.json())
      .then((data) => {
        setActiveTab(data.length > 0 ? data[0] : null);
        if (data.length > 0 && data[0].items.length > 0) {
          setActiveProduct(data[0].items[0]);
        }
        data.forEach((category) => {
          setCategories(data);
          const allItems = data.reduce((accumulator, category) => {
            return [...accumulator, ...category.items];
          }, []);
          setItems(allItems);
        });
      });
  }, []);

  const { t, i18n } = useTranslation();

  const changeLang = async (lang) => {
    await i18n.changeLanguage(lang);
    setModalOpen(false);
  };

  return (
    <div className={`main-container `}>
      <Helmet>
        <title>Menu</title>
        <meta name="description" content="Explore our delicious menu." />
      </Helmet>
      <div className="menu-header">
        <div className="main-icon-menu">
          <img
            width={"100px"}
            height={"50px"}
            src="./assets/original-icon.png"
            alt="icon"
          />
        </div>
        <div className="header-left-side">
          <div className="header-left-side-top">
            <div className="time">
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
              <p id="time">09:00 - 23:00</p>
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
                <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
              </svg>{" "}
              <p id="time">{t("street")}</p>
            </div>
          </div>
          <motion.hr
            className="hr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1 } }}
            exit={{ opacity: 0 }}
          />
        </div>
        <div className="menu-header-text">Menu</div>
        <div className="header-right-side">
          <div className="header-right-side-top">
            <div ref={searchBoxRef} className={`${expanded ? "expanded" : ""}`}>
              <div className="search-box">
                <button
                  type="button"
                  className="btn-search"
                  onClick={toggleExpanded}
                >
                  <img src="./assets/search (1).png" alt="search" />
                </button>
                <input
                  type="text"
                  className="input-search"
                  placeholder={t("search")}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyUp={handleKeyUp}
                />
              </div>

              <div
                style={{ display: isSearchListVisible ? "block" : "none" }}
                className="search-list"
              >
                {items.map((meal) => (
                  <div key={meal._id}>
                    <div className="search-list-item">
                      <div className="search-list-content">
                        <h5>{meal.name}</h5>
                        <p>{meal.price} ₼</p>
                      </div>
                      <button
                        onClick={() => handleAddToCartFromSearchList(meal)}
                      >
                        <FontAwesomeIcon
                          className="search-list-image"
                          icon={faCartShopping}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={open4Modal}>
              <img className="filter-icon" src="./assets/align-right.png" alt="filter" />
            </button>
          </div>
          <motion.hr
            className="hr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 1 } }}
            exit={{ opacity: 0 }}
          />
        </div>
      </div>
      <div className="responsiveHeader">
        <Link to="/">
          <svg
            className="back-arrow-menu"
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
        <div id="searchFilter">

          <button onClick={open4Modal}>
            <img className="filter-icon" src="./assets/align-right.png"alt="filter" />
          </button>
        </div>
      </div>

      <div className="mealsOptions">
        <Swiper
          slidesPerView={"auto"}
          spaceBetween={10}
          freeMode={true}
          keyboard={{
            enabled: true,
            onlyInViewport: false,
          }}
          mousewheel={{
            forceToAxis: true,
          }}
          simulateTouch={true}
          touchReleaseOnEdges={true}
          modules={[FreeMode, Keyboard, Mousewheel]}
          className={`mySwiper `}
        >
          {categories.map((category) => (
            <SwiperSlide key={category._id} className="swiper-slide-auto">
              <button
                className={`meal tabs-button ${
                  isActive(category.name) ? "tabs-active" : ""
                }`}
                onClick={() => {
                  scrollToSection(category.name);
                  tabClickHandler(category.name);
                  tabButtonsHandler();
                }}
              >
                {category?.name}
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="productsList">
        {activeTab && activeTab.items && (
          <div
            className={`category ${isActive(activeTab.name) ? "active" : ""}`}
          >
            <div className="food">
              {activeTab.items
                .slice(
                  (currentPage - 1) * categoriesPerPage,
                  currentPage * categoriesPerPage
                )
                .map((items) => (
                  <div className="cart" key={items._id}>
                    {items.image ? (
                      <div className="image">
                        <img
                          className="foodImg"
                          src={items.image}
                          alt={items.name}
                        />
                      </div>
                    ) : (
                      <img
                        className="noImage"
                        src={"./assets/uil_restaurant.png"}
                        alt={items.name}
                      />
                    )}
                    <div className="namePrice">
                      <span className="foodName">{items.name}</span>
                      <span className="description">
                        {items.ingredients && items.ingredients.length > 0
                          ? items.ingredients.join(", ")
                          : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem."}
                      </span>

                      <button
                        className="price"
                        onClick={() => openPrdctModal(items)}
                      >
                        {items.price} ₼
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <div className="pagination">
        <Stack>
          {activeTab.items && (
            <Pagination
              count={Math.ceil(activeTab.items.length / categoriesPerPage)}
              page={currentPage}
              variant="outlined"
              onChange={(event, page) => {
                handlePageClick(page);
                scrollToTop();
              }}
              style={
                Math.ceil(activeTab.items.length / categoriesPerPage) === 1
                  ? { visibility: "hidden" }
                  : null
              }
            />
          )}
        </Stack>
      </div>

      <div>
        <Link to="/basket">
          <div className="basket2">
            <img src="./assets/shopping-cart.png" alt="cart"
            />
          </div>
        </Link>
      </div>

      {modalPrdctOpen && (
        <div
          id="myModal"
          className="product-detail-modal"
          ref={detailsModalRef}
        >
          <div className="modal-content-product">
            <div
              id="myModal"
              className="product-detail-modal"
              ref={detailsModalRef}
            >
              <div className="modal-content-product">
                <span
                  className="product-details-close"
                  onClick={closePrdctModal}
                >
                  &times;
                </span>
                <div className="modal_infoPrdct">
                  {activeProduct && activeProduct.image ? (
                    <img
                      className="productImg"
                      src={activeProduct.image}
                      alt={activeProduct.name}
                    />
                  ) : (
                    <img
                      className="productImg"
                      src={"./assets/uil_restaurant.png"}
                      alt={activeProduct ? activeProduct.name : "Product"}
                    />
                  )}
                  <div className="basket-main">
                    {activeProduct && activeProduct.name && (
                      <div className="modal-product-name">
                        {activeProduct.name}
                      </div>
                    )}

                    <div className="modal-description">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Iure.
                    </div>
                    {activeProduct && activeProduct.price && (
                      <div className="modal-price">{activeProduct.price} ₼</div>
                    )}
                    <div className="modal-ps">{t("no extra adds")}</div>
                    <div className="counter">
                      {activeProduct && (
                        <div className="counter-main">
                          <button
                            className="count-decrement"
                            onClick={handleDecrement}
                          >
                            -
                          </button>
                          <div className="countNmbr">{countNumber}</div>
                          <button
                            className="count-increment"
                            onClick={handleIncrement}
                          >
                            +
                          </button>
                        </div>
                      )}

                      <div className="add">
                        <button className="addBasket" onClick={handleAddToCart}>
                          {t("add to basket")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isModal4Open && (
        <div id="myModal" className="modal">
          <div className="modal-content4" ref={filterModalRef}>
            <span className="close-filter" onClick={close4Modal}>
              &times;
            </span>
            <div className="vaul-scrollable-filter ">
              <div className="rounded-top-filter"></div>
            </div>
            <div className="modal_info4">
              <div className="choice-filter">{t("filters")}</div>
              <div className="filters">
                <button
                  className={`filtersBtn ${activeButtons[0] ? "active" : ""}`}
                  onClick={() => handleButtonClick(0)}
                >
                  <img
                    className="filtersBtn-img"
                    src="./assets/halal-sign.png"
                    alt="Halal"
                  />
                  <span className="filtersBtn-span">Halal</span>
                </button>
                <button
                  className={`filtersBtn ${activeButtons[1] ? "active" : ""}`}
                  onClick={() => handleButtonClick(1)}
                >
                  <img
                    className="filtersBtn-img"
                    src="./assets/kosher.png"
                    alt="Kosher"
                  />
                  <span className="filtersBtn-span">Kosher</span>
                </button>
                <button
                  className={`filtersBtn ${activeButtons[2] ? "active" : ""}`}
                  onClick={() => handleButtonClick(2)}
                >
                  <img
                    className="filtersBtn-img"
                    src="./assets/vegan.png"
                    alt="Vegetarian"
                  />
                  <span className="filtersBtn-span"> Vegetarian</span>
                </button>
                <button
                  className={`filtersBtn ${activeButtons[3] ? "active" : ""}`}
                  onClick={() => handleButtonClick(3)}
                >
                  <img
                    className="filtersBtn-img"
                    src="./assets/salad.png"
                    alt="Vegan"
                  />
                  <span className="filtersBtn-span">Vegan</span>
                </button>
                <button
                  className={`filtersBtn ${activeButtons[4] ? "active" : ""}`}
                  onClick={() => handleButtonClick(4)}
                >
                  <img
                    className="filtersBtn-img"
                    src="./assets/chili-pepper.png"
                    alt="Acılı"
                  />
                  <span className="filtersBtn-span">{t("spicy")}</span>
                </button>
              </div>
              <div className="allergies">
                <p>{t("allergies")}</p>
              </div>

              <div>
                <FormControl
                  className="allergies-form"
                  sx={{ m: 1, width: 450 }}
                >
                  <InputLabel
                    id="demo-multiple-name-label"
                    className="allergiya-sec"
                  >
                    {t("select")}
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={personName}
                    onChange={handleChange}
                    input={<OutlinedInput label="Name" />}
                    MenuProps={MenuProps}
                  >
                    {names.map((name) => (
                      <MenuItem
                        className="allergies-names-filtering"
                        key={name}
                        value={name}
                        style={getStyles(name, personName)}
                      >
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
              <div className="filter-section-buttons">
                <button
                  className="filter-section-delete-button"
                  onClick={resetFilters}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#ff0000"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                  </svg>
                </button>
                <button
                  className="filter-section-confirm-button"
                  onClick={close4Modal}
                >
                  {t("apply")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
