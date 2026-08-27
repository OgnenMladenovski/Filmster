import { useEffect, useState } from "react";
import { api, ApiError } from "../api";
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
  const [ratingsCount, setRatingsCount] = useState<number | null>(null);

  const [notice, setNotice] = useState<string | null>(null);
  const [rating, setRating] = useState<Movie | null>(null);

  useEffect(() => {
    api.getGenres(token).then(setGenres).catch(() => {});

    if (!token) {
      setFavoritesCount(null);
      setRatingsCount(null);
      setWatchlist([]);
      return;
    }

    api.getFavorites(token).then((d) => setFavoritesCount(d.length)).catch(() => setFavoritesCount(0));
    api.getRatings(token).then((d) => setRatingsCount(d.length)).catch(() => setRatingsCount(0));

    setWatchlistLoading(true);
    api
      .getWatchlist(token)
      .then((d) => setWatchlist(d.map((w) => w.movie)))
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
            ? (await api.getRecommendations(token as string)).map((r) => r.movie)
            : await api.getMoviesByGenre(token, active);
        if (!cancelled) setMovies(data);
      } catch (err) {
        if (!cancelled) setError(err instanceof ApiError ? err.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, token, isLocked]);

  async function handleAddFavorite(movie: Movie) {
    if (!token) return onRequireAuth();
    setError(null);
    setNotice(null);
    try {
      await api.addFavorite(token, movie.tmdbId);
      setNotice(`Added "${movie.title}" to favorites.`);
      setFavoritesCount((c) => (c ?? 0) + 1);
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
      setWatchlist((prev) => (prev.some((m) => m.tmdbId === movie.tmdbId) ? prev : [...prev, movie]));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
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

  const steps = [
    {
      icon: "★",
      title: "Rate what you've watched",
      text: "Score any film from 0 to 5 and leave a short review to build up your taste profile.",
    },
    {
      icon: "♥",
      title: "Pick your top 5",
      text: "Choose exactly five favorites — they become the seed for everything we recommend.",
    },
    {
      icon: "✦",
      title: "Get picks with reasons",
      text: "We pull real similar films from TMDB, then an AI ranks them and explains each choice.",
    },
  ];

  return (
    <div>
      <Hero token={token} onOpenMovie={onOpenMovie} onSearch={onSearch} />

      {token && (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 14,
            marginBottom: 44,
          }}
        >
          <StatTile label="Favorites" value={`${favoritesCount ?? 0} / 5`} hint="needed for picks" />
          <StatTile label="Watchlist" value={watchlist.length} hint="films saved" />
          <StatTile label="Ratings" value={ratingsCount ?? 0} hint="films rated" />
        </section>
      )}

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
              style={{ flexShrink: 0 }}
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
          title="Up Next — Your Watchlist"
          movies={watchlist}
          loading={watchlistLoading}
          onOpenMovie={onOpenMovie}
          onRate={handleRate}
          onAddFavorite={handleAddFavorite}
          onAddWatchlist={handleAddWatchlist}
        />
      )}

      <section
        style={{
          margin: "56px 0",
          padding: "40px clamp(16px, 5vw, 32px)",
          borderRadius: 12,
          border: "1px solid var(--border)",
          background: "var(--bg-elevated)",
        }}
      >
        <h2 style={{ fontSize: 22, textAlign: "center", marginBottom: 8 }}>How Reelist Works</h2>
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 14, marginBottom: 32 }}>
          Three steps between you and your next favorite film.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 28 }}>
          {steps.map((step, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: "var(--accent-soft)",
                  color: "var(--accent)",
                  fontSize: 24,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                {step.icon}
              </div>
              <h3 style={{ fontSize: 16, marginBottom: 8 }}>{step.title}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: 14, lineHeight: 1.5, maxWidth: 280, margin: "0 auto" }}>
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {!token && (
        <section
          style={{
            borderRadius: 12,
            padding: "clamp(28px, 6vw, 44px) clamp(16px, 6vw, 40px)",
            marginBottom: 24,
            textAlign: "center",
            background:
              "radial-gradient(circle at 80% 20%, var(--accent-glow), transparent 55%), linear-gradient(135deg, #1a1e26, #0e1013)",
            border: "1px solid var(--border)",
          }}
        >
          <h2 style={{ fontSize: 24, marginBottom: 10 }}>Ready for picks made for you?</h2>
          <p style={{ color: "var(--text-muted)", maxWidth: 420, margin: "0 auto 22px" }}>
            Create a free account to rate films, build your watchlist, and unlock AI recommendations.
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
          onRated={() => {
            setNotice(`Rated "${rating.title}".`);
            setRatingsCount((c) => (c ?? 0) + 1);
          }}
        />
      )}
    </div>
  );
}

function StatTile({ label, value, hint }: { label: string; value: string | number; hint: string }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "16px 18px",
        background: "var(--bg-elevated)",
      }}
    >
      <div style={{ fontSize: 26, fontWeight: 800, color: "var(--accent)", lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{label}</div>
      <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{hint}</div>
    </div>
  );
}
