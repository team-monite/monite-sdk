import React from 'react';

import { components } from '@/api';
import { getPermissionToLabelMap } from '@/components/userRoles/consts';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Grid, Link } from '@mui/material';

import { Permission } from './Permission';

interface PermissionsCellProps {
  /**
   *
   * @param permissions - The permissions data for the role to be displayed.
   */
  permissions: components['schemas']['BizObjectsSchema'];
  onCLickSeeAll: () => void;
}

export const PermissionsCell = ({
  permissions,
  onCLickSeeAll,
}: PermissionsCellProps) => {
  const { i18n } = useLingui();

  if (!permissions.objects) {
    return null;
  }

  return (
    <Grid container>
      {permissions.objects
        .slice(0, 10)
        .filter((object) => !!object.object_type)
        .map((object) => (
          <Grid item container key={object.object_type}>
            <Grid item xs={6}>
              {getPermissionToLabelMap(i18n)[object.object_type!]}
            </Grid>
            <Grid item xs={6}>
              {object.actions && <Permission actions={object.actions} />}
            </Grid>
          </Grid>
        ))}
      {permissions.objects && permissions.objects.length > 10 && (
        <Link component="button" variant="body1" onClick={onCLickSeeAll}>
          {t(i18n)`See all`}
        </Link>
      )}
    </Grid>
  );
};
