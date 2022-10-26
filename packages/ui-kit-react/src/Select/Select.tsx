import React, { forwardRef, ReactNode } from 'react';
import Select, {
  components,
  StylesConfig,
  DropdownIndicatorProps,
  OptionProps,
  MenuListProps,
  ControlProps,
  ClearIndicatorProps,
  MultiValueProps,
  InputProps,
} from 'react-select';
import CreatableSelect from 'react-select/creatable';
import ReactTooltip from 'react-tooltip';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';

import { Box } from '../Box';
import Text from '../Text';
import Tag from '../Tag';
import { UAngleDown, UTimes } from '../unicons';
import Avatar from '../Avatar';

const LabelWithIcon = styled.div`
  display: inline-flex;
  justify-content: flex-start;
  align-items: center;

  div {
    margin-right: 12px;
  }
`;

const CreateInputWrapper = styled.div`
  padding: 16px 12px;
  background-color: ${({ theme }) =>
    theme.select.isCreatableInputTagsBackground};
  border-top-left-radius: ${({ theme }) => theme.select.borderRadius};
  border-top-right-radius: ${({ theme }) => theme.select.borderRadius};
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
`;

const CreateInput = styled.input`
  flex: 1 1 auto;
  background-color: transparent;
  border: none;

  &:focus-visible {
    outline: none;
  }
`;

export type Option = {
  value: string;
  label: string;
  icon?: string;
  renderIcon?: () => React.ReactElement;
};

interface SelectProps {
  id?: string;
  name?: string;
  className?: string;
  placeholder?: string;
  value?: Option | Option[] | string | null;
  onChange?: (e: any) => void;
  options: Option[];
  optionAsTag?: boolean;
  isMulti?: boolean;
  isCreatable?: boolean;
  isFilter?: boolean;
  isClearable?: boolean;
  isFocused?: boolean;
  isDisabled?: boolean;
  onFocus?: () => void;
  onBlur?: (e: any) => void;
  hideSelectedOptions?: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  menuIsOpen?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  controlShouldRenderValue?: boolean;
  onCreateOption?: (value: string) => void;
  leftIcon?: () => ReactNode;
  isSearchable?: boolean;
}

