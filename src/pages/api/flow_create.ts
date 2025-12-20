import type { APIRoute } from "astro";
import { createHmac } from "node:crypto";

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { amount, email, commerceOrder } = data;

    // 1. Leemos las llaves del archivo .env
    const apiKey = import.meta.env.FLOW_API_KEY;
    const secretKey = import.meta.env.FLOW_SECRET_KEY;
    const apiUrl = import.meta.env.FLOW_API_URL;
    
    // Obtenemos la URL base de tu sitio (ej: localhost:4321 o tu dominio.com)
    const baseUrl = new URL(request.url).origin;

    if (!apiKey || !secretKey || !apiUrl) {
      return new Response(JSON.stringify({ error: "Faltan configurar las llaves de Flow en el .env" }), { status: 500 });
    }

    // 2. Preparamos los datos para Flow
    const params: Record<string, string | number> = {
      apiKey: apiKey,
      commerceOrder: commerceOrder || `PEDIDO-${Date.now()}`,
      subject: "Compra en Prinlab3D",
      currency: "CLP",
      amount: amount,
      email: email,
      paymentMethod: 9, // 9 significa "Todos los medios de pago"
      urlConfirmation: `${baseUrl}/api/flow_confirm`, // Flow avisa aquí (webhook)
      urlReturn: `${baseUrl}/exito`, // Donde vuelve el cliente tras pagar
    };

    // 3. Generar la Firma (Signature) obligatoria
    // Flow exige que los datos estén ordenados alfabéticamente antes de firmar
    const keys = Object.keys(params).sort();
    
    // Creamos una cadena tipo: amount=1000&apiKey=xyz&commerceOrder=123...
    const dataToSign = keys.map(key => `${key}=${params[key]}`).join("&");

    // Encriptamos esa cadena con tu Secret Key usando HMAC SHA256
    const signature = createHmac("sha256", secretKey)
      .update(dataToSign)
      .digest("hex");

    // 4. Preparamos el envío final (FormData)
    const formData = new FormData();
    keys.forEach(key => formData.append(key, String(params[key])));
    formData.append("s", signature); // Agregamos la firma al final

    // 5. Enviamos todo a Flow
    console.log("Enviando a Flow:", apiUrl);
    const response = await fetch(`${apiUrl}/payment/create`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    // 6. Respondemos al Frontend (pedido.astro)
    if (result.token) {
      // ÉXITO: Mandamos la URL donde el usuario debe ir a pagar
      const redirectUrl = `${result.url}?token=${result.token}`;
      return new Response(JSON.stringify({ redirectUrl }), { status: 200 });
    } else {
      // ERROR: Flow rechazó el pedido (ej: llaves malas, monto inválido)
      console.error("Error respuesta Flow:", result);
      return new Response(JSON.stringify({ error: result.message || "Error desconocido de Flow" }), { status: 400 });
    }

  } catch (error: any) {
    console.error("Error servidor:", error);
    return new Response(JSON.stringify({ error: error.message || "Error interno del servidor" }), { status: 500 });
  }
};