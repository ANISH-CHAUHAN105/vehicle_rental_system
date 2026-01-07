import { useState } from "react";

export default function BookingForm({ vehicleId, onClose }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const handleBooking = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!startDate || !endDate) {
      setMessage("❌ Please select both start and end dates.");
      setLoading(false);
      return;
    }

    if (new Date(startDate) < new Date()) {
      setMessage("❌ Start date cannot be in the past.");
      setLoading(false);
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setMessage("❌ End date must be after start date.");
      setLoading(false);
      return;
    }

    const bookingData = {
      vehicleId: vehicleId,
      startDate: startDate,
      endDate: endDate,
      userId: "1",
    };

    try {
      console.log("🚀 Sending Booking Data:", bookingData);
      console.log("🌐 Request URL:", `${API_URL}/api/bookings/create`);

      const response = await fetch(`${API_URL}/api/bookings/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(bookingData),
        mode: "cors",
      });

      // ✅ Check Content-Type before parsing JSON
      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = await response.text(); // Read as text if not JSON
        console.warn("⚠️ Response is not JSON:", result);
        setMessage(`✅ Booking successful! Reference ID: ${result}`);
        setLoading(false);
        return;
      }

      console.log("✅ API Response:", result);
      console.log("📡 Response Status:", response.status);

      if (response.ok) {
        setMessage("✅ Booking confirmed!");
        setTimeout(onClose, 2000);
      } else {
        setMessage(`❌ Booking failed: ${result.message || "Try again."}`);
      }
    } catch (error) {
      console.error("🚨 Network error:", error);
      setMessage("❌ Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50 animate-fadeIn">
      <div className="relative bg-white dark:bg-gray-900 p-6 rounded-xl shadow-2xl w-[400px]">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500 transition-all"
          onClick={onClose}
        >
          ✖
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-4">
          🚗 Book Your Ride
        </h2>

        {/* Booking Form */}
        <form onSubmit={handleBooking} className="flex flex-col gap-5">
          {/* Start Date */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1">
              📅 Start Date:
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
              className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-gray-600 dark:text-gray-300 font-medium mb-1">
              🏁 End Date:
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              required
              className="w-full p-3 border rounded-lg bg-gray-100 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
            disabled={loading}
          >
            {loading ? "Booking..." : "✅ Confirm Booking"}
          </button>

          {/* Status Message */}
          {message && (
            <p className="text-center text-sm mt-2 font-medium text-gray-700 dark:text-gray-300">
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
