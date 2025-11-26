"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Sparkles, Award, Users, Shield } from "@/components/icons"
import { HeroSlider } from "@/components/hero-slider"
import { BookingModal } from "@/components/booking-modal"
import { LoginModal } from "@/components/login-modal"
import { RegisterModal } from "@/components/register-modal"
import { useState } from "react"
import Link from "next/link"
import { HeaderLayout } from "@/components/header-layout"
import { FooterLayout } from "@/components/footer-layout"

export default function Home() {
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Header */}
      <HeaderLayout
        currentPage="home"
        onBookNow={() => setIsBookingOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      {/* Hero Section */}
      <HeroSlider onBookNow={() => setIsBookingOpen(true)} />

      {/* Award Section */}
      <section className="bg-primary py-8 md:py-16 lg:py-24">
        <div className="container mx-auto px-3 md:px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 lg:gap-12 max-w-5xl mx-auto">
            <div className="flex-shrink-0">
              <div className="w-28 h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-foreground rounded-full flex items-center justify-center">
                <Award className="w-12 h-12 md:w-16 md:h-16 lg:w-24 lg:h-24 text-primary" />
              </div>
            </div>
            <div className="text-center md:text-left text-primary-foreground">
              <h2 className="text-lg md:text-2xl lg:text-4xl font-light italic mb-2 md:mb-4 tracking-wide">
                VOTED BEST NAIL SALON
                <br />
                IN YOUR CITY
              </h2>
              <p className="text-xs md:text-sm lg:text-base leading-relaxed max-w-xl">
                Ben Lux Nails wants to thank you for your votes, we are so thrilled to announce we were voted{" "}
                <span className="font-semibold">GOLD</span> Best Nail Salon in Your City by the Gazette's Best of the
                Springs — 2025 & 2024.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-8 md:py-16 lg:py-24 bg-accent">
        <div className="container mx-auto px-3 md:px-4">
          <h2 className="text-lg md:text-2xl lg:text-4xl text-center mb-6 md:mb-12 lg:mb-16 text-primary font-cursive italic tracking-wide">
            Welcome to Ben Lux.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="pt-4 md:pt-6 text-center">
                <Sparkles className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-primary" />
                <h3 className="text-sm md:text-lg lg:text-xl font-light mb-2 md:mb-3 text-primary tracking-wide">
                  EXPERIENCE THE
                  <br />
                  DIFFERENCE
                </h3>
                <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                  Our nail studio was created for you to take care of your hands while we take care of your hands and
                  feet. Experience the difference with our unique salon-inspired services.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="pt-4 md:pt-6 text-center">
                <Award className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-primary" />
                <h3 className="text-sm md:text-lg lg:text-xl font-light mb-2 md:mb-3 text-primary tracking-wide">
                  ARTISANAL NAIL
                  <br />
                  CARE
                </h3>
                <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                  Our nail artists have advanced training and use the highest quality, professional-grade products for
                  all services. We meticulously care for your hands and feet.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="pt-4 md:pt-6 text-center">
                <Users className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-primary" />
                <h3 className="text-sm md:text-lg lg:text-xl font-light mb-2 md:mb-3 text-primary tracking-wide">
                  LIMITED SEATING BY
                  <br />
                  DESIGN
                </h3>
                <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                  Our studio has just three manicure stations (uncommonly far apart). The result is a unique environment
                  that combines community with privacy.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-none bg-transparent">
              <CardContent className="pt-4 md:pt-6 text-center">
                <Shield className="w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 text-primary" />
                <h3 className="text-sm md:text-lg lg:text-xl font-light mb-2 md:mb-3 text-primary tracking-wide">
                  ULTRA-HYGIENIC
                  <br />
                  PROTOCOLS
                </h3>
                <p className="text-xs md:text-sm leading-relaxed text-muted-foreground">
                  Single-use disposable pedicure liners, metal files, and hospital-grade disinfectants are among the best
                  practices we take seriously.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-8 md:py-16 lg:py-24">
        <div className="container mx-auto px-3 md:px-4">
          <h2 className="text-lg md:text-2xl lg:text-4xl text-center mb-6 md:mb-12 font-light tracking-wide">
            OUR SERVICES
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
            <div className="relative group overflow-hidden rounded-lg aspect-[3/4]">
              <img
                src="/manicure-natural-nails.jpg"
                alt="Manicure Services"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 md:p-6">
                <h3 className="text-white text-lg md:text-2xl font-light">Manicures</h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg aspect-[3/4]">
              <img
                src="/pedicure-spa-feet.jpg"
                alt="Pedicure Services"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 md:p-6">
                <h3 className="text-white text-lg md:text-2xl font-light">Pedicures</h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg aspect-[3/4]">
              <img
                src="/nail-art-design.jpg"
                alt="Nail Art Services"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 md:p-6">
                <h3 className="text-white text-lg md:text-2xl font-light">Nail Art</h3>
              </div>
            </div>
          </div>
          <div className="text-center mt-6 md:mt-12">
            <Link href="/services">
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent text-sm md:text-base"
              >
                VIEW ALL SERVICES
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Video Banner Section */}
      <section className="relative h-[40vh] md:h-[50vh] lg:h-[70vh] overflow-hidden">
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
          <h2 className="font-cursive text-2xl sm:text-4xl md:text-6xl lg:text-9xl text-white italic drop-shadow-2xl text-center">
            Ben Lux Nails
          </h2>
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
