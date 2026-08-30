import { useEffect, useState } from "react";
import movieApi from "../api/movieApi";
import genreApi from "../api/genreApi";
import favoriteApi from "../api/favoriteApi";
import watchlistApi from "../api/watchlistApi";
import recommendationApi from "../api/recommendationApi";
import { getErrorMessage } from "../api/getErrorMessage";
import type { Movie, Genre } from "../types";
import { Hero } from "../components/Hero";
import { MovieRow } from "../components/MovieRow";
import { PosterSkeleton } from "../components/PosterSkeleton";
import { PosterTile } from "../components/PosterTile";
import { Carousel } from "../components/Carousel";
import { RateModal } from "./RateModal";

interface Props {
    token: string | null;
    onOpenMovie: (tmdbId: number) => void;
    onSearch: (query: string) => void;
    onGoToFavorites: () => void;
    onRequireAuth: () => void;
}

const RECOMMENDED_KEY = -1;

export function Landing({ token, onOpenMovie, onSearch, onGoToFavorites, onRequireAuth }: Props) {
    const [genres, setGenres] = useState<Genre[]>([]);
    const [active, setActive] = useState<number>(RECOMMENDED_KEY);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [watchlist, setWatchlist] = useState<Movie[]>([]);
    const [watchlistLoading, setWatchlistLoading] = useState(false);

    const [favoritesCount, setFavoritesCount] = useState<number | null>(null);

    const [notice, setNotice] = useState<string | null>(null);
    const [rating, setRating] = useState<Movie | null>(null);

    useEffect(() => {
        genreApi.getAll().then((res) => setGenres(res.data)).catch(() => {});

        if (!token) {
            setFavoritesCount(null);
            setWatchlist([]);
            return;
        }

        favoriteApi.getMy().then((d) => setFavoritesCount(d.data.length)).catch(() => setFavoritesCount(0));

        setWatchlistLoading(true);
        watchlistApi
            .getMy()
            .then((d) => setWatchlist(d.data.map((w) => w.movie)))
            .catch(() => setWatchlist([]))
            .finally(() => setWatchlistLoading(false));
    }, [token]);

    const needsLogin = active === RECOMMENDED_KEY && !token;
    const needsMoreFavorites =
        active === RECOMMENDED_KEY && !!token && favoritesCount !== null && favoritesCount !== 5;
    const isLocked = needsLogin || needsMoreFavorites;

    useEffect(() => {
        if (isLocked) {
            setMovies([]);
            return;
        }
        let cancelled = false;
        setLoading(true);
        setError(null);

        const load = async () => {
            try {
                const data =
                    active === RECOMMENDED_KEY
                        ? (await recommendationApi.getMy()).data.map((r) => r.movie)
                        : (await movieApi.getByGenre(active)).data;
                if (!cancelled) setMovies(data);
            } catch (err) {
                if (!cancelled) setError(getErrorMessage(err));
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [active, token, isLocked]);

    async function handleAddFavorite(movie: Movie) {
        if (!token) return onRequireAuth();
        setError(null);
        setNotice(null);
        try {
            await favoriteApi.add(movie.tmdbId);
            setNotice(`Added "${movie.title}" to favorites.`);
            setFavoritesCount((c) => (c ?? 0) + 1);
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
            setWatchlist((prev) => (prev.some((m) => m.tmdbId === movie.tmdbId) ? prev : [...prev, movie]));
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    function handleRate(movie: Movie) {
        if (!token) return onRequireAuth();
        setRating(movie);
    }

    const categories = [
        { key: RECOMMENDED_KEY, label: "Recommended for You" },
        ...genres.map((g) => ({ key: g.tmdbId, label: g.name })),
    ];

    return (
        <div>
            <Hero token={token} onOpenMovie={onOpenMovie} onSearch={onSearch} />

            {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
            {notice && <p style={{ color: "var(--accent)" }}>{notice}</p>}

            <section style={{ marginBottom: 44 }}>
                <div
                    style={{
                        display: "flex",
                        gap: "clamp(10px, 3vw, 22px)",
                        marginBottom: 20,
                        borderBottom: "1px solid var(--border)",
                        overflowX: "auto",
                        whiteSpace: "nowrap",
                    }}
                >
                    {categories.map((c) => (
                        <button
                            key={c.key}
                            onClick={() => setActive(c.key)}
                            className={`tab-button ${active === c.key ? "active" : ""}`}
                            style={{
                                flexShrink: 0,
                                color: active === c.key ? "var(--accent)" : undefined,
                                fontWeight: active === c.key ? 700 : undefined,
                            }}
                        >
                            {c.key === RECOMMENDED_KEY && (needsLogin || needsMoreFavorites) ? "🔒 " : ""}
                            {c.label}
                        </button>
                    ))}
                </div>

                {isLocked ? (
                    <div
                        style={{
                            border: "1px dashed var(--border)",
                            borderRadius: 8,
                            padding: 32,
                            textAlign: "center",
                            color: "var(--text-muted)",
                        }}
                    >
                        <p style={{ fontSize: 32, marginBottom: 8 }}>🔒</p>
                        {needsLogin ? (
                            <>
                                <p style={{ marginBottom: 14 }}>Log in to get personalized recommendations.</p>
                                <button className="primary" onClick={onRequireAuth}>
                                    Log in
                                </button>
                            </>
                        ) : (
                            <>
                                <p style={{ marginBottom: 14 }}>
                                    Add exactly 5 favorite movies to unlock personalized recommendations.
                                    <br />
                                    You currently have {favoritesCount ?? 0} / 5.
                                </p>
                                <button className="primary" onClick={onGoToFavorites}>
                                    Go to Favorites
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        {loading && <PosterSkeleton count={7} />}
                        {!loading && movies.length === 0 && (
                            <p style={{ color: "var(--text-muted)" }}>No movies found in this category.</p>
                        )}
                        {!loading && movies.length > 0 && (
                            <Carousel>
                                {movies.map((movie) => (
                                    <div key={movie.tmdbId} style={{ flexShrink: 0, width: 140 }}>
                                        <PosterTile
                                            movie={movie}
                                            onOpen={() => onOpenMovie(movie.tmdbId)}
                                            onRate={() => handleRate(movie)}
                                            onAddFavorite={() => handleAddFavorite(movie)}
                                            onAddWatchlist={() => handleAddWatchlist(movie)}
                                        />
                                    </div>
                                ))}
                            </Carousel>
                        )}
                    </>
                )}
            </section>

            {token && (
                <MovieRow
                    title="Up Next (Your Watchlist)"
                    movies={watchlist}
                    loading={watchlistLoading}
                    onOpenMovie={onOpenMovie}
                    onRate={handleRate}
                    onAddFavorite={handleAddFavorite}
                    onAddWatchlist={handleAddWatchlist}
                />
            )}

            {!token && (
                <section
                    style={{
                        padding: "clamp(28px, 6vw, 44px) clamp(16px, 6vw, 40px)",
                        margin: "56px 0 24px",
                        textAlign: "center",
                        background: "var(--bg-elevated)",
                        border: "1px solid var(--accent)",
                    }}
                >
                    <h2 style={{ fontSize: 24, marginBottom: 10 }}>Ready for picks made for you?</h2>
                    <p style={{ color: "var(--text-muted)", maxWidth: 420, margin: "0 auto 22px" }}>
                        Create a free account to rate films, build your watchlist, and unlock AI recommendations based on your taste.
                    </p>
                    <button className="primary" style={{ padding: "10px 24px" }} onClick={onRequireAuth}>
                        Create Free Account
                    </button>
                </section>
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