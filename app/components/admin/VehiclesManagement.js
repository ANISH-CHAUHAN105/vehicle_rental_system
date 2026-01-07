"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import VehicleList from "./VehicleList";
import AddVehicleForm from "./AddVehicleForm";

export default function VehiclesManagement() {
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]); // Store fetched vehicles

  const handleAddVehicle = async (vehicleData) => {
    try {
      setLoading(true);
      console.log("🚗 Adding new vehicle:", vehicleData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/vehicles`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vehicleData),
        }
      );

      if (!response.ok) throw new Error("Failed to add vehicle");

      // Update vehicle list
      setVehicles((prevVehicles) => [...prevVehicles, vehicleData]);

      setShowAddVehicleForm(false);
      toast.success("✅ Vehicle added successfully!");
    } catch (error) {
      console.error("❌ Error adding vehicle:", error);
      toast.error("Failed to add vehicle.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Vehicle List</h2>
        <button
          onClick={() => setShowAddVehicleForm(!showAddVehicleForm)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all duration-300"
          disabled={loading}
        >
          {loading
            ? "Adding..."
            : showAddVehicleForm
            ? "Close Form"
            : "Add Vehicle"}
        </button>
      </div>

      {showAddVehicleForm && <AddVehicleForm addVehicle={handleAddVehicle} />}
      <VehicleList vehicles={vehicles} />
    </div>
  );
}
