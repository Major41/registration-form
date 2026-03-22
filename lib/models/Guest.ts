import mongoose, { Schema, Document } from 'mongoose';

export interface IGuestRegistration extends Document {
  // Personal Information
  firstName: string;
  lastName: string;
  gender: string;
  nationality: string;
  passportNumber: string;

  // Contact Information
  email: string;
  phone: string;

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

  // Signature
  signature: string; // Base64 encoded signature image

  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

const guestRegistrationSchema = new Schema<IGuestRegistration>(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
      required: [true, 'Gender is required'],
    },
    nationality: {
      type: String,
      required: [true, 'Nationality is required'],
      trim: true,
    },
    passportNumber: {
      type: String,
      required: [true, 'Passport number is required'],
      trim: true,
    },

    // Contact Information
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email',
      ],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },

    // Stay Information
    checkInDate: {
      type: String,
      required: [true, 'Check-in date is required'],
    },
    checkOutDate: {
      type: String,
      required: [true, 'Check-out date is required'],
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
    },
    roomType: {
      type: String,
      enum: ['Single', 'Double', 'Suite', 'Deluxe', 'Penthouse'],
      required: [true, 'Room type is required'],
    },
    numberOfGuests: {
      type: Number,
      required: [true, 'Number of guests is required'],
      min: 1,
    },
    numberOfNights: {
      type: Number,
      required: [true, 'Number of nights is required'],
      min: 1,
    },
    ratePerNight: {
      type: Number,
      required: [true, 'Rate per night is required'],
      min: 0,
    },

    // Additional Information
    purposeOfVisit: {
      type: String,
      required: [true, 'Purpose of visit is required'],
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    companyAddress: {
      type: String,
      trim: true,
    },

    // Signature
    signature: {
      type: String,
      required: [true, 'Signature is required'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.GuestRegistration ||
  mongoose.model<IGuestRegistration>(
    'GuestRegistration',
    guestRegistrationSchema
  );
