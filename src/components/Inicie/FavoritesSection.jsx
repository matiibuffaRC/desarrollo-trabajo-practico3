import ArtistCardWithFavorite from "./ArtistCardWithFavorite";

function FavoritesSection({ favorites, onToggle, onNavigate }) {
  if (favorites.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 mb-6">
      <h2 className="text-2xl font-bold text-[#1DB954] mb-4">
        Mis Artistas Favoritos
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((fav) => (
          <ArtistCardWithFavorite
            key={fav.id}
            artist={fav}
            isFav={true}
            onToggle={(e) => onToggle(e, fav)}
            onNavigate={() => onNavigate(fav.id, fav.name)}
          />
        ))}
      </div>

      <hr className="border-zinc-800 mt-8" />
    </div>
  );
}

export default FavoritesSection;
