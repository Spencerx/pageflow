import {Base} from '../../Base';

export const ColorInput = Base.extend({
  value: function() {
    return this._input().val();
  },

  fillIn: function(value, clock) {
    var input = this._input()[0];
    input.value = value;
    input.dispatchEvent(new Event('input', {bubbles: true}));

    clock.tick(500);
  },

  swatches: function() {
    var picker = this._input()[0].parentNode.querySelector('.color_picker');
    var buttons = picker.querySelectorAll('.color_picker-swatches button');

    return Array.from(buttons).map(function(button) {
      return window.getComputedStyle(button).color;
    });
  },

  _input: function() {
    return this.$el.find('input');
  }
});
