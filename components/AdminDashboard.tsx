"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Registration {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passportNumber: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  signature: string;
  createdAt: string;
  [key: string]: any;
}

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

export default function AdminDashboard({
  token,
  onLogout,
}: AdminDashboardProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRegistrations, setSelectedRegistrations] = useState<
    Set<string>
  >(new Set());
  const [viewingRegistration, setViewingRegistration] =
    useState<Registration | null>(null);
  const [exporting, setExporting] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const itemsPerPage = 10;

  const fetchRegistrations = async (page: number = 1, search: string = "") => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        ...(search && { search }),
      });

      const response = await fetch(`/api/admin/registrations?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          onLogout();
          return;
        }
        throw new Error("Failed to fetch registrations");
      }

      const data = await response.json();
      setRegistrations(data.data);
      setTotalPages(data.pagination.pages);
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations(1, searchTerm);
  }, [searchTerm]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const toggleSelectRegistration = (id: string) => {
    const newSelected = new Set(selectedRegistrations);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedRegistrations(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedRegistrations.size === registrations.length) {
      setSelectedRegistrations(new Set());
    } else {
      setSelectedRegistrations(new Set(registrations.map((r) => r._id)));
    }
  };

  const handleExportPDF = async (registrationIds?: string[]) => {
    setExporting(true);
    try {
      const idsToExport =
        registrationIds && registrationIds.length > 0
          ? registrationIds
          : selectedRegistrations.size > 0
            ? Array.from(selectedRegistrations)
            : [];

      const response = await fetch("/api/admin/export-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          registrationIds: idsToExport,
          all: idsToExport.length === 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to export PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `guest-registrations-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setShowExportDialog(false);
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Manage guest registrations</p>
          </div>
          <Button variant="outline" onClick={onLogout} className="bg-white">
            Logout
          </Button>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Guests
              </label>
              <Input
                type="text"
                placeholder="Search by name, email, or passport..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowExportDialog(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                Export PDF
              </Button>
            </div>
          </div>

          {/* Selection Info */}
          {selectedRegistrations.size > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded flex justify-between items-center">
              <span className="text-blue-900">
                {selectedRegistrations.size} registration
                {selectedRegistrations.size !== 1 ? "s" : ""} selected
              </span>
              <Button
                onClick={() =>
                  handleExportPDF(Array.from(selectedRegistrations))
                }
                disabled={exporting}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700"
              >
                {exporting ? "Exporting..." : "Export Selected"}
              </Button>
            </div>
          )}
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="w-12">
                    <input
                      type="checkbox"
                      checked={
                        selectedRegistrations.size === registrations.length &&
                        registrations.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="w-4 h-4"
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Passport</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : registrations.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center py-8 text-gray-500"
                    >
                      No registrations found
                    </TableCell>
                  </TableRow>
                ) : (
                  registrations.map((reg) => (
                    <TableRow key={reg._id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedRegistrations.has(reg._id)}
                          onChange={() => toggleSelectRegistration(reg._id)}
                          className="w-4 h-4"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {reg.firstName} {reg.lastName}
                      </TableCell>
                      <TableCell className="text-sm">{reg.email}</TableCell>
                      <TableCell className="text-sm">{reg.phone}</TableCell>
                      <TableCell>{reg.roomNumber}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(reg.checkInDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(reg.checkOutDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {reg.passportNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setViewingRegistration(reg)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleExportPDF([reg._id])}
                            disabled={exporting}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            PDF
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() =>
                    fetchRegistrations(currentPage - 1, searchTerm)
                  }
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    fetchRegistrations(currentPage + 1, searchTerm)
                  }
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Registration Modal */}
      <Dialog
        open={!!viewingRegistration}
        onOpenChange={() => setViewingRegistration(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registration Details</DialogTitle>
          </DialogHeader>
          {viewingRegistration && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg font-semibold">
                    {viewingRegistration.firstName}{" "}
                    {viewingRegistration.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg font-semibold">
                    {viewingRegistration.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Phone</p>
                  <p className="text-lg font-semibold">
                    {viewingRegistration.phone}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Passport</p>
                  <p className="text-lg font-semibold">
                    {viewingRegistration.passportNumber}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Room</p>
                  <p className="text-lg font-semibold">
                    {viewingRegistration.roomNumber} (
                    {viewingRegistration.roomType})
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Check-in</p>
                  <p className="text-lg font-semibold">
                    {new Date(
                      viewingRegistration.checkInDate,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Check-out</p>
                  <p className="text-lg font-semibold">
                    {new Date(
                      viewingRegistration.checkOutDate,
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Nights</p>
                  <p className="text-lg font-semibold">
                    {viewingRegistration.numberOfNights}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  Signature
                </p>
                {viewingRegistration.signature ? (
                  <img
                    src={viewingRegistration.signature}
                    alt="Signature"
                    className="max-w-full h-auto border rounded"
                  />
                ) : (
                  <p className="text-gray-500">No signature available</p>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-500">
                  Submitted:{" "}
                  {new Date(viewingRegistration.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Export Options Dialog */}
      <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Export Registrations</AlertDialogTitle>
          <AlertDialogDescription>
            Choose what to export:
          </AlertDialogDescription>
          <div className="space-y-3">
            <Button
              onClick={() => handleExportPDF(Array.from(selectedRegistrations))}
              disabled={exporting || selectedRegistrations.size === 0}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {exporting
                ? "Exporting..."
                : `Export Selected (${selectedRegistrations.size})`}
            </Button>
            <Button
              onClick={() => handleExportPDF([])}
              disabled={exporting}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {exporting ? "Exporting..." : "Export All Registrations"}
            </Button>
          </div>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
