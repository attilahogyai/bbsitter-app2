import Ember from 'ember';
import DS from 'ember-data';
import App from "xprt/app";
var CurrencyModel=DS.Model.extend({
	code: DS.attr('string'),
	flag: DS.attr('string')
});

CurrencyModel.reopenClass({
	FIXTURES:[
		{
		    id: 1,
		    code: 'HUF',
		    flag: 'Ft'
		},
		{
		    id: 2,
		    code: 'EUR',
		    flag: '&#8364;'
		},
		{
			id: 3,
			code: 'USD',
			flag: '$'
		}
	]
});


export default CurrencyModel;
Ember.Inflector.inflector.uncountable('currency');