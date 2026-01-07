"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BookingList() {
  const [activeBookings, setActiveBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("Active");
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState(null);
  const [pastFilter, setPastFilter] = useState("All");
  const [processingId, setProcessingId] = useState(null); // ✅ Fixed missing state

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      console.warn("No token found in localStorage.");
      toast.error("Authentication token missing.");
      setLoading(false);
      return;
    }
    setToken(storedToken);
    fetchActiveBookings(storedToken);
    fetchPastBookings(storedToken).then(setPastBookings);
  }, []);

  const fetchActiveBookings = async (authToken) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!response.ok) throw new Error("Failed to fetch active bookings");

      const data = await response.json();
      setActiveBookings(
        (data || [])
          .map((booking) => ({
            id: booking.booking_id,
            vehicleName:
              booking.vehicle_name || `Vehicle ${booking.vehicle_id}`,
            user: booking.user_name || `User ${booking.user_id}`,
            startDate: booking.start_date,
            endDate: booking.end_date,
            pricePerDay: booking.price_per_day,
            status: booking.status,
          }))
          .filter((b) => b.status === "confirmed" || b.status === "Pending")
      );
    } catch (error) {
      console.error("Error fetching active bookings:", error);
      toast.error("Failed to load active bookings.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPastBookings = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/bookings/processed`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const text = await response.text();
      if (!response.ok)
        throw new Error(`API Error: ${response.status} ${response.statusText}`);

      if (!text.trim()) {
        console.warn("API returned an empty response.");
        return [];
      }

      const data = JSON.parse(text);

      return (data || [])
        .filter((booking) => booking.start_date && booking.end_date)
        .map((booking) => ({
          id: booking.booking_id,
          vehicleName: booking.vehicle_name || `Vehicle ${booking.vehicle_id}`,
          user: booking.user_name || `User ${booking.user_id}`,
          startDate: booking.start_date,
          endDate: booking.end_date,
          pricePerDay: booking.price_per_day,
          status: booking.status?.toLowerCase() || "unknown",
        }));
    } catch (error) {
      console.error("Error fetching past bookings:", error);
      return [];
    }
  };

  const confirmBooking = async (bookingId, status) => {
    if (!token) {
      toast.error("Authentication token missing.");
      return;
    }

    const validEndpoints = { confirm: "confirm", reject: "reject" };
    if (!validEndpoints[status]) {
      toast.error("Invalid booking status.");
      return;
    }

    setProcessingId(bookingId); // ✅ Set processing ID before request

    try {
      const response = await fetch(
        `${API_URL}/api/admin/bookings/${validEndpoints[status]}?bookingId=${bookingId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to ${status} booking`);
      }

      toast.success(`Booking ${status} successfully!`);
      fetchActiveBookings(token);
    } catch (error) {
      console.error(`Error updating booking ${bookingId}:`, error);
      toast.error(`Failed to ${status} booking.`);
    } finally {
      setProcessingId(null); // ✅ Reset after completion
    }
  };

  const filteredPastBookings =
    pastFilter === "All"
      ? pastBookings
      : pastBookings.filter(
          (b) => b.status.toLowerCase() === pastFilter.toLowerCase()
        );

  const displayedBookings = (
    view === "Active" ? activeBookings : filteredPastBookings || []
  ).filter(
    (b) =>
      b?.vehicleName?.toLowerCase()?.includes(searchQuery.toLowerCase()) ||
      b?.user?.toLowerCase()?.includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto text-gray-900 dark:text-gray-100">
      <Toaster position="top-center" />

      <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
        Admin Bookings Dashboard
      </h2>

      {/* View Toggle & Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="flex gap-2">
          {["Active", "Past"].map((type) => (
            <button
              key={type}
              className={`p-2 rounded-lg ${
                view === type
                  ? "bg-blue-500 text-white dark:bg-blue-600"
                  : "bg-gray-300 dark:bg-gray-700 dark:text-gray-300"
              }`}
              onClick={() => setView(type)}
            >
              {type} Bookings
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by vehicle or user"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 rounded-lg flex-1 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
        />

        {view === "Past" && (
          <select
            value={pastFilter}
            onChange={(e) => setPastFilter(e.target.value)}
            className="border p-2 rounded-lg bg-gray-100 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100"
          >
            <option value="All">All</option>
            <option value="confirmed">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></span>
        </div>
      ) : displayedBookings.length > 0 ? (
        <ul className="space-y-4">
          {displayedBookings.map((booking) => (
            <li
              key={booking.id}
              className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-5 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between">
                <div>
                  <p className="text-lg font-semibold">{booking.vehicleName}</p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Booked by:{" "}
                    <span className="font-medium">{booking.user}</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {booking.startDate} → {booking.endDate} | 💰 ₹
                    {booking.pricePerDay}/day
                  </p>
                </div>
                <span className="px-3 py-1 rounded-lg text-sm font-medium">
                  {booking.status}
                </span>
              </div>

              {view === "Active" && booking.status === "Pending" && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => confirmBooking(booking.id, "confirm")}
                    disabled={processingId === booking.id}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    ✅ Confirm
                  </button>
                  <button
                    onClick={() => confirmBooking(booking.id, "reject")}
                    disabled={processingId === booking.id}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No bookings found.</p>
      )}
    </div>
  );
}
