// app/manage-machines/parts/page.tsx
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
  Upload,
  Image as ImageIcon,
  Maximize2,
  XCircle
} from "lucide-react";

interface MachinePart {
  id: number;
  srNo: number;
  partName: string;
  partNumber: string;
  photo: string | null;
  price: string;
  machineName: string;
  machineModel: string;
  createdAt: string;
}

// Mock data - all machine parts
const mockParts: MachinePart[] = [
  { 
    id: 1, 
    srNo: 1, 
    partName: "Hydraulic Powder Mixer Assembly Mitra", 
    partNumber: "M3633", 
    photo: null, 
    price: "N/A", 
    machineName: "N/A", 
    machineModel: "N/A", 
    createdAt: "2024-01-15" 
  },
  { 
    id: 2, 
    srNo: 2, 
    partName: "40mm Tee,PP", 
    partNumber: "FT0040", 
    photo: null, 
    price: "N/A", 
    machineName: "N/A", 
    machineModel: "N/A", 
    createdAt: "2024-01-20" 
  },
  { 
    id: 3, 
    srNo: 3, 
    partName: "G 1.25 Suction Hex Nipple G 1.25", 
    partNumber: "OS0043", 
    photo: null, 
    price: "N/A", 
    machineName: "N/A", 
    machineModel: "N/A", 
    createdAt: "2024-02-01" 
  }
];

// Available machine names for dropdown
const machineNames = ["AIROTEC", "BULLET", "RACE", "SWARAJ", "FARMFIT", "CROPMASTER", "DUSTER", "BLAST", "OCTOPUS", "ROTOMASTER"];

// Machine models based on selected machine
const machineModelsByMachine: Record<string, string[]> = {
  "AIROTEC": ["Airotec Turbo 1000", "Airotec Turbo 2000", "Airotec Pro"],
  "BULLET": ["PM ECO 616", "PM ECO 616 Plus", "PM ECO 620"],
  "RACE": ["RACE 200", "RACE 300", "RACE 400"],
  "SWARAJ": ["S 600-712", "S 600-616", "S 200-550", "S 300-600"],
  "FARMFIT": ["FF Race 600-712", "FF REEL 500", "FF REEL WIPER 500", "FF REEL BOOM 500-20FT"],
  "CROPMASTER": ["Cropmaster 100", "Cropmaster 200", "Cropmaster 300"],
  "DUSTER": ["Duster 100", "Duster 200"],
  "BLAST": ["Blast 1000", "Blast 2000"],
  "OCTOPUS": ["Octopus 500", "Octopus 700"],
  "ROTOMASTER": ["Rotomaster 100", "Rotomaster 200"]
};

