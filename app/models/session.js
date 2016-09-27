import Ember from 'ember';
import DS from 'ember-data';
var SessionModel=DS.Model.extend({
	token: DS.attr('string'),
	scope: DS.attr('string'),
	username : DS.attr('string'),
	userid : DS.attr('string'),
	image : DS.attr('string'),
	createDt: DS.attr('date'),
	modifyDt: DS.attr('datetime'),
	prevLogin: DS.attr('date'),
	xprtDetailId: DS.attr('number'),
	version:function(){
		if(!Ember.isEmpty(this.get('modifyDt'))){
      		return this.get('modifyDt').format('YYMDHms');
    	}
    	return 1;
	}.property('modifyDt')
});
export default SessionModel;
Ember.Inflector.inflector.uncountable('session');