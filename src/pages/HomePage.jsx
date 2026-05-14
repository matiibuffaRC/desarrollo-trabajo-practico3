import React from 'react'

function homePage() {
    return (
        <main className="min-h-screen bg-[#121212] text-white px-4 py-10">
            <section className="max-w-6xl mx-auto">
                {/* HERO */}
                <div className="mb-10 flex flex-col gap-4">
                    <span className="w-fit rounded-full bg-[#1DB954]/20 px-4 py-1 text-sm font-medium text-[#1DB954]">
                        Spotify Inspired UI
                    </span>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight">
                        Descubrí tus <span className="text-[#1DB954]">artistas favoritos</span>
                    </h1>

                    <p className="max-w-2xl text-sm sm:text-base text-zinc-400 leading-relaxed">
                        Buscá artistas, explorá géneros y encontrá nueva música con una interfaz moderna inspirada en Spotify.
                    </p>
                </div>

                {/* SEARCH */}
                <div className="relative mb-10">
                    <input
                        type="text"
                        placeholder="Buscar artistas..."
                        className="w-full rounded-2xl border border-zinc-800 bg-[#181818] px-6 py-4 pr-14 text-sm sm:text-base outline-none transition-all duration-300 placeholder:text-zinc-500 focus:border-[#1DB954] focus:ring-4 focus:ring-[#1DB954]/20"
                    />

                    <button className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-[#1DB954] p-3 text-black transition-transform duration-300 hover:scale-105">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="size-5"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6 16.5a7.5 7.5 0 0 0 10.65 0Z"
                        />
                        </svg>
                    </button>
                </div>

                {/* RESULTS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <article className="group rounded-3xl bg-[#181818] p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-[#202020] hover:shadow-2xl hover:shadow-black/40">
                        <div className="relative overflow-hidden rounded-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop"
                            alt="The Weeknd"
                            className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <button className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1DB954] text-black opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 translate-y-4">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-7"
                            >
                            <path
                                fillRule="evenodd"
                                d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286l-11.54 6.347c-1.25.687-2.779-.216-2.779-1.643V5.653Z"
                                clipRule="evenodd"
                            />
                            </svg>
                        </button>
                        </div>

                        <div className="mt-5">
                        <h2 className="text-xl font-bold tracking-tight">
                            The Weeknd
                        </h2>

                        <p className="mt-1 text-sm text-zinc-400">
                            R&B • Pop
                        </p>
                        </div>
                    </article>

                    <article className="group rounded-3xl bg-[#181818] p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-[#202020] hover:shadow-2xl hover:shadow-black/40">
                        <div className="relative overflow-hidden rounded-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop"
                            alt="Dua Lipa"
                            className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        <button className="absolute bottom-4 right-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1DB954] text-black opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 translate-y-4">
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="size-7"
                            >
                            <path
                                fillRule="evenodd"
                                d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286l-11.54 6.347c-1.25.687-2.779-.216-2.779-1.643V5.653Z"
                                clipRule="evenodd"
                            />
                            </svg>
                        </button>
                        </div>

                        <div className="mt-5">
                        <h2 className="text-xl font-bold tracking-tight">
                            Dua Lipa
                        </h2>

                        <p className="mt-1 text-sm text-zinc-400">
                            Pop • Dance
                        </p>
                        </div>
                    </article>
                </div>
            </section>
    </main>
    )
}

export default homePage
