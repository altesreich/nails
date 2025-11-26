"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Award, Users, Shield } from "@/components/icons"
import { HeroSlider } from "@/components/hero-slider"
import { BookingModal } from "@/components/booking-modal"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"
import { useState, useEffect } from "react"
import Link from "next/link"
import { MobileNav } from "@/components/mobile-nav"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/AuthContext"

export default function Home() {
  const { user, token, logout } = useAuth()
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
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
            headers: { Authorization: `Bearer ${token}` }
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
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm font-semibold text-primary">
                Home
              </Link>
              <Link href="/about" className="text-sm hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/services" className="text-sm hover:text-primary transition-colors">
                Services
              </Link>
              <Link href="/contact" className="text-sm hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  <Button
                    onClick={() => setIsBookingOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Book Now
                  </Button>
                  <Link href="/dashboard">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Mis Citas
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link href="/dashboardadmin">
                      <Button
                        variant="outline"
                        className="bg-pink-100 border-pink-300 text-pink-700 hover:bg-pink-200 font-semibold"
                      >
                        Dashboard Admin
                      </Button>
                    </Link>
                  )}
                  <span className="text-sm text-muted-foreground">
                    Hola, {user.name || user.email}
                  </span>
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsLoginOpen(true)}
                    className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    onClick={() => setIsRegisterOpen(true)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Registrarse
                  </Button>
                </>
              )}
            </div>
            <MobileNav currentPage="home" onBookNow={() => setIsBookingOpen(true)} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <HeroSlider onBookNow={() => setIsBookingOpen(true)} />

      {/* Award Section */}
      <section className="bg-primary py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 max-w-5xl mx-auto">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-foreground rounded-full flex items-center justify-center">
                <Award className="w-16 h-16 md:w-24 md:h-24 text-primary" />
              </div>
            </div>
            <div className="text-center md:text-left text-primary-foreground">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light italic mb-4 tracking-wide">
                VOTED BEST NAIL SALON
                <br />
                IN YOUR CITY
              </h2>
              <p className="text-sm md:text-base leading-relaxed max-w-xl">
                Ben Lux Nails wants to thank you for your votes, we are so thrilled to announce we were voted{" "}
                <span className="font-semibold">GOLD</span> Best Nail Salon in Your City by the Gazette's Best of the
                Springs — 2025 & 2024.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-center mb-12 md:mb-16 text-primary font-cursive italic tracking-wide">
            Welcome to Ben Lux.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="pt-6 text-center">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-light mb-3 text-primary tracking-wide">
                  EXPERIENCE THE
                  <br />
                  DIFFERENCE
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Our nail studio was created for you to take care of your hands while we take care of your hands and
                  feet. Experience the difference with our unique salon-inspired services. Please allow additional time
                  for the experience, we are not a traditional nail salon.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="pt-6 text-center">
                <Award className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-light mb-3 text-primary tracking-wide">
                  ARTISANAL NAIL
                  <br />
                  CARE
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Our nail artists have advanced training and use the highest quality, professional-grade products for
                  all services. We meticulously care for your hands and feet and take pride in preserving the integrity
                  of your natural nails. Time is spent building relationships with all who enter our space. We accept
                  you as you are and are honored to enhance your natural beauty and personal style with gorgeous,
                  high-quality nails.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="pt-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-light mb-3 text-primary tracking-wide">
                  LIMITED SEATING BY
                  <br />
                  DESIGN
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Our studio has just three manicure stations (uncommonly far apart). The result is a unique environment
                  that combines both a sense of community with privacy.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="pt-6 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-light mb-3 text-primary tracking-wide">
                  ULTRA-HYGIENIC
                  <br />
                  PROTOCOLS
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Single-use disposable pedicure liners, metal files, and fast acting hospital-grade disinfectants are
                  among the hygienic best practices that we take seriously. We have state of the art air extraction
                  systems in place for a chemical free, odorless salon.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-center mb-8 md:mb-12 font-light tracking-wide">
            OUR SERVICES
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="relative group overflow-hidden rounded-lg aspect-[3/4]">
              <img
                src="/manicure-natural-nails.jpg"
                alt="Manicure Services"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-white text-2xl font-light">Manicures</h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg aspect-[3/4]">
              <img
                src="/pedicure-spa-feet.jpg"
                alt="Pedicure Services"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-white text-2xl font-light">Pedicures</h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg aspect-[3/4]">
              <img
                src="/nail-art-design.jpg"
                alt="Nail Art Services"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <h3 className="text-white text-2xl font-light">Nail Art</h3>
              </div>
            </div>
          </div>
          <div className="text-center mt-8 md:mt-12">
            <Link href="/services">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
              >
                VIEW ALL SERVICES
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Video Banner Section */}
      <section className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <iframe
            className="absolute top-1/2 left-1/2 w-[300%] h-[100%] md:w-[177.77vh] md:h-[56.25vw] min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            src="https://www.youtube.com/embed/XUjDsON4omw?autoplay=1&mute=1&loop=1&playlist=XUjDsON4omw&controls=0&showinfo=0&rel=0&modestbranding=1"
            title="Manicure Video"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        </div>
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex items-center justify-center px-4">
          <h2 className="font-cursive text-4xl sm:text-5xl md:text-7xl lg:text-9xl text-white italic drop-shadow-2xl text-center">
            Ben Lux Nails
          </h2>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div>
              <h3 className="font-cursive text-3xl mb-4 italic">Ben Lux</h3>
              <p className="text-sm text-muted-foreground">Your destination for natural nail beauty and care.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link>
                </li>
                <li>
                  <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">Services</Link>
                </li>
                <li>
                  <button
                    onClick={() => setIsBookingOpen(true)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Book Appointment
                  </button>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
                </li>
              </ul>
            </div>
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
          <div className="border-t border-border mt-6 md:mt-8 pt-6 md:pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Ben Lux Nails. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false)
          setIsRegisterOpen(true)
        }}
      />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false)
          setIsLoginOpen(true)
        }}
      />
    </div>
  )
}
