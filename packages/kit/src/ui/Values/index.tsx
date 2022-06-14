import React from 'react';
import AntDescriptions from 'antd/es/descriptions/index';

import './styles.less';

type Value = {
  label: string;
  value: string;
};
type ValuesProps = {
  data: Value[];
};
const Values = ({ data }: ValuesProps) => {
  return (
    <AntDescriptions className="monite-values" column={1}>
      {data.map((item) => (
        <AntDescriptions.Item label={item.label}>
          {item.value}
        </AntDescriptions.Item>
      ))}
    </AntDescriptions>
  );
};

export default Values;
