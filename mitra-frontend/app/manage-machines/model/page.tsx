// app/manage-machines/model/page.tsx
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
  XCircle
} from "lucide-react";

interface MachineModel {
  id: number;
  srNo: number;
  machineName: string;
  modelName: string;
  serialNo: string;
  createdAt: string;
}

// Mock data - all machine models
const mockModels: MachineModel[] = [
  { id: 1, srNo: 1, machineName: "AIROTEC", modelName: "Airotec Turbo 1000 712L 100 18N", serialNo: "MS152", createdAt: "2024-01-15" },
  { id: 2, srNo: 2, machineName: "BULLET", modelName: "PM ECO 616", serialNo: "MS16", createdAt: "2024-01-20" },
  { id: 3, srNo: 3, machineName: "RACE", modelName: "RACE 200 550 LCS PP45", serialNo: "MS77", createdAt: "2024-02-01" },
  { id: 4, srNo: 4, machineName: "SWARAJ", modelName: "S 600-712", serialNo: "FF03", createdAt: "2024-02-05" },
  { id: 5, srNo: 5, machineName: "SWARAJ", modelName: "S 600-616", serialNo: "FF01", createdAt: "2024-02-10" },
  { id: 6, srNo: 6, machineName: "SWARAJ", modelName: "S 200-550", serialNo: "FF02", createdAt: "2024-02-15" },
  { id: 7, srNo: 7, machineName: "FARMFIT", modelName: "FF Race 600-712 DP75", serialNo: "FF03", createdAt: "2024-02-20" },
  { id: 8, srNo: 8, machineName: "FARMFIT", modelName: "FF REEL 500", serialNo: "FF04", createdAt: "2024-02-25" },
  { id: 9, srNo: 9, machineName: "FARMFIT", modelName: "FF REEL WIPER 500", serialNo: "FF05", createdAt: "2024-03-01" },
  { id: 10, srNo: 10, machineName: "FARMFIT", modelName: "FF REEL BOOM 500-20FT", serialNo: "FF06", createdAt: "2024-03-05" }
];

// Available machine names for dropdown
const machineNames = ["AIROTEC", "BULLET", "RACE", "SWARAJ", "FARMFIT", "CROPMASTER", "DUSTER", "BLAST", "OCTOPUS", "ROTOMASTER"];

export default function MachineModelPage() {
  const [models, setModels] = useState<MachineModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<MachineModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedModel, setSelectedModel] = useState<MachineModel | null>(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    machineName: "",
    modelName: "",
    serialNo: ""
  });

  useEffect(() => {
    // Load mock data
    setModels(mockModels);
    setFilteredModels(mockModels);
    setLoading(false);
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddModel = () => {
    if (!formData.machineName || !formData.modelName || !formData.serialNo) {
      alert("Please fill all required fields");
      return;
    }

    const newModel: MachineModel = {
      id: models.length + 1,
      srNo: models.length + 1,
      machineName: formData.machineName,
      modelName: formData.modelName,
      serialNo: formData.serialNo,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setModels([newModel, ...models]);
    setFilteredModels([newModel, ...filteredModels]);
    setShowAddModal(false);
    resetForm();
    alert("Machine model added successfully!");
  };

  const handleEditModel = () => {
    if (!selectedModel) return;
    if (!formData.machineName || !formData.modelName || !formData.serialNo) {
      alert("Please fill all required fields");
      return;
    }

    const updatedModels = models.map(model => {
      if (model.id === selectedModel.id) {
        return {
          ...model,
          machineName: formData.machineName,
          modelName: formData.modelName,
          serialNo: formData.serialNo
        };
      }
      return model;
    });
    
    // Update serial numbers
    const reindexedModels = updatedModels.map((model, index) => ({
      ...model,
      srNo: index + 1
    }));
    
    setModels(reindexedModels);
    setFilteredModels(reindexedModels);
    setShowEditModal(false);
    resetForm();
    alert("Machine model updated successfully!");
  };

  const handleDeleteModel = () => {
    if (!selectedModel) return;

    const updatedModels = models.filter(m => m.id !== selectedModel.id);
    // Update serial numbers
    const reindexedModels = updatedModels.map((model, index) => ({
      ...model,
      srNo: index + 1
    }));
    
    setModels(reindexedModels);
    setFilteredModels(reindexedModels);
    setShowDeleteConfirm(false);
    setSelectedModel(null);
    alert("Machine model deleted successfully!");
  };

  const openEditModal = (model: MachineModel) => {
    setSelectedModel(model);
    setFormData({
      machineName: model.machineName,
      modelName: model.modelName,
      serialNo: model.serialNo
    });
    setShowEditModal(true);
  };

  const openDeleteConfirm = (model: MachineModel) => {
    setSelectedModel(model);
    setShowDeleteConfirm(true);
  };

  const resetForm = () => {
    setFormData({
      machineName: "",
      modelName: "",
      serialNo: ""
    });
    setSelectedModel(null);
  };

  const applyFilters = () => {
    let filtered = [...models];
    
    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.serialNo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredModels(filtered);
    setCurrentPage(1);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredModels.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredModels.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = ["Sr No.", "Machine Name", "Machine Model", "Machine Serial No."];
    const csvData = filteredModels.map(m => [
      m.srNo,
      m.machineName,
      m.modelName,
      m.serialNo
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "machine-models.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Machine Model</h1>
        <p className="text-gray-600 mt-1">Manage and view all machine models</p>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by machine name, model name or serial no..."
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
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Models Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine Model</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine Serial No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading models...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((model, index) => (
                  <tr key={model.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {indexOfFirstRecord + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {model.machineName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {model.modelName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-black">
                      {model.serialNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openEditModal(model)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(model)}
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
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    No machine models found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredModels.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredModels.length)}</span> of{" "}
              <span className="font-medium">{filteredModels.length}</span> results
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

      {/* Add Machine Model Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Add Machine Model</h2>
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
                    Machine Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.machineName}
                    onChange={(e) => handleInputChange("machineName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Machine Name</option>
                    {machineNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Machine Model Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Machine Model Name"
                    value={formData.modelName}
                    onChange={(e) => handleInputChange("modelName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Machine Serial No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Machine Serial Number"
                    value={formData.serialNo}
                    onChange={(e) => handleInputChange("serialNo", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
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
                onClick={handleAddModel}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Model
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Machine Model Modal */}
      {showEditModal && selectedModel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Edit Machine Model</h2>
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
                    Machine Name <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.machineName}
                    onChange={(e) => handleInputChange("machineName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Machine Name</option>
                    {machineNames.map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Machine Model Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Machine Model Name"
                    value={formData.modelName}
                    onChange={(e) => handleInputChange("modelName", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Machine Serial No. <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Machine Serial Number"
                    value={formData.serialNo}
                    onChange={(e) => handleInputChange("serialNo", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
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
                onClick={handleEditModel}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Update Model
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedModel && (
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
                Are you sure you want to delete this machine model?
              </p>
              <p className="text-center text-sm text-gray-500">
                Machine: <span className="font-semibold">{selectedModel.machineName}</span>
              </p>
              <p className="text-center text-sm text-gray-500">
                Model: {selectedModel.modelName}
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
                onClick={handleDeleteModel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Model
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}