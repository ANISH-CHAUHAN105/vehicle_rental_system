"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <main className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] py-16 px-6">
      <div className="max-w-4xl mx-auto bg-[var(--section-bg)] p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Privacy Policy</h1>
        <p className="text-[var(--text-muted)] mb-4">
          Last updated: February 12, 2025
        </p>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">1. Introduction</h2>
            <p className="text-[var(--text-muted)] mt-2">
              Welcome to our Vehicle Rental website. Your privacy is important
              to us, and this Privacy Policy explains how we collect, use, and
              protect your information.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">2. Information We Collect</h2>
            <p className="text-[var(--text-muted)] mt-2">
              We collect personal data such as your name, email, phone number,
              and payment details when you book a rental. Additionally, we
              collect usage data, such as pages visited and interactions on our
              site.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              3. How We Use Your Information
            </h2>
            <ul className="list-disc pl-6 text-[var(--text-muted)] mt-2 space-y-2">
              <li>To process and confirm vehicle bookings.</li>
              <li>To provide customer support and improve our services.</li>
              <li>To send updates, promotions, or important notifications.</li>
              <li>To ensure the security of transactions.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              4. Data Protection & Security
            </h2>
            <p className="text-[var(--text-muted)] mt-2">
              We implement security measures to protect your data from
              unauthorized access. However, no online service is 100% secure.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">5. Third-Party Services</h2>
            <p className="text-[var(--text-muted)] mt-2">
              We may use third-party services for payment processing and
              analytics. These services have their own privacy policies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">6. Your Rights</h2>
            <p className="text-[var(--text-muted)] mt-2">
              You have the right to access, update, or delete your personal
              data. To make a request, please contact us.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">7. Contact Us</h2>
            <p className="text-[var(--text-muted)] mt-2">
              If you have any questions about this Privacy Policy, please{" "}
              <Link href="/contact" className="text-[var(--btn-bg)] underline">
                contact us
              </Link>
              .
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
