import React, { useState } from 'react';
import Icon from '../ui/Icon';

const SearchBar = ({ onSearch, onSelectResult }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);

  const mockResults = [
    { id: 1, name: 'Insurgentes', type: 'metro', iconName: 'metro' },
    { id: 2, name: 'Reforma 222', type: 'lugar', iconName: 'location' },
    { id: 3, name: 'Chapultepec', type: 'parque', iconName: 'location' },
  ];

  const handleSearch = (value) => {
    setQuery(value);
    if (value.length > 0) {
      setIsOpen(true);
      setResults(mockResults);
    } else {
      setIsOpen(false);
      setResults([]);
    }
    onSearch(value);
  };

  const handleSelect = (result) => {
    setQuery(result.name);
    setIsOpen(false);
    onSelectResult(result);
  };

  return (
    <div className="relative">
      <div className="bg-white rounded-full shadow-lg flex items-center px-4 py-3">
        <Icon name="search" size={20} className="text-neutralDark mr-3" />
        <input
          type="text"
          placeholder="Buscar destino..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          className="flex-1 outline-none text-secondary"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              setResults([]);
            }}
            className="text-neutralDark hover:text-secondary"
          >
            <Icon name="close" size={20} />
          </button>
        )}
      </div>

      {/* Search Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-10">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleSelect(result)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral transition-colors text-left"
            >
              <Icon name={result.iconName} size={24} className="text-primary" />
              <div>
                <p className="font-medium text-secondary">{result.name}</p>
                <p className="text-sm text-neutralDark capitalize">{result.type}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
