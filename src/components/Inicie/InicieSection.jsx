import React from 'react'

function InicieSection() {
    return (
        <div className="my-10 flex flex-col gap-4 text-center">
            <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                Encontrá tus{' '}
                <span className="text-[#1DB954]">
                    artistas favoritos
                </span>
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base m-auto">
                Buscá artistas, explorá géneros y encontrá nueva música con una
                interfaz moderna inspirada en Spotify.
            </p>
        </div>
    )
}

export default InicieSection