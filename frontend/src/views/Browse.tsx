import { useEffect, useState } from "react";
import { api, ApiError } from "../api";
import type { Movie, Genre } from "../types";
import { PosterTile } from "../components/PosterTile";
import { PosterSkeleton } from "../components/PosterSkeleton";
import { EmptyState } from "../components/EmptyState";
import { RateModal } from "./RateModal";

interface Props {
  token: string | null;
  onOpenMovie: (tmdbId: number) => void;
  initialQuery?: string;
  onRequireAuth: () => void;
}

const DEFAULT_GENRE_TMDB_ID = 28; // Action

export function Browse({ token, onOpenMovie, initialQuery, onRequireAuth }: Props) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [results, setResults] = useState<Movie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState<Movie | null>(null);

  const [genres, setGenres] = useState<Genre[]>([]);
  const [activeGenre, setActiveGenre] = useState<number | null>(DEFAULT_GENRE_TMDB_ID);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  useEffect(() => {
    api.getGenres(token).then(setGenres).catch(() => {});
  }, [token]);

  async function runSearch(q: string) {
    setError(null);
    setLoading(true);
    setActiveGenre(null);
    setSearchTerm(q);
    try {
      setResults(await api.searchMovies(token, q));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function loadGenre(genreTmdbId: number) {
    setError(null);
    setLoading(true);
    setActiveGenre(genreTmdbId);
    setSearchTerm(null);
    setQuery("");
    try {
      setResults(await api.getMoviesByGenre(token, genreTmdbId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (initialQuery) {
      runSearch(initialQuery);
    } else {
      loadGenre(DEFAULT_GENRE_TMDB_ID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) runSearch(query.trim());
  }

  async function handleAddFavorite(movie: Movie) {
    if (!token) return onRequireAuth();
    setError(null);
    setNotice(null);
    try {
      await api.addFavorite(token, movie.tmdbId);
      setNotice(`Added "${movie.title}" to favorites.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  async function handleAddWatchlist(movie: Movie) {
    if (!token) return onRequireAuth();
    setError(null);
    setNotice(null);
    try {
      await api.addToWatchlist(token, movie.tmdbId);
      setNotice(`Added "${movie.title}" to watchlist.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  function handleRate(movie: Movie) {
    if (!token) return onRequireAuth();
    setRating(movie);
  }

  const heading = searchTerm ? `Results for "${searchTerm}"` : genres.find((g) => g.tmdbId === activeGenre)?.name ?? "Films";

  return (
    <div>
      <h2 style={{ fontSize: 24 }}>Films</h2>
      <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "6px 0 18px" }}>
        Search the full TMDB catalogue, or browse by genre.
      </p>

      <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        <input
          placeholder="Search for a movie..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, maxWidth: 420 }}
        />
        <button type="submit" className="primary">
          Search
        </button>
      </form>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          marginBottom: 24,
          paddingBottom: 18,
          borderBottom: "1px solid var(--border)",
        }}
      >
        {genres.map((g) => (
          <button
            key={g.id}
            onClick={() => loadGenre(g.tmdbId)}
            style={{
              borderRadius: 999,
              padding: "5px 14px",
              fontSize: 13,
              background: activeGenre === g.tmdbId ? "var(--accent)" : "transparent",
              color: activeGenre === g.tmdbId ? "var(--accent-contrast)" : "var(--text-muted)",
              borderColor: activeGenre === g.tmdbId ? "var(--accent)" : "var(--border)",
              fontWeight: activeGenre === g.tmdbId ? 700 : 500,
            }}
          >
            {g.name}
          </button>
        ))}
      </div>

      <h3 style={{ fontSize: 18, marginBottom: 14 }}>{heading}</h3>

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {notice && <p style={{ color: "var(--accent)" }}>{notice}</p>}

      {loading && <PosterSkeleton grid count={12} />}

      {!loading && !error && results.length === 0 && (
        <EmptyState
          icon="🔍"
          title="No films found"
          text={
            searchTerm
              ? `We couldn't find anything matching "${searchTerm}". Try a different spelling or pick a genre above.`
              : "Nothing in this category right now — try another genre."
          }
        />
      )}

      {!loading && results.length > 0 && (
        <div className="poster-grid">
          {results.map((movie) => (
            <PosterTile
              key={movie.tmdbId}
              movie={movie}
              onOpen={() => onOpenMovie(movie.tmdbId)}
              onRate={() => handleRate(movie)}
              onAddFavorite={() => handleAddFavorite(movie)}
              onAddWatchlist={() => handleAddWatchlist(movie)}
            />
          ))}
        </div>
      )}

      {rating && token && (
        <RateModal
          token={token}
          movie={rating}
          onClose={() => setRating(null)}
          onRated={() => setNotice(`Rated "${rating.title}".`)}
        />
      )}
    </div>
  );
}
