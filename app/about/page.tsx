"use client"

import { Button } from "@/components/ui/button"
import { Award, Heart, Sparkles, Users } from "@/components/icons"
import Link from "next/link"
import { BookingModal } from "@/components/booking-modal"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"
import { useState, useEffect } from "react"
import { HeaderLayout } from "@/components/header-layout"
import { FooterLayout } from "@/components/footer-layout"
import { useAuth } from "@/components/AuthContext"

export default function AboutPage() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <HeaderLayout
        currentPage="about"
        onBookNow={() => setIsBookingOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Hero Section */}
      <section className="pt-20 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-24 bg-accent">
        <div className="container mx-auto px-3 md:px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-light mb-3 md:mb-6 text-balance italic">
              Sobre Nosotros
            </h1>
            <p className="text-sm md:text-base lg:text-xl text-muted-foreground leading-relaxed px-4">
              Descubre la historia detrás de Ben Lux Nails y nuestra pasión por el cuidado natural de las uñas
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-8 md:py-16 lg:py-24">
        <div className="container mx-auto px-3 md:px-4">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            <div>
              <img
                src="/professional-nail-technician.jpg"
                alt="Professional nail technician"
                className="rounded-lg shadow-lg w-full h-48 md:h-80 lg:h-96 object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl md:text-3xl lg:text-4xl font-light mb-3 md:mb-6 text-primary italic">
                Nuestra Historia
              </h2>
              <div className="space-y-3 md:space-y-4 text-xs md:text-sm lg:text-base text-muted-foreground leading-relaxed">
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
      <section className="py-8 md:py-16 lg:py-24 bg-accent">
        <div className="container mx-auto px-3 md:px-4">
          <h2 className="text-xl md:text-3xl lg:text-4xl text-center mb-8 md:mb-12 lg:mb-16 font-light italic">
            Nuestros Valores
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Sparkles className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
              </div>
              <h3 className="text-sm md:text-lg lg:text-xl font-light mb-2 md:mb-3">
                EXCELENCIA
              </h3>
              <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                Nos comprometemos a ofrecer servicios de la más alta calidad en cada visita
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Heart className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
              </div>
              <h3 className="text-sm md:text-lg lg:text-xl font-light mb-2 md:mb-3">
                CUIDADO
              </h3>
              <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                Tu bienestar y la salud de tus uñas son nuestra prioridad número uno
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Users className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
              </div>
              <h3 className="text-sm md:text-lg lg:text-xl font-light mb-2 md:mb-3">
                COMUNIDAD
              </h3>
              <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                Creamos un espacio acogedor donde todos son bienvenidos y valorados
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <Award className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground" />
              </div>
              <h3 className="text-sm md:text-lg lg:text-xl font-light mb-2 md:mb-3">
                INNOVACIÓN
              </h3>
              <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                Siempre buscamos las últimas técnicas y productos para mejorar tu experiencia
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-8 md:py-16 lg:py-24">
        <div className="container mx-auto px-3 md:px-4">
          <h2 className="text-xl md:text-3xl lg:text-4xl text-center mb-6 md:mb-12 font-light italic">
            Nuestro Equipo
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <img
                src="/professional-manicurist.jpg"
                alt="Team member"
                className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full mx-auto mb-3 md:mb-4 object-cover"
              />
              <h3 className="text-sm md:text-lg font-light mb-1">María González</h3>
              <p className="text-xs md:text-sm text-primary mb-1 md:mb-2">Fundadora & Nail Artist</p>
              <p className="text-xs md:text-sm text-muted-foreground">15 años de experiencia en nail art</p>
            </div>

            <div className="text-center">
              <img
                src="/professional-manicurist.jpg"
                alt="Team member"
                className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full mx-auto mb-3 md:mb-4 object-cover"
              />
              <h3 className="text-sm md:text-lg font-light mb-1">Sofia Rodríguez</h3>
              <p className="text-xs md:text-sm text-primary mb-1 md:mb-2">Senior Nail Technician</p>
              <p className="text-xs md:text-sm text-muted-foreground">Especialista en manicure natural</p>
            </div>

            <div className="text-center">
              <img
                src="/professional-manicurist.jpg"
                alt="Team member"
                className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-full mx-auto mb-3 md:mb-4 object-cover"
              />
              <h3 className="text-sm md:text-lg font-light mb-1">Ana Martínez</h3>
              <p className="text-xs md:text-sm text-primary mb-1 md:mb-2">Pedicure Specialist</p>
              <p className="text-xs md:text-sm text-muted-foreground">Experta en tratamientos spa</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 md:py-16 lg:py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-3 md:px-4 text-center">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-light mb-3 md:mb-6 italic">
            ¿Lista para experimentar la diferencia?
          </h2>
          <p className="text-sm md:text-base lg:text-lg mb-4 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Agenda tu cita hoy y descubre por qué somos el salón de uñas mejor valorado de la ciudad
          </p>
          <Link href="/contact">
            <Button size="lg" variant="secondary" className="px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-6 text-xs md:text-sm lg:text-base">
              CONTÁCTANOS
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <FooterLayout onBookNow={() => setIsBookingOpen(true)} />

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
