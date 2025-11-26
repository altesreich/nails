"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MobileNav } from "@/components/mobile-nav"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/AuthContext"

interface HeaderLayoutProps {
  currentPage?: "home" | "about" | "services" | "contact"
  onBookNow?: () => void
  onOpenLogin?: () => void
  onOpenRegister?: () => void
}

export function HeaderLayout({
  currentPage = "home",
  onBookNow = () => {},
  onOpenLogin = () => {},
  onOpenRegister = () => {},
}: HeaderLayoutProps) {
  const { user, logout, token } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  // Verificar si el usuario es admin o adminails
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user || !token) {
        setIsAdmin(false)
        return
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/users/me?populate=role`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )

        if (res.ok) {
          const userData = await res.json()
          const roleName = userData.role?.name || userData.role?.type

          // Verificar si el rol es admin o adminails
          if (roleName === "admin" || roleName === "adminails") {
            setIsAdmin(true)
          } else {
            setIsAdmin(false)
          }
        }
      } catch (e) {
        console.error("Error verificando rol:", e)
        setIsAdmin(false)
      }
    }

    checkAdminRole()
  }, [user, token])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Logo */}
          <Link href="/" className="font-cursive text-xl md:text-3xl italic flex-shrink-0">
            Ben Lux Nails
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            <Link
              href="/"
              className={`text-sm transition-colors ${
                currentPage === "home" ? "font-semibold text-primary" : "hover:text-primary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-colors ${
                currentPage === "about" ? "font-semibold text-primary" : "hover:text-primary"
              }`}
            >
              About
            </Link>
            <Link
              href="/services"
              className={`text-sm transition-colors ${
                currentPage === "services" ? "font-semibold text-primary" : "hover:text-primary"
              }`}
            >
              Services
            </Link>
            <Link
              href="/contact"
              className={`text-sm transition-colors ${
                currentPage === "contact" ? "font-semibold text-primary" : "hover:text-primary"
              }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Desktop Auth & Actions - Hidden on tablet and mobile */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <Button
                  onClick={onBookNow}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                >
                  Book Now
                </Button>
                <Link href="/dashboard">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap">
                    Mis Citas
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/dashboardadmin">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-pink-100 border-pink-300 text-pink-700 hover:bg-pink-200 font-semibold whitespace-nowrap"
                    >
                      Admin
                    </Button>
                  </Link>
                )}
                <div className="hidden xl:block h-4 w-px bg-border" />
                <span className="hidden xl:inline text-xs text-muted-foreground">
                  {user.name || user.email}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={logout}
                  className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground whitespace-nowrap"
                >
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onOpenLogin}
                  className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground whitespace-nowrap"
                >
                  Ingresar
                </Button>
                <Button
                  size="sm"
                  onClick={onOpenRegister}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                >
                  Registrarse
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <MobileNav 
            currentPage={currentPage} 
            onBookNow={onBookNow}
            onOpenLogin={onOpenLogin}
            onOpenRegister={onOpenRegister}
            user={user}
            isAdmin={isAdmin}
            logout={logout}
          />
        </div>
      </div>
    </nav>
  )
}
