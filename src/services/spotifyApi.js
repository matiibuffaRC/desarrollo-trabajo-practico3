import axios from 'axios';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

export const getAccessToken = async () => {
  const authString = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${authString}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error obteniendo el token de Spotify", error);
    throw error; // Esto nos servirá para el estado de "Error" solicitado 
  }
};
export const spotifyClient = axios.create({
    baseURL: 'https://api.spotify.com/v1',
});