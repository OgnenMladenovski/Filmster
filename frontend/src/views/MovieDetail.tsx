import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import movieApi from "../api/movieApi";
import favoriteApi from "../api/favoriteApi";
import watchlistApi from "../api/watchlistApi";
import ratingApi from "../api/ratingApi";
import { getErrorMessage } from "../api/getErrorMessage";
import { RateModal } from "./RateModal";
import type { MovieDetails } from "../types";

interface Props {
    token: string | null;
    tmdbId: number;
    onBack: () => void;
    onRequireAuth: () => void;
    onOpenMovie: (tmdbId: number) => void;
}

const panelStyle: CSSProperties = {
    border: "1px solid var(--border)",
    background: "var(--bg-elevated)",
};

const overlineStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color: "var(--text-faint)",
};

export function MovieDetail({ token, tmdbId, onBack, onRequireAuth }: Props) {
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [rating, setRating] = useState(false);

    const [myScore, setMyScore] = useState<number | null>(null);
    const [myReview, setMyReview] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [inWatchlist, setInWatchlist] = useState(false);

    useEffect(() => {
        setMovie(null);
        setError(null);
        movieApi
            .getById(tmdbId)
            .then((res) => setMovie(res.data))
            .catch((err) => setError(getErrorMessage(err)));
    }, [tmdbId]);

    useEffect(() => {
        if (!token) {
            setMyScore(null);
            setIsFavorite(false);
            setInWatchlist(false);
            return;
        }
        ratingApi
            .getMy()
            .then((ratings) => {
                const mine = ratings.data.find((r) => r.movie.tmdbId === tmdbId);
                setMyScore(mine ? mine.score : null);
                setMyReview(mine?.review ?? null);
            })
            .catch(() => {});
        favoriteApi
            .getMy()
            .then((favs) => setIsFavorite(favs.data.some((f) => f.movie.tmdbId === tmdbId)))
            .catch(() => {});
        watchlistApi
            .getMy()
            .then((items) => setInWatchlist(items.data.some((w) => w.movie.tmdbId === tmdbId)))
            .catch(() => {});
    }, [token, tmdbId]);

    async function handleAddFavorite() {
        if (!token) return onRequireAuth();
        setError(null);
        try {
            await favoriteApi.add(tmdbId);
            setIsFavorite(true);
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    async function handleRemoveFavorite() {
        if (!token) return onRequireAuth();
        setError(null);
        try {
            await favoriteApi.remove(tmdbId);
            setIsFavorite(false);
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    async function handleToggleWatchlist() {
        if (!token) return onRequireAuth();
        setError(null);
        try {
            if (inWatchlist) {
                await watchlistApi.remove(tmdbId);
                setInWatchlist(false);
            } else {
                await watchlistApi.add(tmdbId);
                setInWatchlist(true);
            }
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    function handleRate() {
        if (!token) return onRequireAuth();
        setRating(true);
    }

    return (
        <div>
            <button onClick={onBack} style={{ marginBottom: 35, background: "var(--accent)", color: "black", fontWeight: "bold" }}>
                ← Back
            </button>

            {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
            {!movie && !error && <p style={{ color: "var(--text-muted)" }}>Loading...</p>}

            {movie && (
                <>
                    <div style={{ position: "relative" }}>
                        {movie.backdropPath && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: -16,
                                    left: -16,
                                    right: -16,
                                    height: 340,
                                    backgroundImage: `linear-gradient(to bottom, rgba(14,16,19,0.30) 0%, rgba(14,16,19,0.70) 55%, var(--bg) 100%), url(https://image.tmdb.org/t/p/w1280${movie.backdropPath})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center 20%",
                                    zIndex: 0,
                                }}
                            />
                        )}

                        <div
                            style={{
                                position: "relative",
                                zIndex: 1,
                                display: "flex",
                                gap: 28,
                                flexWrap: "wrap",
                                paddingTop: movie.backdropPath ? 170 : 0,
                            }}
                        >
                            <div style={{ flexShrink: 0, width: 220 }}>
                                {movie.posterPath ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                                        alt={movie.title}
                                        style={{ width: "100%", borderRadius: 12, boxShadow: "0 16px 40px rgba(0,0,0,0.65)" }}
                                    />
                                ) : (
                                    <div style={{ width: "100%", aspectRatio: "2/3", background: "var(--bg-elevated)", borderRadius: 12 }} />
                                )}

                                {token && (
                                    <div style={{ ...panelStyle, marginTop: 14, borderRadius: 14, padding: 16 }}>
                                        <div style={{ ...overlineStyle, color: "var(--accent)", marginBottom: 12 }}>Your interaction:</div>

                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Rating</span>
                                            {myScore != null ? (
                                                <span style={{ color: "var(--star)", fontSize: 14, fontWeight: 600 }}>
                          ★ {myScore.toFixed(1)}
                        </span>
                                            ) : (
                                                <span style={{ color: "var(--text-faint)", fontSize: 13 }}>Not rated</span>
                                            )}
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Favorite</span>
                                            <span style={{ fontSize: 13, color: isFavorite ? "var(--accent)" : "var(--text-faint)" }}>
                        {isFavorite ? "Yes" : "No"}
                      </span>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>Watchlist</span>
                                            <span style={{ fontSize: 13, color: inWatchlist ? "var(--accent)" : "var(--text-faint)" }}>
                        {inWatchlist ? "Yes" : "No"}
                      </span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ flex: 1, minWidth: 280 }}>
                                <h1 style={{ color: "var(--accent)", fontSize: "clamp(26px, 4vw, 36px)", letterSpacing: "-0.02em" }}>{movie.title}</h1>

                                <div
                                    style={{
                                        display: "flex",
                                        gap: 12,
                                        alignItems: "center",
                                        color: "var(--text-muted)",
                                        marginTop: 10,
                                        fontSize: 14,
                                        flexWrap: "wrap",
                                    }}
                                >
                                    {movie.releaseDate && <span>{movie.releaseDate.slice(0, 4)}</span>}
                                    {movie.runtime && <span>· {movie.runtime} min</span>}
                                    {movie.tmdbRating != null && (
                                        <span
                                            style={{
                                                display: "inline-flex",
                                                alignItems: "center",
                                                gap: 4,
                                                background: "var(--accent-soft)",
                                                color: "var(--accent)",
                                                border: "1px solid var(--accent)",
                                                borderRadius: 999,
                                                padding: "2px 10px",
                                                fontSize: 13,
                                                fontWeight: 700,
                                            }}
                                        >
                      ★ {(movie.tmdbRating / 2).toFixed(1)}
                    </span>
                                    )}
                                    {movie.tmdbVoteCount != null && (
                                        <span style={{ color: "var(--text-faint)" }}>{movie.tmdbVoteCount.toLocaleString()} votes</span>
                                    )}
                                </div>

                                {movie.genres.length > 0 && (
                                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 16 }}>
                                        {movie.genres.map((g) => (
                                            <span
                                                key={g.id}
                                                style={{
                                                    border: "2px solid var(--border)",
                                                    padding: "4px 12px",
                                                    fontSize: 16,
                                                    background: "var(--accent)",
                                                    color: "black",
                                                    fontWeight: "bold"
                                                }}
                                            >
                        {g.name}
                      </span>
                                        ))}
                                    </div>
                                )}

                                <div style={{ ...overlineStyle, marginTop: 24, marginBottom: 8 }}>Synopsis</div>
                                <p style={{ margin: 0, lineHeight: 1.65, color: "var(--text)", maxWidth: 640 }}>
                                    {movie.overview || "No synopsis available for this film."}
                                </p>

                                <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
                                    {isFavorite ? (
                                        <button className="primary" onClick={handleRemoveFavorite}>✓ In Favorites (Remove)</button>
                                    ) : (
                                        <button onClick={handleAddFavorite}>
                                            + Add to Favorites
                                        </button>
                                    )}
                                    {inWatchlist ? (
                                        <button className="primary" onClick={handleToggleWatchlist}>✓ On Watchlist (Remove)</button>
                                    ) : (
                                        <button onClick={handleToggleWatchlist}>
                                            + Add to Watchlist
                                        </button>
                                    )}
                                    {myScore != null ? (
                                        <button className="primary" onClick={handleRate}>★ Change Rating</button>
                                    ) : (
                                        <button onClick={handleRate}>★ Rate</button>
                                    )}
                                </div>

                                {myReview && (
                                    <div
                                        style={{
                                            marginTop: 22,
                                            borderLeft: "3px solid var(--accent)",
                                            paddingLeft: 14,
                                            color: "var(--text-muted)",
                                            fontSize: 14,
                                            lineHeight: 1.6,
                                            maxWidth: 640,
                                        }}
                                    >
                                        <div style={{ ...overlineStyle, color: "var(--accent)", marginBottom: 6 }}>Your review</div>
                                        {myReview}
                                    </div>
                                )}

                                {!token && (
                                    <p style={{ color: "var(--text-faint)", fontSize: 13, marginTop: 16 }}>
                                        Log in to rate, favorite, or add this to your watchlist.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {movie && rating && token && (
                <RateModal
                    token={token}
                    movie={movie}
                    onClose={() => setRating(false)}
                    onRated={(score, review) => {
                        setMyScore(score);
                        setMyReview(review || null);
                    }}
                    initialScore={myScore ?? undefined}
                    initialReview={myReview ?? undefined}
                    onRemoved={() => {
                        setMyScore(null);
                        setMyReview(null);
                    }}
                />
            )}
        </div>
    );
}