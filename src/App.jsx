// Dependencias
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAccessToken } from './services/spotifyApi';
// Componentes
import Header from "../src/components/Header/Header.jsx";
import AlbumPage from "../src/components/pages/AlbumPage";
import ArtistPage from "../src/components/pages/ArtistPage";
import HomePage from "../src/components/pages/homeePage";
import StatusFeedback from "./components/StatusFeedback"

function App() {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setLoading(true);
        const accessToken = await getAccessToken();
        setToken(accessToken);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };
    fetchToken();
  }, []);

  if (loading) return <StatusFeedback type="loading" message="Conectando con Spotify..." />;
  if (error) return <StatusFeedback type="error" message="Error de autenticación. Revisa el .env" />;

  return (
    <Router>
      <Header /> {/* Tu componente Header se mantiene fijo arriba */}
      <main className="container">
        <Routes>
          {/* Vista 1: Buscador (Opción #3 [cite: 39]) */}
          <Route path="/" element={<HomePage token={token} />} />
          
          {/* Vista 2: Álbumes (Opción #3 [cite: 40]) */}
          <Route path="/artist/:artistId" element={<ArtistPage token={token} />} />
          
          {/* Vista 3: Canciones (Opción #3 [cite: 41]) */}
          <Route path="/album/:albumId" element={<AlbumPage token={token} />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App
