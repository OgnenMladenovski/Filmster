import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import watchlistApi from "../api/watchlistApi";
import { getErrorMessage } from "../api/getErrorMessage";
import type { WatchlistItem } from "../types";
import { EmptyState } from "../components/EmptyState";

interface Props {
    token: string;
    onOpenMovie: (tmdbId: number) => void;
    onGoToBrowse: () => void;
}

const panelStyle: CSSProperties = {
    border: "1.5px solid var(--border)",
    background: "var(--bg-elevated)",
};

const overlineStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color: "var(--text-faint)",
};

export function Watchlist({ onOpenMovie, onGoToBrowse }: Props) {
    const [items, setItems] = useState<WatchlistItem[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);

    async function load() {
        setError(null);
        try {
            setItems((await watchlistApi.getMy()).data);
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoaded(true);
        }
    }

    useEffect(() => {
        load();
    }, []);

    async function handleRemove(tmdbId: number) {
        setError(null);
        try {
            await watchlistApi.remove(tmdbId);
            await load();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    return (
        <div>
            <div style={{ ...overlineStyle, color: "var(--accent)", marginBottom: 6 }}>Watchlist</div>
            <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "0 0 24px" }}>
                {items.length === 0
                    ? "Films you want to get to."
                    : `${items.length} film${items.length === 1 ? "" : "s"} waiting to be watched.`}
            </p>

            {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

            {loaded && items.length === 0 ? (
                <EmptyState
                    icon="🍿"
                    title="Your watchlist is empty"
                    text="Save films you want to watch later by opening a film and clicking + Watchlist."
                    actionLabel="Find films to add"
                    onAction={onGoToBrowse}
                />
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {items.map((item) => {
                        const movie = item.movie;
                        return (
                            <div
                                key={item.id}
                                onClick={() => onOpenMovie(movie.tmdbId)}
                                style={{
                                    ...panelStyle,
                                    display: "flex",
                                    alignItems: "stretch",
                                    gap: 16,
                                    padding: 12,
                                    cursor: "pointer",
                                    borderRadius: 14,
                                }}
                            >
                                {movie.posterPath ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`}
                                        alt={movie.title}
                                        style={{ width: 60, height: 90, objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                                    />
                                ) : (
                                    <div
                                        style={{
                                            width: 60,
                                            height: 90,
                                            borderRadius: 8,
                                            flexShrink: 0,
                                            background: "var(--bg-hover)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 11,
                                            color: "var(--text-faint)",
                                            textAlign: "center",
                                            padding: 4,
                                        }}
                                    >
                                        {movie.title}
                                    </div>
                                )}

                                <div
                                    style={{
                                        minWidth: 0,
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        gap: 5,
                                    }}
                                >
                                    <div style={{ display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap" }}>
                                        <strong style={{ fontSize: 15.5, fontWeight: 600 }}>{movie.title}</strong>
                                        {movie.releaseDate && (
                                            <span style={{ color: "var(--text-faint)", fontSize: 13 }}>
                        {movie.releaseDate.slice(0, 4)}
                      </span>
                                        )}
                                    </div>
                                    <span style={{ color: "var(--text-faint)", fontSize: 13, fontStyle: "italic" }}>
                    Saved to watch later
                  </span>
                                </div>

                                {movie.tmdbRating != null && (
                                    <div
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-end",
                                            justifyContent: "center",
                                            gap: 2,
                                            flexShrink: 0,
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: 18,
                                                fontWeight: 700,
                                                color: "var(--star)",
                                                lineHeight: 1,
                                                fontVariantNumeric: "tabular-nums",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            ★ {(movie.tmdbRating / 2).toFixed(1)}
                                        </div>
                                        <div style={{ color: "var(--text-faint)", fontSize: 11 }}>TMDB</div>
                                    </div>
                                )}

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(movie.tmdbId);
                                    }}
                                    title="Remove from watchlist"
                                    style={{
                                        alignSelf: "center",
                                        flexShrink: 0,
                                        width: 30,
                                        height: 30,
                                        padding: 0,
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 13,
                                        color: "var(--danger)",
                                        background: "rgba(239, 83, 80, 0.22)",
                                        border: "1px solid var(--danger)",
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}