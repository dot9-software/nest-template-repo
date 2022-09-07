export function filterNullValues(data: unknown) {
  return Object.fromEntries(Object.entries(data).filter(([, v]) => v != null));
}
