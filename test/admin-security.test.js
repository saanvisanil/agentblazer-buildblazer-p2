import test from 'node:test';
import assert from 'node:assert/strict';

process.env.SESSION_SECRET = 'test-secret';

import { createSessionCookie, getSession, canGrantRole } from '../lib/session.js';

test('leader can grant any role and non-leaders cannot grant permissions', () => {
  assert.equal(canGrantRole('leader', 'event_editor'), true);
  assert.equal(canGrantRole('leader', 'content_editor'), true);
  assert.equal(canGrantRole('event_editor', 'leader'), false);
  assert.equal(canGrantRole('viewer', 'event_editor'), false);
});

test('session cookie keeps username, role identity, and permissions', () => {
  const cookie = createSessionCookie({ username: 'leader', role: 'leader' });
  const session = getSession(cookie.value);

  assert.deepEqual(session, {
    username: 'leader',
    role: 'leader',
    permissions: ['events', 'team', 'site', 'announcements', 'achievements', 'applications', 'users']
  });
});
