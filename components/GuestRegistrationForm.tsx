"use client";

import React, { useState } from "react";
import { SignaturePad } from "./SignaturePad";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";

interface FormData {
  firstName: string;
  lastName: string;
  gender: string;
  nationality: string;
  passportNumber: string;
  email: string;
  phone: string;
  checkInDate: string;
  checkOutDate: string;
  roomNumber: string;
  roomType: string;
  numberOfGuests: number;
  numberOfNights: number;
  ratePerNight: number;
  purposeOfVisit: string;
  companyName: string;
  companyAddress: string;
}

interface GuestRegistrationFormProps {
  onSubmitSuccess: (message: string) => void;
}

export default function GuestRegistrationForm({
  onSubmitSuccess,
}: GuestRegistrationFormProps) {
  const [signature, setSignature] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    gender: "",
    nationality: "",
    passportNumber: "",
    email: "",
    phone: "",
    checkInDate: "",
    checkOutDate: "",
    roomNumber: "",
    roomType: "",
    numberOfGuests: 1,
    numberOfNights: 1,
    ratePerNight: 0,
    purposeOfVisit: "",
    companyName: "",
    companyAddress: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ? (value === "" ? 0 : parseFloat(value)) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
      if (!formData.nationality.trim())
        newErrors.nationality = "Nationality is required";
      if (!formData.passportNumber.trim())
        newErrors.passportNumber = "Passport number is required";
    } else if (step === 2) {
      if (!formData.email.trim()) newErrors.email = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(formData.email))
        newErrors.email = "Invalid email format";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    } else if (step === 3) {
      if (!formData.checkInDate)
        newErrors.checkInDate = "Check-in date is required";
      if (!formData.checkOutDate)
        newErrors.checkOutDate = "Check-out date is required";
      if (!formData.roomNumber.trim())
        newErrors.roomNumber = "Room number is required";
      if (!formData.roomType) newErrors.roomType = "Room type is required";
      if (!formData.purposeOfVisit.trim())
        newErrors.purposeOfVisit = "Purpose of visit is required";
    } else if (step === 4) {
      if (!signature) {
        newErrors.signature = "Signature is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(4)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          signature,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit registration");
      }

      onSubmitSuccess(
        `Welcome, ${formData.firstName}! Your registration has been completed successfully.`,
      );

      setFormData({
        firstName: "",
        lastName: "",
        gender: "",
        nationality: "",
        passportNumber: "",
        email: "",
        phone: "",
        checkInDate: "",
        checkOutDate: "",
        roomNumber: "",
        roomType: "",
        numberOfGuests: 1,
        numberOfNights: 1,
        ratePerNight: 0,
        purposeOfVisit: "",
        companyName: "",
        companyAddress: "",
      });
      setSignature(null);
      setCurrentStep(1);
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        submit: "Failed to submit registration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepTitles = [
    "Personal Details",
    "Contact Information",
    "Stay Details",
    "Signature",
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-10"
    >
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-8">
          {stepTitles.map((title, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                  currentStep > index + 1
                    ? "bg-green-500 text-white"
                    : currentStep === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > index + 1 ? "✓" : index + 1}
              </div>
              <p
                className={`mt-2 text-xs font-medium text-center ${
                  currentStep >= index + 1 ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {title}
              </p>
              {index < stepTitles.length - 1 && (
                <div
                  className={`h-1 w-full mt-4 mx-2 rounded ${
                    currentStep > index + 1 ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Submit error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6">
          {errors.submit}
        </div>
      )}

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Tell us about yourself
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldGroup>
              <FieldLabel>First Name *</FieldLabel>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="First Name"
                className="w-full"
              />
              {errors.firstName && <FieldError>{errors.firstName}</FieldError>}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Last Name *</FieldLabel>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Last Name"
                className="w-full"
              />
              {errors.lastName && <FieldError>{errors.lastName}</FieldError>}
            </FieldGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldGroup>
              <FieldLabel>Gender *</FieldLabel>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && <FieldError>{errors.gender}</FieldError>}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Nationality *</FieldLabel>
              <Input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleInputChange}
                placeholder="e.g., Kenyan"
                className="w-full"
              />
              {errors.nationality && (
                <FieldError>{errors.nationality}</FieldError>
              )}
            </FieldGroup>
          </div>

          <FieldGroup>
            <FieldLabel>Passport Number / ID NO *</FieldLabel>
            <Input
              type="text"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleInputChange}
              placeholder="A12345678"
              className="w-full"
            />
            {errors.passportNumber && (
              <FieldError>{errors.passportNumber}</FieldError>
            )}
          </FieldGroup>
        </div>
      )}

      {/* Step 2: Contact Information */}
      {currentStep === 2 && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            How can we reach you?
          </h2>

          <FieldGroup>
            <FieldLabel>Email Address *</FieldLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="kelvin@example.com"
              className="w-full"
            />
            {errors.email && <FieldError>{errors.email}</FieldError>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Phone Number *</FieldLabel>
            <Input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="0712345678"
              className="w-full"
            />
            {errors.phone && <FieldError>{errors.phone}</FieldError>}
          </FieldGroup>
        </div>
      )}

      {/* Step 3: Stay Information */}
      {currentStep === 3 && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your stay with us
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldGroup>
              <FieldLabel>Check-in Date *</FieldLabel>
              <Input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleInputChange}
                className="w-full"
              />
              {errors.checkInDate && (
                <FieldError>{errors.checkInDate}</FieldError>
              )}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Check-out Date *</FieldLabel>
              <Input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleInputChange}
                className="w-full"
              />
              {errors.checkOutDate && (
                <FieldError>{errors.checkOutDate}</FieldError>
              )}
            </FieldGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldGroup>
              <FieldLabel>Room Number *</FieldLabel>
              <Input
                type="text"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleInputChange}
                placeholder="101"
                className="w-full"
              />
              {errors.roomNumber && (
                <FieldError>{errors.roomNumber}</FieldError>
              )}
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Room Type *</FieldLabel>
              <Select
                value={formData.roomType}
                onValueChange={(value) => handleSelectChange("roomType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Standard</SelectItem>
                  <SelectItem value="Double">Deluxe</SelectItem>
                  <SelectItem value="Suite">Twin</SelectItem>
                </SelectContent>
              </Select>
              {errors.roomType && <FieldError>{errors.roomType}</FieldError>}
            </FieldGroup>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FieldGroup>
              <FieldLabel>Number of Guests</FieldLabel>
              <Input
                type="number"
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleInputChange}
                min="1"
                className="w-full"
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Number of Nights</FieldLabel>
              <Input
                type="number"
                name="numberOfNights"
                value={formData.numberOfNights}
                onChange={handleInputChange}
                min="1"
                className="w-full"
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Rate per Night (Ksh)</FieldLabel>
              <Input
                type="number"
                name="ratePerNight"
                value={formData.ratePerNight}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="150.00"
                className="w-full"
              />
            </FieldGroup>
          </div>

          <FieldGroup>
            <FieldLabel>Purpose of Visit *</FieldLabel>
            <Select
              value={formData.purposeOfVisit}
              onValueChange={(value) =>
                handleSelectChange("purposeOfVisit", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select purpose of visit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Leisure">Leisure</SelectItem>
                <SelectItem value="Tourism">Tourism</SelectItem>
                <SelectItem value="Conference">Conference</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.purposeOfVisit && (
              <FieldError>{errors.purposeOfVisit}</FieldError>
            )}
          </FieldGroup>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FieldGroup>
              <FieldLabel>Company Name (Optional)</FieldLabel>
              <Input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                placeholder="Your Company"
                className="w-full"
              />
            </FieldGroup>

            <FieldGroup>
              <FieldLabel>Company Address (Optional)</FieldLabel>
              <Input
                type="text"
                name="companyAddress"
                value={formData.companyAddress}
                onChange={handleInputChange}
                placeholder="123 Company Street"
                className="w-full"
              />
            </FieldGroup>
          </div>
        </div>
      )}

      {/* Step 4: Signature */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Finalize with your signature
          </h2>

          <FieldGroup>
            <FieldLabel>Digital Signature *</FieldLabel>
            <p className="text-sm text-gray-600 mb-4">
              Please sign in the box below to confirm your registration
            </p>
            <div className="bg-gray-50 border-2 border-gray-300 rounded-lg overflow-hidden">
              <SignaturePad onSave={setSignature} width={500} height={250} />
            </div>
            {errors.signature && <FieldError>{errors.signature}</FieldError>}
          </FieldGroup>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4 mt-8">
        <Button
          type="button"
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
          variant="outline"
          className="px-6 py-2"
        >
          Previous
        </Button>

        {currentStep < 4 ? (
          <Button
            type="button"
            onClick={handleNextStep}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
          >
            Next
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
          >
            {isSubmitting ? "Submitting..." : "Complete Registration"}
          </Button>
        )}
      </div>
    </form>
  );
}
