// app/mobile-setting/user-manual/page.tsx
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
  FileText,
  File,
  Eye,
  Upload,
  FileUp,
  AlertCircle
} from "lucide-react";

interface UserManual {
  id: number;
  srNo: number;
  title: string;
  machine: string;
  model: string;
  fileName: string;
  fileUrl: string;
  fileSize: string;
  fileData?: string; // For base64 or blob URL
  createdAt: string;
}

// Mock data - user manuals (without actual files)
const mockManuals: UserManual[] = [
  {
    id: 1,
    srNo: 1,
    title: "bullet 616 3pl OM",
    machine: "BULLET",
    model: "616 3PL",
    fileName: "bullet_616_3pl_om.pdf",
    fileUrl: "",
    fileSize: "2.5 MB",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    srNo: 2,
    title: "grapemaster bullet v4 550",
    machine: "GRAPEMASTER",
    model: "Bullet V4 550",
    fileName: "grapemaster_bullet_v4_550.pdf",
    fileUrl: "",
    fileSize: "3.2 MB",
    createdAt: "2024-01-20"
  },
  {
    id: 3,
    srNo: 3,
    title: "Grape Master Bullet",
    machine: "GRAPEMASTER",
    model: "Bullet",
    fileName: "grape_master_bullet.pdf",
    fileUrl: "",
    fileSize: "2.8 MB",
    createdAt: "2024-02-01"
  },
  {
    id: 4,
    srNo: 4,
    title: "Grape master Bullet 550",
    machine: "GRAPEMASTER",
    model: "Bullet 550",
    fileName: "grape_master_bullet_550.pdf",
    fileUrl: "",
    fileSize: "3.5 MB",
    createdAt: "2024-02-10"
  },
  {
    id: 5,
    srNo: 5,
    title: "Manualblast v4 616",
    machine: "BLAST",
    model: "V4 616",
    fileName: "manualblast_v4_616.pdf",
    fileUrl: "",
    fileSize: "2.2 MB",
    createdAt: "2024-02-15"
  },
  {
    id: 6,
    srNo: 6,
    title: "Grapemaster blast v4",
    machine: "GRAPEMASTER",
    model: "Blast V4",
    fileName: "grapemaster_blast_v4.pdf",
    fileUrl: "",
    fileSize: "2.9 MB",
    createdAt: "2024-02-20"
  },
  {
    id: 7,
    srNo: 7,
    title: "Mitra Rotomaster 4.0",
    machine: "ROTOMASTER",
    model: "4.0",
    fileName: "mitra_rotomaster_4.0.pdf",
    fileUrl: "",
    fileSize: "4.1 MB",
    createdAt: "2024-02-25"
  },
  {
    id: 8,
    srNo: 8,
    title: "Mitra Rotomaster 3.5",
    machine: "ROTOMASTER",
    model: "3.5",
    fileName: "mitra_rotomaster_3.5.pdf",
    fileUrl: "",
    fileSize: "3.8 MB",
    createdAt: "2024-03-01"
  },
  {
    id: 9,
    srNo: 9,
    title: "AIROTEC TURBO 400 550 V2",
    machine: "AIROTEC",
    model: "Turbo 400 550 V2",
    fileName: "airotec_turbo_400_550_v2.pdf",
    fileUrl: "",
    fileSize: "3.0 MB",
    createdAt: "2024-03-05"
  }
];

// Machines for dropdown
const machines = [
  "AIROTEC", "BULLET", "GRAPEMASTER", "BLAST", "ROTOMASTER", 
  "RACE", "SWARAJ", "FARMFIT", "CROPMASTER", "DUSTER"
];

// Models for dropdown (based on selected machine)
const modelsByMachine: Record<string, string[]> = {
  "AIROTEC": ["Turbo 400 550 V2", "Turbo 600 Compact", "Turbo 600 V2", "Airotec Pro"],
  "BULLET": ["616 3PL", "PM ECO 616", "Bullet 550", "Bullet V4"],
  "GRAPEMASTER": ["Bullet V4 550", "Bullet", "Blast V4", "Grapemaster 500"],
  "BLAST": ["V4 616", "Blast 1000", "Blast 2000"],
  "ROTOMASTER": ["4.0", "3.5", "Rotomaster 500", "Rotomaster 700"],
  "RACE": ["Race 200", "Race 300", "Race 400"],
  "SWARAJ": ["S 600-712", "S 600-616", "S 200-550"],
  "FARMFIT": ["FF Race 600-712", "FF REEL 500", "FF REEL WIPER 500"],
  "CROPMASTER": ["Cropmaster 200", "Cropmaster 300"],
  "DUSTER": ["Duster 100", "Duster 200"]
};

