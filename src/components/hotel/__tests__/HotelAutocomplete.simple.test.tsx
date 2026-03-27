import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HotelAutocomplete from '@/components/hotel/HotelAutocomplete';

// Mock Apollo Context
vi.mock('@/contexts/ApolloContext', () => ({
  useApollo: () => ({
    query: vi.fn(),
  }),
}));

describe('HotelAutocomplete Component', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render input field with correct placeholder', () => {
    render(
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
    render(
      <HotelAutocomplete
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText(/search hotels/i);
    fireEvent.change(input, { target: { value: 'Marriott' } });

    expect(mockOnChange).toHaveBeenCalledWith('Marriott');
  });

  it('should display custom placeholder', () => {
    render(
      <HotelAutocomplete
        value=""
        onChange={mockOnChange}
        placeholder="Custom placeholder"
      />
    );

    const input = screen.getByPlaceholderText('Custom placeholder');
    expect(input).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <HotelAutocomplete
        value=""
        onChange={mockOnChange}
        className="custom-class"
      />
    );

    const input = screen.getByPlaceholderText(/search hotels/i);
    expect(input).toHaveClass('custom-class');
  });

  it('should handle controlled input value', () => {
    render(
      <HotelAutocomplete
        value="Existing value"
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText(/search hotels/i);
    expect(input).toHaveValue('Existing value');
  });

  it('should handle keyboard events', () => {
    render(
      <HotelAutocomplete
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText(/search hotels/i);
    
    // Test arrow keys
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    
    // Test enter key
    fireEvent.keyDown(input, { key: 'Enter' });
    
    // Test escape key
    fireEvent.keyDown(input, { key: 'Escape' });
    
    // Should not crash
    expect(input).toBeInTheDocument();
  });

  it('should not show suggestions for short queries', () => {
    render(
      <HotelAutocomplete
        value=""
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText(/search hotels/i);
    fireEvent.change(input, { target: { value: 'M' } });

    // Should not show suggestions immediately for single character
    expect(screen.queryByText('Marriott Hotel')).not.toBeInTheDocument();
  });

  it('should render in relative positioned container', () => {
    render(
      <HotelAutocomplete
        value=""
        onChange={mockOnChange}
      />
    );

    const container = screen.getByPlaceholderText(/search hotels/i).closest('.relative');
    expect(container).toBeInTheDocument();
  });
});
