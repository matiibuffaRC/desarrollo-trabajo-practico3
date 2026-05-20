import InicieSection from "../components/Inicie/InicieSection";
import SearchBar from "../components/Inicie/SearchBar";
import ArtistCard from "../components/Inicie/ArtistCard";
import StatusFeedback from "../components/StatusFeedback";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";

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

  // Levantar artistas favoritos del LocalStorage al iniciar
  useEffect(() => {
    const savedFavs = localStorage.getItem("spotify_favorites");
    if (savedFavs) {
      try {
        const parsed = JSON.parse(savedFavs);
        setFavorites(
          Array.isArray(parsed) ? parsed.map(normalizeArtistForFavorite) : [],
        );
      } catch (err) {
        console.error("Error parseando favoritos:", err);
      }
    }
  }, []);

  // Función para añadir/quitar un ARTISTA de favoritos
  const handleToggleFavorite = (e, artist) => {
    e.stopPropagation(); // 👈 Evita que te redirija a sus álbumes al tocar el corazón

    const alreadyExists = favorites.some((fav) => fav.id === artist.id);
    let updatedFavorites = [];

    if (alreadyExists) {
      // Si ya existe, lo removemos
      updatedFavorites = favorites.filter((fav) => fav.id !== artist.id);
      alert(`¡${artist.name} eliminado de favoritos! ❌`);
    } else {
      // Si no existe, lo agregamos con imagen normalizada
      updatedFavorites = [...favorites, normalizeArtistForFavorite(artist)];
      alert(`¡${artist.name} añadido a tus artistas favoritos! ⭐`);
    }

    setFavorites(updatedFavorites);
    localStorage.setItem("spotify_favorites", JSON.stringify(updatedFavorites));
    // Emitimos un evento para que otros componentes (ej. Header) actualicen su lista
    try {
      window.dispatchEvent(
        new CustomEvent("spotify:favorites:updated", {
          detail: updatedFavorites,
        }),
      );
    } catch (e) {
      // ignore en entornos sin window
    }
  };

  const handleSearch = async (searchKey) => {
    if (!searchKey) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get("https://api.spotify.com/v1/search", {
        headers: { Authorization: `Bearer ${token}` },
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

        {/* Seccion de Mis Artistas Favoritos */}
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
                    className="absolute top-3 right-3 bg-red-600/90 hover:bg-red-600 text-white text-xs px-1 py-1 rounded-full transition-colors"
                  >
                    Quitar ❌
                  </button>
                </div>
              ))}
            </div>
            <hr className="border-zinc-800 mt-8" />
          </div>
        )}

        {/* Resultados de la búsqueda de Artistas */}
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
                        `/artist/${artist.id}?name=${encodeURIComponent(artist.name)}`,
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
                    {/* 🌟 CORAZÓN EN EL ARTISTA: Guarda al artista entero */}
                    <button
                      onClick={(e) => handleToggleFavorite(e, artist)}
                      className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg transition-transform transform hover:scale-110 ${
                        isFav ? "bg-red-600" : "bg-[#1DB954]"
                      }`}
                      title={
                        isFav ? "Quitar de favoritos" : "Añadir a favoritos"
                      }
                    >
                      {isFav ? "❌" : "❤️"}
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
