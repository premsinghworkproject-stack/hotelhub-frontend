'use client';

import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../lib/store';
import { searchHotels } from '../../lib/slices/hotelSlice';
import { SearchHotelsInput, PropertyType } from '../../graphql/hotel';

/**
 * Sample component demonstrating how to use hotel search functionality
 * This shows different ways to call the search hotels query
 */
const HotelSearchExample = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Example 1: Basic search with pagination
  const handleBasicSearch = async () => {
    const searchParams: SearchHotelsInput = {
      limit: 10,
      offset: 0
    };
    
    try {
      const result = await dispatch(searchHotels(searchParams)).unwrap();
      console.log('Basic search result:', result);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Example 2: Search by location
  const handleLocationSearch = async () => {
    const searchParams: SearchHotelsInput = {
      city: 'New York',
      state: 'NY',
      limit: 10,
      offset: 0
    };
    
    try {
      const result = await dispatch(searchHotels(searchParams)).unwrap();
      console.log('Location search result:', result);
    } catch (error) {
      console.error('Location search failed:', error);
    }
  };

  // Example 3: Search by price range
  const handlePriceRangeSearch = async () => {
    const searchParams: SearchHotelsInput = {
      minPrice: 100,
      maxPrice: 300,
      limit: 10,
      offset: 0
    };
    
    try {
      const result = await dispatch(searchHotels(searchParams)).unwrap();
      console.log('Price range search result:', result);
    } catch (error) {
      console.error('Price range search failed:', error);
    }
  };

  // Example 4: Search by property type
  const handlePropertyTypeSearch = async () => {
    const searchParams: SearchHotelsInput = {
      propertyType: PropertyType.RESORT,
      limit: 10,
      offset: 0
    };
    
    try {
      const result = await dispatch(searchHotels(searchParams)).unwrap();
      console.log('Property type search result:', result);
    } catch (error) {
      console.error('Property type search failed:', error);
    }
  };

  // Example 5: Complex search with multiple filters
  const handleComplexSearch = async () => {
    const searchParams: SearchHotelsInput = {
      searchQuery: 'luxury',
      city: 'Miami',
      state: 'FL',
      minPrice: 200,
      maxPrice: 500,
      adults: 2,
      children: 1,
      limit: 10,
      offset: 0
    };
    
    try {
      const result = await dispatch(searchHotels(searchParams)).unwrap();
      console.log('Complex search result:', result);
    } catch (error) {
      console.error('Complex search failed:', error);
    }
  };

  // Example 6: Pagination - Load next page
  const handleLoadNextPage = async (currentOffset: number) => {
    const searchParams: SearchHotelsInput = {
      limit: 10,
      offset: currentOffset + 10 // Load next 10 items
    };
    
    try {
      const result = await dispatch(searchHotels(searchParams)).unwrap();
      console.log('Next page result:', result);
    } catch (error) {
      console.error('Pagination failed:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Hotel Search Examples</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Basic Search</h3>
          <p className="text-gray-600 mb-4">Get all hotels with default pagination</p>
          <button
            onClick={handleBasicSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search All Hotels
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Location Search</h3>
          <p className="text-gray-600 mb-4">Find hotels in New York, NY</p>
          <button
            onClick={handleLocationSearch}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Search NYC Hotels
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Price Range</h3>
          <p className="text-gray-600 mb-4">Hotels between $100-$300</p>
          <button
            onClick={handlePriceRangeSearch}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Search by Price
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Property Type</h3>
          <p className="text-gray-600 mb-4">Find resorts only</p>
          <button
            onClick={handlePropertyTypeSearch}
            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Search Resorts
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Complex Search</h3>
          <p className="text-gray-600 mb-4">Multiple filters: luxury hotels in Miami for 2 adults + 1 child, $200-$500</p>
          <button
            onClick={handleComplexSearch}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Complex Search
          </button>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">GraphQL Query Examples</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Basic Search Query:</h4>
            <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
{`query SearchHotels($input: SearchHotelsInput!) {
  searchHotels(input: $input) {
    id
    name
    address
    city
    state
    country
    description
    propertyType
    mealPlan
    isActive
    isVerified
  }
}

// Variables:
{
  "input": {
    "limit": 10,
    "offset": 0
  }
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Location Search Query:</h4>
            <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
{`query SearchHotels($input: SearchHotelsInput!) {
  searchHotels(input: $input) {
    id
    name
    address
    city
    state
    country
  }
}

// Variables:
{
  "input": {
    "city": "New York",
    "state": "NY",
    "limit": 10,
    "offset": 0
  }
}`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 mb-2">Price Range Query:</h4>
            <pre className="bg-gray-800 text-white p-4 rounded text-sm overflow-x-auto">
{`query SearchHotels($input: SearchHotelsInput!) {
  searchHotels(input: $input) {
    id
    name
    address
    city
    state
    country
    description
  }
}

// Variables:
{
  "input": {
    "minPrice": 100,
    "maxPrice": 300,
    "limit": 10,
    "offset": 0
  }
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelSearchExample;
