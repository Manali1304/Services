// app/mobile-setting/media/page.tsx
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
  Play,
  Youtube,
  Eye
} from "lucide-react";

interface Media {
  id: number;
  srNo: number;
  machinePart: string;
  videoCategory: string;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  selection: string;
  createdAt: string;
}

// Real video links from MITRA website and YouTube
const mockMedia: Media[] = [
  {
    id: 1,
    srNo: 1,
    machinePart: "DUSTER",
    videoCategory: "Common",
    title: "MITRA's New 800L Compact for Orchard",
    videoUrl: "https://youtu.be/z5Arg6U-j6s",
    thumbnail: "https://img.youtube.com/vi/z5Arg6U-j6s/maxresdefault.jpg",
    selection: "Active",
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    srNo: 2,
    machinePart: "DUSTER",
    videoCategory: "Common",
    title: "Mitra Sprayer Machine",
    videoUrl: "https://www.youtube.com/watch?v=z5Arg6U-j6s",
    thumbnail: "https://img.youtube.com/vi/z5Arg6U-j6s/maxresdefault.jpg",
    selection: "Active",
    createdAt: "2024-01-20"
  },
  {
    id: 3,
    srNo: 3,
    machinePart: "DUSTER",
    videoCategory: "Common",
    title: "MITRA Airotec 600L Product Service Tips",
    videoUrl: "https://www.youtube.com/watch?v=z5Arg6U-j6s",
    thumbnail: "https://img.youtube.com/vi/z5Arg6U-j6s/maxresdefault.jpg",
    selection: "Active",
    createdAt: "2024-02-01"
  },
  {
    id: 4,
    srNo: 4,
    machinePart: "No Parts",
    videoCategory: "Wheel Axe Scrapper",
    title: "Guide to Wheel Axle Scrapper Overhaul",
    videoUrl: "https://www.youtube.com/watch?v=z5Arg6U-j6s",
    thumbnail: "https://img.youtube.com/vi/z5Arg6U-j6s/maxresdefault.jpg",
    selection: "Active",
    createdAt: "2024-02-10"
  },
  {
    id: 5,
    srNo: 5,
    machinePart: "No Parts",
    videoCategory: "Pump",
    title: "Pump Overhaul IIC",
    videoUrl: "https://www.youtube.com/watch?v=z5Arg6U-j6s",
    thumbnail: "https://img.youtube.com/vi/z5Arg6U-j6s/maxresdefault.jpg",
    selection: "Active",
    createdAt: "2024-02-15"
  },
  {
    id: 6,
    srNo: 6,
    machinePart: "No Parts",
    videoCategory: "Pump",
    title: "Pump Overhaul MF",
    videoUrl: "https://www.youtube.com/watch?v=z5Arg6U-j6s",
    thumbnail: "https://img.youtube.com/vi/z5Arg6U-j6s/maxresdefault.jpg",
    selection: "Active",
    createdAt: "2024-02-20"
  },
  {
    id: 7,
    srNo: 7,
    machinePart: "No Parts",
    videoCategory: "Nozzles",
    title: "Guide to Nozzle Overhaul",
    videoUrl: "https://www.youtube.com/watch?v=z5Arg6U-j6s",
    thumbnail: "https://img.youtube.com/vi/z5Arg6U-j6s/maxresdefault.jpg",
    selection: "Active",
    createdAt: "2024-02-25"
  },
  {
    id: 8,
    srNo: 8,
    machinePart: "N/A",
    videoCategory: "Installation and Testing",
    title: "Airotec Series Installation Testing",
    videoUrl: "https://www.youtube.com/watch?v=z5Arg6U-j6s",
    thumbnail: "https://img.youtube.com/vi/z5Arg6U-j6s/maxresdefault.jpg",
    selection: "Active",
    createdAt: "2024-03-01"
  },
  {
    id: 9,
    srNo: 9,
    machinePart: "No Parts",
    videoCategory: "Filter",
    title: "Cleaning Suction and Line filters",
    videoUrl: "https://www.youtube.com/watch?v=z5Arg6U-j6s",
    thumbnail: "https://img.youtube.com/vi/z5Arg6U-j6s/maxresdefault.jpg",
    selection: "Active",
    createdAt: "2024-03-05"
  },
  {
    id: 10,
    srNo: 10,
    machinePart: "No Parts",
    videoCategory: "Controller",
    title: "Guide to Controller Overhaul",
    videoUrl: "https://www.youtube.com/watch?v=z5Arg6U-j6s",
    thumbnail: "https://img.youtube.com/vi/z5Arg6U-j6s/maxresdefault.jpg",
    selection: "Active",
    createdAt: "2024-03-10"
  },
  {
    id: 11,
    srNo: 11,
    machinePart: "AIROTEC",
    videoCategory: "Product Demo",
    title: "AIROTEC Turbo 600 Complete Guide",
    videoUrl: "https://www.youtube.com/watch?v=z5Arg6U-j6s",
    thumbnail: "https://img.youtube.com/vi/z5Arg6U-j6s/maxresdefault.jpg",
    selection: "Active",
    createdAt: "2024-03-15"
  }
];

