import React from 'react';
import styled from '@emotion/styled';

import Button from '../Button';
import { QuestionIcon } from '../Icons';
import Text from '../Text';

const Field = styled.div<Partial<FormFieldProps>>`
  display: flex;
  flex-direction: column;

  ${({ readOnly, theme }) =>
    readOnly
      ? `
    ${Label} {
      color: ${theme.colors.lightGrey1};
    }
  `
      : ''}
`;

const Label = styled(Text)`
  text-align: left;
  margin-bottom: 8px;

  > * {
    vertical-align: middle;
  }

  button {
    display: inline-block;
    margin-left: 4px;
  }
`;

const Error = styled(Text)<{}>`
  color: ${({ theme }) => theme.colors.error};
  margin-top: 8px;

  a {
    color: ${({ theme }) => theme.colors.error};
    text-decoration: underline;
  }
`;

const FormText = styled.div`
  margin-top: 8px;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;

  color: ${({ theme }) => theme.colors.grey};

  a {
    color: ${({ theme }) => theme.colors.grey};
    text-decoration: underline;

    &:hover {
      color: ${({ theme }) => theme.colors.blue};
    }
  }
`;

type FormFieldProps = {
  id: string;
  error?: React.ReactNode;
  text?: string | React.ReactNode;
  label: string;
  children: React.ReactNode;
  labelTextSize?: string;
  readOnly?: boolean;
  onClickInfo?: (e: React.BaseSyntheticEvent) => void;
};

const FormField = ({
  labelTextSize,
  id,
  error,
  children,
  label,
  text,
  readOnly,
  onClickInfo,
}: FormFieldProps) => {
  return (
    <Field readOnly={readOnly}>
      <Label as="label" htmlFor={id} size={labelTextSize || 'smallBold'}>
        <span>{label}</span>
        {onClickInfo ? (
          <Button
            noPadding
            color="lightGrey1"
            icon={<QuestionIcon />}
            onClick={onClickInfo}
          />
        ) : null}
      </Label>
      {children}
      {text && <FormText>{text}</FormText>}
      {error && (
        <Error as="div" size="small">
          {error}
        </Error>
      )}
    </Field>
  );
};

export default FormField;
