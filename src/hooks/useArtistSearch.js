import { useState } from "react";
import axios from "axios";

export const useArtistSearch = (token) => {
    const [artists, setArtists] = useState([]);
    // Estado para manejar estado de cargas
    // NO LO TOQUES TUTE
    const [loading, setLoading] = useState(false);
    // Estado para manejar errores
    // TAMPOCO LO TOQUES TUTE
    const [error, setError] = useState(null);

    const handleSearch = async (searchKey) => {
        // La searchkey es lo que ingresa el usuario en la barra de búsqueda
        if (!searchKey) return;
        setLoading(true);
        setError(null);

        try {
            // Petición a la API
            const { data } = await axios.get("https://api.spotify.com/v1/search", {
                // Estructura de la petición
                //  Header para la autenticación
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    q: searchKey,
                    type: "artist",
                    limit: 6,
                },
            });

            if (data?.artists?.items) {
                setArtists(data.artists.items);
            } else {
                throw new Error("Estructura inesperada");
            }
            } catch (err) {
                console.error("Error en búsqueda:", err);
            } 
            finally {
                setLoading(false);
            }
        };
    return { artists, loading, error, handleSearch };
};
