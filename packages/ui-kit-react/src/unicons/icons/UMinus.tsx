import { FC, createElement } from 'react';
import { UniconProps } from '../types/Unicon';

const UMinus: FC<UniconProps> = ({
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
      d: 'M19,11H5a1,1,0,0,0,0,2H19a1,1,0,0,0,0-2Z',
    })
  );

export default UMinus;
