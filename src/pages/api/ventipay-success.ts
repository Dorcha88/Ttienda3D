// src/pages/api/ventipay-success.ts
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ redirect }) => {
  // Recibimos el POST de VentiPay.
  // No importa qué datos traiga, lo importante es redirigir al usuario.
  
  // Usamos el código 303 (See Other).
  // ESTO ES LA CLAVE: Convierte el método POST en GET automáticamente.
  return redirect("/exito", 303);
};