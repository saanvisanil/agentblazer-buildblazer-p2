export default function ErrorState({ title = "Something went wrong", message = "Unable to load data right now.", onRetry }) {
  return (
    <div className="mx-auto my-6 max-w-md rounded-2xl border border-red-500/30 bg-red-950/20 p-6 text-center">
      <div className="text-2xl">⚠️</div>
      <h3 className="mt-2 font-display text-base font-semibold text-red-300">{title}</h3>
      <p className="mt-1 text-xs text-muted">{message}</p>
      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-4 rounded-card border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink hover:bg-surface-2"
        >
          [ Try Again ]
        </button>
      ) : null}
    </div>
  );
}
