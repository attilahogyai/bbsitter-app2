import Ember from 'ember';
import DS from 'ember-data';
import App from "xprt/app";
var LanguageModel=DS.Model.extend({
	stringRepr: function(){
		return this.get('description');
	}.property('description'),
	editables: function(){
		return ['description'];
	},
	code: DS.attr('string'),
	description: DS.attr('string'),

});

Ember.Logger.info('INIT LanguageModel');
LanguageModel.reopenClass({
FIXTURES:[
	{
	    id: 1,
	    code: 'HU',
	    description: App.locX('/lang_table/hu')
	},
  {
	    id: 2,
	    code: 'EN',
	    description: App.locX('/lang_table/en')
  },
  {
	    id: 3,
	    code: 'FR',
	    description: App.locX('/lang_table/fr')
  },
  {
	    id: 4,
	    code: 'DE',
	    description: App.locX('/lang_table/de')
  },
  {
	    id: 5,
	    code: 'FR',
	    description: App.locX('/lang_table/fr')
  },
  {
	    id: 6,
	    code: 'RU',
	    description: App.locX('/lang_table/ru')
  },
  {
	    id: 7,
	    code: 'IT',
	    description: App.locX('/lang_table/it')
  },
  {
	    id: 8,
	    code: 'ES',
	    description: App.locX('/lang_table/es')
  },
  {
	    id: 9,
	    code: 'PL',
	    description: App.locX('/lang_table/pl')
  },
  {
	    id: 9,
	    code: 'RO',
	    description: App.locX('/lang_table/ro')
  },
  {
	    id: 9,
	    code: 'BG',
	    description: App.locX('/lang_table/bg')
  },
  {
	    id: 9,
	    code: 'HR',
	    description: App.locX('/lang_table/hr')
  }
]
});


export default LanguageModel;
Ember.Inflector.inflector.uncountable('language');