import test from 'node:test';
import assert from 'node:assert/strict';

import { hasUnsavedChanges } from '../app/admin/dirtyState.js';

test('detects unsaved changes when data differs from baseline', () => {
  const base = { title: 'Old title', status: 'upcoming' };
  const next = { title: 'New title', status: 'upcoming' };

  assert.equal(hasUnsavedChanges(base, next), true);
  assert.equal(hasUnsavedChanges(base, base), false);
  assert.equal(hasUnsavedChanges(base, { ...base, status: 'past' }), true);
});
