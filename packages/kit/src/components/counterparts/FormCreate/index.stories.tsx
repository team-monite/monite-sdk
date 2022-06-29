import React from 'react';

import Form from '.';
import { Box, Button } from '@monite/ui';

const Story = {
  title: 'CounterpartsFormCreate',
  component: Form,
};
export default Story;

export const DefaultForm = () => (
  <div style={{ maxWidth: 500 }}>
    <Form />
    <Box sx={{ paddingTop: 32 }}>
      <Button type="submit" form="createCounterpart">
        Create
      </Button>
    </Box>
  </div>
);
