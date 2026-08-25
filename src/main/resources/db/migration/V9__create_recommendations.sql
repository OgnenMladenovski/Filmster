CREATE TABLE recommendations(
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id BIGINT NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    reason TEXT NOT NULL,
    UNIQUE(user_id, movie_id)
);

CREATE INDEX index_recommendations_user_rank ON recommendations(user_id, rank);