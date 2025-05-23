import { render, fireEvent, act } from '@testing-library/react';

import { vi } from 'vitest';

import { SearchField, DEBOUNCE_SEARCH_TIMEOUT } from './SearchField';

vi.useFakeTimers();

describe('SearchField', () => {
  it('calls the onChange function with the input value after the debounce time', async () => {
    const mockOnChange = vi.fn();
    const { getByLabelText } = render(
      <SearchField label="Search" onChange={mockOnChange} />
    );
    const input = getByLabelText('Search');

    fireEvent.change(input, { target: { value: 'test' } });

    expect(mockOnChange).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(DEBOUNCE_SEARCH_TIMEOUT);
    });

    expect(mockOnChange).toHaveBeenCalledWith('test');
  });
});
