import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Button,
  Card,
  Input,
  SidebarLayout,
  Text,
} from '@monite/ui-kit-react';

import {
  FormItem,
  FooterWrapper,
  CardTable,
  CardTableHeaderCell,
  CardTableBodyCell,
} from '../styles';

import {
  NewPolicyFormFields,
  NewConditionFormFields,
  NewRuleFormFields,
} from '../../types';

interface Props {
  condition: NewConditionFormFields | null;
  rule: NewRuleFormFields | null;
  handleCreateCondition: () => void;
  handleCreateRule: () => void;
  handleOnCancel: () => void;
  onSubmit: (data: NewPolicyFormFields) => void;
}

const NewPolicyForm = ({
  condition,
  rule,
  handleCreateCondition,
  handleCreateRule,
  handleOnCancel,
  onSubmit,
}: Props) => {
  const { t } = useTranslation();
  const { control, handleSubmit } = useForm<NewPolicyFormFields>();

  return (
    <SidebarLayout
      header={<Text textSize="h3">{t('approvalPolicies:newPolicy')}</Text>}
      content={
        <form id="approvalPolicyCreate" onSubmit={handleSubmit(onSubmit)}>
          <FormItem
            label={t('approvalPolicies:policyName')}
            id="policyName"
            required
          >
            <Controller
              name="policyName"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...restField } }) => (
                <Input required {...restField} />
              )}
            />
          </FormItem>
          <FormItem
            label={t('approvalPolicies:policyDescription')}
            id="policyDescription"
          >
            <Controller
              name="policyDescription"
              control={control}
              defaultValue=""
              render={({ field: { ref, ...restField } }) => (
                <Input {...restField} as="textarea" rows={4} />
              )}
            />
          </FormItem>
          <FormItem
            label={t('approvalPolicies:conditions')}
            id="conditions"
            onClickInfo={() => {}}
          >
            <Card
              actions={
                <>
                  <Button variant="text" onClick={handleCreateCondition}>
                    {t('approvalPolicies:addCondition')}
                  </Button>
                </>
              }
            >
              {condition ? (
                <CardTable>
                  <thead>
                    <tr>
                      <CardTableHeaderCell>
                        <Text textSize="smallBold" align="left">
                          {t('common:type')}
                        </Text>
                      </CardTableHeaderCell>
                      <CardTableHeaderCell>
                        <Text textSize="smallBold" align="left">
                          {t('approvalPolicies:policyApplyCondition')}
                        </Text>
                      </CardTableHeaderCell>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <CardTableBodyCell>
                        {condition.conditionType?.label}
                      </CardTableBodyCell>
                      <CardTableBodyCell>
                        {/* TODO use badges for tags here */}
                        {condition.selectedTags
                          ?.map((tag) => tag.label)
                          .join(', ')}
                      </CardTableBodyCell>
                    </tr>
                  </tbody>
                </CardTable>
              ) : (
                <Box sx={{ padding: '12px 23px' }}>
                  {t('approvalPolicies:noConditionMessage')}
                </Box>
              )}
            </Card>
          </FormItem>
          <FormItem
            label={t('approvalPolicies:rules')}
            id="rules"
            onClickInfo={() => {}}
          >
            <Card
              actions={
                <>
                  <Button variant="text" onClick={handleCreateRule}>
                    {t('approvalPolicies:addRule')}
                  </Button>
                </>
              }
            >
              {rule ? (
                <CardTable>
                  <thead>
                    <tr>
                      <CardTableHeaderCell>
                        <Text textSize="smallBold" align="left">
                          {t('approvalPolicies:spendAmount')}
                        </Text>
                      </CardTableHeaderCell>
                      <CardTableHeaderCell>
                        <Text textSize="smallBold" align="left">
                          {t('approvalPolicies:whoApproved')}
                        </Text>
                      </CardTableHeaderCell>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <CardTableBodyCell>
                        0,00 - {rule.thresholdAmount} €
                      </CardTableBodyCell>
                      <CardTableBodyCell>
                        {t('approvalPolicies:noApprovalRequired')}
                      </CardTableBodyCell>
                    </tr>
                    <tr>
                      <CardTableBodyCell>
                        &gt; {rule.thresholdAmount} €
                      </CardTableBodyCell>
                      <CardTableBodyCell>
                        {/* TODO apply END/OR logic */}
                        {rule.approvals
                          .map((approval) =>
                            approval.map((item) => item.label).join(', ')
                          )
                          .join(' or ')}
                      </CardTableBodyCell>
                    </tr>
                  </tbody>
                </CardTable>
              ) : (
                <Box sx={{ padding: '12px 23px' }}>
                  {t('approvalPolicies:noRuleMessage')}
                </Box>
              )}
            </Card>
          </FormItem>
        </form>
      }
      footer={
        <FooterWrapper>
          <Button variant="text" color="secondary" onClick={handleOnCancel}>
            {t('common:cancel')}
          </Button>
          <Button type="submit" form="approvalPolicyCreate">
            {t('approvalPolicies:savePolicy')}
          </Button>
        </FooterWrapper>
      }
    />
  );
};

export default NewPolicyForm;
