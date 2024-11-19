import {editor} from 'pageflow-scrolled/editor';
import {SelectInputView} from 'pageflow/ui';

import {SidebarRouter} from './SidebarRouter';
import {SidebarController} from './SidebarController';
import {SidebarListView} from './SidebarListView';
import {ExternalLinkCollection} from './models/ExternalLinkCollection';

import pictogram from './pictogram.svg';

//register sidebar router to handle multiple sidebar views of this content element
//router defines the URL hash path mapping and controller provides functions for the paths
editor.registerSideBarRouting({
  router: SidebarRouter,
  controller: SidebarController
});

// register external link list content element configuration editor for sidebar
editor.contentElementTypes.register('externalLinkList', {
  pictogram,
  category: 'links',
  supportedPositions: ['inline'],

  configurationEditor({entry}) {
    this.tab('general', function() {
      this.group('ContentElementVariant', {entry});

      this.view(SidebarListView, {
        contentElement: this.model.parent,
        collection: ExternalLinkCollection.forContentElement(this.model.parent, entry)
      });

      this.input('thumbnailAspectRatio', SelectInputView, {
        values: ['wide', 'narrow', 'square', 'portrait', 'original']
      })
    });
  }
});

// register file handler for thumbnail of external link
editor.registerFileSelectionHandler('contentElement.externalLinks.link', function (options) {
  const contentElement = options.entry.contentElements.get(options.contentElementId);
  const links = ExternalLinkCollection.forContentElement(contentElement, options.entry)

  this.call = function(file) {
    const link = links.get(options.id);
    link.setReference('thumbnail', file);
  };

  this.getReferer = function() {
    return '/scrolled/external_links/' + contentElement.id + '/' + options.id;
  };
});
