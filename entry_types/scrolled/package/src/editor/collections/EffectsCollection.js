import Backbone from 'backbone';
import {features} from 'pageflow/frontend';
import {Effect} from '../models/Effect';

export const EffectsCollection = Backbone.Collection.extend({
  model: Effect,

  getUnusedEffects() {
    const effects = this;
    const unusedEffects = new Backbone.Collection(
      Effect.names
        .filter(name => features.isEnabled('decoration_effects') ||
                        Effect.getKind(name) !== 'decoration')
        .filter(name => !this.findWhere({name}))
        .map(name => ({name})),
      {
        comparator: effect => Effect.names.indexOf(effect.get('name')),

        model: Backbone.Model.extend({
          initialize({name}) {
            this.set('label', Effect.getLabel(name));
          },

          selected() {
            effects.add({name: this.get('name')});
          }
        })
      }
    );

    this.listenTo(this, 'add', effect =>
      unusedEffects.remove(unusedEffects.findWhere({name: effect.get('name')}))
    );

    this.listenTo(this, 'remove', effect =>
      unusedEffects.add({name: effect.get('name')})
    );

    this.listenTo(unusedEffects, 'add remove', () =>
      updateSeparation(unusedEffects)
    );

    updateSeparation(unusedEffects);

    return unusedEffects;
  }
});

function updateSeparation(effects) {
  effects.reduce((previous, effect) => {
    effect.set('separated',
               previous &&
               Effect.getKind(effect.get('name')) !== Effect.getKind(previous.get('name')));
    return effect;
  }, null);
}
