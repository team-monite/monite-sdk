import React, { useState } from 'react';
import styled from 'styled-components';

import eyeSrc from './eye.svg';
import eyeSlashSrc from './eye-slash.svg';

import InputField, { InputProps } from '../Input';

const Field = styled(InputField)`
  input {
    padding-right: 60px;
  }
`;

const EyeTrigger = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  width: 56px;
  height: 100%;
  cursor: pointer;
  user-select: none;

  input[type='password'] + & {
    background: url(${eyeSrc}) no-repeat;
    background-size: 20px 20px;
    background-position: center center;
  }
  input[type='text'] + & {
    background: url(${eyeSlashSrc}) no-repeat;
    background-size: 20px 20px;
    background-position: center center;
  }
`;

const PasswordField = ({ ...props }: InputProps) => {
  const [isShowPassword, setShowPassword] = useState(false);

  const onClickEye = () => {
    setShowPassword((isShowPassword) => !isShowPassword);
  };

  return (
    <Field
      type={isShowPassword ? 'text' : 'password'}
      renderAddon={() => <EyeTrigger onClick={onClickEye} />}
      {...props}
    />
  );
};

export default PasswordField;
