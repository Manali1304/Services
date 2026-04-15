"use client";

import { useState } from "react";
import { Plus, Search, Pencil, Trash2, X, ChevronDown } from "lucide-react";

const STATES_DATA: Record<string, Record<string, string[]>> = {
  "Madhya Pradesh": {
    "Bhopal": ["Bhopal", "Berasia", "Phanda"],
    "Harda": ["Harda", "Timarni", "Khirkiya"],
    "Khargone": ["Khargone", "Bhikangaon", "Barwah"],
    "Ratlam": ["Ratlam", "Sailana", "Jaora"],
  },
  "Maharashtra": {
    "Pune": ["Haveli", "Mulshi", "Maval", "Khed"],
    "Nashik": ["Nashik", "Niphad", "Dindori"],
    "Nagpur": ["Nagpur", "Kamthi", "Hingna"],
    "Solapur": ["North Solapur", "South Solapur", "Barshi"],
  },
  "Karnataka": {
    "Bellary": ["Bellary", "Hagaribommanahalli", "Sandur"],
    "Chitradurga": ["Chitradurga", "Challakere", "Hiriyur"],
    "Raichur": ["Raichur", "Manvi", "Devadurga"],
  },
  "Haryana": {
    "Fatehabad": ["Fatehabad", "Ratia", "Tohana"],
    "Panipat": ["Panipat", "Samalkha", "Israna"],
    "Sonipat": ["Sonipat", "Gohana", "Kharkhoda"],
  },
  "Punjab": {
    "Amritsar": ["Amritsar", "Ajnala", "Baba Bakala"],
    "Barnala": ["Barnala", "Tapa"],
    "Bathinda": ["Bathinda", "Talwandi Sabo", "Rampura Phul"],
    "Gurdaspur": ["Gurdaspur", "Pathankot", "Dhar Kalan"],
  },
  "Arunachal Pradesh": {
    "Changlang": ["Changlang", "Bordumsa", "Diyun"],
    "Anjaw": ["Hawai", "Manchal"],
  },
  "Rajasthan": {
    "Jaipur": ["Jaipur", "Amber", "Chaksu"],
    "Jodhpur": ["Jodhpur", "Bilara", "Luni"],
    "Udaipur": ["Udaipur", "Girwa", "Mavli"],
  },
};

const initialDealers = [
  { id: 1, name: "Sandip Agency MP", address: "-", state: "Madhya Pradesh", districts: ["Bhopal", "Harda", "Khargone"], talukas: ["Harda", "Ratlam"] },
  { id: 2, name: "TESTING",          address: "-", state: "Arunachal Pradesh", districts: ["Changlang", "Anjaw"], talukas: ["Changlang", "Lyngok-Longtoi", "Renuk"] },
  { id: 3, name: "Veer Agro",        address: "-", state: "Karnataka", districts: ["Bellary", "Chitradurga", "Raichur"], talukas: ["Vijaynagar", "Raichur", "Hagaribommanahalli", "Bellary", "Chitradurga", "Bijapur"] },
  { id: 4, name: "Jain Agencies",    address: "-", state: "Haryana", districts: ["Fatehabad", "Panipat", "Sonipat"], talukas: ["Shahbad", "Pehowa", "Thanesar", "Panipat", "Israna", "Samalkha"] },
  { id: 5, name: "Balaji Traders",   address: "-", state: "Punjab", districts: ["Amritsar", "Barnala", "Bathinda", "Gurdaspur"], talukas: ["Dhar Kalan", "Pathankot", "Gurdaspur", "Batala"] },
];

type Dealer = typeof initialDealers[0];

const PER_PAGE_OPTIONS = [10, 25, 50, 100];
const PREVIEW_COUNT = 3;

function truncate(arr: string[]) {
  if (arr.length <= PREVIEW_COUNT) return { shown: arr.join(", "), more: 0 };
  return { shown: arr.slice(0, PREVIEW_COUNT).join(", "), more: arr.length - PREVIEW_COUNT };
}

