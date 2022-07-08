import { FC, createElement } from 'react';
import { UniconProps } from '../types/Unicon';

const USignalAlt: FC<UniconProps> = ({
  color = 'currentColor',
  size,
  ...otherProps
}) =>
  createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: color,
      ...otherProps,
    },
    createElement('path', {
      d: 'M10,14a1,1,0,0,0-1,1v6a1,1,0,0,0,2,0V15A1,1,0,0,0,10,14ZM5,18a1,1,0,0,0-1,1v2a1,1,0,0,0,2,0V19A1,1,0,0,0,5,18ZM20,2a1,1,0,0,0-1,1V21a1,1,0,0,0,2,0V3A1,1,0,0,0,20,2ZM15,9a1,1,0,0,0-1,1V21a1,1,0,0,0,2,0V10A1,1,0,0,0,15,9Z',
    })
  );

export default USignalAlt;
