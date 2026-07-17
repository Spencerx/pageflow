import '@testing-library/jest-dom/extend-expect';
import {fireEvent} from '@testing-library/react';
import Backbone from 'backbone';

import {ConfigurationEditorView, CheckBoxInputView} from 'pageflow/ui';
import {InfoBoxView} from 'pageflow/editor';
import {ConfigurationEditor, useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';

import {defineEntryDefaultsInputs} from 'editor/views/EditDefaultsView';
import {createDefaultsEntry} from 'editor/models/createDefaultsEntry';
import {editor} from 'editor/api';

import {useEditorGlobals} from 'support';

describe('defineEntryDefaultsInputs', () => {
  useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.editor.edit_defaults.tabs.sections': 'Sections',
    'pageflow_scrolled.editor.edit_defaults.tabs.content_elements': 'New Elements'
  });

  function renderWithDefaultsEntry() {
    editor.contentElementTypes.register('testElement', {
      defaultsInputs() {
        this.input('enableFullscreen', CheckBoxInputView);
      }
    });

    const configurationEditor = new ConfigurationEditorView({
      model: new Backbone.Model(),
      tabTranslationKeyPrefix: 'pageflow_scrolled.editor.edit_defaults.tabs',
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.edit_defaults.attributes']
    });

    const entry = createDefaultsEntry({
      seed: {config: {theme: {options: {properties: {'figureCaption-inverted': {}}}}}},
      themeName: 'default'
    });

    defineEntryDefaultsInputs(configurationEditor, {entry});

    return {
      ...renderBackboneView(configurationEditor),
      configurationEditor
    };
  }

  it('builds section defaults from the shallow entry theme scales', () => {
    const {configurationEditor} = renderWithDefaultsEntry();

    expect(new ConfigurationEditor(configurationEditor.$el).inputPropertyNames())
      .toEqual(expect.arrayContaining([
        'defaultSectionPaddingTop',
        'defaultSectionPaddingBottom'
      ]));
  });

  it('renders the tab info box via the given renderInfoBox', () => {
    const configurationEditor = new ConfigurationEditorView({
      model: new Backbone.Model(),
      tabTranslationKeyPrefix: 'pageflow_scrolled.editor.edit_defaults.tabs',
      attributeTranslationKeyPrefixes: ['pageflow_scrolled.editor.edit_defaults.attributes']
    });

    const entry = createDefaultsEntry({
      seed: {config: {theme: {options: {properties: {}}}}},
      themeName: 'default'
    });

    defineEntryDefaultsInputs(configurationEditor, {
      entry,
      renderInfoBox: (tab, name) => tab.view(InfoBoxView, {text: `Info for ${name}`, level: 'info'})
    });

    const {getByText} = renderBackboneView(configurationEditor);

    expect(getByText('Info for sections')).toBeInTheDocument();
  });

  it('builds all-elements and per-type defaults from the shallow entry', () => {
    const {getByRole, configurationEditor} = renderWithDefaultsEntry();

    fireEvent.click(getByRole('tab', {name: 'New Elements'}));

    expect(new ConfigurationEditor(configurationEditor.$el).inputPropertyNames())
      .toEqual(expect.arrayContaining([
        'defaultContentElementFullWidthInPhoneLayout',
        'defaultCaptionVariant',
        'defaultFileRightsDisplay',
        'default-testElement-enableFullscreen'
      ]));
  });
});
