import { renderWithClient } from '@/utils/test-utils';
import { components } from '@monite/sdk-api/src/api';
import { screen, act, fireEvent } from '@testing-library/react';

import { PermissionsCell } from './PermissionsCell';

const ALLOWED_READ_PERMISSION = 'R';
const NOT_ALLOWED_PERMISSION = '-';

describe('PermissionsCell', () => {
  test("should render 'R' for allowed read permission and '-' for not allowed create permission", () => {
    const onClickSeeAllMock = jest.fn();
    const actions: components['schemas']['ActionSchema'][] = [
      {
        action_name: 'read',
        permission: 'allowed',
      },
      {
        action_name: 'create',
        permission: 'not_allowed',
      },
    ];

    const permissions: components['schemas']['BizObjectsSchema'] = {
      objects: [
        {
          object_type: 'payment_record',
          actions: actions,
        },
      ],
    };

    renderWithClient(
      <PermissionsCell
        permissions={permissions}
        onCLickSeeAll={onClickSeeAllMock}
      />
    );

    const allowedPermissionElement = screen.getByText(ALLOWED_READ_PERMISSION);
    expect(allowedPermissionElement).toBeInTheDocument();

    const dashElement = screen.getByText(NOT_ALLOWED_PERMISSION);
    expect(dashElement).toBeInTheDocument();
  });

  test('tooltip should contain action names when a permission letter is hovered over', async () => {
    const onClickSeeAllMock = jest.fn();
    const actions: components['schemas']['ActionSchema'][] = [
      {
        action_name: 'read',
        permission: 'allowed',
      },
      {
        action_name: 'create',
        permission: 'not_allowed',
      },
    ];

    const permissions: components['schemas']['BizObjectsSchema'] = {
      objects: [
        {
          object_type: 'payment_record',
          actions: actions,
        },
      ],
    };

    renderWithClient(
      <PermissionsCell
        permissions={permissions}
        onCLickSeeAll={onClickSeeAllMock}
      />
    );

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
});
