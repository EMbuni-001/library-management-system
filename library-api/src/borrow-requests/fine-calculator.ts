
// A pure function: given the same inputs, it always returns the same output.
// It has no dependencies on Prisma, NestJS, or the database.
export function calculateFine(
  dueDate: Date,
  returnDate: Date,
  ratePerDay: number = 10,
): number {
  const diffTime = returnDate.getTime() - dueDate.getTime();
  const daysLate = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  return daysLate * ratePerDay;
}