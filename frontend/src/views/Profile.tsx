import { useEffect, useState } from "react";
import { api, ApiError } from "../api";
import type { UserProfile, Rating, FavoriteMovie, WatchlistItem } from "../types";
import { PosterTile } from "../components/PosterTile";
import { EmptyState } from "../components/EmptyState";

interface Props {
  token: string;
  onOpenMovie: (tmdbId: number) => void;
  onGoToBrowse: () => void;
}

export function Profile({ token, onOpenMovie, onGoToBrowse }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([api.getMe(token), api.getRatings(token), api.getFavorites(token), api.getWatchlist(token)])
      .then(([profileData, ratingsData, favoritesData, watchlistData]) => {
        setProfile(profileData);
        setRatings(ratingsData);
        setFavorites(favoritesData);
        setWatchlist(watchlistData);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Something went wrong"));
  }, [token]);

  if (error) return <p style={{ color: "var(--danger)" }}>{error}</p>;
  if (!profile) return <p style={{ color: "var(--text-muted)" }}>Loading...</p>;

  const initial = profile.username.charAt(0).toUpperCase();
  const averageScore =
    ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length : null;

  const buckets = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: ratings.filter((r) => Math.ceil(r.score) === star).length,
  }));
  const maxBucket = Math.max(1, ...buckets.map((b) => b.count));

  const sortedRatings = [...ratings].sort((a, b) => b.score - a.score);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 32,
          padding: "26px clamp(16px, 4vw, 28px)",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background:
            "radial-gradient(circle at 12% 30%, var(--accent-soft), transparent 55%), var(--bg-elevated)",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 78,
            height: 78,
            borderRadius: "50%",
            background: "var(--accent)",
            color: "var(--accent-contrast)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          {initial}
        </div>
        <div style={{ minWidth: 0 }}>
          <h1 style={{ fontSize: 26 }}>{profile.username}</h1>
          <p style={{ color: "var(--text-muted)", marginTop: 4 }}>{profile.email}</p>
          {averageScore != null && (
            <p style={{ color: "var(--star)", marginTop: 6, fontSize: 14 }}>
              ★ {averageScore.toFixed(2)} average across {ratings.length} rating{ratings.length === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 14,
          marginBottom: 40,
        }}
      >
        <StatCard label="Favorites" value={`${favorites.length} / 5`} />
        <StatCard label="Watchlist" value={watchlist.length} />
        <StatCard label="Ratings" value={ratings.length} />
        <StatCard label="Avg score" value={averageScore != null ? averageScore.toFixed(1) : "—"} />
      </div>

      {ratings.length > 0 && (
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 19, marginBottom: 16 }}>Rating Distribution</h2>
          <div
            style={{
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "20px 22px",
              background: "var(--bg-elevated)",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {buckets.map((b) => (
              <div key={b.star} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ width: 44, fontSize: 13, color: "var(--star)", flexShrink: 0 }}>
                  {b.star}★
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 10,
                    borderRadius: 999,
                    background: "var(--bg-hover)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${(b.count / maxBucket) * 100}%`,
                      height: "100%",
                      background: "var(--accent)",
                      borderRadius: 999,
                      transition: "width 0.3s ease",
                    }}
                  />
                </div>
                <span style={{ width: 28, fontSize: 13, color: "var(--text-muted)", textAlign: "right" }}>
                  {b.count}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {favorites.length > 0 && (
        <section style={{ marginBottom: 44 }}>
          <h2 style={{ fontSize: 19, marginBottom: 16 }}>Your Top 5</h2>
          <div className="poster-grid">
            {favorites.map((fav) => (
              <PosterTile key={fav.id} movie={fav.movie} onOpen={() => onOpenMovie(fav.movie.tmdbId)} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 style={{ fontSize: 19, marginBottom: 16 }}>Your Ratings</h2>
        {ratings.length === 0 ? (
          <EmptyState
            icon="★"
            title="No ratings yet"
            text="Rate the films you've seen and they'll show up here, along with your score breakdown."
            actionLabel="Browse films"
            onAction={onGoToBrowse}
          />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sortedRatings.map((rating) => (
              <div
                key={rating.id}
                onClick={() => onOpenMovie(rating.movie.tmdbId)}
                className="poster-tile"
                style={{
                  display: "flex",
                  gap: 14,
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: 12,
                  background: "var(--bg-elevated)",
                  cursor: "pointer",
                }}
              >
                {rating.movie.posterPath && (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${rating.movie.posterPath}`}
                    alt={rating.movie.title}
                    style={{ width: 54, borderRadius: 4, flexShrink: 0 }}
                  />
                )}
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                    <strong>{rating.movie.title}</strong>
                    {rating.movie.releaseDate && (
                      <span style={{ color: "var(--text-faint)", fontSize: 13 }}>
                        {rating.movie.releaseDate.slice(0, 4)}
                      </span>
                    )}
                    <span style={{ color: "var(--star)", fontSize: 13 }}>
                      {"★".repeat(Math.floor(rating.score))}
                      {rating.score % 1 !== 0 ? "½" : ""} ({rating.score.toFixed(1)})
                    </span>
                  </div>
                  {rating.review && (
                    <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 5, lineHeight: 1.5 }}>
                      {rating.review}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | string }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "16px 18px",
        background: "var(--bg-elevated)",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 800, color: "var(--accent)" }}>{value}</div>
      <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{label}</div>
    </div>
  );
}
