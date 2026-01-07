"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push("/login"); // Redirect if not authenticated
    }
  }, [token, router]);

  return token ? children : null; // Only render if authenticated
}
