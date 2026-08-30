import { useEffect, useState } from "react";
import favoriteApi from "../api/favoriteApi";
import { getErrorMessage } from "../api/getErrorMessage";
import type { FavoriteMovie } from "../types";
import { PosterTile } from "../components/PosterTile";
import { EmptyState } from "../components/EmptyState";

interface Props {
  token: string;
  onOpenMovie: (tmdbId: number) => void;
  onGoToBrowse: () => void;
}

export function Favorites({ onOpenMovie, onGoToBrowse }: Props) {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    setError(null);
    try {
      setFavorites((await favoriteApi.getMy()).data);
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
      await favoriteApi.remove(tmdbId);
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  const complete = favorites.length === 5;

  return (
    <div>
      <h2 style={{ fontSize: 24, color: "var(--accent)" }}>Favorites</h2>
      <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "6px 0 18px" }}>
        Your five all-time favorites, the seed we need for every recommendation we generate.
      </p>

      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "16px 18px",
          background: "var(--bg-elevated)",
          marginBottom: 28,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: complete ? "var(--accent)" : undefined }}>
                {favorites.length} of 5 selected
            </span>
          <span style={{ fontSize: 16, color: complete ? "var(--accent)" : "var(--text-faint)" }}>
            {complete ? "Recommendations unlocked" : `You need ${5 - favorites.length} more to unlock recommendations`}
          </span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 8,
                borderRadius: 999,
                background: i < favorites.length ? "var(--accent)" : "var(--bg-hover)",
                transition: "background 0.25s ease",
              }}
            />
          ))}
        </div>
      </div>

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

      {loaded && favorites.length === 0 ? (
        <EmptyState
          icon="X"
          title="No favorites yet"
          text="Pick exactly five films you love most. They tell the recommendation model what your taste actually looks like."
          actionLabel="Find films to add"
          onAction={onGoToBrowse}
        />
      ) : (
        <div className="poster-grid">
          {favorites.map((fav) => (
            <PosterTile
              key={fav.id}
              movie={fav.movie}
              onOpen={() => onOpenMovie(fav.movie.tmdbId)}
              onRemove={() => handleRemove(fav.movie.tmdbId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
