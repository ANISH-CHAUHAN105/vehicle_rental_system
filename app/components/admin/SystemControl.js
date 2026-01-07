"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function SystemControl() {
  const [isEnabled, setIsEnabled] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const toggleSystem = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/system/toggle`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to update system status");

      setIsEnabled((prev) => !prev);
      toast.success(
        `System ${isEnabled ? "disabled" : "enabled"} successfully.`
      );
    } catch (error) {
      console.error("Error updating system status:", error);
      toast.error("Failed to update system status.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">System Control</h2>
      <button
        onClick={toggleSystem}
        className={`px-4 py-2 rounded ${
          isEnabled ? "bg-red-600" : "bg-green-600"
        } text-white`}
      >
        {isEnabled ? "Disable System" : "Enable System"}
      </button>
    </div>
  );
}
