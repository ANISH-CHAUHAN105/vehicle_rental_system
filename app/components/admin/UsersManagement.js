"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/users`);
      if (!response.ok) throw new Error("Failed to fetch users");

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/block/${userId}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) throw new Error("Failed to block user");

      toast.success("User blocked successfully.");
      fetchUsers();
    } catch (error) {
      console.error("Error blocking user:", error);
      toast.error("Failed to block user.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user.id} className="flex justify-between p-2 border-b">
              <span>{user.username}</span>
              <button
                onClick={() => handleBlockUser(user.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Block
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
}
