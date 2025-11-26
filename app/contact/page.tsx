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
import { HeaderLayout } from "@/components/header-layout"
import { FooterLayout } from "@/components/footer-layout"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact form submitted:", formData)
    alert("¡Gracias por contactarnos! Te responderemos pronto.")
    setFormData({ name: "", email: "", phone: "", message: "" })
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <HeaderLayout
        currentPage="contact"
        onBookNow={() => setIsBookingOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Hero Section */}
      <section className="pt-20 md:pt-28 lg:pt-32 pb-12 md:pb-16 lg:pb-24 bg-accent">
        <div className="container mx-auto px-3 md:px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl md:text-4xl lg:text-6xl font-light mb-3 md:mb-6 text-balance italic">
              Contáctanos
            </h1>
            <p className="text-sm md:text-base lg:text-xl text-muted-foreground leading-relaxed px-4">
              Estamos aquí para responder tus preguntas y ayudarte a agendar tu próxima cita
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-8 md:py-16 lg:py-24">
        <div className="container mx-auto px-3 md:px-4">
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <h2 className="text-lg md:text-2xl lg:text-3xl font-light mb-4 md:mb-6 italic">Envíanos un Mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="name" className="text-xs md:text-sm">Nombre Completo</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="email" className="text-xs md:text-sm">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="phone" className="text-xs md:text-sm">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="message" className="text-xs md:text-sm">Mensaje</Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="¿En qué podemos ayudarte?"
                    rows={4}
                    className="text-sm"
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-sm md:text-base">
                  Enviar Mensaje
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-lg md:text-2xl lg:text-3xl font-light mb-4 md:mb-6 italic">Información de Contacto</h2>

              <div className="space-y-4 md:space-y-6">
                <div className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">Dirección</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      123 Main Street
                      <br />
                      Your City, ST 12345
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center">
                      <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">Teléfono</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">(555) 123-4567</p>
                  </div>
                </div>

                <div className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">Email</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">info@benluxnails.com</p>
                  </div>
                </div>

                <div className="flex gap-3 md:gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 md:w-6 md:h-6 text-primary-foreground" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm md:text-base mb-1">Horario</h3>
                    <div className="text-xs md:text-sm text-muted-foreground space-y-1">
                      <p>Lunes - Viernes: 9:00 AM - 7:00 PM</p>
                      <p>Sábado: 10:00 AM - 6:00 PM</p>
                      <p>Domingo: 11:00 AM - 5:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-6 md:mt-8 bg-muted rounded-lg h-48 md:h-64 flex items-center justify-center">
                <p className="text-xs md:text-sm text-muted-foreground">Mapa de ubicación</p>
              </div>
            </div>
          </div>
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
