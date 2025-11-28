"use client"

import { Button } from "@/components/ui/button"
import { API_URL } from "@/lib/api"
import Link from "next/link"
import { MobileNav } from "@/components/mobile-nav"
import { useState, useEffect } from "react"
import { useAuth } from "@/components/AuthContext"

interface HeaderLayoutProps {
  currentPage?: "home" | "about" | "services" | "contact"
  onBookNow?: () => void
  onOpenLogin?: () => void
  onOpenRegister?: () => void
}

export function HeaderLayout({
  currentPage = "home",
  onBookNow = () => {},
  onOpenLogin = () => {},
  onOpenRegister = () => {},
}: HeaderLayoutProps) {
  const { user, logout, token } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  // Verificar rol del usuario cuando cambia
  useEffect(() => {
    if (user && token) {
      const checkRole = async () => {
        // Recolectar posibles nombres de rol desde varias estructuras
        const roleCandidates: string[] = [];
        try {
          if (user.role) {
            if (typeof user.role === 'string') roleCandidates.push(user.role);
            else {
              if (user.role.name) roleCandidates.push(user.role.name);
              if (user.role.type) roleCandidates.push(user.role.type);
            }
          }
          // Algunos backends devuelven { data: { role: ... } } o { data: {...} }
          // Normalizar también esas formas
          // @ts-ignore
          if (user.data && user.data.role) {
            // @ts-ignore
            if (typeof user.data.role === 'string') roleCandidates.push(user.data.role);
            else {
              // @ts-ignore
              if (user.data.role.name) roleCandidates.push(user.data.role.name);
              // @ts-ignore
              if (user.data.role.type) roleCandidates.push(user.data.role.type);
            }
          }
          // Si vienen roles como array
          // @ts-ignore
          if (Array.isArray(user.roles)) {
            // @ts-ignore
            user.roles.forEach((r: any) => { if (r?.name) roleCandidates.push(r.name); if (r?.type) roleCandidates.push(r.type); if (typeof r === 'string') roleCandidates.push(r); });
          }

          // También usar cualquier campo plano que pueda contener rol
          // @ts-ignore
          if (user.roleName) roleCandidates.push(user.roleName);
        } catch (e) {
          // ignore
        }

        // Normalizar a minúsculas y buscar 'admin' o 'adminails' como subcadena
        const normalized = roleCandidates.map((r) => String(r || '').toLowerCase());
        const found = normalized.find((r) => r.includes('admin'));
        if (found) {
          console.log('👤 Usuario roles detectados:', roleCandidates, '-> marcado como admin por:', found);
          setIsAdmin(true);
          return;
        }

        // Si no se detectó rol en memoria, traer de la API
        try {
          const res = await fetch(`${API_URL}/api/users/me?populate=role`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const userData = await res.json();
            console.log('📡 Datos del usuario desde API:', userData);
            // Intentar las mismas estrategias de extracción en la respuesta API
            const apiRoles: string[] = [];
            if (userData.role) {
              if (typeof userData.role === 'string') apiRoles.push(userData.role);
              else { if (userData.role.name) apiRoles.push(userData.role.name); if (userData.role.type) apiRoles.push(userData.role.type); }
            }
            if (userData.data && userData.data.role) {
              if (typeof userData.data.role === 'string') apiRoles.push(userData.data.role);
              else { if (userData.data.role.name) apiRoles.push(userData.data.role.name); if (userData.data.role.type) apiRoles.push(userData.data.role.type); }
            }
            if (Array.isArray(userData.roles)) { userData.roles.forEach((r:any) => { if (r?.name) apiRoles.push(r.name); if (r?.type) apiRoles.push(r.type); if (typeof r === 'string') apiRoles.push(r); }); }

            const normApi = apiRoles.map((r) => String(r || '').toLowerCase());
            const foundApi = normApi.find((r) => r.includes('admin'));
            console.log('👤 Roles desde API detectados:', apiRoles, '->', foundApi);
            if (foundApi) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          }
        } catch (error) {
          console.error('❌ Error verificando rol:', error);
          setIsAdmin(false);
        }
      };

      checkRole();
    }
  }, [user, token])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-3 md:px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          {/* Logo */}
          <Link href="/" className="font-cursive text-xl md:text-3xl italic flex-shrink-0">
            Ben Lux Nails
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            <Link
              href="/"
              className={`text-sm transition-colors ${
                currentPage === "home" ? "font-semibold text-primary" : "hover:text-primary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-colors ${
                currentPage === "about" ? "font-semibold text-primary" : "hover:text-primary"
              }`}
            >
              About
            </Link>
            <Link
              href="/services"
              className={`text-sm transition-colors ${
                currentPage === "services" ? "font-semibold text-primary" : "hover:text-primary"
              }`}
            >
              Services
            </Link>
            <Link
              href="/contact"
              className={`text-sm transition-colors ${
                currentPage === "contact" ? "font-semibold text-primary" : "hover:text-primary"
              }`}
            >
              Contact Us
            </Link>
          </div>

          {/* Desktop Auth & Actions - Hidden on tablet and mobile */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <Button
                  onClick={onBookNow}
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                >
                  Book Now
                </Button>
                <Link href="/dashboard">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap">
                    Mis Citas
                  </Button>
                </Link>
                {isAdmin && (
                  <Link href="/dashboardadmin">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-pink-100 border-pink-300 text-pink-700 hover:bg-pink-200 font-semibold whitespace-nowrap"
                    >
                      Admin
                    </Button>
                  </Link>
                )}
                <div className="hidden xl:block h-4 w-px bg-border" />
                <span className="hidden xl:inline text-xs text-muted-foreground">
                  {user.name || user.email}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={logout}
                  className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground whitespace-nowrap"
                >
                  Salir
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onOpenLogin}
                  className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground whitespace-nowrap"
                >
                  Ingresar
                </Button>
                <Button
                  size="sm"
                  onClick={onOpenRegister}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap"
                >
                  Registrarse
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <MobileNav 
            currentPage={currentPage} 
            onBookNow={onBookNow}
            onOpenLogin={onOpenLogin}
            onOpenRegister={onOpenRegister}
            user={user}
            isAdmin={isAdmin}
            logout={logout}
          />
        </div>
      </div>
    </nav>
  )
}
 
