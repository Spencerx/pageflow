import React from 'react';

import {
  Entry, RootProviders,
  contentElementWidths,
  contentElementWidthName
} from 'pageflow-scrolled/frontend';

import {
  linkWidths,
  maxLinkWidth
} from './linkWidths';

import {
  editableTextValue,
  exampleHeading,
  filePermaId,
  normalizeAndMergeFixture,
  storiesOfContentElement
} from 'pageflow-scrolled/spec/support/stories';
import {storiesOf} from '@storybook/react';

storiesOfContentElement(module, {
  typeName: 'externalLinkList',
  baseConfiguration: {
    itemTexts: {
      1: {
        title: editableTextValue('PageflowIO'),
        description: editableTextValue('This is description')
      },
      2: {
        title: editableTextValue('pageflowio'),
        description: editableTextValue('This is pageflowio link')
      },
      3: {
        title: editableTextValue('PageflowIo'),
        description: editableTextValue('This is another pageflowio link')
      },
      4: {
        title: editableTextValue('PageflowIo'),
        description: editableTextValue('This is another pageflowio link')
      },
    },
    itemLinks: {
      1: {
        href: 'https://www.pageflow.io/',
        openInNewTab: false
      },
      2: {
        href: 'https://www.pageflow.io/',
        openInNewTab: true
      },
      3: {
        href: 'https://www.pageflow.io/',
        openInNewTab: false
      },
      4: {
        href: 'https://www.pageflow.io/',
        openInNewTab: false
      }
    },
    links: [
      {
        id: '1',
        thumbnailCropPosition: {x: 0, y: 50},
        thumbnail: filePermaId('imageFiles', 'turtle')
      },
      {
        id: '2',
        thumbnail: ''
      },
      {
        id: '3',
        thumbnail: filePermaId('imageFiles', 'turtle')
      },
      {
        id: '4',
        thumbnail: filePermaId('imageFiles', 'turtle')
      }
    ]
  },
  variants: [
    {
      name: 'With thumbnail aspect ratio',
      configuration: {
        thumbnailAspectRatio: 'square',
      }
    },
    {
      name: 'With thumbnail aspect ratio, contain',
      configuration: {
        thumbnailAspectRatio: 'portrait',
        thumbnailFit: 'contain',
        links: [
          {
            id: '1',
            thumbnailCropPosition: {x: 0, y: 50},
            thumbnail: filePermaId('imageFiles', 'turtle'),
            thumbnailBackgroundColor: '#888'
          }
        ]
      }
    },
    {
      name: 'With thumbnail aspect ratio, contain, text position righ',
      configuration: {
        thumbnailAspectRatio: 'portrait',
        thumbnailFit: 'contain',
        textPosition: 'right',
        links: [
          {
            id: '1',
            thumbnailCropPosition: {x: 0, y: 50},
            thumbnail: filePermaId('imageFiles', 'turtle'),
            thumbnailBackgroundColor: '#888'
          }
        ]
      }
    },
    {
      name: 'With thumbnail size',
      configuration: {
        textPosition: 'right',
        thumbnailSize: 'large',
      }
    },
    {
      name: 'With text size',
      configuration: {
        textSize: 'large',
      }
    },
    {
      name: 'With text alignment',
      configuration: {
        textAlign: 'center',
      }
    },
    {
      name: 'With inverted content colors',
      configuration: {
        variant: 'cards-inverted'
      },
      themeOptions: {
        properties: {
          'externalLinkList-cards-inverted': {
            darkContentSurfaceColor: 'var(--root-light-content-surface-color)',
            lightContentSurfaceColor: 'var(--root-dark-content-surface-color)',
            darkContentTextColor: 'var(--root-light-content-text-color)',
            lightContentTextColor: 'var(--root-dark-content-text-color)'
          }
        }
      }
    },
    {
      name: 'With transparent background',
      configuration: {
        variant: 'cards-inverted'
      },
      sectionConfiguration: {
        backdrop: {
          image: filePermaId('imageFiles', 'turtle')
        }
      },
      inlineFileRightsWidgetTypeName: 'textInlineFileRights',
      themeOptions: {
        properties: {
          'externalLinkList-cards-inverted': {
            externalLinksCardSurfaceColor: 'transparent',
            externalLinksCardTextColor: 'var(--content-text-color)',
            externalLinksCardPaddingInline: '0'
          }
        }
      }
    },
    {
      name: 'Without link urls',
      configuration: {
        itemTexts: {
          1: {
            title: editableTextValue('Static Teaser'),
            description: editableTextValue('This is description')
          },
          2: {
            title: editableTextValue('Other item'),
            description: editableTextValue('This is other description')
          }
        },
        itemLinks: {},
        links: [
          {
            id: '1',
            thumbnail: filePermaId('imageFiles', 'turtle'),
          },
          {
            id: '2'
          }
        ]
      },
    },
    {
      name: 'Text inline file rights, text position right',
      configuration: {
        textPosition: 'right'
      },
      inlineFileRightsWidgetTypeName: 'textInlineFileRights',
    },
    {
      name: 'Text inline file rights, text position overlay',
      configuration: {
        textPosition: 'overlay'
      },
      inlineFileRightsWidgetTypeName: 'textInlineFileRights',
    },
    {
      name: 'Icon inline file rights, text position overlay',
      configuration: {
        textPosition: 'overlay'
      },
      inlineFileRightsWidgetTypeName: 'iconInlineFileRights',
    },
    {
      name: 'With buttons',
      configuration: {
        displayButtons: true,
        itemTexts: {
          1: {
            title: editableTextValue('Item 1'),
            description: editableTextValue('This is description'),
            link: editableTextValue('Read more')
          },
          2: {
            title: editableTextValue('Item 2'),
            description: editableTextValue('This is another description'),
            link: editableTextValue('Read more')
          }
        },
        itemLinks: {
          1: {
            href: 'https://www.pageflow.io/'
          },
          2: {
            href: 'https://www.pageflow.io/'
          }
        },
        links: [
          {
            id: '1',
            thumbnail: filePermaId('imageFiles', 'turtle')
          },
          {
            id: '2',
            thumbnail: filePermaId('imageFiles', 'turtle')
          }
        ]
      }
    },
    {
      name: 'With buttons, text position right',
      configuration: {
        displayButtons: true,
        textPosition: 'right',
        itemTexts: {
          1: {
            title: editableTextValue('Item 1'),
            description: editableTextValue('This is description'),
            link: editableTextValue('Read more')
          },
          2: {
            title: editableTextValue('Item 2'),
            description: editableTextValue('This is another description'),
            link: editableTextValue('Read more')
          }
        },
        itemLinks: {
          1: {
            href: 'https://www.pageflow.io/'
          },
          2: {
            href: 'https://www.pageflow.io/'
          }
        },
        links: [
          {
            id: '1',
            thumbnail: filePermaId('imageFiles', 'turtle')
          },
          {
            id: '2',
            thumbnail: filePermaId('imageFiles', 'turtle')
          }
        ]
      }
    },
    {
      name: 'With legacy external links',
      configuration: {
        links: [
          {
            id: '1',
            title: 'PageflowIO',
            url: 'https://www.pageflow.io/',
            thumbnail: filePermaId('imageFiles', 'turtle'),
            description: 'This is description',
            open_in_new_tab: '0',
            thumbnailCropPosition: {x: 0, y: 50}
          },
          {
            id: '2',
            title: 'pageflowio',
            url: 'https://www.pageflow.io/',
            thumbnail: '',
            description: 'This is pageflowio link',
            open_in_new_tab: '1'
          },
          {
            id: '3',
            title: 'PageflowIo',
            url: 'https://www.pageflow.io/',
            thumbnail: filePermaId('imageFiles', 'turtle'),
            description: 'This is another pageflowio link',
            open_in_new_tab: '0'
          },
          {
            id: '4',
            title: 'PageflowIo',
            url: 'https://www.pageflow.io/',
            thumbnail: filePermaId('imageFiles', 'turtle'),
            description: 'This is another pageflowio link',
            open_in_new_tab: '0'
          }
        ]
      }
    }
  ],
  inlineFileRights: true
});

