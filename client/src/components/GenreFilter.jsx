
function GenreFilter({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    >
      <option value="">All Genres</option>
      <option value="1">Fiction</option>
      <option value="2">Science Fiction</option>
      <option value="3">Mystery</option>
      <option value="4">Non-Fiction</option>
    </select>
  );
}

export default GenreFilter;