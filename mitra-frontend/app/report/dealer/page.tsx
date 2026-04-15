// app/report/dealer/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Filter, 
  X,
  User,
  MapPin,
  Phone,
  DollarSign,
  Calendar,
  Eye
} from "lucide-react";

interface DealerReport {
  id: number;
  dealerName: string;
  talukaRegion: string;
  asmRmName: string;
  serviceEngineers: string[];
  uwVisit: number;
  gwVisit: number;
  owVisit: number;
  totalVisits: number;
  labourCharge: number;
  spareParts: number;
  totalCollection: number;
  complaintIds: string[];
  description: string;
  customerName: string;
}

// Mock data for dealer reports
const mockDealerReports: DealerReport[] = [
  {
    id: 1,
    dealerName: "AgriTech Solutions",
    talukaRegion: "Pune",
    asmRmName: "Rajesh Patil",
    serviceEngineers: ["Rushikesh Deshmukh", "Suresh Kamble"],
    uwVisit: 15,
    gwVisit: 8,
    owVisit: 5,
    totalVisits: 28,
    labourCharge: 12500,
    spareParts: 8500,
    totalCollection: 21000,
    complaintIds: ["SR-26-002223", "SR-26-002224", "SR-26-002225"],
    description: "Regular maintenance and repairs",
    customerName: "Rushikesh D Deshpande"
  },
  {
    id: 2,
    dealerName: "Farm Equipment Center",
    talukaRegion: "Solapur",
    asmRmName: "Suresh Kamble",
    serviceEngineers: ["Rupesh V Khairnar", "Vijay Shinde"],
    uwVisit: 12,
    gwVisit: 6,
    owVisit: 3,
    totalVisits: 21,
    labourCharge: 9800,
    spareParts: 6200,
    totalCollection: 16000,
    complaintIds: ["SR-26-002220", "SR-26-002221", "SR-26-002222"],
    description: "Warranty and non-warranty service",
    customerName: "Rupesh V Khairnar"
  },
  {
    id: 3,
    dealerName: "Modern Agro Services",
    talukaRegion: "Nashik",
    asmRmName: "Amol Kulkarni",
    serviceEngineers: ["Rajesh Patil", "Mahesh Jadhav"],
    uwVisit: 20,
    gwVisit: 10,
    owVisit: 7,
    totalVisits: 37,
    labourCharge: 18500,
    spareParts: 12500,
    totalCollection: 31000,
    complaintIds: ["SR-26-002218", "SR-26-002219", "SR-26-002217"],
    description: "Installation and maintenance",
    customerName: "Various Customers"
  },
  {
    id: 4,
    dealerName: "Green Fields Traders",
    talukaRegion: "Nagpur",
    asmRmName: "Vijay Shinde",
    serviceEngineers: ["Suresh Kamble", "Rushikesh Deshmukh"],
    uwVisit: 8,
    gwVisit: 4,
    owVisit: 2,
    totalVisits: 14,
    labourCharge: 6500,
    spareParts: 4200,
    totalCollection: 10700,
    complaintIds: ["SR-26-002215", "SR-26-002216"],
    description: "Routine service",
    customerName: "Rohit Pagare"
  },
  {
    id: 5,
    dealerName: "Krishi Mitra",
    talukaRegion: "Aurangabad",
    asmRmName: "Mahesh Jadhav",
    serviceEngineers: ["Vijay Shinde", "Amol Kulkarni"],
    uwVisit: 10,
    gwVisit: 5,
    owVisit: 3,
    totalVisits: 18,
    labourCharge: 8200,
    spareParts: 5500,
    totalCollection: 13700,
    complaintIds: ["SR-26-002213", "SR-26-002214"],
    description: "Emergency repairs",
    customerName: "Sachin Tendulkar"
  }
];

// Service engineers list for filter
const serviceEngineers = [
  "All Engineers",
  "Rushikesh Deshmukh",
  "Rupesh V Khairnar",
  "Rajesh Patil",
  "Suresh Kamble",
  "Vijay Shinde",
  "Amol Kulkarni",
  "Mahesh Jadhav"
];

// ASM/RM names for filter
const asmRmNames = [
  "All",
  "Rajesh Patil",
  "Suresh Kamble",
  "Amol Kulkarni",
  "Vijay Shinde",
  "Mahesh Jadhav"
];

