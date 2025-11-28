// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import { supabase } from "./lib/supabase";

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, redirect } = context;

  // 1. DETECTAR SI INTENTA ENTRAR A LA ZONA PROHIBIDA (/admin)
  if (url.pathname.startsWith("/admin")) {
    
    // A. Buscamos las credenciales (Cookies)
    const accessToken = cookies.get("sb-access-token")?.value;
    const refreshToken = cookies.get("sb-refresh-token")?.value;

    // B. Si no tiene credenciales, lo mandamos al Login
    if (!accessToken || !refreshToken) {
      return redirect("/login");
    }

    // C. Verificamos con Supabase si las credenciales son reales
    const { data: { session }, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Si la sesión no es válida, fuera.
    if (error || !session) {
      return redirect("/login");
    }

    // D. EL PASO FINAL: ¿Es Admin de verdad?
    // Consultamos la base de datos para ver su ROL
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    // Si su rol no es 'admin', lo mandamos al inicio (Home)
    if (profile?.role !== 'admin') {
      return redirect("/"); 
    }
  }

  // Si pasa todas las pruebas (o no va a /admin), déjalo pasar.
  return next();
});