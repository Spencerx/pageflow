import {useFile, watchCollections} from 'entryState';

import {ScrolledEntry} from 'editor/models/ScrolledEntry';

import {factories} from 'pageflow/testHelpers';
import {renderHookInEntry} from 'support';

describe('useFile', () => {
  it('reads data from seed', () => {
    const {result} = renderHookInEntry(
      () => useFile({collectionName: 'imageFiles', permaId: 1}),
      {
        seed: {
          fileUrlTemplates: {
            imageFiles: {
              original: '/image_files/:id_partition/original/:basename.:extension',
              large: '/image_files/:id_partition/large/:basename.:processed_extension',
            }
          },
          fileModelTypes: {
            imageFiles: 'Pageflow::ImageFile'
          },
          imageFiles: [
            {
              id: 100,
              permaId: 1,
              basename: 'image',
              extension: 'svg',
              displayName: 'MyImage.svg',
              processedExtension: 'webp',
              rights: 'author',
              configuration: {
                some: 'value'
              }
            }
          ]
        }
      }
    );

    const file = result.current;

    expect(file).toMatchObject({
      id: 100,
      permaId: 1,
      modelType: 'Pageflow::ImageFile',
      extension: 'svg',
      displayName: 'MyImage.svg',
      configuration: {
        some: 'value'
      },
      urls: {
        original: '/image_files/000/000/100/original/image.svg',
        large: '/image_files/000/000/100/large/image.webp',
      }
    });
  });

  it('reads image file data from watched collection', () => {
    const {result} = renderHookInEntry(
      () => useFile({collectionName: 'imageFiles', permaId: 1}),
      {
        seed: {
          fileUrlTemplates: {
            imageFiles: {
              original: '/image_files/:id_partition/original/:basename.:extension',
              large: '/image_files/:id_partition/large/:basename.:processed_extension',
            }
          },
          fileModelTypes: {
            imageFiles: 'Pageflow::ImageFile'
          }
        },
        setup: (dispatch, entryTypeSeed) => {
          watchCollections(factories.entry(ScrolledEntry, {}, {
            entryTypeSeed,
            fileTypes: factories.fileTypesWithImageFileType(),
            filesAttributes: {
              image_files: [
                {
                  id: 100,
                  perma_id: 1,
                  basename: 'image',
                  display_name: 'My File.svg',
                  extension: 'svg',
                  processed_extension: 'webp',
                  rights: 'author',
                  configuration: {
                    some: 'value'
                  }
                },
              ]
            }
          }), {dispatch})
        }
      }
    );

    const file = result.current;

    expect(file).toMatchObject({
      id: 100,
      permaId: 1,
      modelType: 'Pageflow::ImageFile',
      basename: 'image',
      extension: 'svg',
      displayName: 'My File.svg',
      configuration: {
        some: 'value'
      },
      urls: {
        original: '/image_files/000/000/100/original/image.svg',
        large: '/image_files/000/000/100/large/image.webp',
      }
    });
  });

  it('reads video file data from watched collection', () => {
    const {result} = renderHookInEntry(
      () => useFile({collectionName: 'videoFiles', permaId: 1}),
      {
        seed: {
          fileUrlTemplates: {
            videoFiles: {
              original: '/video_files/:id_partition/original.:extension',
              high: '/video_files/:id_partition/high.mp4',
              posterLarge: '/video_files/:id_partition/posterLarge.jpg',
            },
          },
          fileModelTypes: {
            videoFiles: 'Pageflow::VideoFile'
          }
        },
        setup: (dispatch, entryTypeSeed) => {
          watchCollections(factories.entry(ScrolledEntry, {}, {
            entryTypeSeed,
            fileTypes: factories.fileTypes(function() {
              this.withVideoFileType();
              this.withTextTrackFileType();
            }),
            filesAttributes: {
              video_files: [
                {
                  id: 100,
                  perma_id: 1,
                  basename: 'video',
                  extension: 'mov',
                  rights: 'author',
                  variants: ['high', 'poster_large'],
                  configuration: {
                    some: 'value'
                  }
                }
              ]
            }
          }), {dispatch})
        }
      }
    );

    const file = result.current;

    expect(file).toMatchObject({
      id: 100,
      permaId: 1,
      modelType: 'Pageflow::VideoFile',
      configuration: {
        some: 'value'
      },
      urls: {
        original: '/video_files/000/000/100/original.mov',
        high: '/video_files/000/000/100/high.mp4',
        posterLarge: '/video_files/000/000/100/posterLarge.jpg'
      }
    });
  });

  it('interpolates hls qualities into video file url templates', () => {
    const {result} = renderHookInEntry(
      () => useFile({collectionName: 'videoFiles', permaId: 1}),
      {
        seed: {
          fileUrlTemplates: {
            videoFiles: {
              'hls-playlist': 'http://example.com/,:pageflow_hls_qualities,.mp4.csmil/master.m3u8'
            }
          },
          fileModelTypes: {
            videoFiles: 'Pageflow::VideoFile'
          },
          videoFiles: [
            {
              id: 100,
              permaId: 1,
              basename: 'video',
              variants: ['low', 'medium', 'high', 'fullhd', 'hls-playlist'],
            }
          ]
        }
      }
    );

    const file = result.current;

    expect(file).toMatchObject({
      id: 100,
      permaId: 1,
      urls: {
        'hls-playlist': 'http://example.com/,low,medium,high,fullhd,.mp4.csmil/master.m3u8'
      }
    });
  });

  it('falls back to file name for display name from watched collection', () => {
    const {result} = renderHookInEntry(
      () => useFile({collectionName: 'imageFiles', permaId: 1}),
      {
        setup: (dispatch, entryTypeSeed) => {
          watchCollections(factories.entry(ScrolledEntry, {}, {
            entryTypeSeed,
            fileTypes: factories.fileTypesWithImageFileType(),
            filesAttributes: {
              image_files: [
                {
                  id: 100,
                  perma_id: 1,
                  basename: 'image',
                  extension: 'svg',
                  file_name: 'image.svg',
                  processed_extension: 'webp',
                },
              ]
            }
          }), {dispatch})
        }
      }
    );

    const file = result.current;

    expect(file).toMatchObject({
      displayName: 'image.svg',
    });
  });
});
