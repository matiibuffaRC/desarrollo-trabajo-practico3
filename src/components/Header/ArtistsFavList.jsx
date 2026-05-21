import React from "react";
import { useNavigate } from "react-router-dom";
import CorazonVacio from "../../assets/icons/heartVacio.svg";
import CorazonRelleno from "../../assets/icons/heartRelleno.svg";

const DEFAULT_ARTIST_IMAGE =
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200";

function ArtistsFavList({
    isArtistsFavListOpen,
    setIsArtistsFavListOpen,
    favoriteArtists,
    }) {
    const navigate = useNavigate();

    // Manejar toggle de favoritos (eliminar de la lista)
    const handleToggleFavorite = (e, artist) => {
        e.stopPropagation();

        const updatedFavorites = favoriteArtists.filter(
        (fav) => fav.id !== artist.id,
        );

        // Actualizar localStorage
        localStorage.setItem("spotify_favorites", JSON.stringify(updatedFavorites));

        // Dispatchear evento para sincronizar con otros componentes
        try {
        window.dispatchEvent(
            new CustomEvent("spotify:favorites:updated", {
            detail: updatedFavorites,
            }),
        );
        } catch (err) {
        console.error("Error dispatching favorites update:", err);
        }
    };

    // Navegar a la página del artista
    const handleNavigateToArtist = (artist) => {
        setIsArtistsFavListOpen(false);
        navigate(`/artist/${artist.id}?name=${encodeURIComponent(artist.name)}`);
    };

    return (
        <>
        {/* OVERLAY */}
        <div
            onClick={() => setIsArtistsFavListOpen(false)}
            className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-all duration-300 ${
            isArtistsFavListOpen ? "visible opacity-100" : "invisible opacity-0"
            }`}
        />

        {/* DRAWER */}
        <aside
            className={`fixed right-0 top-0 z-50 flex h-screen w-full max-w-95 flex-col border-l border-zinc-800 bg-[#121212] transition-transform duration-300 ${
            isArtistsFavListOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-zinc-800 p-5">
            <div>
                <h2 className="text-xl font-black text-white">
                Todos tus artistas favoritos
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                {favoriteArtists.length > 0
                    ? `${favoriteArtists.length} artista${favoriteArtists.length !== 1 ? "s" : ""}`
                    : "Sin favoritos aún"}
                </p>
            </div>

            <button
                onClick={() => setIsArtistsFavListOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-white hover:bg-zinc-700 cursor-pointer transition-colors"
                title="Cerrar"
            >
                ✕
            </button>
            </div>

            {/* CONTENT */}
            <div className="flex-1 overflow-y-auto p-5">
            {favoriteArtists.length > 0 ? (
                <div className="flex flex-col gap-4">
                {favoriteArtists.map((artist) => (
                    <div
                    key={artist.id}
                    onClick={() => handleNavigateToArtist(artist)}
                    className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-[#181818] p-3 hover:bg-zinc-900 cursor-pointer transition-colors group"
                    >
                    <img
                        src={artist.image || DEFAULT_ARTIST_IMAGE}
                        alt={artist.name}
                        className="h-16 w-16 rounded-xl object-cover"
                    />

                    <div className="flex flex-1 flex-col">
                        <h3 className="text-white font-bold group-hover:text-[#1DB954] transition-colors">
                        {artist.name}
                        </h3>
                        <p className="text-sm text-zinc-400">{artist.genre}</p>
                    </div>

                    <button
                        onClick={(e) => handleToggleFavorite(e, artist)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#1DB954]/10 hover:bg-[#1DB954]/20 transition-colors"
                        title="Quitar de favoritos"
                    >
                        <img
                        src={CorazonRelleno}
                        alt="Quitar de favoritos"
                        className="w-5 h-5 invert"
                        />
                    </button>
                    </div>
                ))}
                </div>
            ) : (
                <div className="flex h-full items-center justify-center">
                <p className="text-center text-zinc-400">
                    No tienes artistas favoritos aún.
                    <br />
                    <span className="text-sm">
                    Agrega tus artistas favoritos desde la búsqueda.
                    </span>
                </p>
                </div>
            )}
            </div>
        </aside>
        </>
    );
}

export default ArtistsFavList;
