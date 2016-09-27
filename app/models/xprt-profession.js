import Ember from 'ember';
import DS from 'ember-data';
var XprtProfessionModel=DS.Model.extend({
	professionDesc: DS.attr('string'),
	profession: DS.belongsTo('profession',{async: true}),
	xprtDetail: DS.belongsTo('xprtDetail',{async: true}),
	study: DS.belongsTo('study',{async: true})
	
});
export default XprtProfessionModel;
Ember.Inflector.inflector.uncountable('xprtProfession');