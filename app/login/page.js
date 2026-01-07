"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    console.group("🔹 Login Attempt");
    console.log(
      "🌐 API Endpoint:",
      `${process.env.NEXT_PUBLIC_API_URL}/do-login`
    );

    if (!username || !password) {
      console.error("⚠️ Error: Username or password is empty.");
      setErrorMessage("Username and password are required.");
      setIsLoading(false);
      console.groupEnd();
      return;
    }

    const credentials = btoa(`${username}:${password}`);
    console.log("🔑 Encoded Credentials: [HIDDEN]");

    try {
      console.log("📤 Sending login request...");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/do-login`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📥 Response received. Status:", response.status);

      if (response.ok) {
        const token = await response.text();
        console.log("✅ Login Successful. Token received:", token);

        localStorage.setItem("token", token);
        console.log("💾 Token saved in localStorage.");

        const redirectTo = localStorage.getItem("redirectAfterLogin") || "/";
        localStorage.removeItem("redirectAfterLogin");

        console.log("🔄 Redirecting to:", redirectTo);
        router.push(redirectTo);
      } else {
        console.warn("⚠️ Login Failed. Status:", response.status);

        const errorText = await response.text();
        console.warn("⚠️ Server Response:", errorText);
        setErrorMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("❌ Network or Server Error:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      console.log("🔚 Login Attempt Finished.");
      console.groupEnd();
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex justify-center items-center p-6 transition-all duration-300">
      <div className="bg-[var(--section-bg)] p-8 rounded-lg shadow-lg w-full max-w-md transition-all duration-300">
        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin}>
          {/* Username Input */}
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300"
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300"
              required
            />
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}

          {/* Buttons */}
          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`py-3 px-6 rounded-lg shadow-md w-full transition-all duration-300 ${
                isLoading
                  ? "bg-blue-500 opacity-50 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            {/* Sign Up Button */}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg shadow-md w-full transition-all duration-300"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
