// app/settings/region/page.tsx
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
  Clock
} from "lucide-react";

interface State {
  id: number;
  srNo: number;
  name: string;
  code: string;
  zone: string;
  mttr: number;
  status: string;
  createdAt: string;
}

// Complete states data from Zone-wise MTTR
const mockStates: State[] = [
  { id: 1, srNo: 1, name: "Jaipur", code: "JP", zone: "North", mttr: 20500, status: "Active", createdAt: "2024-01-15" },
  { id: 2, srNo: 2, name: "Adilabad", code: "AD", zone: "South", mttr: 2801, status: "Active", createdAt: "2024-01-20" },
  { id: 3, srNo: 3, name: "Hyderabad", code: "HY", zone: "South", mttr: 2469, status: "Active", createdAt: "2024-02-01" },
  { id: 4, srNo: 4, name: "Rajgarh", code: "RG", zone: "Central", mttr: 2009, status: "Active", createdAt: "2024-02-10" },
  { id: 5, srNo: 5, name: "Ariyalur", code: "AR", zone: "South", mttr: 1819, status: "Active", createdAt: "2024-02-15" },
  { id: 6, srNo: 6, name: "Jodhpur", code: "JD", zone: "North", mttr: 1580, status: "Active", createdAt: "2024-02-20" },
  { id: 7, srNo: 7, name: "Akola", code: "AK", zone: "West", mttr: 727.5, status: "Active", createdAt: "2024-02-25" },
  { id: 8, srNo: 8, name: "Kurukshetra", code: "KU", zone: "North", mttr: 678.5, status: "Active", createdAt: "2024-03-01" },
  { id: 9, srNo: 9, name: "Mandya", code: "MA", zone: "South", mttr: 672, status: "Active", createdAt: "2024-03-05" },
  { id: 10, srNo: 10, name: "Patan", code: "PT", zone: "West", mttr: 596, status: "Active", createdAt: "2024-03-10" },
  { id: 11, srNo: 11, name: "Bhilwara", code: "BH", zone: "North", mttr: 590.9, status: "Active", createdAt: "2024-03-12" },
  { id: 12, srNo: 12, name: "Jalandhar", code: "JL", zone: "North", mttr: 571.3, status: "Active", createdAt: "2024-03-15" },
  { id: 13, srNo: 13, name: "Shajapur", code: "SJ", zone: "Central", mttr: 529, status: "Active", createdAt: "2024-03-18" },
  { id: 14, srNo: 14, name: "Amravati", code: "AM", zone: "West", mttr: 523.4, status: "Active", createdAt: "2024-03-20" },
  { id: 15, srNo: 15, name: "Yavatmal", code: "YA", zone: "West", mttr: 491.5, status: "Active", createdAt: "2024-03-22" },
  { id: 16, srNo: 16, name: "Ratlam", code: "RA", zone: "Central", mttr: 461, status: "Active", createdAt: "2024-03-25" },
  // Additional major states
  { id: 17, srNo: 17, name: "Mumbai", code: "MU", zone: "West", mttr: 450, status: "Active", createdAt: "2024-03-28" },
  { id: 18, srNo: 18, name: "Pune", code: "PU", zone: "West", mttr: 420, status: "Active", createdAt: "2024-04-01" },
  { id: 19, srNo: 19, name: "Nagpur", code: "NA", zone: "West", mttr: 400, status: "Active", createdAt: "2024-04-02" },
  { id: 20, srNo: 20, name: "Ahmedabad", code: "AH", zone: "West", mttr: 380, status: "Active", createdAt: "2024-04-03" },
  { id: 21, srNo: 21, name: "Surat", code: "SU", zone: "West", mttr: 360, status: "Active", createdAt: "2024-04-04" },
  { id: 22, srNo: 22, name: "Lucknow", code: "LU", zone: "North", mttr: 340, status: "Active", createdAt: "2024-04-05" },
  { id: 23, srNo: 23, name: "Kanpur", code: "KA", zone: "North", mttr: 320, status: "Active", createdAt: "2024-04-06" },
  { id: 24, srNo: 24, name: "Indore", code: "IN", zone: "Central", mttr: 300, status: "Active", createdAt: "2024-04-07" },
  { id: 25, srNo: 25, name: "Bhopal", code: "BH", zone: "Central", mttr: 280, status: "Active", createdAt: "2024-04-08" },
  { id: 26, srNo: 26, name: "Chennai", code: "CH", zone: "South", mttr: 260, status: "Active", createdAt: "2024-04-09" },
  { id: 27, srNo: 27, name: "Bangalore", code: "BN", zone: "South", mttr: 240, status: "Active", createdAt: "2024-04-10" },
  { id: 28, srNo: 28, name: "Kolkata", code: "KO", zone: "East", mttr: 220, status: "Active", createdAt: "2024-04-11" },
  { id: 29, srNo: 29, name: "Delhi", code: "DE", zone: "North", mttr: 200, status: "Active", createdAt: "2024-04-12" },
  { id: 30, srNo: 30, name: "Chandigarh", code: "CD", zone: "North", mttr: 180, status: "Active", createdAt: "2024-04-13" }
];

