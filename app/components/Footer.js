import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer w-full py-10 border-t border-[var(--border-color)] bg-[var(--section-bg)] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left">
        {/* Left Section: Copyright */}
        <p className="text-lg text-[var(--foreground)] opacity-80">
          © {new Date().getFullYear()} Vehicle Rental. All rights reserved.
        </p>

        {/* Center Section: Navigation Links */}
        <nav className="flex flex-wrap justify-center gap-6 mt-4 md:mt-0">
          {[
            { href: "/privacy-policy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms of Service" },
            { href: "/contact", label: "Contact Us" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="relative text-lg font-semibold text-[var(--foreground)] opacity-90 transition-all duration-300 
              hover:text-[var(--btn-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--btn-bg)] rounded
              before:content-[''] before:absolute before:left-1/2 before:bottom-0 before:w-0 before:h-[3px] 
              before:bg-[var(--btn-bg)] before:transition-all before:duration-300 before:transform before:-translate-x-1/2
              hover:before:w-full"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Section: Social Media Links */}
        <div className="flex space-x-6 mt-5 md:mt-0">
          {[
            {
              href: "https://github.com",
              src: "/github.svg",
              alt: "Github",
            },
            {
              href: "https://linkedin.com",
              src: "/linkedin.svg",
              alt: "Linkedin",
            },
            {
              href: "https://instagram.com",
              src: "/instagram.svg",
              alt: "Instagram",
            },
          ].map(({ href, src, alt }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={alt}
              className="relative p-3 rounded-full bg-transparent transition-all duration-300 
              hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--btn-bg)]
              before:content-[''] before:absolute before:inset-0 before:rounded-full before:border 
              before:border-transparent before:transition-all before:duration-300 hover:before:border-[var(--btn-bg)]"
            >
              <Image src={src} alt={alt} width={32} height={32} />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
