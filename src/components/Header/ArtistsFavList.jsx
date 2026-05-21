import React from "react";

const DEFAULT_ARTIST_IMAGE =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200";

function ArtistsFavList({
  isArtistsFavListOpen,
  setIsArtistsFavListOpen,
  favoriteArtists,
}) {
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
              Artistas favoritos guardados
            </p>
          </div>

          <button
            onClick={() => setIsArtistsFavListOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-800 text-white hover:bg-zinc-700"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="flex flex-col gap-4">
            {favoriteArtists.map((artist) => (
              <div
                key={artist.id}
                className="flex items-center gap-4 rounded-2xl border border-zinc-800 bg-[#181818] p-3 hover:bg-zinc-900"
              >
                <img
                  src={artist.image || DEFAULT_ARTIST_IMAGE}
                  alt={artist.name}
                  className="h-16 w-16 rounded-xl object-cover"
                />

                <div className="flex flex-1 flex-col">
                  <h3 className="text-white font-bold">{artist.name}</h3>
                  <p className="text-sm text-zinc-400">{artist.genre}</p>
                </div>

                <div className="text-[#1DB954]">♥</div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

export default ArtistsFavList;
