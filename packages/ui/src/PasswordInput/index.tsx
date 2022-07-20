import React, { useState } from 'react';
import styled from '@emotion/styled';

import InputField, { InputProps } from '../Input';
import { UEye, UEyeSlash } from '../unicons';
import IconButton from '../IconButton';

const Field = styled(InputField)`
  input {
    padding-right: 60px;
  }
`;

const EyeTrigger = styled.span`
  position: absolute;
  right: 0;
  width: 56px;
  height: 48px;
  top: 50%;
  display: flex;
  justify-content: center;
  transform: translateY(-50%);
`;

const PasswordField = (props: InputProps) => {
  const [isShowPassword, setShowPassword] = useState(false);

  const onClickEye = () => {
    setShowPassword((isShowPassword) => !isShowPassword);
  };

  const renderIcon = () => (
    <EyeTrigger>
      <IconButton color={'lightGrey1'} onClick={onClickEye}>
        {isShowPassword ? <UEyeSlash /> : <UEye />}
      </IconButton>
    </EyeTrigger>
  );

  return (
    <Field
      type={isShowPassword ? 'text' : 'password'}
      renderAddon={renderIcon}
      {...props}
    />
  );
};

export default PasswordField;
