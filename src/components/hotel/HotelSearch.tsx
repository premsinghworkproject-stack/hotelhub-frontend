'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../lib/store';
import { 
  searchHotels,
  getHotelCount,
  setSearchFilters,
  resetHotels,
  clearError
} from '../../lib/slices/hotelSlice';
import { 
  SearchHotelsInput,
  Hotel,
  MealPlan,
  PropertyType
} from '../../graphql/hotel';
import { showSuccessToast, showErrorToast } from '../../lib/toast';
import HotelAutocomplete from './HotelAutocomplete';

const HotelSearch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    hotels, 
    totalCount, 
    isLoading, 
    error, 
    hasMore, 
    searchFilters 
  } = useSelector((state: RootState) => state.hotel);

  // Local state for form inputs
  const [localFilters, setLocalFilters] = useState<SearchHotelsInput>({
    searchQuery: '',
    city: '',
    state: '',
    country: '',
    minRating: undefined,
    maxRating: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    mealPlan: undefined,
    propertyType: undefined,
    amenities: [],
    adults: undefined,
    children: undefined,
    checkInDate: undefined,
    checkOutDate: undefined,
    limit: 10,
    offset: 0
  });

  // Load hotel count and initial hotels on component mount
  useEffect(() => {
    dispatch(getHotelCount());
    // Load initial hotels with default empty filters
    dispatch(searchHotels({ limit: 10, offset: 0 }));
  }, [dispatch]);

  // Handle search
  const handleSearch = async (isAppend: boolean = false) => {
    try {
      const filters = isAppend 
        ? { ...searchFilters, offset: (searchFilters.offset || 0) + (searchFilters.limit || 10) }
        : { ...localFilters, offset: 0 };

      dispatch(setSearchFilters(filters));
      await dispatch(searchHotels(filters)).unwrap();
      
      if (!isAppend) {
        showSuccessToast(`Found hotels`);
      }
    } catch (error: any) {
      showErrorToast(error || 'Failed to search hotels');
    }
  };

  const handleFilterChange = (field: keyof SearchHotelsInput, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(false);
  };

  const loadMore = () => {
    if (!isLoading && hasMore) {
      handleSearch(true);
    }
  };

  const resetFilters = () => {
    const emptyFilters: SearchHotelsInput = {
      limit: 10,
      offset: 0
    };
    setLocalFilters(emptyFilters);
    dispatch(setSearchFilters(emptyFilters));
    dispatch(resetHotels());
  };

  // Sample search functions
  const searchHotelsByLocation = async (city: string, state?: string) => {
    const filters: SearchHotelsInput = {
      city,
      state,
      limit: 10,
      offset: 0
    };
    
    setLocalFilters(filters);
    dispatch(setSearchFilters(filters));
    await dispatch(searchHotels(filters)).unwrap();
  };

  const searchHotelsByPriceRange = async (minPrice: number, maxPrice: number) => {
    const filters: SearchHotelsInput = {
      minPrice,
      maxPrice,
      limit: 10,
      offset: 0
    };
    
    setLocalFilters(filters);
    dispatch(setSearchFilters(filters));
    await dispatch(searchHotels(filters)).unwrap();
  };

  const searchHotelsByPropertyType = async (propertyType: PropertyType) => {
    const filters: SearchHotelsInput = {
      propertyType,
      limit: 10,
      offset: 0
    };
    
    setLocalFilters(filters);
    dispatch(setSearchFilters(filters));
    await dispatch(searchHotels(filters)).unwrap();
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Your Perfect Hotel</h1>
      
      {/* Search Form - Now at the top */}
      <form onSubmit={handleSearchSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          
          {/* Search Query */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search (Name, Description, City, State, Country)
            </label>
            <HotelAutocomplete
              value={localFilters.searchQuery || ''}
              onChange={(value) => handleFilterChange('searchQuery', value)}
              placeholder="Search hotels by name, description, or location..."
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Price
            </label>
            <input
              type="number"
              value={localFilters.minPrice || ''}
              onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="50"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price
            </label>
            <input
              type="number"
              value={localFilters.maxPrice || ''}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="500"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <select
              value={localFilters.propertyType || ''}
              onChange={(e) => handleFilterChange('propertyType', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">All Types</option>
              {Object.values(PropertyType).map(type => (
                <option key={type} value={type}>{type.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          {/* Meal Plan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal Plan
            </label>
            <select
              value={localFilters.mealPlan || ''}
              onChange={(e) => handleFilterChange('mealPlan', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              <option value="">All Plans</option>
              {Object.values(MealPlan).map(plan => (
                <option key={plan} value={plan}>{plan.replace('_', ' ')}</option>
              ))}
            </select>
          </div>

          {/* Guests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adults
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={localFilters.adults || ''}
              onChange={(e) => handleFilterChange('adults', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Children
            </label>
            <input
              type="number"
              min="0"
              max="5"
              value={localFilters.children || ''}
              onChange={(e) => handleFilterChange('children', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Searching...' : 'Search Hotels'}
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Reset Filters
          </button>
        </div>
      </form>

      {/* Sample Search Buttons */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Search Examples</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => searchHotelsByLocation('New York')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            Hotels in New York
          </button>
          <button
            onClick={() => searchHotelsByPriceRange(100, 300)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            $100 - $300
          </button>
          <button
            onClick={() => searchHotelsByPropertyType(PropertyType.RESORT)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            Resorts Only
          </button>
          <button
            onClick={() => searchHotelsByPropertyType(PropertyType.HOTEL)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
          >
            Hotels Only
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Available Hotels</h2>
        <p className="text-gray-700">
          Showing {hotels.length} of {totalCount} hotels
        </p>
      </div>

      {/* Hotel List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {hotels.map((hotel: Hotel) => (
          <div key={hotel.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{hotel.name}</h3>
              <p className="text-gray-700 mb-2">{hotel.address}, {hotel.city}, {hotel.state}</p>
              <p className="text-gray-600 text-sm mb-4">{hotel.description?.substring(0, 100)}...</p>
              
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-600">
                  {hotel.propertyType?.replace('_', ' ')}
                </span>
                {hotel.isVerified && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Verified
                  </span>
                )}
              </div>

              <div className="flex justify-between items-center">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                  View Details
                </button>
                <span className="text-sm text-gray-600">
                  {hotel.mealPlan?.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Load More Hotels'}
          </button>
        </div>
      )}

      {/* No Results */}
      {!isLoading && hotels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No hotels found matching your criteria.</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">Error: {error}</p>
          <button
            onClick={() => dispatch(clearError())}
            className="mt-2 text-sm text-red-600 hover:text-red-800"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};

export default HotelSearch;
