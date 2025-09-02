"use client";

import * as React from "react";
import { useState } from "react";
import axios from "axios";
import { Mail, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
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
import { useNavigate } from "react-router-dom";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      
      setEmailSent(true);
      toast.success("Password reset link sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-[100dvh] grid place-items-center p-4">
        <Card className="w-full max-w-md rounded-2xl shadow-sm">
          <CardHeader className="space-y-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToLogin}
                className="p-1 h-8 w-8 hover:bg-muted"
              >
                <ArrowLeft size={16} />
              </Button>
              <div>
                <CardTitle className="text-2xl font-semibold">
                  {emailSent ? "Check your email" : "Forgot password?"}
                </CardTitle>
              </div>
            </div>
            <CardDescription className="text-base text-muted-foreground">
              {emailSent 
                ? `We've sent a password reset link to ${email}`
                : "Enter your email address and we'll send you a link to reset your password."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!emailSent ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pr-10"
                      placeholder="Enter your email address"
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

                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-black/90"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Sending...
                    </div>
                  ) : (
                    "Send reset link"
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <button
                    type="button"
                    onClick={handleBackToLogin}
                    className="underline underline-offset-4 hover:text-foreground transition-colors"
                  >
                    Back to login
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-3">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium">Email sent successfully!</p>
                    <p className="text-xs text-muted-foreground">
                      Didn't receive the email? Check your spam folder or try again.
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEmailSent(false);
                      setEmail("");
                    }}
                    className="w-full"
                  >
                    Try again
                  </Button>
                  
                  <Button
                    variant="ghost"
                    onClick={handleBackToLogin}
                    className="w-full"
                  >
                    Back to login
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}