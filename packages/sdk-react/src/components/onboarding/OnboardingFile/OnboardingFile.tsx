import React, { ReactNode } from 'react';
import { Controller, FieldValues, UseControllerProps } from 'react-hook-form';

import { AllowedFileTypes } from '@monite/sdk-api';
import { Typography } from '@mui/material';

import { OnboardingFileUploader } from './OnboardingFileUploader';
import { OnboardingFileViewer } from './OnboardingFileViever';

type OnboardingFileProps = {
  label: string;
  fileType:
    | AllowedFileTypes.IDENTITY_DOCUMENTS
    | AllowedFileTypes.ADDITIONAL_IDENTITY_DOCUMENTS;
  description?: string[];
};

export const OnboardingFile = <T extends FieldValues>({
  control,
  name,
  fileType,
  ...other
}: UseControllerProps<T> & OnboardingFileProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { ref, ...field }, fieldState: { error } }) => {
        if (!field.value)
          return (
            <OnboardingFileUploader
              {...other}
              {...field}
              error={error?.message}
              fileType={fileType}
            />
          );

        return (
          <OnboardingFileViewer {...other} {...field} error={error?.message} />
        );
      }}
    />
  );
};

const OnboardingFileContent = ({
  description,
  children,
}: {
  description?: ReactNode;
  children: ReactNode;
}) => {
  return (
    <>
      {description && (
        <>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          {children}
        </>
      )}
    </>
  );
};
