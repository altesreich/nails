"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/loader";
import Link from "next/link";
import { BookingModal } from "@/components/booking-modal";
import { LoginModal } from "@/components/login-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ServiceType {
  id: number;
  name: string;
  price: number;
}

interface Appointment {
  id: number;
  date: string;
  appointment_status: string;
  notes?: string;
  services: ServiceType[];
  users_permissions_user?: any;
}

type RawAppointment = { [key: string]: any };

const estadoLabels: Record<string, string> = {
  approved: "Aprobada",
  pending: "Pendiente",
  cancel_requested: "Cancelación solicitada"
};

function normalizeService(s: any): ServiceType {
  if (!s) return { id: 0, name: "desconocido", price: 0 };
  if (s.attributes)
    return {
      id: s.id,
      name: s.attributes.name ?? "",
      price: Number(s.attributes.price) ?? 0,
    };
  return { id: s.id, name: s.name ?? "", price: Number(s.price) ?? 0 };
}

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [editForm, setEditForm] = useState({
    services: [] as string[],
    date: "",
    time: "",
    notes: "",
  });
  const [services, setServices] = useState<ServiceType[]>([]);
  const [estadoFilter, setEstadoFilter] = useState("all");
  const [showEditServices, setShowEditServices] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Verificar si el usuario es admin o adminails
  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user || !token) {
        setIsAdmin(false);
        return;
      }

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/users/me?populate=role`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (res.ok) {
          const userData = await res.json();
          const roleName = userData.role?.name || userData.role?.type;
          
          // Verificar si el rol es admin o adminails
          if (roleName === "admin" || roleName === "adminails") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        }
      } catch (e) {
        console.error("Error verificando rol:", e);
        setIsAdmin(false);
      }
    };

    checkAdminRole();
  }, [user, token]);

  // Función para cargar citas SIEMPRE normalizando los servicios
  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    try {
      const url = `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/appointments?populate[services][populate]=*&populate=users_permissions_user`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const userId = user?.id;
      const citasUsuario = (data.data || [])
        .filter(
          (a: RawAppointment) =>
            a.users_permissions_user && a.users_permissions_user.id === userId
        )
        .map((a: RawAppointment) => ({
          id: a.id,
          date: a.date ?? a.attributes?.date,
          appointment_status: a.appointment_status ?? a.attributes?.appointment_status,
          notes: a.notes ?? a.attributes?.notes,
          services: (a.services ?? a.attributes?.services ?? []).map(normalizeService),
          users_permissions_user:
            a.users_permissions_user ?? a.attributes?.users_permissions_user,
        }));
      setAppointments(citasUsuario);
    } catch (e) {
      setError("Error al cargar citas");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && token) fetchAppointments();
    // eslint-disable-next-line
  }, [user, token]);

  useEffect(() => {
    if (!editing) return;
    fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/services`
    )
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.data) return setServices([]);
        setServices(
          data.data.map((item: any) => ({
            id: item.id,
            name: item.attributes?.name || item.name,
            price: Number(item.attributes?.price) ?? 0,
          }))
        );
      })
      .catch(() => setServices([]));
  }, [editing]);

  const openEdit = (a: Appointment) => {
    setEditing(a);
    setEditForm({
      services: a.services ? a.services.map((s) => String(s.id)) : [],
      date: a.date ? a.date.slice(0, 10) : "",
      time: a.date ? a.date.slice(11, 16) : "",
      notes: a.notes || "",
    });
    setShowEditServices(false);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/appointments/${editing.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            services: editForm.services.map(Number),
            date: `${editForm.date}T${editForm.time}:00`,
            notes: editForm.notes,
          },
        }),
      }
    );
    setEditing(null);
    await fetchAppointments();
  };

  const handleCancelRequest = async (id: number) => {
    if (!confirm("¿Solicitar cancelación de esta cita?")) return;
    await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/appointments/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            appointment_status: "cancel_requested",
          },
        }),
      }
    );
    await fetchAppointments();
  };

  let citasMostrar = [...appointments];
  if (estadoFilter !== "all") {
    citasMostrar = citasMostrar.filter(
      (a) => a.appointment_status === estadoFilter
    );
  }
  citasMostrar = citasMostrar.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const calcularTotal = (servs: ServiceType[]) =>
    servs.reduce((sum, s) => sum + (Number(s.price) || 0), 0);

  if (!user)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-accent">
        <nav className="w-full py-4 bg-white shadow">
          <div className="container mx-auto flex justify-between items-center px-4">
            <Link
              href="/"
              className="font-cursive text-lg text-primary italic"
            >
              Ben Lux Nails
            </Link>
          </div>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <h2 className="text-2xl font-medium mb-4">Acceso restringido</h2>
          <p className="mb-6">Por favor inicia sesión para ver tu dashboard.</p>
          <Link href="/">
            <Button className="mb-2">Volver al sitio</Button>
          </Link>
          <Button variant="outline" onClick={() => setIsLoginOpen(true)}>
            Ir al login
          </Button>
        </div>
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSwitchToRegister={() => {}}
        />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-50 to-indigo-50">
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white shadow-2xl p-8 rounded-2xl max-w-md w-full space-y-6 border-b-4 border-pink-300"
          >
            <h2 className="text-2xl font-bold mb-2 text-pink-700 text-center">
              Editar cita
            </h2>
            <div>
              <Label>Servicios</Label>
              <div className="mb-2">
                <button
                  type="button"
                  className="w-full px-3 py-2 rounded bg-pink-100 text-pink-800 font-semibold border border-pink-200 shadow"
                  onClick={() => setShowEditServices((v) => !v)}
                >
                  {showEditServices
                    ? "Cerrar selección"
                    : "Seleccionar servicios"}
                </button>
              </div>
              {showEditServices && (
                <div className="flex flex-wrap gap-2 bg-gray-100 rounded p-3 mb-2">
                  {services.map((serv) => (
                    <label
                      key={serv.id}
                      className={`px-3 py-2 rounded cursor-pointer flex items-center border
                      ${
                        editForm.services.includes(String(serv.id))
                          ? "bg-pink-100 border-pink-400 text-pink-800 font-semibold"
                          : "bg-white border-gray-200 text-gray-600"
                      } transition text-base`}
                    >
                      <input
                        type="checkbox"
                        checked={editForm.services.includes(String(serv.id))}
                        onChange={() => {
                          setEditForm((f) => {
                            const isSelected = f.services.includes(
                              String(serv.id)
                            );
                            return {
                              ...f,
                              services: isSelected
                                ? f.services.filter(
                                    (sid) => sid !== String(serv.id)
                                  )
                                : [...f.services, String(serv.id)],
                            };
                          });
                        }}
                        className="mr-2 accent-pink-500"
                      />
                      {serv.name}{" "}
                      <span className="ml-2 font-mono text-sm">
                        {serv.price}€
                      </span>
                    </label>
                  ))}
                </div>
              )}
              <div className="mt-2 text-sm text-muted-foreground text-right">
                <b>Total: </b>
                {calcularTotal(
                  services.filter((s) =>
                    editForm.services.includes(String(s.id))
                  )
                )}
                €
              </div>
            </div>
            <div>
              <Label>Fecha</Label>
              <Input
                type="date"
                required
                value={editForm.date}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, date: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Hora</Label>
              <Input
                type="time"
                required
                value={editForm.time}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, time: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Notas</Label>
              <Input
                value={editForm.notes}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(null)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90">
                Guardar Cambios
              </Button>
            </div>
          </form>
        </div>
      )}

      <nav className="w-full py-4 bg-white shadow sticky top-0 z-30">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link
            href="/"
            className="font-cursive text-lg text-primary italic"
          >
            Ben Lux Nails
          </Link>
          <div className="flex items-center gap-6">
            {user && (
              <span className="text-base text-muted-foreground font-semibold">
                {user.username || user.name || user.email}
              </span>
            )}
            <div className="flex gap-2">
              <Button
                onClick={() => setIsBookingOpen(true)}
                className="bg-primary text-white font-semibold"
                aria-label="Book Now"
              >
                Book Now
              </Button>
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
              <Button
                onClick={logout}
                variant="outline"
                className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Cerrar Sesión
              </Button>
              <Link href="/">
                <Button variant="ghost">Volver al sitio</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl bg-white shadow-md rounded-lg mx-auto px-6 py-8 mt-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-3">
          <h2 className="text-3xl font-semibold">Mis Citas</h2>
          <div className="flex items-center gap-3 w-full md:w-auto ">
            <Label htmlFor="estado" className="font-medium mr-2">
              Filtrar por estado:
            </Label>
            <select
              id="estado"
              className="border rounded px-2 py-1 text-sm bg-background"
              value={estadoFilter}
              onChange={(e) => setEstadoFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="pending">Pendiente</option>
              <option value="approved">Aprobada</option>
              <option value="cancel_requested">Cancelación solicitada</option>
            </select>
            <Button
              className="ml-2 px-3 h-9 text-lg bg-primary text-white flex items-center justify-center"
              onClick={() => setIsBookingOpen(true)}
              aria-label="Agendar nueva cita"
              title="Agendar nueva cita"
            >
              <svg
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </Button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded">{error}</div>
        ) : citasMostrar.length === 0 ? (
          <div className="text-center text-muted-foreground py-10 text-lg">
            No tienes citas registradas todavía.
          </div>
        ) : (
          <div className="space-y-6">
            {citasMostrar.map((a) => (
              <div
                key={a.id}
                className={`border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4 bg-muted/30 transition shadow-sm hover:shadow-md
                    ${
                      a.appointment_status === "approved"
                        ? "ring-2 ring-green-200"
                        : a.appointment_status === "cancel_requested"
                        ? "ring-2 ring-red-200"
                        : ""
                    }`}
              >
                <div className="min-w-[150px]">
                  <h3 className="text-lg font-medium mb-1 flex items-center gap-2">
                    <span>{new Date(a.date).toLocaleDateString()}</span>
                    <span className="font-normal text-sm">
                      {new Date(a.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </h3>
                  <p
                    className={`text-xs font-semibold px-2 py-1 rounded inline-block
                    ${
                      a.appointment_status === "approved"
                        ? "bg-green-100 text-green-700"
                        : a.appointment_status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : a.appointment_status === "cancel_requested"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {estadoLabels[a.appointment_status] ||
                      a.appointment_status}
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold mb-1">
                    Servicios:&nbsp;
                    {a.services && a.services.length > 0
                      ? a.services
                          .map((s) => `${s.name} (${s.price}€)`)
                          .join(", ")
                      : "Sin servicios asociados"}
                  </p>
                  <div className="text-right text-sm">
                    <b>Total:&nbsp;</b>
                    {calcularTotal(a.services)}€
                  </div>
                  {a.notes && (
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="font-semibold">Notas: </span>
                      {a.notes}
                    </p>
                  )}
                  <div className="flex gap-2 justify-end mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEdit(a)}
                    >
                      Editar
                    </Button>
                    {a.appointment_status !== "cancel_requested" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelRequest(a.id)}
                      >
                        Solicitar cancelación
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
}
