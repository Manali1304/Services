"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Plus, 
  Filter, 
  X, 
  Monitor, 
  Calendar,
  User,
  Phone,
  Wrench,
  Store,
  Edit,
  Eye,
  Save,
  AlertCircle
} from "lucide-react";

interface CustomerMachine {
  model: string;
  name: string;
  id: number;
  srNo: number;
  customerName: string;
  customerMobile: string;
  machineModel: string;
  machineName: string;
  pumpSRNo: string;
  gearBoxSRNo: string;
  serviceEngineer: string;
  dealerName: string;
  updateDealerName: string;
  installOn: string;
  status: string;
}

// Mock data for dropdowns
const customers = [
  { id: 1, name: "Akhok namdev kadam", mobile: "9325781904" },
  { id: 2, name: "Jyotiram Vitthal Mule", mobile: "8329453535" },
  { id: 3, name: "babasaheb paraji jaadhav", mobile: "9595065787" },
];

const machines = [
  { id: 1, name: "AIROTEC TURBO 600 COMPACT", model: "Turbo 600 Compact" },
  { id: 2, name: "AIROTEC TURBO 600 712 V2", model: "Turbo 600 V2" },
  { id: 3, name: "RACE 200", model: "Race 200" },
];

const serviceEngineers = [
  "Rajesh Patil",
  "Suresh Kamble",
  "Vijay Shinde",
  "Amol Kulkarni",
  "Mahesh Jadhav"
];

const dealers = [
  "AgriTech Solutions",
  "Farm Equipment Center",
  "Modern Agro Services",
  "Green Fields Traders",
  "Krishi Mitra"
];

