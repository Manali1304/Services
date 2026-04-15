// app/review/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Star,
  Calendar,
  User,
  MessageSquare
} from "lucide-react";

interface Review {
  id: number;
  complaintId: string;
  customerName: string;
  serviceEngineerName: string;
  reviewNo: number;
  rating: number;
  reviewDescription: string;
  date: string;
}

// Mock review data
const mockReviews: Review[] = [
  {
    id: 1,
    complaintId: "SR-26-002212",
    customerName: "rohit pagare pagare",
    serviceEngineerName: "Rohit Somnath Pagare",
    reviewNo: 3,
    rating: 4,
    reviewDescription: "uccchcj",
    date: "2026-03-17"
  },
  {
    id: 2,
    complaintId: "SR-26-002215",
    customerName: "rohit pagare pagare",
    serviceEngineerName: "Rohit Somnath Pagare",
    reviewNo: 4,
    rating: 4,
    reviewDescription: "cucuic",
    date: "2026-03-17"
  },
  {
    id: 3,
    complaintId: "SR-26-002223",
    customerName: "Rushikesh D Deshpande",
    serviceEngineerName: "Rushikesh Deshmukh",
    reviewNo: 5,
    rating: 5,
    reviewDescription: "vvv",
    date: "2026-03-13"
  },
  {
    id: 4,
    complaintId: "SR-26-002224",
    customerName: "Rushikesh D Deshpande",
    serviceEngineerName: "Rushikesh Deshmukh",
    reviewNo: 5,
    rating: 5,
    reviewDescription: "test",
    date: "2026-03-03"
  },
  {
    id: 5,
    complaintId: "SR-26-001707",
    customerName: "Rushikesh D Deshpande",
    serviceEngineerName: "Rushikesh Deshmukh",
    reviewNo: 5,
    rating: 5,
    reviewDescription: "test",
    date: "2026-02-25"
  },
  {
    id: 6,
    complaintId: "SR-26-002222",
    customerName: "Rushikesh D Deshpande",
    serviceEngineerName: "Rushikesh Deshmukh",
    reviewNo: 5,
    rating: 5,
    reviewDescription: "test",
    date: "2026-02-25"
  },
  {
    id: 7,
    complaintId: "SR-26-002210",
    customerName: "rohit pagare pagare",
    serviceEngineerName: "Rohit Somnath Pagare",
    reviewNo: 4,
    rating: 4,
    reviewDescription: "Test@123",
    date: "2026-02-13"
  }
];

// Service engineers list
const serviceEngineers = [
  "All Engineers",
  "Rohit Somnath Pagare",
  "Rushikesh Deshmukh",
  "Rupesh V Khairnar",
  "Rajesh Patil",
  "Suresh Kamble"
];

export default function ReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEngineer, setSelectedEngineer] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      setReviews(mockReviews);
      setFilteredReviews(mockReviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...reviews];
    
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.complaintId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.serviceEngineerName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedEngineer && selectedEngineer !== "All Engineers") {
      filtered = filtered.filter(r => r.serviceEngineerName === selectedEngineer);
    }
    
    if (fromDate) {
      filtered = filtered.filter(r => r.date >= fromDate);
    }
    
    if (toDate) {
      filtered = filtered.filter(r => r.date <= toDate);
    }
    
    setFilteredReviews(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedEngineer("");
    setFromDate("");
    setToDate("");
    setFilteredReviews(reviews);
    setCurrentPage(1);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredReviews.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredReviews.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = [
      "Complaint ID", "Customer Name", "Service Engineer Name", 
      "Review No.", "Rating", "Review Description", "Date"
    ];
    const csvData = filteredReviews.map(r => [
      r.complaintId,
      r.customerName,
      r.serviceEngineerName,
      r.reviewNo,
      `${r.rating} Star`,
      r.reviewDescription,
      r.date
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reviews-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
          />
        ))}
        <span className="ml-1 text-xs text-gray-500">[{rating}]</span>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">All Reviews List</h1>
        <p className="text-gray-600 mt-1">Manage and view customer reviews and feedback</p>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by Complaint ID, Customer Name..."
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

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaint ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Engineer Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading reviews...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-black">
                      {review.complaintId}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {review.customerName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {review.serviceEngineerName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {renderStars(review.rating)}
                    </td>
                    <td className="px-4 py-3 text-sm text-black max-w-xs truncate">
                      {review.reviewDescription}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {new Date(review.date).toLocaleDateString('en-GB')}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <MessageSquare size={48} className="text-gray-300 mb-3" />
                      <p className="text-gray-500 text-lg">No Reviews Found</p>
                      <p className="text-gray-400 text-sm mt-1">No reviews available for the selected filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredReviews.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredReviews.length)}</span> of{" "}
              <span className="font-medium">{filteredReviews.length}</span> results
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