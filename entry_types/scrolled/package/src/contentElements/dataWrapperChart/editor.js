import I18n from 'i18n-js';
import {editor} from 'pageflow-scrolled/editor';
import {SeparatorView, UrlInputView, TextInputView, ColorInputView} from 'pageflow/ui';
import {DatawrapperAdView} from './editor/DataWrapperAdView';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('dataWrapperChart', {
  category: 'data',
  pictogram,
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xxs', 'full'],

  configurationEditor({entry}) {
    this.tab('general', function() {
      this.input('url', UrlInputView, {
         supportedHosts: [
          'cf.datawrapper.de',
          'charts.datawrapper.de',
          'datawrapper.dwcdn.de',
          'datawrapper.dwcdn.net'
        ],
        displayPropertyName: 'displayUrl',
        required: true,
        permitHttps: true
      });
      this.view(DatawrapperAdView);
      this.input('title', TextInputView, {
        placeholder: I18n.t('pageflow_scrolled.public.chart.default_title')
      });
      this.input('backgroundColor', ColorInputView,{
        defaultValue: '#323d4d'
      });

      this.group('ContentElementPosition', {entry});
      this.view(SeparatorView);
      this.group('ContentElementCaption', {entry});
    });
  }
});
