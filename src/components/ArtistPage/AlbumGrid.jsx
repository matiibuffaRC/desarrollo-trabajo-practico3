import React from "react";

function AlbumGrid({ albums, navigate }) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {albums.length > 0 ? (
            albums.map((album) => (
            <div key={album.id} onClick={() =>navigate(`/album/${album.id}?name=${encodeURIComponent(album.name)}`,)} className="bg-zinc-900 p-4 rounded-lg hover:bg-zinc-800 transition-all shadow-md border border-zinc-800 cursor-pointer transform hover:-translate-y-1">
                <img src={album.images?.[0]?.url ||"https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600"} alt={album.name} className="w-full aspect-square object-cover rounded-md mb-4"/>

                <h3 className="text-xl font-bold truncate">{album.name}</h3>

                <p className="text-gray-400 text-sm mt-1">
                    Año de lanzamiento: {album.release_date?.slice(0, 4) || "N/A"}
                </p>
            </div>
            ))
        ) : (
            <p className="text-gray-500 ">No se encontraron álbumes disponibles.</p>
        )}
        </div>
    );
}

export default AlbumGrid;
