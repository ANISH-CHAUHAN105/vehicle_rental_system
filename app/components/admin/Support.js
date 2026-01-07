"use client";

import { useEffect, useState } from "react";

export default function Support() {
  const [inquiries, setInquiries] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/inquiries`);
      if (!response.ok) throw new Error("Failed to fetch inquiries");

      const data = await response.json();
      setInquiries(data);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Customer Inquiries & Reviews
      </h2>
      {inquiries.length > 0 ? (
        <ul>
          {inquiries.map((inq) => (
            <li key={inq.id} className="p-2 border-b">
              {inq.message}
            </li>
          ))}
        </ul>
      ) : (
        <p>No customer inquiries yet.</p>
      )}
    </div>
  );
}
