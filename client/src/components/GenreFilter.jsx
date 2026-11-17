
function GenreFilter({ value, onChange }) {
  return (
    <select
      id="genre-filter"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-slate-100 transition-colors duration-200 hover:border-slate-400 dark:hover:border-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800"
    >
      <option value="">All genres</option>
      <option value="1">Fiction</option>
      <option value="2">Science Fiction</option>
      <option value="3">Mystery</option>
      <option value="4">Non-Fiction</option>
    </select>
  );
}

export default GenreFilter;