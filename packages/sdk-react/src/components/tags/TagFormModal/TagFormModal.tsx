import React, { useEffect, useId } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { getAPIErrorMessage } from '@/utils/getAPIErrorMessage';
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
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

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
  <MoniteScopedProviders>
    <TagFormModalBase {...props} />
  </MoniteScopedProviders>
);

const TagFormModalBase = ({
  tag,
  onCreate,
  onUpdate,
  onClose,
  open,
}: TagFormModalProps) => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();
  const queryClient = useQueryClient();
  const tagCreateMutation = api.tags.postTags.useMutation(
    {},
    {
      onSuccess: () => api.tags.getTags.invalidateQueries(queryClient),
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    }
  );

  const tag_id = tag?.id;

  const tagUpdateMutation = api.tags.patchTagsId.useMutation(
    {
      path: {
        tag_id: tag_id ?? '',
      },
    },
    {
      onSuccess: () =>
        Promise.all([
          api.tags.getTags.invalidateQueries(queryClient),
          api.tags.getTagsId.invalidateQueries(
            { parameters: { path: { tag_id } } },
            queryClient
          ),
        ]),
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    }
  );

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
    tagCreateMutation.mutate(
      { name },
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
    tagUpdateMutation.mutate(
      {
        name,
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

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const formName = `Monite-Form-tag-${useId()}`;

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
          id={formName}
          name={formName}
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
