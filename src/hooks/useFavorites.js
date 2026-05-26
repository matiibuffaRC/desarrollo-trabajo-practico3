import { useState, useEffect } from "react";
import { normalizeArtistForFavorite } from "../utils/artistUtils";

export const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Buscamos los favoritos del localStorage y los pasamos a JSON para trabajarlos
        const normalizeSavedFavorites = (saved) => {
        try {
            const parsed = JSON.parse(saved);
            return Array.isArray(parsed)
            ? parsed.map(normalizeArtistForFavorite)
            : [];
        } catch (err) {
            console.error("Error parseando favoritos:", err);
            return [];
        }
        };

        // Inicializar desde localStorage
        const saved = localStorage.getItem("spotify_favorites");
        if (saved) {
            setFavorites(normalizeSavedFavorites(saved));
        }

        // Escuchar cambios globales de favoritos (desde ArtistFavList u otros componentes)
        const handleFavoritesUpdate = (e) => {
            if (e?.detail) {
                // Si el evento trae detalles, actualizamos directamente con esos datos normalizados
                setFavorites(e.detail.map(normalizeArtistForFavorite));
            } else {
                // Si el evento no trae detalles, recargar desde localStorage
                const saved = localStorage.getItem("spotify_favorites");
                setFavorites(saved ? normalizeSavedFavorites(saved) : []);
            }
        };

        window.addEventListener("spotify:favorites:updated", handleFavoritesUpdate);
        return () =>
            window.removeEventListener(
                "spotify:favorites:updated",
                handleFavoritesUpdate,
            );
    }, []);

    const toggleFavorite = (e, artist) => {
        e.stopPropagation();
        // Verificamos si el artista ya está en favoritos
        const alreadyExists = favorites.some((fav) => fav.id === artist.id);
        let updatedFavorites = [];
        // Si ya existe, lo removemos. Si no, lo agregamos (normalizado)
        if (alreadyExists) {
            updatedFavorites = favorites.filter((fav) => fav.id !== artist.id);
        } else {
            updatedFavorites = [...favorites, normalizeArtistForFavorite(artist)];
        }

        setFavorites(updatedFavorites);

        // Guardamos en localStorage el nuevo estado de favoritos
        localStorage.setItem("spotify_favorites", JSON.stringify(updatedFavorites));

        try {
            // Disparamos un evento personalizado para notificar a otros componentes que los favoritos han sido actualizados
            window.dispatchEvent(
                new CustomEvent("spotify:favorites:updated", {
                detail: updatedFavorites,
                }),
            );
        } catch (e) {
            console.log(e);
        }
    };

    return { favorites, toggleFavorite };
};
