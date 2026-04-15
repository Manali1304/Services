"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Edit, Trash2, X } from "lucide-react";

interface Slider {
  id: number;
  photos: string[];
  title: string;
  path: string;
  selection: string;
}

export default function SliderPage() {
  const [sliders, setSliders] = useState<Slider[]>([
    {
      id: 1,
      photos: [
        "https://images.openai.com/static-rsc-4/fYCIZQatCKvsPRwvKbdlpdBOiRtgHrg9esc4cTtPPdkpPGPn2JlrVUrAOQxj_vfauV4WJNOJ6TaETssNO_AfP-MPF41AOEOG4DtNrnjbNtDM3yZg2QottYKWvlM_9nY9mtjtHqwymw26y7K8jMmTrCknxbh7LZe7aqfrYfmrUzI?purpose=inline",
        "https://images.openai.com/static-rsc-4/NTmtYsfiRE80BG0hnmo3vTBQh0YQCbtoqohLdK4wUNp6K57t0KSiI0ld-B5Q4K0nAuMEgjnbTuUgs0mEvi3zK2gnaDCfw8wxCSHJ_4D_vu1W-ob-UpSanD873a7CtWtGpGM6XBokq6KlGmTFvr0B7mGlxjjNewGq3R2BX2jvGbc?purpose=inline",
        "https://images.openai.com/static-rsc-4/9ukDV87fER9kYnOm9_MyMPNKr6bjZ4x720xI0dVtzxpFwAh6wqcdFRqix9_YAMi4YPROQ1eLgk1hOKIau-yEQdTCW3Kt0fN1S4cGY_gbVzx0IgcAUOkOWdb73BTEAKqOgEqxlxfZaiF_-SLDe-DY-4GNw9t6FPYCxgQBrQzUR5c?purpose=inline",
      ],
      title: "Advanced Battery Sprayers",
      path: "https://www.mitrasprayer.com/products",
      selection: "Active",
    },
    {
      id: 2,
      photos: [
        "https://img.youtube.com/vi/z5Arg6U-j6s/maxresdefault.jpg",
        "https://images.openai.com/static-rsc-4/UqLlNJHFngwhaw8-dlqV2a8uIlmZXqCpIECKlKWDgb4pkgvcNiQWawZz68ASCa462uoiL33YKTZ8Ax8_vXZON6X-Llv_eGw5r__qzetYwMEjzzOTzqoLJ1973kB2nPjF981qex8JPMVlgvFaRBIxwCR_qSqjQzrcZtaF8wdXc4VD9u1cJoXNtwpDzYocASbN?purpose=fullsize",
        "https://images.openai.com/static-rsc-4/Pq5iT9OZ-gUF4eJRgdLgrUQELTGZDcyajQM-60ZnPhYJQJNyKk-ilywXAdvBHtMwfrP9VPz29fX2dx3xzUu7qq0sSdbubWt4VGahqVzYdJ-lsVtUqRgRzvklIwerKyF8bMsZzFOEdyV3v5jKoQoFvdgPzJVSz81uvqB7HQMFkQsoYgW-1NJaJ1ZLbfRmSVhH?purpose=fullsize",
      ],
      title: "Watch Product Demo",
      path: "https://youtu.be/z5Arg6U-j6s",
      selection: "Active",
    },
    {
      id: 3,
      photos: [
        "https://images.openai.com/static-rsc-4/etcEfsdz3RBVwDqirn5CPvzuCBGt0PUDvsKlQpNbix3kvBo-K-MBdu0r33bgwnrT7xIrOjTPs4ldEtaEDaWUu5w5V6MIkTdrXwZEjy2LPFwHCkGprYsvRmp1eWkeBk9sO84o_we89mSNI5JXPm69NbpxVPwC2deM0HBdFz2DxiU?purpose=inline",
        "https://images.openai.com/static-rsc-4/PXl3MYmYjyDQpfK0a6pydQlUzEJinDsBMP9m7M2ttY3meX9zyNmFeV2sNEPa8yQQFLicaqMARDcup7hx9iQCtAnoURpdnzWTwKm8uEGVKmvyz47M4V26HjFaODXViSKL0UYAo7OGfvoROlwFbdwiVE2ui3l36O-QA2Xdyj9G7bY?purpose=inline",
        "https://images.openai.com/static-rsc-4/GGVRrpI0K4wXYqHnf0T3GBjyZjHHGsFGC7a_GMbF3wyzPORZP-1dOpEqnrEoJdbPQ8NSM2Hee_KoW-OXmkdHHskz_0Cku4jkhYW9hse-h5zU4_5QSLxVDFcd4UNORd7AswaF7qfqApmDm6_mn94KFIFpYGiAd-BV8eGVu_JCC9F3TMumvWD3aGnyhYPTMRdd?purpose=fullsize",
      ],
      title: "Government Subsidy Available",
      path: "https://www.mitrasprayer.com/subsidy",
      selection: "Active",
    },
    {
      id: 4,
      photos: [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        "https://images.unsplash.com/photo-1471193945509-9ad0617afabf",
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
      ],
      title: "Doorstep Service Support",
      path: "https://www.mitrasprayer.com/service",
      selection: "Active",
    },
    {
      id: 5,
      photos: [
        "https://images.openai.com/static-rsc-4/GBLQ7_2Nw0t1LwEGW3TfAUAZ7NrPA6EyO-o_g9FbGizOlo51qZBmd_rWFTqm88XV11hl3uTr6kdp12_2g3SN-iQztiGJ2KG0X5E8Pymr_bHlDN2o0PMQVIoj7IaCpDF7Ugi_YqBKf6kO1sELgG9CImsBBTKpI9TfW2C5MvEbbCY?purpose=inline",
        "https://images.unsplash.com/photo-1500595046743-cd271d694d30",
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399",
      ],
      title: "New Launch: Airotec Turbo",
      path: "https://www.mitrasprayer.com",
      selection: "Active",
    },
    {
      id: 6,
      photos: [
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
        "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      ],
      title: "Find Nearest Dealer",
      path: "https://www.mitrasprayer.com/contact",
      selection: "Inactive",
    },
  ]);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverImageIndex, setHoverImageIndex] = useState(0);

  const [selectedSlider, setSelectedSlider] = useState<Slider | null>(null);
  const [modalIndex, setModalIndex] = useState(0);

  // 🔥 Hover slideshow effect
  useEffect(() => {
    if (hoverIndex === null) return;

    const interval = setInterval(() => {
      setHoverImageIndex((prev) => (prev + 1) % 3);
    }, 1000);

    return () => clearInterval(interval);
  }, [hoverIndex]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Slider List</h1>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Sr. No.</th>
              <th className="p-3">Preview</th>
              <th className="p-3">Title</th>
              <th className="p-3">Path</th>
              <th className="p-3">Selection</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {sliders.map((item, index) => (
              <tr key={item.id} className="border-t">
                
                <td className="p-3">{index + 1}</td>

                {/* 🔥 Hover Preview */}
                <td className="p-3">
                  <div
                    className="relative w-40 h-24 cursor-pointer rounded overflow-hidden"
                    onMouseEnter={() => {
                      setHoverIndex(index);
                      setHoverImageIndex(0);
                    }}
                    onMouseLeave={() => setHoverIndex(null)}
                    onClick={() => {
                      setSelectedSlider(item);
                      setModalIndex(0);
                    }}
                  >
                    <Image
                      src={
                        hoverIndex === index
                          ? item.photos[hoverImageIndex]
                          : item.photos[0]
                      }
                      alt="slider"
                      fill
                      className="object-cover transition duration-500"
                      unoptimized
                    />

                    <div className="absolute inset-0 bg-black/20 flex items-end p-2">
                      <span className="text-white text-xs">
                        Hover / Click
                      </span>
                    </div>
                  </div>
                </td>

                <td className="p-3 font-medium">{item.title}</td>

                <td className="p-3 text-blue-600 break-all">
                  {item.path}
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      item.selection === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {item.selection}
                  </span>
                </td>

                <td className="p-3 flex gap-2">
                  <Edit size={18} className="text-blue-600" />
                  <Trash2 size={18} className="text-red-600" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL */}
      {selectedSlider && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-xl w-[600px] relative">
            
            {/* Close */}
            <button
              onClick={() => setSelectedSlider(null)}
              className="absolute top-3 right-3"
            >
              <X />
            </button>

            {/* Image */}
            <div className="relative w-full h-80 mb-4 rounded overflow-hidden">
              <Image
                src={selectedSlider.photos[modalIndex]}
                alt="preview"
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-2">
              {selectedSlider.title}
            </h2>

            {/* Controls */}
            <div className="flex justify-between">
              <button
                onClick={() =>
                  setModalIndex(
                    (modalIndex - 1 + selectedSlider.photos.length) %
                      selectedSlider.photos.length
                  )
                }
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Prev
              </button>

              <button
                onClick={() =>
                  setModalIndex(
                    (modalIndex + 1) % selectedSlider.photos.length
                  )
                }
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}