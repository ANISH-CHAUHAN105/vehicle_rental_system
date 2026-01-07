"use client";

import { useEffect, useState } from "react";

export default function Reports() {
  const [report, setReport] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/reports`);
      if (!response.ok) throw new Error("Failed to fetch reports");

      const data = await response.json();
      setReport(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Revenue & User Activity Report
      </h2>
      {report ? (
        <pre>{JSON.stringify(report, null, 2)}</pre>
      ) : (
        <p>Loading reports...</p>
      )}
    </div>
  );
}
