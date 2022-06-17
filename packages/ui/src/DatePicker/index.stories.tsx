import { useState } from 'react';

import DatePicker from '.';

import {
  Title,
  Subtitle,
  Description,
  Primary,
  ArgsTable,
  Stories,
  PRIMARY_STORY,
} from '@storybook/addon-docs';

const Story = {
  title: 'DatePicker',
  component: DatePicker,
  parameters: {
    docs: {
      page: () => (
        <>
          <Title />
          <Subtitle>
            <div>
              <span>Used library </span>
              <a
                target="_blank"
                href="https://github.com/Hacker0x01/react-datepicker"
                rel="noreferrer"
              >
                react-datepicker
              </a>
              <br />
              <span>The examples of usage and customization are </span>
              <a
                target="_blank"
                href="https://reactdatepicker.com/#example-monthyear-dropdow"
                rel="noreferrer"
              >
                here
              </a>
            </div>
          </Subtitle>
          <Description>
            Now there are only props date, onChange and className, but, if
            nesessary, component will be developed
          </Description>
          <Primary />
          <ArgsTable story={PRIMARY_STORY} />
          <Stories />
        </>
      ),
    },
  },
};

export default Story;

export const DefaultDatePicker = () => {
  const [date, setDate] = useState<Date | null>(
    new Date('Tue Jun 07 2022 10:00:00 GMT+0300 (GMT+03:00)')
  );

  return (
    <div style={{ height: 350, width: 300 }}>
      <DatePicker date={date} onChange={setDate} />
    </div>
  );
};
