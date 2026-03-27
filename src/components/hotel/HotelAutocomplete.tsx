'use client';

import { useState, useEffect, useRef } from 'react';
import { useApollo } from '../../contexts/ApolloContext';
import { ADVANCED_HOTEL_AUTOCOMPLETE_QUERY, AdvancedHotelAutocompleteResponse } from '../../graphql/hotel';

interface HotelAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const HotelAutocomplete: React.FC<HotelAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "Search hotels by name, description, or location...",
  className = ""
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [lastSelectedValue, setLastSelectedValue] = useState('');
  
  const client = useApollo();

  const getSuggestions = async (query: string) => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const result = await client.query<AdvancedHotelAutocompleteResponse>({
        query: ADVANCED_HOTEL_AUTOCOMPLETE_QUERY,
        variables: { query: query.trim() }
      });
      setSuggestions(result.data?.advancedHotelAutocomplete || []);
      setHighlightedIndex(-1);
    } catch (error: any) {
      console.error('Autocomplete error:', error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Only show suggestions if value has changed since last selection
      if (value.trim().length >= 2 && value !== lastSelectedValue) {
        getSuggestions(value.trim());
        setIsOpen(true);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [value, lastSelectedValue]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    // Reset the last selected value when user types
    if (newValue !== lastSelectedValue) {
      setLastSelectedValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          selectSuggestion(suggestions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const selectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setLastSelectedValue(suggestion);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  const handleBlur = () => {
    setTimeout(() => setIsOpen(false), 200);
  };

  const handleFocus = () => {
    if (value.trim().length >= 2 && suggestions.length > 0 && value !== lastSelectedValue) {
      setIsOpen(true);
    }
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500 ${className}`}
      />
      
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {isOpen && suggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`px-4 py-2 cursor-pointer transition-colors ${
                index === highlightedIndex
                  ? 'bg-blue-100 text-blue-900'
                  : 'hover:bg-gray-100 text-gray-900'
              }`}
              onClick={() => selectSuggestion(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HotelAutocomplete;
