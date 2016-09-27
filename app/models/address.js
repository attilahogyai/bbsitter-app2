import Ember from 'ember';
import DS from 'ember-data';
var AddressModel=DS.Model.extend({
	name: DS.attr('string'),
	zip: DS.attr('string'),
	street: DS.attr('string'),
	city: DS.belongsTo('city'),
	useracc:  DS.belongsTo('useracc')
});
export default AddressModel;
Ember.Inflector.inflector.uncountable('address');