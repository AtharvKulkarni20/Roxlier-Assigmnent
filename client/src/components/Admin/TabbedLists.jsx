"use client";

import { useState } from "react";
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
import { Plus } from "lucide-react";

export function TabbedLists({ users, stores, owners }) {
  const [tab, setTab] = useState("users");
  const [query, setQuery] = useState("");

  const q = query.toLowerCase().trim();
  const filteredUsers = users.filter(
    (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  );
  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
  );
  const filteredOwners = owners.filter(
    (o) => o.name.toLowerCase().includes(q) || o.email.toLowerCase().includes(q)
  );

  const addLabel =
    tab === "users" ? "Add User" : tab === "stores" ? "Add Store" : "Add Owner";

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v)} className="w-full">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <TabsList className="grid grid-cols-3 w-full md:w-auto">
            <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
            <TabsTrigger value="stores">Stores ({stores.length})</TabsTrigger>
            <TabsTrigger value="owners">
              Store Owners ({owners.length})
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
              type="button"
            >
              <Plus className="mr-1 h-4 w-4" />
              {addLabel}
            </Button>
          </div>
        </div>

        <TabsContent value="users" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {u.email}
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="stores" className="mt-4">
          <div className="space-y-3">
            {filteredStores.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-4 rounded-lg border p-3"
              >
                <img
                  src={s.logo || "/placeholder.svg"}
                  alt={`${s.name} logo`}
                  width={64}
                  height={64}
                  className="rounded-md object-cover"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{s.name}</p>
                    <Badge
                      variant="secondary"
                      aria-label={`Rating ${s.rating}`}
                    >
                      {s.rating.toFixed(1)}★
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {s.description}
                  </p>
                </div>
              </div>
            ))}
            {filteredStores.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                No stores found.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="owners" className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Stores Owned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOwners.map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">{o.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {o.email}
                  </TableCell>
                  <TableCell className="text-right">{o.storesOwned}</TableCell>
                </TableRow>
              ))}
              {filteredOwners.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground"
                  >
                    No owners found.
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
