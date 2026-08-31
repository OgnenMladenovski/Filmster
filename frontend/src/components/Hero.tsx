import { useEffect, useState } from "react";
import movieApi from "../api/movieApi";
import type { MovieDetails } from "../types";

interface Props {
  token: string | null;
  onOpenMovie: (tmdbId: number) => void;
  onSearch: (query: string) => void;
}

const FEATURED_GENRE_TMDB_ID = 28;

export function Hero({ token, onOpenMovie, onSearch }: Props) {
  const [featured, setFeatured] = useState<MovieDetails | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
      movieApi
      .getByGenre(FEATURED_GENRE_TMDB_ID)
      .then((res) => {
        const movies = res.data;
        const candidate = movies.find((m) => m.posterPath) ?? movies[0];
        if (!candidate) return null;
        return movieApi.getById(candidate.tmdbId);
      })
      .then((res) => {
        if (!cancelled && res) setFeatured(res.data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [token]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  }

  const backdrop = featured?.backdropPath
    ? `https://image.tmdb.org/t/p/w1280${featured.backdropPath}`
    : null;

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        border: "1.5px solid var(--border)",
        marginBottom: 48,
        minHeight: 380,
        display: "flex",
        alignItems: "flex-end",
        background: backdrop
          ? `linear-gradient(to right, rgba(14,16,19,0.94) 0%, rgba(14,16,19,0.70) 40%, rgba(14,16,19,0.15) 100%), linear-gradient(to top, rgba(14,16,19,0.7) 0%, transparent 60%), url(${backdrop}) center/cover`
          : "radial-gradient(circle at 20% 20%, var(--accent-glow), transparent 55%), linear-gradient(135deg, #1a1e26, #0e1013)",
        transition: "background-image 0.4s ease",
      }}
    >
      <div style={{ position: "relative", zIndex: 1, padding: "clamp(28px, 6vw, 48px)", maxWidth: 620 }}>
        <h1 style={{ fontSize: "clamp(26px, 5vw, 42px)", lineHeight: 1.1, marginBottom: 12, color: "var(--accent)" }}>
          Track films and find your next favorite.
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: 16, marginBottom: 24, lineHeight: 1.55 }}>
            Your five favorites become the search. Every suggestion is a real movie and every one comes with a reason.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          <input
            placeholder="Search for a film..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: "min(320px, 100%)", padding: "11px 14px" }}
          />
          <button type="submit" className="primary" style={{ padding: "11px 22px" }}>
            Search
          </button>
        </form>

        {featured && (
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ color: "var(--text-faint)", fontSize: 13 }}>Featured:</span>
            <button
              onClick={() => onOpenMovie(featured.tmdbId)}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1.5px solid var(--border)",
                padding: "6px 14px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {featured.title}
              {featured.tmdbRating != null && (
                <span style={{ color: "var(--star)", marginLeft: 8 }}>★ {(featured.tmdbRating/2).toFixed(1)}</span>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
