import Ember from 'ember';
import DS from 'ember-data';
var LogModel=DS.Model.extend({
	event: DS.belongsTo('event',{async: true}),
	useracc: DS.belongsTo('useracc',{async: true}),
	comment: DS.attr('string'),
	type: DS.attr('string'),
	log: DS.attr('string'),
	objectData: DS.attr('string'),
	createDt: DS.attr('datetime')
});
export default LogModel;
Ember.Inflector.inflector.uncountable('log');