const ReactSelect = forwardRef<any, SelectProps>((props, ref) => {
  const {
    id,
    name,
    className,
    placeholder = '',
    value,
    onChange,
    options,
    optionAsTag = false,
    isMulti,
    isCreatable,
    isFilter,
    isClearable,
    isFocused,
    isDisabled,
    isSearchable = true,
    onFocus,
    onBlur,
    hideSelectedOptions = false,
    inputValue,
    onInputChange,
    onMenuOpen,
    onMenuClose,
    onCreateOption,
    leftIcon,
    ...restProps
  } = props;
  const theme = useTheme();

  const WrapperComponent = isCreatable ? CreatableSelect : Select;

  const handleOnMenuOpen = () => {
    ReactTooltip.rebuild();
    onMenuOpen && onMenuOpen();
  };

  const handleOnMenuClose = () => {
    ReactTooltip.hide();
    onMenuClose && onMenuClose();
  };

  const customStyles: StylesConfig = {
    singleValue: (provided: any, state: any) => ({
      ...provided,
      ...(isFilter
        ? {
            color: state.hasValue
              ? theme.select.filterWithValueTextColor
              : theme.select.filterTextColor,
          }
        : { color: theme.select.textColor }),
      ...(isFilter &&
        state.isFocused && { color: theme.select.filterTextColorHover }),
      ...(isDisabled && { color: theme.select.isReadonlyTextColor }),
    }),
    multiValue: (provided: any) => ({
      ...provided,
      background: 'transparent',
      margin: 0,
      display: 'inline-flex',
      flexShrink: 0,
      borderRadius: 0,
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      fontFamily: theme.select.fontFamily,
      fontSize: theme.select.fontSize,
      fontWeight: theme.select.fontWeight,
      lineHeight: optionAsTag ? '24px' : '20px',
      padding: 0,
      paddingLeft: 0,
      display: 'inline-flex',
      borderRadius: 0,
      color: theme.select.textColor,
    }),
    menu: (provided: any) => ({
      ...provided,
      border: 0,
      boxShadow: '0px 4px 8px 0px #1111111F',
      borderRadius: theme.select.borderRadius,
    }),
    menuList: (provided: any) => {
      return {
        ...provided,
        margin: 0,
        padding: 0,
        ':first-of-type': {
          borderTopLeftRadius: theme.select.borderRadius,
          borderTopRightRadius: theme.select.borderRadius,
        },
        ':last-child': {
          borderBottomLeftRadius: theme.select.borderRadius,
          borderBottomRightRadius: theme.select.borderRadius,
        },
      };
    },
    option: (provided: any, state: any) => {
      const backgroundColor = state.isSelected
        ? theme.select.optionBackgroundColorSelected
        : theme.select.optionBackgroundColor;

      return {
        ...provided,
        color: state.isSelected
          ? theme.select.optionTextColorSelected
          : theme.select.optionTextColor,
        backgroundColor,
        padding: '12px 16px',
        cursor: 'pointer',
        display: 'inline-flex',
        ':hover': {
          color: theme.select.optionTextColorHover,
          backgroundColor: theme.select.optionBackgroundColorHover,
        },
      };
    },
    control: (provided: any, state: any) => {
      let borderColor = theme.select.borderColor;

      if (state.isFocused && !isFilter) {
        borderColor = theme.select.borderColorHover;
      } else if (state.hasValue) {
        borderColor = theme.select.filterWithValueBorderColor;
      } else if (isFilter) {
        borderColor = theme.select.filterBorderColor;
      }

      const getBackgroundColor = () => {
        if (isFilter) {
          if (isDisabled) {
            return theme.select.filterBackgroundColorDisabled;
          } else {
            return state.hasValue
              ? theme.select.filterWithValueBackgroundColor
              : theme.select.filterBackgroundColor;
          }
        } else {
          return state.hasValue || isFocused
            ? theme.select.withValueBackgroundColor
            : theme.select.backgroundColor;
        }
      };

      const boxShadow =
        state.isFocused && !isFilter
          ? `0px 0px 0px 4px ${theme.select.borderShadowHover}33`
          : 'none';

      return {
        ...provided,
        borderRadius: isFilter
          ? theme.select.filterBorderRadius
          : theme.select.borderRadius,
        borderColor,
        boxShadow,
        padding: 0,
        paddingLeft: leftIcon ? 10 : 0,
        ':hover, :focus, :active, :focus-within': {
          borderColor: !isFilter
            ? theme.select.borderColorHover
            : theme.select.filterBorderColorHover,
          boxShadow: !isFilter
            ? `0px 0px 0px 4px ${theme.select.borderShadowHover}33`
            : 'none',
          backgroundColor: isFilter
            ? theme.select.filterBackgroundColorHover
            : theme.select.backgroundColorHover,
          color: isFilter
            ? theme.select.filterTextColorHover
            : theme.select.textColorHover,
          'svg, div': {
            color: isFilter && theme.select.filterTextColorHover,
          },
        },
        background: getBackgroundColor(),
      };
    },
    input: (provided: any, state: any) => {
      return {
        ...provided,
        padding: 0,
        margin: 0,
        outline: 0,
        color: isFilter
          ? state.hasValue
            ? theme.select.filterWithValueTextColor
            : theme.select.filterTextColor
          : theme.select.textColor,
        ':hover, :focus, :focus-within': {
          color: isFilter
            ? theme.select.filterTextColorHover
            : theme.select.textColorHover,
        },
      };
    },
    valueContainer: (provided: any) => {
      return {
        ...provided,
        ...(isDisabled ? {} : { cursor: 'pointer' }),
        padding: '11px 16px',
        fontFamily: theme.select.fontFamily,
        fontSize: theme.select.fontSize,
        fontWeight: theme.select.fontWeight,
        lineHeight: '24px',
        flexWrap: 'nowrap',
        overflow: 'auto',
        gap: '4px',
      };
    },
    clearIndicator: (provided: any, state: any) => {
      return {
        ...provided,
        ...(isDisabled ? {} : { cursor: 'pointer' }),
        color: isFilter
          ? state.hasValue
            ? theme.select.filterWithValueTextColor
            : theme.select.filterTextColor
          : theme.select.textColor,
        paddingRight: '16px',
      };
    },
    dropdownIndicator: (provided: any) => {
      return {
        ...provided,
        ...(isDisabled ? {} : { cursor: 'pointer' }),
        padding: '8px 16px 8px 8px',
      };
    },
  };

  const overrideDropdownIndicator = (props: DropdownIndicatorProps) => {
    return !(props.hasValue && isClearable) ? (
      <components.DropdownIndicator {...props}>
        <UAngleDown width={24} />
      </components.DropdownIndicator>
    ) : null;
  };

  const overrideClearIndicator = (props: ClearIndicatorProps) => {
    return isClearable ? (
      <components.ClearIndicator {...props}>
        <UTimes width={24} />
      </components.ClearIndicator>
    ) : null;
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

    const renderOption = () => {
      if (optionAsTag) {
        return (
          <Tag avatar={props.data?.icon && <Avatar src={props.data.icon} />}>
            {children}
          </Tag>
        );
      }

      if (props.data?.icon) {
        return (
          <LabelWithIcon>
            <Avatar size={24} src={props.data?.icon}>
              {props.data?.label}
            </Avatar>
            {children}
          </LabelWithIcon>
        );
      }

      if (props.data?.renderIcon) {
        return (
          <LabelWithIcon>
            {props.data?.renderIcon()}
            {children}
          </LabelWithIcon>
        );
      }

      return children;
    };

    const renderChildren = () => {
      if (props.data?.__isNew__) {
        // TODO add localization
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Text
              color={theme.select.creatableMessageTextColor}
              style={{ display: 'inline-block', flexShrink: 0 }}
            >
              Create new
            </Text>
            &nbsp;
            <Tag>{inputValue}</Tag>
            &nbsp;
            <Text
              color={theme.select.creatableMessageTextColor}
              style={{ display: 'inline-block', flexShrink: 0 }}
            >
              tag
            </Text>
          </div>
        );
      }

      return renderOption();
    };

    return (
      <components.Option
        {...props}
        innerProps={{ ...props.innerProps, ...tooltipAttributes }}
      >
        {renderChildren()}
      </components.Option>
    );
  };

  const overrideMenuList = (menuListProps: MenuListProps) => {
    ReactTooltip.rebuild();
    const { selectProps, children, setValue } = menuListProps;
    return (
      <>
        {isCreatable && (
          <>
            <CreateInputWrapper>
              {Array.isArray(selectProps.value) &&
                selectProps.value.map((selected) => (
                  <Tag
                    key={selected.value}
                    rightIcon={<UTimes />}
                    avatar={selected.icon && <Avatar src={selected.icon} />}
                    onClose={() =>
                      setValue(
                        (selectProps.value as Option[])?.filter(
                          (item) => item.value !== selected.value
                        ),
                        'select-option'
                      )
                    }
                  >
                    {selected.label}
                  </Tag>
                ))}
              <CreateInput
                value={inputValue}
                autoFocus={true}
                onChange={(e) =>
                  onInputChange && onInputChange(e.currentTarget.value)
                }
              />
            </CreateInputWrapper>
            <Box sx={{ padding: '16px 14px' }}>
              {/* TODO add localization */}
              <Text
                textSize="small"
                color={theme.select.creatableMessageTextColorSecondary}
              >
                Choose one of the options or create a new one
              </Text>
            </Box>
          </>
        )}
        <components.MenuList {...menuListProps} className="monite-ui-menuList">
          {children}
        </components.MenuList>
      </>
    );
  };

  const overrideMultiValue = ({
    children,
    data,
    ...props
  }: MultiValueProps) => {
    const option = data as Option;

    return (
      <components.MultiValue data={data} {...props}>
        <Tag avatar={option.icon && <Avatar src={option.icon} />}>
          {children}
        </Tag>
      </components.MultiValue>
    );
  };

  const overrideInput = ({ children, ...props }: InputProps) => (
    <components.Input
      {...props}
      disabled={isCreatable && props.selectProps.menuIsOpen}
    >
      {children}
    </components.Input>
  );

  const overrideControl = ({ children, ...props }: ControlProps) => (
    <components.Control {...props} isFocused={isFocused || false}>
      <>
        {leftIcon && leftIcon()}
        {children}
      </>
    </components.Control>
  );

  return (
    <WrapperComponent
      id={id}
      name={name}
      ref={ref}
      onChange={onChange}
      inputValue={inputValue}
      onFocus={onFocus}
      onBlur={onBlur}
      styles={customStyles}
      options={options}
      hideSelectedOptions={hideSelectedOptions}
      value={value}
      components={{
        DropdownIndicator: overrideDropdownIndicator,
        IndicatorSeparator: () => null,
        Option: overrideOption,
        MenuList: overrideMenuList,
        MultiValue: overrideMultiValue,
        Input: overrideInput,
        MultiValueRemove: () => null,
        Control: overrideControl,
        ClearIndicator: overrideClearIndicator,
      }}
      onMenuOpen={handleOnMenuOpen}
      onMenuClose={handleOnMenuClose}
      isMulti={isMulti}
      isClearable={isClearable}
      isSearchable={isSearchable}
      closeMenuOnSelect={!isMulti}
      placeholder={placeholder}
      isDisabled={isDisabled}
      className={className}
      onCreateOption={onCreateOption}
      {...restProps}
    />
  );
});

export default ReactSelect;
