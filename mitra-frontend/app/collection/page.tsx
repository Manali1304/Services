// app/collection/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Calendar,
  User,
  DollarSign,
  FileText,
  Receipt
} from "lucide-react";

interface Collection {
  id: number;
  ticketId: string;
  srNo: number;
  customerName: string;
  customerMobile: string;
  seName: string;
  warranty: string;
  labourCharge: string;
  localPartAmt: number;
  partAmt: number;
  totalAmt: number;
  date: string;
  rootCause: string;
}

// Mock collection data
const mockCollections: Collection[] = [
  {
    id: 1,
    ticketId: "SR-26-002223",
    srNo: 1,
    customerName: "Rushikesh D Deshpande",
    customerMobile: "8010987170",
    seName: "Rushikesh Deshmukh",
    warranty: "Yes",
    labourCharge: "N/A",
    localPartAmt: 335,
    partAmt: 665,
    totalAmt: 1000,
    date: "2026-02-27",
    rootCause: "-"
  },
  {
    id: 2,
    ticketId: "SR-26-002224",
    srNo: 2,
    customerName: "Rushikesh D Deshpande",
    customerMobile: "8010987170",
    seName: "Rushikesh Deshmukh",
    warranty: "Yes",
    labourCharge: "N/A",
    localPartAmt: 0,
    partAmt: 0,
    totalAmt: 0,
    date: "2026-02-27",
    rootCause: "-"
  },
  {
    id: 3,
    ticketId: "SR-26-002222",
    srNo: 3,
    customerName: "Rushikesh D Deshpande",
    customerMobile: "8010987170",
    seName: "Rushikesh Deshmukh",
    warranty: "Yes",
    labourCharge: "N/A",
    localPartAmt: 0,
    partAmt: 0,
    totalAmt: 0,
    date: "2026-02-27",
    rootCause: "-"
  },
  {
    id: 4,
    ticketId: "SR-26-002221",
    srNo: 4,
    customerName: "Rupesh V Khairnar",
    customerMobile: "7756897487",
    seName: "Rupesh V Khairnar",
    warranty: "No",
    labourCharge: "N/A",
    localPartAmt: 0,
    partAmt: 0,
    totalAmt: 0,
    date: "2026-02-27",
    rootCause: "-"
  },
  {
    id: 5,
    ticketId: "SR-26-002220",
    srNo: 5,
    customerName: "Rupesh V Khairnar",
    customerMobile: "7756897487",
    seName: "Rupesh V Khairnar",
    warranty: "No",
    labourCharge: "N/A",
    localPartAmt: 0,
    partAmt: 0,
    totalAmt: 0,
    date: "2026-02-27",
    rootCause: "-"
  },
  {
    id: 6,
    ticketId: "SR-26-002219",
    srNo: 6,
    customerName: "Rupesh V Khairnar",
    customerMobile: "7756897487",
    seName: "Rupesh V Khairnar",
    warranty: "No",
    labourCharge: "N/A",
    localPartAmt: 0,
    partAmt: 0,
    totalAmt: 0,
    date: "2026-02-27",
    rootCause: "-"
  }
];

// Service engineers list
const serviceEngineers = [
  "All Engineers",
  "Rushikesh Deshmukh",
  "Rupesh V Khairnar",
  "Rohit Somnath Pagare",
  "Rajesh Patil",
  "Suresh Kamble"
];

export default function CollectionPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredCollections, setFilteredCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEngineer, setSelectedEngineer] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      setCollections(mockCollections);
      setFilteredCollections(mockCollections);
    } catch (error) {
      console.error("Error fetching collections:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...collections];
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.ticketId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customerMobile.includes(searchTerm) ||
        c.seName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedEngineer && selectedEngineer !== "All Engineers") {
      filtered = filtered.filter(c => c.seName === selectedEngineer);
    }
    
    if (fromDate) {
      filtered = filtered.filter(c => c.date >= fromDate);
    }
    
    if (toDate) {
      filtered = filtered.filter(c => c.date <= toDate);
    }
    
    setFilteredCollections(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedEngineer("");
    setFromDate("");
    setToDate("");
    setFilteredCollections(collections);
    setCurrentPage(1);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCollections.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredCollections.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = [
      "Ticket ID", "Sr No.", "Customer Name", "Customer Mobile", "SE Name", 
      "Warranty", "Labour Charge", "Local Part Amt", "Part Amt", 
      "Total Amt", "Date", "Root Cause"
    ];
    const csvData = filteredCollections.map(c => [
      c.ticketId,
      c.srNo,
      c.customerName,
      c.customerMobile,
      c.seName,
      c.warranty,
      c.labourCharge,
      c.localPartAmt,
      c.partAmt,
      c.totalAmt,
      c.date,
      c.rootCause
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `collections-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount: number) => {
    if (amount === 0) return "N/A";
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Collection List</h1>
        <p className="text-gray-600 mt-1">Manage and track payment collections</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Collections</p>
              <p className="text-2xl font-bold">{filteredCollections.length}</p>
            </div>
            <Receipt size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Amount</p>
              <p className="text-2xl font-bold">
                ₹{filteredCollections.reduce((sum, c) => sum + c.totalAmt, 0).toLocaleString('en-IN')}
              </p>
            </div>
            <DollarSign size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Warranty Claims</p>
              <p className="text-2xl font-bold">
                {filteredCollections.filter(c => c.warranty === "Yes").length}
              </p>
            </div>
            <FileText size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Non-Warranty</p>
              <p className="text-2xl font-bold">
                {filteredCollections.filter(c => c.warranty === "No").length}
              </p>
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
                placeholder="Search by Ticket ID, Customer Name, Mobile..."
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
            <option value="">Select Service Engineer</option>
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
            Reset Filters
          </button>
        </div>
      </div>

      {/* Collections Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Mobile</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SE Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warranty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Labour Charge</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local Part Amt</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Amt</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amt</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Root Cause</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={12} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading collections...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((collection) => (
                  <tr key={collection.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-black">
                      {collection.ticketId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {collection.srNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">
                      {collection.customerName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {collection.customerMobile}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {collection.seName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        collection.warranty === "Yes" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {collection.warranty}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {collection.labourCharge}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {formatCurrency(collection.localPartAmt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {formatCurrency(collection.partAmt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-black">
                      {formatCurrency(collection.totalAmt)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {new Date(collection.date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3 text-sm text-black max-w-xs truncate">
                      {collection.rootCause}
                    </td>
                  </tr>
                ))
              ) : (
                <td>
                  <td colSpan={12} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Receipt size={48} className="text-gray-300 mb-3" />
                      <p className="text-gray-500 text-lg">No Collections Found</p>
                      <p className="text-gray-400 text-sm mt-1">No collection records available for the selected filters</p>
                    </div>
                  </td>
                </td>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredCollections.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredCollections.length)}</span> of{" "}
              <span className="font-medium">{filteredCollections.length}</span> results
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