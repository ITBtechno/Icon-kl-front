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
import { Link } from "react-router-dom";

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
  const [formData, setFormData] = useState({
    name: "",
    ingredients: [],
    price: "",
    categoryId: "",
    image: null,
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const { token } = useSelector((state) => state.auth);

  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: type,
      description:
        type === "success"
          ? "Product added successfully!"
          : "Product not added!",
    });
  };
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "https://icon-kl-back.onrender.com/api/categories"
        );
        const data = await response.json();
        setCategoryOptions(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    setFormData((prev) => ({ ...prev, image: null }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleIngredientChange = (value) => {
    setFormData((prev) => ({ ...prev, ingredients: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "ingredients") {
        value.forEach((ingredient) => {
          formDataToSend.append("ingredients[]", ingredient);
        });
      } else if (value !== null && value !== "") {
        formDataToSend.append(key, value);
      }
    });

    try {
      const response = await fetch(
        "https://icon-kl-back.onrender.com/api/items",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (response.ok) {
        console.log("Product added successfully!");
        openNotificationWithIcon("success");
        setFormData({
          name: "",
          ingredients: [],
          price: "",
          categoryId: "",
          image: null,
        });
        setSelectedImage(null);
      } else {
        const errorData = await response.json();
        console.error("Failed to add product:", errorData);
        openNotificationWithIcon("error");
      }
    } catch (error) {
      console.error("Error adding product:", error);
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
          <Breadcrumb className="hidden md:flex">
            <BreadcrumbList id="breadcrumb">
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="#">Products</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage id="page">Edit Product</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
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
                Add Product
              </h1>
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" size="sm" id="discardBtn">
                  Discard
                </Button>
                <Button size="sm" type="submit" onClick={handleSubmit}>
                  Add Product
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <Card x-chunk="dashboard-07-chunk-0">
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                    <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6">
                      <div className="grid gap-3">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="ingredients">Ingredients</Label>
                        <AntdSelect
                          mode="tags"
                          style={{ width: "100%" }}
                          placeholder="Enter ingredients"
                          onChange={handleIngredientChange}
                          value={formData.ingredients}
                        />
                      </div>
                      <div className="grid gap-3">
                        <Label htmlFor="price">Price</Label>
                        <Input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
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
                    <CardTitle>Product Image</CardTitle>
                    {/* <CardDescription>
                      Lipsum dolor sit amet, consectetur adipiscing elit
                    </CardDescription> */}
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 relative">
                      {selectedImage && (
                        <div className="aspect-square w-full rounded-md overflow-hidden">
                          <img
                            src={selectedImage}
                            alt="Product image"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={handleDeleteImage}
                            className="absolute bottom-0 right-0 m-2 p-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                      {!selectedImage && (
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
                              multiple
                              required
                              onChange={handleFileChange}
                            />
                          </label>
                        </form>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card x-chunk="dashboard-07-chunk-2">
                  <CardHeader>
                    <CardTitle>Product Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 sm:grid-cols-3">
                      <div className="grid gap-3">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.categoryId}
                          onValueChange={(value) =>
                            setFormData((prevFormData) => ({
                              ...prevFormData,
                              categoryId: value,
                            }))
                          }
                        >
                          <SelectTrigger className="stocks">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="stocks">
                            {categoryOptions.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 md:hidden">
              <Button variant="outline" size="sm">
                Discard
              </Button>
              <Button size="sm" type="submit" onClick={handleSubmit}>
                Add Product
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
