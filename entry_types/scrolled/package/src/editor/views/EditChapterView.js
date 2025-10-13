import {EditConfigurationView} from 'pageflow/editor';
import {CheckBoxInputView, TextInputView, TextAreaInputView} from 'pageflow/ui';

export const EditChapterView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_chapter',

  configure: function(configurationEditor) {
    const chapter = this.model;

    configurationEditor.tab(chapter.isExcursion() ? 'excursion' : 'chapter', function() {
      this.input('title', TextInputView);

      if (this.model.parent.storyline.isMain()) {
        this.input('hideInNavigation', CheckBoxInputView);
        this.input('summary', TextAreaInputView, {
          disableLinks: true
        });
      }
      else {
        this.group('ChapterExcursionSettings', {ignoreUndefined: true});
      }
    });
  }
});
