import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import HomePage from './pages/HomePage'
import ArtistPage from './pages/ArtistPage'
import AlbumPage from './pages/AlbumPage'
import { getAccessToken } from './services/spotifyApi'

function App() {
  const [token, setToken] = useState(null)

  useEffect(() => {
    async function fetchToken() {
      try {
        const resToken = await getAccessToken()
        setToken(resToken)
      } catch (err) {
        console.error("Error al obtener token", err)
      }
    }
    fetchToken()
  }, [])

  return (
    <BrowserRouter> {/* Este es el único enrutador de toda la app */}
      <Routes>
        <Route path="/" element={<HomePage token={token} />} />
        <Route path="/artist/:id" element={<ArtistPage token={token} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App