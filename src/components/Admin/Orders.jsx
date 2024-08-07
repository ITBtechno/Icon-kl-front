import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
import Cookies from "js-cookie";
import { File, ListFilter, Trash2, Trash2Icon, TrashIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/actions/authActions";
import Aside from "./Aside";
import HeaderAdmin from "./HeaderAdmin";
import { BackTop } from "antd";

export function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      dispatch(loginSuccess(token));
    }
  }, [dispatch]);

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        "https://icon-kl-back.onrender.com/api/orders/",
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
        setOrders(data);
        setFilteredOrders(data);
      } else {
        setError(`HTTP error: ${response.status}`);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `https://icon-kl-back.onrender.com/api/orders/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
        setFilteredOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
      } else {
        setError(`HTTP error: ${response.status}`);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const handleDeleteOrder = async (orderId) => {
    try {
      const response = await fetch(
        `https://icon-kl-back.onrender.com/api/orders/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders((order) => order.filter((x) => x._id !== x.orderId));
        setFilteredOrders((order) => order.filter((x) => x._id !== x.orderId));
      } else {
        setError(`HTTP error: ${response.status}`);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOrders(orders);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = orders.filter((order) =>
        order.orderByUserId.fullname
          .toLowerCase()
          .includes(lowercasedSearchTerm)
      );
      setFilteredOrders(filtered);
    }
  }, [searchTerm, orders]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Aside />
      <BackTop />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <HeaderAdmin
          searchTerm={searchTerm}
          handleSearch={handleSearch}
          name={"Orders"}
        />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"></div>
            <Tabs defaultValue="week">
              <div className="flex items-center">
                <div className="ml-auto flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 gap-1 text-sm"
                      >
                        <ListFilter className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Filter</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem defaultChecked>
                        Fulfilled
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Declined
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Refunded
                      </DropdownMenuCheckboxItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 gap-1 text-sm"
                  >
                    <File className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only">Export</span>
                  </Button>
                </div>
              </div>
              <TabsContent value="week">
                <Card>
                  <CardHeader className="px-7">
                    <CardTitle>Orders</CardTitle>
                    <CardDescription>
                      Recent orders from your store.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Status
                          </TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Products
                          </TableHead>
                          <TableHead className="text-right">Payment</TableHead>
                          <TableHead className="text-right">
                            Promocode
                          </TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Updated</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                          <TableHead className="hidden sm:table-cell"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredOrders.length > 0 ? (
                          filteredOrders.map((order) => (
                            <TableRow key={order._id}>
                              <TableCell>
                                <div className="font-medium">
                                  {order?.orderByUserId?.fullname}
                                </div>
                                <div className="hidden text-sm text-muted-foreground md:inline">
                                  {order?.orderByUserId?.email}
                                </div>
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
                                <Select
                                  value={order.status}
                                  onValueChange={(value) =>
                                    handleStatusChange(order._id, value)
                                  }
                                >
                                  <SelectTrigger
                                    className="stocks border border-[#FACC15]"
                                    id="status"
                                  >
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent className="stocks p-0">
                                    {[
                                      "Fulfilled",
                                      "Declined",
                                      "Refunded",
                                      "Pending",
                                      "In Progress",
                                      "Complete",
                                    ].map((status) => (
                                      <SelectItem key={status} value={status}>
                                        {status}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-left">
                                {order.items
                                  .map(
                                    (i) =>
                                      `${i?.itemId?.name} × ${i?.itemCount}`
                                  )
                                  .join(", ")}
                              </TableCell>
                              <TableCell className="text-right">
                                {order.paymentMethod}
                              </TableCell>
                              <TableCell className="text-right">
                                {order?.promocode?.code || "none"}
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(order.createdAt).toLocaleString()}
                              </TableCell>
                              <TableCell className="text-sm">
                                {new Date(order.updatedAt).toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right">
                                {order.amount}₼
                              </TableCell>
                              <TableCell className="text-right">
                                <TrashIcon className="size-5 text-[#FACC15] hover:text-[#fc3c3c] duration-150" />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6}>
                              <p>No orders available</p>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
