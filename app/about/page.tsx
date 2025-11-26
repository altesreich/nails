"use client"

import { Button } from "@/components/ui/button"
import { Award, Heart, Sparkles, Users } from "@/components/icons"
import Link from "next/link"
import { BookingModal } from "@/components/booking-modal"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"
import { useState, useEffect } from "react"
import { MobileNav } from "@/components/mobile-nav"
import { useAuth } from "@/components/AuthContext"

export default function AboutPage() {
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
            <Link href="/" className="font-cursive text-2xl md:text-3xl italic">
              Ben Lux Nails
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-sm hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-sm text-primary font-semibold">
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

            <MobileNav currentPage="about" onBookNow={() => setIsBookingOpen(true)} />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-16 lg:pb-24 bg-accent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-light mb-4 md:mb-6 text-balance italic">
              Sobre Nosotros
            </h1>
            <p className="text-base md:text-xl text-muted-foreground leading-relaxed">
              Descubre la historia detrás de Ben Lux Nails y nuestra pasión por el cuidado natural de las uñas
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
            <div>
              <img
                src="/professional-nail-technician.jpg"
                alt="Professional nail technician"
                className="rounded-lg shadow-lg w-full h-64 md:h-96 lg:h-[500px] object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6 text-primary italic">
                Nuestra Historia
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Ben Lux Nails nació de una visión: crear un espacio donde el cuidado de las uñas se eleva a una forma
                  de arte. Fundado en 2020, nuestro salón se ha convertido en el destino preferido para quienes buscan
                  excelencia en el cuidado natural de las uñas.
                </p>
                <p>
                  Nos especializamos en técnicas artesanales que preservan la integridad de tus uñas naturales,
                  utilizando únicamente productos de grado profesional y las últimas innovaciones en el cuidado de uñas.
                </p>
                <p>
                  Cada miembro de nuestro equipo es un artista capacitado que comparte nuestra pasión por la excelencia
                  y el servicio personalizado. Creemos que cada cliente merece una experiencia única y memorable.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-accent">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-center mb-12 md:mb-16 font-light italic">
            Nuestros Valores
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-light mb-3">Excelencia</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nos comprometemos a ofrecer servicios de la más alta calidad en cada visita
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-light mb-3">Cuidado</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Tu bienestar y la salud de tus uñas son nuestra prioridad número uno
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-light mb-3">Comunidad</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Creamos un espacio acogedor donde todos son bienvenidos y valorados
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-light mb-3">Innovación</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Siempre buscamos las últimas técnicas y productos para mejorar tu experiencia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-12 md:py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-center mb-8 md:mb-12 font-light italic">
            Nuestro Equipo
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <img
                src="/professional-manicurist.jpg"
                alt="Team member"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-light mb-1">María González</h3>
              <p className="text-sm text-primary mb-2">Fundadora & Nail Artist</p>
              <p className="text-sm text-muted-foreground">15 años de experiencia en nail art</p>
            </div>

            <div className="text-center">
              <img
                src="/professional-manicurist.jpg"
                alt="Team member"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-light mb-1">Sofia Rodríguez</h3>
              <p className="text-sm text-primary mb-2">Senior Nail Technician</p>
              <p className="text-sm text-muted-foreground">Especialista en manicure natural</p>
            </div>

            <div className="text-center">
              <img
                src="/professional-manicurist.jpg"
                alt="Team member"
                className="w-48 h-48 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-light mb-1">Ana Martínez</h3>
              <p className="text-sm text-primary mb-2">Pedicure Specialist</p>
              <p className="text-sm text-muted-foreground">Experta en tratamientos spa</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-light mb-4 md:mb-6 italic">
            ¿Lista para experimentar la diferencia?
          </h2>
          <p className="text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Agenda tu cita hoy y descubre por qué somos el salón de uñas mejor valorado de la ciudad
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="px-6 md:px-8 py-4 md:py-6 text-sm md:text-base">
              CONTÁCTANOS
            </Button>
          </Link>
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
