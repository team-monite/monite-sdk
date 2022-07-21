import React, { useEffect, useState } from 'react';
import { useTheme } from 'emotion-theming';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Multiselect,
  Select,
  SidebarLayout,
  Text,
  UArrowRight,
  Theme,
} from '@monite/ui';

import conditionTypes from '../../fixtures/conditionTypes';
import tags from '../../fixtures/tags';

import { NewConditionFormFields } from '../../types';

import {
  FormItem,
  TextSecondary,
  FooterWrapper,
  HeaderWrapper,
} from '../styles';

interface Props {
  handleOnCancel: () => void;
  onSubmit: (data: NewConditionFormFields) => void;
}

const NewConditionForm = ({ handleOnCancel, onSubmit }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { control, watch, handleSubmit } = useForm<NewConditionFormFields>();
  const watchConditionType = watch(['conditionType']);

  useEffect(() => {
    watchConditionType[0] && setSelectedType(watchConditionType[0].value);
  }, [watchConditionType]);

  return (
    <SidebarLayout
      header={
        <HeaderWrapper>
          <TextSecondary textSize="bold">
            {t('approvalPolicies:newPolicy')}
          </TextSecondary>
          <UArrowRight width={20} height={20} color={theme.colors.lightGrey1} />
          <Text textSize="bold">{t('approvalPolicies:editCondition')}</Text>
        </HeaderWrapper>
      }
      content={
        <form id="conditionEdit" onSubmit={handleSubmit(onSubmit)}>
          <FormItem
            label={t('approvalPolicies:conditionType')}
            id="conditionType"
            required
          >
            <Controller
              name="conditionType"
              control={control}
              defaultValue={null}
              render={({ field: { ref, ...restField } }) => (
                <Select options={conditionTypes} {...restField} />
              )}
            />
          </FormItem>
          {selectedType === 'tags' && (
            <FormItem
              label={t('approvalPolicies:selectedTags')}
              id="selectedTags"
              text={
                <span>
                  {t('approvalPolicies:conditionSelectedLogic')}{' '}
                  <Button variant="text">
                    <Text textSize="smallBold">
                      {/* TODO develop real switch logic, fix i18n */}
                      {t('approvalPolicies:switchLogic')}
                    </Text>
                  </Button>
                </span>
              }
            >
              <Controller
                name="selectedTags"
                control={control}
                defaultValue={[]}
                render={({ field: { ref, ...restField } }) => (
                  <Multiselect optionAsTag options={tags} {...restField} />
                )}
              />
            </FormItem>
          )}
        </form>
      }
      footer={
        <FooterWrapper>
          <Button variant="text" color="secondary" onClick={handleOnCancel}>
            {t('common:cancel')}
          </Button>
          <Button type="submit" form="conditionEdit">
            {t('approvalPolicies:saveCondition')}
          </Button>
        </FooterWrapper>
      }
    />
  );
};

export default NewConditionForm;
