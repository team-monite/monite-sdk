import React from 'react';

import { MessageIcon } from '../Icons';
import Tag from '.';

const Story = {
  title: 'Tag',
  component: Tag,
};
export default Story;

export const Tags = () => (
  <>
    <Tag>Vendor</Tag>
    <br />
    <br />
    <Tag closable>Customer</Tag>
    <br />
    <br />
    <Tag icon={<MessageIcon />} closable>
      Customer
    </Tag>
    <br />
    <br />
    <Tag status="draft">draft</Tag>
    <br />
    <br />
    <Tag status="disabled">disabled</Tag>
    <br />
    <br />
    <Tag status="pending">pending</Tag>
    <br />
    <br />
    <Tag status="partially">partially</Tag>
    <br />
    <br />
    <Tag status="warning">warning</Tag>
    <br />
    <br />
    <Tag status="success">success</Tag>
    <br />
    <br />
    <Tag status="archived">archived</Tag>
  </>
);
