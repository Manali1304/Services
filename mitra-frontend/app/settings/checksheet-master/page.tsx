// app/settings/checksheet/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Plus, 
  X, 
  Edit, 
  Trash2, 
  Save,
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Filter,
  FileText,
  Eye,
  Printer
} from "lucide-react";

interface CheckSheet {
  id: number;
  srNo: number;
  title: string;
  description: string;
  sections: CheckSheetSection[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface CheckSheetSection {
  id: number;
  name: string;
  items: CheckSheetItem[];
}

interface CheckSheetItem {
  id: number;
  description: string;
  isRequired: boolean;
}

// Mock checksheet data
const mockCheckSheets: CheckSheet[] = [
  {
    id: 1,
    srNo: 1,
    title: "CHECKLIST BEFORE DELIVERY & INSTALLATION",
    description: "Pre-delivery and installation inspection checklist",
    sections: [
      {
        id: 1,
        name: "Machine Inspection",
        items: [
          { id: 1, description: "Check machine for any physical damage", isRequired: true },
          { id: 2, description: "Verify all parts are present", isRequired: true },
          { id: 3, description: "Check fluid levels (oil, coolant)", isRequired: true }
        ]
      },
      {
        id: 2,
        name: "Electrical System",
        items: [
          { id: 4, description: "Test all electrical connections", isRequired: true },
          { id: 5, description: "Verify battery condition", isRequired: true },
          { id: 6, description: "Check wiring harness for damage", isRequired: false }
        ]
      },
      {
        id: 3,
        name: "Installation Requirements",
        items: [
          { id: 7, description: "Verify installation location", isRequired: true },
          { id: 8, description: "Check mounting stability", isRequired: true },
          { id: 9, description: "Test machine operation", isRequired: true }
        ]
      }
    ],
    status: "Active",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15"
  },
  {
    id: 2,
    srNo: 2,
    title: "POST INSTALLATION CHECKLIST",
    description: "Post-installation verification checklist",
    sections: [
      {
        id: 4,
        name: "Performance Testing",
        items: [
          { id: 10, description: "Run machine at full capacity", isRequired: true },
          { id: 11, description: "Check for unusual noises", isRequired: true },
          { id: 12, description: "Verify output parameters", isRequired: true }
        ]
      },
      {
        id: 5,
        name: "Safety Checks",
        items: [
          { id: 13, description: "Verify emergency stop function", isRequired: true },
          { id: 14, description: "Check safety guards", isRequired: true },
          { id: 15, description: "Verify warning labels are visible", isRequired: false }
        ]
      }
    ],
    status: "Active",
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01"
  },
  {
    id: 3,
    srNo: 3,
    title: "MONTHLY MAINTENANCE CHECKLIST",
    description: "Routine monthly maintenance checklist",
    sections: [
      {
        id: 6,
        name: "Mechanical Maintenance",
        items: [
          { id: 16, description: "Lubricate moving parts", isRequired: true },
          { id: 17, description: "Check belt tension", isRequired: true },
          { id: 18, description: "Inspect bearings", isRequired: true }
        ]
      },
      {
        id: 7,
        name: "Cleaning",
        items: [
          { id: 19, description: "Clean air filters", isRequired: true },
          { id: 20, description: "Remove debris from machine", isRequired: true },
          { id: 21, description: "Clean control panel", isRequired: false }
        ]
      }
    ],
    status: "Active",
    createdAt: "2024-03-01",
    updatedAt: "2024-03-01"
  }
];

export default function CheckSheetPage() {
  const [checkSheets, setCheckSheets] = useState<CheckSheet[]>([]);
  const [filteredCheckSheets, setFilteredCheckSheets] = useState<CheckSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCheckSheet, setSelectedCheckSheet] = useState<CheckSheet | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    status: ""
  });

  useEffect(() => {
    fetchCheckSheets();
  }, []);

  const fetchCheckSheets = async () => {
    setLoading(true);
    try {
      setCheckSheets(mockCheckSheets);
      setFilteredCheckSheets(mockCheckSheets);
    } catch (error) {
      console.error("Error fetching checksheets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const applyFilters = () => {
    let filtered = [...checkSheets];
    
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCheckSheets(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      status: ""
    });
    setSearchTerm("");
    setFilteredCheckSheets(checkSheets);
    setCurrentPage(1);
  };

  const handleDeleteCheckSheet = () => {
    if (!selectedCheckSheet) return;

    const updatedCheckSheets = checkSheets.filter(c => c.id !== selectedCheckSheet.id);
    const reindexedCheckSheets = updatedCheckSheets.map((sheet, index) => ({
      ...sheet,
      srNo: index + 1
    }));
    
    setCheckSheets(reindexedCheckSheets);
    setFilteredCheckSheets(reindexedCheckSheets);
    setShowDeleteConfirm(false);
    setSelectedCheckSheet(null);
    alert("CheckSheet deleted successfully!");
  };

  const openViewModal = (checkSheet: CheckSheet) => {
    setSelectedCheckSheet(checkSheet);
    setShowViewModal(true);
  };

  const openDeleteConfirm = (checkSheet: CheckSheet) => {
    setSelectedCheckSheet(checkSheet);
    setShowDeleteConfirm(true);
  };

  const handlePrint = () => {
    window.print();
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCheckSheets.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredCheckSheets.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = ["SR. NO.", "CHECKLIST TITLE", "DESCRIPTION", "SECTIONS", "ITEMS", "STATUS", "CREATED AT"];
    const csvData = filteredCheckSheets.map(c => [
      c.srNo,
      c.title,
      c.description,
      c.sections.length,
      c.sections.reduce((sum, s) => sum + s.items.length, 0),
      c.status,
      c.createdAt
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "checksheets.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusBadge = (status: string) => {
    if (status === "Active") {
      return (
        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          <CheckCircle size={12} className="mr-1" />
          Active
        </span>
      );
    }
    return (
      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
        <AlertCircle size={12} className="mr-1" />
        Inactive
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#e8f5e9" }}>
            <ClipboardList size={18} className="text-[#2e7d32]" />
          </div>
          <div>
            <p className="font-black text-base leading-none text-gray-800">m.i.t.r.a.</p>
            <p className="text-xs text-gray-500">Mahindra Innovative Technologies & Research for Agriculture</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-black mt-4">All CheckSheet List</h1>
        <p className="text-gray-500 mt-1">Manage inspection checklists for delivery and installation</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Checklists</p>
              <p className="text-2xl font-bold">{filteredCheckSheets.length}</p>
            </div>
            <ClipboardList size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Checklists</p>
              <p className="text-2xl font-bold">{filteredCheckSheets.filter(c => c.status === "Active").length}</p>
            </div>
            <CheckCircle size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Sections</p>
              <p className="text-2xl font-bold">{filteredCheckSheets.reduce((sum, c) => sum + c.sections.length, 0)}</p>
            </div>
            <FileText size={32} className="opacity-80" />
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
                placeholder="Search by checklist title or description..."
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
            <button
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
            >
              Reset
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* CheckSheets Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR. NO.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CHECKLIST BEFORE DELIVERY & INSTALLATION</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SECTIONS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ITEMS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED AT</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading checksheets...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((sheet) => (
                  <tr key={sheet.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {sheet.srNo}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-black">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-gray-400" />
                        {sheet.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black text-center">
                      {sheet.sections.length}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black text-center">
                      {sheet.sections.reduce((sum, s) => sum + s.items.length, 0)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(sheet.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {new Date(sheet.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openViewModal(sheet)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(sheet)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <ClipboardList size={48} className="text-gray-300 mb-3" />
                      <p className="text-gray-500 text-lg">No CheckSheets Found</p>
                      <p className="text-gray-400 text-sm mt-1">No checklist records available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredCheckSheets.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredCheckSheets.length)}</span> of{" "}
              <span className="font-medium">{filteredCheckSheets.length}</span> results
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

      {/* View CheckSheet Modal */}
      {showViewModal && selectedCheckSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-black">{selectedCheckSheet.title}</h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrint}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Print"
                >
                  <Printer size={20} />
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <p className="text-gray-600">{selectedCheckSheet.description}</p>
                <div className="flex gap-4 mt-2 text-sm text-gray-500">
                  <span>Created: {new Date(selectedCheckSheet.createdAt).toLocaleDateString('en-GB')}</span>
                  <span>Last Updated: {new Date(selectedCheckSheet.updatedAt).toLocaleDateString('en-GB')}</span>
                  <span>Status: {selectedCheckSheet.status}</span>
                </div>
              </div>

              {selectedCheckSheet.sections.map((section, sectionIndex) => (
                <div key={section.id} className="mb-6">
                  <h3 className="text-lg font-semibold text-black mb-3 border-b border-gray-200 pb-2">
                    Section {sectionIndex + 1}: {section.name}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item, itemIndex) => (
                      <div key={item.id} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg">
                        <div className="mt-1">
                          {item.isRequired ? (
                            <CheckCircle size={16} className="text-red-500" />
                          ) : (
                            <AlertCircle size={16} className="text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="text-black">
                            {itemIndex + 1}. {item.description}
                            {item.isRequired && <span className="text-red-500 text-sm ml-1">(Required)</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Technician Signature</p>
                    <div className="border-b border-gray-300 mt-2 pt-2">
                      <p className="text-xs text-gray-400">_________________________</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer Signature</p>
                    <div className="border-b border-gray-300 mt-2 pt-2">
                      <p className="text-xs text-gray-400">_________________________</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">Date of Inspection</p>
                  <div className="border-b border-gray-300 mt-2 w-48 pt-2">
                    <p className="text-xs text-gray-400">____/____/______</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Printer size={18} />
                Print Checklist
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedCheckSheet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-black">Confirm Delete</h2>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-red-100 rounded-full p-3">
                  <Trash2 size={32} className="text-red-600" />
                </div>
              </div>
              <p className="text-center text-black mb-2">
                Are you sure you want to delete this checklist?
              </p>
              <p className="text-center text-sm text-gray-500">
                Title: <span className="font-semibold">{selectedCheckSheet.title}</span>
              </p>
              <p className="text-center text-xs text-gray-400 mt-4">
                This action cannot be undone.
              </p>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCheckSheet}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Checklist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}