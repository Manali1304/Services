"use client";

import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/api';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Plus, 
  Filter, 
  X, 
  Users,
  Phone,
  MapPin,
  Calendar,
  Edit,
  Trash2,
  Save,
  AlertCircle,
  MessageSquare
} from "lucide-react";

interface Customer {
  id: number;
  srNo: number;
  customerName: string;
  firstName: string;
  middleName: string;
  lastName: string;
  mobile: string;
  state: string;
  district: string;
  taluka: string;
  village: string;
  address: string;
  machine: string;
  machineModel: string;
  warranty: string;
  serialNo: string;
  status: string;
  regDate: string;
  username?: string; // Add username for API operations
}

interface ComplaintFormData {
  customerId: string;
  customerName: string;
  machineName: string;
  problemType: string;
  description: string;
  sliderFile: File | null;
  alternativeMobile: string;
}

const states = ["Maharashtra", "Gujarat", "Rajasthan", "Madhya Pradesh", "Uttar Pradesh"];
const districts: Record<string, string[]> = {
  "Maharashtra": ["Dharashiv", "Solapur", "Jalna", "Pune", "Mumbai", "Nagpur"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Jabalpur", "Gwalior"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Agra", "Varanasi"]
};
const talukas: Record<string, string[]> = {
  "Dharashiv": ["Tuljapur", "Osmanabad", "Kalamb", "Lohara"],
  "Solapur": ["Madha", "Solapur North", "Solapur South", "Barshi"],
  "Jalna": ["Badnapur", "Jalna", "Bhokardan", "Jafrabad"],
  "Pune": ["Haveli", "Mulshi", "Maval", "Khed"],
  "Mumbai": ["Andheri", "Dadar", "Borivali", "Colaba"],
  "Nagpur": ["Nagpur Rural", "Nagpur Urban", "Kamthi", "Hingna"]
};

const machines = [
  "AIROTEC TURBO 600 COMPACT",
  "AIROTEC TURBO 600 712 V2",
  "RACE 200",
  "CROMPASTER",
  "CROPMASTER 200"
];

const machineModels: Record<string, string[]> = {
  "AIROTEC TURBO 600 COMPACT": ["Turbo 600 Compact", "Turbo 600 Compact Plus"],
  "AIROTEC TURBO 600 712 V2": ["Turbo 600 V2", "Turbo 600 V2 Pro"],
  "RACE 200": ["Race 200", "Race 200 Pro"],
  "CROMPASTER": ["Crompaster 100", "Crompaster 200"],
  "CROPMASTER 200": ["Cropmaster 200", "Cropmaster 200 Plus"]
};

const problemTypes = [
  "Machine Not Starting",
  "Water Leakage",
  "Low Pressure",
  "Noise Issue",
  "Electrical Problem",
  "Pump Failure",
  "Motor Issue",
  "Other"
];

