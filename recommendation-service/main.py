from fastapi import FastAPI
from models import RecommendationRequest, RecommendationResponse
from recommender import get_recommendations

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/recommend", response_model=RecommendationResponse)
def recommend(request: RecommendationRequest):
    return get_recommendations(request.favorites, request.candidates, request.limit)
