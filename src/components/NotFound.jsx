import React from "react";
import "../components/styles/NotFound.css";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="main">
        <p>4</p>
        <img src=".././public/assets/404-pizza.webp" alt="" />
        <p>4</p>
      </div>
      <p id="whoops">Whoops, nothing delicious to find here.</p>

      <p id="not-found-des">
        Seems like the page you were trying to find is no longer available
      </p>
      <button className="back-home">
        <Link to="/">Back Home</Link>
      </button>

    </div>
  );
};

export default NotFound;
