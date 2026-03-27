import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import HotelAutocomplete from '@/components/hotel/HotelAutocomplete';
import { ADVANCED_HOTEL_AUTOCOMPLETE_QUERY } from '@/graphql/hotel';
import authReducer from '@/lib/slices/authSlice';
import hotelReducer from '@/lib/slices/hotelSlice';

// Mock Apollo Client
const mockClient = {
  query: vi.fn(),
};

// Mock Apollo Context
vi.mock('@/contexts/ApolloContext', () => ({
  useApollo: () => mockClient,
}));

describe('HotelAutocomplete Component', () => {
  const createTestStore = () => {
    return configureStore({
      reducer: {
        auth: authReducer,
        hotel: hotelReducer,
      },
    });
  };

  const renderWithProviders = (component: React.ReactElement) => {
    const store = createTestStore();
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render input field with correct placeholder', () => {
    const mockOnChange = vi.fn();
    renderWithProviders(
      <HotelAutocomplete
        value=""
        onChange={mockOnChange}
        placeholder="Search hotels..."
      />
    );

    const input = screen.getByPlaceholderText('Search hotels...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('should call onChange when user types', () => {
    const mockOnChange = vi.fn();
    renderWithProviders(
      <HotelAutocomplete
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText(/search hotels/i);
    fireEvent.change(input, { target: { value: 'Marriott' } });

    expect(mockOnChange).toHaveBeenCalledWith('Marriott');
  });

  it('should not fetch suggestions for queries shorter than 2 characters', async () => {
    const mockOnChange = vi.fn();
    mockClient.query.mockResolvedValue({
      data: { advancedHotelAutocomplete: ['Marriott Hotel'] },
    });

    renderWithProviders(
      <HotelAutocomplete
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText(/search hotels/i);
    fireEvent.change(input, { target: { value: 'M' } });

    // Wait for debounce
    await waitFor(() => {
      expect(mockClient.query).not.toHaveBeenCalled();
    }, { timeout: 400 });
  });

  it('should fetch suggestions for queries 2 characters or longer', async () => {
    const mockOnChange = vi.fn();
    const mockSuggestions = ['Marriott Hotel', 'Hilton Garden Inn'];
    
    mockClient.query.mockResolvedValue({
      data: { advancedHotelAutocomplete: mockSuggestions },
    });

    renderWithProviders(
      <HotelAutocomplete
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText(/search hotels/i);
    fireEvent.change(input, { target: { value: 'Ma' } });

    await waitFor(() => {
      expect(mockClient.query).toHaveBeenCalledWith({
        query: ADVANCED_HOTEL_AUTOCOMPLETE_QUERY,
        variables: { query: 'Ma' },
      });
    });
  });

  it('should display suggestions when API returns data', async () => {
    const mockOnChange = vi.fn();
    const mockSuggestions = ['Marriott Hotel', 'Hilton Garden Inn'];
    
    mockClient.query.mockResolvedValue({
      data: { advancedHotelAutocomplete: mockSuggestions },
    });

    renderWithProviders(
      <HotelAutocomplete
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText(/search hotels/i);
    fireEvent.change(input, { target: { value: 'Mar' } });

    // Wait for debounce and API call
    await waitFor(() => {
      expect(mockClient.query).toHaveBeenCalled();
    }, { timeout: 400 });

    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText('Marriott Hotel')).toBeInTheDocument();
      expect(screen.getByText('Hilton Garden Inn')).toBeInTheDocument();
    }, { timeout: 100 });
  });

  it('should hide suggestions when a suggestion is selected', async () => {
    const mockOnChange = vi.fn();
    const mockSuggestions = ['Marriott Hotel', 'Hilton Garden Inn'];
    
    mockClient.query.mockResolvedValue({
      data: { advancedHotelAutocomplete: mockSuggestions },
    });

    renderWithProviders(
      <HotelAutocomplete
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText(/search hotels/i);
    fireEvent.change(input, { target: { value: 'Mar' } });

    await waitFor(() => {
      expect(screen.getByText('Marriott Hotel')).toBeInTheDocument();
    });

    // Click on the first suggestion
    fireEvent.click(screen.getByText('Marriott Hotel'));

    expect(mockOnChange).toHaveBeenCalledWith('Marriott Hotel');
    
    // Suggestions should be hidden
    await waitFor(() => {
      expect(screen.queryByText('Marriott Hotel')).not.toBeInTheDocument();
    });
  });

  it('should show loading indicator while fetching', async () => {
    const mockOnChange = vi.fn();
    
    // Create a promise that we can control
    let resolvePromise: (value: any) => void;
    const mockPromise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    
    mockClient.query.mockReturnValue(mockPromise);

    renderWithProviders(
      <HotelAutocomplete
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText(/search hotels/i);
    fireEvent.change(input, { target: { value: 'Mar' } });

    // Check for loading indicator - look for the div with animate-spin class
    await waitFor(() => {
      const loadingElement = document.querySelector('.animate-spin');
      expect(loadingElement).toBeInTheDocument();
    }, { timeout: 100 });

    // Resolve the promise
    resolvePromise!({ data: { advancedHotelAutocomplete: [] } });

    await waitFor(() => {
      const loadingElement = document.querySelector('.animate-spin');
      expect(loadingElement).not.toBeInTheDocument();
    });
  });

  it('should handle keyboard navigation', async () => {
    const mockOnChange = vi.fn();
    const mockSuggestions = ['Marriott Hotel', 'Hilton Garden Inn', 'Holiday Inn'];
    
    mockClient.query.mockResolvedValue({
      data: { advancedHotelAutocomplete: mockSuggestions },
    });

    renderWithProviders(
      <HotelAutocomplete
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText(/search hotels/i);
    fireEvent.change(input, { target: { value: 'Hotel' } });

    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText('Marriott Hotel')).toBeInTheDocument();
    }, { timeout: 400 });

    // Test arrow down navigation
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByText('Marriott Hotel')).toHaveClass('bg-blue-100');

    // Test arrow down again
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(screen.getByText('Hilton Garden Inn')).toHaveClass('bg-blue-100');

    // Test enter key selection
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(mockOnChange).toHaveBeenCalledWith('Hilton Garden Inn');
  });

  it('should hide suggestions on escape key', async () => {
    const mockOnChange = vi.fn();
    const mockSuggestions = ['Marriott Hotel'];
    
    mockClient.query.mockResolvedValue({
      data: { advancedHotelAutocomplete: mockSuggestions },
    });

    renderWithProviders(
      <HotelAutocomplete
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText(/search hotels/i);
    fireEvent.change(input, { target: { value: 'Mar' } });

    // Wait for suggestions to appear
    await waitFor(() => {
      expect(screen.getByText('Marriott Hotel')).toBeInTheDocument();
    }, { timeout: 400 });

    // Press escape key
    fireEvent.keyDown(input, { key: 'Escape' });

    expect(screen.queryByText('Marriott Hotel')).not.toBeInTheDocument();
  });

  it('should handle API errors gracefully', async () => {
    const mockOnChange = vi.fn();
    
    mockClient.query.mockRejectedValue(new Error('Network error'));

    renderWithProviders(
      <HotelAutocomplete
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText(/search hotels/i);
    fireEvent.change(input, { target: { value: 'Mar' } });

    await waitFor(() => {
      expect(screen.queryByText('Marriott Hotel')).not.toBeInTheDocument();
    }, { timeout: 400 });

    // Should not crash and input should still be usable
    expect(input).toBeInTheDocument();
  });

  it('should not show suggestions when value matches last selected value', async () => {
    const mockOnChange = vi.fn();
    const mockSuggestions = ['Marriott Hotel'];
    
    mockClient.query.mockResolvedValue({
      data: { advancedHotelAutocomplete: mockSuggestions },
    });

    renderWithProviders(
      <HotelAutocomplete
        value="Marriott Hotel"
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText(/search hotels/i);
    
    // Focus the input (should not show suggestions since value matches selected value)
    fireEvent.focus(input);

    await waitFor(() => {
      expect(screen.queryByText('Marriott Hotel')).not.toBeInTheDocument();
    }, { timeout: 100 });

    // Change the value (should show suggestions)
    fireEvent.change(input, { target: { value: 'Marriott Hotel ' } });

    await waitFor(() => {
      expect(mockClient.query).toHaveBeenCalled();
    });
  });
});
