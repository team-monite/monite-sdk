import { FC, createElement } from 'react';
import { UniconProps } from '../types/Unicon';

const UAlignLetterRight: FC<UniconProps> = ({
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
      d: 'M10,4H21a1,1,0,0,0,0-2H10a1,1,0,0,0,0,2ZM21,20H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2ZM21,6H3A1,1,0,0,0,3,8H21a1,1,0,0,0,0-2Zm0,10H11a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Zm0-6H3a1,1,0,0,0,0,2H21a1,1,0,0,0,0-2Z',
    })
  );

export default UAlignLetterRight;
