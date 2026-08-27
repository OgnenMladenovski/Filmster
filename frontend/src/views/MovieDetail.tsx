import { useEffect, useState } from "react";
import { api, ApiError } from "../api";
import type { MovieDetails, Movie } from "../types";
import { RateModal } from "./RateModal";
import { MovieRow } from "../components/MovieRow";

interface Props {
  token: string | null;
  tmdbId: number;
  onBack: () => void;
  onRequireAuth: () => void;
  onOpenMovie: (tmdbId: number) => void;
}

export function MovieDetail({ token, tmdbId, onBack, onRequireAuth, onOpenMovie }: Props) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [rating, setRating] = useState(false);

  const [myScore, setMyScore] = useState<number | null>(null);
  const [myReview, setMyReview] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  const [related, setRelated] = useState<Movie[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);

  useEffect(() => {
    setMovie(null);
    setError(null);
    setNotice(null);
    api
      .getMovie(token, tmdbId)
      .then(setMovie)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Something went wrong"));
  }, [tmdbId]);

  useEffect(() => {
    if (!token) {
      setMyScore(null);
      setIsFavorite(false);
      setInWatchlist(false);
      return;
    }
    api
      .getRatings(token)
      .then((ratings) => {
        const mine = ratings.find((r) => r.movie.tmdbId === tmdbId);
        setMyScore(mine ? mine.score : null);
        setMyReview(mine?.review ?? null);
      })
      .catch(() => {});
    api
      .getFavorites(token)
      .then((favs) => setIsFavorite(favs.some((f) => f.movie.tmdbId === tmdbId)))
      .catch(() => {});
    api
      .getWatchlist(token)
      .then((items) => setInWatchlist(items.some((w) => w.movie.tmdbId === tmdbId)))
      .catch(() => {});
  }, [token, tmdbId]);

  useEffect(() => {
    const genre = movie?.genres?.[0];
    if (!genre) {
      setRelated([]);
      return;
    }
    let cancelled = false;
    setRelatedLoading(true);
    api
      .getMoviesByGenre(token, genre.tmdbId)
      .then((data) => {
        if (!cancelled) setRelated(data.filter((m) => m.tmdbId !== tmdbId).slice(0, 15));
      })
      .catch(() => {
        if (!cancelled) setRelated([]);
      })
      .finally(() => {
        if (!cancelled) setRelatedLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [movie, token, tmdbId]);

  async function handleAddFavorite() {
    if (!token) return onRequireAuth();
    setError(null);
    setNotice(null);
    try {
      await api.addFavorite(token, tmdbId);
      setIsFavorite(true);
      setNotice("Added to favorites.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  async function handleRemoveFavorite() {
    if (!token) return onRequireAuth();
    setError(null);
    setNotice(null);
    try {
      await api.removeFavorite(token, tmdbId);
      setIsFavorite(false);
      setNotice("Removed from favorites.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  async function handleToggleWatchlist() {
    if (!token) return onRequireAuth();
    setError(null);
    setNotice(null);
    try {
      if (inWatchlist) {
        await api.removeFromWatchlist(token, tmdbId);
        setInWatchlist(false);
        setNotice("Removed from watchlist.");
      } else {
        await api.addToWatchlist(token, tmdbId);
        setInWatchlist(true);
        setNotice("Added to watchlist.");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  function handleRate() {
    if (!token) return onRequireAuth();
    setRating(true);
  }

  async function handleAddRelatedFavorite(m: Movie) {
    if (!token) return onRequireAuth();
    try {
      await api.addFavorite(token, m.tmdbId);
      setNotice(`Added "${m.title}" to favorites.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  async function handleAddRelatedWatchlist(m: Movie) {
    if (!token) return onRequireAuth();
    try {
      await api.addToWatchlist(token, m.tmdbId);
      setNotice(`Added "${m.title}" to watchlist.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  return (
    <div>
      <button onClick={onBack} style={{ marginBottom: 16 }}>
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
                  height: 300,
                  backgroundImage: `linear-gradient(to bottom, rgba(20,24,28,0.25), var(--bg) 95%), url(https://image.tmdb.org/t/p/w1280${movie.backdropPath})`,
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
                paddingTop: movie.backdropPath ? 150 : 0,
              }}
            >
              <div style={{ flexShrink: 0, width: 220 }}>
                {movie.posterPath ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                    alt={movie.title}
                    style={{ width: "100%", borderRadius: 8, boxShadow: "0 12px 30px rgba(0,0,0,0.6)" }}
                  />
                ) : (
                  <div style={{ width: "100%", aspectRatio: "2/3", background: "var(--bg-elevated)", borderRadius: 8 }} />
                )}

                {token && (
                  <div
                    style={{
                      marginTop: 14,
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: 14,
                      background: "var(--bg-elevated)",
                    }}
                  >
                    <div style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 6 }}>YOUR ACTIVITY</div>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>
                      {myScore != null ? (
                        <span style={{ color: "var(--star)" }}>
                          {"★".repeat(Math.floor(myScore))}
                          {myScore % 1 !== 0 ? "½" : ""} {myScore.toFixed(1)}
                        </span>
                      ) : (
                        <span style={{ color: "var(--text-faint)" }}>Not rated yet</span>
                      )}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      {isFavorite ? "♥ In your favorites" : "Not a favorite"}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      {inWatchlist ? "✓ On your watchlist" : "Not on watchlist"}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ flex: 1, minWidth: 280 }}>
                <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)" }}>{movie.title}</h1>
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    color: "var(--text-muted)",
                    marginTop: 6,
                    fontSize: 14,
                    flexWrap: "wrap",
                  }}
                >
                  {movie.releaseDate && <span>{movie.releaseDate.slice(0, 4)}</span>}
                  {movie.runtime && <span>· {movie.runtime} min</span>}
                  {movie.tmdbRating != null && (
                    <span style={{ color: "var(--star)" }}>★ {movie.tmdbRating.toFixed(1)}</span>
                  )}
                  {movie.tmdbVoteCount != null && <span>({movie.tmdbVoteCount.toLocaleString()} votes)</span>}
                </div>

                {movie.genres.length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                    {movie.genres.map((g) => (
                      <span
                        key={g.id}
                        style={{
                          border: "1px solid var(--border)",
                          borderRadius: 999,
                          padding: "3px 12px",
                          fontSize: 12,
                          color: "var(--text-muted)",
                        }}
                      >
                        {g.name}
                      </span>
                    ))}
                  </div>
                )}

                <p style={{ marginTop: 20, lineHeight: 1.65, color: "var(--text)", maxWidth: 640 }}>
                  {movie.overview || "No synopsis available for this film."}
                </p>

                <div style={{ display: "flex", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
                  {isFavorite ? (
                    <button onClick={handleRemoveFavorite}>♥ In Favorites — Remove</button>
                  ) : (
                    <button className="primary" onClick={handleAddFavorite}>
                      ♥ Add to Favorites
                    </button>
                  )}
                  <button onClick={handleToggleWatchlist}>
                    {inWatchlist ? "✓ On Watchlist — Remove" : "+ Watchlist"}
                  </button>
                  <button onClick={handleRate}>{myScore != null ? "★ Change Rating" : "★ Rate"}</button>
                </div>

                {myReview && (
                  <div
                    style={{
                      marginTop: 18,
                      borderLeft: "3px solid var(--accent)",
                      paddingLeft: 14,
                      color: "var(--text-muted)",
                      fontSize: 14,
                      lineHeight: 1.6,
                      maxWidth: 640,
                    }}
                  >
                    <div style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 4 }}>YOUR REVIEW</div>
                    {myReview}
                  </div>
                )}

                {!token && (
                  <p style={{ color: "var(--text-faint)", fontSize: 13, marginTop: 12 }}>
                    Log in to rate, favorite, or add this to your watchlist.
                  </p>
                )}

                {notice && <p style={{ color: "var(--accent)", marginTop: 12 }}>{notice}</p>}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 56 }}>
            <MovieRow
              title={movie.genres?.[0] ? `More in ${movie.genres[0].name}` : "More films"}
              movies={related}
              loading={relatedLoading}
              onOpenMovie={onOpenMovie}
              onRate={(m) => {
                if (!token) return onRequireAuth();
                onOpenMovie(m.tmdbId);
              }}
              onAddFavorite={handleAddRelatedFavorite}
              onAddWatchlist={handleAddRelatedWatchlist}
            />
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
            setNotice("Rating saved.");
          }}
        />
      )}
    </div>
  );
}
