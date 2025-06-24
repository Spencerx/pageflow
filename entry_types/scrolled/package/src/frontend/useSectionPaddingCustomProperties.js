import {usePortraitOrientation} from './usePortraitOrientation';

export function useSectionPaddingCustomProperties(section) {
  const styles = {};

  const portrait = usePortraitOrientation({
    active: section.portraitPaddingTop ||
            section.portraitPaddingBottom
  });

  const paddingTop =
    portrait && section.portraitPaddingTop ?
    section.portraitPaddingTop : section.paddingTop;

  const paddingBottom =
    portrait && section.portraitPaddingBottom  ?
    section.portraitPaddingBottom : section.paddingBottom;

  if (paddingTop) {
    styles['--foreground-padding-top'] =
      `var(--theme-section-padding-top-${paddingTop})`;
  }

  if (paddingBottom) {
    styles['--foreground-padding-bottom'] =
      `var(--theme-section-padding-bottom-${paddingBottom})`;
  }

  return styles;
}
