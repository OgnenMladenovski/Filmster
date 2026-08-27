import { useEffect, useState } from "react";
import { api, ApiError } from "../api";
import type { Recommendation, FavoriteMovie } from "../types";
import { EmptyState } from "../components/EmptyState";

interface Props {
  token: string;
  onOpenMovie: (tmdbId: number) => void;
  onGoToFavorites: () => void;
}

const GENERATING_STEPS = [
  "Reading your five favorites…",
  "Pulling similar films from TMDB…",
  "Building the candidate pool…",
  "Asking the AI to rank them…",
  "Writing the reasons…",
];

export function Recommendations({ token, onOpenMovie, onGoToFavorites }: Props) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    api
      .getRecommendations(token)
      .then(setRecommendations)
      .catch((err) => setError(err instanceof ApiError ? err.message : "Something went wrong"))
      .finally(() => setLoaded(true));
    api.getFavorites(token).then(setFavorites).catch(() => setFavorites([]));
  }, [token]);

  useEffect(() => {
    if (!loading) {
      setStep(0);
      return;
    }
    const id = setInterval(() => setStep((s) => (s + 1) % GENERATING_STEPS.length), 4000);
    return () => clearInterval(id);
  }, [loading]);

  async function handleGenerate() {
    setError(null);
    setNotice(null);
    setLoading(true);
    try {
      const data = await api.generateRecommendations(token);
      setRecommendations(data);
      setNotice(`Generated ${data.length} fresh pick${data.length === 1 ? "" : "s"}.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddWatchlist(tmdbId: number, title: string) {
    setError(null);
    setNotice(null);
    try {
      await api.addToWatchlist(token, tmdbId);
      setNotice(`Added "${title}" to watchlist.`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  const hasFiveFavorites = favorites.length === 5;
  const [top, ...rest] = recommendations;

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <h2 style={{ fontSize: 26 }}>For You</h2>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 6, maxWidth: 620, lineHeight: 1.6 }}>
          We take your five favorites, pull films TMDB considers similar, then let an AI rank that real
          shortlist — so every pick exists, and every pick comes with a reason.
        </p>
      </div>

      {hasFiveFavorites && favorites.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            flexWrap: "wrap",
            padding: "14px 16px",
            border: "1px solid var(--border)",
            borderRadius: 10,
            background: "var(--bg-elevated)",
            margin: "22px 0",
          }}
        >
          <span style={{ fontSize: 12, color: "var(--text-faint)", letterSpacing: "0.04em" }}>BASED ON</span>
          <div style={{ display: "flex", gap: 8 }}>
            {favorites.map((fav) => (
              <img
                key={fav.id}
                src={
                  fav.movie.posterPath
                    ? `https://image.tmdb.org/t/p/w92${fav.movie.posterPath}`
                    : undefined
                }
                alt={fav.movie.title}
                title={fav.movie.title}
                onClick={() => onOpenMovie(fav.movie.tmdbId)}
                style={{
                  width: 38,
                  height: 57,
                  objectFit: "cover",
                  borderRadius: 4,
                  cursor: "pointer",
                  background: "var(--bg-hover)",
                  border: "1px solid var(--border)",
                }}
              />
            ))}
          </div>
          <button
            className="primary"
            onClick={handleGenerate}
            disabled={loading}
            style={{ marginLeft: "auto" }}
          >
            {loading ? "Generating…" : recommendations.length > 0 ? "Regenerate" : "Generate Recommendations"}
          </button>
        </div>
      )}

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {notice && <p style={{ color: "var(--accent)" }}>{notice}</p>}

      {loaded && !hasFiveFavorites && (
        <EmptyState
          icon="🔒"
          title="Pick five favorites first"
          text={`Recommendations are built from exactly five favorite films. You currently have ${favorites.length} of 5.`}
          actionLabel="Go to Favorites"
          onAction={onGoToFavorites}
        />
      )}

      {loading && (
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: "40px 24px",
            textAlign: "center",
            background: "var(--bg-elevated)",
          }}
        >
          <div className="pulse-dot" style={{ margin: "0 auto 18px" }} />
          <p style={{ fontWeight: 600, marginBottom: 6 }}>{GENERATING_STEPS[step]}</p>
          <p style={{ color: "var(--text-faint)", fontSize: 13 }}>
            This runs a local AI model — it usually takes 15–40 seconds.
          </p>
        </div>
      )}

      {!loading && loaded && hasFiveFavorites && recommendations.length === 0 && (
        <EmptyState
          icon="✦"
          title="No recommendations yet"
          text="You've got your five favorites locked in. Generate your first set of picks — each one comes with an explanation of why it fits."
          actionLabel="Generate Recommendations"
          onAction={handleGenerate}
        />
      )}

      {!loading && top && (
        <>
          <div
            onClick={() => onOpenMovie(top.movie.tmdbId)}
            className="poster-tile"
            style={{
              display: "flex",
              gap: 22,
              flexWrap: "wrap",
              padding: 22,
              borderRadius: 12,
              cursor: "pointer",
              marginBottom: 26,
              border: "1px solid var(--accent)",
              background:
                "radial-gradient(circle at 88% 15%, var(--accent-soft), transparent 60%), var(--bg-elevated)",
            }}
          >
            {top.movie.posterPath && (
              <img
                src={`https://image.tmdb.org/t/p/w342${top.movie.posterPath}`}
                alt={top.movie.title}
                style={{ width: 132, borderRadius: 8, flexShrink: 0, boxShadow: "0 10px 26px rgba(0,0,0,0.5)" }}
              />
            )}
            <div style={{ flex: 1, minWidth: 240 }}>
              <span
                style={{
                  display: "inline-block",
                  background: "var(--accent)",
                  color: "var(--accent-contrast)",
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  padding: "3px 10px",
                  borderRadius: 999,
                  marginBottom: 10,
                }}
              >
                TOP PICK
              </span>
              <h3 style={{ fontSize: 22, marginBottom: 6 }}>{top.movie.title}</h3>
              <div style={{ display: "flex", gap: 10, color: "var(--text-muted)", fontSize: 13, marginBottom: 12 }}>
                {top.movie.releaseDate && <span>{top.movie.releaseDate.slice(0, 4)}</span>}
                {top.movie.tmdbRating != null && (
                  <span style={{ color: "var(--star)" }}>★ {top.movie.tmdbRating.toFixed(1)}</span>
                )}
              </div>
              <p
                style={{
                  color: "var(--text)",
                  fontSize: 14.5,
                  lineHeight: 1.65,
                  borderLeft: "3px solid var(--accent)",
                  paddingLeft: 14,
                  maxWidth: 620,
                }}
              >
                {top.reason}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddWatchlist(top.movie.tmdbId, top.movie.title);
                }}
                style={{ marginTop: 16 }}
              >
                + Add to Watchlist
              </button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {rest.map((rec) => (
              <div
                key={rec.id}
                onClick={() => onOpenMovie(rec.movie.tmdbId)}
                className="poster-tile"
                style={{
                  display: "flex",
                  gap: 16,
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  padding: 14,
                  background: "var(--bg-elevated)",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 26,
                    fontSize: 17,
                    fontWeight: 800,
                    color: "var(--text-faint)",
                    textAlign: "center",
                    paddingTop: 2,
                  }}
                >
                  {rec.rank}
                </div>
                {rec.movie.posterPath && (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${rec.movie.posterPath}`}
                    alt={rec.movie.title}
                    style={{ width: 74, borderRadius: 5, flexShrink: 0, alignSelf: "flex-start" }}
                  />
                )}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
                    <strong style={{ fontSize: 16 }}>{rec.movie.title}</strong>
                    {rec.movie.releaseDate && (
                      <span style={{ color: "var(--text-faint)", fontSize: 13 }}>
                        {rec.movie.releaseDate.slice(0, 4)}
                      </span>
                    )}
                    {rec.movie.tmdbRating != null && (
                      <span style={{ color: "var(--star)", fontSize: 13 }}>
                        ★ {rec.movie.tmdbRating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 6, lineHeight: 1.55 }}>
                    {rec.reason}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddWatchlist(rec.movie.tmdbId, rec.movie.title);
                  }}
                  title="Add to watchlist"
                  style={{ alignSelf: "flex-start", flexShrink: 0, padding: "5px 11px" }}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
