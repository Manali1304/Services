// app/manage-machines/page.tsx
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

interface Machine {
  id: number;
  srNo: number;
  name: string;
  type: string;
  photo: string | null;
  createdAt: string;
}

export default function ManageMachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [filteredMachines, setFilteredMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fullScreenImage, setFullScreenImage] = useState<string | null>(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    photo: null as File | null
  });

  useEffect(() => {
    fetchMachines();
  }, []);

  const fetchMachines = async () => {
    setLoading(true);
    try {
      const mockMachines: Machine[] = [
        {
          id: 1,
          srNo: 1,
          name: "GRAPEMASTER",
          type: "GRAPEMASTER ECO",
          photo: "/machines/Grapemaster.jpg",
          createdAt: "2024-01-15"
        },
        {
          id: 2,
          srNo: 2,
          name: "OCTOPUS",
          type: "Weed Cutter",
          photo: "/machines/octopus.jpg",
          createdAt: "2024-01-20"
        },
        {
          id: 3,
          srNo: 3,
          name: "RACE",
          type: "",
          photo: "/machines/race.jpg",
          createdAt: "2024-02-01"
        },
        {
          id: 4,
          srNo: 4,
          name: "FARMFIT",
          type: "",
          photo: "/machines/farmfit.jpg",
          createdAt: "2024-02-10"
        },
        {
          id: 5,
          srNo: 5,
          name: "ROTOMASTER",
          type: "",
          photo: "/machines/rotomaster.jpg",
          createdAt: "2024-02-15"
        },
        {
          id: 6,
          srNo: 6,
          name: "CROPMASTER",
          type: "",
          photo: "/machines/cropmaster.jpg",
          createdAt: "2024-02-20"
        },
        {
          id: 7,
          srNo: 7,
          name: "DUSTER",
          type: "",
          photo: "/machines/duster.jpg",
          createdAt: "2024-02-25"
        },
        {
          id: 8,
          srNo: 8,
          name: "POWERAXE",
          type: "Wood Cipper",
          photo: "/machines/power.jpg",
          createdAt: "2024-03-01"
        },
        {
          id: 9,
          srNo: 9,
          name: "BULLET",
          type: "BULLET 550",
          photo: "/machines/bullet.jpg",
          createdAt: "2024-03-05"
        },
        {
          id: 10,
          srNo: 10,
          name: "AIROTEC",
          type: "",
          photo: "/machines/airotec.jpg",
          createdAt: "2024-03-10"
        }
      ];
      
      setMachines(mockMachines);
      setFilteredMachines(mockMachines);
    } catch (error) {
      console.error("Error fetching machines:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const handleAddMachine = async () => {
    if (!formData.name) {
      alert("Please enter machine name");
      return;
    }

    try {
      const newMachine: Machine = {
        id: machines.length + 1,
        srNo: machines.length + 1,
        name: formData.name,
        type: formData.type,
        photo: previewImage,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setMachines([newMachine, ...machines]);
      setFilteredMachines([newMachine, ...filteredMachines]);
      setShowAddModal(false);
      resetForm();
      alert("Machine added successfully!");
    } catch (error) {
      console.error("Error adding machine:", error);
      alert("Failed to add machine");
    }
  };

  const handleEditMachine = async () => {
    if (!selectedMachine) return;
    if (!formData.name) {
      alert("Please enter machine name");
      return;
    }

    try {
      const updatedMachines = machines.map(machine => {
        if (machine.id === selectedMachine.id) {
          return {
            ...machine,
            name: formData.name,
            type: formData.type,
            photo: previewImage || machine.photo
          };
        }
        return machine;
      });
      
      setMachines(updatedMachines);
      setFilteredMachines(updatedMachines);
      setShowEditModal(false);
      resetForm();
      alert("Machine updated successfully!");
    } catch (error) {
      console.error("Error updating machine:", error);
      alert("Failed to update machine");
    }
  };

  const handleDeleteMachine = async () => {
    if (!selectedMachine) return;

    try {
      const updatedMachines = machines.filter(m => m.id !== selectedMachine.id);
      setMachines(updatedMachines);
      setFilteredMachines(updatedMachines);
      setShowDeleteConfirm(false);
      setSelectedMachine(null);
      alert("Machine deleted successfully!");
    } catch (error) {
      console.error("Error deleting machine:", error);
      alert("Failed to delete machine");
    }
  };

  const openEditModal = (machine: Machine) => {
    setSelectedMachine(machine);
    setFormData({
      name: machine.name,
      type: machine.type || "",
      photo: null
    });
    setPreviewImage(machine.photo);
    setShowEditModal(true);
  };

  const openDeleteConfirm = (machine: Machine) => {
    setSelectedMachine(machine);
    setShowDeleteConfirm(true);
  };

  const openImageFullScreen = (imageUrl: string) => {
    setFullScreenImage(imageUrl);
    setShowImageModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      photo: null
    });
    setPreviewImage(null);
    setSelectedMachine(null);
  };

  const applyFilters = () => {
    let filtered = [...machines];
    
    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredMachines(filtered);
    setCurrentPage(1);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredMachines.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredMachines.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = ["Sr No.", "Name", "Type"];
    const csvData = filteredMachines.map(m => [
      m.srNo,
      m.name,
      m.type
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "machines.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">All Machine List</h1>
        <p className="text-gray-600 mt-1">Manage and view all machine details</p>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by machine name or type..."
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
              Add Machine
            </button>
          </div>
        </div>
      </div>

      {/* Machines Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Photo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
               </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading machines...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((machine, index) => (
                  <tr key={machine.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {indexOfFirstRecord + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {machine.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {machine.type || "---"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {machine.photo ? (
                        <div className="relative group">
                          <img 
                            src={machine.photo} 
                            alt={machine.name} 
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => openImageFullScreen(machine.photo!)}
                          />
                          <button
                            onClick={() => openImageFullScreen(machine.photo!)}
                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg transition-all flex items-center justify-center"
                          >
                            <Maximize2 size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon size={32} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openEditModal(machine)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(machine)}
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
              Click anywhere to close • Click image to zoom
            </p>
          </div>
        </div>
      )}

      {/* Add Machine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Add Machine</h2>
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
                  <input
                    type="text"
                    placeholder="Enter Machine Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Machine Type
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Machine Type"
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Machine Photo
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="machine-photo"
                    />
                    <label
                      htmlFor="machine-photo"
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

      {/* Edit Machine Modal */}
      {showEditModal && selectedMachine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Update Machine</h2>
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
                  <input
                    type="text"
                    placeholder="Enter Machine Name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Machine Type
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Machine Type"
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Machine Photo
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                      id="edit-machine-photo"
                    />
                    <label
                      htmlFor="edit-machine-photo"
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
                  {!previewImage && selectedMachine.photo && (
                    <div className="mt-3">
                      <img src={selectedMachine.photo} alt="Current" className="w-20 h-20 object-cover rounded border" />
                      <p className="text-xs text-gray-400 mt-1">Current image</p>
                    </div>
                  )}
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
                onClick={handleEditMachine}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Update Machine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedMachine && (
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
                Are you sure you want to delete this machine?
              </p>
              <p className="text-center text-sm text-gray-500">
                Machine: <span className="font-semibold">{selectedMachine.name}</span>
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
                onClick={handleDeleteMachine}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Machine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}