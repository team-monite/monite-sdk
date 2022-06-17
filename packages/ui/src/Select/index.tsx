import React from 'react';
import Select, {
  components,
  StylesConfig,
  DropdownIndicatorProps,
  OptionProps,
  MenuListProps,
  MultiValueGenericProps,
} from 'react-select';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';

import type { FormatOptionLabelMeta } from 'react-select/dist/declarations/src/Select';

import Checkbox from '../Checkbox';
import { THEMES } from '../consts';
import { ArrowDownIcon } from '../Icons';

const MultiLabelWithCheckbox = styled.div`
  display: flex;
  > * + * {
    margin-left: 12px;
  }
`;

const LabelWithIcon = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

type Option = {
  value: string;
  label: string;
};

export type SelectProps = {
  id?: string;
  name?: string;
  value?: Option | Option[] | null;
  options: Option[];
  isMulti?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  className?: string;
  onChange?: (e: any) => void;
  onBlur?: (e: any) => void;
};

const ReactSelect = (props: SelectProps) => {
  const {
    id,
    name,
    value,
    options,
    isMulti,
    placeholder,
    onChange,
    onBlur,
    isDisabled,
    className,
  } = props;

  const onMenuOpen = () => {
    ReactTooltip.rebuild();
  };

  const onMenuClose = () => {
    ReactTooltip.hide();
  };

  const customStyles: StylesConfig = {
    singleValue: (provided: any, state: any) => ({
      ...provided,
      ...(isDisabled
        ? {
            color: THEMES.default.colors.lightGrey1,
          }
        : {}),
    }),
    multiValue: (provided: any, state: any) => ({
      ...provided,
      background: 'transparent',
      margin: 0,
    }),
    multiValueLabel: (provided: any, state: any) => ({
      ...provided,
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
      padding: 0,
      color: THEMES.default.colors.grey,
    }),
    menu: (provided: any, state: any) => ({
      ...provided,
      border: 0,
      boxShadow: '0px 4px 8px 0px #1111111F',
      borderRadius: 8,
    }),
    menuList: (provided: any, state: any) => {
      return {
        ...provided,
        margin: 0,
        padding: 0,
        ':first-of-type': {
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        },
        ':last-child': {
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        },
      };
    },
    option: (provided: any, state: any) => {
      const backgroundColor = state.isSelected
        ? THEMES.default.colors.lightGrey3
        : THEMES.default.colors.white;

      return {
        ...provided,
        color: THEMES.default.colors.black,
        backgroundColor,
        padding: '12px 16px',
        cursor: 'pointer',
        ':hover': {
          backgroundColor: THEMES.default.colors.lightGrey3,
        },
      };
    },
    control: (provided: any, state: any) => {
      const borderColor = state.isFocused
        ? THEMES.default.colors.blue
        : props.placeholder === '' && !value
        ? THEMES.default.colors.lightGrey3
        : THEMES.default.colors.lightGrey2;

      const background =
        state.isFocused || value
          ? THEMES.default.colors.white
          : props.placeholder === ''
          ? THEMES.default.colors.lightGrey3
          : THEMES.default.colors.white;

      const boxShadow = state.isFocused
        ? `0px 0px 0px 4px ${THEMES.default.colors.blue}33`
        : 'none';

      return {
        ...provided,
        borderRadius: 8,
        borderColor,
        boxShadow,
        padding: 0,
        transition:
          'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out',
        ':hover': {
          borderColor,
        },
        background,
      };
    },
    input: (provided: any, state: any) => {
      return {
        ...provided,
        padding: 0,
        margin: 0,
        outline: 0,
      };
    },
    valueContainer: (provided: any, state: any) => {
      return {
        ...provided,
        ...(isDisabled ? {} : { cursor: 'pointer' }),
        padding: '11px 16px',
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '24px',
      };
    },
    dropdownIndicator: (provided: any, state: any) => {
      return {
        ...provided,
        ...(isDisabled ? {} : { cursor: 'pointer' }),
        padding: '8px 16px 8px 8px',
      };
    },
  };

  const overrideDropdownIndicator = (props: DropdownIndicatorProps) => {
    return (
      <components.DropdownIndicator {...props}>
        <ArrowDownIcon />
      </components.DropdownIndicator>
    );
  };

  const overrideOption = (props: OptionProps<any>) => {
    const {
      children,
      data: { data },
    } = props;

    const tooltipAttributes =
      data && data.tooltip
        ? Object.keys(data.tooltip).reduce<Record<string, any>>((acc, key) => {
            acc[`data-${key}`] = data.tooltip[key];
            return acc;
          }, {})
        : {};

    return (
      <components.Option
        {...props}
        innerProps={{ ...props.innerProps, ...tooltipAttributes }}
      >
        {data?.icon ? (
          <LabelWithIcon>
            {children}
            {data.icon}
          </LabelWithIcon>
        ) : (
          children
        )}
      </components.Option>
    );
  };

  const overrideMenuList = (props: MenuListProps) => {
    ReactTooltip.rebuild();
    return <components.MenuList {...props} />;
  };

  const overrideMultiValueLabel = (props: MultiValueGenericProps) => {
    const { data } = props;
    const values = Array.isArray(value) ? value : [];
    const currentOptionIdx = values.findIndex(
      (option) => option.value === data.value
    );

    return (
      <components.MultiValueLabel {...props}>
        {data.value}
        {currentOptionIdx === values.length - 1 ? '' : ', '}
      </components.MultiValueLabel>
    );
  };

  const formatOptionLabel = (
    data: any,
    formatOptionLabelMeta: FormatOptionLabelMeta<any>
  ) => {
    const { selectValue } = formatOptionLabelMeta;
    const isSelected = selectValue.find((o: Option) => o.value === data.value);

    return (
      <MultiLabelWithCheckbox>
        <Checkbox
          id={data.value}
          name={data.value}
          value={data.value}
          checked={!!isSelected}
        />
        <div>{data.label}</div>
      </MultiLabelWithCheckbox>
    );
  };

  return (
    <Select
      id={id}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      styles={customStyles}
      options={options}
      value={value}
      components={{
        DropdownIndicator: overrideDropdownIndicator,
        IndicatorSeparator: () => null,
        Option: overrideOption,
        MenuList: overrideMenuList,
        MultiValueRemove: () => null,
        MultiValueLabel: overrideMultiValueLabel,
      }}
      onMenuOpen={onMenuOpen}
      onMenuClose={onMenuClose}
      isMulti={isMulti}
      isClearable={false}
      hideSelectedOptions={false}
      formatOptionLabel={isMulti ? formatOptionLabel : undefined}
      closeMenuOnSelect={!isMulti}
      placeholder={placeholder}
      isDisabled={isDisabled}
      className={className}
      // menuIsOpen={true} // uncomment it for debug purpose
    />
  );
};

export default ReactSelect;
