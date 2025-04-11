import '../frontend';
import {storiesOfContentElement} from 'pageflow-scrolled/spec/support/stories';
import {contentElementWidths} from 'pageflow-scrolled/frontend';

storiesOfContentElement(module, {
  typeName: 'heading',
  baseConfiguration: {
    children: 'Some Heading Text',
    level: 1
  },
  variants: [
    {
      name: 'First headline in entry',
      configuration: {
        level: 0
      }
    },
    {
      name: 'Large',
      configuration: {
        textSize: 'large'
      }
    },
    {
      name: 'Medium',
      configuration: {
        textSize: 'medium'
      }
    },
    {
      name: 'Small ',
      configuration: {
        textSize: 'small'
      }
    },
    {
      name: 'With subtitles - Large',
      configuration: {
        tagline: [{type: 'heading', children: [{text: 'Some Tagline'}]}],
        subtitle: [{type: 'heading', children: [{text: 'Some Subtitle'}]}],
        width: contentElementWidths.xl,
        textSize: 'large'
      }
    },
    {
      name: 'With subtitles - Medium',
      configuration: {
        tagline: [{type: 'heading', children: [{text: 'Some Tagline'}]}],
        subtitle: [{type: 'heading', children: [{text: 'Some Subtitle'}]}],
        width: contentElementWidths.xl,
        textSize: 'medium'
      }
    },
    {
      name: 'With subtitles - Small',
      configuration: {
        tagline: [{type: 'heading', children: [{text: 'Some Tagline'}]}],
        subtitle: [{type: 'heading', children: [{text: 'Some Subtitle'}]}],
        width: contentElementWidths.xl,
        textSize: 'small'
      }
    },
    {
      name: 'With subtitles - Center',
      sectionConfiguration: {
        layout: 'center',
      },
      configuration: {
        tagline: [{type: 'heading', children: [{text: 'Some Tagline'}]}],
        subtitle: [{type: 'heading', children: [{text: 'Some Subtitle'}]}],
        width: contentElementWidths.xl
      }
    },
    {
      name: 'With subtitles - Right',
      sectionConfiguration: {
        layout: 'right',
      },
      configuration: {
        tagline: [{type: 'heading', children: [{text: 'Some Tagline'}]}],
        subtitle: [{type: 'heading', children: [{text: 'Some Subtitle'}]}],
        width: contentElementWidths.xl
      }
    },
    {
      name: 'With custom content text colors',
      themeOptions: {
        properties: {
          headings: {
            lightContentTextColor: 'red'
          }
        }
      }
    },
    {
      name: 'With custom content text colors in inverted section',
      sectionConfiguration: {
        invert: true
      },
      themeOptions: {
        properties: {
          headings: {
            darkContentTextColor: 'red'
          }
        }
      }
    },
    {
      name: 'Palette Color',
      themeOptions: {
        properties: {
          root: {
            paletteColorAccent: '#04f'
          }
        }
      },
      configuration: {
        color: 'accent'
      }
    },
    {
      name: 'With text effects',
      configuration: {
        typographyVariant: 'highlight',
        children: 'Some Heading\nText',
      },
      themeOptions: {
        typography: {
          'heading-highlight': {
            transform: 'rotate(-2.7deg)',
            'font-style': 'italic',
            '--text-highlight-padding': '0 0.2em',
            '--text-highlight-background-color': '#fff',
            '--text-highlight-line-height': '1.5',
            '--background-clip-text-fallback-color': '#000',
            '--background-clip-text-background': 'linear-gradient(90deg, red 0%, #ff00ff 100%)',
            '--background-clip-text-background-clip': 'text',
            '--background-clip-text-color': 'transparent',
            '--background-clip-text-padding': '0 0.2em 0 0'
          }
        }
      }
    },
  ]
});
