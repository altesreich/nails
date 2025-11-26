"use client"

import Link from "next/link"

interface FooterLayoutProps {
  onBookNow?: () => void
}

export function FooterLayout({ onBookNow = () => {} }: FooterLayoutProps) {
  return (
    <footer className="bg-muted py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {/* Brand Section */}
          <div>
            <h3 className="font-cursive text-3xl mb-4 italic">Ben Lux</h3>
            <p className="text-sm text-muted-foreground">
              Your destination for natural nail beauty and care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <button
                  onClick={onBookNow}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Book Appointment
                </button>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>123 Main Street</li>
              <li>Your City, ST 12345</li>
              <li>Phone: (555) 123-4567</li>
              <li>info@artivanails.com</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border mt-6 md:mt-8 pt-6 md:pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Ben Lux Nails. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
