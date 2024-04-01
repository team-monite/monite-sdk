import React from 'react';

import { getPermissionToLabelMap } from '@/components/userRoles/consts';
import { useLingui } from '@lingui/react';
import { BizObjectsSchema } from '@monite/sdk-api';
import { Grid } from '@mui/material';

import { Permission } from './Permission';

interface PermissionsCellProps {
  /**
   *
   * @param permissions - The permissions data for the role to be displayed.
   */
  permissions: BizObjectsSchema;
}

export const PermissionsCell = ({ permissions }: PermissionsCellProps) => {
  const { i18n } = useLingui();

  if (!permissions.objects) {
    return null;
  }

  return (
    <Grid container>
      {permissions.objects.map((object) => {
        if (object.object_type) {
          return (
            <Grid item container key={object.object_type}>
              <Grid item xs={6}>
                {getPermissionToLabelMap(i18n)[object.object_type]}
              </Grid>
              <Grid item xs={6}>
                {object.actions && <Permission actions={object.actions} />}
              </Grid>
            </Grid>
          );
        }

        return null;
      })}
    </Grid>
  );
};
