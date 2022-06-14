import React from 'react';

import Button from '.';
import Space from '../Space';
import { MessageIcon } from '../Icons';

const Story = {
  title: 'Button',
  component: Button,
};
export default Story;

export const DefaultButton = () => (
  <Space size={12} direction="vertical">
    <Space size={6}>
      <Button>Default</Button>
      <Button icon={<MessageIcon width={24} height={24} />}>
        Default Icon
      </Button>
      <Button disabled>Default Disabled</Button>
      <Button disabled icon={<MessageIcon width={24} height={24} />} />
      <Button loading>Default</Button>
      <Button href="https://monite.com" target="_blank">
        Default
      </Button>
    </Space>
    <div>
      <Button block>Default Block</Button>
    </div>
    <Space size={6}>
      <Button type="primary" icon={<MessageIcon width={24} height={24} />}>
        Primary Icon
      </Button>
      <Button
        type="primary"
        disabled
        icon={<MessageIcon width={24} height={24} />}
      >
        Primary Disabled Icon
      </Button>
      <Button type="primary" icon={<MessageIcon width={24} height={24} />} />
      <Button type="primary" loading>
        Default
      </Button>
    </Space>
    <div>
      <Button type="primary" block>
        Primary Block
      </Button>
    </div>
    <Space size={6}>
      <Button danger icon={<MessageIcon width={24} height={24} />}>
        Danger Icon
      </Button>
      <Button danger disabled icon={<MessageIcon width={24} height={24} />}>
        Danger Disabled Icon
      </Button>
      <Button danger icon={<MessageIcon width={24} height={24} />} />
    </Space>
    <div>
      <Button danger block>
        Danger Block
      </Button>
    </div>
    <Space size={6}>
      <Button type="text" icon={<MessageIcon width={24} height={24} />}>
        Text Icon
      </Button>
      <Button
        type="text"
        disabled
        icon={<MessageIcon width={24} height={24} />}
      >
        Text Disabled Icon
      </Button>
      <Button type="text" icon={<MessageIcon width={24} height={24} />} />
    </Space>
    <div>
      <Button type="text" block>
        Text Block
      </Button>
    </div>
    <Space size={6}>
      <Button type="link" icon={<MessageIcon width={24} height={24} />}>
        Link Icon
      </Button>
      <Button type="link" danger icon={<MessageIcon width={24} height={24} />}>
        Link Danger Icon
      </Button>
      <Button
        type="link"
        disabled
        icon={<MessageIcon width={24} height={24} />}
      >
        Link Disabled Icon
      </Button>
      <Button
        type="link"
        danger
        disabled
        icon={<MessageIcon width={24} height={24} />}
      >
        Link Danger Disabled Icon
      </Button>
      <Button type="link" icon={<MessageIcon width={24} height={24} />} />
    </Space>
    <div>
      <Button type="link" block>
        Link Block
      </Button>
    </div>
  </Space>
);
