// src/pages/api/checkout.ts
import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { items } = body;

    // 1. Calcular el total (VentiPay pide el monto total, no item por item)
    const totalAmount = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);

    // 2. Datos de VentiPay
    const ventiPayUrl = "https://api.ventipay.com/v1/checkouts"; // Endpoint de creación
    const apiKey = import.meta.env.VENTIPAY_KEY;

    // 3. Crear la transacción
    // NOTA: Ajusta las URLs de 'cancel_url' y 'success_url' a tu dominio real de Vercel cuando subas
    const payload = {
      currency: "CLP",
      amount: totalAmount,
      description: "Compra en Forge3D",
      cancel_url: "https://ttienda3-d.vercel.app/carrito", 
      success_url: "https://ttienda3-d.vercel.app/carrito",
      items: items.map((i: any) => ({
          name: i.name,
          unit_price: i.price,
          quantity: i.quantity
      }))
    };

    // 4. Llamada a VentiPay
    const response = await fetch(ventiPayUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(apiKey + ":")}` // VentiPay usa Basic Auth con la API Key
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Error en VentiPay");
    }

    // 5. Devolver la URL de pago al frontend
    return new Response(JSON.stringify({ url: data.url }), {
      status: 200,
    });

  } catch (error: any) {
    console.error("Error Checkout:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};