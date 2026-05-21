import ArtistCard from "./ArtistCard";
import CorazonVacio from "../../assets/icons/heartVacio.svg";
import CorazonRelleno from "../../assets/icons/heartRelleno.svg";

function ArtistCardWithFavorite({ artist, isFav, onToggle, onNavigate }) {
  return (
    <div
      onClick={onNavigate}
      className="cursor-pointer relative group transform hover:-translate-y-1 transition-transform"
    >
      <ArtistCard
        name={artist.name}
        genre={artist.genres?.slice(0, 2).join(" • ") || "Artista"}
        image={artist.image}
      />

      <button
        onClick={onToggle}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
        title={isFav ? "Quitar de favoritos" : "Añadir a favoritos"}
      >
        <img
          src={isFav ? CorazonRelleno : CorazonVacio}
          alt="Favorito"
          className="w-4 h-4 invert cursor-pointer"
        />
      </button>
    </div>
  );
}

export default ArtistCardWithFavorite;
