import { fullPermissionRole } from '@/mocks/roles';
import { renderWithClient } from '@/utils/test-utils';
import {
  ActionEnum,
  ActionSchema,
  BizObjectsSchema,
  PermissionEnum,
} from '@monite/sdk-api';
import { screen, act, fireEvent } from '@testing-library/react';

import { PermissionsCell } from './PermissionsCell';

const ALLOWED_READ_PERMISSION = 'R';
const NOT_ALLOWED_PERMISSION = '-';

describe('PermissionsCell', () => {
  test("should render 'R' for allowed read permission and '-' for not allowed create permission", () => {
    const actions: ActionSchema[] = [
      {
        action_name: ActionEnum.READ,
        permission: PermissionEnum.ALLOWED,
      },
      {
        action_name: ActionEnum.CREATE,
        permission: PermissionEnum.NOT_ALLOWED,
      },
    ];

    const permissions: BizObjectsSchema = {
      objects: [
        {
          object_type: 'payment_record',
          actions: actions,
        },
      ],
    };

    renderWithClient(<PermissionsCell permissions={permissions} />);

    const allowedPermissionElement = screen.getByText(ALLOWED_READ_PERMISSION);
    expect(allowedPermissionElement).toBeInTheDocument();

    const dashElement = screen.getByText(NOT_ALLOWED_PERMISSION);
    expect(dashElement).toBeInTheDocument();
  });

  test('tooltip should contain action names when a permission letter is hovered over', async () => {
    const actions: ActionSchema[] = [
      {
        action_name: ActionEnum.READ,
        permission: PermissionEnum.ALLOWED,
      },
      {
        action_name: ActionEnum.CREATE,
        permission: PermissionEnum.NOT_ALLOWED,
      },
      {
        action_name: ActionEnum.DELETE,
        permission: undefined,
      },
    ];

    const permissions: BizObjectsSchema = {
      objects: [
        {
          object_type: 'payment_record',
          actions: actions,
        },
      ],
    };

    renderWithClient(<PermissionsCell permissions={permissions} />);

    const permissionElement = screen.getByText(ALLOWED_READ_PERMISSION);

    await act(() => {
      fireEvent(
        permissionElement,
        new MouseEvent('mouseover', {
          bubbles: true,
        })
      );
    });

    const tooltipElement = await screen.findByText(/Read/);

    expect(tooltipElement).toBeInTheDocument();
  });

  test('should render "See all" link when there are more than 10 object types', () => {
    const permissions: BizObjectsSchema = {
      objects: Array(11).fill(fullPermissionRole.permissions.objects![0]),
    };

    renderWithClient(<PermissionsCell permissions={permissions} />);

    const seeAllLinkElement = screen.getByText('See all');
    expect(seeAllLinkElement).toBeInTheDocument();
  });

  test('should not render "See all" link when there are 10 or less object types', () => {
    const permissions: BizObjectsSchema = {
      objects: Array(10).fill(fullPermissionRole.permissions.objects![0]),
    };

    renderWithClient(<PermissionsCell permissions={permissions} />);

    const seeAllLinkElement = screen.queryByText('See all');
    expect(seeAllLinkElement).not.toBeInTheDocument();
  });
});
