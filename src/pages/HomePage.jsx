import InicieSection from '../components/Inicie/InicieSection'
import SearchBar from '../components/Inicie/SearchBar'
import ArtistCard from '../components/Inicie/ArtistCard'
import StatusFeedback from "../components/StatusFeedback";
import axios from 'axios'
import { useState } from 'react'

function HomePage({ token }) {
    const [artists, setArtists] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    
    const handleSearch = async (searchKey) => {
        if (!searchKey) return
        
        setLoading(true)
        setError(null)

        try {
            const { data } = await axios.get("https://api.spotify.com/v1/search", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    q: searchKey,
                    type: "artist",
                    limit: 6
                }
            })
            
            setArtists(data.artists.items)
        } catch (err) {
            console.error("Error capturado en la petición:", err)
        }
    }

    return (
        <main className="min-h-screen bg-[#121212] px-4 py-10 text-white">
            <section className="mx-auto max-w-6xl">
                <InicieSection />
                <SearchBar onSearch={handleSearch} />
                
                {loading && <StatusFeedback type="loading" message="Buscando en Spotify..." />}
                {error && <StatusFeedback type="error" message={error} />}

                <h2 className='text-3xl font-bold m-2 mt-8'>Resultados de la búsqueda</h2>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                    {artists.length > 0 ? (
                        artists.map((artist) => (
                            <ArtistCard
                                key={artist.id}
                                id={artist.id} 
                                name={artist.name}
                                genre={artist.genres?.slice(0, 2).join(' • ') || 'Artista'}
                                image={artist.images[1]?.url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200'}
                            />
                        ))
                    ) : (
                        !loading && <p className="text-gray-400 m-2 col-span-full">Usa el buscador de arriba para encontrar tus artistas favoritos.</p>
                    )}
                </div>
            </section>
        </main>
    )
}

export default HomePage