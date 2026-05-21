import { useState, useEffect } from "react";
import { normalizeArtistForFavorite } from "../utils/artistUtils";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
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

    const alreadyExists = favorites.some((fav) => fav.id === artist.id);

    let updatedFavorites = [];

    if (alreadyExists) {
      updatedFavorites = favorites.filter((fav) => fav.id !== artist.id);
    } else {
      updatedFavorites = [...favorites, normalizeArtistForFavorite(artist)];
    }

    setFavorites(updatedFavorites);

    localStorage.setItem("spotify_favorites", JSON.stringify(updatedFavorites));

    try {
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
