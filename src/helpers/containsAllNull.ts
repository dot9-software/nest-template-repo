/**
 * Checks whether all the values in an object are nullish
 * @returns true iff the given object is falsy or all values of the object are nullish
 */
export default function containsAllNull(obj: unknown) {
  if (!obj) return true;
  return Object.values(obj).every((o) => o == null);
}
