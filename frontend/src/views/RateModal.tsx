import { useState } from "react";
import { api, ApiError } from "../api";
import type { Movie } from "../types";

interface Props {
  token: string;
  movie: Movie;
  onClose: () => void;
  onRated: (score: number, review: string) => void;
}

export function RateModal({ token, movie, onClose, onRated }: Props) {
  const [score, setScore] = useState("5.0");
  const [review, setReview] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const parsed = parseFloat(score);
      await api.rate(token, movie.tmdbId, parsed, review);
      onRated(parsed, review);
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
      }}
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          padding: 24,
          borderRadius: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          width: 320,
        }}
      >
        <h3>Rate: {movie.title}</h3>
        <label style={{ fontSize: 13, color: "var(--text-muted)", display: "flex", flexDirection: "column", gap: 4 }}>
          Score
          <select value={score} onChange={(e) => setScore(e.target.value)}>
            {[0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((v) => (
              <option key={v} value={v}>
                {"★".repeat(Math.floor(v))}
                {v % 1 !== 0 ? "½" : ""} ({v.toFixed(1)})
              </option>
            ))}
          </select>
        </label>
        <textarea
          placeholder="Review (optional)"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          maxLength={2000}
          rows={4}
        />
        {error && <p style={{ color: "var(--danger)", fontSize: 13 }}>{error}</p>}
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="primary">
            Submit
          </button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
