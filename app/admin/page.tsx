"use client";

import React, { useState, useEffect } from "react";
import AdminLogin from "@/components/AdminLogin";
import AdminDashboard from "@/components/AdminDashboard";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored admin token
    const token = localStorage.getItem("adminToken");
    if (token) {
      setAdminToken(token);
    }
    setIsLoading(false);
  }, []);

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
    localStorage.setItem("adminToken", token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem("adminToken");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (adminToken) {
    return <AdminDashboard token={adminToken} onLogout={handleAdminLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-sm text-gray-600">Secure Access Required</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <AdminLogin onLoginSuccess={handleAdminLogin} />
        <div className="text-center mt-8">
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="bg-white"
          >
            Back to Guest Registration
          </Button>
        </div>
      </main>
    </div>
  );
}
