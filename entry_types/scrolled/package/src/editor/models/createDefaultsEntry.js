import Backbone from 'backbone';

import {ScrolledEntry} from './ScrolledEntry';

// Builds a minimal stand-in entry for use with `defineEntryDefaultsInputs`
// outside the editor (e.g. per-site entry template defaults in the admin),
// where no full entry has been booted.
//
// It reuses `ScrolledEntry`'s real `getScale` and `getComponentVariants`
// but bypasses the constructor, which requires a running editor (state
// collections, file types). Only the theme-derived accessors are
// available; anything else throws, which is what lets the accompanying spec
// verify that `defineEntryDefaultsInputs` depends on nothing more.
//
// `seed` is a scrolled entry seed as produced by the `scrolled_entry_json_seed`
// helper (only its `config.theme` is read). `themeName` is used to look up
// theme-specific variant labels (with a generic fallback), so it is optional.
export function createDefaultsEntry({seed, themeName}) {
  const entry = Object.create(ScrolledEntry.prototype);

  entry.scrolledSeed = seed;
  entry.metadata = new Backbone.Model({theme_name: themeName});

  return entry;
}
