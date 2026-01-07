/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import FeatureCard from "./components/FeatureCard";
import VehicleCard from "./components/VehicleCard"; // Use generic VehicleCard
import TestimonialCard from "./components/TestimonialCard";
import FAQItem from "./components/FAQItem";

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* 🏍️ Hero Section */}
      <section className="relative w-full text-center py-20 px-6 bg-[var(--section-bg)] shadow-md">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-5xl font-extrabold sm:text-6xl leading-tight drop-shadow-lg">
            Rent Your Perfect Ride, <br /> Scooty, Bike, or Car!
          </h1>
          <p className="text-lg text-[var(--text-muted)] mt-4">
            Premium rentals for every journey – easy, affordable, and reliable.
          </p>
          <Link href="/vehicles">
            <button
              className="btn-primary mt-6 flex items-center gap-2"
              aria-label="Explore Vehicles"
            >
              Explore Vehicles <ChevronRight size={20} />
            </button>
          </Link>
        </div>
      </section>

      {/* 🏆 Features Section */}
      <section className="max-w-5xl mx-auto py-16 px-6 text-center grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: "Car",
            title: "Wide Range of Vehicles",
            description:
              "Choose from scooties, bikes, and cars for every occasion.",
          },
          {
            icon: "Clock",
            title: "Fast & Easy Booking",
            description:
              "Book your vehicle in minutes with our seamless online process.",
          },
          {
            icon: "Shield",
            title: "Secure Payments",
            description:
              "Hassle-free transactions with multiple payment options.",
          },
        ].map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </section>

      {/* 🚘 Vehicle Showcase Section */}
      <section className="max-w-6xl mx-auto py-16 px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-gray-100">
          Popular Rentals
        </h2>
        <p className="text-center text-lg text-gray-600 dark:text-gray-300 mt-2">
          Find the best scooties, bikes, and cars for your journey.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10">
          {[
            {
              vehicle_id: "1", // Example ID
              brand: "Honda",
              model: "Activa 6G",
              type: "Scooty",
              price_per_day: "500",
              image_url: "/scooties/activa.jpg",
              availability: "Available",
            },
            {
              vehicle_id: "2", // Example ID
              brand: "Royal Enfield",
              model: "Classic 350",
              type: "Bike",
              price_per_day: "1,200",
              image_url: "/bikes/classic350.jpg",
              availability: "Available",
            },
            {
              vehicle_id: "3", // Example ID
              brand: "Maruti Suzuki",
              model: "Swift",
              type: "Car",
              price_per_day: "3,000",
              image_url: "/cars/swift.jpg",
              availability: "Available",
            },
          ].map((vehicle, index) => (
            <VehicleCard key={index} vehicle={vehicle} />
          ))}
        </div>
      </section>

      {/* ⭐ Testimonials Section */}
      <section className="max-w-6xl mx-auto py-16 px-6 text-center bg-[var(--section-bg)] rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold">What Our Customers Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {[
            {
              name: "Amit Sharma",
              review: "Fantastic service! The scooty was in perfect condition.",
              rating: 5,
            },
            {
              name: "Priya Verma",
              review: "Smooth booking process and great prices!",
              rating: 4,
            },
            {
              name: "Rahul Mehta",
              review: "Loved the experience! Will rent again.",
              rating: 5,
            },
          ].map((review, index) => (
            <TestimonialCard key={index} review={review} />
          ))}
        </div>
      </section>

      {/* ❓ FAQ Section */}
      <section className="max-w-5xl mx-auto py-16 px-6">
        <h2 className="text-3xl font-bold text-center">
          Frequently Asked Questions
        </h2>
        <div className="mt-8 space-y-6">
          {[
            {
              question: "What documents do I need to rent a vehicle?",
              answer:
                "You need a valid driver's license, ID proof, and a credit card for the security deposit.",
            },
            {
              question: "Is there a mileage limit?",
              answer:
                "Yes, mileage limits depend on the selected plan. Extra charges may apply for exceeding the limit.",
            },
            {
              question: "What happens if I return the vehicle late?",
              answer:
                "Late returns may incur additional charges. Please check the rental terms for details.",
            },
          ].map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </div>
      </section>
    </main>
  );
}
