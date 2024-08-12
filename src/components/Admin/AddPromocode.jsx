import {
  ChevronLeft,
  Package,
  PanelLeft,
  ShoppingCart,
  Users2,
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  faArrowLeft,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DatePicker, notification, Space } from "antd";
import { RiDiscountPercentLine } from "react-icons/ri";
import { TbCategoryPlus } from "react-icons/tb";
import { useSelector } from "react-redux";
import Aside from "./Aside";

export function Dashboard({ handleLogout }) {
  const [formData, setFormData] = useState({
    code: "",
    expirationDate: "",
    limit: 0,
    discount: 0,
  });
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const { token } = useSelector((state) => state.auth);
  const [api, contextHolder] = notification.useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const onChange = (date, dateString) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      expirationDate: dateString,
    }));
    setSelectedDate(date);
  };

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: type,
      description:
        type === "success"
          ? "Promocode added successfully!"
          : "Promocode not added!",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const existingCodesResponse = await fetch(
        "https://icon-kl-back.onrender.com/api/promocodes",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!existingCodesResponse.ok) {
        throw new Error("Failed to fetch existing promocodes");
      }

      const existingCodes = await existingCodesResponse.json();

      const codeExists = existingCodes.some(
        (promo) => promo.code === formData.code
      );

      if (codeExists) {
        setError(
          "This promocode already exists. Please choose a different code."
        );
        openNotificationWithIcon("error");
        return;
      }

      const response = await fetch(
        "https://icon-kl-back.onrender.com/api/promocodes",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        openNotificationWithIcon("success");
        setFormData({
          code: "",
          expirationDate: "",
          limit: 0,
          discount: 0,
        });
        setError("");
        setSelectedDate(null);
      } else {
        openNotificationWithIcon("error");
      }
    } catch (error) {
      openNotificationWithIcon("error");
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {contextHolder}
      <Aside />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  to="/"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Back to home
                </Link>
                <Link
                  to="/admin/orders"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  to="/admin/products"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  to="/admin/category"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <TbCategoryPlus className="h-5 w-5" />
                  Categories
                </Link>
                <Link
                  to="/admin/promocodes"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <RiDiscountPercentLine className="h-5 w-5" />
                  Promocodes
                </Link>
                <Link
                  to="/admin/customers"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                  onClick={handleLogout}
                >
                  <FontAwesomeIcon
                    className="h-5 w-5"
                    icon={faRightFromBracket}
                  />
                  Log out
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main
          id="ep"
          className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8"
        >
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                id="back"
              >
                <Link to="/admin/promocodes">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Add Promocode
              </h1>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button size="sm" type="submit" onClick={handleSubmit}>
                  Add Promocode
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Promocode Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Code</Label>
                        <Input
                          type="text"
                          id="name"
                          name="code"
                          value={formData.code}
                          onChange={handleChange}
                          required
                        />
                        <span className="text-[#fc3c3c]">{error}</span>
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="price">Discount</Label>
                        <Input
                          type="number"
                          id="price"
                          name="discount"
                          value={formData.discount}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="price">Limit</Label>
                        <Input
                          type="number"
                          id="price"
                          name="limit"
                          value={formData.limit}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <Card
                  className="overflow-hidden"
                  x-chunk="dashboard-07-chunk-4"
                >
                  <CardHeader>
                    <CardTitle>Expiration Date</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 relative">
                      <Label>Select date</Label>
                      <Space className="space" direction="vertical" size={12}>
                        <DatePicker
                          className="date"
                          renderExtraFooter={() => ""}
                          showTime
                          placeholder="Select date"
                          onChange={onChange}
                          value={selectedDate}
                        />
                      </Space>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
