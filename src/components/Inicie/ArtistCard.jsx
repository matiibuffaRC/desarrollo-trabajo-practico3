import React from 'react'

function ArtistCard({ name, genre, image }) {
    return (
        <article className="group flex items-center gap-4 rounded-2xl bg-[#181818] p-3 transition-all duration-300 hover:bg-[#202020] hover:shadow-xl hover:shadow-black/30">
            
            {/* IMAGE */}
            <div className="relative shrink-0 overflow-hidden rounded-xl">
                <img
                    src={image}
                    alt={name}
                    className="h-20 w-20 object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* INFO */}
            <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-bold tracking-tight">
                    {name}
                </h2>

                <p className="mt-1 text-sm text-zinc-400">
                    {genre}
                </p>
            </div>

            {/* PLAY BUTTON */}
            <button className="rounded-full bg-[#1DB954] p-3 text-black opacity-0 transition-all duration-300 group-hover:opacity-100">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-5"
                >
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286l-11.54 6.347c-1.25.687-2.779-.216-2.779-1.643V5.653Z"
                    />
                </svg>
            </button>
        </article>
    )
}

export default ArtistCard