['always', 'never'].forEach(enableScroller =>
  [['below'], ['right'], ['overlay', 'square']].forEach(([textPosition, thumbnailAspectRatio]) =>
    storiesOf(`Content Elements/externalLinkList`, module)
      .add(
        `Text Position - ${textPosition}${enableScroller === 'always' ? ' - scroll' : ''}`,
        () => (
          <RootProviders seed={exampleSeed({textPosition, thumbnailAspectRatio, enableScroller})}>
            <Entry />
          </RootProviders>
        )
      )
  )
);

function exampleSeed({textPosition, thumbnailAspectRatio, enableScroller}) {
  const sectionConfiguration = {
    transition: 'scroll'
  };

  return normalizeAndMergeFixture({
    sections: [
      {
        id: 1,
        configuration: {
          ...sectionConfiguration,
          layout: 'left',
          backdrop: {
            color: '#cad2c5'
          },
        }
      },
      {
        id: 2,
        configuration: {
          ...sectionConfiguration,
          layout: 'center',
          backdrop: {
            color: '#84a98c'
          },
        }
      },
      {
        id: 3,
        configuration: {
          ...sectionConfiguration,
          layout: 'right',
          backdrop: {
            color: '#52796f'
          },
        }
      }
    ],
    contentElements: [
      ...exampleContentElements(1, 'left', textPosition, thumbnailAspectRatio, enableScroller),
      ...exampleContentElements(2, 'center', textPosition, thumbnailAspectRatio, enableScroller),
      ...exampleContentElements(3, 'right', textPosition, thumbnailAspectRatio, enableScroller),
    ]
  });
}

