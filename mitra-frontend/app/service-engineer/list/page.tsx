// app/service-engineer/list/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  X,
  Edit,
  Trash2,
  Save,
  Plus,
  Users,
  Download,
  Eye
} from "lucide-react";

interface ServiceEngineer {
  id: number;
  srNo: number;
  initials: string;
  name: string;
  firstName: string;
  middleName: string;
  lastName: string;
  mobile: string;
  email: string;
  address: string;
  state: string;
  district: string;
  taluka: string;
  status: string;
  regDate: string;
  assignedAction: string;
  isTeamLead: boolean;
  isUnderDealer: boolean;
}

// Mock data - service engineers
const mockEngineers: ServiceEngineer[] = [
  { 
    id: 1, srNo: 1, initials: "Dm", name: "Devraj Magar", firstName: "Devraj", middleName: "", lastName: "Magar",
    mobile: "7774068801", email: "", address: "nashik", state: "Maharashtra", district: "Nashik", 
    taluka: "Nashik", status: "Active", regDate: "Feb 2026", assignedAction: "Assigned Under Dealer",
    isTeamLead: false, isUnderDealer: true
  },
  { 
    id: 2, srNo: 2, initials: "RP", name: "Rohit Somnath Pagare", firstName: "Rohit", middleName: "Somnath", lastName: "Pagare",
    mobile: "8483841722", email: "rohitpagare83446@gmail.com", address: "Sharimik Nagar, Satpur, Nashik", 
    state: "Maharashtra", district: "Nashik", taluka: "Nashik", status: "Inactive", regDate: "Feb 2026", 
    assignedAction: "Not Assigned", isTeamLead: false, isUnderDealer: false
  },
  { 
    id: 3, srNo: 3, initials: "SM", name: "SANKET MISAL", firstName: "Sanket", middleName: "", lastName: "Misal",
    mobile: "7499397726", email: "Sanketmisal049@gmail.com", address: "Tupewadi", 
    state: "Maharashtra", district: "Chhatrapati Sambhaji Nagar", taluka: "Chhatrapati Sambhaji Nagar, Pathan", 
    status: "Active", regDate: "Jan 2026", assignedAction: "Not Assigned", isTeamLead: false, isUnderDealer: false
  }
];

