import React from "react";

function ArtistCard({ name, genre, image }) {
    return (
        <article className="group flex items-center gap-4 rounded-2xl bg-[#181818] p-3 transition-all duration-300 hover:bg-[#202020] hover:shadow-xl hover:shadow-black/30">
            <div className="relative shrink-0 overflow-hidden rounded-xl">
                <img src={image} alt={name} className="h-20 w-20 object-cover transition-transform duration-500 group-hover:scale-105"/>
            </div>
            {/* Información */}
            <div className="min-w-0 flex-1">
                <h2 className="truncate text-lg font-bold tracking-tight">{name}</h2>

                <p className="mt-1 text-sm text-zinc-400">{genre}</p>
            </div>
        </article>
    );
}

export default ArtistCard;
