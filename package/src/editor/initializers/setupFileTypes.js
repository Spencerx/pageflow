import I18n from 'i18n-js';

import {IconTableCellView, SelectInputView, TextInputView, TextTableCellView} from 'pageflow/ui';

import {AudioFile} from '../models/AudioFile';
import {ImageFile} from '../models/ImageFile';
import {TextTrackFile} from '../models/TextTrackFile';
import {VideoFile} from '../models/VideoFile';
import {OtherFile} from '../models/OtherFile';
import {app} from '../app';
import {editor} from '../base';

import {EditFileView} from '../views/EditFileView';
import {TextFileMetaDataItemValueView} from '../views/TextFileMetaDataItemValueView';
import {TextTracksFileMetaDataItemValueView} from '../views/TextTracksFileMetaDataItemValueView';
import {TextTracksView} from '../views/TextTracksView';

import {state} from '$state';

app.addInitializer(function(options) {
  editor.fileTypes.commonMetaDataAttributes = [
    {
      name: 'rights',
      valueView: TextFileMetaDataItemValueView,
      valueViewOptions: {
        settingsDialogTabLink: 'general'
      }
    }
  ];

  if (editor.entryType.supportsExtendedFileRights) {
    editor.fileTypes.commonMetaDataAttributes = [
      ...editor.fileTypes.commonMetaDataAttributes,
      {
        name: 'source_url',
        valueView: TextFileMetaDataItemValueView,
        valueViewOptions: {
          fromConfiguration: true,
          settingsDialogTabLink: 'general'
        }
      },
      {
        name: 'license',
        valueView: TextFileMetaDataItemValueView,
        valueViewOptions: {
          fromConfiguration: true,
          formatValue: value => I18n.t(`pageflow.file_licenses.${value}.name`),
          settingsDialogTabLink: 'general'
        }
      }
    ];
  }

  editor.fileTypes.commonSettingsDialogTabs = [
    {
      name: 'general',
      view: EditFileView
    }
  ];

  var textTracksMetaDataAttribute = {
    name: 'text_tracks',
    valueView: TextTracksFileMetaDataItemValueView,
    valueViewOptions: {
      settingsDialogTabLink: 'text_tracks',
    }
  };

  var textTracksSettingsDialogTab = {
    name: 'text_tracks',
    view: TextTracksView,
    viewOptions: {
      supersetCollection: function() {
        return state.textTrackFiles;
      }
    }
  };

  var altMetaDataAttribute = {
    name: 'alt',
    valueView: TextFileMetaDataItemValueView,
    valueViewOptions: {
      fromConfiguration: true,
      settingsDialogTabLink: 'general'
    }
  };

  var altConfigurationEditorInput = {
    name: 'alt',
    inputView: TextInputView,
    inputViewOptions: {
      maxLength: 5000
    }
  };

  editor.fileTypes.register('image_files', {
    model: ImageFile,
    metaDataAttributes: [
      'dimensions',
      altMetaDataAttribute
    ],
    matchUpload: /^image/,
    configurationEditorInputs: [
      altConfigurationEditorInput
    ]
  });

  editor.fileTypes.register('video_files', {
    model: VideoFile,
    metaDataAttributes: [
      'format',
      'dimensions',
      'duration',
      textTracksMetaDataAttribute,
      altMetaDataAttribute
    ],
    matchUpload: /^video/,
    configurationEditorInputs: [
      altConfigurationEditorInput
    ],
    settingsDialogTabs: [
      textTracksSettingsDialogTab
    ]
  });

  editor.fileTypes.register('audio_files', {
    model: AudioFile,
    metaDataAttributes: [
      'format',
      'duration',
      textTracksMetaDataAttribute,
      altMetaDataAttribute
    ],
    matchUpload: /^audio/,
    configurationEditorInputs: [
      altConfigurationEditorInput
    ],
    settingsDialogTabs: [
      textTracksSettingsDialogTab
    ]
  });

  editor.fileTypes.register('text_track_files', {
    model: TextTrackFile,
    matchUpload: function(upload) {
      return upload.name.match(/\.vtt$/) ||
        upload.name.match(/\.srt$/);
    },
    skipUploadConfirmation: true,
    noExtendedFileRights: true,
    configurationEditorInputs: [
      {
        name: 'label',
        inputView: TextInputView,
        inputViewOptions: {
          placeholder: function(configuration) {
            var textTrackFile = configuration.parent;
            return textTrackFile.inferredLabel();
          },
          placeholderBinding: TextTrackFile.displayLabelBinding
        }
      },
      {
        name: 'kind',
        inputView: SelectInputView,
        inputViewOptions: {
          values: state.config.availableTextTrackKinds,
          translationKeyPrefix: 'pageflow.config.text_track_kind'
        }
      },
      {
        name: 'srclang',
        inputView: TextInputView,
        inputViewOptions: {
          required: true
        }
      }
    ],
    nestedFileTableColumns: [
      {
        name: 'label',
        cellView: TextTableCellView,
        value: function(textTrackFile) {
          return textTrackFile.displayLabel();
        },
        contentBinding: TextTrackFile.displayLabelBinding
      },
      {
        name: 'srclang',
        cellView: TextTableCellView,
        default: I18n.t('pageflow.editor.text_track_files.srclang_missing')
      },
      {
        name: 'kind',
        cellView: IconTableCellView,
        cellViewOptions: {
          icons: state.config.availableTextTrackKinds
        }
      },
    ],
    nestedFilesOrder: {
      comparator: function(textTrackFile) {
        return textTrackFile.displayLabel().toLowerCase();
      },
      binding: 'label'
    }
  });

  editor.fileTypes.register('other_files', {
    model: OtherFile,
    metaDataAttributes: [
      altMetaDataAttribute
    ],
    matchUpload: () => true,
    priority: 100,
    configurationEditorInputs: [
      {
        name: 'alt',
        inputView: TextInputView
      }
    ]
  });

  editor.fileTypes.setup(options.config.fileTypes);
});
