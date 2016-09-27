import Ember from 'ember';
export default Ember.Component.extend({
	layout: Ember.Handlebars.compile('{{formatted}}'),
	date: null,
	format: null,

	formatted:Ember.computed('date', 'format',function() {
	  var date = this.get('date');
	  var format = this.get('format');

	  return date ? date.format(format) : null;
	})
});