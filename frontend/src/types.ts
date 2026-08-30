export interface Movie {
    id: number;
    tmdbId: number;
    title: string;
    posterPath: string | null;
    releaseDate: string | null;
    tmdbRating: number | null;
}

export interface MovieDetails extends Movie {
    overview: string;
    runtime: number | null;
    backdropPath: string | null;
    tmdbVoteCount: number | null;
    genres: { id: number; tmdbId: number; name: string }[];
}

export interface FavoriteMovie {
    id: number;
    movie: Movie;
}

export interface WatchlistItem {
    id: number;
    movie: Movie;
}

export interface Rating {
    id: number;
    movie: Movie;
    score: number;
    review: string | null;
    ratedAt: string;
}

export interface Recommendation {
    id: number;
    movie: Movie;
    rank: number;
    reason: string;
}

export interface Genre {
    id: number;
    tmdbId: number;
    name: string;
}

export interface UserProfile {
    username: string;
    email: string;
    role: string;
}
