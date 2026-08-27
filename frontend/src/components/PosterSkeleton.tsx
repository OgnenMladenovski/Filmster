export function PosterSkeleton({
  count = 6,
  width = 140,
  grid = false,
}: {
  count?: number;
  width?: number;
  grid?: boolean;
}) {
  return (
    <div className={grid ? "poster-grid" : undefined} style={grid ? undefined : { display: "flex", gap: 16, overflow: "hidden" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={grid ? undefined : { flexShrink: 0, width }}>
          <div
            className="skeleton"
            style={{ aspectRatio: "2 / 3", borderRadius: 6, marginBottom: 8 }}
          />
          <div className="skeleton" style={{ height: 12, borderRadius: 4, width: "80%", marginBottom: 6 }} />
          <div className="skeleton" style={{ height: 10, borderRadius: 4, width: "40%" }} />
        </div>
      ))}
    </div>
  );
}
