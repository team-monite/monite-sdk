import { FC, createElement } from 'react';
import { UniconProps } from '../types/Unicon';

const UPlusSquare: FC<UniconProps> = ({
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
      d: 'M9,13h2v2a1,1,0,0,0,2,0V13h2a1,1,0,0,0,0-2H13V9a1,1,0,0,0-2,0v2H9a1,1,0,0,0,0,2ZM21,2H3A1,1,0,0,0,2,3V21a1,1,0,0,0,1,1H21a1,1,0,0,0,1-1V3A1,1,0,0,0,21,2ZM20,20H4V4H20Z',
    })
  );

export default UPlusSquare;
