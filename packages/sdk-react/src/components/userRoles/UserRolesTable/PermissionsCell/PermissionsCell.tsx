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
  permissions: components['schemas']['BizObjectsSchema-Input'];
}

export const PermissionsCell = ({ permissions }: PermissionsCellProps) => {
  const { i18n } = useLingui();

  if (!permissions.objects) {
    return null;
  }

  return (
    <Grid container>
      {filteredPermissionsObjects.map((object) => (
          <Grid item container key={object.object_type}>
            <Grid item xs={6}>
              {
                getPermissionToLabelMap(i18n)[
                  object.object_type as keyof ReturnType<
                    typeof getPermissionToLabelMap
                  >
                ]
              }
            </Grid>
            <Grid item xs={6}>
              {object.actions && <Permission actions={object.actions} />}
            </Grid>
          </Grid>
        ))}
    </Grid>
  );
};
