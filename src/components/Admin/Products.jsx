import {
  File,
  Home,
  LineChart,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  ShoppingCart,
  Users2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { BackTop, notification } from "antd";
import { useSelector } from "react-redux";
import "./../styles/admin.css";
import Aside from "./Aside";
import HeaderAdmin from "./HeaderAdmin";

export function Dashboard() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: type,
      description:
        type === "success"
          ? "Product deleted successfully!"
          : "Product not deleted!",
    });
  };

  const handleGetProducts = async () => {
    try {
      const response = await fetch(
        "https://icon-kl-back.onrender.com/api/items-with-category",
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
        setProducts(data);
        setFilteredProducts(data);
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

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(lowercasedSearchTerm)
    );
    setFilteredProducts(filtered);
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(
        `https://icon-kl-back.onrender.com/api/items/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== id)
        );
        setFilteredProducts((prevFilteredProducts) =>
          prevFilteredProducts.filter((product) => product._id !== id)
        );
        console.log("Product deleted successfully");
        openNotificationWithIcon("success");
      } else {
        setError(`HTTP error: ${response.status}`);
        console.error("Error deleting product:", response.status);
        openNotificationWithIcon("error");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error deleting product:", error);
    }
  };

  useEffect(() => {
    handleGetProducts();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {contextHolder}
      <BackTop />
      <Aside />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <HeaderAdmin
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          name={"Products"}
        />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              {/* <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="archived" className="hidden sm:flex">
                  Archived
                </TabsTrigger>
              </TabsList> */}
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Link to="/admin/addProduct">
                  <Button size="sm" className="h-8 gap-1" id="add">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Product
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                  <CardDescription>
                    Manage your products and view their sales performance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Price
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Ingredients
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                          <TableRow key={product._id}>
                            <TableCell className="hidden sm:table-cell">
                              {product.image ? (
                                <img
                                  alt="Product image"
                                  className="aspect-square rounded-md object-cover"
                                  height="64"
                                  src={product.image}
                                  width="64"
                                />
                              ) : (
                                <p
                                  className="text-[#FACC15] select-none hover:text-[#ffbf00]"
                                  onClick={() =>
                                    navigate(`/admin/${product._id}/edit`)
                                  }
                                >
                                  Add image
                                </p>
                              )}
                            </TableCell>
                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" id="status">
                                {product.categoryId?.name}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {product?.price.toFixed(2)}₼
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {product.ingredients &&
                              product.ingredients.length > 0
                                ? product.ingredients.join(", ")
                                : `—`}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Toggle menu</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" id="actions">
                                  <Link
                                    to={`/admin/${product._id}/edit`}
                                    id="edit"
                                  >
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                  </Link>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteProduct(product._id)
                                    }
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <p>No products available</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
                {/* <CardFooter>
                  <div className="text-xs text-muted-foreground">
                    Showing <strong>1-10</strong> of <strong>32</strong>{" "}
                    products
                  </div>
                </CardFooter> */}
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
