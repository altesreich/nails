"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import type { User } from "@/components/AuthContext"

interface MobileNavProps {
  currentPage?: string
  onBookNow?: () => void
  onOpenLogin?: () => void
  onOpenRegister?: () => void
  user?: User | null
  isAdmin?: boolean
  logout?: () => void
}

export function MobileNav({ 
  currentPage, 
  onBookNow, 
  onOpenLogin,
  onOpenRegister,
  user,
  isAdmin,
  logout
}: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => setIsOpen(false)

  return (
    <>
      {/* Hamburger Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden flex flex-col gap-1.5 p-2 -mr-2"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40 bg-black/20 lg:hidden" 
            onClick={handleClose}
          />
          
          {/* Menu Sidebar */}
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="flex flex-col w-full max-w-xs bg-background shadow-lg ml-auto mt-16 max-h-[calc(100vh-64px)] overflow-y-auto">
              {/* Navigation Links */}
              <div className="border-b border-border">
                <Link
                  href="/"
                  className={`block px-6 py-4 text-lg font-medium transition-colors ${
                    currentPage === "home" ? "text-primary bg-accent" : "hover:bg-accent hover:text-primary"
                  }`}
                  onClick={handleClose}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className={`block px-6 py-4 text-lg font-medium transition-colors ${
                    currentPage === "about" ? "text-primary bg-accent" : "hover:bg-accent hover:text-primary"
                  }`}
                  onClick={handleClose}
                >
                  About
                </Link>
                <Link
                  href="/services"
                  className={`block px-6 py-4 text-lg font-medium transition-colors ${
                    currentPage === "services" ? "text-primary bg-accent" : "hover:bg-accent hover:text-primary"
                  }`}
                  onClick={handleClose}
                >
                  Services
                </Link>
                <Link
                  href="/contact"
                  className={`block px-6 py-4 text-lg font-medium transition-colors ${
                    currentPage === "contact" ? "text-primary bg-accent" : "hover:bg-accent hover:text-primary"
                  }`}
                  onClick={handleClose}
                >
                  Contact Us
                </Link>
              </div>

              {/* Action Buttons */}
              <div className="border-b border-border px-4 py-4 space-y-2">
                {user ? (
                  <>
                    <Button
                      onClick={() => {
                        onBookNow?.()
                        handleClose()
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="sm"
                    >
                      Book Now
                    </Button>
                    <Link href="/dashboard" onClick={handleClose} className="block">
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        size="sm"
                      >
                        Mis Citas
                      </Button>
                    </Link>
                    {isAdmin && (
                      <Link href="/dashboardadmin" onClick={handleClose} className="block">
                        <Button
                          className="w-full bg-pink-100 border-pink-300 text-pink-700 hover:bg-pink-200 font-semibold"
                          size="sm"
                        >
                          Dashboard Admin
                        </Button>
                      </Link>
                    )}
                    <div className="border-t border-border my-2 pt-2">
                      <p className="text-sm text-muted-foreground mb-2">
                        {user.name || user.email}
                      </p>
                      <Button
                        onClick={() => {
                          logout?.()
                          handleClose()
                        }}
                        variant="outline"
                        className="w-full bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                        size="sm"
                      >
                        Cerrar Sesión
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        onOpenLogin?.()
                        handleClose()
                      }}
                      className="w-full bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      size="sm"
                    >
                      Iniciar Sesión
                    </Button>
                    <Button
                      onClick={() => {
                        onOpenRegister?.()
                        handleClose()
                      }}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="sm"
                    >
                      Registrarse
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
