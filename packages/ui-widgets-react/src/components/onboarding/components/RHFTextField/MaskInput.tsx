import React from 'react';
import { IMaskInput } from 'react-imask';
import { AnyMaskedOptions } from 'imask';

type MaskInputProps = AnyMaskedOptions & {
  onChange: (event: { target: { name: string; value: string } }) => void;
  name: string;
};

const MaskInput = React.forwardRef<HTMLInputElement, MaskInputProps>(
  function TextMaskCustom({ onChange, name, ...other }, ref) {
    return (
      <IMaskInput
        {...other}
        inputRef={ref}
        onAccept={(value) => onChange({ target: { name, value: `${value}` } })}
        overwrite
      />
    );
  }
);

export default MaskInput;
