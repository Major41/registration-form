import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import GuestRegistration from '@/lib/models/Guest';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

// Dynamically import jsPDF for PDF generation
async function generatePDF(registrations: any[]) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();

  let yPosition = 10;
  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const margin = 15;
  const lineHeight = 6;
  const columnWidth = (pageWidth - 2 * margin) / 2;

  registrations.forEach((registration, index) => {
    if (index > 0) {
      doc.addPage();
      yPosition = 10;
    }

    // Header with Hotel Info
    yPosition = 10;
    
    // Hotel Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(25, 118, 210); // Blue color
    doc.text('COMFY INN ELDORET', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;

    // Subtitle
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text('Guest Registration Form', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Hotel Contact Info
    doc.setFontSize(8);
    doc.setTextColor(80, 80, 80);
    const contactLine1 = 'Phone: 0703696692 | Website: www.comfyinneldoret.com';
    doc.text(contactLine1, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;

    // Guest Details Section Header
    yPosition += 4;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(25, 118, 210);
    doc.text('Guest Details', margin, yPosition);
    yPosition += 6;

    // Personal Information - Two Column Layout
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Personal Information', margin, yPosition);
    yPosition += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);

    const personalInfoLeft = [
      `Full Name: ${registration.firstName} ${registration.lastName}`,
      `Gender: ${registration.gender}`,
    ];

    const personalInfoRight = [
      `Nationality: ${registration.nationality}`,
      `Passport: ${registration.passportNumber}`,
    ];

    let currentY = yPosition;
    personalInfoLeft.forEach((line) => {
      doc.text(line, margin + 2, currentY);
      currentY += lineHeight;
    });

    personalInfoRight.forEach((line, idx) => {
      doc.text(line, margin + columnWidth, yPosition + idx * lineHeight);
    });

    yPosition = Math.max(yPosition + personalInfoLeft.length * lineHeight, yPosition + personalInfoRight.length * lineHeight) + 4;

    // Contact Information
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(25, 118, 210);
    doc.text('Contact Information', margin, yPosition);
    yPosition += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(`Email: ${registration.email}`, margin + 2, yPosition);
    yPosition += lineHeight;
    doc.text(`Phone: ${registration.phone}`, margin + 2, yPosition);
    yPosition += 5;

    // Stay Information
    if (yPosition > pageHeight - 70) {
      doc.addPage();
      yPosition = 10;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(25, 118, 210);
    doc.text('Stay Information', margin, yPosition);
    yPosition += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);

    const stayInfoLeft = [
      `Check-in: ${registration.checkInDate}`,
      `Check-out: ${registration.checkOutDate}`,
      `Guests: ${registration.numberOfGuests}`,
    ];

    const stayInfoRight = [
      `Room: ${registration.roomNumber} (${registration.roomType})`,
      `Nights: ${registration.numberOfNights}`,
      `Rate: $${registration.ratePerNight}`,
    ];

    currentY = yPosition;
    stayInfoLeft.forEach((line) => {
      doc.text(line, margin + 2, currentY);
      currentY += lineHeight;
    });

    stayInfoRight.forEach((line, idx) => {
      doc.text(line, margin + columnWidth, yPosition + idx * lineHeight);
    });

    yPosition = currentY + 4;

    // Additional Information
    if (registration.purposeOfVisit) {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 10;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(25, 118, 210);
      doc.text('Additional Information', margin, yPosition);
      yPosition += 5;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      doc.text(`Purpose of Visit: ${registration.purposeOfVisit}`, margin + 2, yPosition);
      yPosition += lineHeight;

      if (registration.companyName) {
        doc.text(`Company: ${registration.companyName}`, margin + 2, yPosition);
        yPosition += lineHeight;
        if (registration.companyAddress) {
          doc.text(`Company Address: ${registration.companyAddress}`, margin + 2, yPosition);
          yPosition += lineHeight;
        }
      }
      yPosition += 3;
    }

    // Signature Section
    if (registration.signature) {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = 10;
      }

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(25, 118, 210);
      doc.text('Guest Signature', margin, yPosition);
      yPosition += 5;

      try {
        doc.addImage(registration.signature, 'PNG', margin + 2, yPosition, 40, 15);
        yPosition += 20;
      } catch (e) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Signature image unavailable', margin + 2, yPosition);
        yPosition += lineHeight;
      }
    }

    // Footer with submission date
    yPosition = pageHeight - 15;
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    const submittedDate = new Date(registration.createdAt).toLocaleDateString();
    const submittedTime = new Date(registration.createdAt).toLocaleTimeString();
    doc.text(
      `Registration Date: ${submittedDate} | Time: ${submittedTime}`,
      pageWidth / 2,
      yPosition,
      { align: 'center' }
    );
  });

  return doc.output('arraybuffer');
}

export async function POST(request: NextRequest) {
  try {
    // Verify token
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
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
        { error: 'No registrations specified' },
        { status: 400 }
      );
    }

    const registrations = await GuestRegistration.find(query).sort({
      createdAt: -1,
    });

    if (registrations.length === 0) {
      return NextResponse.json(
        { error: 'No registrations found' },
        { status: 404 }
      );
    }

    const pdfBuffer = await generatePDF(registrations);

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="guest-registrations-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
