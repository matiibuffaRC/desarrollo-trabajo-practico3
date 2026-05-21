import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import StatusFeedback from "../components/StatusFeedback";
import BackButton from "../components/ArtistPage/BackButton";
import ArtistHeader from "../components/ArtistPage/ArtistHeader";
import AlbumGrid from "../components/ArtistPage/AlbumGrid";

function ArtistPage({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const artistName = searchParams.get("name") || "Artista";

  const [albums, setAlbums] = useState([]);
  const [artist, setArtist] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || !id) return;

    const fetchAlbumsData = async () => {
      setLoading(true);
      setError(null);

      try {
        // DATOS DEL ARTISTA
        const artistResponse = await axios.get(
          `https://api.spotify.com/v1/artists/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setArtist(artistResponse.data);

        // ÁLBUMES
        const { data } = await axios.get(`https://api.spotify.com/v1/search`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            q: artistName,
            type: "album",
            limit: 6,
          },
        });

        if (data?.albums?.items) {
          setAlbums(data.albums.items);
        } else {
          throw new Error("No se encontraron álbumes");
        }
      } catch (err) {
        console.error("Error trayendo álbumes:", err);

        setError("Inconvenientes de red. Desplegando catálogo de simulación.");

        // FALLBACK ARTISTA
        setArtist({
          name: artistName,
          genres: [],
          images: [],
        });

        const nameLower = artistName.toLowerCase();

        // FALLBACK ÁLBUMES
        if (nameLower.includes("duki")) {
          setAlbums([
            {
              id: "duki_alb1",
              name: "Ameri",
              release_date: "2024",
              images: [
                {
                  url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600",
                },
              ],
            },
            {
              id: "duki_alb2",
              name: "Desde el Fin del Mundo",
              release_date: "2021",
              images: [
                {
                  url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600",
                },
              ],
            },
            {
              id: "duki_alb3",
              name: "Super Sangre Joven",
              release_date: "2019",
              images: [
                {
                  url: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600",
                },
              ],
            },
          ]);
        } else if (
          nameLower.includes("biza") ||
          nameLower.includes("bizarrap")
        ) {
          setAlbums([
            {
              id: "biza_alb1",
              name: "Bzrp Music Sessions, Vol. 50+",
              release_date: "2023",
              images: [
                {
                  url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600",
                },
              ],
            },
          ]);
        } else {
          setAlbums([
            {
              id: `gen_alb1_${id}`,
              name: `Lo Mejor de ${artistName} (Essential)`,
              release_date: "2026",
              images: [
                {
                  url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600",
                },
              ],
            },
            {
              id: `gen_alb2_${id}`,
              name: "Greatest Hits (Live)",
              release_date: "2025",
              images: [
                {
                  url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600",
                },
              ],
            },
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAlbumsData();
  }, [id, token, artistName]);

  return (
    <div className="min-h-screen bg-[#121212] text-white p-8">
      <div className="mx-auto max-w-6xl">
        <BackButton onBack={() => navigate("/")} />

        {/* INFO DEL ARTISTA */}
        {artist && <ArtistHeader artist={artist} />}

        {/* TÍTULO */}
        <h1 className="text-3xl font-bold mb-2">
          Álbumes de {decodeURIComponent(artistName)}
        </h1>

        <p className="text-gray-400 mb-8">
          Seleccioná un disco para ver su listado de canciones:
        </p>

        {/* ESTADOS */}
        {loading && (
          <StatusFeedback
            type="loading"
            message="Buscando álbumes en el servidor..."
          />
        )}

        {error && <StatusFeedback type="error" message={error} />}

        {/* GRID */}
        <AlbumGrid albums={albums} navigate={navigate} />
      </div>
    </div>
  );
}

export default ArtistPage;
