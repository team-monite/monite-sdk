import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { useCreateTag, useUpdateTag } from '@/core/queries';
import { yupResolver } from '@hookform/resolvers/yup';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { TagReadSchema } from '@monite/sdk-api';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  TextField,
  Button,
  Typography,
} from '@mui/material';

import * as yup from 'yup';

const getValidationSchema = (i18n: I18n) =>
  yup
    .object()
    .shape({
      name: yup
        .string()
        .required()
        .max(255, t(i18n)`Value must be at most ${'255'} characters`),
    })
    .required();

interface ITag {
  id: string;
  name: string;
}

interface TagFormModalProps {
  tag?: ITag;
  onCreate?: (tag: TagReadSchema) => void;
  onUpdate?: (tag: TagReadSchema) => void;
  onClose?: () => void;

  /** Whether the modal is open or not */
  open: boolean;
}

interface FormFields {
  name: string;
}

/**
 * `TagFormModal` is responsible for creating or updating
 *   the tag.
 *  If no `tag` provided then the form is working on `creating` mode
 *  If `tag` provided then the form is working on `updating` mode
 */
export const TagFormModal = (props: TagFormModalProps) => (
  <MoniteStyleProvider>
    <TagFormModalBase {...props} />
  </MoniteStyleProvider>
);

const TagFormModalBase = ({
  tag,
  onCreate,
  onUpdate,
  onClose,
  open,
}: TagFormModalProps) => {
  const { i18n } = useLingui();
  const tagCreateMutation = useCreateTag();
  const tagUpdateMutation = useUpdateTag();
  const { control, handleSubmit, reset } = useForm<FormFields>({
    resolver: yupResolver(getValidationSchema(i18n)),
    defaultValues: { name: tag?.name || '' },
  });

  useEffect(() => {
    reset({
      name: tag?.name || '',
    });
  }, [reset, tag?.name]);

  const createTag = (name: string) => {
    const tagCreateMutate = tagCreateMutation.mutate;
    tagCreateMutate(
      {
        name,
      },
      {
        onSuccess: (tag) => {
          toast.success(t(i18n)`New tag “${tag.name}” created`);
          onCreate?.(tag);
          onClose?.();
        },
      }
    );
  };

  const updateTag = (tag: ITag, name: string) => {
    const tagUpdateMutate = tagUpdateMutation.mutate;
    tagUpdateMutate(
      {
        id: tag.id,
        payload: { name },
      },
      {
        onSuccess: (updatedTag) => {
          toast.success(
            t(i18n)`Tag “${tag.name}” renamed to “${updatedTag.name}”`
          );
          onUpdate?.(updatedTag);
          onClose?.();
        },
      }
    );
  };

  const { root } = useRootElements();

  return (
    <>
      <Dialog
        open={open}
        container={root}
        onClose={onClose}
        aria-label={t(i18n)`Edit tag`}
        TransitionProps={{
          /**
           * We have to reset the current form state
           *  when the user closes the modal
           */
          onExited: () => reset(),
        }}
        fullWidth
        maxWidth="sm"
      >
        <form
          id="createTagForm"
          name="createTagForm"
          onSubmit={handleSubmit((values) => {
            tag ? updateTag(tag, values.name) : createTag(values.name);
          })}
        >
          <DialogTitle variant="h3">
            {tag ? t(i18n)`Edit tag ”${tag.name}”` : t(i18n)`Create New Tag`}
          </DialogTitle>
          <DialogContent>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  id={field.name}
                  autoFocus
                  label={t(i18n)`Name`}
                  variant="standard"
                  fullWidth
                  error={Boolean(fieldState.error)}
                  helperText={fieldState.error?.message}
                  {...field}
                />
              )}
            />
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button variant="outlined" color="inherit" onClick={onClose}>
              {t(i18n)`Cancel`}
            </Button>
            <Button
              variant="outlined"
              color="primary"
              disabled={
                tagCreateMutation.isPending || tagUpdateMutation.isPending
              }
              type="submit"
            >
              {tag ? t(i18n)`Save` : t(i18n)`Create`}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
