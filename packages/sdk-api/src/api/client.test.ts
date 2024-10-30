import { isMoniteEntityIdPath } from '@/api/client';

describe('moniteEntityIdPathsRegExp', () => {
  test('should not match paths that are not in the list of paths that require', () => {
    expect(isMoniteEntityIdPath('/auth')).toBe(false);
    expect(isMoniteEntityIdPath('/entities')).toBe(false);
    expect(isMoniteEntityIdPath('/entity_users/my_entity')).toBe(false);
    expect(isMoniteEntityIdPath('/events')).toBe(false);
    expect(isMoniteEntityIdPath('/mail_templates')).toBe(false);
    expect(isMoniteEntityIdPath('/webhook_subscriptions')).toBe(false);
    expect(isMoniteEntityIdPath('/webhook_settings')).toBe(false);
    expect(isMoniteEntityIdPath('/receivables/variables')).toBe(false);
    expect(isMoniteEntityIdPath('/settings')).toBe(false);
    expect(isMoniteEntityIdPath('/files')).toBe(false);
    expect(isMoniteEntityIdPath('/mailbox_domains')).toBe(false);
    expect(isMoniteEntityIdPath('/payable_purchase_orders')).toBe(false);
    expect(isMoniteEntityIdPath('/frontend/bank_account_masks')).toBe(false);
    expect(isMoniteEntityIdPath('/frontend/document_type_descriptions')).toBe(
      false
    );
    expect(isMoniteEntityIdPath('/frontend/person_mask')).toBe(false);
    expect(
      isMoniteEntityIdPath(
        '/frontend/bank_accounts_currency_to_supported_countries'
      )
    ).toBe(false);
    expect(isMoniteEntityIdPath('/internal')).toBe(false);
  });

  test('should match paths that are in the list of paths that require', () => {
    expect(isMoniteEntityIdPath('/foo')).toBe(true);
    expect(isMoniteEntityIdPath('/bar')).toBe(true);
    expect(isMoniteEntityIdPath('/foo/bar')).toBe(true);
    expect(isMoniteEntityIdPath('/foo/bar/baz')).toBe(true);
  });
});
