import { ReactNode } from 'react';

import { CenteredContentBox } from '@/ui/box';
import { useDialog } from '@/ui/Dialog';
import { IconWrapper } from '@/ui/iconWrapper';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { LockKeyhole, X } from 'lucide-react';

export interface AccessRestrictionProps {
  title?: ReactNode;
  description?: ReactNode;
}

export const AccessRestriction = (props: AccessRestrictionProps) => {
  const className = 'Monite-AccessRestriction';
  const dialogContext = useDialog();
  const { i18n } = useLingui();
  const title = props.title ?? t(i18n)`Access Restricted`;
  const description = props.description ?? (
    <Trans>
      You don’t have permissions to view this page.
      <br />
      Contact your system administrator for details.
    </Trans>
  );

  return (
    <>
      {dialogContext && (
        <div
          className={`mtw:flex mtw:justify-end mtw:p-4 ${className}-InDialog-Header`}
        >
          <IconWrapper
            onClick={dialogContext.onClose}
            color="inherit"
            aria-label="close"
          >
            <X />
          </IconWrapper>
        </div>
      )}
      <CenteredContentBox className={className + '-Content'}>
        <div className="mtw:flex mtw:flex-col mtw:items-center mtw:space-y-4">
          <LockKeyhole className="mtw:w-8 mtw:h-8 mtw:text-primary" />
          <div className="mtw:flex mtw:flex-col mtw:items-center mtw:space-y-2">
            <h3 className="mtw:text-2xl mtw:font-semibold">{title}</h3>
            <p className="mtw:text-center">{description}</p>
          </div>
        </div>
      </CenteredContentBox>
    </>
  );
};
