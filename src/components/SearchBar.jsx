export default function SearchBar({ value, onChange }) {
  return (
    <label className="search-box">
      <span className="search-icon" aria-hidden="true">
        ⌕
      </span>
      <span className="visually-hidden">Search movies</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by movie title..."
        autoComplete="off"
      />
      {value && (
        <button
          className="clear-search"
          type="button"
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </label>
  );
}
