// app/settings/district/page.tsx
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
  MapPin,
  Building,
  Globe,
  CheckCircle,
  AlertCircle,
  Clock,
  Filter
} from "lucide-react";

interface District {
  id: number;
  srNo: number;
  name: string;
  code: string;
  state: string;
  zone: string;
  talukas: number;
  status: string;
  createdAt: string;
}

// Mock district data
const mockDistricts: District[] = [
  { id: 1, srNo: 1, name: "Pune", code: "PN", state: "Maharashtra", zone: "West", talukas: 14, status: "Active", createdAt: "2024-01-15" },
  { id: 2, srNo: 2, name: "Mumbai", code: "MU", state: "Maharashtra", zone: "West", talukas: 10, status: "Active", createdAt: "2024-01-20" },
  { id: 3, srNo: 3, name: "Nagpur", code: "NG", state: "Maharashtra", zone: "West", talukas: 14, status: "Active", createdAt: "2024-02-01" },
  { id: 4, srNo: 4, name: "Nashik", code: "NS", state: "Maharashtra", zone: "West", talukas: 15, status: "Active", createdAt: "2024-02-10" },
  { id: 5, srNo: 5, name: "Solapur", code: "SL", state: "Maharashtra", zone: "West", talukas: 11, status: "Active", createdAt: "2024-02-15" },
  { id: 6, srNo: 6, name: "Jaipur", code: "JP", state: "Rajasthan", zone: "North", talukas: 13, status: "Active", createdAt: "2024-02-20" },
  { id: 7, srNo: 7, name: "Jodhpur", code: "JD", state: "Rajasthan", zone: "North", talukas: 10, status: "Active", createdAt: "2024-02-25" },
  { id: 8, srNo: 8, name: "Udaipur", code: "UD", state: "Rajasthan", zone: "North", talukas: 11, status: "Active", createdAt: "2024-03-01" },
  { id: 9, srNo: 9, name: "Ahmedabad", code: "AH", state: "Gujarat", zone: "West", talukas: 13, status: "Active", createdAt: "2024-03-05" },
  { id: 10, srNo: 10, name: "Surat", code: "SU", state: "Gujarat", zone: "West", talukas: 10, status: "Active", createdAt: "2024-03-10" },
  { id: 11, srNo: 11, name: "Vadodara", code: "VD", state: "Gujarat", zone: "West", talukas: 12, status: "Active", createdAt: "2024-03-12" },
  { id: 12, srNo: 12, name: "Rajkot", code: "RJ", state: "Gujarat", zone: "West", talukas: 14, status: "Active", createdAt: "2024-03-15" },
  { id: 13, srNo: 13, name: "Hyderabad", code: "HY", state: "Telangana", zone: "South", talukas: 16, status: "Active", createdAt: "2024-03-18" },
  { id: 14, srNo: 14, name: "Chennai", code: "CH", state: "Tamil Nadu", zone: "South", talukas: 15, status: "Active", createdAt: "2024-03-20" },
  { id: 15, srNo: 15, name: "Bangalore", code: "BN", state: "Karnataka", zone: "South", talukas: 17, status: "Active", createdAt: "2024-03-22" },
  { id: 16, srNo: 16, name: "Lucknow", code: "LU", state: "Uttar Pradesh", zone: "North", talukas: 18, status: "Active", createdAt: "2024-03-25" },
  { id: 17, srNo: 17, name: "Kanpur", code: "KP", state: "Uttar Pradesh", zone: "North", talukas: 10, status: "Active", createdAt: "2024-03-28" },
  { id: 18, srNo: 18, name: "Indore", code: "IN", state: "Madhya Pradesh", zone: "Central", talukas: 12, status: "Active", createdAt: "2024-04-01" },
  { id: 19, srNo: 19, name: "Bhopal", code: "BP", state: "Madhya Pradesh", zone: "Central", talukas: 11, status: "Active", createdAt: "2024-04-02" },
  { id: 20, srNo: 20, name: "Kolkata", code: "KL", state: "West Bengal", zone: "East", talukas: 15, status: "Active", createdAt: "2024-04-03" }
];

// States for dropdown
const statesList = [
  "Maharashtra", "Rajasthan", "Gujarat", "Telangana", "Tamil Nadu", 
  "Karnataka", "Uttar Pradesh", "Madhya Pradesh", "West Bengal"
];

