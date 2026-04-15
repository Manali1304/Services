// app/settings/city/page.tsx
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
  Filter,
  Navigation
} from "lucide-react";

interface City {
  id: number;
  srNo: number;
  name: string;
  code: string;
  district: string;
  state: string;
  zone: string;
  pincode: string;
  status: string;
  createdAt: string;
}

// Mock city/taluka data
const mockCities: City[] = [
  { id: 1, srNo: 1, name: "Pune City", code: "PNC", district: "Pune", state: "Maharashtra", zone: "West", pincode: "411001", status: "Active", createdAt: "2024-01-15" },
  { id: 2, srNo: 2, name: "Haveli", code: "HVL", district: "Pune", state: "Maharashtra", zone: "West", pincode: "411002", status: "Active", createdAt: "2024-01-20" },
  { id: 3, srNo: 3, name: "Mulshi", code: "MLS", district: "Pune", state: "Maharashtra", zone: "West", pincode: "411003", status: "Active", createdAt: "2024-02-01" },
  { id: 4, srNo: 4, name: "Maval", code: "MVL", district: "Pune", state: "Maharashtra", zone: "West", pincode: "411004", status: "Active", createdAt: "2024-02-10" },
  { id: 5, srNo: 5, name: "Khed", code: "KHD", district: "Pune", state: "Maharashtra", zone: "West", pincode: "411005", status: "Active", createdAt: "2024-02-15" },
  { id: 6, srNo: 6, name: "Andheri", code: "AND", district: "Mumbai", state: "Maharashtra", zone: "West", pincode: "400001", status: "Active", createdAt: "2024-02-20" },
  { id: 7, srNo: 7, name: "Dadar", code: "DDR", district: "Mumbai", state: "Maharashtra", zone: "West", pincode: "400002", status: "Active", createdAt: "2024-02-25" },
  { id: 8, srNo: 8, name: "Borivali", code: "BRV", district: "Mumbai", state: "Maharashtra", zone: "West", pincode: "400003", status: "Active", createdAt: "2024-03-01" },
  { id: 9, srNo: 9, name: "Nagpur Rural", code: "NGR", district: "Nagpur", state: "Maharashtra", zone: "West", pincode: "440001", status: "Active", createdAt: "2024-03-05" },
  { id: 10, srNo: 10, name: "Nagpur Urban", code: "NGU", district: "Nagpur", state: "Maharashtra", zone: "West", pincode: "440002", status: "Active", createdAt: "2024-03-10" },
  { id: 11, srNo: 11, name: "Jaipur City", code: "JPR", district: "Jaipur", state: "Rajasthan", zone: "North", pincode: "302001", status: "Active", createdAt: "2024-03-12" },
  { id: 12, srNo: 12, name: "Amber", code: "AMB", district: "Jaipur", state: "Rajasthan", zone: "North", pincode: "302002", status: "Active", createdAt: "2024-03-15" },
  { id: 13, srNo: 13, name: "Jodhpur City", code: "JDH", district: "Jodhpur", state: "Rajasthan", zone: "North", pincode: "342001", status: "Active", createdAt: "2024-03-18" },
  { id: 14, srNo: 14, name: "Ahmedabad City", code: "AMD", district: "Ahmedabad", state: "Gujarat", zone: "West", pincode: "380001", status: "Active", createdAt: "2024-03-20" },
  { id: 15, srNo: 15, name: "Surat City", code: "SRT", district: "Surat", state: "Gujarat", zone: "West", pincode: "395001", status: "Active", createdAt: "2024-03-22" },
  { id: 16, srNo: 16, name: "Hyderabad City", code: "HYD", district: "Hyderabad", state: "Telangana", zone: "South", pincode: "500001", status: "Active", createdAt: "2024-03-25" },
  { id: 17, srNo: 17, name: "Chennai City", code: "CHN", district: "Chennai", state: "Tamil Nadu", zone: "South", pincode: "600001", status: "Active", createdAt: "2024-03-28" },
  { id: 18, srNo: 18, name: "Bangalore City", code: "BLR", district: "Bangalore", state: "Karnataka", zone: "South", pincode: "560001", status: "Active", createdAt: "2024-04-01" },
  { id: 19, srNo: 19, name: "Lucknow City", code: "LKO", district: "Lucknow", state: "Uttar Pradesh", zone: "North", pincode: "226001", status: "Active", createdAt: "2024-04-02" },
  { id: 20, srNo: 20, name: "Indore City", code: "IDR", district: "Indore", state: "Madhya Pradesh", zone: "Central", pincode: "452001", status: "Active", createdAt: "2024-04-03" }
];

