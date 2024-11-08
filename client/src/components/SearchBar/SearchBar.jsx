import React, { useState, useEffect } from 'react';

const fakeData = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Smith' },
  { id: 3, name: 'Alice Johnson' },
  { id: 4, name: 'Bob Brown' },
  { id: 5, name: 'Charlie Davis' },
  // Add more items as needed
];

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (query.length > 0) {
      const filteredResults = fakeData.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filteredResults);
      setShowDropdown(true);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [query]);

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleResultClick = (result) => {
    setQuery(result.name);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto bg-white rounded-full">
      <input
        placeholder="Search..."
        className="w-full h-16 py-2 pl-8 pr-32 bg-transparent border-2 border-gray-100 rounded-full shadow-md outline-none hover:outline-none focus:ring-teal-200 focus:border-teal-200"
        type="text"
        value={query}
        onChange={handleChange}
      />
      <button
        type="submit"
        className="absolute inline-flex items-center h-10 px-4 py-2 text-sm text-white transition duration-150 ease-in-out bg-teal-600 rounded-full outline-none right-3 top-3 sm:px-6 sm:text-base sm:font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
      >
        <svg
          className="-ml-0.5 sm:-ml-1 mr-2 w-4 h-4 sm:h-5 sm:w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        Search
      </button>
      {showDropdown && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
          {results.length > 0 ? (
            results.map((result) => (
              <li
                key={result.id}
                onClick={() => handleResultClick(result)}
                className="p-2 cursor-pointer hover:bg-gray-100"
              >
                {result.name}
              </li>
            ))
          ) : (
            <li className="p-2 text-gray-500">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
