import InicieSection from '../components/Inicie/InicieSection'
import SearchBar from '../components/Inicie/SearchBar'
import ArtistCard from '../components/Inicie/ArtistCard'

function HomePage() {
    const artists = [
        {
            id: 1,
            name: 'The Weeknd',
            genre: 'R&B • Pop',
            image:
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop'
        },
        {
            id: 2,
            name: 'Dua Lipa',
            genre: 'Pop • Dance',
            image:
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop'
        }
    ]

    return (
        <main className="min-h-screen bg-[#121212] px-4 py-10 text-white">
            <section className="mx-auto max-w-6xl">
                <InicieSection />

                <SearchBar />

                <h2 className='text-3xl font-bold m-2'>Tus artistas destacados</h2>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {artists.slice(0, 6).map((artist) => (
                        <ArtistCard
                            key={artist.id}
                            name={artist.name}
                            genre={artist.genre}
                            image={artist.image}
                        />
                    ))}
                </div>
            </section>
        </main>
    )
}

export default HomePage