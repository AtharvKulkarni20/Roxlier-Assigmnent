"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";

export default function Signup({ onSubmit, defaultValues }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        form
      );
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.error || "Error");
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-6">
      <Card className="w-full max-w-md rounded-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-semibold text-pretty">
            Sign Up
          </CardTitle>
          <CardDescription>Create your account to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                type="text"
                placeholder="Your address"
                value={form.address}
                onChange={handleChange}
                autoComplete="address"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-black/90"
            >
              Signup
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="underline">
                Log In
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
