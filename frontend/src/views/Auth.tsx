import { useState } from "react";
import { api, ApiError } from "../api";

interface Props {
  onLogin: (token: string) => void;
  onClose?: () => void;
}

export function Auth({ onLogin, onClose }: Props) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (mode === "register") {
        await api.register(username, email, password);
        setMode("login");
        setInfo("Registered — you can log in now.");
      } else {
        const { token } = await api.login(username, password);
        onLogin(token);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        width: 340,
        maxWidth: "100%",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: 32,
        position: "relative",
      }}
    >
      {onClose && (
        <button
          onClick={onClose}
          style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", fontSize: 16 }}
          aria-label="Close"
        >
          ✕
        </button>
      )}

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <span style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>
          🎬 <span style={{ color: "var(--accent)" }}>Reel</span>ist
        </span>
      </div>

      <h2 style={{ fontSize: 18, marginBottom: 16, textAlign: "center" }}>
        {mode === "login" ? "Welcome back" : "Create an account"}
      </h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        {mode === "register" && (
          <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        )}
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="primary" disabled={loading} style={{ marginTop: 6 }}>
          {loading ? "..." : mode === "login" ? "Log in" : "Sign up"}
        </button>
      </form>

      {error && <p style={{ color: "var(--danger)", marginTop: 12, fontSize: 14 }}>{error}</p>}
      {info && <p style={{ color: "var(--accent)", marginTop: 12, fontSize: 14 }}>{info}</p>}

      <button
        style={{
          marginTop: 16,
          background: "none",
          border: "none",
          color: "var(--text-muted)",
          width: "100%",
        }}
        onClick={() => {
          setError(null);
          setInfo(null);
          setMode(mode === "login" ? "register" : "login");
        }}
      >
        {mode === "login" ? "Need an account? Sign up" : "Have an account? Log in"}
      </button>
    </div>
  );
}
