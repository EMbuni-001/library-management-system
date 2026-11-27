
function AvailabilityIndicator({ availableCopies, totalCopies }) {
  const isAvailable = availableCopies > 0;
  const percentage = totalCopies > 0 ? (availableCopies / totalCopies) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <div
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
          isAvailable
            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        }`}
      >
        <span
          className={`inline-block h-1.5 w-1.5 rounded-full ${
            isAvailable ? 'bg-emerald-500' : 'bg-red-500'
          }`}
          aria-hidden="true"
        />
        {isAvailable ? 'Available' : 'Unavailable'}
      </div>
      {totalCopies > 0 && (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {availableCopies}/{totalCopies}
        </span>
      )}
    </div>
  );
}

export default AvailabilityIndicator;