// Zone colors for badges
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

export default function RegionManagementPage() {
  const [states, setStates] = useState<State[]>([]);
  const [filteredStates, setFilteredStates] = useState<State[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    zone: "",
    mttr: "",
    status: "Active"
  });

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    setLoading(true);
    try {
      setStates(mockStates);
      setFilteredStates(mockStates);
    } catch (error) {
      console.error("Error fetching states:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddState = () => {
    if (!formData.name || !formData.code || !formData.zone) {
      alert("Please fill all required fields");
      return;
    }

    const newState: State = {
      id: states.length + 1,
      srNo: states.length + 1,
      name: formData.name,
      code: formData.code.toUpperCase(),
      zone: formData.zone,
      mttr: parseFloat(formData.mttr) || 0,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setStates([newState, ...states]);
    setFilteredStates([newState, ...filteredStates]);
    setShowAddModal(false);
    resetForm();
    alert("State added successfully!");
  };

  const handleEditState = () => {
    if (!selectedState) return;
    if (!formData.name || !formData.code || !formData.zone) {
      alert("Please fill all required fields");
      return;
    }

    const updatedStates = states.map(state => {
      if (state.id === selectedState.id) {
        return {
          ...state,
          name: formData.name,
          code: formData.code.toUpperCase(),
          zone: formData.zone,
          mttr: parseFloat(formData.mttr) || state.mttr,
          status: formData.status
        };
      }
      return state;
    });
    
    setStates(updatedStates);
    setFilteredStates(updatedStates);
    setShowEditModal(false);
    resetForm();
    alert("State updated successfully!");
  };

  const handleDeleteState = () => {
    if (!selectedState) return;

    const updatedStates = states.filter(s => s.id !== selectedState.id);
    const reindexedStates = updatedStates.map((state, index) => ({
      ...state,
      srNo: index + 1
    }));
    
    setStates(reindexedStates);
    setFilteredStates(reindexedStates);
    setShowDeleteConfirm(false);
    setSelectedState(null);
    alert("State deleted successfully!");
  };

  const openEditModal = (state: State) => {
    setSelectedState(state);
    setFormData({
      name: state.name,
      code: state.code,
      zone: state.zone,
      mttr: state.mttr.toString(),
      status: state.status
    });
    setShowEditModal(true);
  };

  const openDeleteConfirm = (state: State) => {
    setSelectedState(state);
    setShowDeleteConfirm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      zone: "",
      mttr: "",
      status: "Active"
    });
    setSelectedState(null);
  };

  const applySearch = () => {
    let filtered = [...states];
    
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.zone.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredStates(filtered);
    setCurrentPage(1);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setFilteredStates(states);
    setCurrentPage(1);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredStates.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredStates.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = ["Sr No.", "State Name", "State Code", "Zone", "MTTR (Hours)", "Status", "Created At"];
    const csvData = filteredStates.map(s => [
      s.srNo,
      s.name,
      s.code,
      s.zone,
      s.mttr,
      s.status,
      s.createdAt
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "states.csv";
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

  // Calculate summary statistics
  const totalStates = filteredStates.length;
  const avgMTTR = filteredStates.length > 0 
    ? Math.round(filteredStates.reduce((sum, s) => sum + s.mttr, 0) / filteredStates.length)
    : 0;

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#e8f5e9" }}>
            <Globe size={18} className="text-[#2e7d32]" />
          </div>
          <div>
            <p className="font-black text-base leading-none text-gray-800">m.i.t.r.a.</p>
            <p className="text-xs text-gray-500">Mahindra Innovative Technologies & Research for Agriculture</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-black mt-4">State Management</h1>
        <p className="text-gray-500 mt-1">Manage states and regions for service coverage</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total States</p>
              <p className="text-2xl font-bold">{totalStates}</p>
            </div>
            <Globe size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active States</p>
              <p className="text-2xl font-bold">{filteredStates.filter(s => s.status === "Active").length}</p>
            </div>
            <CheckCircle size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Zones Covered</p>
              <p className="text-2xl font-bold">{[...new Set(filteredStates.map(s => s.zone))].length}</p>
            </div>
            <MapPin size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg MTTR</p>
              <p className="text-2xl font-bold">{avgMTTR.toLocaleString()} hrs</p>
            </div>
            <Clock size={32} className="opacity-80" />
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
                placeholder="Search by state name, code or zone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && applySearch()}
              />
            </div>
            <button
              onClick={applySearch}
              className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors"
            >
              Apply
            </button>
            <button
              onClick={resetSearch}
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
              Add State
            </button>
          </div>
        </div>
      </div>

      {/* States Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MTTR (Hours)</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading states...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((state) => (
                  <tr key={state.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {state.srNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        {state.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-black">
                      {state.code}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getZoneColor(state.zone)}`}>
                        {state.zone}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      <div className="flex items-center gap-1">
                        <Clock size={14} className="text-gray-400" />
                        {state.mttr.toLocaleString()} hrs
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(state.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {new Date(state.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openEditModal(state)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(state)}
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
                      <Building size={48} className="text-gray-300 mb-3" />
                      <p className="text-gray-500 text-lg">No States Found</p>
                      <p className="text-gray-400 text-sm mt-1">No state records available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredStates.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredStates.length)}</span> of{" "}
              <span className="font-medium">{filteredStates.length}</span> results
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

      {/* Add State Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Add State</h2>
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
                    State Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Enter State Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    State Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Enter State Code (e.g., MH, GJ)"
                      value={formData.code}
                      onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                      maxLength={2}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black uppercase"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Maximum 2 characters (e.g., MH for Maharashtra)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Zone <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.zone}
                    onChange={(e) => handleInputChange("zone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Zone</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="Central">Central</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    MTTR (Hours)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      placeholder="Enter Mean Time To Resolution"
                      value={formData.mttr}
                      onChange={(e) => handleInputChange("mttr", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    />
                  </div>
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
                onClick={handleAddState}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save State
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit State Modal */}
      {showEditModal && selectedState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Edit State</h2>
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
                    State Name <span className="text-red-500">*</span>
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
                    State Code <span className="text-red-500">*</span>
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
                    Zone <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.zone}
                    onChange={(e) => handleInputChange("zone", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Zone</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="Central">Central</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    MTTR (Hours)
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="number"
                      value={formData.mttr}
                      onChange={(e) => handleInputChange("mttr", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    />
                  </div>
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
                onClick={handleEditState}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Update State
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedState && (
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
                Are you sure you want to delete this state?
              </p>
              <p className="text-center text-sm text-gray-500">
                State: <span className="font-semibold">{selectedState.name}</span>
              </p>
              <p className="text-center text-sm text-gray-500">
                Code: {selectedState.code}
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
                onClick={handleDeleteState}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete State
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}