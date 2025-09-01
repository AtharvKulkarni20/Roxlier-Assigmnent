"use client";

import * as React from "react";
import { useState } from "react";
import axios from "axios";
import { Mail, Eye, EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../ui/card";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "@/context/userContextProvider";
import { useNavigate } from "react-router-dom";

export function Login({ onSubmit }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { login, user } = React.useContext(UserContext);
  const navigate = useNavigate();
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Validate email & password before sending
  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{8,16}$/; // basic length check
    if (!emailRegex.test(form.email)) return "Invalid email address";
    if (!passwordRegex.test(form.password))
      return "Password must be 8-16 characters long";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );
      localStorage.setItem("token", res.data.token);
      await login();

      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
      toast.success("Login successful!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    }
  };

  React.useEffect(() => {
    if (user) {
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  });

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-[100dvh] grid place-items-center p-4">
        <Card className="w-full max-w-md rounded-2xl shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl font-semibold text-balance">
              Welcome back
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              Enter your credentials to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="pr-10"
                    autoComplete="email"
                    aria-label="Email address"
                    required
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground"
                  >
                    <Mail size={18} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="pr-10"
                    autoComplete="current-password"
                    aria-label="Password"
                    required
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-2 flex items-center rounded-md px-2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white hover:bg-black/90"
              >
                Log In
              </Button>

              <div className="pt-2 text-center text-sm">
                <a
                  href="#"
                  className="text-muted-foreground underline underline-offset-4"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {"Don’t have an account? "}
                <a href="/signup" className="underline underline-offset-4">
                  Sign Up
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Login;
