import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
} from "lucide-react";

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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import "./../styles/admin.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faLayerGroup } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { notification } from "antd";

export function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const [isModalCategory, setModalCategory] = useState(false);
  const [isModalCategoryAdd, setModalCategoryAdd] = useState(false);
  let { Id } = useParams();
  const categoriesRef = useRef(null);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editC, setEditC] = useState({
    name: "",
    _id: "",
  });
  const [newCategoryName, setNewCategoryName] = useState("");
  const [api, contextHolder] = notification.useNotification();
  const notificationDelete = (type) => {
    api[type]({
      message: type,
      description:
        type === "success"
          ? "Product deleted successfully!"
          : "Product not deleted!",
    });
  };
  const notificationAdd = (type) => {
    api[type]({
      message: type,
      description:
        type === "success"
          ? "Product deleted successfully!"
          : "Product not deleted!",
    });
  };
  const notificationEdit = (type) => {
    api[type]({
      message: type,
      description:
        type === "success"
          ? "Product deleted successfully!"
          : "Product not deleted!",
    });
  };
  const openModalCategory = (category) => {
    setSelectedCategory(category);
    setEditC({ name: category.name, _id: category._id });
    setModalCategory(true);
  };

  const closeModalCategory = () => {
    console.log("Updating category with name:", editC._id);
    setModalCategory(false);
  };

  const openModalCategoryAdd = () => {
    setModalCategoryAdd(true);
  };

  const closeModalCategoryAdd = () => {
    setModalCategoryAdd(false);
  };

  const handleGetCategories = async () => {
    try {
      const response = await fetch(
        "https://icon-kl-back.onrender.com/api/categories-with-items",
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
        setCategories(data);
        setEditC(data);
        setFilteredCategories(data);
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

  const handleAddCategory = async () => {
    try {
      const response = await fetch(
        "https://icon-kl-back.onrender.com/api/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newCategoryName }),
        }
      );

      if (response.ok) {
        console.log("Category added successfully!");
        setNewCategoryName("");
        closeModalCategoryAdd();
        handleGetCategories();
        notificationAdd("success");
      } else {
        const errorData = await response.json();
        console.error("Failed to add category:", errorData);
        notificationAdd("error");
      }
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);
    const lowercasedSearchTerm = searchTerm.toLowerCase();

    const filtered = categories.filter((category) =>
      category.name.toLowerCase().startsWith(lowercasedSearchTerm)
    );
    setFilteredCategories(filtered);
  };

  const handleUpdateCategory = async () => {
    try {
      console.log("Updating category with name:", editC.name);
      const response = await fetch(
        `https://icon-kl-back.onrender.com/api/categories/${editC._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editC),
        }
      );

      if (response.ok) {
        handleGetCategories();
        closeModalCategory();
        console.log("Product updated successfully!");
      } else {
        setError(`HTTP error: ${response.status}`);
        console.error("HTTP error:", response.status);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(
        `https://icon-kl-back.onrender.com/api/categories/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category._id !== id)
        );
        setFilteredCategories((prevFilteredCategories) =>
          prevFilteredCategories.filter((category) => category._id !== id)
        );
        console.log("Category deleted successfully");
      } else {
        setError(`HTTP error: ${response.status}`);
        console.error("Error deleting category:", error);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error deleting category:", error);
    }
  };

  useEffect(() => {
    handleGetCategories();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {contextHolder}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/"
                  className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <span className="sr-only">Back to home</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="right" side="right">
                Back to Home
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/admin/orders"
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="sr-only">Orders</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Orders</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/admin/products"
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Package className="h-5 w-5" />
                  <span className="sr-only">Products</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Products</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <FontAwesomeIcon className="h-5 w-5" icon={faLayerGroup} />
                  <span className="sr-only">Categories</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Categories</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/admin/customers"
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Users2 className="h-5 w-5" />
                  <span className="sr-only">Customers</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Customers</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
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
                  <Link href="#">Categories</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage id="page">All Categories</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full"
              >
                <img
                  src="/assets/profile-user.png"
                  width={36}
                  height={30}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" id="account">
              <DropdownMenuLabel id="myAccount">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="outline" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button>
                <Link>
                  <Button
                    size="sm"
                    className="h-8 gap-1"
                    id="add"
                    on
                    onClick={openModalCategoryAdd}
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Category
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
            <TabsContent value="all" className="md:w-[650px]">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>Manage your categories.</CardDescription>
                </CardHeader>
                <CardContent className="md:w-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Categories</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="hidden md:table-cell"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                          <TableRow key={category._id}>
                            <TableCell className="font-medium">
                              {category.name}
                            </TableCell>
                            <TableCell>{category.items.length}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    aria-haspopup="true"
                                    size="icon"
                                    variant="ghost"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" id="actions">
                                  <DropdownMenuLabel id="actionsText">
                                    Actions
                                  </DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() => openModalCategory(category)}
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteCategory(category._id)
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
                          <TableCell colSpan={3}>
                            <p>No categories available</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      {isModalCategory && (
        <div id="myModal" className={`modalCategory`}>
          <div className="modal-contentC">
            <button className="close2" onClick={closeModalCategory}>
              &times;
            </button>
            <div className="modal_infoC">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Name</Label>
                      <textarea
                        id="name"
                        type="text"
                        className="w-full"
                        value={editC.name}
                        onChange={(e) => {
                          console.log("Edit category name:", e.target.value);
                          setEditC((prevEdit) => ({
                            ...prevEdit,
                            name: e.target.value,
                          }));
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
                <Button
                  className="saveBtn"
                  size="sm"
                  onClick={handleUpdateCategory}
                >
                  Save Category
                </Button>
              </Card>
            </div>
          </div>
        </div>
      )}
      {isModalCategoryAdd && (
        <div id="myModal" className={`modalCategory`}>
          <div className="modal-contentC">
            <button className="close2" onClick={closeModalCategoryAdd}>
              &times;
            </button>
            <div className="modal_infoC">
              <Card>
                <CardHeader>
                  <CardTitle>Add Category</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Name</Label>
                      <textarea
                        id="name"
                        type="text"
                        className="w-full"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
                <Button
                  className="saveBtn"
                  size="sm"
                  onClick={handleAddCategory}
                >
                  Save Category
                </Button>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
