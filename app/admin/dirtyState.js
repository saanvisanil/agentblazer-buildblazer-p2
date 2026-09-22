export function hasUnsavedChanges(before, after) {
  if (before === after) return false;
  if (before === null || after === null) return before !== after;
  if (typeof before !== "object" || typeof after !== "object") return before !== after;
  return JSON.stringify(before) !== JSON.stringify(after);
}
