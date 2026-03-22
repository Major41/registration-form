'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import GuestRegistrationForm from '@/components/GuestRegistrationForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export default function Home() {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header with Logo */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5">
          <div className="flex items-center justify-center gap-4">
            <Image
              src="/logo.png"
              alt="Comfy Inn Eldoret"
              width={70}
              height={70}
              className="rounded-xl shadow-md"
              priority
            />
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Comfy Inn Eldoret
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                Seamless Digital Check-in Experience
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-10 mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Welcome to Your Digital Check-in
            </h2>
            <p className="text-lg text-gray-100 mb-2">
              Quick, secure, and personalized registration for your comfort
            </p>
            <p className="text-sm text-gray-300">
              Complete your registration in just 4 simple steps
            </p>
          </div>

        </div>

        {/* Registration Form */}
        <GuestRegistrationForm
          onSubmitSuccess={handleRegistrationSuccess}
        />
      </main>

      {/* Success Modal */}
      <Dialog
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
      >
        <DialogContent className="max-w-md border-0 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">
                  ✓
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Welcome!
              </span>
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4 px-4">
            <p className="text-gray-700 text-lg font-medium mb-3">
              {successMessage}
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-900 text-sm">
                Your room is ready and waiting for you. If you need any assistance, please call our front desk at extension 0.
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              Thank you for choosing Comfy Inn Eldoret. Enjoy your stay!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
