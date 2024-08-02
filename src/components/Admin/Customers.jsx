import { File, MoreHorizontal } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useSelector } from "react-redux";
import "./../styles/admin.css";
import Aside from "./Aside";
import HeaderAdmin from "./HeaderAdmin";

export function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const handleGetCustomers = async () => {
    try {
      const response = await fetch(
        "https://icon-kl-back.onrender.com/api/users/",
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
        setCustomers(data);
        setFilteredCustomers(data);
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

  const handleSearch = useCallback(
    (e) => {
      const searchTerm = e.target.value;
      setSearchTerm(searchTerm);

      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = customers.filter((customer) =>
        customer.fullname.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredCustomers(filtered);
    },

    [customers]
  );

  const handleDeleteCustomer = async (email) => {
    console.log("Deleting user with email:", email);

    try {
      const response = await fetch(
        `https://icon-kl-back.onrender.com/api/users/${email}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setCustomers(customers.filter((customer) => customer.email !== email));
      } else {
        setError(`HTTP error: ${response.status}`);
        console.error("HTTP error:", response.status);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    }
  };

  const makeUserAdmin = async (email) => {
    try {
      console.log(`Making user with email ${email} an admin`);
      const response = await fetch(
        `https://icon-kl-back.onrender.com/api/users/${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: "Admin",
          }),
        }
      );
      if (response.ok) {
        const updatedUser = await response.json();
        console.log(`Updated user: ${JSON.stringify(updatedUser)}`);
        setCustomers((prevCustomers) =>
          prevCustomers.map((user) => {
            if (user.email === email) {
              return { ...user, role: "Admin" };
            }
            return user;
          })
        );
        console.log(`User with email ${email} is now an admin`);
      } else {
        setError(`HTTP error: ${response.status}`);
        console.error("HTTP error:", response.status);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error:", error);
    }
  };

  const makeAdminUser = async (email) => {
    try {
      console.log(`Making admin with email ${email} a user`);
      const response = await fetch(
        `https://icon-kl-back.onrender.com/api/users/${email}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            role: "User",
          }),
        }
      );
      if (response.ok) {
        const updatedUser = await response.json();
        console.log(`Updated user: ${JSON.stringify(updatedUser)}`);
        setCustomers((prevCustomers) =>
          prevCustomers.map((user) => {
            if (user.email === email) {
              return { ...user, role: "User" };
            }
            return user;
          })
        );
        console.log(`Admin with email ${email} is now a user`);
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
    handleGetCustomers();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Aside />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <HeaderAdmin
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          name={"Customers"}
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
              </div>
            </div>
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Customers</CardTitle>
                  <CardDescription>Manage customers.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Gender
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Role
                        </TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map((customer) => (
                          <TableRow key={customer._id}>
                            <TableCell className="hidden sm:table-cell">
                              {customer.fullname}
                            </TableCell>
                            <TableCell className="font-medium">
                              {customer.email}
                            </TableCell>
                            <TableCell>{customer.gender}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {customer.role}
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
                                  <DropdownMenuLabel id="actionsText">
                                    Actions
                                  </DropdownMenuLabel>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteCustomer(customer.email)
                                    }
                                  >
                                    Delete
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    {customer.role === "User" ? (
                                      <div
                                        className="makeAdmin"
                                        onClick={() =>
                                          makeUserAdmin(customer.email)
                                        }
                                      >
                                        <i className="fa-light fa-user-gear"></i>
                                        <span>Make Admin</span>
                                      </div>
                                    ) : (
                                      <div
                                        className="makeAdmin"
                                        onClick={() =>
                                          makeAdminUser(customer.email)
                                        }
                                      >
                                        <i className="fa-light fa-user"></i>
                                        <span>Make User</span>
                                      </div>
                                    )}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <p>No customers available</p>
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
