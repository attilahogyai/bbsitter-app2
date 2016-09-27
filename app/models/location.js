import Ember from 'ember';
import DS from 'ember-data';
var LocationModel=DS.Model.extend({
	countryCode: DS.attr('string'),
	cityName: DS.attr('string'),
	timezoneid: DS.attr('string'),
	state_code: DS.attr('string'),

});
export default LocationModel;
Ember.Inflector.inflector.uncountable('location');