export default function UserManualPage() {
  const [manuals, setManuals] = useState<UserManual[]>([]);
  const [filteredManuals, setFilteredManuals] = useState<UserManual[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [selectedManual, setSelectedManual] = useState<UserManual | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [pdfError, setPdfError] = useState(false);
  
  // Form Data
  const [formData, setFormData] = useState({
    title: "",
    machine: "",
    model: "",
    pdfFile: null as File | null
  });

  useEffect(() => {
    fetchManuals();
  }, []);

  const fetchManuals = async () => {
    setLoading(true);
    try {
      // Load manuals from localStorage if available
      const savedManuals = localStorage.getItem("user_manuals");
      if (savedManuals) {
        setManuals(JSON.parse(savedManuals));
        setFilteredManuals(JSON.parse(savedManuals));
      } else {
        setManuals(mockManuals);
        setFilteredManuals(mockManuals);
      }
    } catch (error) {
      console.error("Error fetching manuals:", error);
      setManuals(mockManuals);
      setFilteredManuals(mockManuals);
    } finally {
      setLoading(false);
    }
  };

  const saveToLocalStorage = (updatedManuals: UserManual[]) => {
    localStorage.setItem("user_manuals", JSON.stringify(updatedManuals));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === "machine") {
      const models = modelsByMachine[value] || [];
      setAvailableModels(models);
      setFormData(prev => ({ ...prev, model: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        alert("Only PDF files are accepted");
        return;
      }
      
      setFormData(prev => ({ ...prev, pdfFile: file }));
      setSelectedFile(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const createFileUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddManual = async () => {
    if (!formData.title || !formData.machine || !formData.model || !formData.pdfFile) {
      alert("Please fill all required fields and select a PDF file");
      return;
    }

    const fileData = await createFileUrl(formData.pdfFile);
    
    const newManual: UserManual = {
      id: manuals.length + 1,
      srNo: manuals.length + 1,
      title: formData.title,
      machine: formData.machine,
      model: formData.model,
      fileName: formData.pdfFile.name,
      fileUrl: fileData,
      fileSize: formatFileSize(formData.pdfFile.size),
      fileData: fileData,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    const updatedManuals = [newManual, ...manuals];
    setManuals(updatedManuals);
    setFilteredManuals(updatedManuals);
    saveToLocalStorage(updatedManuals);
    setShowAddModal(false);
    resetForm();
    alert("User manual added successfully!");
  };

  const handleEditManual = async () => {
    if (!selectedManual) return;
    if (!formData.title || !formData.machine || !formData.model) {
      alert("Please fill all required fields");
      return;
    }

    let fileData = selectedManual.fileData;
    let fileSize = selectedManual.fileSize;
    let fileName = selectedManual.fileName;
    
    if (formData.pdfFile) {
      fileData = await createFileUrl(formData.pdfFile);
      fileSize = formatFileSize(formData.pdfFile.size);
      fileName = formData.pdfFile.name;
    }

    const updatedManuals = manuals.map(manual => {
      if (manual.id === selectedManual.id) {
        return {
          ...manual,
          title: formData.title,
          machine: formData.machine,
          model: formData.model,
          fileName: fileName,
          fileSize: fileSize,
          fileUrl: fileData,
          fileData: fileData
        };
      }
      return manual;
    });
    
    const reindexedManuals = updatedManuals.map((item, idx) => ({
      ...item,
      srNo: idx + 1
    }));
    
    setManuals(reindexedManuals);
    setFilteredManuals(reindexedManuals);
    saveToLocalStorage(reindexedManuals);
    setShowEditModal(false);
    resetForm();
    alert("User manual updated successfully!");
  };

  const handleDeleteManual = () => {
    if (!selectedManual) return;

    const updatedManuals = manuals.filter(m => m.id !== selectedManual.id);
    const reindexedManuals = updatedManuals.map((item, idx) => ({
      ...item,
      srNo: idx + 1
    }));
    
    setManuals(reindexedManuals);
    setFilteredManuals(reindexedManuals);
    saveToLocalStorage(reindexedManuals);
    setShowDeleteConfirm(false);
    setSelectedManual(null);
    alert("User manual deleted successfully!");
  };

  const openEditModal = (manual: UserManual) => {
    setSelectedManual(manual);
    setFormData({
      title: manual.title,
      machine: manual.machine,
      model: manual.model,
      pdfFile: null
    });
    setAvailableModels(modelsByMachine[manual.machine] || []);
    setSelectedFile(null);
    setShowEditModal(true);
  };

  const openDeleteConfirm = (manual: UserManual) => {
    setSelectedManual(manual);
    setShowDeleteConfirm(true);
  };

  const openPdfViewer = (manual: UserManual) => {
    if (manual.fileData) {
      setSelectedManual(manual);
      setPdfError(false);
      setShowPdfViewer(true);
    } else {
      alert("PDF file not available. Please upload a new PDF file.");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      machine: "",
      model: "",
      pdfFile: null
    });
    setSelectedFile(null);
    setAvailableModels([]);
    setSelectedManual(null);
  };

  const applyFilters = () => {
    let filtered = [...manuals];
    
    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.machine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredManuals(filtered);
    setCurrentPage(1);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredManuals.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredManuals.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = ["Sr No.", "Title", "Machine", "Model", "File Name", "File Size", "Created At"];
    const csvData = filteredManuals.map(m => [
      m.srNo,
      m.title,
      m.machine,
      m.model,
      m.fileName,
      m.fileSize,
      m.createdAt
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user-manuals.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">User Manual List</h1>
        <p className="text-gray-600 mt-1">Manage user manuals and documentation</p>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by title, machine or model..."
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
              Upload PDF
            </button>
          </div>
        </div>
      </div>

      {/* User Manuals Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading manuals...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((manual) => (
                  <tr key={manual.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {manual.srNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {manual.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {manual.machine}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {manual.model}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-red-500" />
                        <span className="truncate max-w-[150px]">{manual.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {manual.fileSize}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openPdfViewer(manual)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                        title="View PDF"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => openEditModal(manual)}
                        className="text-green-600 hover:text-green-900 mr-3 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(manual)}
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
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No user manuals found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredManuals.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredManuals.length)}</span> of{" "}
              <span className="font-medium">{filteredManuals.length}</span> results
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

      {/* PDF Viewer Modal */}
      {showPdfViewer && selectedManual && selectedManual.fileData && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-5xl h-[90vh] p-4">
            <button
              onClick={() => setShowPdfViewer(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>
            <iframe
              src={selectedManual.fileData}
              title={selectedManual.title}
              className="w-full h-full rounded-lg bg-white"
              style={{ border: "none" }}
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm">
              {selectedManual.title} - {selectedManual.fileName}
            </div>
          </div>
        </div>
      )}

      {/* Add User Manual Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Upload PDF User Manual</h2>
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
                    Name / Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter manual title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Machine <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.machine}
                    onChange={(e) => handleInputChange("machine", e.target.value)}
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
                    Model <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    disabled={!formData.machine}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
                  >
                    <option value="">Select Model</option>
                    {availableModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    PDF File <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="pdf-file"
                    />
                    <label
                      htmlFor="pdf-file"
                      className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-black flex items-center gap-2"
                    >
                      <FileUp size={16} />
                      Choose File
                    </label>
                    <span className="text-sm text-gray-500">
                      {selectedFile ? selectedFile.name : "No file chosen"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    only PDF files will be accepted
                  </p>
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
                onClick={handleAddManual}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Manual
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Manual Modal */}
      {showEditModal && selectedManual && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Edit User Manual</h2>
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
                    Name / Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter manual title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Machine <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.machine}
                    onChange={(e) => handleInputChange("machine", e.target.value)}
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
                    Model <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.model}
                    onChange={(e) => handleInputChange("model", e.target.value)}
                    disabled={!formData.machine}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
                  >
                    <option value="">Select Model</option>
                    {availableModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    PDF File
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                      id="edit-pdf-file"
                    />
                    <label
                      htmlFor="edit-pdf-file"
                      className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-black flex items-center gap-2"
                    >
                      <FileUp size={16} />
                      Choose New File
                    </label>
                    <span className="text-sm text-gray-500">
                      {selectedFile ? selectedFile.name : "Current: " + selectedManual.fileName}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    only PDF files will be accepted (leave empty to keep current file)
                  </p>
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
                onClick={handleEditManual}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Update Manual
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedManual && (
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
                Are you sure you want to delete this user manual?
              </p>
              <p className="text-center text-sm text-gray-500">
                Title: <span className="font-semibold">{selectedManual.title}</span>
              </p>
              <p className="text-center text-sm text-gray-500">
                File: {selectedManual.fileName}
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
                onClick={handleDeleteManual}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Manual
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}