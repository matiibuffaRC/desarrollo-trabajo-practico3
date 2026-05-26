// Importamos las dependencias
import React, { useEffect, useState } from 'react';

function Player({ token }) {
    const [deviceId, setDeviceId] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!token) return;
        if (window.spotifyPlayerInitialized) return;

        window.spotifyPlayerInitialized = true;

        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: 'Reproductor Web Spotify',
                getOAuthToken: (cb) => cb(token),
                volume: 0.5,
            });

            window.spotifyPlayer = player;

            player.connect();

            player.addListener('ready', ({ device_id }) => {
                window.spotifyDeviceId = device_id;
                setDeviceId(device_id);
                setReady(true);
                window.dispatchEvent(new Event('spotify:player-ready'));
                console.log('Reproductor listo. ID:', device_id);
            });

            player.addListener('not_ready', ({ device_id }) => {
                console.log('Reproductor Spotify desconectado. ID:', device_id);
                if (window.spotifyDeviceId === device_id) {
                    window.spotifyDeviceId = null;
                    setDeviceId(null);
                    setReady(false);
                }
            });

            player.addListener('initialization_error', ({ message }) => {
                console.error('Spotify Player initialization error:', message);
            });

            player.addListener('authentication_error', ({ message }) => {
                console.error('Spotify Player authentication error:', message);
            });

            player.addListener('account_error', ({ message }) => {
                console.error('Spotify Player account error:', message);
            });
        };

        return () => {
            if (window.spotifyPlayer) {
                window.spotifyPlayer.disconnect();
            }
        };
    }, [token]);

    return (
        <div style={{ position: 'fixed', bottom: 0, width: '100%', background: '#181818', color: 'white', padding: '10px' }}>
            <p>
                Reproductor de Spotify (Web Playback SDK){' '}
                {ready ? `conectado a ${deviceId}` : 'cargando...'}
            </p>
        </div>
    );
}

export default Player;
