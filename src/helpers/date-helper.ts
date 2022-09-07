/**
 * Checks if two (correct) date ranges overlap by inverting the case of "they don't overlap"
 * @param s1 start of range 1
 * @param e1 end of range 1
 * @param s2 start of range 2
 * @param e2 end of range 2
 * @returns if the ranges overlap
 */
export function doRangesOverlap(
  s1: Date,
  e1: Date,
  s2: Date,
  e2: Date,
): boolean {
  return !(e1 <= s2 || e2 <= s1);
}

/**
 * Checks the correctness of a date range
 * @param s start of the range
 * @param e end of the range
 * @returns if the range is correct (s comes before e)
 */
export function isCorrectRange(s: Date, e: Date): boolean {
  return s <= e;
}
