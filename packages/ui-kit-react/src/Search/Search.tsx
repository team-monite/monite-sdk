import React, { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { debounce } from 'lodash';

import Input from '../Input';
import { USearch } from '../unicons';

interface Props {
  placeholder: string;
  isFilter?: boolean;
  onSearch?: (value: string | undefined | null) => void;
  disabled?: boolean;
}

const SearchInput = styled(Input)`
  font-family: ${({ theme }) => theme.search.fontFamily};

  input {
    font-family: ${({ theme }) => theme.search.fontFamily};
    color: ${({ theme }) => theme.search.filterTextColor};

    border-color: ${({ theme }) => theme.search.filterBorderColor};

    padding: 11px 38px 11px 16px;

    ${({ theme, isFilter }) =>
      isFilter &&
      `
      background-color: ${theme.search.filterBackgroundColor};
      border-radius: ${theme.search.filterBorderRadius};
      box-shadow: none;
    `}

    &:hover, &:focus {
      ${({ theme, isFilter, disabled }) =>
        isFilter &&
        !disabled &&
        `
        color: ${theme.search.filterTextColorHover};
        background-color: ${theme.search.filterBackgroundColorHover};
        border-color: ${theme.search.filterBorderColorHover};
        box-shadow: none;

        + i {
          color: ${theme.search.filterTextColorHover};
        }
      `}
    }

    ${({ theme, disabled }) =>
      disabled &&
      `
      color: ${theme.search.filterTextColorDisabled};
      background-color: ${theme.search.filterBackgroundColorDisabled};

      + i {
          color: ${theme.search.filterTextColorDisabled};
        }

      &:hover, &:focus {
        color: ${theme.search.filterTextColorDisabled};
        background-color: ${theme.search.filterBackgroundColorDisabled};


        &::placeholder {
          color: ${theme.search.filterTextColorDisabled};
        }
      }
    `}
  }
`;

const SearchBtn = styled.span`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 12px;
`;

const Search = ({ placeholder, isFilter, onSearch, disabled }: Props) => {
  const [value, setValue] = useState<string>('');
  const [search, setSearch] = useState<string | undefined | null>(undefined);

  useEffect(() => {
    if (search !== undefined) {
      onSearch && onSearch(search);
    }
  }, [search]);

  const debouncedSearch = useMemo(() => {
    return debounce(setSearch, 300);
  }, []);

  const onChangeHandler = (value: string) => {
    setValue(value);
    debouncedSearch(value || null);
  };

  return (
    <SearchInput
      placeholder={placeholder}
      value={value}
      isFilter={isFilter}
      disabled={disabled}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
        onChangeHandler(e.target?.value)
      }
      renderAddonIcon={() => (
        <SearchBtn>
          <USearch width={20} height={20} />
        </SearchBtn>
      )}
    />
  );
};

export default Search;
