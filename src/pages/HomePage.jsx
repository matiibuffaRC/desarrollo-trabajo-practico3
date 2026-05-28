// Importamos componentes
import InicieSection from "../components/Inicie/InicieSection";
import SearchBar from "../components/Inicie/SearchBar";
import StatusFeedback from "../components/StatusFeedback";
import FavoritesSection from "../components/Inicie/FavoritesSection";
import ArtistsGrid from "../components/Inicie/ArtistsGrid";

// Importamos dependencias
/* El navigate lo necesitamos para navegar entre páginas */
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import { useArtistSearch } from "../hooks/useArtistSearch";

function HomePage({ token }) {
    const navigate = useNavigate();
    const { favorites, toggleFavorite } = useFavorites();
    const { artists, loading, error, handleSearch } = useArtistSearch(token);

    const handleNavigate = (artistId, artistName) => {
        navigate(`/artist/${artistId}?name=${encodeURIComponent(artistName)}`);
    };

    return (
        <main className="min-h-screen bg-[#121212] px-4 py-10 text-white">
            <section className="mx-auto max-w-6xl">
                <InicieSection />
                {/* Barra de búsqueda */}
                <SearchBar onSearch={handleSearch} />
                {loading && (
                    <StatusFeedback type="loading" message="Buscando artistas..." />
                )}

                {error && <StatusFeedback type="error" message={error} />}

                <FavoritesSection
                    favorites={favorites}
                    onToggle={toggleFavorite}
                    onNavigate={handleNavigate}
                />

                <ArtistsGrid
                    artists={artists}
                    favorites={favorites}
                    loading={loading}
                    onToggle={toggleFavorite}
                    onNavigate={handleNavigate}
                />
            </section>
        </main>
    );
}

export default HomePage;
