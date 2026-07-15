import {WidgetsCollection} from 'editor/collections/WidgetsCollection';
import {CheckBoxInputView, ConfigurationEditorTabView} from 'pageflow/ui';
import {factories} from '$support';

describe('WidgetsCollection', () => {
  it('supports getting subset collection by widget type property', () => {
    const widgetTypes = factories.widgetTypes([
      {role: 'navigation', name: 'some_navigation_bar', insertPoint: 'react'},
      {role: 'consent', name: 'some_consent_provider', insertPoint: 'bottom_of_entry'}
    ]);
    const widgets = new WidgetsCollection([
      {type_name: 'some_navigation_bar'},
      {type_name: 'some_consent_provider'},
    ], {widgetTypes});

    expect(
      widgets.withWidgetType({insertPoint: 'react'}).pluck('type_name')
    ).toEqual(['some_navigation_bar']);
  });

  it('supports filtering by multiple widget type properties', () => {
    const widgetTypes = factories.widgetTypes([
      {role: 'consent', name: 'consent_bar', insertPoint: 'react'},
      {role: 'consent', name: 'consent_dialog', insertPoint: 'react',
       enabledInEditor: false}
    ]);
    const widgets = new WidgetsCollection([
      {type_name: 'consent_bar'},
      {type_name: 'consent_dialog'},
    ], {widgetTypes});

    expect(
      widgets.withWidgetType({insertPoint: 'react', enabledInEditor: true})
             .pluck('type_name')
    ).toEqual(['consent_bar']);
  });

  it('keeps subset collection up to date when type name changes', () => {
    const widgetTypes = factories.widgetTypes([
      {role: 'consent', name: 'consent_bar', insertPoint: 'react'},
      {role: 'consent', name: 'some_consent_provider', insertPoint: 'bottom_of_entry'}
    ]);
    const widgets = new WidgetsCollection([
      {type_name: 'some_consent_provider'},
    ], {widgetTypes});
    widgets.subject = factories.entry();

    const subsetCollection = widgets.withWidgetType({insertPoint: 'react'});
    widgets.first().set('type_name', 'consent_bar');

    expect(subsetCollection.pluck('type_name')).toEqual(['consent_bar']);
  });

  it('ignores null widgets', () => {
    const widgetTypes = factories.widgetTypes([
      {role: 'consent', name: 'consent_bar', insertPoint: 'react'}
    ]);
    const widgets = new WidgetsCollection([
      {type_name: 'consent_bar', role: 'consent'},
      {type_name: null, role: 'other'},
    ], {widgetTypes});
    widgets.subject = factories.entry();

    const subsetCollection = widgets.withWidgetType({insertPoint: 'react'});

    expect(subsetCollection.pluck('type_name')).toEqual(['consent_bar']);
  });

  it('can define configuration editor tab view groups of widget types', () => {
    const widgetTypes = factories.widgetTypes(
      [
        {
          role: 'inlineFileRights',
          name: 'textInlineFileRights',
          insertPoint: 'react'
        }
      ],
      w => {
        w.register('textInlineFileRights', {
          configurationEditorTabViewGroups: {
            ContentElementInlineFileRightsSettings() {
              this.input('showBackdrop', CheckBoxInputView);
            }
          }
        });
      }
    );
    const widgets = new WidgetsCollection([
      {type_name: 'textInlineFileRights', role: 'inlineFileRights'},
    ], {widgetTypes});
    const groups = new ConfigurationEditorTabView.Groups();
    widgets.subject = factories.entry();

    widgets.setupConfigurationEditorTabViewGroups(groups);
    const context = {
      input: jest.fn()
    };
    groups.apply(
      'ContentElementInlineFileRightsSettings',
      context
    );

    expect(context.input).toHaveBeenCalledWith('showBackdrop', CheckBoxInputView);
  });

  it('defines stub configuration editor tab view groups for unused widget types', () => {
    const widgetTypes = factories.widgetTypes(
      [
        {
          role: 'inlineFileRights',
          name: 'iconInlineFileRights',
          insertPoint: 'react'
        },
        {
          role: 'inlineFileRights',
          name: 'textInlineFileRights',
          insertPoint: 'react'
        }
      ],
      w => {
        w.register('textInlineFileRights', {
          configurationEditorTabViewGroups: {
            ContentElementInlineFileRightsSettings() {
              this.input('showBackdrop', CheckBoxInputView);
            }
          }
        });
      }
    );
    const widgets = new WidgetsCollection([
      {type_name: 'iconInlineFileRights', role: 'inlineFileRights'},
    ], {widgetTypes});
    const groups = new ConfigurationEditorTabView.Groups();
    widgets.subject = factories.entry();

    widgets.setupConfigurationEditorTabViewGroups(groups);
    const context = {
      input: jest.fn()
    };

    expect(() => {
      groups.apply(
        'ContentElementInlineFileRightsSettings',
        context
      );
    }).not.toThrowError();

    expect(context.input).not.toHaveBeenCalled();
  });

  it('redefines configuration editor tab view groups on type change', () => {
    const widgetTypes = factories.widgetTypes(
      [
        {
          role: 'inlineFileRights',
          name: 'iconInlineFileRights',
          insertPoint: 'react'
        },
        {
          role: 'inlineFileRights',
          name: 'textInlineFileRights',
          insertPoint: 'react'
        }
      ],
      w => {
        w.register('textInlineFileRights', {
          configurationEditorTabViewGroups: {
            ContentElementInlineFileRightsSettings() {
              this.input('showBackdrop', CheckBoxInputView);
            }
          }
        });
      }
    );
    const widgets = new WidgetsCollection([
      {type_name: 'iconInlineFileRights', role: 'inlineFileRights'},
    ], {widgetTypes});
    const groups = new ConfigurationEditorTabView.Groups();
    widgets.subject = factories.entry();

    widgets.setupConfigurationEditorTabViewGroups(groups);
    widgets.first().set('type_name', 'textInlineFileRights');
    const context = {
      input: jest.fn()
    };
    groups.apply(
      'ContentElementInlineFileRightsSettings',
      context
    );

    expect(context.input).toHaveBeenCalled();
  });
});
