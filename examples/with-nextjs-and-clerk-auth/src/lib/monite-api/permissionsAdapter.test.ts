import { permissionsAdapter } from '@/lib/monite-api/create-entity-role';
import type { components } from '@/lib/monite-api/schema';

describe('permissionsAdapter()', () => {
  it('should return the correct permission', () => {
    expect(
      permissionsAdapter({
        role: {
          delete: 'allowed',
          read: 'allowed',
          create: 'allowed',
          update: 'allowed',
        },
      } satisfies Pick<Parameters<typeof permissionsAdapter>[number], 'role'> as never)
    ).toEqual({
      objects: [
        {
          object_type: 'role',
          actions: [
            { action_name: 'delete', permission: 'allowed' },
            { action_name: 'read', permission: 'allowed' },
            { action_name: 'create', permission: 'allowed' },
            { action_name: 'update', permission: 'allowed' },
          ],
        },
      ],
    } satisfies components['schemas']['BizObjectsSchema']);
  });
});
