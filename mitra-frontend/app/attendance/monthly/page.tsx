// app/attendance/monthly/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Calendar,
  User,
  Clock,
  TrendingUp
} from "lucide-react";

interface MonthlyAttendance {
  id: number;
  srNo: number;
  name: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  totalHours: number;
  avgHoursPerDay: number;
  activities: number;
  month: string;
  year: number;
}

// Mock monthly attendance data
const mockMonthlyAttendance: MonthlyAttendance[] = [
  {
    id: 1,
    srNo: 1,
    name: "AVESH GHARANA",
    totalDays: 30,
    presentDays: 25,
    absentDays: 5,
    totalHours: 200,
    avgHoursPerDay: 6.7,
    activities: 25,
    month: "January",
    year: 2026
  },
  {
    id: 2,
    srNo: 2,
    name: "ABHEEJIT JAMDAR",
    totalDays: 30,
    presentDays: 28,
    absentDays: 2,
    totalHours: 224,
    avgHoursPerDay: 8,
    activities: 32,
    month: "January",
    year: 2026
  },
  {
    id: 3,
    srNo: 3,
    name: "Navnath Pawar",
    totalDays: 30,
    presentDays: 26,
    absentDays: 4,
    totalHours: 208,
    avgHoursPerDay: 8,
    activities: 28,
    month: "January",
    year: 2026
  },
  {
    id: 4,
    srNo: 4,
    name: "VINOD THORAT",
    totalDays: 30,
    presentDays: 24,
    absentDays: 6,
    totalHours: 192,
    avgHoursPerDay: 8,
    activities: 22,
    month: "January",
    year: 2026
  },
  {
    id: 5,
    srNo: 5,
    name: "Rajesh Patil",
    totalDays: 30,
    presentDays: 30,
    absentDays: 0,
    totalHours: 240,
    avgHoursPerDay: 8,
    activities: 35,
    month: "January",
    year: 2026
  }
];

// Service engineers list
const serviceEngineers = [
  "All Engineers",
  "AVESH GHARANA",
  "ABHEEJIT JAMDAR",
  "Navnath Pawar",
  "VINOD THORAT",
  "Rajesh Patil"
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = [2024, 2025, 2026, 2027, 2028];

export default function MonthlyAttendancePage() {
  const [attendance, setAttendance] = useState<MonthlyAttendance[]>([]);
  const [filteredAttendance, setFilteredAttendance] = useState<MonthlyAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEngineer, setSelectedEngineer] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("January");
  const [selectedYear, setSelectedYear] = useState(2026);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      setAttendance(mockMonthlyAttendance);
      setFilteredAttendance(mockMonthlyAttendance);
    } catch (error) {
      console.error("Error fetching monthly attendance:", error);
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
    
    if (selectedMonth) {
      filtered = filtered.filter(a => a.month === selectedMonth);
    }
    
    if (selectedYear) {
      filtered = filtered.filter(a => a.year === selectedYear);
    }
    
    setFilteredAttendance(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedEngineer("");
    setSelectedMonth("January");
    setSelectedYear(2026);
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
      "Sr.No.", "Name", "Total Days", "Present Days", "Absent Days",
      "Attendance Rate (%)", "Total Hours", "Avg Hours/Day", "Activities", "Month", "Year"
    ];
    const csvData = filteredAttendance.map(a => [
      a.srNo,
      a.name,
      a.totalDays,
      a.presentDays,
      a.absentDays,
      ((a.presentDays / a.totalDays) * 100).toFixed(1),
      a.totalHours,
      a.avgHoursPerDay,
      a.activities,
      a.month,
      a.year
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `monthly-attendance-${selectedMonth}-${selectedYear}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getAttendanceRate = (present: number, total: number) => {
    const rate = (present / total) * 100;
    if (rate >= 90) return "bg-green-100 text-green-800";
    if (rate >= 75) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Calculate summary statistics
  const totalEngineers = filteredAttendance.length;
  const avgAttendanceRate = filteredAttendance.length > 0 
    ? Math.round(filteredAttendance.reduce((sum, a) => sum + (a.presentDays / a.totalDays) * 100, 0) / filteredAttendance.length)
    : 0;
  const totalHours = filteredAttendance.reduce((sum, a) => sum + a.totalHours, 0);
  const totalActivities = filteredAttendance.reduce((sum, a) => sum + a.activities, 0);

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
        <h1 className="text-2xl font-bold text-black mt-4">Monthly Attendance</h1>
        <p className="text-gray-500 mt-1">Track and analyze monthly attendance of service engineers</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Engineers</p>
              <p className="text-2xl font-bold">{totalEngineers}</p>
            </div>
            <User size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg Attendance Rate</p>
              <p className="text-2xl font-bold">{avgAttendanceRate}%</p>
            </div>
            <TrendingUp size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Hours</p>
              <p className="text-2xl font-bold">{totalHours} hrs</p>
            </div>
            <Clock size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Activities</p>
              <p className="text-2xl font-bold">{totalActivities}</p>
            </div>
            <Calendar size={32} className="opacity-80" />
          </div>
        </div>
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
          
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black text-sm"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black text-sm"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Monthly Attendance Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr.No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Days</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Present Days</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Absent Days</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Hours</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Hours/Day</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activities</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading monthly attendance...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((record) => {
                  const attendanceRate = (record.presentDays / record.totalDays) * 100;
                  return (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{record.srNo}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">{record.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{record.totalDays}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600 font-medium">{record.presentDays}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-red-600">{record.absentDays}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getAttendanceRate(record.presentDays, record.totalDays)}`}>
                          {attendanceRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{record.totalHours} hrs</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{record.avgHoursPerDay} hrs</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{record.activities}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{record.month}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-black">{record.year}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={11} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Calendar size={48} className="text-gray-300 mb-3" />
                      <p className="text-gray-500 text-lg">No Data Found</p>
                      <p className="text-gray-400 text-sm mt-1">No monthly attendance records available for the selected filters</p>
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