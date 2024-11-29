import {ConfigurationEditorTabView, SelectInputView, SliderInputView} from 'pageflow/ui';

import {
  TypographyVariantSelectInputView
} from '../../inputs/TypographyVariantSelectInputView';

import {
  ColorSelectInputView
} from '../../inputs/ColorSelectInputView';

import {
  PositionSelectInputView
} from '../../inputs/PositionSelectInputView';

ConfigurationEditorTabView.groups.define('ContentElementPosition', function() {
  const contentElement = this.model.parent;

  if (contentElement.getAvailablePositions().length > 1) {
    this.input('position', PositionSelectInputView, {
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
      values: contentElement.getAvailablePositions(),
      sectionLayout: this.model.parent.section.configuration.get('layout')
    });
  }
  this.input('width', SliderInputView, {
    attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.common_content_element_attributes'],
    displayText: value => [
      'XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL'
    ][value + 3],
    saveOnSlide: true,
    minValueBinding: 'position',
    maxValueBinding: 'position',
    visibleBinding: 'position',
    minValue: () => contentElement.getAvailableMinWidth(),
    maxValue: () => contentElement.getAvailableMaxWidth(),
    visible: () => contentElement.getAvailableMinWidth() !== contentElement.getAvailableMaxWidth(),

    defaultValue:
      this.model.get('position') === 'wide' ? 2 :
      this.model.get('position') === 'full' ? 3 :
      0
  });
});

ConfigurationEditorTabView.groups.define(
  'ContentElementTypographyVariant',
  function({entry, model, prefix, getPreviewConfiguration}) {
    const contentElement = this.model.parent;

    if (entry.getTypographyVariants({contentElement})[0].length) {
      const [variants, texts] = entry.getTypographyVariants({
        contentElement,
        prefix
      });

      this.input('typographyVariant', TypographyVariantSelectInputView, {
        entry,
        model: model || this.model,
        contentElement: contentElement,
        prefix,
        getPreviewConfiguration,

        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' +
                             'common_content_element_attributes.' +
                             'typographyVariant.blank',
        attributeTranslationKeyPrefixes: [
          'pageflow_scrolled.editor.common_content_element_attributes'
        ],
        disabled: !variants.length,

        values: variants,
        texts,
      });
    }
  }
);

ConfigurationEditorTabView.groups.define(
  'ContentElementVariant',
  function({entry}) {
    const [variants, texts] = entry.getContentElementVariants({
      contentElement: this.model.parent
    });

    if (variants.length) {
      this.input('variant', SelectInputView, {
        attributeTranslationKeyPrefixes: [
          'pageflow_scrolled.editor.common_content_element_attributes'
        ],
        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' +
                             'common_content_element_attributes.' +
                             'variant.blank',
        values: variants,
        texts,
      });
    }
  }
);

ConfigurationEditorTabView.groups.define(
  'PaletteColor',
  function({propertyName, entry, model}) {
    const [values, texts] = entry.getPaletteColors();

    if (values.length) {
      this.input(propertyName, ColorSelectInputView, {
        model: model || this.model,
        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' +
                             'common_content_element_attributes.' +
                             'palette_color.blank',
        values,
        texts,
      });
    }
  }
);

ConfigurationEditorTabView.groups.define(
  'ContentElementCaption',
  function({entry, disableWhenNoCaption = true}) {
    const [variants, texts] = entry.getComponentVariants({
      name: 'figureCaption'
    });

    if (variants.length) {
      this.input('captionVariant', SelectInputView, {
        attributeTranslationKeyPrefixes: [
          'pageflow_scrolled.editor.common_content_element_attributes'
        ],
        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' +
                             'common_content_element_attributes.' +
                             'captionVariant.blank',
        values: variants,
        texts,
        disabledBindingModel: this.model.parent.transientState,
        disabledBinding: 'hasCaption',
        disabled: hasCaption => disableWhenNoCaption && !hasCaption
      });
    }
  }
);
