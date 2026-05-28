import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage';
import ArtistPage from './pages/ArtistPage';
import AlbumPage from './pages/AlbumPage';
import Player from './components/Player';
import { getAccessToken, buildSpotifyAuthUrl } from './services/spotify';

function App() {
    // El token de acceso sirve para autenticas las solicitudes a la API de Spotify. Si o si las necesitamos para interacturar con la API.
    const [token, setToken] = useState(null);
    const [authError, setAuthError] = useState(null);

    // El useEffect lo que hace es ejecutar la función getAccessToken cuando el componente se monta
    useEffect(() => {
        getAccessToken()
            .then((accessToken) => setToken(accessToken))
            .catch((error) => {
                console.error('Auth error:', error);
                setAuthError('No se pudo finalizar el inicio de sesión de Spotify.');
            });
    }, []);

    // La ejecutamos cuando el usuario se loguea
    const handleLogin = async () => {
        try {
            const authUrl = await buildSpotifyAuthUrl();
            window.location.assign(authUrl);
        } catch (error) {
            console.error('No se pudo generar la URL de login:', error);
            setAuthError('Error generando la URL de inicio de sesión.');
        }
    };

    return (
        <Router>
            {/* Validamos si temos el token de acceso */}
            {!token ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <button
                        onClick={handleLogin}
                        className="rounded-full bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-500 transition"
                    >
                        Iniciar sesión con Spotify
                    </button>
                    {/* Validamos si aparece un error */}
                    {authError && (
                        <p className="mt-4 text-sm text-red-400">{authError}</p>
                    )}
                </div>
            ) : (
                <>
                    <Header />
                    <Routes>
                        <Route path="/" element={<HomePage token={token} />} />
                        <Route path="/artist/:id" element={<ArtistPage token={token} />} />
                        <Route path="/album/:albumId" element={<AlbumPage token={token} />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                    <Player token={token} />
                </>
            )}
        </Router>
    );
}

export default App;