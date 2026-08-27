export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        marginTop: 48,
        padding: "28px 24px",
        color: "var(--text-faint)",
        fontSize: 13,
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span>
          🎬 <span style={{ color: "var(--accent)", fontWeight: 700 }}>Reel</span>ist — track films, rate what you
          watch, discover what's next.
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </span>
      </div>
    </footer>
  );
}
