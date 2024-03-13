import React from 'react';

import { getPermissionToLabelMap } from '@/components/userRoles/consts';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { BizObjectsSchema } from '@monite/sdk-api';
import { Link, Grid } from '@mui/material';

import { Permission } from './Permission';

interface IPermissionsCellProps {
  /**
   *
   * @param permissions - The permissions data for the role to be displayed.
   */
  permissions: BizObjectsSchema;
}

/**
 * @function PermissionsCell
 * @description This is the main component for rendering the permissions of each role in a grid.
 * Each role and its corresponding permissions are rendered in a row. The permissions actions are represented by the Permission component.
 * If there are more than 10 object types, a "See all" link is rendered.
 */
export const PermissionsCell = ({ permissions }: IPermissionsCellProps) => {
  const { i18n } = useLingui();

  return (
    <Grid container>
      {permissions.objects?.slice(0, 10).map((object, index) => {
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
      {permissions.objects && permissions.objects.length > 10 && (
        // TODO onClick handler will be implemented in https://monite.atlassian.net/browse/DEV-9853
        <Link component="button" variant="body1">{t(i18n)`See all`}</Link>
      )}
    </Grid>
  );
};
