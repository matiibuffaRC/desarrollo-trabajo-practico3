import { useState, useEffect } from "react";

import MobileOverlay from "./MobileOverlay";
import MobileSidebar from "./MobileSidebar";
import DesktopNav from "./DesktopNav";
import MobileMenuButton from "./MobileMenuButton";
import ArtistsFavList from "./ArtistsFavList";

const DEFAULT_ARTIST_IMAGE =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200";

const getArtistImage = (artist) =>
  artist.images?.[1]?.url ||
  artist.images?.[0]?.url ||
  artist.image ||
  DEFAULT_ARTIST_IMAGE;

const normalizeFavoriteArtist = (artist) => ({
  id: artist.id,
  name: artist.name || "Artista",
  genre: artist.genre || artist.genres?.slice(0, 2).join(" • ") || "Artista",
  image: getArtistImage(artist),
});

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isArtistsFavListOpen, setIsArtistsFavListOpen] = useState(false);

  const [favoriteArtists, setFavoriteArtists] = useState([]);

  useEffect(() => {
    const normalizeSavedFavorites = (saved) => {
      try {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed.map(normalizeFavoriteArtist) : [];
      } catch (err) {
        console.error("Error parseando favoritos en Header:", err);
        return [];
      }
    };

    // Inicializamos desde localStorage
    try {
      const saved = localStorage.getItem("spotify_favorites");
      if (saved) setFavoriteArtists(normalizeSavedFavorites(saved));
    } catch (e) {
      setFavoriteArtists([]);
    }

    // Escuchamos actualizaciones de favoritos desde HomePage
    const handler = (e) => {
      if (e?.detail) setFavoriteArtists(e.detail.map(normalizeFavoriteArtist));
      else {
        try {
          const saved = localStorage.getItem("spotify_favorites");
          setFavoriteArtists(saved ? normalizeSavedFavorites(saved) : []);
        } catch (err) {
          setFavoriteArtists([]);
        }
      }
    };

    window.addEventListener("spotify:favorites:updated", handler);

    return () =>
      window.removeEventListener("spotify:favorites:updated", handler);
  }, []);

  return (
    <>
      <MobileOverlay
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setIsArtistsFavListOpen={setIsArtistsFavListOpen}
      />

      <MobileSidebar
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        setIsArtistsFavListOpen={setIsArtistsFavListOpen}
      />

      <ArtistsFavList
        isArtistsFavListOpen={isArtistsFavListOpen}
        setIsArtistsFavListOpen={setIsArtistsFavListOpen}
        favoriteArtists={favoriteArtists}
      />
      <header className="sticky top-0 z-30 shadow-md bg-black/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3 md:hidden">
            <MobileMenuButton setIsMenuOpen={setIsMenuOpen} />
          </div>

          <DesktopNav setIsArtistsFavListOpen={setIsArtistsFavListOpen} />
        </div>
      </header>
    </>
  );
}

export default Header;
