"use client";

import { useEffect, useState, useCallback } from "react";
import { Sun, Moon, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Handle Dark Mode & Auth Status on Mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const isDark = storedTheme === "dark" || (!storedTheme && prefersDark);

    document.documentElement.classList.toggle("dark", isDark);
    setIsDarkMode(isDark);

    // Check if user is logged in
    const user = localStorage.getItem("token"); // Replace with actual auth logic
    setIsLoggedIn(!!user);

    // Listen for system theme changes
    const handleSystemThemeChange = (e) => {
      const newIsDark = e.matches;
      document.documentElement.classList.toggle("dark", newIsDark);
      setIsDarkMode(newIsDark);
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleSystemThemeChange);

    setMounted(true); // Prevent hydration error

    return () =>
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  // Dark Mode Toggle (Memoized)
  const toggleDarkMode = useCallback(() => {
    const newTheme = isDarkMode ? "light" : "dark";
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode]);

  // Toggle Mobile Menu (Memoized)
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  return (
    <header className="header fixed top-0 left-0 w-full z-50 backdrop-blur-lg border-b border-[var(--border-color)] shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-4">
        {/* Admin */}
        <Link
          href="/admin"
          className="text-2xl font-bold text-[var(--foreground)] hover:scale-105 transition-transform"
        >
          Admin
        </Link>

        {/* Auth Button */}
        <Link
          href={isLoggedIn ? "/dashboard" : "/login"}
          className="text-2xl font-bold text-[var(--foreground)] hover:scale-105 transition-transform"
        >
          {isLoggedIn ? "Dashboard" : "Login"}
        </Link>

        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-[var(--foreground)] hover:scale-105 transition-transform"
        >
          Vehicle Rental
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-lg">
          {[
            { href: "/vehicles", label: "Vehicles" },
            { href: "/pricing", label: "Pricing" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="nav-link hover:text-[var(--link-hover)] transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right Side Controls */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Toggle */}
          {mounted && (
            <button
              onClick={toggleDarkMode}
              className="icon-btn"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6 text-yellow-500 transition-all duration-300 scale-110" />
              ) : (
                <Moon className="w-6 h-6 text-[var(--foreground)] transition-all duration-300 scale-110" />
              )}
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            className="icon-btn md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle Mobile Menu"
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-[var(--navbar-bg)] border-b border-[var(--border-color)] shadow-md md:hidden">
          <nav className="flex flex-col items-center py-4 space-y-3 text-lg">
            {[
              { href: "/vehicles", label: "Vehicles" },
              { href: "/pricing", label: "Pricing" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="block w-full text-center py-2 px-4 rounded-lg text-white hover:bg-[var(--btn-bg)] transition-colors duration-200"
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
