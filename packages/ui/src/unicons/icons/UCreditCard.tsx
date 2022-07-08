import { FC, createElement } from 'react';
import { UniconProps } from '../types/Unicon';

const UCreditCard: FC<UniconProps> = ({
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
      d: 'M7,15h3a1,1,0,0,0,0-2H7a1,1,0,0,0,0,2ZM19,5H5A3,3,0,0,0,2,8v9a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V8A3,3,0,0,0,19,5Zm1,12a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V11H20Zm0-8H4V8A1,1,0,0,1,5,7H19a1,1,0,0,1,1,1Z',
    })
  );

export default UCreditCard;
