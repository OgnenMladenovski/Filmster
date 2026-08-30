import type {Movie} from "../types";

interface Props {
    movie: Movie;
    onOpen: () => void;
    badge?: string;
    onRemove?: () => void;
    onRate?: () => void;
    onAddFavorite?: () => void;
    onAddWatchlist?: () => void;
}

export function PosterTile({movie, onOpen, badge, onRemove, onRate, onAddFavorite, onAddWatchlist}: Props) {
    const hasQuickActions = onRate || onAddFavorite || onAddWatchlist;

    return (
        <div style={{display: "flex", flexDirection: "column", gap: 6}}>
            <div
                onClick={onOpen}
                style={{
                    position: "relative",
                    aspectRatio: "2 / 3",
                    borderRadius: 6,
                    overflow: "hidden",
                    cursor: "pointer",
                    background: "var(--bg-elevated)",
                    border: "1px solid var(--border)",
                }}
                className="poster-tile"
            >
                {movie.posterPath ? (
                    <img
                        src={`https://image.tmdb.org/t/p/w342${movie.posterPath}`}
                        alt={movie.title}
                        style={{width: "100%", height: "100%", objectFit: "cover", display: "block"}}
                    />
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text-faint)",
                            fontSize: 13,
                            padding: 8,
                            textAlign: "center",
                        }}
                    >
                        {movie.title}
                    </div>
                )}

                {badge && (
                    <div
                        style={{
                            position: "absolute",
                            top: 6,
                            left: 6,
                            background: "rgba(0,0,0,0.75)",
                            color: "var(--accent)",
                            fontWeight: 700,
                            fontSize: 12,
                            padding: "2px 7px",
                            borderRadius: 4,
                        }}
                    >
                        {badge}
                    </div>
                )}

                {movie.tmdbRating != null && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 6,
                            right: 6,
                            background: "rgba(0,0,0,0.75)",
                            color: "var(--star)",
                            fontWeight: 600,
                            fontSize: 12,
                            padding: "2px 6px",
                            borderRadius: 4,
                        }}
                    >
                        ★ {(movie.tmdbRating/2).toFixed(1)}
                    </div>
                )}

                {onRemove && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove();
                        }}
                        style={{
                            position: "absolute",
                            top: 6,
                            right: 6,
                            background: "rgba(0,0,0,0.75)",
                            border: "none",
                            color: "var(--danger)",
                            fontSize: 13,
                            padding: "2px 8px",
                            lineHeight: "18px",
                        }}
                        title="Remove"
                    >
                        ✕
                    </button>
                )}

                {hasQuickActions && (
                    <div
                        className="poster-quick-actions"
                        style={{
                            position: "absolute",
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: "flex",
                            justifyContent: "center",
                            gap: 6,
                            padding: "8px 6px",
                            background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)",
                            opacity: 0,
                            transition: "opacity 0.15s ease",
                        }}
                    >
                        {onRate && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRate();
                                }}
                                title="Rate"
                                style={{padding: "4px 8px", fontSize: 13, background: "rgba(20,24,28,0.9)"}}
                            >
                                ★
                            </button>
                        )}
                        {onAddFavorite && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddFavorite();
                                }}
                                title="Add to Favorites"
                                style={{padding: "4px 8px", fontSize: 13, background: "rgba(20,24,28,0.9)"}}
                            >
                                ♥
                            </button>
                        )}
                        {onAddWatchlist && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onAddWatchlist();
                                }}
                                title="Add to Watchlist"
                                style={{padding: "4px 8px", fontSize: 13, background: "rgba(20,24,28,0.9)"}}
                            >
                                +
                            </button>
                        )}
                    </div>
                )}
            </div>
            <div style={{fontSize: 13, fontWeight: 600, lineHeight: 1.25}}>{movie.title}</div>
            <div style={{fontSize: 12, color: "var(--text-faint)"}}>
                {movie.releaseDate ? movie.releaseDate.slice(0, 4) : ""}
            </div>
        </div>
    );
}
