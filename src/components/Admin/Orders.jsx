import { Badge } from "@/components/ui/badge";
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
import { File, ListFilter } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/actions/authActions";
import Aside from "./Aside";
import HeaderAdmin from "./HeaderAdmin";

export function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      dispatch(loginSuccess(token));
    }
  }, [dispatch]);

  const handleGetOrders = async () => {
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
    handleGetOrders();
  }, []);

  const handleSearch = useCallback(
    (e) => {
      const searchTerm = e.target.value;
      setSearchTerm(searchTerm);

      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = orders.filter((order) =>
        order.orderByUserId.fullname
          .toLowerCase()
          .includes(lowercasedSearchTerm)
      );
      setFilteredOrders(filtered);
    },
    [orders]
  );

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Aside />
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
                {/* <TabsList>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList> */}
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
                      <DropdownMenuCheckboxItem checked>
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
                <Card x-chunk="dashboard-05-chunk-3">
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
                          {/* <TableHead className="hidden sm:table-cell">
                            Type
                          </TableHead> */}
                          <TableHead className="hidden sm:table-cell">
                            Status
                          </TableHead>
                          {/* <TableHead className="hidden md:table-cell">
                            Date
                          </TableHead> */}
                          <TableHead className="text-right">Amount</TableHead>
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
                                <Badge className="text-xs" variant="secondary">
                                  {order.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                {order.amount}
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