export default function CustomerMachinePage() {
  const [machines, setMachines] = useState<CustomerMachine[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<CustomerMachine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    customerId: "",
    machineId: "",
    machineModel: "",
    machineSerialNo: "",
    pumpSerialNo: "",
    gearBoxSerialNo: "",
    serviceEngineer: "",
    dealerName: "",
    installationDate: ""
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    machineModel: "",
    serviceEngineer: "",
    dealerName: "",
    fromDate: "",
    toDate: "",
    status: ""
  });

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    setLoading(true);
    try {
      const mockMachines: CustomerMachine[] = [
        
      ];
      
      setMachines(mockMachines);
      setFilteredMachines(mockMachines);
    } catch (error) {
      console.error("Error fetching machines:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-populate machine model when machine is selected
    if (field === "machineId") {
      const selectedMachine = machines.find(m => m.id.toString() === value);
      if (selectedMachine) {
        setFormData(prev => ({ 
          ...prev, 
          machineId: value,
          machineModel: selectedMachine.model 
        }));
      }
    }
    
    // Auto-populate customer details when customer is selected
    if (field === "customerId") {
      const selectedCustomer = customers.find(c => c.id.toString() === value);
      if (selectedCustomer) {
        // You can add customer details to form if needed
      }
    }
  };

  const handleAddMachine = () => {
    // Validate form
    if (!formData.customerId || !formData.machineId || !formData.machineSerialNo || 
        !formData.pumpSerialNo || !formData.gearBoxSerialNo || !formData.serviceEngineer || 
        !formData.dealerName || !formData.installationDate) {
      alert("Please fill all fields");
      return;
    }

    const selectedCustomer = customers.find(c => c.id.toString() === formData.customerId);
    const selectedMachine = machines.find(m => m.id.toString() === formData.machineId);
    
    const newMachine: CustomerMachine = {
        id: machines.length + 1,
        srNo: machines.length + 1,
        customerName: selectedCustomer?.name || "",
        customerMobile: selectedCustomer?.mobile || "",
        machineModel: selectedMachine?.name || "",
        machineName: formData.machineModel,
        pumpSRNo: formData.pumpSerialNo,
        gearBoxSRNo: formData.gearBoxSerialNo,
        serviceEngineer: formData.serviceEngineer,
        dealerName: formData.dealerName,
        updateDealerName: formData.dealerName,
        installOn: formData.installationDate,
        status: "Active",
        model: "",
        name: ""
    };
    
    setMachines([newMachine, ...machines]);
    setFilteredMachines([newMachine, ...filteredMachines]);
    setShowAddModal(false);
    setFormData({
      customerId: "",
      machineId: "",
      machineModel: "",
      machineSerialNo: "",
      pumpSerialNo: "",
      gearBoxSerialNo: "",
      serviceEngineer: "",
      dealerName: "",
      installationDate: ""
    });
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const applyFilters = () => {
    let filtered = [...machines];
    
    if (filters.machineModel) {
      filtered = filtered.filter(m => m.machineModel === filters.machineModel);
    }
    if (filters.serviceEngineer) {
      filtered = filtered.filter(m => m.serviceEngineer.toLowerCase().includes(filters.serviceEngineer.toLowerCase()));
    }
    if (filters.dealerName) {
      filtered = filtered.filter(m => m.dealerName.toLowerCase().includes(filters.dealerName.toLowerCase()));
    }
    if (filters.fromDate) {
      filtered = filtered.filter(m => m.installOn >= filters.fromDate);
    }
    if (filters.toDate) {
      filtered = filtered.filter(m => m.installOn <= filters.toDate);
    }
    if (filters.status) {
      filtered = filtered.filter(m => m.status === filters.status);
    }
    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.customerMobile.includes(searchTerm) ||
        m.machineModel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.pumpSRNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.gearBoxSRNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.serviceEngineer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredMachines(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      machineModel: "",
      serviceEngineer: "",
      dealerName: "",
      fromDate: "",
      toDate: "",
      status: ""
    });
    setSearchTerm("");
    setFilteredMachines(machines);
    setCurrentPage(1);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredMachines.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredMachines.length / recordsPerPage);

  // Get unique values for filters
  const uniqueMachineModels = [...new Set(machines.map(m => m.machineModel))];
  const uniqueServiceEngineers = [...new Set(machines.map(m => m.serviceEngineer))];
  const uniqueDealers = [...new Set(machines.map(m => m.dealerName))];

  const exportToCSV = () => {
    const headers = [
      "SR No.", "Customer Name", "Customer Mobile", "Machine Model", 
      "Machine Name", "Pump SR No.", "Gear Box SR No.", "Service Engineer", 
      "Dealer Name", "Update Dealer Name", "Install On", "Status"
    ];
    const csvData = filteredMachines.map(m => [
      m.srNo,
      m.customerName,
      m.customerMobile,
      m.machineModel,
      m.machineName,
      m.pumpSRNo,
      m.gearBoxSRNo,
      m.serviceEngineer,
      m.dealerName,
      m.updateDealerName,
      m.installOn,
      m.status
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customer-machines.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Customer Machines</h1>
        <p className="text-gray-600 mt-1">Manage and view all customer machine details</p>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by customer name, mobile, machine model, pump SR no, gear box SR no, engineer..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && applyFilters()}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-black"
            >
              <Filter size={18} />
              Filters
            </button>
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
              <option value={10}>10 Records</option>
              <option value={25}>25 Records</option>
              <option value={50}>50 Records</option>
              <option value={100}>100 Records</option>
            </select>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download size={18} />
              Export
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add Machine
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <select
                value={filters.machineModel}
                onChange={(e) => handleFilterChange("machineModel", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              >
                <option value="">Select Machine Model</option>
                {uniqueMachineModels.map(model => (
                  <option key={model} value={model}>{model}</option>
                ))}
              </select>
              
              <select
                value={filters.serviceEngineer}
                onChange={(e) => handleFilterChange("serviceEngineer", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              >
                <option value="">Select Service Engineer</option>
                {uniqueServiceEngineers.map(engineer => (
                  <option key={engineer} value={engineer}>{engineer}</option>
                ))}
              </select>
              
              <select
                value={filters.dealerName}
                onChange={(e) => handleFilterChange("dealerName", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              >
                <option value="">Select Dealer</option>
                {uniqueDealers.map(dealer => (
                  <option key={dealer} value={dealer}>{dealer}</option>
                ))}
              </select>
              
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              
              <input
                type="date"
                placeholder="Install From"
                value={filters.fromDate}
                onChange={(e) => handleFilterChange("fromDate", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              />
              
              <input
                type="date"
                placeholder="Install To"
                value={filters.toDate}
                onChange={(e) => handleFilterChange("toDate", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
              />
              
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <X size={18} />
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Machines Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SR No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Mobile</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine Model</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pump SR No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gear Box SR No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Engineer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dealer Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update Dealer Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Install On</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={13} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading machines...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((machine, index) => (
                  <tr key={machine.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {indexOfFirstRecord + index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">
                      {machine.customerName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {machine.customerMobile}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {machine.machineModel}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {machine.machineName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-black">
                      {machine.pumpSRNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-black">
                      {machine.gearBoxSRNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {machine.serviceEngineer}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {machine.dealerName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {machine.updateDealerName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {new Date(machine.installOn).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(machine.status)}`}>
                        {machine.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900 mr-2 transition-colors" title="View">
                        <Eye size={18} />
                      </button>
                      <button className="text-orange-600 hover:text-orange-900 transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={13} className="px-6 py-8 text-center text-gray-500">
                    No machines found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredMachines.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredMachines.length)}</span> of{" "}
              <span className="font-medium">{filteredMachines.length}</span> results
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

      {/* Add Machine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Add Customer Machine</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {/* Select Customer Name */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Select Customer Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.customerId}
                    onChange={(e) => handleInputChange("customerId", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Customer</option>
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name} ({customer.mobile})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Machine Name */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Select Machine Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.machineId}
                    onChange={(e) => handleInputChange("machineId", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Machine</option>
                    {machines.map(machine => (
                      <option key={machine.id} value={machine.id}>
                        {machine.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Select Machine Model */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Select Machine Model <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.machineModel}
                    readOnly
                    placeholder="Machine model will auto-populate"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black"
                  />
                </div>

                {/* Machine Serial No */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Machine Serial No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter serial number"
                    value={formData.machineSerialNo}
                    onChange={(e) => handleInputChange("machineSerialNo", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                {/* Pump Serial No */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Pump Serial No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter pump serial number"
                    value={formData.pumpSerialNo}
                    onChange={(e) => handleInputChange("pumpSerialNo", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                {/* Gear Box Serial No */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Gear Box Serial No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter gear box serial number"
                    value={formData.gearBoxSerialNo}
                    onChange={(e) => handleInputChange("gearBoxSerialNo", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                {/* Service Engineer */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Service Engineer <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.serviceEngineer}
                    onChange={(e) => handleInputChange("serviceEngineer", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Service Engineer</option>
                    {serviceEngineers.map(engineer => (
                      <option key={engineer} value={engineer}>{engineer}</option>
                    ))}
                  </select>
                </div>

                {/* Dealer */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Dealer <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.dealerName}
                    onChange={(e) => handleInputChange("dealerName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Dealer</option>
                    {dealers.map(dealer => (
                      <option key={dealer} value={dealer}>{dealer}</option>
                    ))}
                  </select>
                </div>

                {/* Installation Date */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Installation Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    placeholder="dd-mm-yyyy"
                    value={formData.installationDate}
                    onChange={(e) => handleInputChange("installationDate", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>
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
                onClick={handleAddMachine}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Machine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}