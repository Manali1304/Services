// app/settings/complaint-subcategory/page.tsx
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
  Layers
} from "lucide-react";

interface ComplaintCategory {
  id: number;
  categoryName: string;
}

interface ComplaintSubCategory {
  id: number;
  srNo: number;
  categoryId: number;
  categoryName: string;
  subCategoryName: string;
  description: string;
  status: string;
  createdAt: string;
}

// Mock category data
const mockCategories: ComplaintCategory[] = [
  { id: 1, categoryName: "Controller" },
  { id: 2, categoryName: "Goodwill Visit" },
  { id: 3, categoryName: "N/A" },
  { id: 4, categoryName: "Others" },
  { id: 5, categoryName: "Chassis" },
  { id: 6, categoryName: "Pully" },
  { id: 7, categoryName: "Electrical" },
  { id: 8, categoryName: "Mechanical" }
];

// Mock subcategory data
const mockSubCategories: ComplaintSubCategory[] = [
  { id: 1, srNo: 1, categoryId: 1, categoryName: "Controller", subCategoryName: "Farmat Controller", description: "Farmat controller issues", status: "Active", createdAt: "2024-01-15" },
  { id: 2, srNo: 2, categoryId: 1, categoryName: "Controller", subCategoryName: "Brass Controller", description: "Brass controller issues", status: "Active", createdAt: "2024-01-20" },
  { id: 3, srNo: 3, categoryId: 3, categoryName: "N/A", subCategoryName: "N/A", description: "Not applicable", status: "Active", createdAt: "2024-02-01" },
  { id: 4, srNo: 4, categoryId: 2, categoryName: "Goodwill Visit", subCategoryName: "Goodwill visit", description: "Goodwill visit requests", status: "Active", createdAt: "2024-02-10" },
  { id: 5, srNo: 5, categoryId: 4, categoryName: "Others", subCategoryName: "Accessories", description: "Accessories related issues", status: "Active", createdAt: "2024-02-15" },
  { id: 6, srNo: 6, categoryId: 4, categoryName: "Others", subCategoryName: "Fittings", description: "Fittings related issues", status: "Active", createdAt: "2024-02-20" },
  { id: 7, srNo: 7, categoryId: 4, categoryName: "Others", subCategoryName: "Hardwares", description: "Hardware related issues", status: "Active", createdAt: "2024-02-25" }
];

