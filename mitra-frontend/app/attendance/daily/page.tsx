// app/attendance/daily/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Filter, 
  X,
  Clock,
  MapPin,
  User,
  Calendar,
  Eye,
  EyeOff
} from "lucide-react";

interface Attendance {
  id: number;
  srNo: number;
  name: string;
  date: string;
  punchIn: string;
  punchInTime: string;
  punchInLocation: string;
  punchInAddress: string;
  punchOut: string;
  punchOutTime: string;
  punchOutLocation: string;
  punchOutAddress: string;
  hours: number;
  activities: number;
}

// Mock attendance data
const mockAttendance: Attendance[] = [
  {
    id: 1,
    srNo: 1,
    name: "AVESH GHARANA",
    date: "2026-01-28",
    punchIn: "AM",
    punchInTime: "09:30:00",
    punchInLocation: "",
    punchInAddress: "N/A",
    punchOut: "N/A",
    punchOutTime: "",
    punchOutLocation: "",
    punchOutAddress: "N/A",
    hours: 1,
    activities: 1
  },
  {
    id: 2,
    srNo: 2,
    name: "ABHEEJIT JAMDAR",
    date: "2026-01-28",
    punchIn: "AM",
    punchInTime: "09:45:00",
    punchInLocation: "",
    punchInAddress: "Lasurne, Indapur, Pune, Maharashtra, 413117, India",
    punchOut: "N/A",
    punchOutTime: "",
    punchOutLocation: "",
    punchOutAddress: "N/A",
    hours: 1,
    activities: 1
  },
  {
    id: 3,
    srNo: 3,
    name: "Navnath Pawar",
    date: "2026-01-28",
    punchIn: "AM",
    punchInTime: "10:00:00",
    punchInLocation: "",
    punchInAddress: "Barshil Solapur, Maharashtra, 413400, India",
    punchOut: "N/A",
    punchOutTime: "",
    punchOutLocation: "",
    punchOutAddress: "N/A",
    hours: 1,
    activities: 1
  },
  {
    id: 4,
    srNo: 4,
    name: "VINOD THORAT",
    date: "2026-01-28",
    punchIn: "AM",
    punchInTime: "08:15:00",
    punchInLocation: "",
    punchInAddress: "N/A",
    punchOut: "N/A",
    punchOutTime: "",
    punchOutLocation: "",
    punchOutAddress: "N/A",
    hours: 1,
    activities: 1
  },
  {
    id: 5,
    srNo: 5,
    name: "Rajesh Patil",
    date: "2026-01-29",
    punchIn: "AM",
    punchInTime: "09:00:00",
    punchInLocation: "",
    punchInAddress: "Pune, Maharashtra",
    punchOut: "PM",
    punchOutTime: "17:30:00",
    punchOutLocation: "",
    punchOutAddress: "Pune, Maharashtra",
    hours: 8,
    activities: 5
  },
  {
    id: 6,
    srNo: 6,
    name: "Suresh Kamble",
    date: "2026-01-29",
    punchIn: "AM",
    punchInTime: "09:15:00",
    punchInLocation: "",
    punchInAddress: "Mumbai, Maharashtra",
    punchOut: "PM",
    punchOutTime: "18:00:00",
    punchOutLocation: "",
    punchOutAddress: "Mumbai, Maharashtra",
    hours: 8,
    activities: 4
  }
];

// Service engineers list
const serviceEngineers = [
  "All Engineers",
  "AVESH GHARANA",
  "ABHEEJIT JAMDAR",
  "Navnath Pawar",
  "VINOD THORAT",
  "Rajesh Patil",
  "Suresh Kamble"
];

