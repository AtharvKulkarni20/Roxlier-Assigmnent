"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"   // ✅ react-hot-toast

export default function AddAdminForm() {
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  })

  function update(key, val) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function onSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    
    // Validation checks
    if (!form.name.trim() || !form.email.trim() || !form.role) {
      toast.error("Please fill all required fields.")
      setSubmitting(false)
      return
    }

    if (form.name.trim().length < 20) {
      toast.error("Name should be 20 characters or more.")
      setSubmitting(false)
      return
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/users",
        {
          name: form.name,
          email: form.email,
          phone: form.phone,
          role: form.role,
          password: "Asg%6I09"
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      )

      if (res.status === 200 || res.status === 201) {
        toast.success(`${form.name} has been created with role: ${form.role}`)
        setForm({ name: "", email: "", phone: "", role: "" })
      }
    } catch (error) {
      if (error.response?.status === 409 || error.response?.data?.message?.includes("already exists")) {
        toast.error("A user with this email already exists.")
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "Invalid input. Please check your data.")
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("You don't have permission to create users.")
      } else {
        toast.error(error.response?.data?.message || "Failed to create user. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto max-w-2xl py-10 mb-24">
      {/* ✅ Toaster must be rendered once in the app */}
      <Toaster position="top-right" reverseOrder={false} />

      <Card className="w-full max-w-xl p-6">
        <CardHeader>
          <CardTitle>Add Admin</CardTitle>
          <CardDescription>Create a new administrator.</CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="grid gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Jane Doe"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 555 123 4567"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(val) => update("role", val)}>
                <SelectTrigger aria-label="User role">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Store Owner</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating…" : "Create Admin"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
