CREATE TABLE movies (
    id BIGSERIAL PRIMARY KEY,
    tmdb_id INTEGER NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    overview TEXT,
    release_date DATE,
    runtime INTEGER,
    poster_path VARCHAR(255),
    backdrop_path VARCHAR(255),
    tmdb_rating NUMERIC(3,1),
    tmdb_vote_count INTEGER,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);