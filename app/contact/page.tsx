"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Phone, Mail, Clock } from "@/components/icons"
import Link from "next/link"
import { useState, useEffect } from "react"
import { BookingModal } from "@/components/booking-modal"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"
import { MobileNav } from "@/components/mobile-nav"
import { useAuth } from "@/components/AuthContext"

export default function ContactPage() {
  const { user, token, logout } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact form submitted:", formData)
    alert("¡Gracias por contactarnos! Te responderemos pronto.")
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="font-cursive text-2xl md:text-3xl italic">
              Ben Lux Nails
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-sm hover:text-primary transition-colors">
                About
              </Link>
              <Link href="/services" className="text-sm hover:text-primary transition-colors">
                Services
              </Link>
              <Link href="/contact" className="text-sm text-primary font-semibold">
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
                    <Button
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
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

            <MobileNav currentPage="contact" onBookNow={() => setIsBookingOpen(true)} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 lg:pb-24 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light mb-4 md:mb-6 text-balance italic">
              Contáctanos
            </h1>
            <p className="text-base md:text-xl text-muted-foreground leading-relaxed">
              Estamos aquí para responder tus preguntas y ayudarte a agendar tu próxima cita
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl md:text-3xl font-light mb-4 md:mb-6 italic">Envíanos un Mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="¿En qué podemos ayudarte?"
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Enviar Mensaje
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl md:text-3xl font-light mb-4 md:mb-6 italic">Información de Contacto</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Dirección</h3>
                    <p className="text-muted-foreground">
                      123 Main Street
                      <br />
                      Your City, ST 12345
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Phone className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Teléfono</h3>
                    <p className="text-muted-foreground">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-muted-foreground">info@benluxnails.com</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Horario</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p>Lunes - Viernes: 9:00 AM - 7:00 PM</p>
                      <p>Sábado: 10:00 AM - 6:00 PM</p>
                      <p>Domingo: 11:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 bg-muted rounded-lg h-64 flex items-center justify-center">
                <p className="text-muted-foreground">Mapa de ubicación</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div>
              <h3 className="font-cursive text-3xl mb-4">Ben Lux Nails</h3>
              <p className="text-sm text-muted-foreground">Tu destino para la belleza y cuidado natural de las uñas.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    Sobre Nosotros
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>123 Main Street</li>
                <li>Your City, ST 12345</li>
                <li>Teléfono: (555) 123-4567</li>
                <li>info@benluxnails.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Ben Lux Nails. Todos los derechos reservados.</p>
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
