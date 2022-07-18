import { Sidebar } from '../index';

const Story = {
  title: 'Components/Sidebar',
  component: Sidebar,
};
export default Story;

export const DefaultSidebar = () => {
  return (
    <Sidebar isOpen={true} onClickBackdrop={() => {}}>
      <div style={{ padding: 20 }}>Content</div>
    </Sidebar>
  );
};
