import type {
  Movie,
  MovieDetails,
  FavoriteMovie,
  WatchlistItem,
  Rating,
  Recommendation,
  UserProfile,
  Genre,
} from "./types";

const API_BASE = "http://localhost:8080/api";

class ApiError extends Error {}

async function request<T>(
  path: string,
  token: string | null,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new ApiError(body?.message ?? `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  register: (username: string, email: string, password: string) =>
    request<{ username: string; email: string; role: string }>("/user/register", null, {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    }),

  login: (username: string, password: string) =>
    request<{ token: string }>("/user/login", null, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  getMe: (token: string) => request<UserProfile>("/user/me", token),

  searchMovies: (token: string | null, query: string) =>
    request<Movie[]>(`/movies/search?query=${encodeURIComponent(query)}`, token),

  getGenres: (token: string | null) => request<Genre[]>("/genres", token),

  getMoviesByGenre: (token: string | null, genreTmdbId: number) =>
    request<Movie[]>(`/movies/genre/${genreTmdbId}`, token),

  getMovie: (token: string | null, tmdbId: number) =>
    request<MovieDetails>(`/movies/${tmdbId}`, token),

  getFavorites: (token: string) =>
    request<FavoriteMovie[]>("/favorites/my", token),

  addFavorite: (token: string, tmdbId: number) =>
    request<FavoriteMovie>(`/favorites/${tmdbId}`, token, { method: "POST" }),

  removeFavorite: (token: string, tmdbId: number) =>
    request<{ message: string }>(`/favorites/${tmdbId}`, token, { method: "DELETE" }),

  getWatchlist: (token: string) =>
    request<WatchlistItem[]>("/watchlist/my", token),

  addToWatchlist: (token: string, tmdbId: number) =>
    request<WatchlistItem>(`/watchlist/${tmdbId}`, token, { method: "POST" }),

  removeFromWatchlist: (token: string, tmdbId: number) =>
    request<{ message: string }>(`/watchlist/${tmdbId}`, token, { method: "DELETE" }),

  getRatings: (token: string) =>
    request<Rating[]>("/ratings/my", token),

  rate: (token: string, tmdbId: number, score: number, review: string) =>
    request<Rating>("/ratings", token, {
      method: "POST",
      body: JSON.stringify({ tmdbId, score, review }),
    }),

  deleteRating: (token: string, tmdbId: number) =>
    request<{ message: string }>(`/ratings/${tmdbId}`, token, { method: "DELETE" }),

  getRecommendations: (token: string) =>
    request<Recommendation[]>("/recommendations/my", token),

  generateRecommendations: (token: string) =>
    request<Recommendation[]>("/recommendations/generate", token, { method: "POST" }),
};

export { ApiError };
