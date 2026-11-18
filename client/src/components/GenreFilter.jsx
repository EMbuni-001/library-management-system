
function GenreFilter({ value, onChange }) {
  return (
    <select
      id="genre-filter"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 transition-colors duration-200 hover:border-teal-400 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:border-teal-500 dark:focus:ring-teal-800"
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