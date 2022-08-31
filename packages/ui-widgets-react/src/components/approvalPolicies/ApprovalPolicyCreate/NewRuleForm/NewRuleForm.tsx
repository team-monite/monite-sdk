import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Controller, useForm } from 'react-hook-form';
import { useTheme } from 'emotion-theming';
import {
  Box,
  Button,
  Card,
  Input,
  Multiselect,
  SidebarLayout,
  Text,
  Theme,
  UArrowRight,
} from '@monite/ui-kit-react';

import users from '../../fixtures/users';

import {
  FooterWrapper,
  FormItem,
  HeaderWrapper,
  TextSecondary,
} from '../styles';

import { Option, NewRuleFormFields } from '../../types';

interface Props {
  handleOnCancel: () => void;
  onSubmit: (data: NewRuleFormFields) => void;
}

const NewRuleForm = ({ handleOnCancel, onSubmit }: Props) => {
  const { t } = useTranslation();
  const theme = useTheme<Theme>();
  const { control, watch, handleSubmit } = useForm<NewRuleFormFields>();
  const [approvals, setApprovals] = useState<Option[][]>([[]]);

  const watchThresholdAmount = watch(['thresholdAmount']);

  return (
    <SidebarLayout
      header={
        <HeaderWrapper>
          <TextSecondary textSize="bold">
            {t('approvalPolicies:newPolicy')}
          </TextSecondary>
          <UArrowRight width={20} height={20} color={theme.colors.lightGrey1} />
          <Text textSize="bold">{t('approvalPolicies:editRule')}</Text>
        </HeaderWrapper>
      }
      content={
        <form id="ruleEdit" onSubmit={handleSubmit(onSubmit)}>
          <FormItem
            label={t('approvalPolicies:thresholdAmount')}
            id="thresholdAmount"
            required
          >
            <Controller
              name="thresholdAmount"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...restField } }) => (
                // TODO add currency symbol
                <Input required type="number" {...restField} />
              )}
            />
          </FormItem>
          {watchThresholdAmount[0] && (
            <FormItem label={t('approvalPolicies:approvals')} id="approvals">
              <Card
                actions={
                  <Button
                    variant="text"
                    onClick={() =>
                      setApprovals((prevState) => [...prevState, []])
                    }
                  >
                    {t('approvalPolicies:addAdditionalApprover')}
                  </Button>
                }
              >
                <Box
                  sx={{
                    padding: 32,
                    borderBottom: `1px solid ${theme.colors.lightGrey2}`,
                  }}
                >
                  <Text color={theme.colors.grey}>
                    {t('approvalPolicies:addAdditionalApproverDescription')}
                  </Text>
                  <Button variant="text">
                    {t('approvalPolicies:changeApprovalProcess')}
                  </Button>
                </Box>
                {approvals.map((approval, index) => (
                  <Box
                    key={index}
                    sx={{
                      padding: 32,
                      borderBottom:
                        index + 1 !== approvals.length
                          ? `1px solid ${theme.colors.lightGrey2}`
                          : undefined,
                    }}
                  >
                    <FormItem
                      label=""
                      id={`approvals[${index}]`}
                      text={
                        <span>
                          {t('approvalPolicies:ruleApprovalLogicDescription')}{' '}
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
                        name={`approvals.${index}`}
                        control={control}
                        defaultValue={[]}
                        render={({ field: { ref, ...restField } }) => (
                          <Multiselect
                            optionAsTag
                            options={users}
                            {...restField}
                          />
                        )}
                      />
                    </FormItem>
                  </Box>
                ))}
              </Card>
            </FormItem>
          )}
        </form>
      }
      footer={
        <FooterWrapper>
          <Button variant="text" color="secondary" onClick={handleOnCancel}>
            {t('common:cancel')}
          </Button>
          <Button type="submit" form="ruleEdit">
            {t('approvalPolicies:saveRule')}
          </Button>
        </FooterWrapper>
      }
    />
  );
};

export default NewRuleForm;
