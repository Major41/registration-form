import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import GuestRegistration from "@/lib/models/Guest";

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting registration request");
    await connectDB();
    console.log("[v0] Database connected");

    const body = await request.json();
    console.log("[v0] Request body received:", {
      ...body,
      signature: body.signature ? "present" : "missing",
    });

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.signature) {
      console.log("[v0] Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Clean the data - remove fields with empty strings, null, or undefined
    const cleanedData = Object.keys(body).reduce((acc, key) => {
      const value = body[key];
      // Only include fields that have a value (not empty string, null, or undefined)
      if (value !== "" && value !== null && value !== undefined) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);

    console.log("[v0] Cleaned data:", {
      ...cleanedData,
      signature: cleanedData.signature ? "present" : "missing",
    });

    // Create new guest registration with cleaned data
    const registration = new GuestRegistration(cleanedData);
    await registration.save();
    console.log("[v0] Registration saved:", registration._id);

    return NextResponse.json(
      {
        success: true,
        message: "Registration submitted successfully",
        registrationId: registration._id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[v0] Registration error:", error);
    return NextResponse.json(
      {
        error: "Failed to submit registration",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
