"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/AuthContext";
import { Loader } from "@/components/loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

export default function AdminDashboardPage() {
  const { user, token, logout } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingRole, setCheckingRole] = useState(true);

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
          {
            headers: { Authorization: `Bearer ${token}` }
          }
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
      let res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        url = `${baseUrl}/api/appointment?populate[services][populate]=*&populate=users_permissions_user`;
        res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      const data = await res.json();
      
      console.log("📦 Raw data from Strapi:", data);
      
      if (!Array.isArray(data.data)) {
        console.error("❌ data.data no es un array:", data);
        setError("Estructura de datos incorrecta");
        setLoading(false);
        return;
      }

      const citas = data.data.map((a: RawAppointment) => {
        console.log(`🆔 Procesando - ID: ${a.id}, documentId: ${a.documentId}`);
        
        return {
          id: a.id,
          documentId: a.documentId,
          date: a.date,
          appointment_status: a.appointment_status,
          notes: a.notes,
          services: (a.services || []).map((s: any) => normalizeService(s)),
          users_permissions_user: a.users_permissions_user
        };
      });
      
      console.log("✅ Appointments procesados:", citas);
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

    console.log(`🎯 Cambiando estado - ID: ${apptId}, documentId: ${apptDocumentId}, nuevo estado: ${newStatus}`);

    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    
    // Probar con ID numérico y documentId
    const endpoints = [
      `${baseUrl}/api/appointments/${apptDocumentId}`,  // documentId primero
      `${baseUrl}/api/appointments/${apptId}`,          // ID numérico
      `${baseUrl}/api/appointment/${apptDocumentId}`,   // documentId singular
      `${baseUrl}/api/appointment/${apptId}`            // ID numérico singular
    ];

    for (const url of endpoints) {
      try {
        console.log(`🔄 Intentando PUT: ${url}`);
        
        const res = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            data: {
              appointment_status: newStatus
            }
          })
        });

        console.log(`📡 Response status: ${res.status} para ${url}`);

        if (res.ok) {
          console.log(`✅ Actualizado correctamente con: ${url}`);
          await fetchAppointments();
          return;
        } else {
          const textResponse = await res.text();
          console.log(`❌ Error ${res.status} con ${url}:`, textResponse);
        }
      } catch (err) {
        console.error(`❌ Error de red con ${url}:`, err);
      }
    }

    alert(`No se pudo actualizar el estado. Ninguno de los endpoints funcionó.`);
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
  filtered = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
      <div className="max-w-6xl mx-auto pt-10 px-4">
        <h2 className="text-4xl font-bold text-pink-700 mb-5 text-center tracking-tight">Gestor de Citas - Administrador</h2>
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-7">
          <div>
            <Input
              placeholder="Buscar por usuario, email, nota o servicio..."
              className="w-full md:w-96 ring-1 ring-pink-100"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="text-gray-600 text-sm self-center">
            Mostrando <b>{filtered.length}</b> de <b>{appointments.length}</b> citas
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-16"><Loader /></div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded">{error}</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map(appt => (
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
                <div className="flex justify-between mt-1 text-sm">
                  <div className="text-gray-700">
                    <b>Fecha:</b> {new Date(appt.date).toLocaleDateString()} <span className="ml-2">{new Date(appt.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <div className="font-bold text-pink-700">Total: {calcularTotal(appt.services)}€</div>
                </div>
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
        {(!loading && filtered.length === 0) && (
          <div className="text-center text-lg text-pink-600 font-semibold p-12">No hay citas que mostrar.</div>
        )}
      </div>
    </div>
  );
}
