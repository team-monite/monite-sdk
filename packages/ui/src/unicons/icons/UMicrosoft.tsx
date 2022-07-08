import { FC, createElement } from 'react';
import { UniconProps } from '../types/Unicon';

const UMicrosoft: FC<UniconProps> = ({
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
      d: 'M2,22h9.5v-9.5H2V22z M2,11.5h9.5V2H2V11.5z M12.5,2v9.5H22V2H12.5z M12.5,22H22v-9.5h-9.5V22z',
    })
  );

export default UMicrosoft;
