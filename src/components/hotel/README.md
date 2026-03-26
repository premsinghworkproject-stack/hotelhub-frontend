# Hotel Search Implementation

This directory contains the complete hotel search functionality for the frontend, including GraphQL queries, Redux state management, and React components.

## 📁 Files Overview

- `hotel.ts` - GraphQL queries and TypeScript interfaces
- `HotelSearch.tsx` - Main hotel search component with full UI
- `HotelSearchExample.tsx` - Usage examples and sample implementations
- `README.md` - This documentation file

## 🚀 Features

### ✅ Available Search Filters
All search filters are **optional** as requested:

- **Text Search**: Full-text search across name, description, address
- **Location**: City, State, Country
- **Price Range**: Min/Max price filtering
- **Property Type**: Hotel, Resort, Guest House, Apartment, Villa
- **Meal Plan**: Various meal plan options
- **Guest Count**: Adults and children
- **Date Range**: Check-in and check-out dates
- **Amenities**: Required amenities (array)
- **Rating**: Min/Max rating range

### 📄 Pagination
- **Default**: 10 items per page
- **Configurable**: Custom limit and offset
- **Load More**: Progressive loading with "Load More" button
- **Total Count**: Shows total available hotels

## 🔧 Usage Examples

### Basic Search
```typescript
import { useDispatch } from 'react-redux';
import { searchHotels } from '../../lib/slices/hotelSlice';
import { SearchHotelsInput } from '../../graphql/hotel';

const dispatch = useDispatch();

// Basic search with pagination
const searchParams: SearchHotelsInput = {
  limit: 10,
  offset: 0
};

const result = await dispatch(searchHotels(searchParams)).unwrap();
```

### Location Search
```typescript
const searchParams: SearchHotelsInput = {
  city: 'New York',
  state: 'NY',
  limit: 10,
  offset: 0
};

const result = await dispatch(searchHotels(searchParams)).unwrap();
```

### Price Range Search
```typescript
const searchParams: SearchHotelsInput = {
  minPrice: 100,
  maxPrice: 300,
  limit: 10,
  offset: 0
};

const result = await dispatch(searchHotels(searchParams)).unwrap();
```

### Complex Search
```typescript
const searchParams: SearchHotelsInput = {
  searchQuery: 'luxury',
  city: 'Miami',
  state: 'FL',
  minPrice: 200,
  maxPrice: 500,
  adults: 2,
  children: 1,
  propertyType: PropertyType.RESORT,
  limit: 10,
  offset: 0
};

const result = await dispatch(searchHotels(searchParams)).unwrap();
```

### Pagination
```typescript
// First page
const firstPage: SearchHotelsInput = {
  limit: 10,
  offset: 0
};

// Second page
const secondPage: SearchHotelsInput = {
  limit: 10,
  offset: 10
};

// Third page
const thirdPage: SearchHotelsInput = {
  limit: 10,
  offset: 20
};
```

## 📊 GraphQL Queries

### Search Hotels
```graphql
query SearchHotels($input: SearchHotelsInput!) {
  searchHotels(input: $input) {
    id
    name
    address
    city
    state
    country
    postalCode
    latitude
    longitude
    phone
    email
    website
    description
    mealPlan
    propertyType
    checkInTime
    checkOutTime
    cancellationPolicy
    petPolicy
    parkingInfo
    isActive
    isVerified
    createdAt
    updatedAt
  }
}
```

### Get Hotel Count
```graphql
query GetHotelCount {
  hotelCount
}
```

## 🎯 Component Props

### HotelSearch Component
The main `HotelSearch` component is self-contained and includes:

- **Search Form**: Complete filter interface
- **Results Display**: Grid layout with hotel cards
- **Pagination**: Load more functionality
- **Quick Search**: Pre-configured search buttons
- **Error Handling**: User-friendly error messages

