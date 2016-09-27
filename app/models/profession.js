import Ember from 'ember';
import DS from 'ember-data';
var ProfessionModel=DS.Model.extend({
	stringRepr: function(){
		return this.get('name');
	}.property('name'),
	editables: function(){
		return ['name'];
	},
	name: DS.attr('string')
});
export default ProfessionModel;
Ember.Inflector.inflector.uncountable('profession');