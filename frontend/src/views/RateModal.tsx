import {useState} from "react";
import ratingApi from "../api/ratingApi";
import {getErrorMessage} from "../api/getErrorMessage";
import type {Movie} from "../types";

interface Props {
    token: string;
    movie: Movie;
    onClose: () => void;
    onRated: (score: number, review: string) => void;
    initialScore?: number;
    initialReview?: string;
    onRemoved?: () => void;
}

export function RateModal({movie, onClose, onRated, initialScore, initialReview, onRemoved}: Props) {
    const [score, setScore] = useState(initialScore ?? 0);
    const [hover, setHover] = useState<number | null>(null);
    const [review, setReview] = useState(initialReview ?? "");
    const [error, setError] = useState<string | null>(null);

    const display = hover ?? score;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        try {
            await ratingApi.rate(movie.tmdbId, score, review);
            onRated(score, review);
            onClose();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    async function handleRemove() {
        setError(null);
        try {
            await ratingApi.delete(movie.tmdbId);
            onRemoved?.();
            onClose();
        } catch (err) {
            setError(getErrorMessage(err));
        }
    }

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                padding: 16,
            }}
            onClick={onClose}
        >
            <form
                onSubmit={handleSubmit}
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "var(--bg-elevated)",
                    border: "1.5px solid var(--border)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                    padding: 32,
                    borderRadius: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                    width: "min(92vw, 520px)",
                    maxHeight: "90vh",
                    overflowY: "auto",
                }}
            >
                <h3 style={{fontSize: 22}}>Rate: <span style={{color: "var(--accent)"}}>{movie.title}</span></h3>

                <div
                    onMouseLeave={() => setHover(null)}
                    style={{display: "flex", gap: 8, justifyContent: "center", marginTop: 4}}
                >
                    {[1, 2, 3, 4, 5].map((i) => {
                        const pct = display >= i ? "100%" : display >= i - 0.5 ? "50%" : "0%";
                        return (
                            <div key={i} style={{position: "relative", width: 48, height: 48}}>
                                <svg width="48" height="48" viewBox="0 0 24 24"
                                     style={{display: "block", pointerEvents: "none"}}>
                                    <defs>
                                        <linearGradient id={`star-${i}`}>
                                            <stop offset={pct} stopColor="#f5c518"/>
                                            <stop offset={pct} stopColor="#454b57"/>
                                        </linearGradient>
                                    </defs>
                                    <path
                                        d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.784 1.401 8.166L12 18.897l-7.335 3.863 1.401-8.166L.132 9.21l8.2-1.192z"
                                        fill={`url(#star-${i})`}
                                    />
                                </svg>
                                <div
                                    onMouseEnter={() => setHover(i - 0.5)}
                                    onClick={() => setScore(i - 0.5)}
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 0,
                                        width: "50%",
                                        height: "100%",
                                        cursor: "pointer"
                                    }}
                                />
                                <div
                                    onMouseEnter={() => setHover(i)}
                                    onClick={() => setScore(i)}
                                    style={{
                                        position: "absolute",
                                        right: 0,
                                        top: 0,
                                        width: "50%",
                                        height: "100%",
                                        cursor: "pointer"
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
                <div style={{textAlign: "center", color: "var(--accent)", fontSize: 16, fontWeight: 700}}>
                    {display.toFixed(1)} / 5
                </div>

                <textarea
                    placeholder="Review (optional)"
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    maxLength={2000}
                    rows={6}
                />
                {error && <p style={{color: "var(--danger)", fontSize: 13}}>{error}</p>}
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <button type="submit" className="primary">
                        Submit
                    </button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                    {initialScore != null && onRemoved && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            style={{
                                marginLeft: "auto",
                                color: "var(--danger)",
                                background: "rgba(239, 83, 80, 0.12)",
                                border: "1px solid rgba(239, 83, 80, 0.35)",
                            }}
                        >
                            Remove rating
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}