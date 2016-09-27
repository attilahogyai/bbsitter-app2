import Ember from 'ember';
export default Ember.Handlebars.makeBoundHelper(function(name) {
  return Ember.String.capitalize(this.get(name));
});
