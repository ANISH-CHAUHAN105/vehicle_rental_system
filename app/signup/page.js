"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    console.group("🔹 Signup Attempt");

    if (!username || !password || !confirmPassword) {
      console.error("⚠️ Error: Fields are empty.");
      setErrorMessage("All fields are required.");
      setIsLoading(false);
      console.groupEnd();
      return;
    }

    if (password !== confirmPassword) {
      console.error("⚠️ Error: Passwords do not match.");
      setErrorMessage("Passwords do not match.");
      setIsLoading(false);
      console.groupEnd();
      return;
    }

    try {
      console.log("📤 Sending signup request...");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      console.log("📥 Response received. Status:", response.status);

      if (response.ok) {
        console.log("✅ Signup Successful.");
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        const errorText = await response.text();
        console.warn("⚠️ Server Response:", errorText);
        setErrorMessage("Signup failed. Try a different username.");
      }
    } catch (error) {
      console.error("❌ Network or Server Error:", error);
      setErrorMessage("An error occurred. Please try again.");
    } finally {
      console.log("🔚 Signup Attempt Finished.");
      console.groupEnd();
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)]  text-[var(--foreground)] flex justify-center items-center p-6 transition-all duration-300">
      <div className="bg-[var(--section-bg)] p-8 rounded-lg shadow-lg w-full max-w-md transition-all duration-300">
        <h2 className="text-2xl font-semibold text-center text-gray-900 dark:text-gray-100 mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSignup}>
          {/* Username Field */}
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

          {/* Password Field */}
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

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white transition-all duration-300"
              required
            />
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <p className="text-red-500 text-center mb-4">{errorMessage}</p>
          )}
          {successMessage && (
            <p className="text-green-500 text-center mb-4">{successMessage}</p>
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
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg shadow-md w-full transition-all duration-300"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
