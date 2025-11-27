// src/lib/cartStore.ts
import { persistentMap } from '@nanostores/persistent';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
};

export const isCartOpen = persistentMap<string>('isCartOpen', 'false');

// El almacén principal
export const cartItems = persistentMap<Record<string, CartItem>>('cartItems', {}, {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function addProductToCart(product: any) {
  const existingEntry = cartItems.get()[product.id];
  
  if (existingEntry) {
    cartItems.setKey(product.id, {
      ...existingEntry,
      quantity: existingEntry.quantity + 1,
    });
  } else {
    cartItems.setKey(product.id, {
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: 1,
    });
  }
}

// --- ESTA ES LA FUNCIÓN NUEVA QUE NECESITAS ---
export function removeProductFromCart(id: string) {
  const current = cartItems.get();
  // Creamos una copia nueva para forzar a NanoStores a guardar
  const newCart = { ...current };
  delete newCart[id];
  cartItems.set(newCart);
}