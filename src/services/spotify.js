const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || "6f0b88fa09e34dd1a12d8585a1d14380";
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

const createCodeVerifier = () => {
  const array = new Uint8Array(128);
  window.crypto.getRandomValues(array);
  return Array.from(array, (value) => CHARSET[value % CHARSET.length]).join("");
};

const sha256 = async (plain) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hashBuffer);
};

const base64UrlEncode = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

const createCodeChallenge = async (verifier) => {
  const hashed = await sha256(verifier);
  return base64UrlEncode(hashed);
};

export const buildSpotifyAuthUrl = async () => {
  const verifier = createCodeVerifier();
  const challenge = await createCodeChallenge(verifier);
  const state = window.crypto.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).slice(2);

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
