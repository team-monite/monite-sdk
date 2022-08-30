import React, { useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import NewPolicyForm from './NewPolicyForm';
import NewConditionForm from './NewConditionForm';
import NewRuleForm from './NewRuleForm';
import {
  NewPolicyFormFields,
  NewConditionFormFields,
  NewRuleFormFields,
} from '../types';

const FORM_STEPS = {
  policy: 'policy',
  condition: 'condition',
  rule: 'rule',
};

interface Props {
  handleOnCancel: () => void;
}

const ApprovalPolicyCreate = ({ handleOnCancel }: Props) => {
  const [formStep, setFormStep] = useState(FORM_STEPS.policy);
  const [newCondition, setNewCondition] =
    useState<NewConditionFormFields | null>(null);
  const [newRule, setNewRule] = useState<NewRuleFormFields | null>(null);

  const handleSubmitNewCondition = (data: NewConditionFormFields) => {
    setNewCondition(data);
    setFormStep(FORM_STEPS.policy);
  };

  const handleSubmitNewRule = (data: NewRuleFormFields) => {
    setNewRule(data);
    setFormStep(FORM_STEPS.policy);
  };

  const onSubmit: SubmitHandler<NewPolicyFormFields> = (data) => {
    // TODO here we have data from all three forms. Prepare and save it
    console.log({ newCondition, newRule, newPolicy: data });
  };

  switch (formStep) {
    case 'condition':
      return (
        <NewConditionForm
          handleOnCancel={() => setFormStep(FORM_STEPS.policy)}
          onSubmit={handleSubmitNewCondition}
        />
      );
    case 'rule':
      return (
        <NewRuleForm
          handleOnCancel={() => setFormStep(FORM_STEPS.policy)}
          onSubmit={handleSubmitNewRule}
        />
      );
    default:
      return (
        <NewPolicyForm
          condition={newCondition}
          rule={newRule}
          handleCreateCondition={() => setFormStep(FORM_STEPS.condition)}
          handleCreateRule={() => setFormStep(FORM_STEPS.rule)}
          handleOnCancel={handleOnCancel}
          onSubmit={onSubmit}
        />
      );
  }
};

export default ApprovalPolicyCreate;
