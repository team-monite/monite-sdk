import { FC, createElement } from 'react';
import { UniconProps } from '../types/Unicon';

const UCropAlt: FC<UniconProps> = ({
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
      d: 'M19,16H18V7a1,1,0,0,0-1-1H8V5A1,1,0,0,0,6,5V6H5A1,1,0,0,0,5,8H6v9a1,1,0,0,0,1,1h9v1a1,1,0,0,0,2,0V18h1a1,1,0,0,0,0-2Zm-3,0H8V8h8Z',
    })
  );

export default UCropAlt;
