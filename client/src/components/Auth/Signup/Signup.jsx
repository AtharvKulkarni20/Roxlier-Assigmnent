"use client";

import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function AddUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "USER",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/users",
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          password: "Asg%6I09", // default password
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("User added successfully!");
        setForm({ name: "", email: "", phone: "", role: "USER" }); // reset form
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add user");
    }
  };

  return (
    <div className="p-6">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border rounded p-2 w-full"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border rounded p-2 w-full"
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add User
        </button>
      </form>
    </div>
  );
}