### Usage
```tsx
import HotelSearch from './HotelSearch';

function App() {
  return (
    <div>
      <HotelSearch />
    </div>
  );
}
```

## 🔄 Redux State Management

### Hotel Slice State
```typescript
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
```

### Available Actions
- `searchHotels` - Search hotels with filters
- `getHotels` - Get all hotels with pagination
- `getHotelById` - Get specific hotel by ID
- `getHotelCount` - Get total hotel count
- `searchNearby` - Search hotels by location
- `setSearchFilters` - Update search filters
- `resetHotels` - Clear hotel results
- `clearError` - Clear error state

## 🎨 UI Features

### Search Form
- **Responsive Design**: Works on desktop and mobile
- **Real-time Validation**: Input validation as you type
- **Clear Filters**: Reset all filters with one click
- **Quick Search**: Pre-configured search buttons

### Results Display
- **Hotel Cards**: Clean, modern card design
- **Property Type Badge**: Visual property type indicator
- **Verification Badge**: Shows verified status
- **Meal Plan Display**: Shows available meal plans
- **Hover Effects**: Interactive card hover states

### Pagination
- **Load More Button**: Progressive loading
- **Result Count**: Shows current/total results
- **Loading States**: Visual feedback during search
- **No Results**: Friendly message when no hotels found

## 🛠️ Technical Implementation

### TypeScript Support
- **Full Type Safety**: All interfaces properly typed
- **Enum Support**: PropertyType and MealPlan enums
- **Generic Types**: Reusable type definitions
- **Error Handling**: Proper error types

### Performance Optimizations
- **Lazy Loading**: Only load data when needed
- **Pagination**: Prevents loading all data at once
- **Memoization**: Efficient Redux state updates
- **Debouncing**: Prevents excessive API calls

### Error Handling
- **User-Friendly Messages**: Clear error descriptions
- **Toast Notifications**: Success and error feedback
- **Retry Logic**: Easy retry on failure
- **Validation**: Client-side input validation

## 📱 Mobile Responsive

The search interface is fully responsive:

- **Desktop**: 3-column grid layout
- **Tablet**: 2-column grid layout
- **Mobile**: Single column layout
- **Touch-Friendly**: Large tap targets
- **Adaptive UI**: Responsive form fields

## 🔍 Search Capabilities

### Full-Text Search
Search across multiple fields:
- Hotel name
- Description
- Address
- City
- State

### Filter Combinations
All filters can be combined:
- Location + Price + Property Type
- Date Range + Guest Count + Amenities
- Any combination of available filters

### Sorting Options
The backend supports sorting by:
- Price (low to high, high to low)
- Rating
- Name
- Distance (for location-based search)

## 🎯 Best Practices

### Search Performance
- Use pagination for large datasets
- Implement debouncing for text inputs
- Cache frequently used searches
- Optimize GraphQL queries

### User Experience
- Show loading states
- Provide clear feedback
- Handle empty states gracefully
- Make filters easily accessible

### Code Quality
- Use TypeScript for type safety
- Implement proper error handling
- Follow consistent naming conventions
- Document complex logic

## 🚀 Getting Started

1. **Import the component**:
   ```tsx
   import HotelSearch from './components/hotel/HotelSearch';
   ```

2. **Add to your page**:
   ```tsx
   <HotelSearch />
   ```

3. **Customize if needed**:
   - Modify search filters
   - Change UI styling
   - Add custom sorting
   - Implement additional features

## 📞 Support

For questions or issues:
1. Check the GraphQL schema documentation
2. Review the backend API documentation
3. Test with the HotelSearchExample component
4. Check browser console for errors

## 🔄 Future Enhancements

Potential improvements:
- **Map Integration**: Show hotels on interactive map
- **Saved Searches**: Allow users to save search criteria
- **Advanced Filters**: More specific filtering options
- **Real-time Updates**: Live availability updates
- **Image Gallery**: Hotel photo galleries
- **Reviews Integration**: User ratings and reviews