function linkCount({layout, textPosition, width, linkWidth, enableScroller}) {
  if (textPosition === 'right') {
    return 3;
  }
  else {
    const delta = enableScroller === 'always' ? 2 : 1;

    return range(
      linkWidths.xs,
      maxLinkWidth({width, layout, textPosition})
    ).reverse().indexOf(linkWidth) + delta;
  }
}

function exampleContentElements(sectionId, layout, textPosition, thumbnailAspectRatio, enableScroller) {
  return [
    exampleHeading({sectionId, text: `Layout ${layout}`}),
    ...([
      contentElementWidths.md,
      contentElementWidths.lg,
      contentElementWidths.xl,
      contentElementWidths.full
    ].flatMap(width =>
      [
        exampleHeading({sectionId, text: `Width ${contentElementWidthName(width)}`}),
        ...range(
          linkWidths.xs,
          maxLinkWidth({width, layout, textPosition})
        ).map(linkWidth => (
          {
            sectionId,
            typeName: 'externalLinkList',
            configuration: {
              textPosition,
              width,
              linkWidth,
              thumbnailAspectRatio,
              enableScroller,
              ...links({
                count: linkCount({layout, textPosition, width, linkWidth, enableScroller})
              })
            }
          }
        ))
      ]
    ))
  ];
}

function range(start, end) {
  const result = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}

function links({count}) {
  return {
    itemTexts: Object.fromEntries(Array.from({length: count}, (_, index) =>
      [
        index + 1,
        {
          title: editableTextValue(`Link ${index + 1}`),
          description: editableTextValue('This is the description')
        }
      ]
    )),
    itemLinks: Object.fromEntries(Array.from({length: count}, (_, index) =>
      [
        index + 1,
        {
          href: 'https://www.pageflow.io/',
        }
      ]
    )),
    links: Array.from({length: count}, (_, index) => (
      {
        id: `${index + 1}`,
        thumbnail: filePermaId('imageFiles', 'turtle'),
      }
    ))
  };
}
