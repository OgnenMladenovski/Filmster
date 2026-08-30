def build_prompt(favorites, candidates, ratings, limit):
    favorites_text = "\n".join(
        f"- {f.title} (tmdb_id: {f.tmdb_id}, genres: {', '.join(f.genres)}, cast: {', '.join(f.cast)})"
        for f in favorites
    )

    ratings_text = "\n".join(
        f"- {r.title} (tmdb_id: {r.tmdb_id}): the user rated this {r.score}/5"
        for r in ratings
    ) or "The user has not rated any movies yet."

    candidates_text = "\n".join(
        f"- tmdb_id: {c.tmdb_id}, title: {c.title}, overview: {c.overview[:200]}"
        for c in candidates
    )

    return f"""
You are an expert movie recommendation assistant.

=== MOVIES THE USER ALREADY LOVES (this is their taste) ===
Favorites:
{favorites_text}

Rated by the user (their own score out of 5):
{ratings_text}

=== CANDIDATE MOVIES (the user has NOT seen these — you recommend FROM this list) ===
{candidates_text}

Your task: select the {limit} best CANDIDATES for this user and rank them 1 (best) to {limit}.

CRITICAL RULES ABOUT THE REASONS:
- A candidate is a NEW movie the user has NOT seen. NEVER write that the user "loves", "is a fan of", "appreciates", or "has a love for" a candidate. You are recommending it TO them.
- When describing the user's taste, you may ONLY name movies from the Favorites or Rated lists above. NEVER claim the user likes a movie that is not in those lists, and never invent one.
- Each reason must be about ONLY the single candidate you selected for that entry (its exact title). Do NOT mention or recommend a different movie inside the reason.
- CORRECT: "Because you loved Inception and Memento, you'll enjoy <candidate title> for its <shared theme/tone/director/cast>."
- WRONG: "Given your love for <candidate title>, you'll appreciate..."  (the user has NOT seen the candidate).

HOW TO USE THE RATINGS:
- A movie rated 4-5/5 is a strong signal of what they LOVE — prefer candidates similar in genre, tone, director, or cast.
- A movie rated 1-2/5 is what they DISLIKE — avoid candidates that resemble it.

OTHER RULES:
- Select tmdb_id values EXCLUSIVELY from the candidate list. Never invent a movie or a tmdb_id.
- Each reason must explicitly name at least one Favorite or Rated movie and explain the concrete connection (shared theme, genre, tone, director, or a shared cast member named explicitly).
- Write 3-4 full sentences per reason.
- Vary which favorite/rated movie you reference across the {limit} recommendations.

Example of a GOOD reason (candidate = "Prisoners"): "Because you loved Memento and Oppenheimer, you'll be drawn to Prisoners' tense, morally grey storytelling and slow-burn dread. Like Nolan's films, it trusts the viewer with a layered, ambiguous plot. Jake Gyllenhaal's restrained intensity echoes the character-driven focus of your favorites."
Example of a BAD reason: "Given your love for Prisoners, you'll enjoy this great thriller."  (WRONG: the user has not seen Prisoners — it is the candidate.)

Remember: recommend only tmdb_id values from the candidate list. The user has NOT seen the candidates.
"""