export default function DailyAttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"detailed" | "compact">("detailed");
  const [selectedEngineer, setSelectedEngineer] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      setAttendance(mockAttendance);
      setFilteredAttendance(mockAttendance);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...attendance];
    
    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedEngineer && selectedEngineer !== "All Engineers") {
      filtered = filtered.filter(a => a.name === selectedEngineer);
    }
    
    if (fromDate) {
      filtered = filtered.filter(a => a.date >= fromDate);
    }
    
    if (toDate) {
      filtered = filtered.filter(a => a.date <= toDate);
    }
    
    setFilteredAttendance(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedEngineer("");
    setFromDate("");
    setToDate("");
    setFilteredAttendance(attendance);
    setCurrentPage(1);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredAttendance.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredAttendance.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = [
      "Sr.No.", "Name", "Date", "Punch In", "Punch In Time", "Punch In Address",
      "Punch Out", "Punch Out Time", "Punch Out Address", "Hours", "Activities"
    ];
    const csvData = filteredAttendance.map(a => [
      a.srNo,
      a.name,
      a.date,
      a.punchIn,
      a.punchInTime,
      a.punchInAddress,
      a.punchOut,
      a.punchOutTime,
      a.punchOutAddress,
      a.hours,
      a.activities
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `daily-attendance-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (value: string) => {
    if (value === "N/A" || !value) return "text-gray-400";
    return "text-green-600";
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#e8f5e9" }}>
            <Calendar size={18} className="text-[#2e7d32]" />
          </div>
          <div>
            <p className="font-black text-base leading-none text-gray-800">m.i.t.r.a.</p>
            <p className="text-xs text-gray-500">Mahindra Innovative Technologies & Research for Agriculture</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-black mt-4">Daily Attendance</h1>
        <p className="text-gray-500 mt-1">Track and manage daily attendance of service engineers</p>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && applyFilters()}
              />
            </div>
            <button
              onClick={applyFilters}
              className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors"
            >
              Apply
            </button>
          </div>
          
          <div className="flex gap-3">
            <select
              value={recordsPerPage}
              onChange={(e) => setRecordsPerPage(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
            >
              <option value={10}>10 Records Per Page</option>
              <option value={25}>25 Records Per Page</option>
              <option value={50}>50 Records Per Page</option>
              <option value={100}>100 Records Per Page</option>
            </select>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
          <select
            value={selectedEngineer}
            onChange={(e) => setSelectedEngineer(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black text-sm"
          >
            <option value="">Service Engineer: Select Service Engineer</option>
            {serviceEngineers.map(engineer => (
              <option key={engineer} value={engineer}>{engineer}</option>
            ))}
          </select>
          
          <input
            type="date"
            placeholder="From: dd-mm-yyyy"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black text-sm"
          />
          
          <input
            type="date"
            placeholder="To: dd-mm-yyyy"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black text-sm"
          />
          
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setViewMode("detailed")}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              viewMode === "detailed" 
                ? "bg-[#2e7d32] text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Eye size={16} />
            Detailed (per complaint)
          </button>
          <button
            onClick={() => setViewMode("compact")}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
              viewMode === "compact" 
                ? "bg-[#2e7d32] text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <EyeOff size={16} />
            Compact (count only)
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Punch In</th>
                {viewMode === "detailed" && (
                  <>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">In Address</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Punch Out</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Out Address</th>
                  </>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hours</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activities</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={viewMode === "detailed" ? 11 : 7} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading attendance...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{record.srNo}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">{record.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{record.date}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      <div className="flex items-center gap-1">
                        <Clock size={12} className="text-gray-400" />
                        <span>{record.punchInTime || record.punchIn}</span>
                      </div>
                    </td>
                    {viewMode === "detailed" && (
                      <>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                          {record.punchInLocation || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-black max-w-xs truncate">
                          <div className="flex items-center gap-1">
                            <MapPin size={12} className="text-gray-400" />
                            <span className={getStatusColor(record.punchInAddress)}>
                              {record.punchInAddress}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                          {record.punchOutTime || record.punchOut || "-"}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                          {record.punchOutLocation || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-black max-w-xs truncate">
                          <div className="flex items-center gap-1">
                            <MapPin size={12} className="text-gray-400" />
                            <span className={getStatusColor(record.punchOutAddress)}>
                              {record.punchOutAddress}
                            </span>
                          </div>
                        </td>
                      </>
                    )}
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{record.hours} hrs</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{record.activities}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={viewMode === "detailed" ? 11 : 7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Calendar size={48} className="text-gray-300 mb-3" />
                      <p className="text-gray-500 text-lg">No Data Found</p>
                      <p className="text-gray-400 text-sm mt-1">No attendance records available for the selected filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredAttendance.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredAttendance.length)}</span> of{" "}
              <span className="font-medium">{filteredAttendance.length}</span> results
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-black bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                <ChevronLeft size={16} />
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-black">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-black bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}