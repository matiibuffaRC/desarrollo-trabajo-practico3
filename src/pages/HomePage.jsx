import InicieSection from "../components/Inicie/InicieSection";
import SearchBar from "../components/Inicie/SearchBar";
import ArtistCard from "../components/Inicie/ArtistCard";
import StatusFeedback from "../components/StatusFeedback";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

import CorazonVacio from "../assets/icons/heartVacio.svg";
import CorazonRelleno from "../assets/icons/heartRelleno.svg";

const DEFAULT_ARTIST_IMAGE =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200";

const getArtistImage = (artist) =>
  artist.images?.[1]?.url ||
  artist.images?.[0]?.url ||
  artist.image ||
  DEFAULT_ARTIST_IMAGE;

const normalizeArtistForFavorite = (artist) => ({
  id: artist.id,
  name: artist.name || "Artista",
  genre: artist.genres?.slice(0, 2).join(" • ") || artist.genre || "Artista",
  image: getArtistImage(artist),
});

function HomePage({ token }) {
  const navigate = useNavigate();

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos desde localStorage e inicializar sincronización global
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

  // Agregar / quitar favoritos
  const handleToggleFavorite = (e, artist) => {
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

  // Buscar artistas
  const handleSearch = async (searchKey) => {
    if (!searchKey) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          q: searchKey,
          type: "artist",
          limit: 6,
        },
      });

      if (data?.artists?.items) {
        setArtists(data.artists.items);
      } else {
        throw new Error("Estructura inesperada");
      }
    } catch (err) {
      console.error("Error en búsqueda:", err);

      setError("Problemas de CORS. Cargando artistas de simulación.");

      setArtists([
        {
          id: "artist_duki",
          name: "Duki",
          genres: ["Trap"],
          images: [
            {},
            {
              url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200",
            },
          ],
        },
        {
          id: "artist_biza",
          name: "Bizarrap",
          genres: ["EDM"],
          images: [
            {},
            {
              url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200",
            },
          ],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#121212] px-4 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <InicieSection />

        <SearchBar onSearch={handleSearch} />

        {loading && (
          <StatusFeedback type="loading" message="Buscando artistas..." />
        )}

        {error && <StatusFeedback type="error" message={error} />}

        {/* FAVORITOS */}
        {favorites.length > 0 && (
          <div className="mt-8 mb-6">
            <h2 className="text-2xl font-bold text-[#1DB954] mb-4">
              Mis Artistas Favoritos
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {favorites.map((fav) => (
                <div
                  key={fav.id}
                  onClick={() =>
                    navigate(
                      `/artist/${fav.id}?name=${encodeURIComponent(fav.name)}`,
                    )
                  }
                  className="cursor-pointer relative group transform hover:-translate-y-1 transition-transform"
                >
                  <ArtistCard
                    id={fav.id}
                    name={fav.name}
                    genre={fav.genre || "Favorito"}
                    image={fav.image || DEFAULT_ARTIST_IMAGE}
                  />

                  <button
                    onClick={(e) => handleToggleFavorite(e, fav)}
                    className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110"
                    title="Quitar de favoritos"
                  >
                    <img
                      src={CorazonRelleno}
                      alt="Quitar de favoritos"
                      className="w-4 h-4 invert cursor-pointer"
                    />
                  </button>
                </div>
              ))}
            </div>

            <hr className="border-zinc-800 mt-8" />
          </div>
        )}

        {/* RESULTADOS */}
        <h2 className="text-3xl font-bold m-2 mt-8">Artistas encontrados</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {artists.length > 0
            ? artists.map((artist) => {
                const isFav = favorites.some((fav) => fav.id === artist.id);

                return (
                  <div
                    key={artist.id}
                    onClick={() =>
                      navigate(
                        `/artist/${artist.id}?name=${encodeURIComponent(
                          artist.name,
                        )}`,
                      )
                    }
                    className="cursor-pointer relative group transform hover:-translate-y-1 transition-transform"
                  >
                    <ArtistCard
                      id={artist.id}
                      name={artist.name}
                      genre={
                        artist.genres?.slice(0, 2).join(" • ") || "Artista"
                      }
                      image={getArtistImage(artist)}
                    />

                    {/* BOTÓN FAVORITO */}
                    <button
                      onClick={(e) => handleToggleFavorite(e, artist)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                      title={
                        isFav ? "Quitar de favoritos" : "Añadir a favoritos"
                      }
                    >
                      <img
                        src={isFav ? CorazonRelleno : CorazonVacio}
                        alt="Favorito"
                        className="w-4 h-4 invert cursor-pointer"
                      />
                    </button>
                  </div>
                );
              })
            : !loading && (
                <p className="text-gray-400 m-2 col-span-full">
                  Usa el buscador de arriba para encontrar artistas.
                </p>
              )}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
