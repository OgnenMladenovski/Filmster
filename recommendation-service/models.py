from pydantic import BaseModel
from typing import List, Optional

class FavoriteMovie(BaseModel):
    tmdb_id: int
    title: str
    genres: List[str]

class CandidateMovie(BaseModel):
    tmdb_id: int
    title: str
    overview: str
    rating: Optional[float] = None

class RecommendationRequest(BaseModel):
    favorites: List[FavoriteMovie]
    candidates: List[CandidateMovie]
    limit: int = 10

class RecommendationItem(BaseModel):
    tmdb_id: int
    rank: int
    reason: str

class RecommendationResponse(BaseModel):
    recommendations: List[RecommendationItem]