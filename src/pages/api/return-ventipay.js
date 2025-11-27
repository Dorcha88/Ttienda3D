// src/pages/api/return-ventipay.js

// Esta función manejará GET (si escriben la URL) y POST (si VentiPay la usa)
export const ALL = ({ redirect, request }) => {
    const url = new URL(request.url);

    // Si la URL contiene el parámetro 'status=approved'
    if (url.searchParams.has('status') && url.searchParams.get('status') === 'approved') {
        return redirect('/exito', 302); 
    }
    
    // Si no es un éxito (cancelación, fallo, o POST sin data), volvemos al carrito
    return redirect('/carrito', 302); 
};