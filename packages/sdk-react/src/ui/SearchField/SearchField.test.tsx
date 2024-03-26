import React from 'react';

import { render, fireEvent, act } from '@testing-library/react';

import { SearchField, DEBOUNCE_SEARCH_TIMEOUT } from './SearchField';

jest.useFakeTimers();

describe('SearchField', () => {
  it('calls the onChange function with the input value after the debounce time', async () => {
    const mockOnChange = jest.fn();
    const { getByLabelText } = render(
      <SearchField label="Search" onChange={mockOnChange} />
    );
    const input = getByLabelText('Search');

    fireEvent.change(input, { target: { value: 'test' } });

    expect(mockOnChange).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(DEBOUNCE_SEARCH_TIMEOUT);
    });

    expect(mockOnChange).toHaveBeenCalledWith('test');
  });
});
