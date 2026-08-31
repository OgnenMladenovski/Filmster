# Filmster

> Project for the course <b>Advanced Web Programming</b> at the Faculty of Computer Science and Engineering (FINKI), Ss. Cyril and Methodius University, Skopje.

---

## Overview

A Letterboxd inspired movie rating web application. Users authenticate with JWT, search through the TMDB catalogue or browse by genre, open detailed pages about the film, rate what they have watched, build a watchlist and pick their 5 all-time favorite movies. Those five favorites, together with the user's own ratings, feed a local AI recommendation model that ranks a shortlist of 5 picks, each with a written reason explaining the connection to the user's taste.

---

## Features

- **JWT Authentication** — Register and log in with the use of a token.
- **Film Search & Genre Browsing** — Search the full TMDB API or browse by genre.
- **Ratings & Reviews** — Rate any film 0–5 with a half-star picker and an optional review.
- **Favorites** — Pick 5 of your all-time favorite movies, which unlock the recommendation model.
- **Watchlist** — Build a list of movies to watch later.
- **AI Recommendations ("For You")** — 5 ranked picks, each with a 3-4 sentence reason tied to your favorites and ratings.
- **Profile** — User stats, rating-distribution bar chart, your top five, and a full rating history.

---

## Tech Stack

| Layer             | Technology       |
|-------------------|------------------|
| Frontend          | React 19, TypeScript |
| Backend           | Java 21, Spring Boot 4.1 |
| Security          | Spring Security + JWT |
| Database          | PostgreSQL       |
| Migrations        | Flyway           |
| Build Tool        | Maven            |
| Utilities         | Lombok           |
| AI Service        | FastAPI / Python |
| LLM Orchestration | LangChain|
| Local LLM Runtime | Ollama (llama3.2:3b) |
| API               | TMDB API         |

---

## Architecture

The project has 3 independently runnable components:

```
Movie-Recommendation-App
│
├── backend/                  Spring Boot backend - auth, movies (TMDB), favorites,
│                             watchlist, ratings, and recommendation orchestration
│
├── recommendation-service/   FastAPI microservice - LangChain + Ollama
│                             (prompt building, LLM ranking with reasons)
│
└── frontend/                 React + TypeScript (Vite) single-page app
```

Backend package (under `backend/src/main/java/`) layered:

```
movierecommendationapp
│ 
├── client/            TmdbClient, RecommendationServiceClient + dto/
│ 
├── config/            Security, JWT, JPA, OpenAPI configuration
│ 
├── constants/         JwtConstants
│ 
├── helper/            JwtHelper
│ 
├── model/
│   │ 
│   ├── domain/        User, Movie, Genre, FavoriteMovie, WatchlistItem, Rating, Recommendation
│   │ 
│   ├── dto/           request / response DTOs
│   │ 
│   └── exception/     domain exceptions
│ 
├── repository/        Spring Data JPA repositories
│ 
├── service/
│   │ 
│   ├── application/   application services (+ impl/)
│   │ 
│   └── domain/        domain services (+ impl/)
│ 
└── web/
    │ 
    ├── controller/    User, Movie, Genre, Favorite, Watchlist, Rating, Recommendation
    │ 
    ├── dto/           API error DTOs
    │ 
    ├── filter/        JwtFilter
    │ 
    └── handler/       global + per-domain exception handlers
```

---

## Prerequisites

- Java 21 & Maven
- Node.js 18+ & npm
- PostgreSQL
- [Ollama](https://ollama.com) (local LLM runtime)

---

## Project Setup

**1. Clone the repository**
```bash
git clone https://github.com/OgnenMladenovski/Filmster.git
cd Filmster
```

**2. Get a TMDB API key**
- Create a free account at https://www.themoviedb.org
- Go to **Settings → API** and request a key (choose *Developer*)
- Copy the **API Key (v3 auth)** value

**3. Create the database**
```sql
CREATE DATABASE movie_app;
```

**4. Configure the backend environment variables (`backend/.env`)**
```properties
TMDB_API_KEY=your_tmdb_api_key
JWT_SECRET_KEY=your_long_random_secret
```

**5. Configure the frontend environment variables (`frontend/.env`)**
```properties
VITE_BASE_API_URL=http://localhost:8080/api
```

---

## Running the Application

Start the four services (each in its own terminal).

**1. Ollama - start it and pull the model**
```bash
ollama pull llama3.2:3b   
ollama serve
```

**2. Recommendation microservice (FastAPI)**
```bash
cd recommendation-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --port 8000
```

**3. Backend (Spring Boot)**
```bash
cd backend
mvn spring-boot:run       
```

**4. Frontend (React + Vite)**
```bash
cd frontend
npm install
npm run dev
```

**5. Open http://localhost:5173**

---

## Service Map

| Service | Port | Start command |
|---------|------|---------------|
| Frontend (Vite) | 5173 | `cd frontend && npm run dev` |
| Backend (Spring Boot) | 8080 | `cd backend && mvn spring-boot:run` |
| Recommendation service (FastAPI) | 8000 | `cd recommendation-service && uvicorn main:app --port 8000` |
| Ollama (LLM runtime) | 11434 | `ollama serve` |
| PostgreSQL | 5432 | — |

All four (backend, recommendation service, Ollama and PostgreSQL) must be running for the **For You** recommendations to work.

---

## How Recommendations Work

```
1. User picks his 5 favorite movies.
2. Backend calls TMDB /movie/{id}/recommendations for each favorite → candidate pool.
3. Candidates are filtered (must have a poster, rating ≥ 7/10, enough votes).
4. Backend POSTs favorites + ratings + candidates to the FastAPI service (/recommend).
5. A local LLM (Ollama via LangChain) ranks 5 picks, each with a reason.
6. Backend stores the 5 recommendations, the frontend renders them under "For You".
```

---

## Flow

```
Register / Login
   ↓
Browse / Search films  →  Film details
   ↓
Rate films  +  Add to Watchlist
   ↓
Pick exactly 5 Favorites
   ↓
Generate AI recommendations (For You)
```

---

## Views

| View | Description |
|------|-------------|
| Home | Hero + featured film, search, genre carousel, and your watchlist |
| Films | Search the catalogue or browse by genre; results ranked by rating |
| Movie Details | Backdrop, info, cast, genres, and favorite / watchlist / rate actions |
| Favorites | Your five favorites and progress toward unlocking recommendations |
| Watchlist | Films saved to watch later |
| For You | AI recommendations, each with a written reason |
| Profile | Avatar, stats, rating-distribution chart, top 5, and rating history |

---

## Team

- **Ognen Mladenovski** — 233108
- **Hristina Gjorgjievska** — 233215
- **Evica Isaevska** — 233245