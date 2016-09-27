import Ember from 'ember';
import FilterableMixin from '../../../mixins/filterable';
import { module, test } from 'qunit';

module('FilterableMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var FilterableObject = Ember.Object.extend(FilterableMixin);
  var subject = FilterableObject.create();
  assert.ok(subject);
});
