from langchain_ollama import ChatOllama
from models import RecommendationResponse, FavoriteMovie, CandidateMovie
from prompts import build_prompt

llm = ChatOllama(model="llama3.2:3b", temperature=0.2)
structured_llm = llm.with_structured_output(RecommendationResponse)

def get_recommendations(favorites: list[FavoriteMovie],
                        candidates: list[CandidateMovie],
                        limit: int) -> RecommendationResponse:
    prompt = build_prompt(favorites, candidates, limit)
    result = structured_llm.invoke(prompt)
    return result