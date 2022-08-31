import { FC, createElement } from 'react';
import { UniconProps } from '../types/Unicon';

const UInfo: FC<UniconProps> = ({
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
      d: 'M12,10a1,1,0,0,0-1,1v6a1,1,0,0,0,2,0V11A1,1,0,0,0,12,10Zm0-4a1.25,1.25,0,1,0,1.25,1.25A1.25,1.25,0,0,0,12,6Z',
    })
  );

export default UInfo;
