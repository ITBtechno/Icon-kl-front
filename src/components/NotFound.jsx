import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUtensils } from "@fortawesome/free-solid-svg-icons";
import "../components/styles/NotFound.css";

const NotFound = () => {
  return (
    <div className="cloak__wrapper">
      <div className="cloak__container">
        <div className="cloak"></div>
      </div>
      <div className="info">
        <h1 className="notFound">
          4<FontAwesomeIcon icon={faUtensils} />4
        </h1>
        <h2>We can't find that page</h2>
        <p className="apologise">
          We're fairly sure that page used to be here, but seems to have gone
          missing. We do apologise on its behalf.
        </p>
        <a
          className="goBack"
          href="https://jhey.dev"
          target="_blank"
          rel="noreferrer noopener"
        >
          Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
