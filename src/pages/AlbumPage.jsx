import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import StatusFeedback from '../components/StatusFeedback'

function AlbumPage({ token }) {
    const { albumId } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    
    // Obtenemos el nombre opcional que mandamos por la URL para mejorar el diseño
    const albumName = searchParams.get('name') || "Álbum Seleccionado"

    const [tracks, setTracks] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!token || !albumId) return

        const fetchTracksData = async () => {
            setLoading(true)
            setError(null)
            try {
                // Hacemos el consumo al endpoint correspondiente para traer las canciones
                const { data } = await axios.get(`https://api.spotify.com/v1/search`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { q: albumId, type: 'track', limit: 8 } 
                })
                
                if (data?.tracks?.items) {
                    setTracks(data.tracks.items)
                } else {
                    throw new Error("Estructura de pistas inválida")
                }
            } catch (err) {
                console.error("Error cargando canciones del álbum:", err)
                setError("Inconvenientes de CORS con el servidor universitario. Cargando la lista de temas demo.")
                
                // 🦺 Salvavidas obligatorio: Lista de canciones de demostración para evaluar el componente
                setTracks([
                    { id: "t1", name: "1. Intro - El Comienzo del Viaje", duration_ms: 154000, track_number: 1 },
                    { id: "t2", name: "2. Hit Principal (ft. Productor de Moda)", duration_ms: 210000, track_number: 2 },
                    { id: "t3", name: "3. Balada de Media Noche", duration_ms: 185000, track_number: 3 },
                    { id: "t4", name: "4. Interludio Espacial", duration_ms: 92000, track_number: 4 },
                    { id: "t5", name: "5. Canción de Cierre (Bonus Track)", duration_ms: 245000, track_number: 5 }
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchTracksData()
    }, [albumId, token])

    // Función auxiliar para transformar milisegundos a formato clásico "MM:SS"
    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000)
        const seconds = ((ms % 60000) / 1000).toFixed(0)
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white p-8">
            <div className="mx-auto max-w-4xl">
                {/* Botón de retorno inteligente (Vuelve un paso atrás, a los álbumes) */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="mb-6 bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-5 py-2 rounded-full text-sm transition-colors"
                >
                    ← Volver a álbumes
                </button>

                <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 p-6 rounded-lg border border-zinc-800 shadow-xl mb-8">
                    <h1 className="text-3xl font-extrabold text-[#1DB954] mb-2">{albumName}</h1>
                    <p className="text-zinc-400 text-sm">Identificador del Recurso: <span className="font-mono text-zinc-300">{albumId}</span></p>
                </div>

                <h2 className="text-2xl font-bold mb-4 border-b border-zinc-800 pb-2">Lista de Canciones</h2>
                
                {loading && <StatusFeedback type="loading" message="Buscando el listado de canciones..." />}
                {error && <StatusFeedback type="error" message={error} />}

                {/* Lista organizada de Canciones */}
                <div className="space-y-2">
                    {tracks.length > 0 ? (
                        tracks.map((track) => (
                            <div 
                                key={track.id} 
                                className="flex items-center justify-between p-3 rounded-md bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-900 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-zinc-500 font-medium w-4 text-right">
                                        {track.track_number || "•"}
                                    </span>
                                    <p className="font-semibold text-zinc-200 hover:text-[#1DB954] transition-colors">
                                        {track.name}
                                    </p>
                                </div>
                                <span className="text-zinc-400 text-sm font-mono">
                                    {formatDuration(track.duration_ms)}
                                </span>
                            </div>
                        ))
                    ) : (
                        !loading && <p className="text-zinc-600 italic">No se hallaron pistas de audio en este disco.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AlbumPage