// app/settings/complaint-subcategory-2/page.tsx
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
  FolderOpen,
  CheckCircle,
  AlertCircle,
  Filter,
  Tag,
  Layers,
  AlertTriangle
} from "lucide-react";

interface ComplaintCategory {
  id: number;
  categoryName: string;
}

interface ComplaintSubCategory {
  id: number;
  subCategoryName: string;
  categoryId: number;
  categoryName: string;
}

interface ComplaintIssue {
  id: number;
  srNo: number;
  categoryId: number;
  categoryName: string;
  subCategoryId: number;
  subCategoryName: string;
  issueName: string;
  description: string;
  status: string;
  createdAt: string;
}

// Mock data
const mockCategories: ComplaintCategory[] = [
  { id: 1, categoryName: "Controller" },
  { id: 2, categoryName: "Goodwill Visit" },
  { id: 3, categoryName: "N/A" },
  { id: 4, categoryName: "Others" }
];

const mockSubCategories: ComplaintSubCategory[] = [
  { id: 1, subCategoryName: "Farmat Controller", categoryId: 1, categoryName: "Controller" },
  { id: 2, subCategoryName: "Brass Controller", categoryId: 1, categoryName: "Controller" },
  { id: 3, subCategoryName: "N/A", categoryId: 3, categoryName: "N/A" },
  { id: 4, subCategoryName: "Goodwill visit", categoryId: 2, categoryName: "Goodwill Visit" },
  { id: 5, subCategoryName: "Accessories", categoryId: 4, categoryName: "Others" },
  { id: 6, subCategoryName: "Fittings", categoryId: 4, categoryName: "Others" },
  { id: 7, subCategoryName: "Hardwares", categoryId: 4, categoryName: "Others" }
];

const mockIssues: ComplaintIssue[] = [
  { id: 1, srNo: 1, categoryId: 1, categoryName: "Controller", subCategoryId: 1, subCategoryName: "Farmat Controller", issueName: "Ball Kit", description: "Ball kit replacement", status: "Active", createdAt: "2024-01-15" },
  { id: 2, srNo: 2, categoryId: 1, categoryName: "Controller", subCategoryId: 1, subCategoryName: "Farmat Controller", issueName: "Ball Seat", description: "Ball seat replacement", status: "Active", createdAt: "2024-01-20" },
  { id: 3, srNo: 3, categoryId: 1, categoryName: "Controller", subCategoryId: 1, subCategoryName: "Farmat Controller", issueName: "Disc/Bush", description: "Disc/Bush replacement", status: "Active", createdAt: "2024-02-01" },
  { id: 4, srNo: 4, categoryId: 1, categoryName: "Controller", subCategoryId: 1, subCategoryName: "Farmat Controller", issueName: "Pressure Knob", description: "Pressure knob adjustment", status: "Active", createdAt: "2024-02-10" },
  { id: 5, srNo: 5, categoryId: 1, categoryName: "Controller", subCategoryId: 1, subCategoryName: "Farmat Controller", issueName: "Spring", description: "Spring replacement", status: "Active", createdAt: "2024-02-15" },
  { id: 6, srNo: 6, categoryId: 1, categoryName: "Controller", subCategoryId: 1, subCategoryName: "Farmat Controller", issueName: "N/A", description: "Not applicable", status: "Active", createdAt: "2024-02-20" },
  { id: 7, srNo: 7, categoryId: 1, categoryName: "Controller", subCategoryId: 2, subCategoryName: "Brass Controller", issueName: "N/A", description: "Not applicable", status: "Active", createdAt: "2024-02-25" }
];

