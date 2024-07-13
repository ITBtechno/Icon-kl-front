import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import store from "./redux/store/store.js";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Basket from "./components/Basket.jsx";
import Menu from "./components/Menu.jsx";
import "../i18n.js";
import Products from "./components/Admin/Products.jsx";
import Orders from "./components/Admin/Orders.jsx";
import EditProduct from "./components/Admin/EditProduct.jsx";
import Customers from "./components/Admin/Customers.jsx";
import PrivateRoute from "./routes/PrivateRouter.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/basket" element={<Basket />} />
        <Route element={<PrivateRoute roles={["Admin"]} />}>
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/customers" element={<Customers />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/:productId/edit" element={<EditProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>
);
