import { File, MoreHorizontal, PlusCircle } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
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
          ? "Category deleted successfully!"
          : "Category not deleted!",
    });
  };
  const notificationAdd = (type) => {
    api[type]({
      message: type,
      description:
        type === "success"
          ? "Category added successfully!"
          : "Category not added!",
    });
  };
  const notificationEdit = (type) => {
    api[type]({
      message: type,
      description:
        type === "success"
          ? "Category updated successfully!"
          : "Category not updated!",
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
        notificationEdit("success");
      } else {
        setError(`HTTP error: ${response.status}`);
        console.error("HTTP error:", response.status);
        notificationEdit("error");
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
        notificationDelete("success");
      } else {
        setError(`HTTP error: ${response.status}`);
        console.error("Error deleting category:", error);
        notificationDelete("error");
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
      {contextHolder}
      <BackTop />
      <Aside />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <HeaderAdmin
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          name={"Categories"}
        />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
                {/* <Button size="sm" variant="outline" className="h-8 gap-1">
                  <File className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Export
                  </span>
                </Button> */}
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
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                  <CardDescription>Manage your categories.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Categories</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="hidden sm:table-cell"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCategories.length > 0 ? (
                        filteredCategories.map((category) => (
                          <TableRow key={category._id}>
                            <TableCell className="font-medium">
                              {category.name}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">
                                {category?.items.map((item, index) => (
                                  <span key={index}>
                                    {Array.isArray(item?.name)
                                      ? item.name.join(", ")
                                      : item?.name}
                                    {index < category.items.length - 1 && ", "}
                                  </span>
                                ))}
                              </div>
                              <div className="hidden text-sm text-muted-foreground md:inline">
                                {category?.items.length}
                              </div>
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
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" id="actions">
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
            <button className="close2 m-1" onClick={closeModalCategory}>
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
            <button className="close2 m-1" onClick={closeModalCategoryAdd}>
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
