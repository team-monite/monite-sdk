import React from 'react';

import Link from 'next/link';

import { LocationLinkType } from '@monite/sdk-react';

export const LocationLink: LocationLinkType = ({
  href,
  children,
  className,
}) => {
  const to = `${href}?refreshId=${new Date().getTime()}`;

  return (
    <Link className={className} href={to}>
      {children}
    </Link>
  );
};
