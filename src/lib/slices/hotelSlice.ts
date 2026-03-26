import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  SEARCH_HOTELS_QUERY, 
  GET_HOTELS_QUERY, 
  GET_HOTEL_BY_ID_QUERY,
  GET_HOTEL_COUNT_QUERY,
  SEARCH_NEARBY_QUERY,
  SearchHotelsInput,
  GetHotelsInput,
  SearchNearbyInput,
  Hotel,
  PaginatedHotels
} from '../../graphql/hotel';
import { client } from '../apollo-client';

interface HotelState {
  hotels: Hotel[];
  currentHotel: Hotel | null;
  totalCount: number;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  searchFilters: SearchHotelsInput;
}

const initialState: HotelState = {
  hotels: [],
  currentHotel: null,
  totalCount: 0,
  isLoading: false,
  error: null,
  hasMore: true,
  currentPage: 1,
  searchFilters: {
    limit: 10,
    offset: 0
  }
};

// Async thunks
export const searchHotels = createAsyncThunk(
  'hotel/searchHotels',
  async (searchInput: SearchHotelsInput, { rejectWithValue }) => {
    try {
      const response = await client.query({
        query: SEARCH_HOTELS_QUERY,
        variables: { input: searchInput },
      });
      
      return {
        hotels: (response.data as any).searchHotels,
        isAppend: searchInput.offset && searchInput.offset > 0
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search hotels');
    }
  }
);

export const getHotels = createAsyncThunk(
  'hotel/getHotels',
  async (params: GetHotelsInput = { limit: 10, offset: 0 }, { rejectWithValue }) => {
    try {
      const response = await client.query({
        query: GET_HOTELS_QUERY,
        variables: params,
      });
      
      return {
        hotels: (response.data as any).hotels,
        isAppend: params.offset && params.offset > 0
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get hotels');
    }
  }
);

export const getHotelById = createAsyncThunk(
  'hotel/getHotelById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await client.query({
        query: GET_HOTEL_BY_ID_QUERY,
        variables: { id },
      });
      
      return (response.data as any).hotel;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get hotel');
    }
  }
);

export const getHotelCount = createAsyncThunk(
  'hotel/getHotelCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await client.query({
        query: GET_HOTEL_COUNT_QUERY,
      });
      
      return (response.data as any).hotelCount;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to get hotel count');
    }
  }
);

export const searchNearby = createAsyncThunk(
  'hotel/searchNearby',
  async (params: SearchNearbyInput, { rejectWithValue }) => {
    try {
      const response = await client.query({
        query: SEARCH_NEARBY_QUERY,
        variables: params,
      });
      
      return (response.data as any).searchNearby;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to search nearby hotels');
    }
  }
);

const hotelSlice = createSlice({
  name: 'hotel',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSearchFilters: (state, action: PayloadAction<SearchHotelsInput>) => {
      state.searchFilters = { ...action.payload };
    },
    resetHotels: (state) => {
      state.hotels = [];
      state.currentPage = 1;
      state.hasMore = true;
    },
    clearCurrentHotel: (state) => {
      state.currentHotel = null;
    },
  },
  extraReducers: (builder) => {
    // Search Hotels
    builder
      .addCase(searchHotels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        const { hotels, isAppend } = action.payload;
        
        if (isAppend) {
          state.hotels = [...state.hotels, ...hotels];
        } else {
          state.hotels = hotels;
        }
        
        // Update pagination info
        const currentCount = state.searchFilters.offset + hotels.length;
        state.hasMore = currentCount < state.totalCount;
      })
      .addCase(searchHotels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Hotels
    builder
      .addCase(getHotels.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getHotels.fulfilled, (state, action) => {
        state.isLoading = false;
        const { hotels, isAppend } = action.payload;
        
        if (isAppend) {
          state.hotels = [...state.hotels, ...hotels];
        } else {
          state.hotels = hotels;
        }
      })
      .addCase(getHotels.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Hotel By ID
    builder
      .addCase(getHotelById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getHotelById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentHotel = action.payload;
      })
      .addCase(getHotelById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Hotel Count
    builder
      .addCase(getHotelCount.fulfilled, (state, action) => {
        state.totalCount = action.payload;
      })
      .addCase(getHotelCount.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Search Nearby
    builder
      .addCase(searchNearby.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchNearby.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hotels = action.payload;
      })
      .addCase(searchNearby.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSearchFilters, resetHotels, clearCurrentHotel } = hotelSlice.actions;
export default hotelSlice.reducer;
