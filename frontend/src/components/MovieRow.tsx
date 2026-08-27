import type { Movie } from "../types";
import { PosterTile } from "./PosterTile";
import { PosterSkeleton } from "./PosterSkeleton";
import { Carousel } from "./Carousel";

interface Props {
  title: string;
  movies: Movie[];
  loading: boolean;
  error?: string | null;
  hideWhenEmpty?: boolean;
  onOpenMovie: (tmdbId: number) => void;
  onRate: (movie: Movie) => void;
  onAddFavorite: (movie: Movie) => void;
  onAddWatchlist: (movie: Movie) => void;
}

export function MovieRow({
  title,
  movies,
  loading,
  error,
  hideWhenEmpty = true,
  onOpenMovie,
  onRate,
  onAddFavorite,
  onAddWatchlist,
}: Props) {
  if (!loading && !error && movies.length === 0 && hideWhenEmpty) {
    return null;
  }

  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 19, marginBottom: 14 }}>{title}</h2>
      {error && <p style={{ color: "var(--danger)" }}>{error}</p>}
      {loading && <PosterSkeleton count={7} />}
      {!loading && !error && movies.length === 0 && (
        <p style={{ color: "var(--text-muted)" }}>Nothing here yet.</p>
      )}
      {!loading && !error && movies.length > 0 && (
        <Carousel>
          {movies.map((movie) => (
            <div key={movie.tmdbId} style={{ flexShrink: 0, width: 140 }}>
              <PosterTile
                movie={movie}
                onOpen={() => onOpenMovie(movie.tmdbId)}
                onRate={() => onRate(movie)}
                onAddFavorite={() => onAddFavorite(movie)}
                onAddWatchlist={() => onAddWatchlist(movie)}
              />
            </div>
          ))}
        </Carousel>
      )}
    </section>
  );
}