export default function ComplaintSubCategoryPage() {
  const [subCategories, setSubCategories] = useState<ComplaintSubCategory[]>([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState<ComplaintSubCategory[]>([]);
  const [categories, setCategories] = useState<ComplaintCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<ComplaintSubCategory | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    categoryId: "",
    status: ""
  });
  
  // Form Data
  const [formData, setFormData] = useState({
    categoryId: "",
    categoryName: "",
    subCategoryName: "",
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
      setFilteredSubCategories(mockSubCategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-populate category name when category is selected
    if (field === "categoryId") {
      const selectedCategory = categories.find(c => c.id.toString() === value);
      if (selectedCategory) {
        setFormData(prev => ({ 
          ...prev, 
          categoryId: value,
          categoryName: selectedCategory.categoryName 
        }));
      }
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const applyFilters = () => {
    let filtered = [...subCategories];
    
    if (filters.categoryId) {
      filtered = filtered.filter(s => s.categoryId.toString() === filters.categoryId);
    }
    if (filters.status) {
      filtered = filtered.filter(s => s.status === filters.status);
    }
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.subCategoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredSubCategories(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      categoryId: "",
      status: ""
    });
    setSearchTerm("");
    setFilteredSubCategories(subCategories);
    setCurrentPage(1);
  };

  const handleAddSubCategory = () => {
    if (!formData.categoryId || !formData.subCategoryName) {
      alert("Please fill all required fields");
      return;
    }

    const newSubCategory: ComplaintSubCategory = {
      id: subCategories.length + 1,
      srNo: subCategories.length + 1,
      categoryId: parseInt(formData.categoryId),
      categoryName: formData.categoryName,
      subCategoryName: formData.subCategoryName,
      description: formData.description,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setSubCategories([newSubCategory, ...subCategories]);
    setFilteredSubCategories([newSubCategory, ...filteredSubCategories]);
    setShowAddModal(false);
    resetForm();
    alert("Sub category added successfully!");
  };

  const handleEditSubCategory = () => {
    if (!selectedSubCategory) return;
    if (!formData.categoryId || !formData.subCategoryName) {
      alert("Please fill all required fields");
      return;
    }

    const updatedSubCategories = subCategories.map(sub => {
      if (sub.id === selectedSubCategory.id) {
        return {
          ...sub,
          categoryId: parseInt(formData.categoryId),
          categoryName: formData.categoryName,
          subCategoryName: formData.subCategoryName,
          description: formData.description,
          status: formData.status
        };
      }
      return sub;
    });
    
    setSubCategories(updatedSubCategories);
    setFilteredSubCategories(updatedSubCategories);
    setShowEditModal(false);
    resetForm();
    alert("Sub category updated successfully!");
  };

  const handleDeleteSubCategory = () => {
    if (!selectedSubCategory) return;

    const updatedSubCategories = subCategories.filter(s => s.id !== selectedSubCategory.id);
    const reindexedSubCategories = updatedSubCategories.map((sub, index) => ({
      ...sub,
      srNo: index + 1
    }));
    
    setSubCategories(reindexedSubCategories);
    setFilteredSubCategories(reindexedSubCategories);
    setShowDeleteConfirm(false);
    setSelectedSubCategory(null);
    alert("Sub category deleted successfully!");
  };

  const openEditModal = (subCategory: ComplaintSubCategory) => {
    setSelectedSubCategory(subCategory);
    setFormData({
      categoryId: subCategory.categoryId.toString(),
      categoryName: subCategory.categoryName,
      subCategoryName: subCategory.subCategoryName,
      description: subCategory.description || "",
      status: subCategory.status
    });
    setShowEditModal(true);
  };

  const openDeleteConfirm = (subCategory: ComplaintSubCategory) => {
    setSelectedSubCategory(subCategory);
    setShowDeleteConfirm(true);
  };

  const resetForm = () => {
    setFormData({
      categoryId: "",
      categoryName: "",
      subCategoryName: "",
      description: "",
      status: "Active"
    });
    setSelectedSubCategory(null);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredSubCategories.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredSubCategories.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = ["SR. NO.", "CATEGORY NAME", "SUB CATEGORY NAME", "DESCRIPTION", "STATUS", "CREATED AT"];
    const csvData = filteredSubCategories.map(s => [
      s.srNo,
      s.categoryName,
      s.subCategoryName,
      s.description,
      s.status,
      s.createdAt
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "complaint-subcategories.csv";
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
            <Layers size={18} className="text-[#2e7d32]" />
          </div>
          <div>
            <p className="font-black text-base leading-none text-gray-800">m.i.t.r.a.</p>
            <p className="text-xs text-gray-500">Mahindra Innovative Technologies & Research for Agriculture</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-black mt-4">All Complaint Sub Category List</h1>
        <p className="text-gray-500 mt-1">Manage complaint sub categories for detailed issue classification</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Sub Categories</p>
              <p className="text-2xl font-bold">{filteredSubCategories.length}</p>
            </div>
            <Layers size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Sub Categories</p>
              <p className="text-2xl font-bold">{filteredSubCategories.filter(s => s.status === "Active").length}</p>
            </div>
            <CheckCircle size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Parent Categories</p>
              <p className="text-2xl font-bold">{[...new Set(filteredSubCategories.map(s => s.categoryName))].length}</p>
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
                placeholder="Search by sub category name, category name or description..."
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
              Add Sub Category
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={filters.categoryId}
                onChange={(e) => handleFilterChange("categoryId", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.categoryName}</option>
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

      {/* Sub Categories Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR. NO.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CATEGORY NAME</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUB CATEGORY NAME</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DESCRIPTION</th>
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
                      <span className="ml-2">Loading sub categories...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((subCategory) => (
                  <tr key={subCategory.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {subCategory.srNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      <div className="flex items-center gap-2">
                        <FolderOpen size={16} className="text-gray-400" />
                        {subCategory.categoryName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      <div className="flex items-center gap-2">
                        <Tag size={16} className="text-gray-400" />
                        {subCategory.subCategoryName}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-black max-w-xs">
                      {subCategory.description || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(subCategory.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {new Date(subCategory.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openEditModal(subCategory)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(subCategory)}
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
                      <Layers size={48} className="text-gray-300 mb-3" />
                      <p className="text-gray-500 text-lg">No Sub Categories Found</p>
                      <p className="text-gray-400 text-sm mt-1">No complaint sub categories available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredSubCategories.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredSubCategories.length)}</span> of{" "}
              <span className="font-medium">{filteredSubCategories.length}</span> results
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

      {/* Add Sub Category Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Add Sub Category</h2>
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
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Enter Sub Category Name"
                      value={formData.subCategoryName}
                      onChange={(e) => handleInputChange("subCategoryName", e.target.value)}
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
                onClick={handleAddSubCategory}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Sub Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Sub Category Modal */}
      {showEditModal && selectedSubCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Edit Sub Category</h2>
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
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={formData.subCategoryName}
                      onChange={(e) => handleInputChange("subCategoryName", e.target.value)}
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
                onClick={handleEditSubCategory}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Update Sub Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedSubCategory && (
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
                Are you sure you want to delete this sub category?
              </p>
              <p className="text-center text-sm text-gray-500">
                Category: <span className="font-semibold">{selectedSubCategory.categoryName}</span>
              </p>
              <p className="text-center text-sm text-gray-500">
                Sub Category: {selectedSubCategory.subCategoryName}
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
                onClick={handleDeleteSubCategory}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Sub Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}