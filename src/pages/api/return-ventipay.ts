// src/pages/api/return-ventipay.ts
import type { APIRoute } from "astro";

// Usamos ALL para que esta función maneje cualquier método (GET, POST)
// Esto evita el error de seguridad de Vercel.
export const ALL: APIRoute = ({ redirect, request }) => {
    const url = new URL(request.url);

    // 1. Verificar si VentiPay envió un parámetro de éxito (ej: 'status=approved')
    // Nota: El nombre del parámetro puede variar ligeramente según la configuración de VentiPay
    if (url.searchParams.has('status') && url.searchParams.get('status') === 'approved') {
        // Redirige a una página de éxito
        return redirect('/exito', 302); 
    }
    
    // 2. Si no hay éxito (cancelación, falla, o POST invisible), volvemos al carrito
    return redirect('/carrito', 302); 
};