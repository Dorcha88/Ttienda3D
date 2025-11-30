import { map } from 'nanostores';

// Creamos el store
export const favoriteItems = map({});

// Cargar desde LocalStorage al iniciar (en el cliente)
if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('prinlab_favorites');
    if (saved) {
        favoriteItems.set(JSON.parse(saved));
    }
}

// Suscribirse a cambios para guardar en LocalStorage
favoriteItems.subscribe((val) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('prinlab_favorites', JSON.stringify(val));
    }
});

// Función para agregar/quitar (Toggle)
export function toggleFavorite(product) {
    const current = favoriteItems.get();
    if (current[product.id]) {
        // Si existe, lo borramos (quitamos el like)
        const { [product.id]: _, ...rest } = current;
        favoriteItems.set(rest);
    } else {
        // Si no existe, lo agregamos
        favoriteItems.set({ ...current, [product.id]: product });
    }
}