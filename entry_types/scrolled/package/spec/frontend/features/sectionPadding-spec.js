import {renderEntry, useInlineEditingPageObjects} from 'support/pageObjects';

import '@testing-library/jest-dom/extend-expect';

import {usePortraitOrientation} from 'frontend/usePortraitOrientation';
jest.mock('frontend/usePortraitOrientation');

describe('section padding', () => {
  useInlineEditingPageObjects();

  it('adds padding to bottom of section by default', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).hasBottomPadding()).toBe(true);
  });

  it('does not add padding to bottom of section if last content element is full width', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5, configuration: {width: 3}}]
      }
    });

    expect(getSectionByPermaId(6).hasBottomPadding()).toBe(false);
  });

  it('adds padding below full width element if section is selected', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{sectionId: 5, configuration: {position: 'full'}}]
      }
    });

    const section = getSectionByPermaId(6);
    section.select();

    expect(section.hasBottomPadding()).toBe(true);
  });

  it('adds padding below full width element if element is selected', () => {
    const {getSectionByPermaId, getContentElementByTestId} = renderEntry({
      seed: {
        sections: [{id: 5, permaId: 6}],
        contentElements: [{
          sectionId: 5,
          typeName: 'withTestId',
          configuration: {testId: 10, position: 'full'}
        }]
      }
    });

    getContentElementByTestId(10).select();

    expect(getSectionByPermaId(6).hasBottomPadding()).toBe(true);
  });

  it('supports setting custom foreground padding', () => {
    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{
          id: 5,
          permaId: 6,
          configuration: {
            paddingTop: 'lg',
            paddingBottom: 'md'
          }
        }],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).el).toHaveStyle({
      '--foreground-padding-top': 'var(--theme-section-padding-top-lg)',
      '--foreground-padding-bottom': 'var(--theme-section-padding-bottom-md)',
    });
  });

  it('supports portrait custom foreground padding', () => {
    usePortraitOrientation.mockReturnValue(true);

    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{
          id: 5,
          permaId: 6,
          configuration: {
            paddingTop: 'lg',
            paddingBottom: 'md',
            portraitPaddingTop: 'sm',
            portraitPaddingBottom: 'xs'
          }
        }],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).el).toHaveStyle({
      '--foreground-padding-top': 'var(--theme-section-padding-top-sm)',
      '--foreground-padding-bottom': 'var(--theme-section-padding-bottom-xs)',
    });
  });

  it('falls back to default padding if portrait padding not configured', () => {
    usePortraitOrientation.mockReturnValue(true);

    const {getSectionByPermaId} = renderEntry({
      seed: {
        sections: [{
          id: 5,
          permaId: 6,
          configuration: {
            paddingTop: 'lg',
            paddingBottom: 'md'
          }
        }],
        contentElements: [{sectionId: 5}]
      }
    });

    expect(getSectionByPermaId(6).el).toHaveStyle({
      '--foreground-padding-top': 'var(--theme-section-padding-top-lg)',
      '--foreground-padding-bottom': 'var(--theme-section-padding-bottom-md)',
    });
  });
});
