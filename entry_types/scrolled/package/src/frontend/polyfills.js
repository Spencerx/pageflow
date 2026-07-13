import {browser} from 'pageflow/frontend';

// Safari does not handle positive root margin correctly inside
// iframes. Use polyfill instead.
if (browser.agent.matchesSafari() && window.parent !== window) {
  delete window.IntersectionObserver;
}

require('intersection-observer');

// Make sure we're in a Browser-like environment before importing the
// polyfill. This prevents it from being imported in a Node test
// environment.
if (typeof window !== 'undefined') {
  require('scroll-timeline');
}
