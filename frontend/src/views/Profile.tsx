import {useEffect, useState} from "react";
import type {CSSProperties} from "react";
import userApi from "../api/userApi";
import ratingApi from "../api/ratingApi";
import favoriteApi from "../api/favoriteApi";
import watchlistApi from "../api/watchlistApi";
import {getErrorMessage} from "../api/getErrorMessage";
import type {UserProfile, Rating, FavoriteMovie, WatchlistItem} from "../types";
import {PosterTile} from "../components/PosterTile";
import {EmptyState} from "../components/EmptyState";

interface Props {
    token: string;
    onOpenMovie: (tmdbId: number) => void;
    onGoToBrowse: () => void;
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

function avatarIndex(name: string, count: number) {
    let h = 0;
    for (let i = 0; i < name.length; i++) {
        h = (h * 31 + name.charCodeAt(i)) >>> 0;
    }
    return h % count;
}

export function Profile({token, onOpenMovie, onGoToBrowse}: Props) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([userApi.getMe(), ratingApi.getMy(), favoriteApi.getMy(), watchlistApi.getMy()])
            .then(([profileData, ratingsData, favoritesData, watchlistData]) => {
                setProfile(profileData.data);
                setRatings(ratingsData.data);
                setFavorites(favoritesData.data);
                setWatchlist(watchlistData.data);
            })
            .catch((err) => setError(getErrorMessage(err)));
    }, [token]);

    async function handleRemoveRating(tmdbId: number) {
        setError(null);
        try {
            await ratingApi.delete(tmdbId);
            setRatings((prev) => prev.filter((r) => r.movie.tmdbId !== tmdbId));
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    if (error) return <p style={{color: "var(--danger)"}}>{error}</p>;
    if (!profile) return <p style={{color: "var(--text-muted)"}}>Loading...</p>;

    const avatar = `/avatar${avatarIndex(profile.username, 5) + 1}.svg`;

    const averageScore =
        ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length : null;

    const steps = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
    const dist = steps.map((score) => ({
        star: score,
        count: ratings.filter((r) => r.score === score).length,
    }));
    const maxCount = Math.max(1, ...dist.map((d) => d.count));

    const sortedRatings = [...ratings].sort((a, b) => b.score - a.score);

    const stats = [
        {label: "Favorites", value: `${favorites.length}/5`},
        {label: "Watchlist", value: watchlist.length},
        {label: "Ratings", value: ratings.length},
        {label: "Avg score", value: averageScore != null ? averageScore.toFixed(1) : "—", accent: true},
    ];

    return (
        <div>
            <div
                style={{
                    ...panelStyle,
                    marginBottom: 20,
                    padding: "24px clamp(18px, 4vw, 28px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 24,
                    flexWrap: "wrap",
                }}
            >
                <div style={{display: "flex", alignItems: "center", gap: 18, minWidth: 0}}>
                    <div
                        style={{
                            width: 72,
                            height: 72,
                            //borderRadius: "50%",
                            //background: "var(--accent-contrast)",
                            //border: "1px solid var(--accent)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                        }}
                    >
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                background: "var(--accent)",
                                WebkitMask: `url(${avatar}) center / contain no-repeat`,
                                mask: `url(${avatar}) center / contain no-repeat`,
                            }}
                        />
                    </div>
                    <div style={{minWidth: 0}}>
                        <h1 style={{fontSize: 27, letterSpacing: "-0.02em"}}>{profile.username}</h1>
                    </div>
                </div>

                <div style={{display: "flex", flexDirection: "column", gap: 10, flexShrink: 0}}>
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            style={{
                                display: "flex",
                                alignItems: "baseline",
                                justifyContent: "space-between",
                                gap: 16,
                                minWidth: 160,
                            }}
                        >
                            <span style={{fontSize: 14, color: "var(--accent)"}}>{s.label}</span>
                            <span
                                style={{
                                    fontSize: 18,
                                    fontWeight: 700,
                                    color: "var(--text)",
                                    fontVariantNumeric: "tabular-nums",
                                }}
                            >
                {s.value}
              </span>
                        </div>
                    ))}
                </div>
            </div>

            {ratings.length > 0 && (
                <section style={{marginBottom: 20}}>
                    <div style={{...panelStyle, padding: 22}}>
                        <div style={{...overlineStyle, marginBottom: 20, color: "var(--accent)"}}>Rating distribution
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-end",
                                gap: 10,
                                height: 150,
                                borderBottom: "1px solid var(--border)",
                            }}
                        >
                            {dist.map((d) => (
                                <div
                                    key={d.star}
                                    style={{
                                        flex: 1,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "flex-end",
                                        height: "100%",
                                    }}
                                >
                  <span
                      style={{
                          fontSize: 12,
                          marginBottom: 6,
                          fontVariantNumeric: "tabular-nums",
                          color: "var(--accent)"
                      }}
                  >
                    {d.count}
                  </span>
                                    <div
                                        style={{
                                            width: "45%",
                                            height: `${(d.count / maxCount) * 100}%`,
                                            minHeight: d.count > 0 ? 6 : 2,
                                            background: d.count > 0 ? "var(--accent)" : "var(--bg-hover)",
                                            borderRadius: "5px 5px 0 0",
                                            transition: "height 0.35s ease",
                                            color: "var(--accent)"
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div style={{display: "flex", gap: 10, marginTop: 8}}>
                            {dist.map((d) => (
                                <span
                                    key={d.star}
                                    style={{flex: 1, textAlign: "center", fontSize: 12, color: "var(--star)"}}
                                >
                  {d.star}★
                </span>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {favorites.length > 0 && (
                <section style={{marginBottom: 20}}>
                    <div style={{...panelStyle, padding: 24}}>
                        <div style={{
                            ...overlineStyle,
                            marginBottom: 20,
                            textAlign: "center",
                            color: "var(--accent)",
                            fontWeight: "bold",
                            fontSize: 16
                        }}>Top 5 Favorites
                        </div>
                        <div style={{display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16}}>
                            {favorites.map((fav) => (
                                <div key={fav.id} style={{width: 140, color: "var(--accent)"}}>
                                    <PosterTile movie={fav.movie} onOpen={() => onOpenMovie(fav.movie.tmdbId)}/>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section>
                <div style={{...overlineStyle, marginBottom: 16, color: "var(--accent)"}}>My ratings</div>
                {ratings.length === 0 ? (
                    <EmptyState
                        icon="★"
                        title="You have no ratings yet"
                        text="When you rate films they'll show up here, so get to work!"
                        actionLabel="Browse films"
                        onAction={onGoToBrowse}
                    />
                ) : (
                    <div style={{display: "flex", flexDirection: "column", gap: 12}}>
                        {sortedRatings.map((rating) => (
                            <div
                                key={rating.id}
                                onClick={() => onOpenMovie(rating.movie.tmdbId)}
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
                                {rating.movie.posterPath ? (
                                    <img
                                        src={`https://image.tmdb.org/t/p/w92${rating.movie.posterPath}`}
                                        alt={rating.movie.title}
                                        style={{
                                            width: 60,
                                            height: 90,
                                            objectFit: "cover",
                                            borderRadius: 8,
                                            flexShrink: 0
                                        }}
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
                                        {rating.movie.title}
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
                                    <div style={{display: "flex", gap: 8, alignItems: "baseline", flexWrap: "wrap"}}>
                                        <strong style={{fontSize: 15.5, fontWeight: 600}}>{rating.movie.title}</strong>
                                        {rating.movie.releaseDate && (
                                            <span style={{color: "var(--text-faint)", fontSize: 13}}>
                        {rating.movie.releaseDate.slice(0, 4)}
                      </span>
                                        )}
                                    </div>
                                    {rating.review ? (
                                        <p
                                            style={{
                                                color: "var(--text-muted)",
                                                fontSize: 13,
                                                lineHeight: 1.5,
                                                margin: 0,
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                            }}
                                        >
                                            {rating.review}
                                        </p>
                                    ) : (
                                        <p style={{
                                            color: "var(--text-faint)",
                                            fontSize: 13,
                                            margin: 0,
                                            fontStyle: "italic"
                                        }}>
                                            No written review
                                        </p>
                                    )}
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "flex-end",
                                        justifyContent: "center",
                                        gap: 4,
                                        flexShrink: 0,
                                    }}
                                >
                                    <div
                                        style={{
                                            fontSize: 20,
                                            fontWeight: 700,
                                            color: "var(--accent)",
                                            lineHeight: 1,
                                            fontVariantNumeric: "tabular-nums",
                                        }}
                                    >
                                        {rating.score.toFixed(1)}
                                        <span style={{
                                            fontSize: 12,
                                            color: "var(--text-faint)",
                                            fontWeight: 500
                                        }}> /5</span>
                                    </div>
                                    <div style={{color: "var(--star)", fontSize: 13, letterSpacing: "1px"}}>
                                        {"★".repeat(Math.floor(rating.score))}
                                        {rating.score % 1 !== 0 ? "½" : ""}
                                    </div>
                                </div>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveRating(rating.movie.tmdbId);
                                    }}
                                    title="Remove rating"
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
                        ))}
                        <div style={{
                            color: "black",
                            fontWeight: "bold",
                            display: "flex",
                            justifyContent: "center",
                            marginTop: 20,
                            marginBottom: -40
                        }}>
                            <button style={{background: "var(--accent)"}} onClick={onGoToBrowse}> + Add a new rating
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}