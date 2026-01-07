"use client";

import { Mail, Phone, MapPin, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent successfully!"); // Replace with actual API call
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <main className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] py-16 px-6">
      <div className="max-w-4xl mx-auto bg-[var(--section-bg)] p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
        <p className="text-[var(--text-muted)] text-center mb-8">
          Have questions? Get in touch with us!
        </p>

        {/* 📍 Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <ContactInfo
            icon={<Mail className="w-8 h-8 text-[var(--btn-bg)]" />}
            title="Email"
            detail="support@vehiclerental.com"
          />
          <ContactInfo
            icon={<Phone className="w-8 h-8 text-[var(--btn-bg)]" />}
            title="Phone"
            detail="+91 98765 43210"
          />
          <ContactInfo
            icon={<MapPin className="w-8 h-8 text-[var(--btn-bg)]" />}
            title="Location"
            detail="New Delhi, India"
          />
        </div>

        {/* ✉️ Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 bg-[var(--background)] p-6 rounded-lg shadow-md"
        >
          <div className="mb-4">
            <label className="block text-lg font-medium">Your Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border rounded-md bg-[var(--section-bg)] focus:outline-none"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium">Your Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-2 p-3 border rounded-md bg-[var(--section-bg)] focus:outline-none"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium">Your Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="4"
              className="w-full mt-2 p-3 border rounded-md bg-[var(--section-bg)] focus:outline-none"
              placeholder="Enter your message"
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            Send Message <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </main>
  );
}

/* 📌 Reusable Contact Info Component */
function ContactInfo({ icon, title, detail }) {
  return (
    <div className="bg-[var(--background)] p-6 rounded-lg shadow-md">
      <div className="mb-3 flex justify-center">{icon}</div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-[var(--text-muted)] mt-1">{detail}</p>
    </div>
  );
}
