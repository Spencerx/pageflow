import React from 'react';

import {renderElement} from '../../EditableText';
import {LinkPreview} from '../LinkTooltip';

export function withLinks(editor) {
  const { isInline } = editor

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element)
  }

  return editor
}

export const renderElementWithLinkPreview =
  wrapRenderElementWithLinkPreview(renderElement);

export function wrapRenderElementWithLinkPreview(renderElement) {
  return function(options) {
    if (options.element.type === 'link') {
      return (
        <LinkPreview href={options.element.href}
                     openInNewTab={options.element.openInNewTab}>
          {renderElement(options)}
        </LinkPreview>
      )
    }
    else {
      return renderElement(options);
    }
  }
}
