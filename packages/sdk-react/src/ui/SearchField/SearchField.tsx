import React, { useEffect, useMemo } from 'react';

import SearchIcon from '@mui/icons-material/Search';
import {
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material';
import { debounce } from '@mui/material/utils';

/**
 * The delay in milliseconds before a search request is sent after the user stops typing.
 * @type {number}
 */
export const DEBOUNCE_SEARCH_TIMEOUT: number = 500;

/**
 * `Props` is an interface that defines the properties for the `SearchField` component.
 *
 * @interface
 * @property {string} label - The label for the search field.
 * @property {(value: string | null) => void} onChange - The function to be called when the input value changes.
 */
interface Props {
  className?: string;
  label: string;
  onChange: (value: string | null) => void;
}

/**
 * `SearchField` is a component that renders a search input field with a debounce functionality.
 * The input value is debounced, meaning that the `onChange` callback is not called immediately when the user types into the field,
 * but only after the user has stopped typing for a certain amount of time (`DEBOUNCE_SEARCH_TIMEOUT`).
 *
 * @component
 * @param {object} props - The properties that define the `SearchField` component.
 * @param {string} props.label - The label for the search field.
 * @param {(value: string | null) => void} props.onChange - The function to be called when the input value changes.
 *
 * @example
 * <SearchField label="Search" onChange={value => console.log(value)} />
 *
 * @returns {React.ReactElement} Returns a `FormControl` element that contains the search field.
 */

export const SearchField = ({ className, label, onChange }: Props) => {
  const debouncedOnChange = useMemo(
    () => debounce(onChange, DEBOUNCE_SEARCH_TIMEOUT),
    [onChange]
  );

  useEffect(() => {
    return () => {
      debouncedOnChange.clear();
    };
  }, [debouncedOnChange]);

  return (
    <FormControl variant="outlined" fullWidth aria-label="search-by-name">
      <InputLabel htmlFor="search-by-name">{label}</InputLabel>
      <OutlinedInput
        id="search-by-name"
        name="search-by-name"
        aria-label="search-by-name"
        className={className}
        label={label}
        onChange={(search) => {
          debouncedOnChange(search.target.value || null);
        }}
        endAdornment={
          <InputAdornment position="end">
            <SearchIcon fontSize="medium" />
          </InputAdornment>
        }
      />
    </FormControl>
  );
};
