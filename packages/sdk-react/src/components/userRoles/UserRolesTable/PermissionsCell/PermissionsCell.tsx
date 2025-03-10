import { components } from '@/api';
import { getPermissionToLabelMap } from '@/components/userRoles/consts';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Grid } from '@mui/material';

import {
  isCommonPermissionObjectType,
  isPayablePermissionObjectType,
} from '../../UserRoleDetails/helpers';
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

  const filteredPermissionsObjects = permissions.objects
    ?.filter((object) => !!object.object_type)
    .filter(
      (object) =>
        isCommonPermissionObjectType(object.object_type) ||
        isPayablePermissionObjectType(object.object_type)
    )
    .filter(
      (object) =>
        object.actions &&
        !object.actions.every((action) => action.permission == 'not_allowed')
    )
    .sort((a, b) => {
      if (a.object_type && b.object_type) {
        return a.object_type.localeCompare(b.object_type);
      }
      return 0;
    });

  if (!filteredPermissionsObjects?.length) {
    return <Box>{t(i18n)`None`}</Box>;
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
