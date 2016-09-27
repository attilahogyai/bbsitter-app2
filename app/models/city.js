import Ember from 'ember';
import DS from 'ember-data';
import App from "xprt/app";
var CityModel=DS.Model.extend({
	cityName: DS.attr('string'),
  stateCode: DS.attr('string'),
  countryCode: DS.attr('string')
});

export default CityModel;
Ember.Inflector.inflector.uncountable('city');