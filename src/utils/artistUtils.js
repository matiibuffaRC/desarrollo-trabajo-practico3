export const DEFAULT_ARTIST_IMAGE =
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200";

export const getArtistImage = (artist) =>
  artist.images?.[1]?.url ||
  artist.images?.[0]?.url ||
  artist.image ||
  DEFAULT_ARTIST_IMAGE;

export const normalizeArtistForFavorite = (artist) => ({
  id: artist.id,
  name: artist.name || "Artista",
  genre: artist.genres?.slice(0, 2).join(" • ") || artist.genre || "Artista",
  image: getArtistImage(artist),
});
