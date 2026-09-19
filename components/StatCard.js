export default function StatCard({ value, label, tag }) {
  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <p className="font-display text-2xl font-semibold gradient-text">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
      {tag ? (
        <span className="mt-2 inline-block rounded-full bg-accent-soft px-2.5 py-0.5 text-xs text-accent">
          {tag}
        </span>
      ) : null}
    </div>
  );
}
