import { useState } from "react";
import userApi from "../api/userApi";
import { getErrorMessage } from "../api/getErrorMessage";

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
                await userApi.register(username, email, password);
                setMode("login");
                setInfo("Registered, you can log in now.");
            } else {
                const res = await userApi.login(username, password);
                onLogin(res.data.token);
            }
        } catch (err) {
            setError(getErrorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                width: 400,
                maxWidth: "100%",
                background: "var(--bg-elevated)",
                border: "1px solid var(--accent)",
                borderRadius: 14,
                padding: 36,
                position: "relative",
            }}
        >
            {onClose && (
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        background: "none",
                        border: "none",
                        fontSize: 16,
                        color: "var(--text-muted)",
                    }}
                    aria-label="Close"
                >
                    ✕
                </button>
            )}

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
        <span className="brand" style={{ fontSize: 28, color: "var(--accent)", paddingBottom: 10 }}>
          <span className="brand-mark" style={{ width: 36, height: 36}}></span>
          Filmster
        </span>
            </div>

            <h2 style={{ fontSize: 20, marginBottom: 22, textAlign: "center", fontWeight: 600 }}>
                {mode === "login" ? "Welcome back" : "Create an account"}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ padding: "11px 13px", fontSize: 15 }}
                />
                {mode === "register" && (
                    <input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: "11px 13px", fontSize: 15 }}
                    />
                )}
                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ padding: "11px 13px", fontSize: 15 }}
                />
                <button type="submit" className="primary" disabled={loading} style={{ marginTop: 6, padding: "11px", fontSize: 15 }}>
                    {loading ? "..." : mode === "login" ? "Log in" : "Sign up"}
                </button>
            </form>

            {error && <p style={{ color: "var(--danger)", marginTop: 14, fontSize: 14, textAlign: "center" }}>{error}</p>}
            {info && <p style={{ color: "var(--accent)", marginTop: 14, fontSize: 14, textAlign: "center" }}>{info}</p>}

            <button
                style={{
                    marginTop: 18,
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    width: "100%",
                    fontSize: 14,
                }}
                onClick={() => {
                    setError(null);
                    setInfo(null);
                    setMode(mode === "login" ? "register" : "login");
                }}
            >
                {mode === "login" ? (
                    <>Need an account? <span style={{ color: "var(--accent)", fontWeight: 600 }}>Sign up</span></>
                ) : (
                    <>Have an account? <span style={{ color: "var(--accent)", fontWeight: 600 }}>Log in</span></>
                )}
            </button>
        </div>
    );
}