"use client";

import React, { useState } from "react";
import { SignaturePad } from "./SignaturePad";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";

interface FormData {
  // Personal Information
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;

  // Contact Information
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  address: string;
  postalCode: string;

  // Stay Information
  checkInDate: string;
  checkOutDate: string;
  roomNumber: string;
  roomType: string;
  numberOfGuests: number;
  numberOfNights: number;
  ratePerNight: number;

  // Additional Information
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
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    nationality: "",
    passportNumber: "",
    passportExpiry: "",
    email: "",
    phone: "",
    country: "",
    state: "",
    city: "",
    address: "",
    postalCode: "",
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
    // Clear error for this field
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.nationality.trim())
      newErrors.nationality = "Nationality is required";
    if (!formData.passportNumber.trim())
      newErrors.passportNumber = "Passport number is required";
    if (!formData.passportExpiry)
      newErrors.passportExpiry = "Passport expiry is required";

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.state.trim()) newErrors.state = "State/Province is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.postalCode.trim())
      newErrors.postalCode = "Postal code is required";

    if (!formData.checkInDate)
      newErrors.checkInDate = "Check-in date is required";
    if (!formData.checkOutDate)
      newErrors.checkOutDate = "Check-out date is required";
    if (!formData.roomNumber.trim())
      newErrors.roomNumber = "Room number is required";
    if (!formData.roomType) newErrors.roomType = "Room type is required";
    if (!formData.purposeOfVisit.trim())
      newErrors.purposeOfVisit = "Purpose of visit is required";

    if (!signature) {
      newErrors.signature = "Signature is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
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

    

      const data = await response.json();
      onSubmitSuccess(
        `Welcome, ${formData.firstName}! Your registration has been completed successfully.`,
      );

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        nationality: "",
        passportNumber: "",
        passportExpiry: "",
        email: "",
        phone: "",
        country: "",
        state: "",
        city: "",
        address: "",
        postalCode: "",
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
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({
        submit: "Failed to submit registration. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 md:p-8 space-y-8"
    >
      {/* Submit error */}
      {errors.submit && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.submit}
        </div>
      )}

      {/* Personal Information Section */}
      <fieldset className="space-y-4">
        <legend className="text-xl font-bold text-gray-900 mb-4">
          Personal Information
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldGroup>
            <FieldLabel>First Name *</FieldLabel>
            <Input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="John"
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
              placeholder="Doe"
              className="w-full"
            />
            {errors.lastName && <FieldError>{errors.lastName}</FieldError>}
          </FieldGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldGroup>
            <FieldLabel>Date of Birth *</FieldLabel>
            <Input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full"
            />
            {errors.dateOfBirth && (
              <FieldError>{errors.dateOfBirth}</FieldError>
            )}
          </FieldGroup>

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldGroup>
            <FieldLabel>Nationality *</FieldLabel>
            <Input
              type="text"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              placeholder="United States"
              className="w-full"
            />
            {errors.nationality && (
              <FieldError>{errors.nationality}</FieldError>
            )}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Passport Number *</FieldLabel>
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

        <FieldGroup>
          <FieldLabel>Passport Expiry Date *</FieldLabel>
          <Input
            type="date"
            name="passportExpiry"
            value={formData.passportExpiry}
            onChange={handleInputChange}
            className="w-full"
          />
          {errors.passportExpiry && (
            <FieldError>{errors.passportExpiry}</FieldError>
          )}
        </FieldGroup>
      </fieldset>

      {/* Contact Information Section */}
      <fieldset className="space-y-4">
        <legend className="text-xl font-bold text-gray-900 mb-4">
          Contact Information
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldGroup>
            <FieldLabel>Email *</FieldLabel>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="john@example.com"
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
              placeholder="+1 (555) 000-0000"
              className="w-full"
            />
            {errors.phone && <FieldError>{errors.phone}</FieldError>}
          </FieldGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldGroup>
            <FieldLabel>Country *</FieldLabel>
            <Input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="United States"
              className="w-full"
            />
            {errors.country && <FieldError>{errors.country}</FieldError>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>State/Province *</FieldLabel>
            <Input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="California"
              className="w-full"
            />
            {errors.state && <FieldError>{errors.state}</FieldError>}
          </FieldGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldGroup>
            <FieldLabel>City *</FieldLabel>
            <Input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="San Francisco"
              className="w-full"
            />
            {errors.city && <FieldError>{errors.city}</FieldError>}
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>Postal Code *</FieldLabel>
            <Input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="94103"
              className="w-full"
            />
            {errors.postalCode && <FieldError>{errors.postalCode}</FieldError>}
          </FieldGroup>
        </div>

        <FieldGroup>
          <FieldLabel>Address *</FieldLabel>
          <Input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="123 Main Street"
            className="w-full"
          />
          {errors.address && <FieldError>{errors.address}</FieldError>}
        </FieldGroup>
      </fieldset>

      {/* Stay Information Section */}
      <fieldset className="space-y-4">
        <legend className="text-xl font-bold text-gray-900 mb-4">
          Stay Information
        </legend>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {errors.roomNumber && <FieldError>{errors.roomNumber}</FieldError>}
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
                <SelectItem value="Single">Single</SelectItem>
                <SelectItem value="Double">Double</SelectItem>
                <SelectItem value="Suite">Suite</SelectItem>
                <SelectItem value="Deluxe">Deluxe</SelectItem>
                <SelectItem value="Penthouse">Penthouse</SelectItem>
              </SelectContent>
            </Select>
            {errors.roomType && <FieldError>{errors.roomType}</FieldError>}
          </FieldGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FieldGroup>
            <FieldLabel>Number of Guests *</FieldLabel>
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
            <FieldLabel>Number of Nights *</FieldLabel>
            <Input
              type="number"
              name="numberOfNights"
              value={formData.numberOfNights}
              onChange={handleInputChange}
              min="1"
              className="w-full"
            />
          </FieldGroup>
        </div>

        <FieldGroup>
          <FieldLabel>Rate per Night ($) *</FieldLabel>
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
      </fieldset>

      {/* Additional Information Section */}
      <fieldset className="space-y-4">
        <legend className="text-xl font-bold text-gray-900 mb-4">
          Additional Information
        </legend>

        <FieldGroup>
          <FieldLabel>Purpose of Visit *</FieldLabel>
          <Input
            type="text"
            name="purposeOfVisit"
            value={formData.purposeOfVisit}
            onChange={handleInputChange}
            placeholder="Business / Leisure / Tourism"
            className="w-full"
          />
          {errors.purposeOfVisit && (
            <FieldError>{errors.purposeOfVisit}</FieldError>
          )}
        </FieldGroup>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </fieldset>

      {/* Signature Section */}
      <fieldset className="space-y-4">
        <legend className="text-xl font-bold text-gray-900 mb-4">
          Digital Signature
        </legend>
        <FieldGroup>
          <FieldLabel>Please sign below *</FieldLabel>
          <SignaturePad onSave={setSignature} width={500} height={200} />
          {errors.signature && <FieldError>{errors.signature}</FieldError>}
        </FieldGroup>
      </fieldset>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
        >
          {isSubmitting ? "Submitting..." : "Submit Registration"}
        </Button>
      </div>
    </form>
  );
}
