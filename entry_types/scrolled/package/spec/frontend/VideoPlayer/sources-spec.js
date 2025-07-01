import {sources} from 'frontend/VideoPlayer/sources';
import {features} from 'pageflow/frontend';

describe('VideoPlayer sources', () => {
  beforeEach(() => features.enabledFeatureNames = []);

  it('includes hls variant by default', () => {
    const videoFile = {urls: {}};

    const result = sources(videoFile);

    expect(result.map(s => s.type)).toContain('application/x-mpegURL');
  });

  it('includes high mp4 variant by default', () => {
    const videoFile = {urls: {'high': 'http://example.com/4/high.mp4'}};

    const result = sources(videoFile);

    expect(result.map(s => s.type)).toContain('video/mp4');
    expect(result.filter(s => (s.type === 'video/mp4'))[0].src).toContain('high.mp4');
  });

  it('does not include dash variant by default', () => {
    const videoFile = {urls: {}};

    const result = sources(videoFile);

    expect(result.map(s => s.type)).not.toContain('application/dash+xml');
  });

  it('includes dash variant if file has dash playlist url', () => {
    const videoFile = {urls: {'dash-playlist': 'http://example.com/4/manifest.mpd'}};

    const result = sources(videoFile);

    expect(result.map(s => s.type)).toContain('application/dash+xml');
  });

  it('skips dash if hls_instead_of_dash feature is enabled', () => {
    const videoFile = {urls: {'dash-playlist': 'http://example.com/4/manifest.mpd'}};

    features.enable('frontend', ['hls_instead_of_dash']);
    const result = sources(videoFile);

    expect(result.map(s => s.type)).not.toContain('application/dash+xml');
    expect(result.map(s => s.type)).toContain('application/x-mpegURL');
  });

  it('ignores high playlist by default', () => {
    const videoFile = {urls: {
      'hls-playlist': 'http://example.com/4/hls-playlist.m3u8',
      'hls-playlist-high-and-up': 'http://example.com/4/hls-playlist-high-and-up.m3u8',
      'dash-playlist': 'http://example.com/4/dash-playlist.m3u8',
      'dash-playlist-high-and-up': 'http://example.com/4/dash-playlist-high-and-up.m3u8'
    }};

    const result = sources(videoFile);

    expect(result.map(s => s.src)).toContain('http://example.com/4/hls-playlist.m3u8');
    expect(result.map(s => s.src)).not.toContain('http://example.com/4/hls-playlist-high-and-up.m3u8');
    expect(result.map(s => s.src)).toContain('http://example.com/4/dash-playlist.m3u8');
    expect(result.map(s => s.src)).not.toContain('http://example.com/4/dash-playlist-high-and-up.m3u8');
  });

  it('supports ensuring adaptive min quality high', () => {
    const videoFile = {urls: {
      'hls-playlist': 'http://example.com/4/hls-playlist.m3u8',
      'hls-playlist-high-and-up': 'http://example.com/4/hls-playlist-high-and-up.m3u8',
      'dash-playlist': 'http://example.com/4/dash-playlist.m3u8',
      'dash-playlist-high-and-up': 'http://example.com/4/dash-playlist-high-and-up.m3u8'
    }};

    const result = sources(videoFile, {adaptiveMinQuality: 'high'});

    expect(result.map(s => s.src)).not.toContain('http://example.com/4/hls-playlist.m3u8');
    expect(result.map(s => s.src)).toContain('http://example.com/4/hls-playlist-high-and-up.m3u8');
    expect(result.map(s => s.src)).not.toContain('http://example.com/4/dash-playlist.m3u8');
    expect(result.map(s => s.src)).toContain('http://example.com/4/dash-playlist-high-and-up.m3u8');
  });

  it('falls back to default playlist if high-and-up playlist is not present', () => {
    const videoFile = {urls: {
      'hls-playlist': 'http://example.com/4/hls-playlist.m3u8',
      'dash-playlist': 'http://example.com/4/dash-playlist.m3u8',
    }};

    const result = sources(videoFile, {adaptiveMinQuality: 'high'});

    expect(result.map(s => s.src)).toContain('http://example.com/4/hls-playlist.m3u8');
    expect(result.map(s => s.src)).toContain('http://example.com/4/dash-playlist.m3u8');
  });

  it('uses medium quality if requested', () => {
    const videoFile = {urls: {'medium': 'http://example.com/4/medium.mp4'}};

    const result = sources(videoFile, {quality: 'medium'});

    expect(result.length).toBe(1);
    expect(result[0].src).toContain('medium.mp4');
  });

  it('uses fullhd quality if requested and available', () => {
    const videoFile = {urls: {
      'high': 'http://example.com/4/high.mp4',
      'fullhd': 'http://example.com/4/fullhd.mp4'
    }};

    const result = sources(videoFile, {quality: 'fullhd'});

    expect(result.length).toBe(1);
    expect(result[0].src).toContain('fullhd.mp4');
  });

  it(
    'falls back to high quality if fullhd is requested but not available',
    () => {
      const videoFile = {urls: {
        'high': 'http://example.com/4/high.mp4'
      }};

      const result = sources(videoFile, {quality: 'fullhd'});

      expect(result.length).toBe(1);
      expect(result[0].src).toContain('high.mp4');
    }
  );

  it('uses fullhd quality if force_fullhd_video_quality feature is enabled', () => {
    const videoFile = {urls: {
      'high': 'http://example.com/4/high.mp4',
      'fullhd': 'http://example.com/4/fullhd.mp4'
    }};

    features.enable('frontend', ['force_fullhd_video_quality']);
    const result = sources(videoFile);

    expect(result.length).toBe(1);
    expect(result[0].src).toContain('fullhd.mp4');
  });

  it('falls back to high quality if force_fullhd_video_quality feature is enabled', () => {
    const videoFile = {urls: {
      'high': 'http://example.com/4/high.mp4'
    }};

    features.enable('frontend', ['force_fullhd_video_quality']);
    const result = sources(videoFile);

    expect(result.length).toBe(1);
    expect(result[0].src).toContain('high.mp4');
  });

  it('uses 4k quality if requested and available', () => {
    const videoFile = {urls: {
      'high': 'http://example.com/4/high.mp4',
      '4k': 'http://example.com/4/4k.mp4'
    }};

    const result = sources(videoFile, {quality: '4k'});

    expect(result.length).toBe(1);
    expect(result[0].src).toContain('4k.mp4');
  });

  it('falls back to high quality if 4k is requested but not available', () => {
    const videoFile = {urls: {
      'high': 'http://example.com/4/high.mp4'
    }};

    const result = sources(videoFile, {quality: '4k'});

    expect(result.length).toBe(1);
    expect(result[0].src).toContain('high.mp4');
  });
});
