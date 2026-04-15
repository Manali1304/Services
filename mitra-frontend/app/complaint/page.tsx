// app/complaint/page.tsx
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
  AlertCircle,
  Calendar,
  User,
  Phone,
  Wrench,
  MessageSquare,
  Upload,
  Save,
  Eye,
  Edit,
  Clock,
  CheckCircle,
  XCircle,
  Printer,
  Send,
  Key,
  Trash2,
  FileText,
  ExternalLink
} from "lucide-react";

interface Complaint {
  id: number;
  srNo: number;
  complaintsId: string;
  customerName: string;
  mobile: string;
  problem: string;
  status: string;
  installationDate: string;
  warrantyDate: string;
  seName: string;
  date: string;
  updateSE: string;
  otp: string;
  machineName?: string;
  machineModel?: string;
  machineSrNo?: string;
  category?: string;
  subCategory?: string;
  subCategory2?: string;
}

// Mock data for dropdowns
const customers = [
  { id: 1, name: "Shivaji Pokale", mobile: "8010987170", machineName: "AIROTEC", machineModel: "AIROTEC TURBO", machineSrNo: "1737364" },
  { id: 2, name: "Rushikesh D Deshpande", mobile: "8010987170", machineName: "CROMPASTER", machineModel: "CROPMASTER 200", machineSrNo: "1737364" },
  { id: 3, name: "Akhok namdev kadam", mobile: "9325781904", machineName: "AIROTEC TURBO 600 COMPACT", machineModel: "Turbo 600", machineSrNo: "1737365" },
  { id: 4, name: "Jyotiram Vitthal Mule", mobile: "8329453535", machineName: "AIROTEC TURBO 600 712 V2", machineModel: "Turbo 600 V2", machineSrNo: "1737366" },
];

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

const serviceEngineers = [
  "SAGAR MAHADIK",
  "Rushikesh Deshmukh",
  "Rupesh V Khairnar",
  "Rajesh Patil",
  "Suresh Kamble",
  "Vijay Shinde",
  "Amol Kulkarni",
  "Mahesh Jadhav",
  "NAVNATH PAWAR",
  "SANKET MISAL",
  "ANKUSH KHANDARE",
  "RAJASHEKHAR SATTIGERI"
];

const statuses = [
  "Pending",
  "Assigned",
  "In Progress",
  "Resolved",
  "Closed",
  "Hold",
  "Escalated"
];

