"use client";

import { useState, useMemo } from "react";
import { toast } from "react-hot-toast";

const VehicleList = ({ vehicles, fetchVehicles }) => {
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    vehicle_id: "",
    registration_number: "",
    brand: "",
    model: "",
    price_per_day: 0.0,
    type: "",
    availability: "Unavailable",
  });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const formatType = (type) =>
    type && typeof type === "string"
      ? type.trim().charAt(0).toUpperCase() + type.trim().slice(1).toLowerCase()
      : "Other";

  const groupedVehicles = useMemo(
    () =>
      vehicles?.length
        ? vehicles.reduce((acc, vehicle) => {
            const category = formatType(vehicle.type);
            acc[category] = acc[category] || [];
            acc[category].push(vehicle);
            return acc;
          }, {})
        : {},
    [vehicles]
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (vehicle) => {
    setEditingVehicle(vehicle.vehicle_id);
    setUpdatedData({
      vehicle_id: vehicle.vehicle_id,
      registration_number: vehicle.registration_number || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      price_per_day: vehicle.price_per_day || 0.0,
      type: vehicle.type || "",
      availability: vehicle.availability || "Unavailable",
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingVehicle) return toast.error("❌ Invalid vehicle ID");

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found in localStorage.");
      return toast.error("❌ Unauthorized: No token found.");
    }

    const updatedVehicleData = {
      vehicle_id: Number(updatedData.vehicle_id),
      type: updatedData.type.trim() || "Other",
      brand: updatedData.brand.trim() || "",
      model: updatedData.model.trim() || "",
      price_per_day: parseFloat(updatedData.price_per_day) || 0.0,
      availability: updatedData.availability.trim() || "Unavailable",
      registration_number: updatedData.registration_number.trim() || "",
    };

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/vehicles`;
    const method = "POST";

    console.log("🔄 Sending update request...");
    console.log("🔗 API URL:", apiUrl);
    console.log("🛠️ Request Headers:", {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });
    console.log(
      "📤 Request Body:",
      JSON.stringify(updatedVehicleData, null, 2)
    );

    try {
      const response = await fetch(apiUrl, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedVehicleData),
      });

      console.log("📥 Response Status:", response.status);

      if (!response.ok) {
        const responseBody = await response.text();
        console.error("❌ Response Body:", responseBody);
        throw new Error(`Failed to update vehicle - ${response.statusText}`);
      }

      toast.success("✅ Vehicle updated successfully!");
      console.log("✅ Vehicle updated:", updatedVehicleData);
      setEditingVehicle(null);
      fetchVehicles?.();
    } catch (error) {
      console.error("❌ Error updating vehicle:", error.message);
      toast.error(error.message || "Failed to update vehicle.");
    }
  };

  const deleteVehicle = async (vehicleId) => {
    if (!vehicleId) return toast.error("❌ Invalid vehicle ID");

    const token = localStorage.getItem("token");
    if (!token) return toast.error("❌ Unauthorized: No token found.");

    try {
      console.log(`🗑️ Deleting vehicle ID: ${vehicleId}`);

      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/admin/vehicles?vehicleId=${encodeURIComponent(vehicleId)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Failed to delete vehicle");

      toast.success("✅ Vehicle deleted successfully!");
      fetchVehicles?.();
      setConfirmDeleteId(null);
    } catch (error) {
      console.error("❌ Error deleting vehicle:", error);
      toast.error(error.message || "Failed to delete vehicle.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        All Vehicles
      </h2>

      <select
        className="mb-4 p-2 border rounded dark:bg-gray-700 dark:text-white"
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">All Vehicles</option>
        {Object.keys(groupedVehicles).map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>

      {vehicles?.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">
          No vehicles available.
        </p>
      ) : (
        Object.entries(groupedVehicles)
          .filter(
            ([category]) =>
              !selectedCategory ||
              category.toLowerCase() === selectedCategory.toLowerCase()
          )
          .map(([category, vehicles]) => (
            <div key={category} className="mb-6">
              <h3 className="font-semibold text-xl text-gray-800 dark:text-white">
                {category}
              </h3>
              <ul className="space-y-4">
                {vehicles.map((vehicle) => (
                  <li
                    key={vehicle.vehicle_id}
                    className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md"
                  >
                    {editingVehicle === vehicle.vehicle_id ? (
                      <form className="space-y-2" onSubmit={handleEditSubmit}>
                        <input
                          type="text"
                          name="type"
                          value={updatedData.type}
                          onChange={handleInputChange}
                          className="border rounded p-2 w-full bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                          placeholder="Type"
                          required
                        />
                        <input
                          type="text"
                          name="brand"
                          value={updatedData.brand}
                          onChange={handleInputChange}
                          className="border rounded p-2 w-full bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                          placeholder="Brand"
                          required
                        />
                        <input
                          type="text"
                          name="model"
                          value={updatedData.model}
                          onChange={handleInputChange}
                          className="border rounded p-2 w-full bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                          placeholder="Model"
                          required
                        />
                        <input
                          type="text"
                          name="price_per_day"
                          value={updatedData.price_per_day}
                          onChange={handleInputChange}
                          className="border rounded p-2 w-full bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                          placeholder="Price"
                          required
                        />
                        <input
                          type="text"
                          name="availability"
                          value={updatedData.availability}
                          onChange={handleInputChange}
                          className="border rounded p-2 w-full bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200"
                          placeholder="Available or Unavailable"
                          required
                        />

                        <div className="flex justify-between">
                          <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingVehicle(null)}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <p className="text-gray-800 dark:text-white">
                          <strong>
                            {vehicle.brand} {vehicle.model}
                          </strong>{" "}
                          - ${vehicle.price_per_day}/day
                        </p>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleEditClick(vehicle)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() =>
                              setConfirmDeleteId(vehicle.vehicle_id)
                            }
                            className="bg-red-500 text-white px-4 py-2 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))
      )}

      {confirmDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Are you sure you want to delete this vehicle?
            </h3>
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => deleteVehicle(confirmDeleteId)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleList;
