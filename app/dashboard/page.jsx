"use client";

import { useState, useEffect } from "react";

// Contoh data layanan (nanti bisa diambil dari Firestore / API Provider)
const SERVICES_DATA = [
  { id: "1", name: "Instagram Followers Real [Garansi 30 Hari]", category: "Instagram", pricePer1k: 15000, min: 100, max: 10000, providerServiceId: "101" },
  { id: "2", name: "Instagram Likes Fast [Maks 50k]", category: "Instagram", pricePer1k: 5000, min: 50, max: 50000, providerServiceId: "102" },
  { id: "3", name: "TikTok Views High Speed", category: "TikTok", pricePer1k: 1000, min: 1000, max: 1000000, providerServiceId: "201" },
];

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("Instagram");
  const [selectedService, setSelectedService] = useState(SERVICES_DATA[0]);
  const [targetLink, setTargetLink] = useState("");
  const [quantity, setQuantity] = useState(SERVICES_DATA[0].min);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Filter layanan berdasarkan kategori
  const filteredServices = SERVICES_DATA.filter((s) => s.category === selectedCategory);

  // Ganti layanan default saat kategori berubah
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    const firstService = SERVICES_DATA.find((s) => s.category === cat);
    if (firstService) {
      setSelectedService(firstService);
      setQuantity(firstService.min);
    }
  };

  // Hitung otomatis total harga saat jumlah atau layanan berubah
  useEffect(() => {
    if (selectedService && quantity) {
      const price = (quantity / 1000) * selectedService.pricePer1k;
      setTotalPrice(price);
    }
  }, [quantity, selectedService]);

  // Submit Order
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "USER_ID_DARI_FIREBASE_AUTH", // Ganti dengan ID user yang sedang login
          serviceId: selectedService.id,
          providerServiceId: selectedService.providerServiceId,
          link: targetLink,
          quantity: Number(quantity),
          price: totalPrice,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Gagal membuat pesanan");

      setMessage({ type: "success", text: `Pesanan berhasil! ID Order: ${data.orderId}` });
      setTargetLink("");
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM PEMESANAN */}
        <div className="lg:col-span-2 bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-indigo-400">Pemesanan Baru</h2>

          {message && (
            <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleOrderSubmit} className="space-y-5">
            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Kategori</label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Instagram">Instagram</option>
                <option value="TikTok">TikTok</option>
              </select>
            </div>

            {/* Layanan */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Layanan</label>
              <select
                value={selectedService.id}
                onChange={(e) => {
                  const s = SERVICES_DATA.find((item) => item.id === e.target.value);
                  setSelectedService(s);
                  setQuantity(s.min);
                }}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                {filteredServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - Rp {service.pricePer1k.toLocaleString("id-ID")} / 1k
                  </option>
                ))}
              </select>
            </div>

            {/* Target Link */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Target Link / Username</label>
              <input
                type="text"
                required
                placeholder="https://www.instagram.com/p/xxx atau @username"
                value={targetLink}
                onChange={(e) => setTargetLink(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Jumlah (Quantity) */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                Jumlah (Min: {selectedService.min.toLocaleString("id-ID")} | Max: {selectedService.max.toLocaleString("id-ID")})
              </label>
              <input
                type="number"
                min={selectedService.min}
                max={selectedService.max}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Total Harga */}
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50 flex justify-between items-center">
              <span className="text-slate-400 font-medium">Total Harga:</span>
              <span className="text-xl font-bold text-emerald-400">
                Rp {totalPrice.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50"
            >
              {loading ? "Memproses Pesanan..." : "Buat Pesanan"}
            </button>
          </form>
        </div>

        {/* SIDEBAR SALDO & PETUNJUK */}
        <div className="space-y-6">
          {/* Card Saldo */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
            <h3 className="text-sm font-medium text-slate-400">Saldo Akun Anda</h3>
            <p className="text-3xl font-extrabold text-indigo-400 mt-2">Rp 50.000</p>
            <button className="mt-4 w-full bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium py-2 rounded-lg border border-slate-600 transition">
              + Deposit Saldo
            </button>
          </div>

          {/* Card Informasi */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg text-sm text-slate-300 space-y-3">
            <h3 className="font-bold text-slate-100">Catatan Pemesanan:</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Pastikan akun/postingan target tidak di-private.</li>
              <li>Jangan memasukkan pesanan yang sama untuk link yang sama jika pesanan sebelumnya belum selesai.</li>
              <li>Proses biasa memakan waktu 1-60 menit tergantung beban antrean provider.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
