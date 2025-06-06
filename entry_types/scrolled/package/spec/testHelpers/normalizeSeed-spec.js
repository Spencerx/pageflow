import {normalizeSeed} from 'testHelpers/normalizeSeed';

describe('normalizeSeed', () => {
  it('ensures minimal config is present', () => {
    const result = normalizeSeed({});

    expect(result).toMatchObject({
      config: {
        fileUrlTemplates: {}
      }
    });
  });

  it('supports imageFileUrlTemplates property', () => {
    const result = normalizeSeed({
      imageFileUrlTemplates: {large: '/some/url'}
    });

    expect(result).toMatchObject({
      config: {
        fileUrlTemplates: {
          imageFiles: {large: '/some/url'}
        }
      }
    });
  });

  it('supports fileUrlTemplates property', () => {
    const result = normalizeSeed({
      fileUrlTemplates: {
        audioFiles: {
          mp3: '/some/audio/url'
        },
        textTrackFiles: {
          vtt: '/some/texttrack/url'
        },
        videoFiles: {
          high: '/some/video/url'
        }
      }
    });

    expect(result).toMatchObject({
      config: {
        fileUrlTemplates: {
          audioFiles: {mp3: '/some/audio/url'},
          textTrackFiles: {vtt: '/some/texttrack/url'},
          videoFiles: {high: '/some/video/url'}
        }
      }
    });
  });

  it('ensures empty collections are present', () => {
    const result = normalizeSeed({});

    expect(result).toMatchObject({
      collections: {
        imageFiles: [],
        audioFiles: [],
        videoFiles: [],
        textTrackFiles: [],
        chapters: [],
        sections: [],
        contentElements: [],
      }
    });
  });

  it('ensures required entry is present', () => {
    const result = normalizeSeed({});

    expect(result).toMatchObject({
      collections: {
        entries: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number)
          }
        ]
      }
    });
  });

  it('ensures required image file properties are present', () => {
    const result = normalizeSeed({
      imageFiles: [{}]
    });

    expect(result).toMatchObject({
      collections: {
        imageFiles: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            width: expect.any(Number),
            height: expect.any(Number),
            configuration: {}
          }
        ]
      }
    });
  });

  it('ensures required audio file properties are present', () => {
    const result = normalizeSeed({
      audioFiles: [{}]
    });

    expect(result).toMatchObject({
      collections: {
        audioFiles: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {}
          }
        ]
      }
    });
  });

  it('ensures required text track file properties are present', () => {
    const result = normalizeSeed({
      textTrackFiles: [{}]
    });

    expect(result).toMatchObject({
      collections: {
        textTrackFiles: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            parentFileId: null,
            parentFileType: null,
            configuration: {}
          }
        ]
      }
    });
  });

  it('ensures required video file properties are present', () => {
    const result = normalizeSeed({
      videoFiles: [{}]
    });

    expect(result).toMatchObject({
      collections: {
        videoFiles: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {}
          }
        ]
      }
    });
  });

  it('ensures required storyline properties are present', () => {
    const result = normalizeSeed({
      storylines: [{}]
    });

    expect(result).toMatchObject({
      collections: {
        storylines: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {}
          }
        ]
      }
    });
  });

  it('ensures required chapter properties are present', () => {
    const result = normalizeSeed({
      chapters: [{}]
    });

    expect(result).toMatchObject({
      collections: {
        chapters: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {}
          }
        ]
      }
    });
  });

  it('ensures main storyline is present if chapters are present', () => {
    const result = normalizeSeed({
      chapters: [{}]
    });

    expect(result).toMatchObject({
      collections: {
        storylines: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {
              main: true
            }
          }
        ]
      }
    });
    expect(result.collections.chapters[0].storylineId).toBe(result.collections.storylines[0].id);
  });

  it('ensures main storyline is present even if chapters are blank', () => {
    const result = normalizeSeed();

    expect(result).toMatchObject({
      collections: {
        storylines: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {
              main: true
            }
          }
        ]
      }
    });
  });

  it('ensures chapter and storyline are present if sections are present', () => {
    const result = normalizeSeed({
      sections: [{}]
    });

    expect(result).toMatchObject({
      collections: {
        storylines: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {}
          }
        ],
        chapters: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {}
          }
        ]
      }
    });
    expect(result.collections.chapters[0].storylineId).toBe(result.collections.storylines[0].id);
    expect(result.collections.sections[0].chapterId).toBe(result.collections.chapters[0].id);
  });

  it('ensures section, chapter and storyline are present if contentElements are present', () => {
    const result = normalizeSeed({
      contentElements: [{}]
    });

    expect(result).toMatchObject({
      collections: {
        storylines: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {}
          }
        ],
        chapters: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {}
          }
        ],
        sections: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {}
          }
        ]
      }
    });
    expect(result.collections.chapters[0].storylineId).toBe(result.collections.storylines[0].id);
    expect(result.collections.sections[0].chapterId).toBe(result.collections.chapters[0].id);
    expect(result.collections.contentElements[0].sectionId).toBe(result.collections.sections[0].id);
  });

  it('ensures required section properties are present', () => {
    const result = normalizeSeed({
      sections: [{}]
    });

    expect(result).toMatchObject({
      collections: {
        sections: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {
              backdrop: {image: '#000'},
              transition: 'scroll'
            }
          }
        ]
      }
    });
  });

  it('ensures required section properties are present when configuration is set', () => {
    const result = normalizeSeed({
      sections: [{configuration: {backdrop: {image: 1}}}]
    });

    expect(result).toMatchObject({
      collections: {
        sections: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            configuration: {
              backdrop: {image: 1},
              transition: 'scroll'
            }
          }
        ]
      }
    });
  });

  it('ensures required content element properties are present', () => {
    const result = normalizeSeed({
      contentElements: [{}]
    });

    expect(result).toMatchObject({
      collections: {
        contentElements: [
          {
            id: expect.any(Number),
            permaId: expect.any(Number),
            typeName: 'textBlock',
            configuration: {}
          }
        ]
      }
    });
  });
});
