import { useState } from "react";
import { toast } from "react-hot-toast";

const AddVehicleForm = ({ setShowForm }) => {
  const [newVehicle, setNewVehicle] = useState({
    type: "",
    brand: "",
    model: "",
    price_per_day: "",
    availability: "Unavailable",
    registration_number: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setNewVehicle((prev) => ({
      ...prev,
      [name]: name === "price_per_day" ? value.replace(/[^0-9.]/g, "") : value,
    }));
  };

  const validateForm = () => {
    const {
      type,
      brand,
      model,
      price_per_day,
      availability,
      registration_number,
    } = newVehicle;

    if (!type || !brand || !model || !registration_number) {
      toast.error("All fields are required.");
      return false;
    }

    // Ensure price is a positive floating value
    const price = parseFloat(price_per_day);
    if (isNaN(price) || price <= 0) {
      toast.error("Price per day must be a positive floating value.");
      return false;
    }

    // Ensure availability is either "Available" or "Unavailable"
    if (!["Available", "Unavailable"].includes(availability)) {
      toast.error('Availability must be "Available" or "Unavailable".');
      return false;
    }

    // Ensure registration number is a non-empty string
    if (
      typeof registration_number !== "string" ||
      registration_number.trim() === ""
    ) {
      toast.error("Registration number must be a valid string.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/admin/vehicles`;
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newVehicle,
          price_per_day: parseFloat(newVehicle.price_per_day), // Ensure price is a float
        }),
        mode: "cors",
      });

      const rawText = await response.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        data = { message: rawText };
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to add vehicle.");
      }

      toast.success(data.message || "Vehicle added successfully!");
      setShowForm(false);
    } catch (error) {
      toast.error(
        error.message || "An error occurred while adding the vehicle."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-w-xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Add a New Vehicle
      </h3>

      {/* Form Fields */}
      {[
        { name: "type", label: "Vehicle Type" },
        { name: "brand", label: "Brand" },
        { name: "model", label: "Model" },
        { name: "price_per_day", label: "Price Per Day (₹)", type: "text" },
        { name: "availability", label: "Availability (Available/Unavailable)" },
        { name: "registration_number", label: "Registration Number" },
      ].map(({ name, label, type = "text" }) => (
        <input
          key={name}
          type={type}
          name={name}
          value={newVehicle[name]}
          onChange={handleInputChange}
          placeholder={label}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
        />
      ))}

      {/* Buttons */}
      <div className="flex justify-between mt-4">
        <button
          type="submit"
          disabled={isLoading}
          className={`py-2 px-4 rounded-lg text-white transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? "Adding..." : "Add Vehicle"}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddVehicleForm;
