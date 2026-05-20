import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import StatusFeedback from '../components/StatusFeedback'

function ArtistPage({ token }) {
    const { id } = useParams() // <-- Este es el ID del artista clickeado
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const artistName = searchParams.get('name') || "Artista"

    const [albums, setAlbums] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!token || !id) return

        const fetchAlbumsData = async () => {
            setLoading(true)
            setError(null)
            try {
                // Pegamos al endpoint pidiendo TYPE: ALBUM usando el ID del artista
                const { data } = await axios.get(`https://api.spotify.com/v1/search`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { 
                        q: id, 
                        type: 'album', // 👈 ¡AHORA BUSCAMOS SUS ÁLBUMES!
                        limit: 6 
                    }
                })
                
                if (data?.albums?.items) {
                    setAlbums(data.albums.items)
                } else {
                    throw new Error("No se encontraron álbumes")
                }
            } catch (err) {
                console.error("Error trayendo álbumes:", err)
                setError("Problema de CORS con los álbumes. Mostrando discos de demostración.")
                
                // Mocks específicos de Álbumes para que la vista no quede en blanco
                setAlbums([
                    { id: "alb_1", name: "Super Sangre Joven", release_date: "2019", images: [{ url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600" }] },
                    { id: "alb_2", name: "Desde el Fin del Mundo", release_date: "2021", images: [{ url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600" }] },
                    { id: "alb_3", name: "Ameri", release_date: "2024", images: [{ url: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600" }] }
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchAlbumsData()
    }, [id, token])

    const handleAddToFavorites = (e, album) => {
        e.stopPropagation() // No activa el click del álbum completo
        const currentSaved = localStorage.getItem('spotify_favorites')
        const favoritesArray = currentSaved ? JSON.parse(currentSaved) : []
        const alreadyExists = favoritesArray.some(fav => fav.id === album.id)

        if (!alreadyExists) {
            const newFavorite = {
                id: album.id,
                name: album.name,
                genres: [`Año: ${album.release_date?.slice(0,4)}`],
                images: [{}, { url: album.images?.[0]?.url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200' }]
            }
            localStorage.setItem('spotify_favorites', JSON.stringify([...favoritesArray, newFavorite]))
            alert(`¡"${album.name}" se guardó en tus favoritos de la Home! ⭐`)
        } else {
            alert("Este álbum ya es favorito.")
        }
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white p-8">
            <div className="mx-auto max-w-6xl">
                <button onClick={() => navigate('/')} className="mb-6 bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-5 py-2 rounded-full text-sm transition-colors">
                    ← Volver al Buscador
                </button>

                <h1 className="text-3xl font-bold mb-2">Álbumes de {decodeURIComponent(artistName)}</h1>
                <p className="text-gray-400 mb-8">Elegí un disco para ver sus canciones:</p>
                
                {loading && <StatusFeedback type="loading" message="Buscando álbumes en el servidor..." />}
                {error && <StatusFeedback type="error" message={error} />}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
                    {albums.length > 0 ? (
                        albums.map((album) => (
                            /* 🌟 Al clickear el álbum, nos lleva a AlbumPage (Vista 3) */
                            <div 
                                key={album.id} 
                                onClick={() => navigate(`/album/${album.id}?name=${encodeURIComponent(album.name)}`)}
                                className="relative group bg-zinc-900 p-4 rounded-lg hover:bg-zinc-800 transition-colors shadow-md border border-zinc-800 cursor-pointer transform hover:-translate-y-1"
                            >
                                <img 
                                    src={album.images?.[0]?.url || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600'} 
                                    alt={album.name} 
                                    className="w-full aspect-square object-cover rounded-md mb-4"
                                />
                                <h3 className="text-xl font-bold truncate pr-8">{album.name}</h3>
                                <p className="text-gray-400 text-sm mt-1">Lanzamiento: {album.release_date?.slice(0,4) || 'N/A'}</p>

                                <button 
                                    onClick={(e) => handleAddToFavorites(e, album)}
                                    className="absolute top-6 right-6 bg-[#1DB954] hover:bg-[#1ed760] text-black font-extrabold w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-lg transition-transform transform hover:scale-110"
                                >
                                    ❤️
                                </button>
                            </div>
                        ))
                    ) : (
                        !loading && <p className="text-gray-500">No se encontraron álbumes.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ArtistPage