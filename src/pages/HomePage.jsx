import InicieSection from '../components/Inicie/InicieSection'
import SearchBar from '../components/Inicie/SearchBar'
import ArtistCard from '../components/Inicie/ArtistCard'
import StatusFeedback from "../components/StatusFeedback"
import { useNavigate } from 'react-router-dom' 
import axios from 'axios'
import { useState, useEffect } from 'react'

function HomePage({ token }) {
    const navigate = useNavigate()
    const [artists, setArtists] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [favorites, setFavorites] = useState([])
    
    // Cargar favoritos del LocalStorage al iniciar
    useEffect(() => {
        const savedFavs = localStorage.getItem('spotify_favorites')
        if (savedFavs) setFavorites(JSON.parse(savedFavs))
    }, [])
    
    const handleSearch = async (searchKey) => {
        if (!searchKey) return
        
        setLoading(true)
        setError(null)

        try {
            // Buscamos ARTISTAS que coincidan con la palabra ingresada
            const { data } = await axios.get("https://api.spotify.com/v1/search", {
                headers: { Authorization: `Bearer ${token}` },
                params: {   
                    q: searchKey,
                    type: "artist",
                    limit: 6
                }
            })
            
            if (data?.artists?.items) {
                setArtists(data.artists.items)
            } else {
                throw new Error("Estructura inesperada")
            }
        } catch (err) {
            console.error("Error en búsqueda:", err)
            setError("Problemas de CORS. Cargando artistas de simulación.")
            
            // Salvavidas por si falla la API
            setArtists([
                { id: "artist_duki", name: "Duki", genres: ["Trap"], images: [{}, { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200" }] },
                { id: "artist_biza", name: "Bizarrap", genres: ["EDM"], images: [{}, { url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200" }] }
            ])
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-[#121212] px-4 py-10 text-white">
            <section className="mx-auto max-w-6xl">
                <InicieSection />
                <SearchBar onSearch={handleSearch} />
                
                {loading && <StatusFeedback type="loading" message="Buscando artistas..." />}
                {error && <StatusFeedback type="error" message={error} />}

                {/* Sección de Favoritos (Si existen) */}
                {favorites.length > 0 && (
                    <div className="mt-8 mb-6">
                        <h2 className='text-2xl font-bold m-2 text-[#1DB954] mb-4'>❤️ Tus Favoritos</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {favorites.map((fav) => (
                                <div key={fav.id} onClick={() => navigate(`/album/${fav.id}?name=${encodeURIComponent(fav.name)}`)} className="cursor-pointer">
                                    <ArtistCard
                                        id={fav.id} 
                                        name={fav.name}
                                        genre={fav.genres?.[0] || 'Favorito'}
                                        image={fav.images?.[1]?.url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200'}
                                    />
                                </div>
                            ))}
                        </div>
                        <hr className="border-zinc-800 mt-8" />
                    </div>
                )}

                {/* Resultados de la búsqueda de ARTISTAS */}
                <h2 className='text-3xl font-bold m-2 mt-8'>Artistas encontrados</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                    {artists.length > 0 ? (
                        artists.map((artist) => (
                            /* 🌟 AL CLICKEAR AL ARTISTA: Viaja a ArtistPage pasándole su ID real */
                            <div 
                                key={artist.id} 
                                onClick={() => navigate(`/artist/${artist.id}?name=${encodeURIComponent(artist.name)}`)}
                                className="cursor-pointer transform hover:-translate-y-1 transition-transform"
                            >
                                <ArtistCard
                                    id={artist.id} 
                                    name={artist.name}
                                    genre={artist.genres?.slice(0, 2).join(' • ') || 'Artista'}
                                    image={artist.images?.[1]?.url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200'}
                                />
                            </div>
                        ))
                    ) : (
                        !loading && <p className="text-gray-400 m-2 col-span-full">Usa el buscador de arriba para encontrar artistas.</p>
                    )}
                </div>
            </section>
        </main>
    )
}

export default HomePage