// Districts for dropdown (based on selected state)
const districtsByState: Record<string, string[]> = {
  "Maharashtra": ["Pune", "Mumbai", "Nagpur", "Nashik", "Solapur"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Telangana": ["Hyderabad"],
  "Tamil Nadu": ["Chennai"],
  "Karnataka": ["Bangalore"],
  "Uttar Pradesh": ["Lucknow", "Kanpur"],
  "Madhya Pradesh": ["Indore", "Bhopal"],
  "West Bengal": ["Kolkata"]
};

// States for dropdown
const statesList = [
  "Maharashtra", "Rajasthan", "Gujarat", "Telangana", "Tamil Nadu", 
  "Karnataka", "Uttar Pradesh", "Madhya Pradesh", "West Bengal"
];

// Zones for dropdown
const zonesList = ["North", "South", "East", "West", "Central"];

export default function CityManagementPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    state: "",
    district: "",
    zone: "",
    status: ""
  });
  
  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    district: "",
    state: "",
    zone: "",
    pincode: "",
    status: "Active"
  });

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    setLoading(true);
    try {
      setCities(mockCities);
      setFilteredCities(mockCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update districts when state changes
    if (field === "state") {
      const districts = districtsByState[value] || [];
      setAvailableDistricts(districts);
      setFormData(prev => ({ ...prev, district: "", zone: getZoneForState(value) }));
    }
  };

  const getZoneForState = (state: string): string => {
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
    return stateZones[state] || "";
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const applyFilters = () => {
    let filtered = [...cities];
    
    if (filters.state) {
      filtered = filtered.filter(c => c.state === filters.state);
    }
    if (filters.district) {
      filtered = filtered.filter(c => c.district === filters.district);
    }
    if (filters.zone) {
      filtered = filtered.filter(c => c.zone === filters.zone);
    }
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.pincode.includes(searchTerm)
      );
    }
    
    setFilteredCities(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      state: "",
      district: "",
      zone: "",
      status: ""
    });
    setSearchTerm("");
    setFilteredCities(cities);
    setCurrentPage(1);
  };

  const handleAddCity = () => {
    if (!formData.name || !formData.code || !formData.district || !formData.state || !formData.pincode) {
      alert("Please fill all required fields");
      return;
    }

    const newCity: City = {
      id: cities.length + 1,
      srNo: cities.length + 1,
      name: formData.name,
      code: formData.code.toUpperCase(),
      district: formData.district,
      state: formData.state,
      zone: formData.zone,
      pincode: formData.pincode,
      status: formData.status,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setCities([newCity, ...cities]);
    setFilteredCities([newCity, ...filteredCities]);
    setShowAddModal(false);
    resetForm();
    alert("City/Taluka added successfully!");
  };

  const handleEditCity = () => {
    if (!selectedCity) return;
    if (!formData.name || !formData.code || !formData.district || !formData.state || !formData.pincode) {
      alert("Please fill all required fields");
      return;
    }

    const updatedCities = cities.map(city => {
      if (city.id === selectedCity.id) {
        return {
          ...city,
          name: formData.name,
          code: formData.code.toUpperCase(),
          district: formData.district,
          state: formData.state,
          zone: formData.zone,
          pincode: formData.pincode,
          status: formData.status
        };
      }
      return city;
    });
    
    setCities(updatedCities);
    setFilteredCities(updatedCities);
    setShowEditModal(false);
    resetForm();
    alert("City/Taluka updated successfully!");
  };

  const handleDeleteCity = () => {
    if (!selectedCity) return;

    const updatedCities = cities.filter(c => c.id !== selectedCity.id);
    const reindexedCities = updatedCities.map((city, index) => ({
      ...city,
      srNo: index + 1
    }));
    
    setCities(reindexedCities);
    setFilteredCities(reindexedCities);
    setShowDeleteConfirm(false);
    setSelectedCity(null);
    alert("City/Taluka deleted successfully!");
  };

  const openEditModal = (city: City) => {
    setSelectedCity(city);
    setFormData({
      name: city.name,
      code: city.code,
      district: city.district,
      state: city.state,
      zone: city.zone,
      pincode: city.pincode,
      status: city.status
    });
    setAvailableDistricts(districtsByState[city.state] || []);
    setShowEditModal(true);
  };

  const openDeleteConfirm = (city: City) => {
    setSelectedCity(city);
    setShowDeleteConfirm(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      district: "",
      state: "",
      zone: "",
      pincode: "",
      status: "Active"
    });
    setAvailableDistricts([]);
    setSelectedCity(null);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCities.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredCities.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = ["Sr No.", "City/Taluka Name", "Code", "District", "State", "Zone", "Pincode", "Status", "Created At"];
    const csvData = filteredCities.map(c => [
      c.srNo,
      c.name,
      c.code,
      c.district,
      c.state,
      c.zone,
      c.pincode,
      c.status,
      c.createdAt
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cities.csv";
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

  // Get unique values for filters
  const uniqueStates = [...new Set(cities.map(c => c.state))];
  const uniqueZones = [...new Set(cities.map(c => c.zone))];
  const uniqueDistricts = filters.state ? districtsByState[filters.state] || [] : [];

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#e8f5e9" }}>
            <Navigation size={18} className="text-[#2e7d32]" />
          </div>
          <div>
            <p className="font-black text-base leading-none text-gray-800">m.i.t.r.a.</p>
            <p className="text-xs text-gray-500">Mahindra Innovative Technologies & Research for Agriculture</p>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-black mt-4">City/Taluka Management</h1>
        <p className="text-gray-500 mt-1">Manage cities and talukas for service coverage</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Cities/Talukas</p>
              <p className="text-2xl font-bold">{filteredCities.length}</p>
            </div>
            <Navigation size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Active Locations</p>
              <p className="text-2xl font-bold">{filteredCities.filter(c => c.status === "Active").length}</p>
            </div>
            <CheckCircle size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Districts Covered</p>
              <p className="text-2xl font-bold">{[...new Set(filteredCities.map(c => c.district))].length}</p>
            </div>
            <Building size={32} className="opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">States Covered</p>
              <p className="text-2xl font-bold">{[...new Set(filteredCities.map(c => c.state))].length}</p>
            </div>
            <Globe size={32} className="opacity-80" />
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
                placeholder="Search by city/taluka name, code, district, state or pincode..."
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
              Add City/Taluka
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={filters.state}
                onChange={(e) => {
                  handleFilterChange("state", e.target.value);
                  handleFilterChange("district", "");
                }}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              >
                <option value="">All States</option>
                {uniqueStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
              
              <select
                value={filters.district}
                onChange={(e) => handleFilterChange("district", e.target.value)}
                disabled={!filters.state}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
              >
                <option value="">All Districts</option>
                {uniqueDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
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

      {/* Cities Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City/Taluka Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Zone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pincode</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading cities...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((city) => (
                  <tr key={city.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {city.srNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        {city.name}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-black">
                      {city.code}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {city.district}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {city.state}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getZoneColor(city.zone)}`}>
                        {city.zone}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-black">
                      {city.pincode}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(city.status)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {new Date(city.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openEditModal(city)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(city)}
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
                  <td colSpan={10} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Navigation size={48} className="text-gray-300 mb-3" />
                      <p className="text-gray-500 text-lg">No Cities/Talukas Found</p>
                      <p className="text-gray-400 text-sm mt-1">No city/taluka records available for the selected filters</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredCities.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredCities.length)}</span> of{" "}
              <span className="font-medium">{filteredCities.length}</span> results
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

      {/* Add City Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Add City/Taluka</h2>
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
                    City/Taluka Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Enter City/Taluka Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    City/Taluka Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      placeholder="Enter Code (e.g., PNC, HVL)"
                      value={formData.code}
                      onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                      maxLength={3}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black uppercase"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Maximum 3 characters (e.g., PNC for Pune City)
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
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                    disabled={!formData.state}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
                  >
                    <option value="">Select District</option>
                    {availableDistricts.map(district => (
                      <option key={district} value={district}>{district}</option>
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
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    maxLength={6}
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
                onClick={handleAddCity}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save City/Taluka
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit City Modal */}
      {showEditModal && selectedCity && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Edit City/Taluka</h2>
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
                    City/Taluka Name <span className="text-red-500">*</span>
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
                    City/Taluka Code <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                      maxLength={3}
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
                    District <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                    disabled={!formData.state}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
                  >
                    <option value="">Select District</option>
                    {availableDistricts.map(district => (
                      <option key={district} value={district}>{district}</option>
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
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    maxLength={6}
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
                onClick={handleEditCity}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Update City/Taluka
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedCity && (
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
                Are you sure you want to delete this city/taluka?
              </p>
              <p className="text-center text-sm text-gray-500">
                City/Taluka: <span className="font-semibold">{selectedCity.name}</span>
              </p>
              <p className="text-center text-sm text-gray-500">
                District: {selectedCity.district}, {selectedCity.state}
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
                onClick={handleDeleteCity}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete City/Taluka
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}