export default function ComplaintPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showUpdateSEModal, setShowUpdateSEModal] = useState(false);
  const [showCheckSheetModal, setShowCheckSheetModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showComplaintDetailModal, setShowComplaintDetailModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [activeTab, setActiveTab] = useState("all"); // all, needInstallation
  
  // Form data for add complaint
  const [formData, setFormData] = useState({
    customerId: "",
    machineName: "",
    problemType: "",
    description: "",
    sliderFile: null as File | null,
    alternativeMobile: ""
  });
  
  // Update SE form
  const [updateSEForm, setUpdateSEForm] = useState({
    complaintId: "",
    currentSE: "",
    newSE: ""
  });
  
  // Export filters
  const [exportFilters, setExportFilters] = useState({
    search: "",
    quickDateRange: "",
    fromDate: "",
    toDate: "",
    status: "",
    serviceEngineer: "",
    installDate: ""
  });
  
  // Filter states
  const [filters, setFilters] = useState({
    status: "",
    serviceEngineer: "",
    fromDate: "",
    toDate: "",
    installDate: ""
  });

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const mockComplaints: Complaint[] = [
        {
          id: 1,
          srNo: 1,
          complaintsId: "SR-26-007378",
          customerName: "Shivaji Pokale",
          mobile: "8010987170",
          problem: "Machine Not Starting",
          status: "Pending",
          installationDate: "2026-04-06",
          warrantyDate: "2027-04-05",
          seName: "SAGAR MAHADIK",
          date: "2026-04-06",
          updateSE: "SAGAR MAHADIK",
          otp: "123456",
          machineName: "AIROTEC",
          machineModel: "AIROTEC TURBO",
          machineSrNo: "AIRO-2024-001",
          category: "Electrical",
          subCategory: "Motor Issue",
          subCategory2: "Major Repair"
        },
        {
          id: 2,
          srNo: 2,
          complaintsId: "SR-26-007379",
          customerName: "Rushikesh D Deshpande",
          mobile: "8010987170",
          problem: "Water Leakage",
          status: "Pending",
          installationDate: "2025-11-10",
          warrantyDate: "2026-11-09",
          seName: "NAVNATH PAWAR",
          date: "2026-04-06",
          updateSE: "NAVNATH PAWAR",
          otp: "234567",
          machineName: "CROMPASTER",
          machineModel: "CROPMASTER 200",
          machineSrNo: "CMP-2024-001",
          category: "Mechanical",
          subCategory: "Pump Issue",
          subCategory2: "Minor Repair"
        },
        {
          id: 3,
          srNo: 3,
          complaintsId: "SR-26-007380",
          customerName: "Akhok namdev kadam",
          mobile: "9325781904",
          problem: "Low Pressure",
          status: "In Progress",
          installationDate: "2025-12-18",
          warrantyDate: "2026-12-17",
          seName: "SANKET MISAL",
          date: "2026-04-06",
          updateSE: "SANKET MISAL",
          otp: "345678",
          machineName: "AIROTEC TURBO 600 COMPACT",
          machineModel: "Turbo 600",
          machineSrNo: "AIRO-2024-002",
          category: "Hydraulic",
          subCategory: "Control Panel",
          subCategory2: "Part Replacement"
        },
        {
          id: 4,
          srNo: 4,
          complaintsId: "SR-26-007381",
          customerName: "Jyotiram Vitthal Mule",
          mobile: "8329453535",
          problem: "Noise Issue",
          status: "Pending",
          installationDate: "2022-06-15",
          warrantyDate: "2023-06-14",
          seName: "ANKUSH KHANDARE",
          date: "2026-04-06",
          updateSE: "ANKUSH KHANDARE",
          otp: "456789",
          machineName: "AIROTEC TURBO 600 712 V2",
          machineModel: "Turbo 600 V2",
          machineSrNo: "AIRO-2024-003",
          category: "Mechanical",
          subCategory: "Sensor Issue",
          subCategory2: "Calibration"
        }
      ];
      
      setComplaints(mockComplaints);
      setFilteredComplaints(mockComplaints);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === "customerId") {
      const selectedCustomer = customers.find(c => c.id.toString() === value);
      if (selectedCustomer) {
        setFormData(prev => ({ 
          ...prev, 
          customerId: value,
          machineName: selectedCustomer.machineName 
        }));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, sliderFile: e.target.files![0] }));
    }
  };

  const handleAddComplaint = () => {
    if (!formData.customerId || !formData.machineName || !formData.problemType || !formData.description) {
      alert("Please fill all required fields");
      return;
    }

    const selectedCustomer = customers.find(c => c.id.toString() === formData.customerId);
    
    const newComplaint: Complaint = {
      id: complaints.length + 1,
      srNo: complaints.length + 1,
      complaintsId: `SR-26-${String(complaints.length + 1).padStart(6, '0')}`,
      customerName: selectedCustomer?.name || "",
      mobile: selectedCustomer?.mobile || "",
      problem: formData.problemType,
      status: "Pending",
      installationDate: new Date().toISOString().split('T')[0],
      warrantyDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      seName: "Unassigned",
      date: new Date().toISOString().split('T')[0],
      updateSE: "Unassigned",
      otp: Math.floor(100000 + Math.random() * 900000).toString(),
      machineName: selectedCustomer?.machineName,
      machineModel: selectedCustomer?.machineModel,
      machineSrNo: selectedCustomer?.machineSrNo
    };
    
    setComplaints([newComplaint, ...complaints]);
    setFilteredComplaints([newComplaint, ...filteredComplaints]);
    setShowAddModal(false);
    setFormData({
      customerId: "",
      machineName: "",
      problemType: "",
      description: "",
      sliderFile: null,
      alternativeMobile: ""
    });
  };

  const handleUpdateSE = () => {
    if (!updateSEForm.complaintId || !updateSEForm.newSE) {
      alert("Please select a service engineer");
      return;
    }

    const updatedComplaints = complaints.map(complaint => {
      if (complaint.complaintsId === updateSEForm.complaintId) {
        return {
          ...complaint,
          seName: updateSEForm.newSE,
          updateSE: updateSEForm.newSE
        };
      }
      return complaint;
    });
    
    setComplaints(updatedComplaints);
    setFilteredComplaints(updatedComplaints);
    setShowUpdateSEModal(false);
    setUpdateSEForm({ complaintId: "", currentSE: "", newSE: "" });
    alert("Service engineer updated successfully!");
  };

  const handleDeleteComplaint = () => {
    if (selectedComplaint) {
      const updatedComplaints = complaints.filter(c => c.id !== selectedComplaint.id);
      setComplaints(updatedComplaints);
      setFilteredComplaints(updatedComplaints);
      setShowDeleteConfirm(false);
      setSelectedComplaint(null);
      alert("Complaint deleted successfully!");
    }
  };

  const openDeleteConfirm = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setShowDeleteConfirm(true);
  };

  const openUpdateSEModal = (complaint: Complaint) => {
    setUpdateSEForm({
      complaintId: complaint.complaintsId,
      currentSE: complaint.seName,
      newSE: complaint.seName
    });
    setShowUpdateSEModal(true);
  };

  const openCheckSheetModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setShowCheckSheetModal(true);
  };

  const openComplaintDetailModal = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setShowComplaintDetailModal(true);
  };

  const downloadCheckSheet = () => {
    if (!selectedComplaint) return;
    
    const checkSheetHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Installation Check Sheet - ${selectedComplaint.complaintsId}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .subtitle {
            font-size: 14px;
            color: #666;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-bottom: 30px;
            border: 1px solid #ddd;
            padding: 20px;
            border-radius: 8px;
          }
          .info-item {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #eee;
            padding: 8px 0;
          }
          .info-label {
            font-weight: bold;
            color: #555;
          }
          .info-value {
            color: #000;
          }
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            border-left: 4px solid #2e7d32;
            padding-left: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 10px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
            font-weight: bold;
          }
          .signature-section {
            display: flex;
            justify-content: space-between;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
          .signature-box {
            width: 200px;
          }
          .signature-line {
            border-bottom: 1px solid #000;
            margin-top: 40px;
            margin-bottom: 5px;
          }
          .print-date {
            text-align: right;
            margin-top: 30px;
            font-size: 12px;
            color: #999;
          }
          @media print {
            body {
              margin: 0;
              padding: 20px;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">INSTALLATION CHECK SHEET REPORT</div>
          <div class="subtitle">Mahindra AgriTech - MITRA System</div>
        </div>
        
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Complaint No:</span>
            <span class="info-value">${selectedComplaint.complaintsId}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Status:</span>
            <span class="info-value">${selectedComplaint.status}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Customer Name:</span>
            <span class="info-value">${selectedComplaint.customerName}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Contact No:</span>
            <span class="info-value">${selectedComplaint.mobile}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Service Engineer:</span>
            <span class="info-value">${selectedComplaint.seName}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Machine:</span>
            <span class="info-value">${selectedComplaint.machineName || "N/A"}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Machine Model:</span>
            <span class="info-value">${selectedComplaint.machineModel || "N/A"}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Machine Sr. NO:</span>
            <span class="info-value">${selectedComplaint.machineSrNo || "N/A"}</span>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Installation Details</div>
          <div class="info-grid" style="margin-bottom: 0;">
            <div class="info-item">
              <span class="info-label">Date of Installation:</span>
              <span class="info-value">${new Date(selectedComplaint.installationDate).toLocaleDateString('en-GB')}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Warranty Date:</span>
              <span class="info-value">${new Date(selectedComplaint.warrantyDate).toLocaleDateString('en-GB')}</span>
            </div>
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Problem Description</div>
          <div style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; background-color: #f9f9f9;">
            ${selectedComplaint.problem}
          </div>
        </div>
        
        <div class="section">
          <div class="section-title">Resolution Details</div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>DESCRIPTION</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>${selectedComplaint.problem}</td>
                <td>${selectedComplaint.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="signature-section">
          <div class="signature-box">
            <div class="signature-line"></div>
            <div style="text-align: center; font-size: 12px;">Customer Signature</div>
          </div>
          <div class="signature-box">
            <div class="signature-line"></div>
            <div style="text-align: center; font-size: 12px;">Service Engineer Signature</div>
          </div>
        </div>
        
        <div class="print-date">
          Print Date: ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString()}
        </div>
        
        <div class="no-print" style="text-align: center; margin-top: 30px;">
          <button onclick="window.print()" style="padding: 10px 20px; margin: 0 10px; background-color: #2e7d32; color: white; border: none; border-radius: 5px; cursor: pointer;">Print Report</button>
          <button onclick="window.close()" style="padding: 10px 20px; background-color: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([checkSheetHTML], { type: "text/html" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `complaint_checksheet_${selectedComplaint.complaintsId}.html`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleEditComplaint = (complaint: Complaint) => {
    setFormData({
      customerId: customers.find(c => c.name === complaint.customerName)?.id.toString() || "",
      machineName: complaint.machineName || "",
      problemType: complaint.problem,
      description: complaint.problem,
      sliderFile: null,
      alternativeMobile: ""
    });
    setShowAddModal(true);
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const applyFilters = () => {
    let filtered = [...complaints];
    
    if (activeTab === "needInstallation") {
      filtered = filtered.filter(c => c.status === "Need Installation");
    }
    
    if (filters.status) {
      filtered = filtered.filter(c => c.status === filters.status);
    }
    if (filters.serviceEngineer) {
      filtered = filtered.filter(c => c.seName === filters.serviceEngineer);
    }
    if (filters.installDate) {
      filtered = filtered.filter(c => c.installationDate === filters.installDate);
    }
    if (filters.fromDate) {
      filtered = filtered.filter(c => c.date >= filters.fromDate);
    }
    if (filters.toDate) {
      filtered = filtered.filter(c => c.date <= filters.toDate);
    }
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.complaintsId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mobile.includes(searchTerm)
      );
    }
    
    setFilteredComplaints(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      status: "",
      serviceEngineer: "",
      fromDate: "",
      toDate: "",
      installDate: ""
    });
    setSearchTerm("");
    setFilteredComplaints(complaints);
    setCurrentPage(1);
  };

  const handleExport = () => {
    let filtered = [...complaints];
    
    if (exportFilters.search) {
      filtered = filtered.filter(c => 
        c.complaintsId.toLowerCase().includes(exportFilters.search.toLowerCase()) ||
        c.customerName.toLowerCase().includes(exportFilters.search.toLowerCase()) ||
        c.mobile.includes(exportFilters.search)
      );
    }
    
    if (exportFilters.status) {
      filtered = filtered.filter(c => c.status === exportFilters.status);
    }
    if (exportFilters.serviceEngineer) {
      filtered = filtered.filter(c => c.seName === exportFilters.serviceEngineer);
    }
    if (exportFilters.installDate) {
      filtered = filtered.filter(c => c.installationDate === exportFilters.installDate);
    }
    if (exportFilters.fromDate) {
      filtered = filtered.filter(c => c.date >= exportFilters.fromDate);
    }
    if (exportFilters.toDate) {
      filtered = filtered.filter(c => c.date <= exportFilters.toDate);
    }
    
    const headers = [
      "SR No.", "Complaints Id", "Customer Name", "Mobile", "Problem", 
      "Status", "Installation Date", "Warranty Date", "SE Name", 
      "Date", "Update SE", "OTP"
    ];
    const csvData = filtered.map(c => [
      c.srNo,
      c.complaintsId,
      c.customerName,
      c.mobile,
      c.problem,
      c.status,
      c.installationDate,
      c.warrantyDate,
      c.seName,
      c.date,
      c.updateSE,
      c.otp
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "complaints.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredComplaints.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredComplaints.length / recordsPerPage);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      "Pending": "bg-yellow-100 text-yellow-800",
      "Assigned": "bg-blue-100 text-blue-800",
      "In Progress": "bg-purple-100 text-purple-800",
      "Resolved": "bg-green-100 text-green-800",
      "Closed": "bg-gray-100 text-gray-800",
      "Hold": "bg-orange-100 text-orange-800",
      "Escalated": "bg-red-100 text-red-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Complaint List</h1>
        <p className="text-gray-600 mt-1">Manage and track all customer complaints</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-4">
        <div className="flex gap-4">
          <button
            onClick={() => {
              setActiveTab("all");
              applyFilters();
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "all"
                ? "text-[#2e7d32] border-b-2 border-[#2e7d32]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All Complaints
          </button>
          <button
            onClick={() => {
              setActiveTab("needInstallation");
              applyFilters();
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "needInstallation"
                ? "text-[#2e7d32] border-b-2 border-[#2e7d32]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Need Installation
          </button>
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
              <option value={10}>10 Records per page</option>
              <option value={25}>25 Records</option>
              <option value={50}>50 Records</option>
              <option value={100}>100 Records</option>
            </select>
            <button
              onClick={() => setShowExportModal(true)}
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
              Add Complaint
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mt-4 pt-4 border-t border-gray-200">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
          >
            <option value="">All Status</option>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <select
            value={filters.serviceEngineer}
            onChange={(e) => handleFilterChange("serviceEngineer", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
          >
            <option value="">All Engg.</option>
            {serviceEngineers.map(engineer => (
              <option key={engineer} value={engineer}>{engineer}</option>
            ))}
          </select>
          
          <input
            type="date"
            placeholder="Install Date"
            value={filters.installDate}
            onChange={(e) => handleFilterChange("installDate", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
          />
          
          <input
            type="date"
            placeholder="From"
            value={filters.fromDate}
            onChange={(e) => handleFilterChange("fromDate", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
          />
          
          <input
            type="date"
            placeholder="To"
            value={filters.toDate}
            onChange={(e) => handleFilterChange("toDate", e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
          />
          
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Complaints Id.</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Problem</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Installation Date</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warranty Date</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SE Name</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Update SE</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OTP</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={13} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading complaints...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((complaint, index) => (
                  <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{indexOfFirstRecord + index + 1}</td>
                    <td 
                      className="px-3 py-3 whitespace-nowrap text-sm font-mono text-blue-600 hover:text-blue-800 cursor-pointer underline"
                      onClick={() => openComplaintDetailModal(complaint)}
                    >
                      {complaint.complaintsId}
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-black">{complaint.customerName}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{complaint.mobile}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{complaint.problem}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{new Date(complaint.installationDate).toLocaleDateString('en-GB')}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{new Date(complaint.warrantyDate).toLocaleDateString('en-GB')}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{complaint.seName}</td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm text-black">{new Date(complaint.date).toLocaleDateString('en-GB')}</td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <button
                        onClick={() => openUpdateSEModal(complaint)}
                        className="text-blue-600 hover:text-blue-900 transition-colors flex items-center gap-1"
                      >
                        <Send size={14} />
                        <span className="text-xs">SEND</span>
                      </button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap">
                      <button className="text-green-600 hover:text-green-900 transition-colors flex items-center gap-1">
                        <Key size={14} />
                        <span className="text-xs">Show OTP</span>
                      </button>
                    </td>
                    <td className="px-3 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openCheckSheetModal(complaint)}
                        className="text-blue-600 hover:text-blue-900 mr-2 transition-colors"
                        title="View Check Sheet"
                      >
                        <Printer size={18} />
                      </button>
                      <button
                        onClick={() => handleEditComplaint(complaint)}
                        className="text-orange-600 hover:text-orange-900 mr-2 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(complaint)}
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
                    No complaints found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredComplaints.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredComplaints.length)}</span> of{" "}
              <span className="font-medium">{filteredComplaints.length}</span> results
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

      {/* Complaint Detail Modal */}
      {showComplaintDetailModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-black">Complaint Details</h2>
              <button
                onClick={() => setShowComplaintDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              {/* Complaint Header */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Complaint ID</p>
                    <p className="text-xl font-bold text-black">{selectedComplaint.complaintsId}</p>
                  </div>
                  <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedComplaint.status)}`}>
                    {selectedComplaint.status}
                  </span>
                </div>
              </div>

              {/* Customer Information */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-black mb-3 border-b border-gray-200 pb-2">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Customer Name</p>
                    <p className="text-base font-medium text-black">{selectedComplaint.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mobile Number</p>
                    <p className="text-base font-medium text-black">{selectedComplaint.mobile}</p>
                  </div>
                </div>
              </div>

              {/* Service Engineer Information */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-black mb-3 border-b border-gray-200 pb-2">Service Engineer</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">SE Name</p>
                    <p className="text-base font-medium text-black">{selectedComplaint.seName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-base font-medium text-black">{new Date(selectedComplaint.date).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
              </div>

              {/* Machine Information */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-black mb-3 border-b border-gray-200 pb-2">Machine Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Machine Name</p>
                    <p className="text-base font-medium text-black">{selectedComplaint.machineName || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Machine Model</p>
                    <p className="text-base font-medium text-black">{selectedComplaint.machineModel || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Serial No.</p>
                    <p className="text-base font-medium text-black">{selectedComplaint.machineSrNo || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Installation Date</p>
                    <p className="text-base font-medium text-black">{new Date(selectedComplaint.installationDate).toLocaleDateString('en-GB')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Warranty Date</p>
                    <p className="text-base font-medium text-black">{new Date(selectedComplaint.warrantyDate).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
              </div>

              {/* Complaint Details */}
              <div className="mb-6">
                <h3 className="text-md font-semibold text-black mb-3 border-b border-gray-200 pb-2">Complaint Details</h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Problem Type</p>
                    <p className="text-base font-medium text-black">{selectedComplaint.problem}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">OTP</p>
                    <p className="text-base font-mono font-medium text-black">{selectedComplaint.otp}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-black p-3 bg-gray-50 rounded-lg">{selectedComplaint.problem}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowComplaintDetailModal(false);
                    openCheckSheetModal(selectedComplaint);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Printer size={18} />
                  View Check Sheet
                </button>
                <button
                  onClick={() => {
                    setShowComplaintDetailModal(false);
                    openUpdateSEModal(selectedComplaint);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Send size={18} />
                  Update SE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Update Service Engineer Modal */}
      {showUpdateSEModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Update Service Engineer</h2>
              <button
                onClick={() => setShowUpdateSEModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Complaint ID
                  </label>
                  <input
                    type="text"
                    value={updateSEForm.complaintId}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Current Service Engineer
                  </label>
                  <input
                    type="text"
                    value={updateSEForm.currentSE}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    New Service Engineer <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={updateSEForm.newSE}
                    onChange={(e) => setUpdateSEForm(prev => ({ ...prev, newSE: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Engineer</option>
                    {serviceEngineers.map(engineer => (
                      <option key={engineer} value={engineer}>{engineer}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowUpdateSEModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSE}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Send size={18} />
                Update Engineer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Installation Check Sheet Report Modal */}
      {showCheckSheetModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">INSTALLATION CHECK SHEET REPORT</h2>
              <button
                onClick={() => setShowCheckSheetModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Complaint No</p>
                  <p className="text-lg font-semibold text-black">{selectedComplaint.complaintsId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-lg font-semibold text-black">{selectedComplaint.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer Name</p>
                  <p className="text-lg font-semibold text-black">{selectedComplaint.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Contact No</p>
                  <p className="text-lg font-semibold text-black">{selectedComplaint.mobile}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service Engineer</p>
                  <p className="text-lg font-semibold text-black">{selectedComplaint.seName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Machine</p>
                  <p className="text-lg font-semibold text-black">{selectedComplaint.machineName || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Machine Model</p>
                  <p className="text-lg font-semibold text-black">{selectedComplaint.machineModel || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Machine Sr. NO</p>
                  <p className="text-lg font-semibold text-black">{selectedComplaint.machineSrNo || "N/A"}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date of Installation</p>
                    <p className="text-base font-medium text-black">{new Date(selectedComplaint.installationDate).toLocaleDateString('en-GB')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Warranty Date</p>
                    <p className="text-base font-medium text-black">{new Date(selectedComplaint.warrantyDate).toLocaleDateString('en-GB')}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <h3 className="text-md font-semibold text-black mb-3">Problem Description</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-black">{selectedComplaint.problem}</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Customer Signature</p>
                    <div className="border-b border-gray-300 w-48"></div>
                    <p className="text-xs text-gray-400 mt-1">N/A</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Service Engineer Signature</p>
                    <div className="border-b border-gray-300 w-48"></div>
                    <p className="text-xs text-gray-400 mt-1">N/A</p>
                  </div>
                </div>
                <div className="text-right mt-6">
                  <p className="text-xs text-gray-400">Print Date: {new Date().toLocaleDateString('en-GB')}</p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={downloadCheckSheet}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                Download Report
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Printer size={18} />
                Print Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedComplaint && (
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
                Are you sure you want to delete this complaint?
              </p>
              <p className="text-center text-sm text-gray-500">
                Complaint ID: <span className="font-mono font-semibold">{selectedComplaint.complaintsId}</span>
              </p>
              <p className="text-center text-sm text-gray-500">
                Customer: {selectedComplaint.customerName}
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
                onClick={handleDeleteComplaint}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Complaint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Complaint Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Add Complaint</h2>
              <button
                onClick={() => setShowAddModal(false)}
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

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Machine Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.machineName}
                    readOnly
                    placeholder="Select customer first"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Select Problem Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.problemType}
                    onChange={(e) => handleInputChange("problemType", e.target.value)}
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
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
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
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-black"
                    >
                      Choose File
                    </label>
                    <span className="text-sm text-gray-500">
                      {formData.sliderFile ? formData.sliderFile.name : "No file chosen"}
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
                    value={formData.alternativeMobile}
                    onChange={(e) => handleInputChange("alternativeMobile", e.target.value)}
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

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Export Complaints</h2>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Search (Complaint ID, Customer Name, Mobile)
                  </label>
                  <input
                    type="text"
                    placeholder="Search by complaint ID, customer name or mobile..."
                    value={exportFilters.search}
                    onChange={(e) => setExportFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Quick Date Range
                  </label>
                  <select
                    value={exportFilters.quickDateRange}
                    onChange={(e) => setExportFilters(prev => ({ ...prev, quickDateRange: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select date range</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="last7">Last 7 Days</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Custom Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="date"
                      placeholder="From Date"
                      value={exportFilters.fromDate}
                      onChange={(e) => setExportFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    />
                    <input
                      type="date"
                      placeholder="To Date"
                      value={exportFilters.toDate}
                      onChange={(e) => setExportFilters(prev => ({ ...prev, toDate: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium text-black mb-3">Export Filters</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Status</label>
                      <select
                        value={exportFilters.status}
                        onChange={(e) => setExportFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                      >
                        <option value="">All Status</option>
                        {statuses.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-black mb-2">Service Engineer</label>
                      <select
                        value={exportFilters.serviceEngineer}
                        onChange={(e) => setExportFilters(prev => ({ ...prev, serviceEngineer: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                      >
                        <option value="">All Engineers</option>
                        {serviceEngineers.map(engineer => (
                          <option key={engineer} value={engineer}>{engineer}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-black mb-2">Install Date</label>
                      <input
                        type="date"
                        value={exportFilters.installDate}
                        onChange={(e) => setExportFilters(prev => ({ ...prev, installDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}