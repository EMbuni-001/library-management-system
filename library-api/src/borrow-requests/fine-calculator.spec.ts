
import { calculateFine } from './fine-calculator';

describe('calculateFine', () => {
  it('returns 0 when returned on time', () => {
    const due = new Date('2026-01-10T00:00:00Z');
    const returned = new Date('2026-01-10T00:00:00Z');
    expect(calculateFine(due, returned)).toBe(0);
  });

  it('returns 0 when returned early', () => {
    const due = new Date('2026-01-15T00:00:00Z');
    const returned = new Date('2026-01-10T00:00:00Z');
    expect(calculateFine(due, returned)).toBe(0);
  });

  it('charges for each day late', () => {
    const due = new Date('2026-01-10T00:00:00Z');
    const returned = new Date('2026-01-13T00:00:00Z');
    // 3 days late * 10 per day = 30
    expect(calculateFine(due, returned)).toBe(30);
  });

  it('allows custom rate per day', () => {
    const due = new Date('2026-01-10T00:00:00Z');
    const returned = new Date('2026-01-12T00:00:00Z');
    // 2 days late * 5 per day = 10
    expect(calculateFine(due, returned, 5)).toBe(10);
  });
});