export default function CustomerPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Filter states
  const [filters, setFilters] = useState({
    machine: "",
    state: "",
    district: "",
    taluka: "",
    fromDate: "",
    toDate: "",
    status: ""
  });

  // Add Customer Form Data
  const [addFormData, setAddFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    state: "",
    district: "",
    taluka: "",
    village: "",
    address: ""
  });

  // Edit Customer Form Data
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    mobile: "",
    state: "",
    district: "",
    taluka: "",
    village: "",
    address: ""
  });

  // Complaint Form Data
  const [complaintFormData, setComplaintFormData] = useState<ComplaintFormData>({
    customerId: "",
    customerName: "",
    machineName: "",
    problemType: "",
    description: "",
    sliderFile: null,
    alternativeMobile: ""
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  // UPDATED: Fetch customers from backend API
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const users = await getUsers();
      const customersList = users.filter((user: any) => user.role === "customer");
      
      const transformedCustomers = customersList.map((user: any, index: number) => ({
        id: user.id,
        srNo: index + 1,
        customerName: user.full_name || user.username,
        firstName: user.full_name?.split(' ')[0] || "",
        middleName: user.full_name?.split(' ').slice(1, -1).join(' ') || "",
        lastName: user.full_name?.split(' ').pop() || "",
        mobile: user.mobile,
        username: user.username,
        state: "",
        district: "",
        taluka: "",
        village: "",
        address: "",
        machine: "",
        machineModel: "",
        warranty: "Under Warranty",
        serialNo: "",
        status: "Active",
        regDate: user.created_at?.split('T')[0] || new Date().toISOString().split('T')[0]
      }));
      
      setCustomers(transformedCustomers);
      setFilteredCustomers(transformedCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      alert("Failed to load customers. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // UPDATED: Add customer using backend API
  const handleAddCustomer = async () => {
    if (!addFormData.firstName || !addFormData.lastName || !addFormData.mobile || !addFormData.state) {
      alert("Please fill all required fields");
      return;
    }

    const username = `${addFormData.firstName.toLowerCase()}_${addFormData.lastName.toLowerCase()}`;
    const fullName = `${addFormData.firstName} ${addFormData.middleName} ${addFormData.lastName}`.trim();
    
    try {
      await createUser({
        username: username,
        password: addFormData.mobile,
        email: `${username}@example.com`,
        mobile: addFormData.mobile,
        full_name: fullName,
        role: "customer"
      });
      
      alert("Customer added successfully!");
      fetchCustomers(); // Refresh the list
      setShowAddModal(false);
      setAddFormData({
        firstName: "",
        middleName: "",
        lastName: "",
        mobile: "",
        state: "",
        district: "",
        taluka: "",
        village: "",
        address: ""
      });
    } catch (error: any) {
      alert(error.message || "Failed to add customer");
    }
  };

  // UPDATED: Edit customer using backend API
  const handleEditCustomer = async () => {
    if (!selectedCustomer) return;
    
    const fullName = `${editFormData.firstName} ${editFormData.middleName} ${editFormData.lastName}`.trim();
    const username = selectedCustomer.username || `${editFormData.firstName.toLowerCase()}_${editFormData.lastName.toLowerCase()}`;
    
    try {
      await updateUser(username, {
        email: `${username}@example.com`,
        full_name: fullName,
        role: "customer"
      });
      
      alert("Customer updated successfully!");
      fetchCustomers(); // Refresh the list
      setShowEditModal(false);
      setSelectedCustomer(null);
    } catch (error: any) {
      alert(error.message || "Failed to update customer");
    }
  };

  // UPDATED: Delete customer using backend API
  const handleDeleteCustomer = async () => {
    if (!selectedCustomer) return;
    
    const username = selectedCustomer.username || `${selectedCustomer.firstName.toLowerCase()}_${selectedCustomer.lastName.toLowerCase()}`;
    
    try {
      await deleteUser(username);
      alert("Customer deleted successfully!");
      fetchCustomers(); // Refresh the list
      setShowDeleteConfirm(false);
      setSelectedCustomer(null);
    } catch (error: any) {
      alert(error.message || "Failed to delete customer");
    }
  };

  const handleAddComplaint = () => {
    if (!complaintFormData.customerId || !complaintFormData.machineName || !complaintFormData.problemType || !complaintFormData.description) {
      alert("Please fill all required fields");
      return;
    }
    
    alert("Complaint added successfully!");
    setShowComplaintModal(false);
    setComplaintFormData({
      customerId: "",
      customerName: "",
      machineName: "",
      problemType: "",
      description: "",
      sliderFile: null,
      alternativeMobile: ""
    });
  };

  const openAddComplaint = (customer: Customer) => {
    setComplaintFormData({
      customerId: customer.id.toString(),
      customerName: customer.customerName,
      machineName: customer.machine,
      problemType: "",
      description: "",
      sliderFile: null,
      alternativeMobile: ""
    });
    setShowComplaintModal(true);
  };

  const openEditModal = (customer: Customer) => {
    setSelectedCustomer(customer);
    setEditFormData({
      firstName: customer.firstName,
      middleName: customer.middleName,
      lastName: customer.lastName,
      mobile: customer.mobile,
      state: customer.state,
      district: customer.district,
      taluka: customer.taluka,
      village: customer.village,
      address: customer.address
    });
    setShowEditModal(true);
  };

  const openDeleteConfirm = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDeleteConfirm(true);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const applyFilters = () => {
    let filtered = [...customers];
    
    if (filters.machine) {
      filtered = filtered.filter(c => c.machine === filters.machine);
    }
    if (filters.state) {
      filtered = filtered.filter(c => c.state === filters.state);
    }
    if (filters.district) {
      filtered = filtered.filter(c => c.district === filters.district);
    }
    if (filters.taluka) {
      filtered = filtered.filter(c => c.taluka === filters.taluka);
    }
    if (filters.fromDate) {
      filtered = filtered.filter(c => c.regDate >= filters.fromDate);
    }
    if (filters.toDate) {
      filtered = filtered.filter(c => c.regDate <= filters.toDate);
    }
    if (filters.status) {
      filtered = filtered.filter(c => c.warranty === filters.status);
    }
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mobile.includes(searchTerm) ||
        c.village.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredCustomers(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      machine: "",
      state: "",
      district: "",
      taluka: "",
      fromDate: "",
      toDate: "",
      status: ""
    });
    setSearchTerm("");
    setFilteredCustomers(customers);
    setCurrentPage(1);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredCustomers.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredCustomers.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = [
      "SR No.", "Customer Name", "Mobile", "State", "District", 
      "Taluka", "Village", "Machine", "Machine Model", "Warranty", 
      "Serial No.", "Status", "Reg Date"
    ];
    const csvData = filteredCustomers.map(c => [
      c.srNo,
      c.customerName,
      c.mobile,
      c.state,
      c.district,
      c.taluka,
      c.village,
      c.machine,
      c.machineModel,
      c.warranty,
      c.serialNo,
      c.status,
      c.regDate
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    return status === "Under Warranty" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Customers List</h1>
        <p className="text-gray-600 mt-1">Manage and view all customer information</p>
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
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add Customer
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

        {/* Filters Row - All header options */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-4 pt-4 border-t border-gray-200">
          <select
            value={filters.machine}
            onChange={(e) => handleFilterChange("machine", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black text-sm"
          >
            <option value="">Machine:</option>
            <option value="">Select Machine</option>
            {machines.map(machine => (
              <option key={machine} value={machine}>{machine}</option>
            ))}
          </select>
          
          <select
            value={filters.state}
            onChange={(e) => {
              handleFilterChange("state", e.target.value);
              handleFilterChange("district", "");
              handleFilterChange("taluka", "");
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black text-sm"
          >
            <option value="">State:</option>
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
          
          <select
            value={filters.district}
            onChange={(e) => {
              handleFilterChange("district", e.target.value);
              handleFilterChange("taluka", "");
            }}
            disabled={!filters.state}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 disabled:cursor-not-allowed text-black text-sm"
          >
            <option value="">District:</option>
            <option value="">Select District</option>
            {filters.state && districts[filters.state]?.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
          
          <select
            value={filters.taluka}
            onChange={(e) => handleFilterChange("taluka", e.target.value)}
            disabled={!filters.district}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 disabled:cursor-not-allowed text-black text-sm"
          >
            <option value="">Taluka:</option>
            <option value="">Select Taluka</option>
            {filters.district && talukas[filters.district]?.map(taluka => (
              <option key={taluka} value={taluka}>{taluka}</option>
            ))}
          </select>
          
          <input
            type="date"
            placeholder="From:"
            value={filters.fromDate}
            onChange={(e) => handleFilterChange("fromDate", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black text-sm"
          />
          
          <input
            type="date"
            placeholder="To:"
            value={filters.toDate}
            onChange={(e) => handleFilterChange("toDate", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black text-sm"
          />
          
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black text-sm"
          >
            <option value="">Status:</option>
            <option value="">Select Status</option>
            <option value="Under Warranty">Under Warranty</option>
            <option value="Out of Warranty">Out of Warranty</option>
          </select>
        </div>
        
        {/* Reset Filters Button */}
        <div className="mt-3 flex justify-end">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No.</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Taluka</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Village</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine Model</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warranty</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial No.</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reg Date</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={14} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading customers...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((customer, index) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{indexOfFirstRecord + index + 1}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-black">{customer.customerName}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{customer.mobile}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{customer.state || "-"}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{customer.district || "-"}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{customer.taluka || "-"}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{customer.village || "-"}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{customer.machine || "-"}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{customer.machineModel || "-"}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(customer.warranty)}`}>
                        {customer.warranty}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{customer.serialNo || "-"}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{customer.regDate ? new Date(customer.regDate).toLocaleDateString('en-GB') : "-"}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openAddComplaint(customer)}
                        className="text-green-600 hover:text-green-900 mr-2 transition-colors"
                        title="Add Complaint"
                      >
                        <MessageSquare size={18} />
                      </button>
                      <button
                        onClick={() => openEditModal(customer)}
                        className="text-blue-600 hover:text-blue-900 mr-2 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(customer)}
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
                  <td colSpan={14} className="px-6 py-8 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredCustomers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredCustomers.length)}</span> of{" "}
              <span className="font-medium">{filteredCustomers.length}</span> results
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

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Add Customer</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">First Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={addFormData.firstName}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Middle Name</label>
                  <input
                    type="text"
                    placeholder="Middle Name"
                    value={addFormData.middleName}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, middleName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Last Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={addFormData.lastName}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">Mobile Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={addFormData.mobile}
                  onChange={(e) => setAddFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">State <span className="text-red-500">*</span></label>
                  <select
                    value={addFormData.state}
                    onChange={(e) => {
                      setAddFormData(prev => ({ ...prev, state: e.target.value, district: "", taluka: "" }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select a state</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">District</label>
                  <select
                    value={addFormData.district}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, district: e.target.value, taluka: "" }))}
                    disabled={!addFormData.state}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
                  >
                    <option value="">Select a district</option>
                    {addFormData.state && districts[addFormData.state]?.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Taluka</label>
                  <select
                    value={addFormData.taluka}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, taluka: e.target.value }))}
                    disabled={!addFormData.district}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
                  >
                    <option value="">Select a taluka</option>
                    {addFormData.district && talukas[addFormData.district]?.map(taluka => (
                      <option key={taluka} value={taluka}>{taluka}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Village</label>
                  <input
                    type="text"
                    placeholder="Village"
                    value={addFormData.village}
                    onChange={(e) => setAddFormData(prev => ({ ...prev, village: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">Address</label>
                <textarea
                  rows={3}
                  placeholder="Address"
                  value={addFormData.address}
                  onChange={(e) => setAddFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Update Customer</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">First Name</label>
                  <input
                    type="text"
                    value={editFormData.firstName}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Middle Name</label>
                  <input
                    type="text"
                    value={editFormData.middleName}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, middleName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Last Name</label>
                  <input
                    type="text"
                    value={editFormData.lastName}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">Mobile Number</label>
                <input
                  type="tel"
                  value={editFormData.mobile}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, mobile: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">State</label>
                  <select
                    value={editFormData.state}
                    onChange={(e) => {
                      setEditFormData(prev => ({ ...prev, state: e.target.value, district: "", taluka: "" }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select a state</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">District</label>
                  <select
                    value={editFormData.district}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, district: e.target.value, taluka: "" }))}
                    disabled={!editFormData.state}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
                  >
                    <option value="">Select a district</option>
                    {editFormData.state && districts[editFormData.state]?.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Taluka</label>
                  <select
                    value={editFormData.taluka}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, taluka: e.target.value }))}
                    disabled={!editFormData.district}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
                  >
                    <option value="">Select a taluka</option>
                    {editFormData.district && talukas[editFormData.district]?.map(taluka => (
                      <option key={taluka} value={taluka}>{taluka}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Village</label>
                  <input
                    type="text"
                    value={editFormData.village}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, village: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-black mb-2">Address</label>
                <textarea
                  rows={3}
                  value={editFormData.address}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, address: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditCustomer}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Update Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Complaint Modal */}
      {showComplaintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Add Complaint</h2>
              <button
                onClick={() => setShowComplaintModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Select Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={complaintFormData.customerName}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Select Machine Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={complaintFormData.machineName}
                    onChange={(e) => setComplaintFormData(prev => ({ ...prev, machineName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Machine</option>
                    {machines.map(machine => (
                      <option key={machine} value={machine}>{machine}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Select Problem Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={complaintFormData.problemType}
                    onChange={(e) => setComplaintFormData(prev => ({ ...prev, problemType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Problem Type</option>
                    {problemTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Add Complaint Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Add Complaint Description"
                    value={complaintFormData.description}
                    onChange={(e) => setComplaintFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Upload Slider
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      onChange={(e) => setComplaintFormData(prev => ({ ...prev, sliderFile: e.target.files?.[0] || null }))}
                      className="hidden"
                      id="complaint-file-upload"
                    />
                    <label
                      htmlFor="complaint-file-upload"
                      className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-black"
                    >
                      Choose File
                    </label>
                    <span className="text-sm text-gray-500">
                      {complaintFormData.sliderFile ? complaintFormData.sliderFile.name : "No file chosen"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Alternative Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Alternative Mobile Number"
                    value={complaintFormData.alternativeMobile}
                    onChange={(e) => setComplaintFormData(prev => ({ ...prev, alternativeMobile: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowComplaintModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComplaint}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Complaint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedCustomer && (
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
                Are you sure you want to delete this customer?
              </p>
              <p className="text-center text-sm text-gray-500">
                Customer: <span className="font-semibold">{selectedCustomer.customerName}</span>
              </p>
              <p className="text-center text-sm text-gray-500">
                Mobile: {selectedCustomer.mobile}
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
                onClick={handleDeleteCustomer}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}