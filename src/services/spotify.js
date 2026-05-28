const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || (typeof window !== "undefined" ? `${window.location.origin}/` : "http://localhost:5173/");
const SCOPES = [
    "user-read-private",
    "streaming",
    "user-read-playback-state",
];

const TOKEN_STORAGE_KEY = "spotify_token";
const REFRESH_TOKEN_STORAGE_KEY = "spotify_refresh_token";
const EXPIRES_STORAGE_KEY = "spotify_token_expires";
const VERIFIER_STORAGE_KEY = "spotify_code_verifier";
const STATE_STORAGE_KEY = "spotify_auth_state";

const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";

/* Definimos las funciones para los codigos y solicitudes de spotify */

// Generamos un codigo para verificar la solicitud
const createCodeVerifier = () => {
    const array = new Uint8Array(128);
    window.crypto.getRandomValues(array);
    return Array.from(array, (value) => CHARSET[value % CHARSET.length]).join("");
};

// Creamos el code challenge para enviar a spotify
const sha256 = async (plain) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
    return new Uint8Array(hashBuffer);
};

// Codificamos el hash en base64 para enviarlo a spotify
const base64UrlEncode = (buffer) => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};


// Creamos el code challenge a partir del code verifier
const createCodeChallenge = async (verifier) => {
    const hashed = await sha256(verifier);
    return base64UrlEncode(hashed);
};


// Construimos la URL de autenticación de Spotify con los parámetros necesarios
export const buildSpotifyAuthUrl = async () => {
    const verifier = createCodeVerifier();
    const challenge = await createCodeChallenge(verifier);
    const state = window.crypto.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).slice(2);

    // Guardamos en el localStorage estos valores
    window.localStorage.setItem(VERIFIER_STORAGE_KEY, verifier);
    window.localStorage.setItem(STATE_STORAGE_KEY, state);

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: "code",
        redirect_uri: REDIRECT_URI,
        code_challenge_method: "S256",
        code_challenge: challenge,
        scope: SCOPES.join(" "),
        state,
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
};

const getStoredAccessToken = () => {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    const expiresAt = Number(window.localStorage.getItem(EXPIRES_STORAGE_KEY));
    if (token && expiresAt && Date.now() < expiresAt - 60000) {
        return token;
    }
    return null;
};

// Función para hacer petición para refrescar el token
const refreshAccessToken = async (refreshToken) => {
    const body = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            },
        body: body.toString(),
    });

    if (!response.ok) {
        throw new Error("No se pudo refrescar el token de Spotify");
    }

    return await response.json();
};


// Función para cambiar el código de autorización por un token de acceso
const exchangeCodeForToken = async (code, verifier) => {
    const body = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        code_verifier: verifier,
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error_description || "Error en el intercambio de código de Spotify");
    }

    return await response.json();
};

const clearUrlParams = () => {
    window.history.replaceState({}, document.title, REDIRECT_URI);
};

// Función principal para obtener el token de acceso
export const getAccessToken = async () => {
    const storedToken = getStoredAccessToken();
    if (storedToken) {
        return storedToken;
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const returnedState = params.get("state");
    const error = params.get("error");

    if (error) {
        console.error("Spotify auth error:", error);
        clearUrlParams();
        return null;
    }

    const savedState = window.localStorage.getItem(STATE_STORAGE_KEY);
    const verifier = window.localStorage.getItem(VERIFIER_STORAGE_KEY);

    if (code && returnedState && verifier && savedState === returnedState) {
        try {
            const tokenData = await exchangeCodeForToken(code, verifier);
            const expiresIn = Number(tokenData.expires_in || 3600);
            const expiresAt = Date.now() + expiresIn * 1000;

            window.localStorage.setItem(TOKEN_STORAGE_KEY, tokenData.access_token);
            if (tokenData.refresh_token) {
                window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokenData.refresh_token);
            }
            window.localStorage.setItem(EXPIRES_STORAGE_KEY, String(expiresAt));
            window.localStorage.removeItem(VERIFIER_STORAGE_KEY);
            window.localStorage.removeItem(STATE_STORAGE_KEY);
            clearUrlParams();

            return tokenData.access_token;
        } catch (err) {
            console.error(err);
            clearUrlParams();
            return null;
        }
    }

    // Refrescamos el token si tenemos un refrest y lo guardamos en el localStorage
    const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
    if (refreshToken) {
        try {
            const tokenData = await refreshAccessToken(refreshToken);
            const expiresIn = Number(tokenData.expires_in || 3600);
            const expiresAt = Date.now() + expiresIn * 1000;
            window.localStorage.setItem(TOKEN_STORAGE_KEY, tokenData.access_token);
            window.localStorage.setItem(EXPIRES_STORAGE_KEY, String(expiresAt));
            if (tokenData.refresh_token) {
                window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokenData.refresh_token);
            }
            return tokenData.access_token;
        } catch (err) {
            console.error("Refresh token falló:", err);
            window.localStorage.removeItem(TOKEN_STORAGE_KEY);
            window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
            window.localStorage.removeItem(EXPIRES_STORAGE_KEY);
            return null;
        }
    }

    return null;
};
