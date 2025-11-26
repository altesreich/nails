
"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BookingModal } from "@/components/booking-modal"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"
import { HeaderLayout } from "@/components/header-layout"
import { FooterLayout } from "@/components/footer-layout"

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <HeaderLayout
        currentPage="services"
        onBookNow={() => setIsBookingOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Hero Section */}
      <section className="pt-20 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-24 bg-accent">
        <div className="container mx-auto px-3 md:px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-light mb-3 md:mb-6 text-balance italic">
              Nuestros Servicios
            </h1>
            <p className="text-sm md:text-base lg:text-xl text-muted-foreground leading-relaxed px-4">
              Descubre nuestra gama completa de servicios de cuidado de uñas diseñados para realzar tu belleza natural
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-8 md:py-16 lg:py-24">
        <div className="container mx-auto px-3 md:px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-lg md:text-2xl font-light mb-2 md:mb-3 italic text-primary">{service.title}</h3>
                <p className="text-xs md:text-sm lg:text-base text-muted-foreground mb-3 md:mb-4 leading-relaxed">{service.description}</p>
                <div className="flex justify-between items-center pt-3 md:pt-4 border-t border-border">
                  <span className="text-lg md:text-2xl font-light text-primary">{service.price}</span>
                  <span className="text-xs md:text-sm text-muted-foreground">{service.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-8 md:py-16 lg:py-24 bg-accent">
        <div className="container mx-auto px-3 md:px-4">
          <h2 className="text-xl md:text-3xl lg:text-4xl text-center mb-6 md:mb-12 font-light italic">
            Galería de Trabajos
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 lg:gap-4 max-w-6xl mx-auto">
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
                  <span className="text-white text-xs md:text-sm font-light">Ver imagen</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 md:p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Gallery image"
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button
              className="absolute top-3 right-3 md:top-4 md:right-4 text-white text-3xl md:text-4xl hover:text-primary transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-8 md:py-16 lg:py-24">
        <div className="container mx-auto px-3 md:px-4 text-center">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-light mb-3 md:mb-6 italic">
            ¿Lista para reservar tu cita?
          </h2>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground mb-4 md:mb-8 max-w-2xl mx-auto leading-relaxed">
            Contáctanos hoy y experimenta el lujo y la excelencia en el cuidado de tus uñas
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-primary hover:bg-primary/90 px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-6 text-xs md:text-sm lg:text-base">
              RESERVAR AHORA
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <FooterLayout onBookNow={() => setIsBookingOpen(true)} />

      {/* Modals */}
    </div>
  )
}
