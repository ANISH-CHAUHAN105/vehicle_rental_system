"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/transactions`);
      if (!response.ok) throw new Error("Failed to fetch transactions");

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Transactions</h2>
      {loading ? (
        <p>Loading transactions...</p>
      ) : transactions.length > 0 ? (
        <ul>
          {transactions.map((txn) => (
            <li key={txn.id} className="p-2 border-b">
              {txn.details}
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
    </div>
  );
}
