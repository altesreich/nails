"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { Loader } from "@/components/loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

interface ServiceType {
  id: number;
  name: string;
  price: number;
}

interface Appointment {
  id: number;
  documentId: string;
  date: string;
  appointment_status: string;
  notes?: string;
  services: ServiceType[];
  users_permissions_user?: any;
}

type RawAppointment = { [key: string]: any };

const statusOptions = [
  { value: "pending", label: "Pendiente", color: "bg-yellow-200 text-yellow-900 border-yellow-300" },
  { value: "approved", label: "Aprobada", color: "bg-green-200 text-green-800 border-green-300" },
  { value: "cancel_requested", label: "Cancelación Solicitada", color: "bg-orange-200 text-orange-800 border-orange-300" },
  { value: "cancelled", label: "Cancelada", color: "bg-red-200 text-red-800 border-red-300" }
];

function normalizeService(s: any): ServiceType {
  if (!s) return { id: 0, name: "desconocido", price: 0 };
  return { 
    id: s.id || 0, 
    name: s.name ?? "", 
    price: Number(s.price) ?? 0 
  };
}

function getLocalDateString(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function AdminDashboardPage() {
  const { user, token, logout } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // ✅ NUEVO: Estado para edición de fecha/hora
  const [editingAppointment, setEditingAppointment] = useState<number | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user || !token) {
        setCheckingRole(false);
        setIsAdmin(false);
        return;
      }
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}/api/users/me?populate=role`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) {
          const userData = await res.json();
          const roleName = userData.role?.name || userData.role?.type;
          setIsAdmin(roleName === "admin" || roleName === "adminails");
        } else {
          setIsAdmin(false);
        }
      } catch (e) {
        console.error("Error verificando rol:", e);
        setIsAdmin(false);
      }
      setCheckingRole(false);
    };
    checkAdminRole();
  }, [user, token]);

  const fetchAppointments = async () => {
    setAppointments([]);
    setLoading(true);
    setError("");
    try {
      const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
      let url = `${baseUrl}/api/appointments?populate[services][populate]=*&populate=users_permissions_user`;
      let res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) {
        url = `${baseUrl}/api/appointment?populate[services][populate]=*&populate=users_permissions_user`;
        res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      }
      const data = await res.json();
      if (!Array.isArray(data.data)) {
        setError("Estructura de datos incorrecta");
        setLoading(false);
        return;
      }
      const citas = data.data.map((a: RawAppointment) => ({
        id: a.id,
        documentId: a.documentId,
        date: a.date,
        appointment_status: a.appointment_status,
        notes: a.notes,
        services: (a.services || []).map((s: any) => normalizeService(s)),
        users_permissions_user: a.users_permissions_user
      }));
      setAppointments(citas);
    } catch (e) {
      setError("Error al cargar citas");
      console.error("❌ Error fetch:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user && token && isAdmin) {
      fetchAppointments();
    }
  }, [user, token, isAdmin]);

  const calcularTotal = (servs: ServiceType[]) =>
    servs.reduce((sum, s) => sum + (Number(s.price) || 0), 0);

  const handleStatusChange = async (apptId: number, apptDocumentId: string, newStatus: string) => {
    const appt = appointments.find(a => a.id === apptId);
    if (!appt) {
      alert(`ID inválido: ${apptId}. Refresca el panel.`);
      return;
    }
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const endpoints = [
      `${baseUrl}/api/appointments/${apptDocumentId}`,
      `${baseUrl}/api/appointments/${apptId}`,
      `${baseUrl}/api/appointment/${apptDocumentId}`,
      `${baseUrl}/api/appointment/${apptId}`
    ];
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ data: { appointment_status: newStatus } })
        });
        if (res.ok) {
          await fetchAppointments();
          return;
        }
      } catch (err) { }
    }
    alert(`No se pudo actualizar el estado. Ninguno de los endpoints funcionó.`);
  };

  // ✅ NUEVO: Iniciar edición de fecha/hora
  const startEditDateTime = (appt: Appointment) => {
    const date = new Date(appt.date);
    const dateStr = getLocalDateString(appt.date);
    const timeStr = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    
    setEditingAppointment(appt.id);
    setEditDate(dateStr);
    setEditTime(timeStr);
  };

  // ✅ NUEVO: Guardar fecha/hora editada
  const saveDateTime = async (apptId: number, apptDocumentId: string) => {
    if (!editDate || !editTime) {
      alert("Debes completar fecha y hora");
      return;
    }

    setSavingEdit(true);
    const fechaISO = `${editDate}T${editTime}:00`;

    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    const endpoints = [
      `${baseUrl}/api/appointments/${apptDocumentId}`,
      `${baseUrl}/api/appointments/${apptId}`,
      `${baseUrl}/api/appointment/${apptDocumentId}`,
      `${baseUrl}/api/appointment/${apptId}`
    ];

    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ data: { date: fechaISO } })
        });
        if (res.ok) {
          setEditingAppointment(null);
          setEditDate("");
          setEditTime("");
          await fetchAppointments();
          setSavingEdit(false);
          return;
        }
      } catch (err) { }
    }
    
    alert(`No se pudo actualizar la fecha. Ninguno de los endpoints funcionó.`);
    setSavingEdit(false);
  };

  // ✅ NUEVO: Cancelar edición
  const cancelEdit = () => {
    setEditingAppointment(null);
    setEditDate("");
    setEditTime("");
  };

  if (checkingRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-indigo-50">
        <Loader />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <nav className="w-full py-4 bg-white shadow sticky top-0 z-30">
          <div className="container mx-auto flex justify-between items-center px-4">
            <Link href="/" className="font-cursive text-lg text-primary italic">
              Ben Lux Nails
            </Link>
          </div>
        </nav>
        <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-indigo-50">
          <h2 className="text-2xl font-semibold mb-4">Acceso solo administradores</h2>
          <p className="text-gray-600 mb-6">Necesitas el rol "admin" o "adminails" para acceder a esta página</p>
          <Link href="/">
            <Button className="mb-2">Volver al sitio</Button>
          </Link>
        </div>
      </div>
    );
  }

  const approvedAppointments = appointments.filter(a => a.appointment_status === "approved");
  const approvedDatesSet = new Set(approvedAppointments.map(
    a => getLocalDateString(a.date)
  ));

  let filtered = appointments;
  if (search.trim()) {
    const lower = search.toLowerCase();
    filtered = filtered.filter(appt =>
      (appt.users_permissions_user?.username || "").toLowerCase().includes(lower) ||
      (appt.users_permissions_user?.email || "").toLowerCase().includes(lower) ||
      (appt.services.some(s => s.name.toLowerCase().includes(lower))) ||
      (appt.notes || "").toLowerCase().includes(lower)
    );
  }

  let displayedAppointments = filtered;
  if (selectedDate) {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const selectedYMD = `${year}-${month}-${day}`;
    
    displayedAppointments = filtered.filter(appt =>
      appt.appointment_status === "approved" &&
      getLocalDateString(appt.date) === selectedYMD
    );
  }

  displayedAppointments = displayedAppointments.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const appointmentsForSelectedDate = selectedDate
    ? approvedAppointments.filter(appt => {
        const year = selectedDate.getFullYear();
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const day = String(selectedDate.getDate()).padStart(2, '0');
        const selectedYMD = `${year}-${month}-${day}`;
        return getLocalDateString(appt.date) === selectedYMD;
      })
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-fuchsia-100 to-indigo-50">
      <nav className="w-full py-4 bg-white shadow sticky top-0 z-30">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link href="/" className="font-cursive text-lg text-primary italic">
            Ben Lux Nails
          </Link>
          <div className="flex items-center gap-6">
            <span className="text-base text-muted-foreground font-semibold">
              Admin {user?.username || user?.name || user?.email}
            </span>
            <Button onClick={logout} variant="outline" className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              Cerrar Sesión
            </Button>
            <Link href="/">
              <Button variant="ghost">Volver al sitio</Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto pt-10 px-4">
        <h2 className="text-4xl font-bold text-pink-700 mb-8 text-center tracking-tight">Gestor de Citas - Administrador</h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <section className="flex-1">
            <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-7">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por usuario, email, nota o servicio..."
                  className="w-full ring-1 ring-pink-100"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="text-gray-600 text-sm self-center whitespace-nowrap">
                Mostrando <b>{displayedAppointments.length}</b> de <b>{appointments.length}</b> citas
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-16"><Loader /></div>
            ) : error ? (
              <div className="p-4 bg-red-50 text-red-600 rounded">{error}</div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {displayedAppointments.map(appt => (
                  <div
                    key={appt.id}
                    className="bg-white p-5 rounded-xl shadow-lg border-l-4 border-pink-200 flex flex-col gap-2 justify-between hover:scale-[1.018] transition"
                  >
                    <div className="flex items-center gap-4 justify-between">
                      <div className="flex-1">
                        <div className="text-lg font-bold text-pink-600">
                          {appt.users_permissions_user?.username || appt.users_permissions_user?.email || "-"}
                        </div>
                        <div className="text-xs text-gray-500">{appt.users_permissions_user?.email}</div>
                        <div className="text-xs text-gray-400 mt-1">ID: #{appt.id}</div>
                      </div>
                      <span className={`rounded-full px-3 py-1 font-semibold text-xs border ${statusOptions.find(o => o.value === appt.appointment_status)?.color || "bg-gray-100 text-gray-800 border-gray-200"}`}>
                        {statusOptions.find(o => o.value === appt.appointment_status)?.label || appt.appointment_status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm font-medium mt-1">
                      {appt.services.map(serv => (
                        <span key={serv.id} className="bg-pink-50 px-3 py-1 rounded-full border border-pink-100 shadow inner text-pink-900">
                          {serv.name} <b>{serv.price}€</b>
                        </span>
                      ))}
                    </div>

                    {/* ✅ NUEVO: Edición de fecha/hora */}
                    {editingAppointment === appt.id ? (
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="date"
                            value={editDate}
                            onChange={e => setEditDate(e.target.value)}
                            className="text-sm"
                            disabled={savingEdit}
                          />
                          <Input
                            type="time"
                            value={editTime}
                            onChange={e => setEditTime(e.target.value)}
                            className="text-sm"
                            disabled={savingEdit}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => saveDateTime(appt.id, appt.documentId)}
                            disabled={savingEdit}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                          >
                            {savingEdit ? "Guardando..." : "✓ Guardar"}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEdit}
                            disabled={savingEdit}
                            className="flex-1"
                          >
                            ✕ Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center mt-1 text-sm">
                        <div className="text-gray-700 flex-1">
                          <b>Fecha:</b> {new Date(appt.date).toLocaleDateString()} 
                          <span className="ml-2">{new Date(appt.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        <button
                          onClick={() => startEditDateTime(appt)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-semibold ml-2"
                          title="Editar fecha/hora"
                        >
                          ✏️ Editar
                        </button>
                        <div className="font-bold text-pink-700 ml-3">Total: {calcularTotal(appt.services)}€</div>
                      </div>
                    )}

                    {appt.notes && <div className="px-2 py-1 text-xs italic text-gray-500 mt-1 bg-gray-50 rounded">{appt.notes}</div>}
                    <div className="flex items-center gap-2 mt-2">
                      <select
                        className="flex-1 border rounded px-3 py-2 font-semibold text-sm ring-1 ring-pink-200 bg-pink-50 focus:ring-2 focus:ring-pink-400"
                        value={appt.appointment_status}
                        onChange={e => handleStatusChange(appt.id, appt.documentId, e.target.value)}
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {(!loading && displayedAppointments.length === 0) && (
              <div className="text-center text-lg text-pink-600 font-semibold p-12">No hay citas que mostrar.</div>
            )}
          </section>

          {/* CALENDARIO (sin cambios) */}
          <aside className="w-full lg:w-96 lg:sticky lg:top-24 lg:self-start">
            <div className="bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow-2xl p-6 border border-pink-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl text-pink-700 font-bold">📅 Calendario</h3>
                {selectedDate && (
                  <button
                    className="text-xs text-pink-600 hover:text-pink-800 hover:underline font-semibold"
                    onClick={() => setSelectedDate(null)}
                  >
                    Ver todas
                  </button>
                )}
              </div>
              
              <div className="calendar-wrapper">
                <style jsx global>{`
                  .calendar-wrapper .react-calendar {
                    width: 100%;
                    border: none;
                    border-radius: 12px;
                    font-family: inherit;
                    background: transparent;
                  }
                  .calendar-wrapper .react-calendar__navigation {
                    margin-bottom: 1em;
                    background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%);
                    border-radius: 10px;
                    padding: 8px;
                  }
                  .calendar-wrapper .react-calendar__navigation button {
                    color: white;
                    font-weight: 700;
                    font-size: 1rem;
                    min-width: 44px;
                  }
                  .calendar-wrapper .react-calendar__navigation button:enabled:hover,
                  .calendar-wrapper .react-calendar__navigation button:enabled:focus {
                    background-color: rgba(255, 255, 255, 0.2);
                    border-radius: 6px;
                  }
                  .calendar-wrapper .react-calendar__month-view__weekdays {
                    text-align: center;
                    text-transform: uppercase;
                    font-weight: bold;
                    font-size: 0.75rem;
                    color: #be185d;
                  }
                  .calendar-wrapper .react-calendar__tile {
                    padding: 12px 6px;
                    background: white;
                    border-radius: 8px;
                    transition: all 0.2s;
                    font-weight: 600;
                    color: #4b5563;
                    border: 2px solid transparent;
                  }
                  .calendar-wrapper .react-calendar__tile:enabled:hover {
                    background-color: #fce7f3;
                    transform: scale(1.05);
                    border-color: #f472b6;
                  }
                  .calendar-wrapper .react-calendar__tile--now {
                    background: #fef3c7;
                    color: #92400e;
                    font-weight: 700;
                  }
                  .calendar-wrapper .react-calendar__tile--active {
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
                    color: white !important;
                    font-weight: 800 !important;
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
                    border: 2px solid #047857 !important;
                  }
                  .calendar-wrapper .react-calendar__tile--active:hover {
                    transform: scale(1.12);
                  }
                  .calendar-wrapper .react-calendar__month-view__days__day--neighboringMonth {
                    color: #d1d5db;
                  }
                  .calendar-wrapper .react-calendar__tile:disabled {
                    background-color: #f9fafb;
                    color: #d1d5db;
                  }
                `}</style>
                <Calendar
                  onChange={(d) => setSelectedDate(d as Date)}
                  value={selectedDate}
                  tileClassName={({ date, view }) => {
                    if (view === "month") {
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(2, '0');
                      const day = String(date.getDate()).padStart(2, '0');
                      const dStr = `${year}-${month}-${day}`;
                      if (approvedDatesSet.has(dStr)) {
                        return "react-calendar__tile--active";
                      }
                    }
                    return "";
                  }}
                  locale="es-ES"
                  calendarType="gregory"
                />
              </div>

              <div className="mt-6">
                {selectedDate ? (
                  <div className="bg-white rounded-xl p-4 shadow border border-green-200">
                    <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                      <span className="text-lg">✅</span>
                      Citas del {selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                    </h4>
                    {appointmentsForSelectedDate.length > 0 ? (
                      <div className="space-y-2">
                        {appointmentsForSelectedDate.map(appt => (
                          <div key={appt.id} className="bg-green-50 p-3 rounded-lg border border-green-200">
                            <div className="text-sm font-bold text-green-900">
                              {appt.users_permissions_user?.username || appt.users_permissions_user?.email}
                            </div>
                            <div className="text-xs text-green-700 mt-1">
                              ⏰ {new Date(appt.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </div>
                            <div className="text-xs text-green-600 mt-1">
                              {appt.services.map(s => s.name).join(", ")}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No hay citas aprobadas este día</p>
                    )}
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 text-center">
                    <p className="text-sm text-pink-800 font-semibold">
                      💡 Selecciona un día con citas aprobadas
                    </p>
                    <p className="text-xs text-pink-600 mt-1">
                      Los días en <span className="font-bold text-green-700">verde</span> tienen citas confirmadas
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-3 text-center shadow">
                  <div className="text-2xl font-bold text-green-800">{approvedAppointments.length}</div>
                  <div className="text-xs text-green-700 font-semibold">Aprobadas</div>
                </div>
                <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-3 text-center shadow">
                  <div className="text-2xl font-bold text-yellow-800">
                    {appointments.filter(a => a.appointment_status === "pending").length}
                  </div>
                  <div className="text-xs text-yellow-700 font-semibold">Pendientes</div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
