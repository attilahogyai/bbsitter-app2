import Ember from 'ember';
import DS from 'ember-data';
var LangtextModel=DS.Model.extend({
	type: DS.attr('string'),
	code: DS.attr('string'),
	language: DS.attr('string'),
	text: DS.attr('string'),

	stringRepr: function(){
		var text=this.get('text');
		if(text.length>20){
			text=text.substring(0,19);	
		}
		return this.get('type')+'/'+this.get('code')+':'+text;
	}.property('type','text'),
	editables: function(){
		return ['type','code','language','text'];
	},
});
export default LangtextModel;
Ember.Inflector.inflector.uncountable('langtext');