"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState({});
  const [selectedType, setSelectedType] = useState("all");
  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [vehicleToEdit, setVehicleToEdit] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles`
        );
        if (!res.ok) throw new Error("Failed to fetch vehicles");
        const data = await res.json();
        processVehicles(data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  const processVehicles = (vehicleList) => {
    const categories = {};
    const types = new Set();

    vehicleList.forEach((vehicle) => {
      const normalizedType = vehicle.type.trim().toLowerCase();
      if (!categories[normalizedType]) categories[normalizedType] = [];
      categories[normalizedType].push(vehicle);
      types.add(normalizedType);
    });

    setVehicles(vehicleList);
    setFilteredVehicles(categories);
    setVehicleTypes(["all", ...Array.from(types)]);
  };

  const deleteVehicle = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found in localStorage");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/vehicles?vehicleId=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const responseText = await res.text();
        console.error("❌ Server response:", responseText || "<empty>");
        throw new Error(`Failed to delete vehicle. HTTP ${res.status}`);
      }

      const updatedVehicles = vehicles.filter(
        (vehicle) => vehicle.vehicle_id !== id
      );
      processVehicles(updatedVehicles);
    } catch (error) {
      console.error("🔥 Error deleting vehicle:", error.message);
    }
  };

  const updateVehicle = (vehicle) => {
    setVehicleToEdit(vehicle);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedVehicle = {
      ...vehicleToEdit,
      brand: formData.get("brand"),
      model: formData.get("model"),
      type: formData.get("type"),
      price_per_day: formData.get("price_per_day"),
      image_url: formData.get("image_url"),
      availability: formData.get("availability"),
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/vehicles`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedVehicle),
        }
      );

      if (!res.ok) throw new Error("Failed to update vehicle");

      const updatedList = vehicles.map((v) =>
        v.vehicle_id === updatedVehicle.vehicle_id ? updatedVehicle : v
      );
      processVehicles(updatedList);
      setShowEditModal(false);
    } catch (error) {
      console.error("🚨 Error updating vehicle:", error.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        All Vehicles
      </h2>

      <div className="flex gap-2 mb-4 flex-wrap">
        {vehicleTypes.map((type, index) => (
          <button
            key={`type-${index}`}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
              selectedType === type
                ? "bg-blue-600 text-white"
                : "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-400 dark:hover:bg-gray-600"
            }`}
            onClick={() => setSelectedType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(selectedType === "all"
          ? vehicles
          : filteredVehicles[selectedType] || []
        ).map((vehicle, index) => (
          <div
            key={vehicle.vehicle_id || vehicle._id || `vehicle-${index}`}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col justify-between"
          >
            <Image
              src={
                vehicle.image_url && vehicle.image_url.trim() !== ""
                  ? vehicle.image_url
                  : "/default.jpg"
              }
              alt={vehicle.model || "Vehicle Image"}
              width={300}
              height={200}
              className="w-full h-32 object-cover rounded-md mb-2"
              priority
              unoptimized
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {vehicle.brand} {vehicle.model}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              ₹{vehicle.price_per_day} / day
            </p>
            <div className="flex justify-between mt-2">
              <button
                onClick={() => updateVehicle(vehicle)}
                className="text-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deleteVehicle(vehicle.vehicle_id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showEditModal && vehicleToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Edit Vehicle
            </h3>
            <form onSubmit={handleEditSubmit}>
              {[
                "brand",
                "model",
                "type",
                "price_per_day",
                "image_url",
                "availability",
              ].map((field) => (
                <div key={field} className="mb-3">
                  <label className="block mb-1 capitalize text-sm font-medium text-gray-700 dark:text-gray-300">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    name={field}
                    defaultValue={vehicleToEdit[field]}
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              ))}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
