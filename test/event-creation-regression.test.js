import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeEventForSave } from '../app/admin/eventUtils.js';
import { isEventRegistrationOpen } from '../lib/eventAccess.js';

test('new event gets a valid slug and future date before saving', () => {
  const normalized = normalizeEventForSave({ title: 'My New Event', slug: '', date: '', registrationOpen: true });

  assert.equal(normalized.title, 'My New Event');
  assert.match(normalized.slug, /^my-new-event$/);
  assert.equal(normalized.status, 'upcoming');
  assert.equal(normalized.registrationOpen, true);
  assert.ok(normalized.date.length >= 10);
});

test('registration is allowed when a new event is marked open and upcoming', () => {
  const event = {
    slug: 'my-new-event',
    title: 'My New Event',
    status: 'upcoming',
    registrationOpen: true,
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
  };

  assert.equal(isEventRegistrationOpen(event), true);
});
