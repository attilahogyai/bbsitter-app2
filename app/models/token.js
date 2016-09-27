import Ember from 'ember';
import DS from 'ember-data';
var UserModel=DS.Model.extend({
	stringRepr: function(){
		return this.get('email');
	}.property('email'),
	name: DS.attr('string'),
	email: DS.attr('string'),
	password: DS.attr('string'),
	regDate: DS.attr('date'),
	contractDate: DS.attr('date'),
	editables: function(){
		return ['name','email','scopes'];
	},
});
export default UserModel;
Ember.Inflector.inflector.uncountable('user');