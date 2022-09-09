import React, { useState, useEffect, useMemo } from 'react';
import styled from '@emotion/styled';
import { debounce } from 'lodash';

import Input from '../Input';
import { USearch } from '../unicons';
import { THEMES } from '../consts';

interface Props {
  placeholder: string;
  isFilter?: boolean;
  onSearch?: (value: string | undefined | null) => void;
}

const SearchInput = styled(Input)<{
  theme: typeof THEMES.default;
  isFilter?: boolean;
}>`
  input {
    padding: 11px 38px 11px 16px;
    ${({ theme, isFilter }) =>
      isFilter &&
      `
      background-color: ${theme.colors.white};
      border-radius: 100px;
      box-shadow: none;
    `}

    &:hover, &:focus {
      ${({ theme, isFilter }) =>
        isFilter &&
        `
        border-color: ${theme.colors.black};
        box-shadow: none;
      `}
    }
  }
`;

const SearchBtn = styled.span`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 12px;
`;

const Search = ({ placeholder, isFilter, onSearch }: Props) => {
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
      onChange={(e) => onChangeHandler(e.target.value)}
      renderAddonIcon={() => (
        <SearchBtn>
          <USearch width={20} height={20} />
        </SearchBtn>
      )}
    />
  );
};

export default Search;
