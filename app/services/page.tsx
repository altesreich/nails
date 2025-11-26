
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BookingModal } from "@/components/booking-modal"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"
import { MobileNav } from "@/components/mobile-nav"
import { useAuth } from "@/components/AuthContext"

const services = [
  {
    title: "Manicure Clásico",
    description: "Cuidado completo de uñas con forma, cutícula y pulido perfecto",
    price: "$35",
    duration: "45 min",
  },
  {
    title: "Manicure de Lujo",
    description: "Incluye exfoliación, masaje de manos y tratamiento hidratante",
    price: "$55",
    duration: "60 min",
  },
  {
    title: "Pedicure Spa",
    description: "Experiencia relajante con baño de pies, exfoliación y masaje",
    price: "$65",
    duration: "75 min",
  },
  {
    title: "Nail Art",
    description: "Diseños personalizados y creativos para expresar tu estilo",
    price: "Desde $45",
    duration: "60 min",
  },
  {
    title: "Gel Polish",
    description: "Esmalte de larga duración con acabado brillante hasta 3 semanas",
    price: "$45",
    duration: "60 min",
  },
  {
    title: "Tratamiento Fortalecedor",
    description: "Tratamiento especializado para uñas débiles o dañadas",
    price: "$40",
    duration: "45 min",
  },
]

const galleryImages = [
  { src: "/luxury-nail-salon-manicure-hands.jpg", alt: "Manicure elegante" },
  { src: "/manicure-natural-nails.jpg", alt: "Uñas naturales" },
  { src: "/pedicure-spa-feet.jpg", alt: "Pedicure spa" },
  { src: "/nail-art-design.jpg", alt: "Diseño de uñas" },
  { src: "/professional-nail-technician.jpg", alt: "Técnica profesional" },
  { src: "/professional-manicurist.jpg", alt: "Manicurista profesional" },
]

export default function ServicesPage() {
  const { user, token, logout } = useAuth()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
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
              <Link href="/services" className="text-sm text-primary font-semibold">
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

            <MobileNav currentPage="services" onBookNow={() => setIsBookingOpen(true)} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 lg:pb-24 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light mb-4 md:mb-6 text-balance italic">
              Nuestros Servicios
            </h1>
            <p className="text-base md:text-xl text-muted-foreground leading-relaxed">
              Descubre nuestra gama completa de servicios de cuidado de uñas diseñados para realzar tu belleza natural
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-2xl font-light mb-3 italic text-primary">{service.title}</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-border">
                  <span className="text-2xl font-light text-primary">{service.price}</span>
                  <span className="text-sm text-muted-foreground">{service.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-center mb-8 md:mb-12 font-light italic">
            Galería de Trabajos
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-6xl mx-auto">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => setSelectedImage(image.src)}
              >
                <img
                  src={image.src || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-sm font-light">Ver imagen</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Gallery image"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              className="absolute top-4 right-4 text-white text-4xl hover:text-primary transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6 italic">
            ¿Lista para reservar tu cita?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Contáctanos hoy y experimenta el lujo y la excelencia en el cuidado de tus uñas
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary/90 px-6 md:px-8 py-4 md:py-6 text-sm md:text-base">
              RESERVAR AHORA
            </Button>
          </Link>
        </div>
      </section>

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
    </div>
  )
}
