import React, { useState, useEffect, useRef } from 'react';
import Select, { Option } from '../Select';
import { OnChangeValue } from 'react-select';

interface Props {
  options: Option[];
  optionAsTag?: boolean;
  isCreatable?: boolean;
  onChange?: (options: Option[]) => void;
  onCreate?: (option: Option) => void;
  value: Option[];
}

const createOption = (label: string) => ({
  label,
  value: label.toLowerCase().replace(/\W/g, ''),
});

const Multiselect = ({
  options,
  onCreate,
  onChange,
  isCreatable = true,
  value,
  ...restProps
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);

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

    onCreate && onCreate(newOption);
    setInputValue('');
  };

  const handleChange = (value: Option[] | null) => {
    setInputValue('');
    onChange && onChange(value ? value : []);
  };

  return (
    <div ref={containerRef}>
      <Select
        isMulti
        isCreatable={isCreatable}
        hideSelectedOptions
        options={options}
        value={value}
        onChange={(newValue: OnChangeValue<Option[], false>) =>
          handleChange(newValue)
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
        {...restProps}
      />
    </div>
  );
};

export default Multiselect;
