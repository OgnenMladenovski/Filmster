import { useEffect, useState } from "react";
import { api, ApiError } from "../api";
import type { WatchlistItem } from "../types";
import { PosterTile } from "../components/PosterTile";
import { EmptyState } from "../components/EmptyState";

interface Props {
  token: string;
  onOpenMovie: (tmdbId: number) => void;
  onGoToBrowse: () => void;
}

export function Watchlist({ token, onOpenMovie, onGoToBrowse }: Props) {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  async function load() {
    setError(null);
    try {
      setItems(await api.getWatchlist(token));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoaded(true);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleRemove(tmdbId: number) {
    setError(null);
    try {
      await api.removeFromWatchlist(token, tmdbId);
      await load();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: 24 }}>Watchlist</h2>
      <p style={{ color: "var(--text-muted)", fontSize: 14, margin: "6px 0 24px" }}>
        {items.length === 0
          ? "Films you want to get to."
          : `${items.length} film${items.length === 1 ? "" : "s"} waiting to be watched.`}
      </p>

      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}

      {loaded && items.length === 0 ? (
        <EmptyState
          icon="🍿"
          title="Your watchlist is empty"
          text="Save films you want to watch later — hover any poster and hit the + button, or open a film and add it from there."
          actionLabel="Find films to add"
          onAction={onGoToBrowse}
        />
      ) : (
        <div className="poster-grid">
          {items.map((item) => (
            <PosterTile
              key={item.id}
              movie={item.movie}
              onOpen={() => onOpenMovie(item.movie.tmdbId)}
              onRemove={() => handleRemove(item.movie.tmdbId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