export default function DealerReportPage() {
  const [reports, setReports] = useState<DealerReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<DealerReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    dealerName: "",
    talukaRegion: "",
    asmRmName: "",
    serviceEngineer: "",
    fromDate: "",
    toDate: ""
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      setReports(mockDealerReports);
      setFilteredReports(mockDealerReports);
    } catch (error) {
      console.error("Error fetching dealer reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const applyFilters = () => {
    let filtered = [...reports];
    
    if (filters.dealerName) {
      filtered = filtered.filter(r => r.dealerName.toLowerCase().includes(filters.dealerName.toLowerCase()));
    }
    if (filters.talukaRegion) {
      filtered = filtered.filter(r => r.talukaRegion.toLowerCase().includes(filters.talukaRegion.toLowerCase()));
    }
    if (filters.asmRmName && filters.asmRmName !== "All") {
      filtered = filtered.filter(r => r.asmRmName === filters.asmRmName);
    }
    if (filters.serviceEngineer && filters.serviceEngineer !== "All Engineers") {
      filtered = filtered.filter(r => r.serviceEngineers.includes(filters.serviceEngineer));
    }
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.dealerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.serviceEngineers.some(se => se.toLowerCase().includes(searchTerm.toLowerCase())) ||
        r.complaintIds.some(id => id.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    setFilteredReports(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      dealerName: "",
      talukaRegion: "",
      asmRmName: "",
      serviceEngineer: "",
      fromDate: "",
      toDate: ""
    });
    setSearchTerm("");
    setFilteredReports(reports);
    setCurrentPage(1);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredReports.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredReports.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = [
      "Dealer Name", "Taluka/Region", "ASM/RM Name", "Service Engineer(s)", 
      "UW Visit", "GW Visit", "OW Visit", "Total Visits", 
      "Labour Charge", "Spare Parts", "Total Collection", 
      "Complaint IDs", "Description", "Customer Name"
    ];
    const csvData = filteredReports.map(r => [
      r.dealerName,
      r.talukaRegion,
      r.asmRmName,
      r.serviceEngineers.join(", "),
      r.uwVisit,
      r.gwVisit,
      r.owVisit,
      r.totalVisits,
      r.labourCharge,
      r.spareParts,
      r.totalCollection,
      r.complaintIds.join(", "),
      r.description,
      r.customerName
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dealer-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Get unique values for filters
  const uniqueDealers = [...new Set(reports.map(r => r.dealerName))];
  const uniqueTalukas = [...new Set(reports.map(r => r.talukaRegion))];

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Detailed Activity Breakdown</h1>
        <p className="text-gray-600 mt-1">Dealer-wise service and collection report</p>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by dealer name, customer, engineer, complaint ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && applyFilters()}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-black"
            >
              <Filter size={18} />
              Filters
            </button>
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

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <select
                value={filters.dealerName}
                onChange={(e) => handleFilterChange("dealerName", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              >
                <option value="">Select Dealer Name</option>
                {uniqueDealers.map(dealer => (
                  <option key={dealer} value={dealer}>{dealer}</option>
                ))}
              </select>
              
              <select
                value={filters.talukaRegion}
                onChange={(e) => handleFilterChange("talukaRegion", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              >
                <option value="">Select Taluka/Region</option>
                {uniqueTalukas.map(taluka => (
                  <option key={taluka} value={taluka}>{taluka}</option>
                ))}
              </select>
              
              <select
                value={filters.asmRmName}
                onChange={(e) => handleFilterChange("asmRmName", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              >
                <option value="">Select ASM/RM Name</option>
                {asmRmNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
              
              <select
                value={filters.serviceEngineer}
                onChange={(e) => handleFilterChange("serviceEngineer", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              >
                <option value="">Select Service Engineer</option>
                {serviceEngineers.map(engineer => (
                  <option key={engineer} value={engineer}>{engineer}</option>
                ))}
              </select>
              
              <input
                type="date"
                placeholder="From Date"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              />
              
              <input
                type="date"
                placeholder="To Date"
                value={filters.toDate}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              />
              
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <X size={18} />
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dealer Report Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dealer Name</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taluka/Region</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ASM/RM Name</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Engineer(s)</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UW Visit</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">GW Visit</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OW Visit</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Visits</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Labour Charge</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spare Parts</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Collection</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint IDs</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={14} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading reports...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-black">
                      {report.dealerName}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">
                      {report.talukaRegion}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">
                      {report.asmRmName}
                    </td>
                    <td className="px-3 py-3 text-sm text-black">
                      <div className="flex flex-wrap gap-1">
                        {report.serviceEngineers.map((se, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-800">
                            {se}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black text-center">
                      {report.uwVisit}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black text-center">
                      {report.gwVisit}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black text-center">
                      {report.owVisit}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-semibold text-black text-center">
                      {report.totalVisits}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-green-600 font-medium">
                      {formatCurrency(report.labourCharge)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-purple-600 font-medium">
                      {formatCurrency(report.spareParts)}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-black">
                      {formatCurrency(report.totalCollection)}
                    </td>
                    <td className="px-3 py-3 text-sm text-black">
                      <div className="flex flex-wrap gap-1">
                        {report.complaintIds.map((id, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 font-mono">
                            {id}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-sm text-black max-w-xs">
                      {report.description}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">
                      {report.customerName}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={14} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <FileText size={48} className="text-gray-300 mb-3" />
                      <p className="text-gray-500 text-lg">No Data Found</p>
                      <p className="text-gray-400 text-sm mt-1">No dealer reports available for the selected filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredReports.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredReports.length)}</span> of{" "}
              <span className="font-medium">{filteredReports.length}</span> results
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