export default function MachinePartsPage() {
  const [parts, setParts] = useState<MachinePart[]>([]);
  const [filteredParts, setFilteredParts] = useState<MachinePart[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedPart, setSelectedPart] = useState<MachinePart | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  
  // Form Data
  const [formData, setFormData] = useState({
    partCode: "",
    partDescription: "",
    price: "",
    photo: null as File | null,
    machineName: "",
    machineModel: ""
  });

  useEffect(() => {
    // Load mock data
    setParts(mockParts);
    setFilteredParts(mockParts);
    setLoading(false);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Update available models when machine name changes
    if (field === "machineName") {
      const models = machineModelsByMachine[value] || [];
      setAvailableModels(models);
      setFormData(prev => ({ ...prev, machineModel: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      
      if (!validTypes.includes(file.type)) {
        alert("Only jpg, png, jpeg files are accepted");
        return;
      }
      
      setFormData(prev => ({ ...prev, photo: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPart = () => {
    if (!formData.partCode || !formData.partDescription) {
      alert("Please fill all required fields");
      return;
    }

    const newPart: MachinePart = {
      id: parts.length + 1,
      srNo: parts.length + 1,
      partName: formData.partDescription,
      partNumber: formData.partCode,
      photo: previewImage,
      price: formData.price || "N/A",
      machineName: formData.machineName || "N/A",
      machineModel: formData.machineModel || "N/A",
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setParts([newPart, ...parts]);
    setFilteredParts([newPart, ...filteredParts]);
    setShowAddModal(false);
    resetForm();
    alert("Part added successfully!");
  };

  const handleEditPart = () => {
    if (!selectedPart) return;
    if (!formData.partCode || !formData.partDescription) {
      alert("Please fill all required fields");
      return;
    }

    const updatedParts = parts.map(part => {
      if (part.id === selectedPart.id) {
        return {
          ...part,
          partNumber: formData.partCode,
          partName: formData.partDescription,
          price: formData.price || "N/A",
          photo: previewImage || part.photo,
          machineName: formData.machineName || "N/A",
          machineModel: formData.machineModel || "N/A"
        };
      }
      return part;
    });
    
    // Update serial numbers
    const reindexedParts = updatedParts.map((part, index) => ({
      ...part,
      srNo: index + 1
    }));
    
    setParts(reindexedParts);
    setFilteredParts(reindexedParts);
    setShowEditModal(false);
    resetForm();
    alert("Part updated successfully!");
  };

  const handleDeletePart = () => {
    if (!selectedPart) return;

    const updatedParts = parts.filter(p => p.id !== selectedPart.id);
    // Update serial numbers
    const reindexedParts = updatedParts.map((part, index) => ({
      ...part,
      srNo: index + 1
    }));
    
    setParts(reindexedParts);
    setFilteredParts(reindexedParts);
    setShowDeleteConfirm(false);
    setSelectedPart(null);
    alert("Part deleted successfully!");
  };

  const openEditModal = (part: MachinePart) => {
    setSelectedPart(part);
    setFormData({
      partCode: part.partNumber,
      partDescription: part.partName,
      price: part.price === "N/A" ? "" : part.price,
      photo: null,
      machineName: part.machineName === "N/A" ? "" : part.machineName,
      machineModel: part.machineModel === "N/A" ? "" : part.machineModel
    });
    setPreviewImage(part.photo);
    
    // Set available models based on selected machine
    if (part.machineName !== "N/A") {
      setAvailableModels(machineModelsByMachine[part.machineName] || []);
    }
    
    setShowEditModal(true);
  };

  const openDeleteConfirm = (part: MachinePart) => {
    setSelectedPart(part);
    setShowDeleteConfirm(true);
  };

  const openImageFullScreen = (imageUrl: string) => {
    setFullScreenImage(imageUrl);
    setShowImageModal(true);
  };

  const resetForm = () => {
    setFormData({
      partCode: "",
      partDescription: "",
      price: "",
      photo: null,
      machineName: "",
      machineModel: ""
    });
    setPreviewImage(null);
    setSelectedPart(null);
    setAvailableModels([]);
  };

  const applyFilters = () => {
    let filtered = [...parts];
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.partName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.machineName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredParts(filtered);
    setCurrentPage(1);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredParts.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredParts.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = ["Sr No.", "Part Name", "Part Number", "Price", "Machine", "Machine Model"];
    const csvData = filteredParts.map(p => [
      p.srNo,
      p.partName,
      p.partNumber,
      p.price,
      p.machineName,
      p.machineModel
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "machine-parts.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Machine Part</h1>
        <p className="text-gray-600 mt-1">All Parts List - Manage and view all machine parts</p>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by part name, part number or machine..."
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
              Add Part
            </button>
          </div>
        </div>
      </div>

      {/* Parts Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Part Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine Model</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading parts...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((part, index) => (
                  <tr key={part.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {indexOfFirstRecord + index + 1}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-black">
                      {part.partName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-black">
                      {part.partNumber}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {part.photo ? (
                        <div className="relative group">
                          <img 
                            src={part.photo} 
                            alt={part.partName} 
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => openImageFullScreen(part.photo!)}
                          />
                          <button
                            onClick={() => openImageFullScreen(part.photo!)}
                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center"
                          >
                            <Maximize2 size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon size={20} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {part.price}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {part.machineName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-black">
                      {part.machineModel}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openEditModal(part)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(part)}
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
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No parts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredParts.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredParts.length)}</span> of{" "}
              <span className="font-medium">{filteredParts.length}</span> results
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

      {/* Full Screen Image Modal */}
      {showImageModal && fullScreenImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] p-4">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <XCircle size={32} />
            </button>
            <img 
              src={fullScreenImage} 
              alt="Full screen view" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <p className="text-center text-white mt-4 text-sm">
              Click anywhere to close
            </p>
          </div>
        </div>
      )}

      {/* Add Part Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-black">Add Part</h2>
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
                    Part Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Part Code"
                    value={formData.partCode}
                    onChange={(e) => handleInputChange("partCode", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Part Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter Part Description"
                    value={formData.partDescription}
                    onChange={(e) => handleInputChange("partDescription", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Price
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Part Photo
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="part-photo"
                    />
                    <label
                      htmlFor="part-photo"
                      className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-black flex items-center gap-2"
                    >
                      <Upload size={16} />
                      Choose File
                    </label>
                    <span className="text-sm text-gray-500">
                      {formData.photo ? formData.photo.name : "No file chosen"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    only jpg, png, jpeg files will be accepted
                  </p>
                  {previewImage && (
                    <div className="mt-3">
                      <img src={previewImage} alt="Preview" className="w-20 h-20 object-cover rounded border" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Select Machine Name
                  </label>
                  <select
                    value={formData.machineName}
                    onChange={(e) => handleInputChange("machineName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Machine</option>
                    {machineNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Select Machine Model
                  </label>
                  <select
                    value={formData.machineModel}
                    onChange={(e) => handleInputChange("machineModel", e.target.value)}
                    disabled={!formData.machineName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
                  >
                    <option value="">Select Machine Model</option>
                    {availableModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
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
                onClick={handleAddPart}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Part
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Part Modal */}
      {showEditModal && selectedPart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-black">Edit Part</h2>
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
                    Part Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Part Code"
                    value={formData.partCode}
                    onChange={(e) => handleInputChange("partCode", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Part Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter Part Description"
                    value={formData.partDescription}
                    onChange={(e) => handleInputChange("partDescription", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Price
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Price"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Part Photo
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="edit-part-photo"
                    />
                    <label
                      htmlFor="edit-part-photo"
                      className="px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-black flex items-center gap-2"
                    >
                      <Upload size={16} />
                      Choose File
                    </label>
                    <span className="text-sm text-gray-500">
                      {formData.photo ? formData.photo.name : "No file chosen"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    only jpg, png, jpeg files will be accepted
                  </p>
                  {previewImage && (
                    <div className="mt-3">
                      <img src={previewImage} alt="Preview" className="w-20 h-20 object-cover rounded border" />
                    </div>
                  )}
                  {!previewImage && selectedPart.photo && (
                    <div className="mt-3">
                      <img src={selectedPart.photo} alt="Current" className="w-20 h-20 object-cover rounded border" />
                      <p className="text-xs text-gray-400 mt-1">Current image</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Select Machine Name
                  </label>
                  <select
                    value={formData.machineName}
                    onChange={(e) => handleInputChange("machineName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Machine</option>
                    {machineNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Select Machine Model
                  </label>
                  <select
                    value={formData.machineModel}
                    onChange={(e) => handleInputChange("machineModel", e.target.value)}
                    disabled={!formData.machineName}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] disabled:bg-gray-100 text-black"
                  >
                    <option value="">Select Machine Model</option>
                    {availableModels.map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </select>
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
                onClick={handleEditPart}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Update Part
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedPart && (
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
                Are you sure you want to delete this part?
              </p>
              <p className="text-center text-sm text-gray-500">
                Part: <span className="font-semibold">{selectedPart.partName}</span>
              </p>
              <p className="text-center text-sm text-gray-500">
                Part Number: {selectedPart.partNumber}
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
                onClick={handleDeletePart}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Part
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}