function MultiSelect({ label, options, selected, onChange, disabled, placeholder }: {
  label: string; options: string[]; selected: string[]; onChange: (v: string[]) => void;
  disabled?: boolean; placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const toggle = (v: string) => {
    onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);
  };
  return (
    <div className="relative">
      <button type="button" onClick={() => !disabled && setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all"
        style={{ border: "1.5px solid #e0e7ff", background: disabled ? "#f8fafc" : "#f8faff", color: disabled ? "#9ca3af" : "#111827", cursor: disabled ? "not-allowed" : "pointer" }}>
        <span className="truncate text-left">
          {selected.length === 0 ? (placeholder || `Select ${label}...`) : selected.join(", ")}
        </span>
        <ChevronDown size={14} color="#6b7280" />
      </button>
      {open && !disabled && (
        <div className="absolute z-50 w-full mt-1 rounded-xl shadow-xl overflow-hidden"
          style={{ background: "#fff", border: "1.5px solid #e0e7ff", maxHeight: 200, overflowY: "auto" }}>
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-indigo-50 transition-colors">
              <input type="checkbox" checked={selected.includes(opt)} onChange={() => toggle(opt)}
                style={{ accentColor: "#6366f1", width: 15, height: 15 }} />
              <span className="text-sm" style={{ color: "#111827" }}>{opt}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DealerPage() {
  const [dealers, setDealers]     = useState<Dealer[]>(initialDealers);
  const [search, setSearch]       = useState("");
  const [perPage, setPerPage]     = useState(50);
  const [showForm, setShowForm]   = useState(false);
  const [editId, setEditId]       = useState<number | null>(null);

  // Form state
  const [fName,      setFName]      = useState("");
  const [fMobiles,   setFMobiles]   = useState("");
  const [fEmails,    setFEmails]    = useState("");
  const [fAddress,   setFAddress]   = useState("");
  const [fStates,    setFStates]    = useState<string[]>([]);
  const [fDistricts, setFDistricts] = useState<string[]>([]);
  const [fTalukas,   setFTalukas]   = useState<string[]>([]);
  const [fError,     setFError]     = useState("");

  // Available districts/talukas based on selected states
  const availableDistricts = fStates.flatMap(st => Object.keys(STATES_DATA[st] || {}));
  const availableTalukas   = fDistricts.flatMap(d => {
    for (const st of fStates) {
      if (STATES_DATA[st]?.[d]) return STATES_DATA[st][d];
    }
    return [];
  });

  const openAdd = () => {
    setEditId(null); setFName(""); setFMobiles(""); setFEmails("");
    setFAddress(""); setFStates([]); setFDistricts([]); setFTalukas([]);
    setFError(""); setShowForm(true);
  };

  const openEdit = (d: Dealer) => {
    setEditId(d.id); setFName(d.name); setFAddress(d.address);
    setFStates([d.state]); setFDistricts(d.districts); setFTalukas(d.talukas);
    setFMobiles(""); setFEmails(""); setFError(""); setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this dealer?")) setDealers(dealers.filter(d => d.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fName.trim())           { setFError("Dealer name is required."); return; }
    if (!fAddress.trim())        { setFError("Address is required."); return; }
    if (fStates.length === 0)    { setFError("Please select at least one state."); return; }
    if (fDistricts.length === 0) { setFError("Please select at least one district."); return; }
    if (fTalukas.length === 0)   { setFError("Please select at least one taluka."); return; }

    if (editId) {
      setDealers(dealers.map(d => d.id === editId
        ? { ...d, name: fName, address: fAddress, state: fStates[0], districts: fDistricts, talukas: fTalukas }
        : d));
    } else {
      const newId = Math.max(...dealers.map(d => d.id), 0) + 1;
      setDealers([...dealers, { id: newId, name: fName, address: fAddress, state: fStates[0], districts: fDistricts, talukas: fTalukas }]);
    }
    setShowForm(false);
  };

  const filtered = dealers.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.state.toLowerCase().includes(search.toLowerCase())
  ).slice(0, perPage);

  const inputCls = "w-full px-4 py-3 rounded-xl text-sm transition-all";
  const inputStyle = { border: "1.5px solid #e0e7ff", background: "#f8faff", color: "#111827", outline: "none" };

  return (
    <div className="flex flex-col h-full">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <h1 className="text-xl font-black" style={{ color: "#111827" }}>Dealer</h1>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 px-6 pb-4 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-1 min-w-[200px] max-w-xs"
          style={{ border: "1.5px solid #e0e7ff", background: "#fff" }}>
          <Search size={15} color="#94a3b8" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search..." className="bg-transparent outline-none text-sm flex-1"
            style={{ color: "#111827" }} />
        </div>

        {/* Per page */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
          style={{ border: "1.5px solid #e0e7ff", background: "#fff" }}>
          <select value={perPage} onChange={e => setPerPage(Number(e.target.value))}
            className="text-sm outline-none bg-transparent" style={{ color: "#111827" }}>
            {PER_PAGE_OPTIONS.map(n => (
              <option key={n} value={n}>{n} Records Per Page</option>
            ))}
          </select>
        </div>

        <div className="flex-1" />

        {/* Add button */}
        <button onClick={openAdd}
          className="flex items-center gap-2 font-bold text-sm text-white px-5 py-2.5 rounded-xl transition-all hover:opacity-90 active:scale-95"
          style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }}>
          <Plus size={16} /> Add
        </button>
      </div>

      {/* ── Table ── */}
      <div className="flex-1 overflow-auto px-6 pb-6">
        <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #e8ecf0" }}>
          <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e8ecf0" }}>
                {["Sr No.", "Name", "Address", "State", "District", "Taluka", "Action"].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left font-black" style={{ color: "#374151", fontSize: 13 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12" style={{ color: "#94a3b8" }}>No dealers found</td></tr>
              ) : filtered.map((d, i) => {
                const dist  = truncate(d.districts);
                const taluk = truncate(d.talukas);
                return (
                  <tr key={d.id} style={{ background: i % 2 === 0 ? "#fff" : "#fafbff", borderBottom: "1px solid #f1f5f9" }}>
                    <td className="px-5 py-4 font-semibold" style={{ color: "#374151" }}>{i + 1}</td>
                    <td className="px-5 py-4 font-semibold" style={{ color: "#111827" }}>{d.name}</td>
                    <td className="px-5 py-4" style={{ color: "#374151" }}>{d.address}</td>
                    <td className="px-5 py-4 font-medium" style={{ color: "#111827" }}>{d.state}</td>
                    <td className="px-5 py-4" style={{ color: "#374151" }}>
                      {dist.shown}{dist.more > 0 && <><br /><span style={{ color: "#6366f1", cursor: "pointer", fontSize: 12 }}>Read More</span></>}
                    </td>
                    <td className="px-5 py-4" style={{ color: "#374151" }}>
                      {taluk.shown}{taluk.more > 0 && <><br /><span style={{ color: "#6366f1", cursor: "pointer", fontSize: 12 }}>Read More</span></>}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(d)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                          style={{ background: "#eef2ff", border: "1px solid #c7d2fe" }}>
                          <Pencil size={14} color="#6366f1" />
                        </button>
                        <button onClick={() => handleDelete(d.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                          style={{ background: "#fff1f2", border: "1px solid #fecdd3" }}>
                          <Trash2 size={14} color="#f43f5e" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="text-xs mt-3" style={{ color: "#94a3b8" }}>
          Showing {filtered.length} of {dealers.length} records
        </p>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(4px)" }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>

          <div className="relative w-full max-w-2xl mx-4 rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: "#fff", maxHeight: "90vh", overflowY: "auto" }}>

            {/* Modal header */}
            <div className="flex items-center justify-between px-7 py-5"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", borderBottom: "1px solid #e0e7ff" }}>
              <div>
                <h2 className="text-lg font-black text-white">{editId ? "Edit Dealer" : "Add Dealer"}</h2>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {editId ? "Update dealer information" : "Fill in details to add a new dealer"}
                </p>
              </div>
              <button onClick={() => setShowForm(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/20"
                style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}>
                <X size={18} color="white" />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">

              {fError && (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm"
                  style={{ background: "#fff1f2", border: "1.5px solid #fda4af", color: "#be123c" }}>
                  <span>⚠</span><span>{fError}</span>
                </div>
              )}

              {/* Dealer Name */}
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: "#111827" }}>
                  Dealer Name <span style={{ color: "#f43f5e" }}>*</span>
                </label>
                <input value={fName} onChange={e => setFName(e.target.value)}
                  placeholder="Enter dealer name" className={inputCls} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = "#6366f1"}
                  onBlur={e => e.target.style.borderColor = "#e0e7ff"} />
              </div>

              {/* Mobile & Email in 2 columns */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: "#111827" }}>Mobile Numbers</label>
                  <input value={fMobiles} onChange={e => setFMobiles(e.target.value)}
                    placeholder="e.g. 9876543210, 9123456789" className={inputCls} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#6366f1"}
                    onBlur={e => e.target.style.borderColor = "#e0e7ff"} />
                  <p className="text-xs mt-1" style={{ color: "#6b7280" }}>Enter one or more numbers separated by commas.</p>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: "#111827" }}>Emails</label>
                  <input value={fEmails} onChange={e => setFEmails(e.target.value)}
                    placeholder="e.g. a@b.com, c@d.com" className={inputCls} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = "#6366f1"}
                    onBlur={e => e.target.style.borderColor = "#e0e7ff"} />
                  <p className="text-xs mt-1" style={{ color: "#6b7280" }}>Enter one or more emails separated by commas.</p>
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: "#111827" }}>
                  Address <span style={{ color: "#f43f5e" }}>*</span>
                </label>
                <textarea value={fAddress} onChange={e => setFAddress(e.target.value)}
                  placeholder="Enter full address" rows={2}
                  className={inputCls} style={{ ...inputStyle, resize: "none" }}
                  onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor = "#6366f1"}
                  onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor = "#e0e7ff"} />
              </div>

              {/* States */}
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: "#111827" }}>
                  States <span style={{ color: "#f43f5e" }}>*</span>
                </label>
                <MultiSelect
                  label="states" options={Object.keys(STATES_DATA)}
                  selected={fStates}
                  onChange={v => { setFStates(v); setFDistricts([]); setFTalukas([]); }}
                  placeholder="Select states..."
                />
              </div>

              {/* Districts */}
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: "#111827" }}>
                  Districts <span style={{ color: "#f43f5e" }}>*</span>
                </label>
                <MultiSelect
                  label="districts" options={availableDistricts}
                  selected={fDistricts}
                  onChange={v => { setFDistricts(v); setFTalukas([]); }}
                  disabled={fStates.length === 0}
                  placeholder={fStates.length === 0 ? "Please select states first" : "Select districts..."}
                />
              </div>

              {/* Talukas */}
              <div>
                <label className="block text-sm font-bold mb-1.5" style={{ color: "#111827" }}>
                  Talukas <span style={{ color: "#f43f5e" }}>*</span>
                </label>
                <MultiSelect
                  label="talukas" options={availableTalukas}
                  selected={fTalukas} onChange={setFTalukas}
                  disabled={fDistricts.length === 0}
                  placeholder={fDistricts.length === 0 ? "Please select districts first" : "Select talukas..."}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  className="flex-1 flex items-center justify-center gap-2 font-black text-sm text-white py-3 rounded-xl transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}>
                  <Plus size={16} />
                  {editId ? "Update Dealer" : "Add Dealer"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-6 font-semibold text-sm rounded-xl transition-all hover:bg-gray-100"
                  style={{ border: "1.5px solid #e2e8f0", color: "#374151" }}>
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}