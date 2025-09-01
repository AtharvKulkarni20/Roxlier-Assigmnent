"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./Sidebar";
import { StatsCards } from "./StatsCard";
import { TabbedLists } from "./TabbedLists";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [admin, setAdmin] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT from login

        const [statsRes, usersRes, storesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/admin/dashboard", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/users/list", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/admin/stores", {
            headers: { Authorization: `Bearer ${token}` },
          }),
         
        ]);

        setStats({
          users: statsRes.data.stats.totalUsers,
          stores: statsRes.data.stats.totalStores,
          ratings: statsRes.data.stats.totalRatings,
        });

        setUsers(usersRes.data.users);
        setStores(storesRes.data.stores);
         console.log("Dashboard data:", statsRes.data, usersRes.data, storesRes.data),
        // Filter store admin from users
        setAdmin(usersRes.data.users.filter((u) => u.role === "ADMIN"));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
    
  }, []);

  return (
    <div className="min-h-[calc(100vh-0px)] bg-background">
      <div className="mx-auto max-w-7xl px-4 md:px-6 py-6">
        <div className="flex gap-6">
          <aside className="w-[240px] shrink-0">
            <Sidebar />
          </aside>

          <main className="flex-1 space-y-6">
            <StatsCards
              users={stats.users}
              stores={stats.stores}
              admin={admin.length >= 0 ? admin.length : 0}
            />

            <div className="rounded-xl border bg-card p-4">
              <h2 className="mb-3 text-base font-semibold">Directory</h2>
              <TabbedLists users={users} stores={stores} admin={admin} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
