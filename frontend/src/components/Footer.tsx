export function Footer() {
  return (
    <footer
      style={{
        borderTop: "1.5px solid var(--border)",
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
          justifyContent: "center",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span>
            <span className="brand-mark"></span><span style={{padding: 10}}><span style={{ color: "var(--accent)" }}>Filmster</span> is your app to track films, rate what you watch and discover what's next.</span>
        </span>
      </div>
    </footer>
  );
}
