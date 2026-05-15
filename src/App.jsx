import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAccessToken } from './services/spotifyApi';
import Header from "./components/Header/Header.jsx";
import AlbumPage from "./components/pages/AlbumPage.jsx";
import ArtistPage from "./components/pages/ArtistPage.jsx";
import HomePage from "./components/pages/HomePage.jsx";

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
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<HomePage token={token} />} />
          <Route path="/artist/:artistId" element={<ArtistPage token={token} />} />
          <Route path="/album/:albumId" element={<AlbumPage token={token} />} />
        </Routes>
      </main>
    </Router>
  );
}
export default App