"use client";

import { useState } from "react";
import { useNavigate } from "react-router";

function SomeComponent() {
  let navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)}>
      Go Back
    </button>
  );
}

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ArrowUpDown } from "lucide-react";

export function TabbedLists({ users, stores, admin }) {
  const [tab, setTab] = useState("users");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
    let navigate = useNavigate();

  const q = query.toLowerCase().trim();

  // Generic sorting function
  const sortData = (data, field, order) => {
    return [...data].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];
      
      // Handle different data types
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (order === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });
  };

  // Filter and sort users
  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  );
  const sortedUsers = sortData(filteredUsers, sortBy, sortOrder);

  // Filter and sort stores
  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q))
  );
  const sortedStores = sortData(filteredStores, sortBy, sortOrder);

  // Filter and sort admin/owners
  const filteredOwners = admin.filter(
    (o) => o.name.toLowerCase().includes(q) || o.email.toLowerCase().includes(q)
  );
  const sortedOwners = sortData(filteredOwners, sortBy, sortOrder);

  const addLabel =
    tab === "users" ? "Add User" : tab === "stores" ? "Add Store" : "Add Owner";

  // Get sort options based on current tab
  const getSortOptions = () => {
    switch (tab) {
      case "users":
        return [
          { value: "name", label: "Name" },
          { value: "email", label: "Email" }
        ];
      case "stores":
        return [
          { value: "name", label: "Name" },
          { value: "rating", label: "Rating" },
          { value: "description", label: "Description" }
        ];
      case "admin":
        return [
          { value: "name", label: "Name" },
          { value: "email", label: "Email" },
          { value: "storesOwned", label: "Stores Owned" }
        ];
      default:
        return [{ value: "name", label: "Name" }];
    }
  };

  // Reset sort when tab changes
  const handleTabChange = (newTab) => {
    setTab(newTab);
    setSortBy("name");
    setSortOrder("asc");
  };

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === "asc" ? "desc" : "asc");
  };

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="stores">Stores ({stores.length})</TabsTrigger>
            <TabsTrigger value="admin">
              Admin ({admin?.length >= 0 ? admin.length : 0})
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full md:w-64"
              aria-label="Search list"
            />
            <Button
              className="bg-black text-white hover:bg-black/90"
              type="button" onClick={() => navigate("/admin/adduser")}
            >
              <Plus className="mr-1 h-4 w-4" />
              {addLabel}
            </Button>
          </div>
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center gap-2 py-2 border-b">
          <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getSortOptions().map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={toggleSortOrder}
            className="flex items-center gap-1"
          >
            <ArrowUpDown className="h-3 w-3" />
            {sortOrder === "asc" ? "A-Z" : "Z-A"}
          </Button>

          {/* Results counter */}
          <div className="ml-auto text-sm text-muted-foreground">
            {tab === "users" && `${sortedUsers.length} of ${users.length} users`}
            {tab === "stores" && `${sortedStores.length} of ${stores.length} stores`}
            {tab === "admin" && `${sortedOwners.length} of ${admin.length} admin`}
          </div>
        </div>

        <TabsContent value="users" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className={`cursor-pointer hover:bg-muted ${sortBy === 'name' ? 'bg-muted' : ''}`}
                  onClick={() => setSortBy('name')}
                >
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className={`cursor-pointer hover:bg-muted ${sortBy === 'email' ? 'bg-muted' : ''}`}
                  onClick={() => setSortBy('email')}
                >
                  Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.email}
                  </TableCell>
                </TableRow>
              ))}
              {sortedUsers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-muted-foreground py-8"
                  >
                    {query ? `No users found matching "${query}"` : "No users found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="stores" className="mt-4">
          <div className="space-y-3">
            {sortedStores.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-4 rounded-lg border p-3 hover:bg-muted/30 transition-colors"
              >
                <img
                  src={s.logo || "/placeholder.svg"}
                  alt={`${s.name} logo`}
                  width={64}
                  height={64}
                  className="rounded-md object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{s.name}</p>
                    <Badge
                      variant="secondary"
                      aria-label={`Rating ${s.rating}`}
                    >
                      {s.rating?.toFixed(1)}★
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
            {sortedStores.length === 0 && (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  {query ? `No stores found matching "${query}"` : "No stores found."}
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="admin" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className={`cursor-pointer hover:bg-muted ${sortBy === 'name' ? 'bg-muted' : ''}`}
                  onClick={() => setSortBy('name')}
                >
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className={`cursor-pointer hover:bg-muted ${sortBy === 'email' ? 'bg-muted' : ''}`}
                  onClick={() => setSortBy('email')}
                >
                  Email {sortBy === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className={`text-right cursor-pointer hover:bg-muted ${sortBy === 'storesOwned' ? 'bg-muted' : ''}`}
                  onClick={() => setSortBy('storesOwned')}
                >
                  Stores Owned {sortBy === 'storesOwned' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedOwners.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {o.email}
                  </TableCell>
                  <TableCell className="text-right">{o.storesOwned}</TableCell>
                </TableRow>
              ))}
              {sortedOwners.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground py-8"
                  >
                    {query ? `No admin found matching "${query}"` : "No admin found."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </div>
    </Tabs>
  );
}