/**
 * Hitung status event berdasarkan waktu
 * - sensitif jam, menit, detik
 * - pakai waktu server
 */
export function getEventStatus(startAt, endAt) {
  const now = new Date();
  const start = new Date(startAt);
  const end = endAt ? new Date(endAt) : null;

  // BELUM MULAI
  if (now < start) return "UPCOMING";

  // ADA endAt → rentang waktu jelas
  if (end) {
    if (now >= start && now <= end) return "ONGOING";
    return "FINISHED";
  }

  // TANPA endAt → hanya berlaku di hari & jam start
  const endOfStartDay = new Date(start);
  endOfStartDay.setHours(23, 59, 59, 999);

  if (now <= endOfStartDay) return "ONGOING";
  return "FINISHED";
}
