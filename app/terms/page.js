"use client";

import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="w-full min-h-screen bg-[var(--background)] text-[var(--foreground)] py-16 px-6">
      <div className="max-w-4xl mx-auto bg-[var(--section-bg)] p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Terms of Service
        </h1>
        <p className="text-[var(--text-muted)] mb-4">
          Last updated: February 12, 2025
        </p>

        <section className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-[var(--text-muted)] mt-2">
              By using our Vehicle Rental services, you agree to comply with
              these Terms of Service. If you do not agree, please do not use our
              services.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">2. Rental Eligibility</h2>
            <p className="text-[var(--text-muted)] mt-2">
              You must be at least 18 years old and hold a valid driver’s
              license to rent a vehicle from us.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">3. Booking & Payments</h2>
            <ul className="list-disc pl-6 text-[var(--text-muted)] mt-2 space-y-2">
              <li>All bookings must be made through our official platform.</li>
              <li>
                Payment must be completed before the rental period begins.
              </li>
              <li>Late returns may be subject to additional fees.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold">4. Vehicle Usage Policy</h2>
            <p className="text-[var(--text-muted)] mt-2">
              The rented vehicle must be used responsibly. Any damage due to
              reckless driving, unauthorized use, or illegal activities will
              result in penalties.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              5. Cancellations & Refunds
            </h2>
            <p className="text-[var(--text-muted)] mt-2">
              Cancellations made within 24 hours of the booking start time may
              not be eligible for a full refund. Refund policies vary based on
              the rental agreement.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">6. Liability & Insurance</h2>
            <p className="text-[var(--text-muted)] mt-2">
              The renter is responsible for any damages incurred during the
              rental period. Insurance coverage options are available and should
              be reviewed before renting.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              7. Termination of Services
            </h2>
            <p className="text-[var(--text-muted)] mt-2">
              We reserve the right to refuse or terminate service at our
              discretion if any terms are violated.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">8. Contact Us</h2>
            <p className="text-[var(--text-muted)] mt-2">
              If you have any questions about these Terms, please{" "}
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
