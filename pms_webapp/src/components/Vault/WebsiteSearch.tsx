// src/components/Vault/WebsiteSearch.tsx
import React, { useState, useEffect } from 'react';
import { useVault } from '../../contexts/VaultContext';
import { FiSearch } from 'react-icons/fi';

const WebsiteSearch: React.FC = () => {
  const { setCurrentWebsite } = useVault();
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setCurrentWebsite(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, setCurrentWebsite]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentWebsite(searchTerm);
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a website (e.g., google.com)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default WebsiteSearch;