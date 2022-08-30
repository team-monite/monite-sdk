import { FC, createElement } from 'react';
import { UniconProps } from '../unicons/types/Unicon';

const U0Plus: FC<UniconProps> = ({ size, ...otherProps }) =>
  createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      width: size,
      height: size,
      viewBox: '0 0 16 16',
      fill: 'none',
      ...otherProps,
    },
    createElement('path', {
      stroke: 'currentColor',
      strokeWidth: '2',
      d: 'M15 8C15 9.4626 14.5419 10.8885 13.6899 12.0773C12.838 13.2662 11.6351 14.1584 10.2501 14.6285C8.86509 15.0986 7.36763 15.1232 5.96801 14.6986C4.56838 14.274 3.3369 13.4217 2.44653 12.2613C1.55615 11.101 1.0516 9.69085 1.00375 8.22903C0.955893 6.76721 1.36713 5.32712 2.17971 4.11101C2.99229 2.8949 4.16539 1.96386 5.53425 1.44866C6.90311 0.933456 8.39897 0.859969 9.81173 1.23852',
    })
  );

export default U0Plus;
