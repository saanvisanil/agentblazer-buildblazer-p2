export default function EmptyState({ icon = "📭", title = "No items found", message = "Check back soon for updates.", action }) {
  return (
    <div className="mx-auto my-6 max-w-md rounded-2xl border border-line bg-surface p-8 text-center">
      <div className="text-3xl">{icon}</div>
      <h3 className="mt-3 font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-muted">{message}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
