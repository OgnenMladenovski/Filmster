interface Props {
  icon: string;
  title: string;
  text: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, text, actionLabel, onAction }: Props) {
  return (
    <div
      style={{
        border: "1px dashed var(--border)",
        borderRadius: 10,
        padding: "48px 24px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 40, marginBottom: 12 }}>{icon}</div>
      <h3 style={{ fontSize: 17, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: "var(--text-muted)", fontSize: 14, maxWidth: 380, margin: "0 auto 20px", lineHeight: 1.55 }}>
        {text}
      </p>
      {actionLabel && onAction && (
        <button className="primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
