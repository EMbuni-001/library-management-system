
// Calculates password strength based on multiple criteria.
// Returns a score from 0-4 and a label.
function calculateStrength(password) {
  if (!password) {
    return { score: 0, label: '', color: '' };
  }

  let score = 0;

  // Length criteria
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // Character variety criteria
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Cap at 4 for display purposes
  const normalizedScore = Math.min(score, 4);

  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-lime-500',
    'bg-emerald-500',
  ];

  return {
    score: normalizedScore,
    label: labels[normalizedScore],
    color: colors[normalizedScore],
  };
}

function PasswordStrengthIndicator({ password }) {
  const { score, label, color } = calculateStrength(password);

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2" aria-live="polite">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              index < score ? color : 'bg-slate-200 dark:bg-slate-700'
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-400">
        Password strength: <span className="font-medium">{label}</span>
      </p>
    </div>
  );
}

export default PasswordStrengthIndicator;