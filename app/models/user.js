import Ember from 'ember';
import DS from 'ember-data';
var UserModel=DS.Model.extend({
	stringRepr: function(){
		return this.get('email');
	}.property('email'),
	name: DS.attr('string'),
	email: DS.attr('string'),
	phone: DS.attr('string'),
	password: DS.attr('string'),
	image: DS.attr('boolean'),
	imagec: DS.attr('string'),
	//contractDate: DS.attr('date'),
	scopes: DS.attr('raw'),
	modifyDt:DS.attr('datetime'),
	profession: DS.attr('number'),
  	version:function(){
    	if(this.get('modifyDt')!==null){
      		return this.get('modifyDt').format('YYMDHms');
    	}
    	return 1;
  	}.property('modifyDt'),
	editables: function(){
		return ['name','email','scopes','regDate'];
	},
});
export default UserModel;
Ember.Inflector.inflector.uncountable('user');