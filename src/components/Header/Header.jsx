import { useState, useEffect } from "react";

import MobileOverlay from "./MobileOverlay";
import MobileSidebar from "./MobileSidebar";
import DesktopNav from "./DesktopNav";
import MobileMenuButton from "./MobileMenuButton";
import ArtistsFavList from "./ArtistsFavList";

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isArtistsFavListOpen, setIsArtistsFavListOpen] = useState(false);

    const [favoriteArtists, setFavoriteArtists] = useState([]);

    useEffect(() => {
        // Inicializamos desde localStorage
        try {
        const saved = localStorage.getItem("spotify_favorites");
        if (saved) setFavoriteArtists(JSON.parse(saved));
        } catch (e) {
        setFavoriteArtists([]);
        }

        // Escuchamos actualizaciones de favoritos desde HomePage
        const handler = (e) => {
        if (e?.detail) setFavoriteArtists(e.detail);
        else {
            try {
            const saved = localStorage.getItem("spotify_favorites");
            setFavoriteArtists(saved ? JSON.parse(saved) : []);
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
            <div className="flex items-center gap-3">
                <MobileMenuButton setIsMenuOpen={setIsMenuOpen} />

                
            </div>

            <DesktopNav setIsArtistsFavListOpen={setIsArtistsFavListOpen} />
            </div>
        </header>
        </>
    );
}

export default Header;
