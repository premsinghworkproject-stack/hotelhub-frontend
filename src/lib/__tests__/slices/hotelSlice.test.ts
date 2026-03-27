import { describe, it, expect, beforeEach } from 'vitest';
import hotelReducer, {
  searchHotels,
  getHotels,
  getHotelCount,
  setSearchFilters,
  resetHotels,
  clearError,
  clearCurrentHotel,
} from '@/lib/slices/hotelSlice';
import { Hotel, MealPlan, PropertyType } from '@/graphql/hotel';

describe('hotelSlice reducer', () => {
  const mockHotel: Hotel = {
    id: 1,
    name: 'Test Hotel',
    address: '123 Test St',
    city: 'Test City',
    state: 'Test State',
    country: 'Test Country',
    postalCode: '12345',
    latitude: 40.7128,
    longitude: -74.0060,
    phone: '+1-555-0123',
    email: 'test@example.com',
    website: 'https://example.com',
    description: 'A test hotel',
    mealPlan: MealPlan.BREAKFAST_ONLY,
    propertyType: PropertyType.HOTEL,
    checkInTime: '15:00',
    checkOutTime: '11:00',
    cancellationPolicy: '24 hours',
    petPolicy: 'Pets allowed',
    parkingInfo: 'Free parking',
    isActive: true,
    isVerified: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  const initialState = {
    hotels: [],
    currentHotel: null,
    totalCount: 0,
    isLoading: false,
    error: null,
    hasMore: true,
    currentPage: 1,
    searchFilters: {
      limit: 10,
      offset: 0,
    },
  };

  beforeEach(() => {
    // Reset to initial state before each test
  });

  it('should return initial state', () => {
    const state = hotelReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  });

  describe('setHotels action', () => {
    it('should set hotels array', () => {
      const hotels = [mockHotel];
      const state = hotelReducer(initialState, setHotels(hotels));
      
      expect(state.hotels).toEqual(hotels);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(null);
    });
  });

  describe('appendHotels action', () => {
    it('should append hotels to existing array', () => {
      const existingHotels = [mockHotel];
      const newHotels = [{ ...mockHotel, id: 2 }];
      const stateWithHotels = {
        ...initialState,
        hotels: existingHotels,
      };
      
      const newState = hotelReducer(stateWithHotels, appendHotels(newHotels));
      
      expect(newState.hotels).toEqual([...existingHotels, ...newHotels]);
      expect(newState.isLoading).toBe(false);
      expect(newState.error).toBe(null);
    });

    it('should set hotels if array is empty', () => {
      const newHotels = [mockHotel];
      const state = hotelReducer(initialState, appendHotels(newHotels));
      
      expect(state.hotels).toEqual(newHotels);
    });
  });

  describe('setTotalCount action', () => {
    it('should set total count', () => {
      const count = 100;
      const state = hotelReducer(initialState, setTotalCount(count));
      
      expect(state.totalCount).toBe(count);
    });
  });

  describe('setHasMore action', () => {
    it('should set hasMore flag', () => {
      const state = hotelReducer(initialState, setHasMore(false));
      expect(state.hasMore).toBe(false);
      
      const state2 = hotelReducer(initialState, setHasMore(true));
      expect(state2.hasMore).toBe(true);
    });
  });

  describe('setCurrentPage action', () => {
    it('should set current page', () => {
      const page = 5;
      const state = hotelReducer(initialState, setCurrentPage(page));
      
      expect(state.currentPage).toBe(page);
    });
  });

  describe('setSearchFilters action', () => {
    it('should set search filters', () => {
      const filters = {
        searchQuery: 'test',
        city: 'Test City',
        limit: 20,
        offset: 10,
      };
      
      const state = hotelReducer(initialState, setSearchFilters(filters));
      expect(state.searchFilters).toEqual(filters);
    });
  });

  describe('resetHotels action', () => {
    it('should reset state to initial values', () => {
      const modifiedState = {
        ...initialState,
        hotels: [mockHotel],
        totalCount: 50,
        error: 'Some error',
        isLoading: true,
      };
      
      const state = hotelReducer(modifiedState, resetHotels());
      
      expect(state).toEqual(initialState);
    });
  });

  describe('clearError action', () => {
    it('should clear error message', () => {
      const stateWithError = {
        ...initialState,
        error: 'Something went wrong',
      };
      
      const state = hotelReducer(stateWithError, clearError());
      expect(state.error).toBe(null);
    });
  });

  describe('async thunks - searchHotels', () => {
    it('should handle pending state', () => {
      const state = hotelReducer(initialState, {
        type: 'hotels/searchHotels/pending',
      });
      
      expect(state.isLoading).toBe(true);
      expect(state.error).toBe(null);
    });

    it('should handle fulfilled state', () => {
      const hotels = [mockHotel];
      const state = hotelReducer(initialState, {
        type: 'hotels/searchHotels/fulfilled',
        payload: hotels,
      });
      
      expect(state.isLoading).toBe(false);
      expect(state.hotels).toEqual(hotels);
      expect(state.error).toBe(null);
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Failed to fetch hotels';
      const state = hotelReducer(initialState, {
        type: 'hotels/searchHotels/rejected',
        payload: errorMessage,
      });
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.hotels).toEqual([]);
    });
  });

  describe('async thunks - getHotelCount', () => {
    it('should handle pending state', () => {
      const state = hotelReducer(initialState, {
        type: 'hotels/getHotelCount/pending',
      });
      
      expect(state.isLoading).toBe(true);
    });

    it('should handle fulfilled state', () => {
      const count = 150;
      const state = hotelReducer(initialState, {
        type: 'hotels/getHotelCount/fulfilled',
        payload: count,
      });
      
      expect(state.isLoading).toBe(false);
      expect(state.totalCount).toBe(count);
    });

    it('should handle rejected state', () => {
      const errorMessage = 'Failed to get hotel count';
      const state = hotelReducer(initialState, {
        type: 'hotels/getHotelCount/rejected',
        payload: errorMessage,
      });
      
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('complex state transitions', () => {
    it('should handle multiple actions in sequence', () => {
      let state = hotelReducer(initialState, {
        type: 'hotels/searchHotels/pending',
      });
      
      expect(state.isLoading).toBe(true);
      
      state = hotelReducer(state, {
        type: 'hotels/searchHotels/fulfilled',
        payload: [mockHotel],
      });
      
      expect(state.isLoading).toBe(false);
      expect(state.hotels).toEqual([mockHotel]);
      
      state = hotelReducer(state, setTotalCount(100));
      expect(state.totalCount).toBe(100);
      
      state = hotelReducer(state, setSearchFilters({ city: 'New York' }));
      expect(state.searchFilters.city).toBe('New York');
    });
  });

  describe('state immutability', () => {
    it('should not mutate original state', () => {
      const originalState = { ...initialState };
      const newState = hotelReducer(originalState, setHotels([mockHotel]));
      
      expect(originalState).toEqual(initialState);
      expect(newState).not.toBe(originalState);
      expect(newState.hotels).not.toBe(originalState.hotels);
    });
  });
});
