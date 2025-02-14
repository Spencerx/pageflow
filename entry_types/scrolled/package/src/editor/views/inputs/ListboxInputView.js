import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {Listbox} from '@headlessui/react'
import Marionette from 'backbone.marionette';
import I18n from 'i18n-js';
import {inputView, cssModulesUtils, i18nUtils} from 'pageflow/ui';
import styles from './ListboxInputView.module.css';

export const ListboxInputView = Marionette.ItemView.extend({
  mixins: [inputView],
  className: styles.view,

  template: () => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
    <div class="${styles.container}"></div>
  `,

  ui: cssModulesUtils.ui(styles, 'container'),

  modelEvents() {
    return {
      [`change:${this.options.propertyName}`]: 'renderDropdown'
    }
  },

  initialize() {
    if (!this.options.texts) {
      if (!this.options.translationKeys) {
        var translationKeyPrefix =
          i18nUtils.findKeyWithTranslation(this.attributeTranslationKeys('values'));

        this.options.translationKeys = this.options.values.map(value =>
          translationKeyPrefix + '.' + value
        );
      }

      this.options.texts = this.options.translationKeys.map(key =>
        I18n.t(key)
      );
    }

    this.items = [
      ...this.options.values.map((value, i) => ({
        value,
        text: this.options.texts[i]
      }))
    ];

    if (this.options.includeBlank) {
      this.items.unshift({
        name: '',
        text: I18n.t(this.options.blankTranslationKey)
      });
    }
  },

  renderSelectedItem(item) {
    return item.text;
  },

  renderItem(item) {
    return item.text;
  },

  onRender() {
    this.renderDropdown();
  },

  updateDisabled() {
    this.renderDropdown();
  },

  renderDropdown(value, text) {
    ReactDOM.render(
      React.createElement(
        Dropdown,
        {
          items: this.items,
          disabled: this.isDisabled(),

          renderSelectedItem: item => this.renderSelectedItem(item),
          renderItem: item => this.renderItem(item),

          selectedItem: this.items.find(item =>
            item.value === (this.model.get(this.options.propertyName) ||
                            this.options.defaultValue)
          ) || this.items[0],

          onChange: value => {
            if (this.options.defaultValue && value === this.options.defaultValue) {
              this.model.unset(this.options.propertyName);
            }
            else {
              this.model.set(this.options.propertyName, value);
            }
          }
        }
      ),
      this.ui.container[0]
    );
  }
});

function Dropdown({
  items, disabled,
  renderItem, renderSelectedItem,
  selectedItem, onChange
}) {
  return (
    <Listbox value={selectedItem.value} disabled={disabled} onChange={onChange}>
      <Listbox.Button className={styles.button}>
        {renderSelectedItem(selectedItem)}
      </Listbox.Button>
      <Listbox.Options className={styles.options}>
        {items.map(item => (
          <Listbox.Option key={item.value || 'blank'} value={item.value}>
            {({active}) =>
              <div className={classNames(styles.option, {[styles.activeOption]: active})}>
                {renderItem(item)}
              </div>
            }
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
}
