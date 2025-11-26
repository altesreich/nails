"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { X, Calendar, Clock } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/AuthContext"

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onAppointmentCreated?: () => void
}

interface Service {
  id: number
  name: string
  descripcion: string
  price: number
}

export function BookingModal({ isOpen, onClose, onAppointmentCreated }: BookingModalProps) {
  const { user, token } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [servicesLoading, setServicesLoading] = useState(false)
  const [formData, setFormData] = useState({
    services: [] as number[],
    date: "",
    time: "",
    notes: ""
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  // Autocompletado servicios
  const [searchService, setSearchService] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setServicesLoading(true)
    setError("")
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/services?populate=*`)
      .then(res => res.json())
      .then(data => {
        if (!data || !data.data || !Array.isArray(data.data)) return setServices([])
        setServices(
          data.data.map((item: any) => ({
            id: item.id,
            name: item.attributes?.name || item.name,
            descripcion: item.attributes?.descripcion || item.descripcion,
            price: item.attributes?.price || item.price
          }))
        )
      })
      .catch(() => setServices([]))
      .finally(() => setServicesLoading(false))
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setFormData({
        services: [],
        date: "",
        time: "",
        notes: ""
      })
      setSearchService("")
      setShowDropdown(false)
      setError("")
      setSuccess("")
    }
  }, [isOpen])

  if (!isOpen) return null

  if (!user || user.account_status !== "approved") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-10 flex flex-col items-center gap-6 border-b-4 border-pink-300">
          <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 border-2 border-pink-200 shadow-inner">
            {/* icono SVG aquí */}
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-pink-800 mb-2">Cuenta pendiente de validación</h3>
            <p className="text-base text-gray-600 font-light">
              Tu cuenta aún no ha sido validada por nuestro equipo. Cuando sea aprobada podrás agendar tus citas online.<br />
              <span className="text-primary font-medium">Te avisaremos por email en cuanto tu cuenta esté activa.</span>
            </p>
          </div>
          <Button onClick={onClose} className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded shadow-md shadow-pink-100">
            Entendido
          </Button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    const { services: selectedServices, date, time, notes } = formData
    if (selectedServices.length === 0 || !date || !time) {
      setError("Selecciona al menos un servicio, fecha y hora.")
      setLoading(false)
      return
    }

    const fechaISO = `${date}T${time}:00.000Z`

    try {
      const payload = {
        data: {
          date: fechaISO,
          appointment_status: "pending",
          notes: notes || "",
          services: selectedServices,
          users_permissions_user: user.id   // <-- CLAVE para Many-to-One
        }
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      let errorDetail
      if (!res.ok) {
        errorDetail = await res.json().catch(() => ({}));
        console.error("Error detalle Strapi:", errorDetail);
        let errorMsg = "Error desconocido al crear la cita";
        if (errorDetail.error?.message) errorMsg = errorDetail.error.message;
        else if (errorDetail.message) errorMsg = errorDetail.message;
        setError(`${res.status}: ${errorMsg}`);
        setLoading(false);
        return;
      }

      setFormData({ services: [], date: "", time: "", notes: "" })
      setSearchService("")
      setShowDropdown(false)
      setSuccess("¡Cita agendada correctamente! Recibirás confirmación en breve.")
      if (onAppointmentCreated) setTimeout(onAppointmentCreated, 500)
      setTimeout(() => {
        onClose()
        setSuccess("")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Error al reservar cita. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = services
    .filter(serv => {
      const name = (serv.name || "").toLowerCase()
      const desc = (serv.descripcion || "").toLowerCase()
      const term = searchService.toLowerCase()
      return name.includes(term) || desc.includes(term)
    })
    .filter(serv => !formData.services.includes(serv.id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <h2 className="text-2xl font-light">Agendar Cita</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close"
            disabled={loading}
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md text-red-500 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md text-green-600 text-sm">
              {success}
            </div>
          )}

          {/* Servicios mejorados: Autocompletar y lista filtrada */}
          <div className="space-y-2">
            <Label htmlFor="autocomplete-services">Buscar y seleccionar servicios</Label>
            <div className="relative">
              <Input
                id="autocomplete-services"
                type="text"
                value={searchService}
                onChange={e => {
                  setSearchService(e.target.value)
                  setShowDropdown(true)
                }}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                autoComplete="off"
                disabled={servicesLoading || loading}
                placeholder="Buscar servicio por nombre o descripción..."
                className="pl-10"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              {showDropdown && filteredServices.length > 0 && (
                <ul className="absolute z-20 left-0 w-full min-w-[220px] max-h-60 overflow-y-auto bg-white border border-muted rounded-b shadow-md mt-1">
                  {filteredServices.map(serv => (
                    <li
                      key={serv.id}
                      onMouseDown={() => {
                        setFormData({
                          ...formData,
                          services: [...formData.services, serv.id]
                        })
                        setSearchService("")
                      }}
                      className="p-3 cursor-pointer hover:bg-pink-50 text-sm transition flex flex-col"
                    >
                      <span className="font-bold text-pink-800">{serv.name}</span>
                      <span className="text-xs text-muted-foreground">{serv.descripcion}</span>
                      <span className="text-xs text-pink-500 font-semibold">{serv.price}€</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {formData.services.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.services.map(sid => {
                  const serv = services.find(s => s.id === sid)
                  if (!serv) return null
                  return (
                    <div key={sid} className="bg-pink-100 text-pink-800 px-4 py-1 rounded-full flex items-center gap-2 shadow border border-pink-200">
                      <span>{serv.name}</span>
                      <span className="text-xs font-semibold">{serv.price}€</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, services: formData.services.filter(id => id !== sid) })
                        }
                        className="ml-2 text-pink-700 hover:text-pink-900"
                        aria-label={`Quitar ${serv.name}`}>
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Fecha y Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Fecha
              </Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="focus-visible:ring-2 focus-visible:ring-primary"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Hora
              </Label>
              <Input
                id="time"
                type="time"
                required
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
                className="focus-visible:ring-2 focus-visible:ring-primary"
                disabled={loading}
              />
            </div>
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas y comentarios (opcional)</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Escribe cualquier comentario especial..."
              className="focus-visible:ring-2 focus-visible:ring-primary"
              disabled={loading}
            />
          </div>

          {/* Botones */}
          <div className="pt-4 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50"
              disabled={loading || servicesLoading || formData.services.length === 0 || !formData.date || !formData.time}
            >
              {loading ? "Reservando..." : "Confirmar Cita"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