// Categories for dropdown
const categories = ["Common", "Product Demo", "Maintenance", "Service Tips", "Wheel Axe Scrapper", "Installation Guide", "Pump", "Nozzles", "Filter", "Controller", "Installation and Testing"];
const machineParts = ["DUSTER", "AIROTEC", "RACE", "SWARAJ", "FARMFIT", "CROPMASTER", "No Parts", "N/A"];
const selectionOptions = ["Active", "Inactive"];

export default function MediaListPage() {
  const [media, setMedia] = useState<Media[]>([]);
  const [filteredMedia, setFilteredMedia] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    machinePart: "",
    videoCategory: "",
    title: "",
    videoUrl: "",
    selection: "Active",
    thumbnail: null as File | null
  });

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      setMedia(mockMedia);
      setFilteredMedia(mockMedia);
    } catch (error) {
      console.error("Error fetching media:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate thumbnail from YouTube URL
    if (field === "videoUrl" && value.includes("youtu")) {
      const videoId = extractYouTubeId(value);
      if (videoId) {
        setPreviewImage(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
      }
    }
  };

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      
      if (!validTypes.includes(file.type)) {
        alert("Only jpg, png, jpeg files are accepted");
        return;
      }
      
      setFormData(prev => ({ ...prev, thumbnail: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMedia = () => {
    if (!formData.machinePart || !formData.videoCategory || !formData.title || !formData.videoUrl) {
      alert("Please fill all required fields");
      return;
    }

    const videoId = extractYouTubeId(formData.videoUrl);
    const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : previewImage;

    const newMedia: Media = {
      id: media.length + 1,
      srNo: media.length + 1,
      machinePart: formData.machinePart,
      videoCategory: formData.videoCategory,
      title: formData.title,
      videoUrl: formData.videoUrl,
      thumbnail: thumbnail || previewImage,
      selection: formData.selection,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    setMedia([newMedia, ...media]);
    setFilteredMedia([newMedia, ...filteredMedia]);
    setShowAddModal(false);
    resetForm();
    alert("Media added successfully!");
  };

  const handleEditMedia = () => {
    if (!selectedMedia) return;
    if (!formData.machinePart || !formData.videoCategory || !formData.title || !formData.videoUrl) {
      alert("Please fill all required fields");
      return;
    }

    const videoId = extractYouTubeId(formData.videoUrl);
    const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : previewImage;

    const updatedMedia = media.map(item => {
      if (item.id === selectedMedia.id) {
        return {
          ...item,
          machinePart: formData.machinePart,
          videoCategory: formData.videoCategory,
          title: formData.title,
          videoUrl: formData.videoUrl,
          thumbnail: thumbnail || item.thumbnail,
          selection: formData.selection
        };
      }
      return item;
    });
    
    const reindexedMedia = updatedMedia.map((item, idx) => ({
      ...item,
      srNo: idx + 1
    }));
    
    setMedia(reindexedMedia);
    setFilteredMedia(reindexedMedia);
    setShowEditModal(false);
    resetForm();
    alert("Media updated successfully!");
  };

  const handleDeleteMedia = () => {
    if (!selectedMedia) return;

    const updatedMedia = media.filter(m => m.id !== selectedMedia.id);
    const reindexedMedia = updatedMedia.map((item, idx) => ({
      ...item,
      srNo: idx + 1
    }));
    
    setMedia(reindexedMedia);
    setFilteredMedia(reindexedMedia);
    setShowDeleteConfirm(false);
    setSelectedMedia(null);
    alert("Media deleted successfully!");
  };

  const openEditModal = (item: Media) => {
    setSelectedMedia(item);
    setFormData({
      machinePart: item.machinePart,
      videoCategory: item.videoCategory,
      title: item.title,
      videoUrl: item.videoUrl,
      selection: item.selection,
      thumbnail: null
    });
    setPreviewImage(item.thumbnail);
    setShowEditModal(true);
  };

  const openDeleteConfirm = (item: Media) => {
    setSelectedMedia(item);
    setShowDeleteConfirm(true);
  };

  const openVideoModal = (item: Media) => {
    setSelectedMedia(item);
    setShowVideoModal(true);
  };

  const resetForm = () => {
    setFormData({
      machinePart: "",
      videoCategory: "",
      title: "",
      videoUrl: "",
      selection: "Active",
      thumbnail: null
    });
    setPreviewImage(null);
    setSelectedMedia(null);
  };

  const applyFilters = () => {
    let filtered = [...media];
    
    if (searchTerm) {
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.machinePart.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.videoCategory.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredMedia(filtered);
    setCurrentPage(1);
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredMedia.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredMedia.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = ["Sr No.", "Machine/Part", "Video Category", "Title", "Selection"];
    const csvData = filteredMedia.map(m => [
      m.srNo,
      m.machinePart,
      m.videoCategory,
      m.title,
      m.selection
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "media-list.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : url;
  };

  const getSelectionColor = (selection: string) => {
    return selection === "Active" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">Media List</h1>
        <p className="text-gray-600 mt-1">Manage tutorial videos and promotional content</p>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by title, machine part or category..."
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
              Add Media
            </button>
          </div>
        </div>
      </div>

      {/* Media Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine/Part</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Video Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Videos</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Selection</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
               </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading media...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-black">
                      {item.srNo}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {item.machinePart}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-black">
                      {item.videoCategory}
                    </td>
                    <td className="px-4 py-4 text-sm text-black max-w-xs">
                      {item.title}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div 
                        className="relative group cursor-pointer"
                        onClick={() => openVideoModal(item)}
                      >
                        <img 
                          src={item.thumbnail || "https://placehold.co/320x180/e2e8f0/64748b?text=No+Thumbnail"} 
                          alt={item.title}
                          className="w-48 h-28 object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-200"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-60 rounded-lg transition-all flex items-center justify-center">
                          <Play size={32} className="text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getSelectionColor(item.selection)}`}>
                        {item.selection}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openEditModal(item)}
                        className="text-blue-600 hover:text-blue-900 mr-3 transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(item)}
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
                    No media found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredMedia.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredMedia.length)}</span> of{" "}
              <span className="font-medium">{filteredMedia.length}</span> results
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

      {/* Video Player Modal */}
      {showVideoModal && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50">
          <div className="relative w-full max-w-5xl p-4">
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X size={32} />
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                src={getYouTubeEmbedUrl(selectedMedia.videoUrl)}
                title={selectedMedia.title}
                className="absolute inset-0 w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            <h3 className="text-white text-lg font-semibold mt-4 text-center">{selectedMedia.title}</h3>
          </div>
        </div>
      )}

      {/* Add Media Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-black">Add Media</h2>
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
                    Machine/Part <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.machinePart}
                    onChange={(e) => handleInputChange("machinePart", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Machine/Part</option>
                    {machineParts.map(part => (
                      <option key={part} value={part}>{part}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Video Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.videoCategory}
                    onChange={(e) => handleInputChange("videoCategory", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter video title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Video URL (YouTube) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtu.be/... or https://www.youtube.com/..."
                    value={formData.videoUrl}
                    onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Paste YouTube video link (e.g., https://youtu.be/z5Arg6U-j6s)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Selection Status
                  </label>
                  <select
                    value={formData.selection}
                    onChange={(e) => handleInputChange("selection", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    {selectionOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {previewImage && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Thumbnail Preview
                    </label>
                    <img src={previewImage} alt="Thumbnail" className="w-full max-h-40 object-cover rounded-lg border" />
                  </div>
                )}
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
                onClick={handleAddMedia}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save Media
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Media Modal */}
      {showEditModal && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-black">Edit Media</h2>
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
                    Machine/Part <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.machinePart}
                    onChange={(e) => handleInputChange("machinePart", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Machine/Part</option>
                    {machineParts.map(part => (
                      <option key={part} value={part}>{part}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Video Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.videoCategory}
                    onChange={(e) => handleInputChange("videoCategory", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter video title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Video URL (YouTube) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtu.be/... or https://www.youtube.com/..."
                    value={formData.videoUrl}
                    onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Paste YouTube video link
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Selection Status
                  </label>
                  <select
                    value={formData.selection}
                    onChange={(e) => handleInputChange("selection", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    {selectionOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {previewImage && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Thumbnail Preview
                    </label>
                    <img src={previewImage} alt="Thumbnail" className="w-full max-h-40 object-cover rounded-lg border" />
                  </div>
                )}
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
                onClick={handleEditMedia}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Update Media
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedMedia && (
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
                Are you sure you want to delete this media?
              </p>
              <p className="text-center text-sm text-gray-500">
                Title: <span className="font-semibold">{selectedMedia.title}</span>
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
                onClick={handleDeleteMedia}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={18} />
                Delete Media
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}