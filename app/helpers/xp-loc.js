import Ember from 'ember';
export default Ember.Handlebars.helper('capitalize', function(value) {
  return value.toUpperCase();
});