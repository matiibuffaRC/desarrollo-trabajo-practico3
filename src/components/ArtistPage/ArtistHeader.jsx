import React from "react";

const DEFAULT_PLACEHOLDER = "https://via.placeholder.com/300x300?text=Artista";

function ArtistHeader({ artist }) {
    return (
        <section className="mb-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">
        <img
            src={artist.images?.[0]?.url || DEFAULT_PLACEHOLDER}
            alt={artist.name}
            className="w-52 h-52 object-cover rounded-2xl shadow-lg"
        />

        <div className="flex-1 text-center md:text-left">
            <p className="text-green-400 uppercase tracking-widest text-sm mb-2">
                Artista
            </p>

            <h1 className="text-4xl font-black mb-4">{artist.name}</h1>

            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {artist.genres?.length > 0 ? (
                artist.genres.map((genre, index) => (
                <span
                    key={index}
                    className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-sm"
                >
                    {genre}
                </span>
                ))
            ) : (
                <span className="text-zinc-500 text-sm hidden">
                Sin géneros disponibles
                </span>
            )}
            </div>
        </div>
        </section>
    );
}

export default ArtistHeader;
