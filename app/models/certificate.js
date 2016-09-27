import Ember from 'ember';
import DS from 'ember-data';
import App from "xprt/app";
var CertModel=DS.Model.extend({
	stringRepr: function(){
		return this.get('description');
	}.property('description'),
	editables: function(){
		return ['description'];
	},
	description: DS.attr('string')
});
CertModel.reopenClass({
	FIXTURES:[
	{
	    id: 1,
	    description: App.locX('/ids_table/1')
	},
  {
	    id: 2,
	    description: App.locX('/ids_table/2')
  },
  {
	    id: 3,
	    description: App.locX('/ids_table/3')
  },  
  {
	    id: 4,
	    description: App.locX('/ids_table/4')
  }]
});


export default CertModel;
Ember.Inflector.inflector.uncountable('certificate');
