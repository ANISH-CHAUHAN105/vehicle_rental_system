"use client";
import { useEffect, useState, useMemo } from "react";
import Image from "next/image";

// API Fetch Function
async function fetchData(url, token) {
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const text = await response.text(); // Debugging API response
    console.log(`Response from ${url}:`, text);

    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    return JSON.parse(text); // Manually parse JSON
  } catch (error) {
    console.error("API Fetch Error:", error.message);
    return null;
  }
}

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Token missing. Please log in.");
      setLoading(false);
      return;
    }

    // Decode userId from JWT if not already stored
    let userId = localStorage.getItem("userId");
    if (!userId) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        userId = payload.sub; // Adjust if your key is different
        localStorage.setItem("userId", userId);
      } catch (e) {
        console.error("Failed to decode JWT:", e.message);
        setError("Invalid token. Please log in again.");
        setLoading(false);
        return;
      }
    }

    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    if (!baseURL) {
      setError("API base URL missing. Check your environment config.");
      setLoading(false);
      return;
    }

    console.log("Token:", token);
    console.log("User ID:", userId);
    console.log("API URL:", baseURL);

    async function fetchDashboardData() {
      setLoading(true);
      try {
        const [userData, bookingData, transactionData, reviewData] =
          await Promise.all([
            fetchData(`${baseURL}/api/user/details?username=${userId}`, token),
            fetchData(`${baseURL}/api/user/bookings?username=${userId}`, token),
            fetchData(
              `${baseURL}/api/user/transactions?username=${userId}`,
              token
            ),
            fetchData(`${baseURL}/api/user/reviews?username=${userId}`, token),
          ]);

        console.log("User Data:", userData);
        console.log("Bookings:", bookingData);
        console.log("Transactions:", transactionData);
        console.log("Reviews:", reviewData);

        if (userData) {
          setUser({
            id: userData.user_id,
            username: userData.username,
            email: userData.email,
            profilePic: userData.profilePic || "",
          });
        }

        setBookings(bookingData?.bookings || []);
        setTransactions(transactionData?.transactions || []);
        setReviews(reviewData?.reviews || []);
      } catch (err) {
        console.error("Dashboard Fetch Error:", err.message);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const hasBookings = useMemo(() => bookings.length > 0, [bookings]);
  const hasTransactions = useMemo(
    () => transactions.length > 0,
    [transactions]
  );
  const hasReviews = useMemo(() => reviews.length > 0, [reviews]);

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-200 min-h-screen p-6 pt-28 flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-center mb-4">
        User Dashboard
      </h1>

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-xl flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <Avatar name={user?.username} profilePic={user?.profilePic} />
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-bold">
            {user?.username || "Guest User"}
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {user?.email || "No email available"}
          </p>
          <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Edit Profile
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Booking History */}
      <Section title="Booking History">
        {hasBookings ? (
          <List
            items={bookings}
            renderItem={(booking) => (
              <li
                key={booking.id}
                className="flex justify-between border-b pb-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg"
              >
                <span>{booking.vehicle}</span>
                <span className="text-sm text-gray-500">{booking.date}</span>
              </li>
            )}
          />
        ) : (
          <NoData message="No bookings found." />
        )}
      </Section>

      {/* Transactions */}
      <Section title="Transaction History">
        {hasTransactions ? (
          <List
            items={transactions}
            renderItem={(txn) => (
              <li
                key={txn.id}
                className="flex justify-between border-b pb-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg"
              >
                <span>{txn.amount}</span>
                <span
                  className={`text-sm font-semibold ${
                    txn.status === "Completed"
                      ? "text-green-500"
                      : "text-yellow-500"
                  }`}
                >
                  {txn.status}
                </span>
              </li>
            )}
          />
        ) : (
          <NoData message="No transactions found." />
        )}
      </Section>

      {/* Reviews */}
      <Section title="Your Reviews">
        {hasReviews ? (
          <List
            items={reviews}
            renderItem={(review) => (
              <li
                key={review.id}
                className="border-b pb-2 hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-lg"
              >
                <p>{review.text}</p>
                <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <span>{review.date}</span>
                  <div className="flex gap-3">
                    <button className="text-blue-500 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-500 hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            )}
          />
        ) : (
          <NoData message="No reviews found." />
        )}
      </Section>
    </div>
  );
}

/* Avatar Component */
function Avatar({ name = "User", profilePic }) {
  return profilePic ? (
    <Image
      src={profilePic}
      alt="Profile Picture"
      width={100}
      height={100}
      className="rounded-full border border-gray-300"
    />
  ) : (
    <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-700 text-white text-3xl font-bold border border-gray-500">
      {name?.charAt(0).toUpperCase() || "U"}
    </div>
  );
}

/* Section Wrapper */
function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg p-6 rounded-xl">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {children}
    </div>
  );
}

/* No Data Message */
function NoData({ message }) {
  return <p className="text-gray-500 text-center">{message}</p>;
}

/* List Wrapper */
function List({ items, renderItem }) {
  return <ul className="space-y-2">{items.map(renderItem)}</ul>;
}
