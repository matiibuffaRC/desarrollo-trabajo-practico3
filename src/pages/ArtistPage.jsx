import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'
import StatusFeedback from '../components/StatusFeedback'

function ArtistPage({ token }) {

    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    const artistName = searchParams.get('name') || "Artista"

    const [albums, setAlbums] = useState([])
    const [artist, setArtist] = useState(null)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {

        if (!token || !id) return

        const fetchAlbumsData = async () => {

            setLoading(true)
            setError(null)

            try {

                // DATOS DEL ARTISTA
                const artistResponse = await axios.get(
                    `https://api.spotify.com/v1/artists/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                setArtist(artistResponse.data)

                // ÁLBUMES
                const { data } = await axios.get(
                    `https://api.spotify.com/v1/search`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        params: {
                            q: artistName,
                            type: 'album',
                            limit: 6
                        }
                    }
                )

                if (data?.albums?.items) {

                    setAlbums(data.albums.items)

                } else {

                    throw new Error("No se encontraron álbumes")

                }

            } catch (err) {

                console.error("Error trayendo álbumes:", err)

                setError(
                    "Inconvenientes de red. Desplegando catálogo de simulación."
                )

                // FALLBACK ARTISTA
                setArtist({
                    name: artistName,
                    genres: [],
                    images: []
                })

                const nameLower = artistName.toLowerCase()

                // FALLBACK ÁLBUMES
                if (nameLower.includes("duki")) {

                    setAlbums([
                        {
                            id: "duki_alb1",
                            name: "Ameri",
                            release_date: "2024",
                            images: [{
                                url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600"
                            }]
                        },
                        {
                            id: "duki_alb2",
                            name: "Desde el Fin del Mundo",
                            release_date: "2021",
                            images: [{
                                url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600"
                            }]
                        },
                        {
                            id: "duki_alb3",
                            name: "Super Sangre Joven",
                            release_date: "2019",
                            images: [{
                                url: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600"
                            }]
                        }
                    ])

                } else if (
                    nameLower.includes("biza") ||
                    nameLower.includes("bizarrap")
                ) {

                    setAlbums([
                        {
                            id: "biza_alb1",
                            name: "Bzrp Music Sessions, Vol. 50+",
                            release_date: "2023",
                            images: [{
                                url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600"
                            }]
                        }
                    ])

                } else {

                    setAlbums([
                        {
                            id: `gen_alb1_${id}`,
                            name: `Lo Mejor de ${artistName} (Essential)`,
                            release_date: "2026",
                            images: [{
                                url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600"
                            }]
                        },
                        {
                            id: `gen_alb2_${id}`,
                            name: "Greatest Hits (Live)",
                            release_date: "2025",
                            images: [{
                                url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600"
                            }]
                        }
                    ])

                }

            } finally {

                setLoading(false)

            }

        }

        fetchAlbumsData()

    }, [id, token, artistName])

    return (

        <div className="min-h-screen bg-[#121212] text-white p-8">

            <div className="mx-auto max-w-6xl">

                {/* BOTÓN */}
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 bg-zinc-800 hover:bg-zinc-700 text-white font-medium px-5 py-2 rounded-full text-sm transition-colors shadow-md cursor-pointer"
                >
                    ← Volver al Buscador
                </button>

                {/* INFO DEL ARTISTA */}
                {artist && (

                    <section className="mb-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6">

                        {/* FOTO */}
                        <img
                            src={
                                artist.images?.[0]?.url ||
                                'https://via.placeholder.com/300x300?text=Artista'
                            }
                            alt={artist.name}
                            className="w-52 h-52 object-cover rounded-2xl shadow-lg"
                        />

                        {/* INFO */}
                        <div className="flex-1 text-center md:text-left">

                            <p className="text-green-400 uppercase tracking-widest text-sm mb-2">
                                Artista
                            </p>

                            <h1 className="text-4xl font-black mb-4">
                                {artist.name}
                            </h1>

                            <div className="flex flex-wrap gap-2 justify-center md:justify-start">

                                {artist.genres?.length > 0 ? (

                                    artist.genres.map((genre, index) => (

                                        <span
                                            key={index}
                                            className="bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full text-sm"
                                        >
                                            {genre}
                                        </span>

                                    ))

                                ) : (

                                    <span className="text-zinc-500 text-sm hidden">
                                        Sin géneros disponibles
                                    </span>

                                )}

                            </div>

                        </div>

                    </section>

                )}

                {/* TÍTULO */}
                <h1 className="text-3xl font-bold mb-2">
                    Álbumes de {decodeURIComponent(artistName)}
                </h1>

                <p className="text-gray-400 mb-8">
                    Seleccioná un disco para ver su listado de canciones:
                </p>

                {/* ESTADOS */}
                {loading && (
                    <StatusFeedback
                        type="loading"
                        message="Buscando álbumes en el servidor..."
                    />
                )}

                {error && (
                    <StatusFeedback
                        type="error"
                        message={error}
                    />
                )}

                {/* GRID */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">

                    {albums.length > 0 ? (

                        albums.map((album) => (

                            <div
                                key={album.id}
                                onClick={() =>
                                    navigate(
                                        `/album/${album.id}?name=${encodeURIComponent(album.name)}`
                                    )
                                }
                                className="bg-zinc-900 p-4 rounded-lg hover:bg-zinc-800 transition-all shadow-md border border-zinc-800 cursor-pointer transform hover:-translate-y-1"
                            >

                                <img
                                    src={
                                        album.images?.[0]?.url ||
                                        'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600'
                                    }
                                    alt={album.name}
                                    className="w-full aspect-square object-cover rounded-md mb-4"
                                />

                                <h3 className="text-xl font-bold truncate">
                                    {album.name}
                                </h3>

                                <p className="text-gray-400 text-sm mt-1">
                                    Año de lanzamiento:{' '}
                                    {album.release_date?.slice(0, 4) || 'N/A'}
                                </p>

                            </div>

                        ))

                    ) : (

                        !loading && (
                            <p className="text-gray-500 ">
                                No se encontraron álbumes disponibles.
                            </p>
                        )

                    )}

                </div>

            </div>

        </div>

    )

}

export default ArtistPage