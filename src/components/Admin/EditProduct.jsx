import {
  ChevronLeft,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  ShoppingCart,
  Upload,
  Users2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Select as AntdSelect, notification } from "antd";
import { useSelector } from "react-redux";
import Aside from "./Aside";
export function Dashboard() {
  const [edit, setEdit] = useState({
    name: "",
    ingredients: [],
    price: "",
    categoryId: "",
    image: "",
  });
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const { token } = useSelector((state) => state.auth);
  let { productId } = useParams();

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: type,
      description:
        type === "success"
          ? "Product updated successfully!"
          : "Product not updated!",
    });
  };

  const handleGetEdit = async () => {
    try {
      const response = await fetch(
        `https://icon-kl-back.onrender.com/api/items/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEdit(data);
        console.log(data);
      } else {
        setError(`HTTP error: ${response.status}`);
        console.error("HTTP error:", response.status);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    }
  };

  const handleFetchCategories = async () => {
    try {
      const response = await fetch(
        `https://icon-kl-back.onrender.com/api/categories`
      );

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        setError(`HTTP error: ${response.status}`);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const response = await fetch(
        `https://icon-kl-back.onrender.com/api/items/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(edit),
        }
      );

      if (response.ok) {
        console.log("Product updated successfully!");
        openNotificationWithIcon("success");
      } else {
        setError(`HTTP error: ${response.status}`);
        console.error("HTTP error:", response.status);
        openNotificationWithIcon("error");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    handleGetEdit();
    handleFetchCategories();
  }, [productId]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await fetch(
          "https://icon-kl-back.onrender.com/api/upload",
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setEdit((prevEdit) => ({
            ...prevEdit,
            image: result.imageUrl,
          }));
        } else {
          setError(`HTTP error: ${response.status}`);
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const handleDeleteImage = () => {
    setEdit((prevEdit) => ({
      ...prevEdit,
      image: "",
    }));
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
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Users2 className="h-5 w-5" />
                  Customers
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <LineChart className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                id="back"
              >
                <Link to="/admin/products">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Back</span>
                </Link>
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Pro Controller
              </h1>
              {/* <Badge variant="outline" className="ml-auto sm:ml-0">
                In stock
              </Badge> */}
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm" id="discardBtn">
                  Discard
                </Button>
                <Button size="sm" onClick={handleUpdateProduct}>
                  Save Product
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>Change product's details</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          type="text"
                          className="w-full"
                          value={edit.name}
                          onChange={(e) =>
                            setEdit((prevEdit) => ({
                              ...prevEdit,
                              name: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="description">Ingredients</Label>
                        <AntdSelect
                          mode="tags"
                          style={{ width: "100%" }}
                          placeholder="Enter ingredients"
                          onChange={(value) =>
                            setEdit((prevEdit) => ({
                              ...prevEdit,
                              ingredients: value,
                            }))
                          }
                          value={edit.ingredients}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="description">Price</Label>
                        <div>
                          <Label htmlFor="price-1" className="sr-only">
                            Price
                          </Label>
                          <Input
                            className="stocks"
                            id="description"
                            type="number"
                            defaultValue="0"
                            value={edit.price}
                            onChange={(e) =>
                              setEdit((prevEdit) => ({
                                ...prevEdit,
                                price: e.target.value,
                              }))
                            }
                          />
                        </div>
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
                    <CardTitle>Product Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {edit.image ? (
                        <div className="aspect-square w-full rounded-md overflow-hidden">
                          <img
                            alt="Product image"
                            className="w-full h-full object-cover"
                            src={edit.image}
                          />
                          <button
                            type="button"
                            onClick={handleDeleteImage}
                            className="absolute bottom-0 right-0 m-2 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                          >
                            Delete
                          </button>
                        </div>
                      ) : (
                        <form className="upload">
                          <label
                            htmlFor="files"
                            className="grid grid-cols-3 gap-2"
                          >
                            <button
                              type="button"
                              onClick={() =>
                                document.getElementById("files").click()
                              }
                              className="flex aspect-square w-11 items-center justify-center rounded-md border border-dashed"
                            >
                              <Upload className="h-4 w-4 text-muted-foreground" />
                              <span className="sr-only">Upload</span>
                            </button>
                            <input
                              type="file"
                              id="files"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </label>
                        </form>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Product Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={edit?.categoryId?._id ?? edit.categoryId}
                        onValueChange={(value) =>
                          setEdit((prevEdit) => ({
                            ...prevEdit,
                            categoryId: value,
                          }))
                        }
                      >
                        <SelectTrigger className="stocks" id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="stocks">
                          {categories.map((category) => (
                            <SelectItem key={category._id} value={category._id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm" onClick={handleUpdateProduct}>
                Save Product
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
