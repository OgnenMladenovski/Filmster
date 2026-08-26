def build_prompt(favorites, candidates, limit):
    favorites_text = "\n".join(
        f"- {f.title} (tmdb_id: {f.tmdb_id}, genres: {','.join(f.genres)}, cast: {'.'.join(f.cast)}"
            for f in favorites
    )

    candidates_text = "\n".join(
        f"- tmdb_id: {c.tmdb_id}, title: {c.title}, overview: {c.overview[:200]}"
        for c in candidates
    )

    return f"""
    You are an expert movie recommendation assistant.
    
    The user's favorite movies are: {favorites_text}
    
    Here are a list of candidate movies you may recommend: {candidates_text}
    
    Your task: select the {limit} best candidates for this user and rank them from 1 (best) to {limit}.
    
    IMPORTANT RULES:
    - You must select movies EXCLUSIVELY from the candidate list above.
    - Never invent or mention a movie that is not in the candidate list.
    - For each recommendation, the reason MUST explicitly name at least one specific favorite movie from the list above and explain the connection (e.g. shared theme, genre, tone, director style). Do not write a generic plot summary of the candidate alone.
    - Write 3-4 sentences per reason, not just one. Go into more detail about the specific connection.
    - If a cast member appears in both the favorite and the candidate, you MUST mention them by name.
    - Vary which favorite movie you reference across the 10 recommendations. Do not reference the same favorite movie in every single reason - spread your references across different favorites from the {list}, so each favorite gets mentioned in at least one recommendation where relevant.
        
    Example of a good reason: "Because you liked Inception, you'll enjoy this film's similar exploration of layered reality and psychological tension."
    Example of a bad reason: "This is a great sci-fi film with an interesting plot."
    
    Remember: only use tmdb_id values that appear in the candidate list above. DO NOT INVENT MOVIES.
    """