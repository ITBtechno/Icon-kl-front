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
  const [codes, setCodes] = useState([]);
  const [filteredCodes, setFilteredCodes] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type) => {
    api[type]({
      message: type,
      description:
        type === "success"
          ? "Promocode deleted successfully!"
          : "Promocode not deleted!",
    });
  };

  //   const filteredCodes = codes.filter((code) =>
  //     code.code.toLowerCase().includes(searchTerm.toLowerCase())
  //   );

  const handleGetPromocodes = async () => {
    try {
      const response = await fetch(
        "https://icon-kl-back.onrender.com/api/promocodes",
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
        setCodes(data);
        setFilteredCodes(data);
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

  useEffect(() => {
    handleGetPromocodes();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeletePromocode = async (id) => {
    try {
      const response = await fetch(
        `https://icon-kl-back.onrender.com/api/promocodes/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCodes((prevCodes) => prevCodes.filter((code) => code._id !== id));
        setFilteredCodes((prevFilteredCodes) =>
          prevFilteredCodes.filter((code) => code._id !== id)
        );
        console.log("Promocode deleted successfully");
        openNotificationWithIcon("success");
      } else {
        setError(`HTTP error: ${response.status}`);
        console.error("Error deleting promocode:", response.status);
        openNotificationWithIcon("error");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error deleting promocode:", error);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {contextHolder}
      <BackTop />
      <Aside />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <HeaderAdmin
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          name={"Promocodes"}
        />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <div className="flex items-center">
              <div className="ml-auto flex items-center gap-2">
                <Link to="/admin/addPromocode">
                  <Button size="sm" className="h-8 gap-1" id="add">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                      Add Promocode
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Promocodes</CardTitle>
                  <CardDescription>Manage your promocodes.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Codes</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Limit
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Expiration date
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Expired
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Created
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCodes.length > 0 ? (
                        filteredCodes.map((code) => (
                          <TableRow key={code._id}>
                            <TableCell className="font-medium">
                              {code.code}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" id="status">
                                {code.discount}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {code.limit}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {new Date(code.expirationDate).toLocaleString()}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {code.expired}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              {new Date(code.createdAt).toLocaleString()}
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
                                  <Link id="edit">
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                  </Link>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeletePromocode(code._id)
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
                            <p>No promocodes available</p>
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
    </div>
  );
}

export default Dashboard;
