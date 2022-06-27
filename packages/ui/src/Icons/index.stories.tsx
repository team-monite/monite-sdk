import * as Icons from './';
import Card from '../Card';
import Tooltip from '../Tooltip';

const Story = {
  title: 'Components/Icons',
};
export default Story;

export const IconsList = () => {
  const icons = Object.entries(Icons);
  return (
    <div>
      <code>{`import {[name_icon]} from 'monite-ui`}';</code>
      <Card
        shadow
        style={{
          maxWidth: 600,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          padding: '24px',
          marginTop: '24px',
        }}
      >
        {icons.map(([name, IconComponent]) => (
          <div key={name} style={{ margin: '12px' }}>
            <IconComponent
              data-for={name}
              data-tip={name}
              width={24}
              height={24}
            />
            <Tooltip id={name} />
          </div>
        ))}
      </Card>
    </div>
  );
};

IconsList.story = {
  parameters: {
    storyshots: { disable: true },
  },
};
