"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "@/components/icons"
import { Button } from "@/components/ui/button"

interface HeroSliderProps {
  onBookNow?: () => void
}

const slides = [
  {
    image: "/luxury-nail-salon-manicure-hands.jpg",
    title: "BEN LUX NAILS",
    subtitle:
      "Your city's high end, natural nail salon dedicated to bringing clients the very best in natural nail beauty and care.",
  },
  {
    image: "/manicure-natural-nails.jpg",
    title: "ARTISANAL NAIL CARE",
    subtitle: "Experience the difference with our unique salon-inspired services and professional-grade products.",
  },
  {
    image: "/pedicure-spa-feet.jpg",
    title: "LUXURY SPA EXPERIENCE",
    subtitle: "Relax and rejuvenate with our premium pedicure services in a serene environment.",
  },
  {
    image: "/nail-art-design.jpg",
    title: "CREATIVE NAIL ART",
    subtitle: "Express your personal style with our custom nail art designs and expert craftsmanship.",
  },
]

export function HeroSlider({ onBookNow }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-animated-gradient">
      {/* Floating accents */}
      <div className="pointer-events-none absolute -top-8 -left-8 w-48 h-48 rounded-full blur-3xl bg-gradient-to-r from-pink-400 to-purple-400 opacity-30 animate-float-slow" />
      <div className="pointer-events-none absolute -bottom-10 -right-10 w-56 h-56 rounded-full blur-3xl bg-gradient-to-r from-rose-300 to-indigo-400 opacity-25 animate-float" />
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('${slide.image}')`,
            }}
          >
            <div className="absolute inset-0 bg-black/40" />
          </div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <div className="mb-8">
          <div className="font-cursive text-7xl md:text-8xl mb-2 italic animate-float">Ben Lux</div>
          <div className="text-sm tracking-[0.3em] uppercase font-light">NAILS</div>
        </div>

        <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed text-balance">
          {slides[currentSlide].subtitle}
        </p>

        <Button
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base transform transition-transform hover:-translate-y-1 hover:scale-105 shimmer"
          onClick={onBookNow}
        >
          BOOK NOW
        </Button>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-12 h-12" />
      </button>

      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white/80 hover:text-white transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="w-12 h-12" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
