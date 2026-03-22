'use client';

import React, { useState } from 'react';
import GuestRegistrationForm from '@/components/GuestRegistrationForm';
import AdminLogin from '@/components/AdminLogin';
import AdminDashboard from '@/components/AdminDashboard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<
    'registration' | 'admin'
  >('registration');
  const [adminToken, setAdminToken] = useState<
    string | null
  >(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] =
    useState(false);

  const handleRegistrationSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessModal(true);
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
  };

  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
  };

  if (adminToken) {
    return (
      <AdminDashboard
        token={adminToken}
        onLogout={handleAdminLogout}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Navigation */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Hotel Guest Registration
            </h1>
            <p className="text-sm text-gray-600">
              Digital Check-in System
            </p>
          </div>
          <Button
            onClick={() => setCurrentPage('admin')}
            variant="outline"
            className="bg-white"
          >
            Admin Login
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {currentPage === 'registration' ? (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Welcome to Our Hotel
              </h2>
              <p className="text-blue-800">
                Please fill in your registration details below. This
                information will help us provide you with the best
                service during your stay.
              </p>
            </div>
            <GuestRegistrationForm
              onSubmitSuccess={handleRegistrationSuccess}
            />
          </div>
        ) : (
          <div>
            <AdminLogin
              onLoginSuccess={handleAdminLogin}
            />
            <div className="text-center mt-8">
              <Button
                onClick={() =>
                  setCurrentPage('registration')
                }
                variant="outline"
                className="bg-white"
              >
                Back to Guest Registration
              </Button>
            </div>
          </div>
        )}
      </main>

      {/* Success Modal */}
      <Dialog
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl">
              ✓ Registration Complete!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-gray-700 text-lg">
              {successMessage}
            </p>
            <p className="text-gray-600 text-sm mt-4">
              We look forward to your stay!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
