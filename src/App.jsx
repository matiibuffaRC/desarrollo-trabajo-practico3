import { useEffect, useState } from "react";
import { getAccessToken } from "./services/spotifyApi";
import Header from "./components/Header/Header.jsx";
import HomePage from "./pages/HomePage.jsx";

function App() {
    const [token, setToken] = useState("");

    useEffect(() => {
        const fetchToken = async () => {
        try {
            const tokenObtenido = await getAccessToken();
            setToken(tokenObtenido);
        } catch (error) {
            console.error("Error al obtener el token de Spotify:", error);
        }
        };
        fetchToken();
    }, []);

    return (
        <>
        <Header />
        <HomePage token={token} />
        </>
    );
}

export default App;