export default function ComplaintSubCategory2Page() {
  const [issues, setIssues] = useState<ComplaintIssue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<ComplaintIssue[]>([]);
  const [categories, setCategories] = useState<ComplaintCategory[]>([]);
  const [subCategories, setSubCategories] = useState<ComplaintSubCategory[]>([]);
  const [availableSubCategories, setAvailableSubCategories] = useState<ComplaintSubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<ComplaintIssue | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    categoryId: "",
    subCategoryId: "",
    status: ""
  });
  
  // Form Data
  const [formData, setFormData] = useState({
    categoryId: "",
    categoryName: "",
    subCategoryId: "",
    subCategoryName: "",
    issueName: "",
    description: "",
    status: "Active"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      setCategories(mockCategories);
      setSubCategories(mockSubCategories);
      setIssues(mockIssues);
      setFilteredIssues(mockIssues);
    } catch (error) {
      console.error("Error fetching issues:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update subcategories when category changes
    if (field === "categoryId") {
      const selectedCategory = categories.find(c => c.id.toString() === value);
      const filteredSubCategories = subCategories.filter(s => s.categoryId.toString() === value);
      setAvailableSubCategories(filteredSubCategories);
      setFormData(prev => ({ 
        ...prev, 
        categoryId: value,
        categoryName: selectedCategory?.categoryName || "",
        subCategoryId: "",
        subCategoryName: ""
      }));
    }
    
    // Update subcategory name when subcategory changes
    if (field === "subCategoryId") {
      const selectedSubCategory = subCategories.find(s => s.id.toString() === value);
      setFormData(prev => ({ 
        ...prev, 
        subCategoryId: value,
        subCategoryName: selectedSubCategory?.subCategoryName || ""
      }));
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
    
    if (field === "categoryId") {
      setFilters(prev => ({ ...prev, subCategoryId: "" }));
    }
  };

  const applyFilters = () => {
    let filtered = [...issues];
    
    if (filters.categoryId) {
      filtered = filtered.filter(i => i.categoryId.toString() === filters.categoryId);
    }
    if (filters.subCategoryId) {
      filtered = filtered.filter(i => i.subCategoryId.toString() === filters.subCategoryId);
    }
    if (filters.status) {
      filtered = filtered.filter(i => i.status === filters.status);
    }
    if (searchTerm) {
      filtered = filtered.filter(i => 
        i.issueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.subCategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredIssues(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      categoryId: "",
      subCategoryId: "",
      status: ""
    });
    setSearchTerm("");
    setFilteredIssues(issues);
    setCurrentPage(1);
  };

  const handleAddIssue = () => {
    if (!formData.categoryId || !formData.subCategoryId || !formData.issueName) {
      alert("Please fill all required fields");
      return;
    }

    const newIssue: ComplaintIssue = {
      id: issues.length + 1,
      srNo: issues.length + 1,
      categoryId: parseInt(formData.categoryId),
      categoryName: formData.categoryName,
      subCategoryId: parseInt(formData.subCategoryId),
      subCategoryName: formData.subCategoryName,
      issueName: formData.issueName,
      description: formData.description,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setIssues([newIssue, ...issues]);
    setFilteredIssues([newIssue, ...filteredIssues]);
    setShowAddModal(false);
    resetForm();
    alert("Issue added successfully!");
  };

  const handleEditIssue = () => {
    if (!selectedIssue) return;
    if (!formData.categoryId || !formData.subCategoryId || !formData.issueName) {
      alert("Please fill all required fields");
      return;
    }

    const updatedIssues = issues.map(issue => {
      if (issue.id === selectedIssue.id) {
        return {
          ...issue,
          categoryId: parseInt(formData.categoryId),
          categoryName: formData.categoryName,
          subCategoryId: parseInt(formData.subCategoryId),
          subCategoryName: formData.subCategoryName,
          issueName: formData.issueName,
          description: formData.description,
          status: formData.status
        };
      }
      return issue;
    });
    
    setIssues(updatedIssues);
    setFilteredIssues(updatedIssues);
    setShowEditModal(false);
    resetForm();
    alert("Issue updated successfully!");
  };

  const handleDeleteIssue = () => {
    if (!selectedIssue) return;

    const updatedIssues = issues.filter(i => i.id !== selectedIssue.id);
    const reindexedIssues = updatedIssues.map((issue, index) => ({
      ...issue,
      srNo: index + 1
    }));
    
    setIssues(reindexedIssues);
    setFilteredIssues(reindexedIssues);
    setShowDeleteConfirm(false);
    setSelectedIssue(null);
    alert("Issue deleted successfully!");
  };

  const openEditModal = (issue: ComplaintIssue) => {
    setSelectedIssue(issue);
    setFormData({
      categoryId: issue.categoryId.toString(),
      categoryName: issue.categoryName,
      subCategoryId: issue.subCategoryId.toString(),
      subCategoryName: issue.subCategoryName,
      issueName: issue.issueName,
      description: issue.description || "",
      status: issue.status
    });
    // Load subcategories for the selected category
    const filteredSubCategories = subCategories.filter(s => s.categoryId === issue.categoryId);
    setAvailableSubCategories(filteredSubCategories);
    setShowEditModal(true);
  };

  const openDeleteConfirm = (issue: ComplaintIssue) => {
    setSelectedIssue(issue);
    setShowDeleteConfirm(true);
  };

  const resetForm = () => {
    setFormData({
      categoryId: "",
      categoryName: "",
      subCategoryId: "",
      subCategoryName: "",
      issueName: "",
      description: "",
      status: "Active"
    });
    setAvailableSubCategories([]);
    setSelectedIssue(null);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredIssues.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredIssues.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = ["SR. NO.", "CATEGORY NAME", "SUB CATEGORY NAME", "ISSUE NAME", "DESCRIPTION", "STATUS", "CREATED AT"];
    const csvData = filteredIssues.map(i => [
      i.srNo,
      i.categoryName,
      i.subCategoryName,
      i.issueName,
      i.description,
      i.status,
      i.createdAt
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "complaint-issues.csv";
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

  // Get unique categories for filter
  const uniqueCategories = Array.from(new Map(issues.map(i => [i.categoryId, i.categoryName])).entries()).map(([id, name]) => ({ id, name }));

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#e8f5e9" }}>
            <AlertTriangle size={18} className="text-[#2e7d32]" />
          </div>
          <div>
            <p className="font-black text-base leading-none text-gray-800">m.i.t.r.a.</p>
            <p className="text-xs text-gray-500">Mahindra Innovative Technologies & Research for Agriculture</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-black mt-4">All Complaint Sub Category 2 List</h1>
        <p className="text-gray-500 mt-1">Manage complaint issues for detailed problem classification</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Issues</p>
              <p className="text-2xl font-bold">{filteredIssues.length}</p>
            </div>
            <AlertTriangle size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Issues</p>
              <p className="text-2xl font-bold">{filteredIssues.filter(i => i.status === "Active").length}</p>
            </div>
            <CheckCircle size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Parent Categories</p>
              <p className="text-2xl font-bold">{[...new Set(filteredIssues.map(i => i.categoryName))].length}</p>
            </div>
            <FolderOpen size={32} className="opacity-80" />
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
                placeholder="Search by issue name, category or sub category..."
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
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-black"
            >
              <Filter size={18} />
              Filters
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
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add Sub Category 2
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filters.categoryId}
                onChange={(e) => handleFilterChange("categoryId", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              
              <select
                value={filters.subCategoryId}
                onChange={(e) => handleFilterChange("subCategoryId", e.target.value)}
                disabled={!filters.categoryId}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
              >
                <option value="">All Sub Categories</option>
                {filters.categoryId && subCategories
                  .filter(s => s.categoryId.toString() === filters.categoryId)
                  .map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.subCategoryName}</option>
                  ))}
              </select>
              
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
        )}
      </div>

      {/* Issues Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR. NO.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CATEGORY NAME</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUB CATEGORY NAME</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISSUE NAME</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DESCRIPTION</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CREATED AT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading issues...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((issue) => (
                  <tr key={issue.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {issue.srNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">
                      <div className="flex items-center gap-2">
                        <FolderOpen size={16} className="text-gray-400" />
                        {issue.categoryName}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      <div className="flex items-center gap-2">
                        <Layers size={16} className="text-gray-400" />
                        {issue.subCategoryName}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-gray-400" />
                        {issue.issueName}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-black max-w-xs">
                      {issue.description || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(issue.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {new Date(issue.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openEditModal(issue)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(issue)}
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
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <AlertTriangle size={48} className="text-gray-300 mb-3" />
                      <p className="text-gray-500 text-lg">No Issues Found</p>
                      <p className="text-gray-400 text-sm mt-1">No complaint issues available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredIssues.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredIssues.length)}</span> of{" "}
              <span className="font-medium">{filteredIssues.length}</span> results
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

      {/* Add Issue Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Add Sub Category 2</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange("categoryId", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.categoryName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Sub Category Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.subCategoryId}
                    onChange={(e) => handleInputChange("subCategoryId", e.target.value)}
                    disabled={!formData.categoryId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
                  >
                    <option value="">Select Sub Category</option>
                    {availableSubCategories.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.subCategoryName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Issue Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Enter Issue Name"
                      value={formData.issueName}
                      onChange={(e) => handleInputChange("issueName", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddIssue}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Issue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Issue Modal */}
      {showEditModal && selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Edit Sub Category 2</h2>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Category Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => handleInputChange("categoryId", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.categoryName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Sub Category Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.subCategoryId}
                    onChange={(e) => handleInputChange("subCategoryId", e.target.value)}
                    disabled={!formData.categoryId}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
                  >
                    <option value="">Select Sub Category</option>
                    {availableSubCategories.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.subCategoryName}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Issue Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={formData.issueName}
                      onChange={(e) => handleInputChange("issueName", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditIssue}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Update Issue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedIssue && (
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
                Are you sure you want to delete this issue?
              </p>
              <p className="text-center text-sm text-gray-500">
                Issue: <span className="font-semibold">{selectedIssue.issueName}</span>
              </p>
              <p className="text-center text-sm text-gray-500">
                Sub Category: {selectedIssue.subCategoryName}
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
                onClick={handleDeleteIssue}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Issue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}