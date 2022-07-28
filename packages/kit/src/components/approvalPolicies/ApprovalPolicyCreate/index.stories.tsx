import ApprovalPolicyCreate from './ApprovalPolicyCreate';

const Story = {
  title: 'Approval Policy Create form',
  component: ApprovalPolicyCreate,
};
export default Story;

export const DefaultForm = () => (
  <ApprovalPolicyCreate handleOnCancel={() => {}} />
);
