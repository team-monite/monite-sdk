import { SidebarLayout } from './index';
import { Sidebar } from '../Sidebar';

const Story = {
  title: 'Components/Sidebar/Sidebar Layout',
  component: SidebarLayout,
};
export default Story;

export const DefaultSidebarLayout = () => {
  return (
    <Sidebar isOpen={true}>
      <SidebarLayout
        header={<div>Header</div>}
        content={<div>Content</div>}
        footer={<div>Footer</div>}
      />
    </Sidebar>
  );
};
