import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function AlbumPage({ token }) {
    const { albumId } = useParams();
    const navigate = useNavigate();

    const [albumName, setAlbumName] = useState("Álbum Seleccionado");
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token || !albumId) return;

        const fetchAlbumTracks = async () => {
            setLoading(true);
            setError(null);
            try {
                const [albumResponse, tracksResponse] = await Promise.all([
                axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                axios.get(`https://api.spotify.com/v1/albums/${albumId}/tracks`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { limit: 50 },
                }),
                ]);

                const albumData = albumResponse.data;
                const trackItems = tracksResponse.data?.items || [];

                setAlbumName(albumData.name || "Álbum Seleccionado");
                setTracks(trackItems);
            } catch (err) {
                console.error("Error cargando canciones del álbum:", err);
                setError(
                "No pudimos cargar las pistas de este álbum. Intenta recargar o revisa la conexión.",
                );
                setTracks([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAlbumTracks();
    }, [albumId, token]);

    // Transforma milisegundos a formato "MM:SS" de forma ultra segura
    const formatDuration = (ms) => {
        if (!ms) return "0:00";
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return (
        <div className="min-h-screen bg-[#121212] text-white p-8">
        <div className="mx-auto max-w-4xl">
            <button
            onClick={() => navigate(-1)}
            className="mb-6 bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-5 py-2 rounded-full text-sm transition-colors shadow-md cursor-pointer"
            >
            ← Volver a álbumes
            </button>

            <div className="bg-linear-to-b from-zinc-800 to-zinc-900 p-6 rounded-lg border border-zinc-800 shadow-xl mb-8">
            <h1 className="text-3xl font-extrabold text-[#1DB954] mb-2">
                {albumName}
            </h1>
            <p className="text-zinc-400 text-sm">
                ID del recurso:{" "}
                <span className="font-mono text-zinc-300">{albumId}</span>
            </p>
            </div>

            <h2 className="text-2xl font-bold mb-4 border-b border-zinc-800 pb-2">
            Lista de Canciones
            </h2>

            {/* Controles de estado locales en texto plano para evitar fallos por componentes externos */}
            {loading && (
            <p className="text-zinc-400 animate-pulse mt-4">
                Cargando canciones...
            </p>
            )}
            {error && (
            <p className="text-yellow-500 font-medium bg-yellow-500/10 p-3 rounded-md border border-yellow-500/20 mt-4">
                {error}
            </p>
            )}

            {/* Lista organizada de canciones */}
            <div className="space-y-2 mt-4">
            {tracks.length > 0
                ? tracks.map((track, index) => (
                    <div
                    key={track.id}
                    className="flex items-center justify-between p-3 rounded-md bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-900/80 transition-colors"
                    >
                    <div className="flex items-center gap-4">
                        <span className="text-zinc-500 font-medium w-4 text-right">
                        {track.track_number || index + 1}
                        </span>
                        <p className="font-semibold text-zinc-200 hover:text-[#1DB954] transition-colors">
                        {track.name}
                        </p>
                    </div>
                    <span className="text-zinc-400 text-sm font-mono">
                        {formatDuration(track.duration_ms)}
                    </span>
                    </div>
                ))
                : !loading && (
                    <p className="text-zinc-600 italic mt-4">
                    No se hallaron pistas de audio en este disco.
                    </p>
                )}
            </div>
        </div>
        </div>
    );
}

export default AlbumPage;
