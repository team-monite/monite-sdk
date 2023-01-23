import React, { useCallback } from 'react';
import styled from '@emotion/styled';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TFunction } from 'react-i18next';
import { toast } from 'react-hot-toast';
import {
  Box,
  Button,
  FormField,
  Input,
  Modal,
  ModalLayout,
  Text,
} from '@team-monite/ui-kit-react';
import { useComponentsContext } from 'core/context/ComponentsContext';
import { useCreateTag, useUpdateTag } from 'core/queries';

const getValidationSchema = (t: TFunction) =>
  yup
    .object()
    .shape({
      name: yup
        .string()
        .required()
        .max(255, t('validation:string.max', { max: '255' })),
    })
    .required();

const StyledHeader = styled(Box)`
  padding: 32px 32px 16px;
`;

const Content = styled.div`
  margin: 4px 32px;
`;

const Separator = styled.div`
  margin: 24px 0;
  height: 1px;
  background: ${({ theme }) => theme.neutral80};
`;

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 24px 24px 24px;
`;

interface Props {
  tag?: { id: string; name: string };
  onCreate?: () => void;
  onClose?: () => void;
}

interface FormFields {
  name: string;
}

const TagFormModal = ({ tag, onCreate, onClose }: Props) => {
  const { t } = useComponentsContext();
  const tagCreateMutation = useCreateTag();
  const tagUpdateMutation = useUpdateTag();
  const { control, handleSubmit } = useForm<FormFields>({
    resolver: yupResolver(getValidationSchema(t)),
    defaultValues: { name: tag?.name || '' },
  });

  const createTag = useCallback(
    (name: string) => {
      tagCreateMutation.mutate(
        {
          name,
        },
        {
          onSuccess: (tag) => {
            toast.success(t('tags:messages.createSuccess', { name: tag.name }));
            onCreate && onCreate();
            onClose && onClose();
          },
        }
      );
    },
    [tagCreateMutation]
  );

  const updateTag = useCallback(
    (name: string) => {
      tagUpdateMutation.mutate(
        {
          id: tag!.id,
          payload: { name },
        },
        {
          onSuccess: (updatedTag) => {
            toast.success(
              t('tags:messages.updateSuccess', {
                oldName: tag!.name,
                newName: updatedTag.name,
              })
            );
            onCreate && onCreate();
            onClose && onClose();
          },
        }
      );
    },
    [tagCreateMutation]
  );

  return (
    <Modal onClose={onClose}>
      <ModalLayout
        header={
          <StyledHeader>
            <Text textSize="h3" textAlign="center">
              {tag
                ? t('tags:editTag', { name: tag.name })
                : t('tags:createNewTag')}
            </Text>
          </StyledHeader>
        }
        footer={
          <>
            <Separator />
            <ActionsWrapper>
              <Button color="secondary" onClick={onClose}>
                {t('common:cancel')}
              </Button>
              <Button
                type="submit"
                form="createTagForm"
                disabled={
                  tagCreateMutation.isLoading || tagUpdateMutation.isLoading
                }
                isLoading={
                  tagCreateMutation.isLoading || tagUpdateMutation.isLoading
                }
              >
                {tag ? t('common:save') : t('common:create')}
              </Button>
            </ActionsWrapper>
          </>
        }
      >
        <Content>
          <form
            id="createTagForm"
            onSubmit={handleSubmit((values) => {
              tag ? updateTag(values.name) : createTag(values.name);
            })}
          >
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormField
                  label={t('tags:name')}
                  id={field.name}
                  error={error?.message}
                  required
                >
                  <Input id={field.name} {...field} isInvalid={!!error} />
                </FormField>
              )}
            />
          </form>
        </Content>
      </ModalLayout>
    </Modal>
  );
};

export default TagFormModal;
