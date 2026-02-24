import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {factories} from 'pageflow/testHelpers';
import {normalizeSeed} from 'support';

describe('ScrolledEntry', () => {
  describe('#getUsedContentElementColors', () => {
    it('returns unique sorted list of used colors for given property', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {configuration: {waveformColor: '#400'}},
              {configuration: {waveformColor: '#040'}},
              {configuration: {waveformColor: '#400'}}
            ]
          })
        }
      );

      const colors = entry.getUsedContentElementColors('waveformColor');

      expect(colors).toEqual(['#400', '#040']);
    });

    it('ignores blank values', () => {
      const entry = factories.entry(
        ScrolledEntry,
        {},
        {
          entryTypeSeed: normalizeSeed({
            contentElements: [
              {configuration: {}},
              {configuration: {waveformColor: undefined}}
            ]
          })
        }
      );

      const colors = entry.getUsedContentElementColors('waveformColor');

      expect(colors).toEqual([]);
    });
  });
});
