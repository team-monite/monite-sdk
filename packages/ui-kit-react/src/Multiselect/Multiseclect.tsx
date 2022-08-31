import React, { useState, useEffect, useRef } from 'react';
import Select, { Option } from '../Select';
import { OnChangeValue } from 'react-select';

interface Props {
  options: Option[];
  optionAsTag?: boolean;
}

const createOption = (label: string) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

const Multiselect = ({ options, ...restProps }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [localOptions, setLocalOptions] = useState(options);
  const [value, setValue] = useState<Option[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const onDomClick = (e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setInputValue('');
      setMenuIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', onDomClick, { capture: true });

    return () => {
      document.removeEventListener('mousedown', onDomClick, { capture: true });
    };
  }, []);

  const onCreateOption = (newValue: string) => {
    const newOption = createOption(newValue);

    setInputValue('');
    setValue([...value, newOption]);
    setLocalOptions([...localOptions, newOption]);
  };

  const onChange = (value: Option[] | null) => {
    if (value) setValue(value);
    setInputValue('');
  };

  const removeSelectedOption = (selectedValue: string) => {
    const newValue = value.filter((item) => item.value !== selectedValue);

    setValue(newValue);
  };

  return (
    <div ref={containerRef}>
      <Select
        isMulti
        isCreatable
        hideSelectedOptions
        options={localOptions}
        value={value}
        onChange={(newValue: OnChangeValue<Option[], false>) =>
          onChange(newValue)
        }
        inputValue={inputValue}
        onInputChange={(value) => {
          setInputValue(value);
          setMenuIsOpen(true);
        }}
        isFocused={menuIsOpen}
        menuIsOpen={menuIsOpen}
        onMenuOpen={() => setMenuIsOpen(true)}
        onMenuClose={() => setMenuIsOpen(false)}
        controlShouldRenderValue={!menuIsOpen}
        onCreateOption={onCreateOption}
        handleRemoveSelectedOption={(selectedValue) =>
          removeSelectedOption(selectedValue)
        }
        {...restProps}
      />
    </div>
  );
};

export default Multiselect;
