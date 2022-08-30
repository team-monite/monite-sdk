import ApprovalPolicyCreate from './ApprovalPolicyCreate';

const Story = {
  title: 'In Progress/Approval Policies — Form Create',
  component: ApprovalPolicyCreate,
};
export default Story;

export const DefaultForm = () => (
  <ApprovalPolicyCreate handleOnCancel={() => {}} />
);