// Zones for dropdown
const zonesList = ["North", "South", "East", "West", "Central"];

export default function DistrictManagementPage() {
  const [districts, setDistricts] = useState<District[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    state: "",
    zone: "",
    status: ""
  });
  
  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    state: "",
    zone: "",
    talukas: "",
    status: "Active"
  });

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    setLoading(true);
    try {
      setDistricts(mockDistricts);
      setFilteredDistricts(mockDistricts);
    } catch (error) {
      console.error("Error fetching districts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-set zone based on selected state
    if (field === "state") {
      const stateZones: Record<string, string> = {
        "Maharashtra": "West",
        "Gujarat": "West",
        "Rajasthan": "North",
        "Uttar Pradesh": "North",
        "Telangana": "South",
        "Tamil Nadu": "South",
        "Karnataka": "South",
        "Madhya Pradesh": "Central",
        "West Bengal": "East"
      };
      setFormData(prev => ({ ...prev, zone: stateZones[value] || "" }));
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const applyFilters = () => {
    let filtered = [...districts];
    
    if (filters.state) {
      filtered = filtered.filter(d => d.state === filters.state);
    }
    if (filters.zone) {
      filtered = filtered.filter(d => d.zone === filters.zone);
    }
    if (filters.status) {
      filtered = filtered.filter(d => d.status === filters.status);
    }
    if (searchTerm) {
      filtered = filtered.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredDistricts(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      state: "",
      zone: "",
      status: ""
    });
    setSearchTerm("");
    setFilteredDistricts(districts);
    setCurrentPage(1);
  };

  const handleAddDistrict = () => {
    if (!formData.name || !formData.code || !formData.state || !formData.talukas) {
      alert("Please fill all required fields");
      return;
    }

    const newDistrict: District = {
      id: districts.length + 1,
      srNo: districts.length + 1,
      name: formData.name,
      code: formData.code.toUpperCase(),
      state: formData.state,
      zone: formData.zone,
      talukas: parseInt(formData.talukas),
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setDistricts([newDistrict, ...districts]);
    setFilteredDistricts([newDistrict, ...filteredDistricts]);
    setShowAddModal(false);
    resetForm();
    alert("District added successfully!");
  };

  const handleEditDistrict = () => {
    if (!selectedDistrict) return;
    if (!formData.name || !formData.code || !formData.state || !formData.talukas) {
      alert("Please fill all required fields");
      return;
    }

    const updatedDistricts = districts.map(district => {
      if (district.id === selectedDistrict.id) {
        return {
          ...district,
          name: formData.name,
          code: formData.code.toUpperCase(),
          state: formData.state,
          zone: formData.zone,
          talukas: parseInt(formData.talukas),
          status: formData.status
        };
      }
      return district;
    });
    
    setDistricts(updatedDistricts);
    setFilteredDistricts(updatedDistricts);
    setShowEditModal(false);
    resetForm();
    alert("District updated successfully!");
  };

  const handleDeleteDistrict = () => {
    if (!selectedDistrict) return;

    const updatedDistricts = districts.filter(d => d.id !== selectedDistrict.id);
    const reindexedDistricts = updatedDistricts.map((district, index) => ({
      ...district,
      srNo: index + 1
    }));
    
    setDistricts(reindexedDistricts);
    setFilteredDistricts(reindexedDistricts);
    setShowDeleteConfirm(false);
    setSelectedDistrict(null);
    alert("District deleted successfully!");
  };

  const openEditModal = (district: District) => {
    setSelectedDistrict(district);
    setFormData({
      name: district.name,
      code: district.code,
      state: district.state,
      zone: district.zone,
      talukas: district.talukas.toString(),
      status: district.status
    });
    setShowEditModal(true);
  };

  const openDeleteConfirm = (district: District) => {
    setSelectedDistrict(district);
    setShowDeleteConfirm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      state: "",
      zone: "",
      talukas: "",
      status: "Active"
    });
    setSelectedDistrict(null);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredDistricts.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredDistricts.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = ["Sr No.", "District Name", "District Code", "State", "Zone", "Talukas", "Status", "Created At"];
    const csvData = filteredDistricts.map(d => [
      d.srNo,
      d.name,
      d.code,
      d.state,
      d.zone,
      d.talukas,
      d.status,
      d.createdAt
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "districts.csv";
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

  const getZoneColor = (zone: string) => {
    switch(zone) {
      case "North":
        return "bg-blue-100 text-blue-800";
      case "South":
        return "bg-green-100 text-green-800";
      case "West":
        return "bg-purple-100 text-purple-800";
      case "Central":
        return "bg-orange-100 text-orange-800";
      case "East":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get unique states and zones for filters
  const uniqueStates = [...new Set(districts.map(d => d.state))];
  const uniqueZones = [...new Set(districts.map(d => d.zone))];

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#e8f5e9" }}>
            <Building size={18} className="text-[#2e7d32]" />
          </div>
          <div>
            <p className="font-black text-base leading-none text-gray-800">m.i.t.r.a.</p>
            <p className="text-xs text-gray-500">Mahindra Innovative Technologies & Research for Agriculture</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-black mt-4">District Management</h1>
        <p className="text-gray-500 mt-1">Manage districts and their taluka information</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Districts</p>
              <p className="text-2xl font-bold">{filteredDistricts.length}</p>
            </div>
            <Building size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Districts</p>
              <p className="text-2xl font-bold">{filteredDistricts.filter(d => d.status === "Active").length}</p>
            </div>
            <CheckCircle size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total States</p>
              <p className="text-2xl font-bold">{[...new Set(filteredDistricts.map(d => d.state))].length}</p>
            </div>
            <Globe size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Talukas</p>
              <p className="text-2xl font-bold">{filteredDistricts.reduce((sum, d) => sum + d.talukas, 0)}</p>
            </div>
            <MapPin size={32} className="opacity-80" />
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
                placeholder="Search by district name, code or state..."
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
              Add District
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <select
                value={filters.state}
                onChange={(e) => handleFilterChange("state", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              >
                <option value="">All States</option>
                {uniqueStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              
              <select
                value={filters.zone}
                onChange={(e) => handleFilterChange("zone", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              >
                <option value="">All Zones</option>
                {uniqueZones.map(zone => (
                  <option key={zone} value={zone}>{zone}</option>
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

      {/* Districts Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Talukas</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading districts...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((district) => (
                  <tr key={district.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {district.srNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        {district.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-black">
                      {district.code}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {district.state}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getZoneColor(district.zone)}`}>
                        {district.zone}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black text-center">
                      {district.talukas}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(district.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {new Date(district.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openEditModal(district)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(district)}
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
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Building size={48} className="text-gray-300 mb-3" />
                      <p className="text-gray-500 text-lg">No Districts Found</p>
                      <p className="text-gray-400 text-sm mt-1">No district records available for the selected filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredDistricts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredDistricts.length)}</span> of{" "}
              <span className="font-medium">{filteredDistricts.length}</span> results
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

      {/* Add District Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Add District</h2>
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
                    District Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Enter District Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    District Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Enter District Code (e.g., PN, MU)"
                      value={formData.code}
                      onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                      maxLength={2}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black uppercase"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Maximum 2 characters (e.g., PN for Pune)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select State</option>
                    {statesList.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Zone
                  </label>
                  <input
                    type="text"
                    value={formData.zone}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Auto-populated based on selected state
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Number of Talukas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder="Enter number of talukas"
                    value={formData.talukas}
                    onChange={(e) => handleInputChange("talukas", e.target.value)}
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
                onClick={handleAddDistrict}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save District
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit District Modal */}
      {showEditModal && selectedDistrict && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Edit District</h2>
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
                    District Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    District Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                      maxLength={2}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select State</option>
                    {statesList.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Zone
                  </label>
                  <input
                    type="text"
                    value={formData.zone}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Number of Talukas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.talukas}
                    onChange={(e) => handleInputChange("talukas", e.target.value)}
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
                onClick={handleEditDistrict}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Update District
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedDistrict && (
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
                Are you sure you want to delete this district?
              </p>
              <p className="text-center text-sm text-gray-500">
                District: <span className="font-semibold">{selectedDistrict.name}</span>
              </p>
              <p className="text-center text-sm text-gray-500">
                State: {selectedDistrict.state}
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
                onClick={handleDeleteDistrict}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete District
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}