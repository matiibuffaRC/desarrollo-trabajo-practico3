import { useState } from "react";
import axios from "axios";

export const useArtistSearch = (token) => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return { artists, loading, error, handleSearch };
};
