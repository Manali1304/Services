// app/settings/app-version/page.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Edit, 
  Save, 
  X,
  Smartphone,
  RefreshCw,
  ExternalLink,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface AppVersion {
  id: number;
  srNo: number;
  type: string;
  version: string;
  link: string;
  forcefullUpdate: string;
  lastUpdated: string;
  status: string;
}

// Mock data for app versions with real links from the URLs
const mockAppVersions: AppVersion[] = [
  {
    id: 1,
    srNo: 1,
    type: "android",
    version: "1.0.7",
    link: "https://play.google.com/store/apps/details?id=com.applicationsquare.mitraer",
    forcefullUpdate: "No",
    lastUpdated: "2026-02-27",
    status: "Active"
  },
  {
    id: 2,
    srNo: 2,
    type: "ios",
    version: "1.0.7",
    link: "https://apps.apple.com/us/app/mitra-service-engineer/id6746126626",
    forcefullUpdate: "No",
    lastUpdated: "2026-02-27",
    status: "Active"
  },
  {
    id: 3,
    srNo: 3,
    type: "customer android",
    version: "1.0.5",
    link: "https://play.google.com/store/apps/details?id=com.applicationsquare.mitracustomer",
    forcefullUpdate: "No",
    lastUpdated: "2026-03-12",
    status: "Active"
  },
  {
    id: 4,
    srNo: 4,
    type: "customer ios",
    version: "1.0.5",
    link: "https://apps.apple.com/in/app/mitra-agro-customer-app/id6746127621",
    forcefullUpdate: "No",
    lastUpdated: "2026-03-11",
    status: "Active"
  }
];

export default function AppVersionPage() {
  const [versions, setVersions] = useState<AppVersion[]>([]);
  const [filteredVersions, setFilteredVersions] = useState<AppVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<AppVersion | null>(null);
  
  // Edit form data
  const [editFormData, setEditFormData] = useState({
    version: "",
    link: "",
    forcefullUpdate: "No"
  });

  useEffect(() => {
    fetchVersions();
  }, []);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      setVersions(mockAppVersions);
      setFilteredVersions(mockAppVersions);
    } catch (error) {
      console.error("Error fetching app versions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    let filtered = [...versions];
    
    if (searchTerm) {
      filtered = filtered.filter(v => 
        v.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.version.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredVersions(filtered);
    setCurrentPage(1);
  };

  const resetSearch = () => {
    setSearchTerm("");
    setFilteredVersions(versions);
    setCurrentPage(1);
  };

  const openEditModal = (version: AppVersion) => {
    setSelectedVersion(version);
    setEditFormData({
      version: version.version,
      link: version.link,
      forcefullUpdate: version.forcefullUpdate
    });
    setShowEditModal(true);
  };

  const handleUpdateVersion = () => {
    if (!selectedVersion) return;
    
    const updatedVersions = versions.map(v => {
      if (v.id === selectedVersion.id) {
        return {
          ...v,
          version: editFormData.version,
          link: editFormData.link,
          forcefullUpdate: editFormData.forcefullUpdate,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return v;
    });
    
    setVersions(updatedVersions);
    setFilteredVersions(updatedVersions);
    setShowEditModal(false);
    alert("App version updated successfully!");
  };

  // Pagination calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredVersions.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredVersions.length / recordsPerPage);

  const exportToCSV = () => {
    const headers = ["Sr. No.", "Type", "Version", "Link", "Forcefull Update", "Last Updated", "Status"];
    const csvData = filteredVersions.map(v => [
      v.srNo,
      v.type,
      v.version,
      v.link,
      v.forcefullUpdate,
      v.lastUpdated,
      v.status
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "app-versions.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getPlatformIcon = (type: string) => {
    if (type.includes("android")) {
      return (
        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-green-600">A</span>
        </div>
      );
    } else if (type.includes("ios")) {
      return (
        <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-gray-600">i</span>
        </div>
      );
    }
    return (
      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
        <Smartphone size={14} className="text-blue-600" />
      </div>
    );
  };

  const getForcefullUpdateBadge = (value: string) => {
    if (value === "Yes") {
      return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Yes</span>;
    }
    return <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">No</span>;
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-black">App Version</h1>
        <p className="text-gray-600 mt-1">Manage mobile application versions and update settings</p>
      </div>

      {/* Search and Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by app type or version..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] focus:border-transparent text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors"
            >
              Apply
            </button>
            <button
              onClick={resetSearch}
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
          </div>
        </div>
      </div>

      {/* App Versions Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sr. No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Version</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Link</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forcefull Update</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2e7d32]"></div>
                      <span className="ml-2">Loading app versions...</span>
                    </div>
                  </td>
                </tr>
              ) : currentRecords.length > 0 ? (
                currentRecords.map((version) => (
                  <tr key={version.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {version.srNo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {getPlatformIcon(version.type)}
                        <span className="capitalize font-medium text-black">{version.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-black">
                      {version.version}
                    </td>
                    <td className="px-6 py-4 text-sm text-black max-w-xs">
                      <a 
                        href={version.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 truncate"
                      >
                        {version.link.length > 50 ? version.link.substring(0, 50) + "..." : version.link}
                        <ExternalLink size={14} />
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getForcefullUpdateBadge(version.forcefullUpdate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {new Date(version.lastUpdated).toLocaleDateString('en-GB')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {version.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => openEditModal(version)}
                        className="text-blue-600 hover:text-blue-900 transition-colors flex items-center gap-1"
                      >
                        <Edit size={16} />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Smartphone size={48} className="text-gray-300 mb-3" />
                      <p className="text-gray-500 text-lg">No App Versions Found</p>
                      <p className="text-gray-400 text-sm mt-1">No app version records available</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredVersions.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-black">
              Showing <span className="font-medium">{indexOfFirstRecord + 1}</span> to{" "}
              <span className="font-medium">{Math.min(indexOfLastRecord, filteredVersions.length)}</span> of{" "}
              <span className="font-medium">{filteredVersions.length}</span> results
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

      {/* Edit App Version Modal */}
      {showEditModal && selectedVersion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black">Edit App Version</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    App Type
                  </label>
                  <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {getPlatformIcon(selectedVersion.type)}
                    <span className="text-black capitalize">{selectedVersion.type}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Version <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 1.0.7"
                    value={editFormData.version}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, version: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    App Store Link <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://play.google.com/store/apps/..."
                    value={editFormData.link}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, link: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Google Play Store or Apple App Store link
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Forcefull Update
                  </label>
                  <select
                    value={editFormData.forcefullUpdate}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, forcefullUpdate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2e7d32] text-black"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                  <p className="text-xs text-gray-400 mt-1">
                    If "Yes", users will be forced to update the app
                  </p>
                </div>
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
                onClick={handleUpdateVersion}
                className="px-4 py-2 bg-[#2e7d32] text-white rounded-lg hover:bg-[#1b5e20] transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Update Version
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}