// Dropdown options
const states = ["Maharashtra", "Gujarat", "Rajasthan", "Madhya Pradesh", "Uttar Pradesh"];
const districts: Record<string, string[]> = {
  "Maharashtra": ["Nashik", "Pune", "Mumbai", "Nagpur", "Solapur", "Chhatrapati Sambhaji Nagar"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra"]
};
const talukas: Record<string, string[]> = {
  "Nashik": ["Nashik", "Nashik Rural", "Igatpuri", "Niphad"],
  "Pune": ["Haveli", "Mulshi", "Maval", "Khed"],
  "Mumbai": ["Andheri", "Dadar", "Borivali", "Colaba"],
  "Nagpur": ["Nagpur Rural", "Nagpur Urban", "Kamthi", "Hingna"],
  "Solapur": ["Solapur North", "Solapur South", "Barshi"],
  "Chhatrapati Sambhaji Nagar": ["Pathan", "Chhatrapati Sambhaji Nagar Rural", "Gangapur", "Paithan"],
  "Ahmedabad": ["City", "East", "West", "South"],
  "Surat": ["City", "Rural", "Chorasi"],
  "Vadodara": ["City", "East", "West"],
  "Rajkot": ["City", "East", "West"],
  "Jaipur": ["Amber", "City", "East", "West"],
  "Jodhpur": ["City", "East", "West"],
  "Udaipur": ["City", "Rural", "Girwa"],
  "Kota": ["City", "East", "West"],
  "Indore": ["City", "East", "West"],
  "Bhopal": ["City", "East", "West"],
  "Jabalpur": ["City", "East", "West"],
  "Lucknow": ["City", "East", "West"],
  "Kanpur": ["City", "East", "West"],
  "Agra": ["City", "East", "West"]
};

const statusOptions = ["Active", "Inactive"];
const teamLeads = ["Rajesh Patil", "Suresh Kamble", "Vijay Shinde", "Amol Kulkarni", "Mahesh Jadhav"];

export default function ServiceEngineerListPage() {
  const [engineers, setEngineers] = useState<ServiceEngineer[]>([]);
  const [filteredEngineers, setFilteredEngineers] = useState<ServiceEngineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showManageTeamModal, setShowManageTeamModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedEngineer, setSelectedEngineer] = useState<ServiceEngineer | null>(null);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const [availableTalukas, setAvailableTalukas] = useState<string[]>([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    serviceEngineer: "",
    teamLead: "",
    state: "",
    district: "",
    taluka: "",
    fromDate: "",
    toDate: ""
  });

  // Form Data
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    email: "",
    isTeamLead: false,
    isUnderDealer: false,
    state: "",
    district: "",
    taluka: "",
    address: ""
  });

  // Manage Team Form Data
  const [teamFormData, setTeamFormData] = useState({
    teamLeader: "",
    serviceEngineers: [] as string[]
  });

  useEffect(() => {
    fetchEngineers();
  }, []);

  const fetchEngineers = async () => {
    setLoading(true);
    try {
      setEngineers(mockEngineers);
      setFilteredEngineers(mockEngineers);
    } catch (error) {
      console.error("Error fetching engineers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
    
    if (field === "state") {
      setFilters(prev => ({ ...prev, district: "", taluka: "" }));
      setAvailableDistricts(districts[value] || []);
    }
    if (field === "district") {
      setFilters(prev => ({ ...prev, taluka: "" }));
      setAvailableTalukas(talukas[value] || []);
    }
  };

  const applyFilters = () => {
    let filtered = [...engineers];
    
    if (filters.serviceEngineer) {
      filtered = filtered.filter(e => e.name.toLowerCase().includes(filters.serviceEngineer.toLowerCase()));
    }
    if (filters.teamLead) {
      filtered = filtered.filter(e => e.assignedAction === "Assigned Under Dealer");
    }
    if (filters.state) {
      filtered = filtered.filter(e => e.state === filters.state);
    }
    if (filters.district) {
      filtered = filtered.filter(e => e.district === filters.district);
    }
    if (filters.taluka) {
      filtered = filtered.filter(e => e.taluka === filters.taluka);
    }
    if (filters.fromDate) {
      // Filter logic based on date if needed
    }
    if (filters.toDate) {
      // Filter logic based on date if needed
    }
    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.mobile.includes(searchTerm) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredEngineers(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      serviceEngineer: "",
      teamLead: "",
      state: "",
      district: "",
      taluka: "",
      fromDate: "",
      toDate: ""
    });
    setSearchTerm("");
    setFilteredEngineers(engineers);
    setCurrentPage(1);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === "state") {
      setFormData(prev => ({ ...prev, district: "", taluka: "" }));
      setAvailableDistricts(districts[value] || []);
    }
    if (field === "district") {
      setFormData(prev => ({ ...prev, taluka: "" }));
      setAvailableTalukas(talukas[value] || []);
    }
  };

  const handleAddEngineer = () => {
    if (!formData.firstName || !formData.lastName || !formData.mobile) {
      alert("Please fill all required fields");
      return;
    }

    const fullName = `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim();
    const initials = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();

    const newEngineer: ServiceEngineer = {
      id: engineers.length + 1,
      srNo: engineers.length + 1,
      initials: initials,
      name: fullName,
      firstName: formData.firstName,
      middleName: formData.middleName,
      lastName: formData.lastName,
      mobile: formData.mobile,
      email: formData.email,
      address: formData.address,
      state: formData.state,
      district: formData.district,
      taluka: formData.taluka,
      status: "Active",
      regDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      assignedAction: formData.isUnderDealer ? "Assigned Under Dealer" : "Not Assigned",
      isTeamLead: formData.isTeamLead,
      isUnderDealer: formData.isUnderDealer
    };
    
        setEngineers([newEngineer, ...engineers]);
    setFilteredEngineers([newEngineer, ...filteredEngineers]);
    setShowAddModal(false);
    resetForm();
    alert("Service engineer added successfully!");
  };

  const handleEditEngineer = () => {
    if (!selectedEngineer) return;
    if (!formData.firstName || !formData.lastName || !formData.mobile) {
      alert("Please fill all required fields");
      return;
    }

    const fullName = `${formData.firstName} ${formData.middleName} ${formData.lastName}`.trim();
    const initials = `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();

    const updatedEngineers = engineers.map(engineer => {
      if (engineer.id === selectedEngineer.id) {
        return {
          ...engineer,
          initials: initials,
          name: fullName,
          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,
          mobile: formData.mobile,
          email: formData.email,
          address: formData.address,
          state: formData.state,
          district: formData.district,
          taluka: formData.taluka,
          assignedAction: formData.isUnderDealer ? "Assigned Under Dealer" : "Not Assigned",
          isTeamLead: formData.isTeamLead,
          isUnderDealer: formData.isUnderDealer
        };
      }
      return engineer;
    });
    
    const reindexedEngineers = updatedEngineers.map((e, index) => ({
      ...e,
      srNo: index + 1
    }));
    
    setEngineers(reindexedEngineers);
    setFilteredEngineers(reindexedEngineers);
    setShowEditModal(false);
    resetForm();
    alert("Service engineer updated successfully!");
  };

  const handleDeleteEngineer = () => {
    if (!selectedEngineer) return;

    const updatedEngineers = engineers.filter(e => e.id !== selectedEngineer.id);
    const reindexedEngineers = updatedEngineers.map((e, index) => ({
      ...e,
      srNo: index + 1
    }));
    
    setEngineers(reindexedEngineers);
    setFilteredEngineers(reindexedEngineers);
    setShowDeleteConfirm(false);
    setSelectedEngineer(null);
    alert("Service engineer deleted successfully!");
  };

  const handleManageTeam = () => {
    if (!teamFormData.teamLeader) {
      alert("Please select Team Leader");
      return;
    }

    const updatedEngineers = engineers.map(engineer => {
      if (teamFormData.serviceEngineers.includes(engineer.name)) {
        return {
          ...engineer,
          assignedAction: "Assigned Under Dealer",
          isUnderDealer: true
        };
      }
      return engineer;
    });
    
    setEngineers(updatedEngineers);
    setFilteredEngineers(updatedEngineers);
    setShowManageTeamModal(false);
    setTeamFormData({
      teamLeader: "",
      serviceEngineers: []
    });
    alert("Team managed successfully!");
  };

  const openEditModal = (engineer: ServiceEngineer) => {
    setSelectedEngineer(engineer);
    setFormData({
      firstName: engineer.firstName,
      middleName: engineer.middleName,
      lastName: engineer.lastName,
      mobile: engineer.mobile,
      email: engineer.email,
      isTeamLead: engineer.isTeamLead,
      isUnderDealer: engineer.isUnderDealer,
      state: engineer.state,
      district: engineer.district,
      taluka: engineer.taluka,
      address: engineer.address
    });
    setAvailableDistricts(districts[engineer.state] || []);
    setAvailableTalukas(talukas[engineer.district] || []);
    setShowEditModal(true);
  };

  const openDeleteConfirm = (engineer: ServiceEngineer) => {
    setSelectedEngineer(engineer);
    setShowDeleteConfirm(true);
  };

  const openManageTeamModal = () => {
    setTeamFormData({
      teamLeader: "",
      serviceEngineers: []
    });
    setShowManageTeamModal(true);
  };

  const toggleServiceEngineer = (engineerName: string) => {
    setTeamFormData(prev => ({
      ...prev,
      serviceEngineers: prev.serviceEngineers.includes(engineerName)
        ? prev.serviceEngineers.filter(e => e !== engineerName)
        : [...prev.serviceEngineers, engineerName]
    }));
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      mobile: "",
      email: "",
      isTeamLead: false,
      isUnderDealer: false,
      state: "",
      district: "",
      taluka: "",
      address: ""
    });
    setAvailableDistricts([]);
    setAvailableTalukas([]);
    setSelectedEngineer(null);
  };

  const exportToCSV = () => {
    const headers = ["SR NO.", "SERVICE ENGINEER", "MOBILE", "EMAIL", "ADDRESS", "STATE", "DISTRICT", "TALUKA", "STATUS", "REG DATE", "ASSIGNED ACTION"];
    const csvData = filteredEngineers.map(e => [
      e.srNo,
      e.name,
      e.mobile,
      e.email || "-",
      e.address,
      e.state,
      e.district,
      e.taluka,
      e.status,
      e.regDate,
      e.assignedAction
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "service-engineers.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredEngineers.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredEngineers.length / recordsPerPage);

  // Get unique service engineers for filter dropdown
  const serviceEngineersList = [...new Set(engineers.map(e => e.name))];

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Service Engineers List</h1>
        <p className="text-gray-600 mt-1">Manage and view all service engineers</p>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search..."
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
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add Service Engineer
            </button>
            <button
              onClick={openManageTeamModal}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Users size={18} />
              Manage Team
            </button>
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
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mt-4 pt-4 border-t border-gray-200">
          <select
            value={filters.serviceEngineer}
            onChange={(e) => handleFilterChange("serviceEngineer", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black text-sm"
          >
            <option value="">Service Engineer: Select</option>
            {serviceEngineersList.map(engineer => (
              <option key={engineer} value={engineer}>{engineer}</option>
            ))}
          </select>
          
          <select
            value={filters.teamLead}
            onChange={(e) => handleFilterChange("teamLead", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black text-sm"
          >
            <option value="">Team Lead: Select</option>
            {teamLeads.map(lead => (
              <option key={lead} value={lead}>{lead}</option>
            ))}
          </select>
          
          <select
            value={filters.state}
            onChange={(e) => handleFilterChange("state", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black text-sm"
          >
            <option value="">State: Select</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          
          <select
            value={filters.district}
            onChange={(e) => handleFilterChange("district", e.target.value)}
            disabled={!filters.state}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black text-sm"
          >
            <option value="">District: Select</option>
            {filters.state && districts[filters.state]?.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
          
          <select
            value={filters.taluka}
            onChange={(e) => handleFilterChange("taluka", e.target.value)}
            disabled={!filters.district}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black text-sm"
          >
            <option value="">Taluka: Select</option>
            {filters.district && talukas[filters.district]?.map(taluka => (
              <option key={taluka} value={taluka}>{taluka}</option>
            ))}
          </select>
          
          <input
            type="date"
            placeholder="From: dd-mm-yyyy"
            value={filters.fromDate}
            onChange={(e) => handleFilterChange("fromDate", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black text-sm"
          />
          
          <input
            type="date"
            placeholder="To: dd-mm-yyyy"
            value={filters.toDate}
            onChange={(e) => handleFilterChange("toDate", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black text-sm"
          />
        </div>
        
        {/* Reset Filters Button */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Service Engineers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR NO.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">INITIALS</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SERVICE ENGINEER</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MOBILE</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMAIL</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ADDRESS</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATE</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DISTRICT</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TALUKA</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REG DATE</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ASSIGNED ACTION</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTION</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={13} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading engineers...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((engineer, index) => (
                  <tr key={engineer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {indexOfFirstRecord + index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-black">
                      {engineer.initials}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">
                      {engineer.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {engineer.mobile}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {engineer.email || "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {engineer.address}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {engineer.state}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {engineer.district}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {engineer.taluka}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        engineer.status === "Active" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}>
                        {engineer.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {engineer.regDate}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        engineer.assignedAction === "Assigned Under Dealer" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {engineer.assignedAction}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openEditModal(engineer)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(engineer)}
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
                  <td colSpan={13} className="px-6 py-8 text-center text-gray-500">
                    No service engineers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredEngineers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredEngineers.length)}</span> of{" "}
              <span className="font-medium">{filteredEngineers.length}</span> results
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

      {/* Add Service Engineer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-black">Add Service Engineer</h2>
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
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">First Name</label>
                    <input
                      type="text"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Middle Name</label>
                    <input
                      type="text"
                      placeholder="Middle Name"
                      value={formData.middleName}
                      onChange={(e) => handleInputChange("middleName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Last Name</label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isTeamLead}
                      onChange={(e) => handleInputChange("isTeamLead", e.target.checked)}
                      className="w-4 h-4 text-[#2e7d32] focus:ring-[#2e7d32]"
                    />
                    <span className="text-sm text-black">Select as Team Lead</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isUnderDealer}
                      onChange={(e) => handleInputChange("isUnderDealer", e.target.checked)}
                      className="w-4 h-4 text-[#2e7d32] focus:ring-[#2e7d32]"
                    />
                    <span className="text-sm text-black">Is Under Dealer</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">States</label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    >
                      <option value="">Select states</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Districts</label>
                    <select
                      value={formData.district}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      disabled={!formData.state}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
                    >
                      <option value="">Select districts</option>
                      {availableDistricts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Talukas</label>
                  <select
                    value={formData.taluka}
                    onChange={(e) => handleInputChange("taluka", e.target.value)}
                    disabled={!formData.district}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
                  >
                    <option value="">Select talukas</option>
                    {availableTalukas.map(taluka => (
                      <option key={taluka} value={taluka}>{taluka}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Address</label>
                  <textarea
                    rows={2}
                    placeholder="Address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
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
                onClick={handleAddEngineer}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Engineer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Engineer Modal */}
      {showEditModal && selectedEngineer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-black">Update Service Engineer</h2>
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
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">First Name</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Middle Name</label>
                    <input
                      type="text"
                      value={formData.middleName}
                      onChange={(e) => handleInputChange("middleName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Last Name</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Mobile Number</label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isTeamLead}
                      onChange={(e) => handleInputChange("isTeamLead", e.target.checked)}
                      className="w-4 h-4 text-[#2e7d32] focus:ring-[#2e7d32]"
                    />
                    <span className="text-sm text-black">Select as Team Lead</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isUnderDealer}
                      onChange={(e) => handleInputChange("isUnderDealer", e.target.checked)}
                      className="w-4 h-4 text-[#2e7d32] focus:ring-[#2e7d32]"
                    />
                    <span className="text-sm text-black">Is Under Dealer</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">States</label>
                    <select
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    >
                      <option value="">Select states</option>
                      {states.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Districts</label>
                    <select
                      value={formData.district}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      disabled={!formData.state}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
                    >
                      <option value="">Select districts</option>
                      {availableDistricts.map(district => (
                        <option key={district} value={district}>{district}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Talukas</label>
                  <select
                    value={formData.taluka}
                    onChange={(e) => handleInputChange("taluka", e.target.value)}
                    disabled={!formData.district}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
                  >
                    <option value="">Select talukas</option>
                    {availableTalukas.map(taluka => (
                      <option key={taluka} value={taluka}>{taluka}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Address</label>
                  <textarea
                    rows={2}
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
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
                onClick={handleEditEngineer}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Update Engineer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Team Modal */}
      {showManageTeamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Manage Team</h2>
              <button
                onClick={() => {
                  setShowManageTeamModal(false);
                  setTeamFormData({ teamLeader: "", serviceEngineers: [] });
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
                    Team Leader <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={teamFormData.teamLeader}
                    onChange={(e) => setTeamFormData(prev => ({ ...prev, teamLeader: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Team Leader</option>
                    {teamLeads.map(lead => (
                      <option key={lead} value={lead}>{lead}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Service Engineers <span className="text-red-500">*</span>
                  </label>
                  <div className="border border-gray-300 rounded-lg p-3 max-h-48 overflow-y-auto">
                    {engineers.map(engineer => (
                      <label key={engineer.id} className="flex items-center gap-2 py-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={teamFormData.serviceEngineers.includes(engineer.name)}
                          onChange={() => toggleServiceEngineer(engineer.name)}
                          className="w-4 h-4 text-[#2e7d32] focus:ring-[#2e7d32]"
                        />
                        <span className="text-sm text-black">{engineer.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Select one or more service engineers
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowManageTeamModal(false);
                  setTeamFormData({ teamLeader: "", serviceEngineers: [] });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleManageTeam}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedEngineer && (
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
                Are you sure you want to delete this service engineer?
              </p>
              <p className="text-center text-sm text-gray-500">
                Name: <span className="font-semibold">{selectedEngineer.name}</span>
              </p>
              <p className="text-center text-sm text-gray-500">
                Mobile: {selectedEngineer.mobile}
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
                onClick={handleDeleteEngineer}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}