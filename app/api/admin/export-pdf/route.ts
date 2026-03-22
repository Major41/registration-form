import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import GuestRegistration from "@/lib/models/Guest";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";

// Dynamically import jsPDF for PDF generation
async function generatePDF(registrations: any[]) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF();

  let yPosition = 10;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 10;
  const lineHeight = 7;

  registrations.forEach((registration, index) => {
    if (index > 0) {
      doc.addPage();
      yPosition = 10;
    }

    // Title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("GUEST REGISTRATION", margin, yPosition);
    yPosition += 10;

    // Personal Information
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("PERSONAL INFORMATION", margin, yPosition);
    yPosition += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const personalInfo = [
      `Name: ${registration.firstName} ${registration.lastName}`,
      `Date of Birth: ${registration.dateOfBirth}`,
      `Gender: ${registration.gender}`,
      `Nationality: ${registration.nationality}`,
      `Passport: ${registration.passportNumber} (Expires: ${registration.passportExpiry})`,
    ];

    personalInfo.forEach((line) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 10;
      }
      doc.text(line, margin + 5, yPosition);
      yPosition += lineHeight;
    });

    yPosition += 3;

    // Contact Information
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("CONTACT INFORMATION", margin, yPosition);
    yPosition += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const contactInfo = [
      `Email: ${registration.email}`,
      `Phone: ${registration.phone}`,
      `Address: ${registration.address}, ${registration.city}, ${registration.state}, ${registration.country} ${registration.postalCode}`,
    ];

    contactInfo.forEach((line) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 10;
      }
      doc.text(line, margin + 5, yPosition);
      yPosition += lineHeight;
    });

    yPosition += 3;

    // Stay Information
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("STAY INFORMATION", margin, yPosition);
    yPosition += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const stayInfo = [
      `Check-in: ${registration.checkInDate} | Check-out: ${registration.checkOutDate}`,
      `Room: ${registration.roomNumber} (${registration.roomType})`,
      `Guests: ${registration.numberOfGuests} | Nights: ${registration.numberOfNights}`,
      `Rate per Night: $${registration.ratePerNight}`,
    ];

    stayInfo.forEach((line) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 10;
      }
      doc.text(line, margin + 5, yPosition);
      yPosition += lineHeight;
    });

    yPosition += 3;

    // Additional Information
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("ADDITIONAL INFORMATION", margin, yPosition);
    yPosition += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const additionalInfo = [
      `Purpose of Visit: ${registration.purposeOfVisit}`,
      ...(registration.companyName
        ? [
            `Company: ${registration.companyName}`,
            `Company Address: ${registration.companyAddress}`,
          ]
        : []),
    ];

    additionalInfo.forEach((line) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 10;
      }
      doc.text(line, margin + 5, yPosition);
      yPosition += lineHeight;
    });

    yPosition += 5;

    // Signature
    if (registration.signature) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 10;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("SIGNATURE", margin, yPosition);
      yPosition += lineHeight;

      try {
        doc.addImage(
          registration.signature,
          "PNG",
          margin + 5,
          yPosition,
          50,
          20,
        );
        yPosition += 25;
      } catch (e) {
        doc.text("Signature unavailable", margin + 5, yPosition);
        yPosition += lineHeight;
      }
    }

    yPosition += 5;

    // Submission date
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.text(
      `Submitted: ${new Date(registration.createdAt).toLocaleString()}`,
      margin,
      yPosition,
    );
  });

  return doc.output("arraybuffer");
}

export async function POST(request: NextRequest) {
  try {
    // Verify token
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { registrationIds, all } = body;

    let query: any = {};

    if (all) {
      // Export all registrations
      query = {};
    } else if (registrationIds && registrationIds.length > 0) {
      // Export specific registrations
      query = {
        _id: { $in: registrationIds },
      };
    } else {
      return NextResponse.json(
        { error: "No registrations specified" },
        { status: 400 },
      );
    }

    const registrations = await GuestRegistration.find(query).sort({
      createdAt: -1,
    });

    if (registrations.length === 0) {
      return NextResponse.json(
        { error: "No registrations found" },
        { status: 404 },
      );
    }

    const pdfBuffer = await generatePDF(registrations);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="guest-registrations-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
