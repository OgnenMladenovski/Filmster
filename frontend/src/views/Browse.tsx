import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import movieApi from "../api/movieApi";
import genreApi from "../api/genreApi";
import favoriteApi from "../api/favoriteApi";
import watchlistApi from "../api/watchlistApi";
import { getErrorMessage } from "../api/getErrorMessage";
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
    onSearched?: (q: string) => void;
}

const DEFAULT_GENRE_TMDB_ID = 28;

const overlineStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color: "var(--text-faint)",
};

export function Browse({ token, onOpenMovie, initialQuery, onRequireAuth, onSearched }: Props) {
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
        genreApi.getAll().then((res) => setGenres(res.data)).catch(() => {});
    }, [token]);

    async function runSearch(q: string) {
        setError(null);
        setLoading(true);
        setActiveGenre(null);
        setSearchTerm(q);
        onSearched?.(q);
        try {
            const data = (await movieApi.search(q)).data;
            const ranked = [...data].sort((a, b) => (b.tmdbRating ?? 0) - (a.tmdbRating ?? 0));
            setResults(ranked);
        } catch (err) {
            setError(getErrorMessage(err));
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
        onSearched?.("");
        try {
            const data = (await movieApi.getByGenre(genreTmdbId)).data;
            const ranked = [...data]
                .sort((a, b) => (b.tmdbRating ?? 0) - (a.tmdbRating ?? 0))
                .slice(0, 18);
            setResults(ranked);
        } catch (err) {
            setError(getErrorMessage(err));
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
    }, []);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (query.trim()) runSearch(query.trim());
    }

    async function handleAddFavorite(movie: Movie) {
        if (!token) return onRequireAuth();
        setError(null);
        setNotice(null);
        try {
            await favoriteApi.add(movie.tmdbId);
            setNotice(`Added "${movie.title}" to favorites.`);
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    async function handleAddWatchlist(movie: Movie) {
        if (!token) return onRequireAuth();
        setError(null);
        setNotice(null);
        try {
            await watchlistApi.add(movie.tmdbId);
            setNotice(`Added "${movie.title}" to watchlist.`);
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    function handleRate(movie: Movie) {
        if (!token) return onRequireAuth();
        setRating(movie);
    }

    const heading = searchTerm ? `Results for "${searchTerm}"` : genres.find((g) => g.tmdbId === activeGenre)?.name ?? "Films";

    return (
        <div>
            <div style={{ ...overlineStyle, color: "var(--accent)", marginBottom: 6, fontSize: 24 }}>Films</div>
            <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 20px" }}>
                Search the full TMDB catalogue, or browse by genre.
            </p>

            <form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 22 }}>
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
                    justifyContent: "center",
                    marginBottom: 24,
                    paddingBottom: 18,
                    borderBottom: "1px solid var(--border)",
                }}
            >
                {genres.map((g) => {
                    const isActive = activeGenre === g.tmdbId;
                    return (
                        <button
                            key={g.id}
                            onClick={() => loadGenre(g.tmdbId)}
                            style={{
                                border: "2px solid var(--border)",
                                borderRadius: 0,
                                padding: "5px 14px",
                                fontSize: 14,
                                fontWeight: "bold",
                                cursor: "pointer",
                                background: isActive ? "var(--accent)" : "transparent",
                                color: isActive ? "black" : "var(--text-muted)",
                            }}
                        >
                            {g.name}
                        </button>
                    );
                })}
            </div>

            <h3 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "var(--accent)" }}>{heading}</h3>

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
                            : "Nothing in this category right now, try another genre."
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