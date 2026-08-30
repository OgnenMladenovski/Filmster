import { useState } from "react";
import { Auth } from "./views/Auth";
import { Landing } from "./views/Landing";
import { Browse } from "./views/Browse";
import { Favorites } from "./views/Favorites";
import { Watchlist } from "./views/Watchlist";
import { Recommendations } from "./views/Recommendations";
import { MovieDetail } from "./views/MovieDetail";
import { Profile } from "./views/Profile";
import { Footer } from "./components/Footer";

type Tab = "home" | "browse" | "favorites" | "watchlist" | "recommendations" | "profile";

const PROTECTED_TABS: Tab[] = ["favorites", "watchlist", "recommendations", "profile"];

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [tab, setTab] = useState<Tab>("home");
  const [openMovieId, setOpenMovieId] = useState<number | null>(null);
  const [browseQuery, setBrowseQuery] = useState<string | undefined>(undefined);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingTab, setPendingTab] = useState<Tab | null>(null);

  function handleLogin(newToken: string) {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setAuthOpen(false);
    if (pendingTab) {
      setTab(pendingTab);
      setPendingTab(null);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    if (PROTECTED_TABS.includes(tab)) setTab("home");
  }

  function requireAuth() {
    setAuthOpen(true);
  }

  function selectTab(key: Tab) {
    if (PROTECTED_TABS.includes(key) && !token) {
      setPendingTab(key);
      setAuthOpen(true);
      return;
    }
    setOpenMovieId(null);
    setBrowseQuery(undefined);
    setTab(key);
  }

  function handleLandingSearch(query: string) {
    setBrowseQuery(query);
    setOpenMovieId(null);
    setTab("browse");
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "home", label: "Home" },
    { key: "browse", label: "Films" },
    { key: "favorites", label: "Favorites" },
    { key: "watchlist", label: "Watchlist" },
    { key: "recommendations", label: "For You" },
  ];

  return (
    <div>
      <header className="site-header">
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "clamp(14px, 4vw, 34px)", minWidth: 0 }}>
            <span style={{ color: "var(--accent)" }} className="brand" onClick={() => selectTab("home")}>
                <span className="brand-mark" onClick={() => selectTab("home")}></span>
              Filmster
            </span>
            <nav
              style={{
                display: "flex",
                gap: "clamp(12px, 3vw, 26px)",
                overflowX: "auto",
                whiteSpace: "nowrap",
              }}
            >
              {tabs.map((t) => (
                <button
                  key={t.key}
                  onClick={() => selectTab(t.key)}
                  className={`nav-link ${tab === t.key && openMovieId === null ? "active" : ""}`}
                >
                  {PROTECTED_TABS.includes(t.key) && !token ? "🔒 " : ""}
                  {t.label}
                </button>
              ))}
            </nav>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
            {token ? (
              <>
                <button
                  onClick={() => selectTab("profile")}
                  className={`icon-button ${tab === "profile" && openMovieId === null ? "active" : ""}`}
                  title="Profile"
                >
                  👤
                </button>
                <button onClick={handleLogout} style={{ padding: "6px 12px", fontSize: 13 }}>
                  Log out
                </button>
              </>
            ) : (
              <button className="primary" onClick={() => setAuthOpen(true)} style={{ padding: "7px 16px", fontSize: 13.5 }}>
                Log in
              </button>
            )}
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "clamp(16px, 4vw, 32px) clamp(12px, 4vw, 24px)" }}>
        {openMovieId !== null ? (
          <MovieDetail
            token={token}
            tmdbId={openMovieId}
            onBack={() => setOpenMovieId(null)}
            onRequireAuth={requireAuth}
            onOpenMovie={setOpenMovieId}
          />
        ) : (
          <>
            {tab === "home" && (
              <Landing
                token={token}
                onOpenMovie={setOpenMovieId}
                onSearch={handleLandingSearch}
                onGoToFavorites={() => selectTab("favorites")}
                onRequireAuth={requireAuth}
              />
            )}
            {tab === "browse" && (
              <Browse
                token={token}
                onOpenMovie={setOpenMovieId}
                initialQuery={browseQuery}
                onRequireAuth={requireAuth}
                onSearched={setBrowseQuery}
              />
            )}
            {tab === "favorites" && token && (
              <Favorites token={token} onOpenMovie={setOpenMovieId} onGoToBrowse={() => selectTab("browse")} />
            )}
            {tab === "watchlist" && token && (
              <Watchlist token={token} onOpenMovie={setOpenMovieId} onGoToBrowse={() => selectTab("browse")} />
            )}
            {tab === "recommendations" && token && (
              <Recommendations
                token={token}
                onOpenMovie={setOpenMovieId}
                onGoToFavorites={() => selectTab("favorites")}
              />
            )}
            {tab === "profile" && token && (
              <Profile token={token} onOpenMovie={setOpenMovieId} onGoToBrowse={() => selectTab("browse")} />
            )}
          </>
        )}
      </main>
      <Footer />

      {authOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
          }}
          onClick={() => {
            setAuthOpen(false);
            setPendingTab(null);
          }}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Auth
              onLogin={handleLogin}
              onClose={() => {
                setAuthOpen(false);
                setPendingTab(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
