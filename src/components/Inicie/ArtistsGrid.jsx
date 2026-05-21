import ArtistCardWithFavorite from "./ArtistCardWithFavorite";

function ArtistsGrid({ artists, favorites, loading, onToggle, onNavigate }) {
  return (
    <>
      <h2 className="text-3xl font-bold m-2 mt-8">Artistas encontrados</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
        {artists.length > 0
          ? artists.map((artist) => {
              const isFav = favorites.some((fav) => fav.id === artist.id);

              return (
                <ArtistCardWithFavorite
                  key={artist.id}
                  artist={artist}
                  isFav={isFav}
                  onToggle={(e) => onToggle(e, artist)}
                  onNavigate={() => onNavigate(artist.id, artist.name)}
                />
              );
            })
          : !loading && (
              <p className="text-gray-400 m-2 col-span-full">
                Usa el buscador de arriba para encontrar artistas.
              </p>
            )}
      </div>
    </>
  );
}

export default ArtistsGrid;
