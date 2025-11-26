"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface MobileNavProps {
  currentPage?: string
  onBookNow?: () => void
  isLoggedIn?: boolean  // Agrega esta línea
}

export function MobileNav({ currentPage, onBookNow, isLoggedIn }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className={`w-6 h-0.5 bg-foreground transition-all ${isOpen ? "rotate-45 translate-y-2" : ""}`} />
        <span className={`w-6 h-0.5 bg-foreground transition-all ${isOpen ? "opacity-0" : ""}`} />
        <span className={`w-6 h-0.5 bg-foreground transition-all ${isOpen ? "-rotate-45 -translate-y-2" : ""}`} />
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-background md:hidden" onClick={() => setIsOpen(false)}>
          <div className="flex flex-col items-center justify-center h-full gap-8">
            <Link
              href="/"
              className={`text-2xl ${currentPage === "home" ? "text-primary font-semibold" : "hover:text-primary"} transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-2xl ${currentPage === "about" ? "text-primary font-semibold" : "hover:text-primary"} transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              href="/services"
              className={`text-2xl ${currentPage === "services" ? "text-primary font-semibold" : "hover:text-primary"} transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              Services
            </Link>
            <Link
              href="/contact"
              className={`text-2xl ${currentPage === "contact" ? "text-primary font-semibold" : "hover:text-primary"} transition-colors`}
              onClick={() => setIsOpen(false)}
            >
              Contact Us
            </Link>
            
            {/* Mostrar botones solo si el usuario está logueado */}
            {isLoggedIn && onBookNow && (
              <>
                <Button
                  onClick={() => {
                    setIsOpen(false)
                    onBookNow()
                  }}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  Book Now
                </Button>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Dashboard
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}
