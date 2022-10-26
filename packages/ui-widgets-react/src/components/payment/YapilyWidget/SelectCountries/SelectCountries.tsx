import React from 'react';
import { CircleFlag } from 'react-circle-flags';
import styled from '@emotion/styled';

import { Select } from '@team-monite/ui-kit-react';

type SelectCountriesProps = {
  data: Array<{ name: string; code: string }>;
  value: string;
  onChange: (value: any) => void;
};

const StyledSelect = styled(Select)`
  > div > div {
    padding-right: 0px;
  }
  .monite-ui-menuList {
    min-width: 240px;
  }
`;

const SelectCountries = ({ value, onChange, data }: SelectCountriesProps) => {
  const countriesWithFlag = data.map((option) => ({
    label: option.name,
    value: option.code,
    renderIcon: () => (
      <CircleFlag
        countryCode={option.code.toLowerCase()}
        style={{ marginRight: 16, height: 24 }}
      />
    ),
  }));

  return (
    <>
      <StyledSelect
        value={{
          value,
          label: '',
        }}
        isSearchable={false}
        onChange={onChange}
        options={countriesWithFlag}
        leftIcon={() =>
          value ? (
            <CircleFlag
              countryCode={value.toLowerCase()}
              style={{ height: 24 }}
            />
          ) : null
        }
      />
    </>
  );
};

export default SelectCountries;
