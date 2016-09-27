import Ember from 'ember';
import DS from 'ember-data';
import App from "xprt/app";
import {locHour,locHourMinute} from 'xprt/helpers/loc-hour';


var EventModel=DS.Model.extend({
	stringRepr: function(){
		return this.get('name');
	}.property('name'),
	name: DS.attr('string'),
	description: DS.attr('string'),
	startDate: DS.attr('datetime'),
	endDate: DS.attr('datetime'),
	location: DS.attr('string'),
	initiator: DS.belongsTo('useracc',{ async: true }),
	initiatorId: DS.attr('number'),
	host: DS.belongsTo('useracc',{ async: true }),
	hostId: DS.attr('number'),
	status: DS.attr('number'),
	xprtDetail: DS.belongsTo('xprtDetail'),
	createDt: DS.attr('datetime'),
	modifyDt: DS.attr('datetime'),
	actionComment: DS.attr('string'),
	notification: DS.attr('number'),
	address: DS.belongsTo('address',{ async: true }),
	editables: function(){
		return ['name','description','location','startDate','endDate','initiator','status'];
	},

	// helpers 
	isInRequestState:function(){
		var state=this.get('status') || 0;
		return [1].indexOf(state)>-1;
	}.property('status'),
	isAccepted:function(){
		var state=this.get('status') || 0;
		return [20].indexOf(state)>-1;
	}.property('status'),
	isInFinalState:function(){
		var state=this.get('status') || 0;
		return [10,40,50].indexOf(state)>-1;
	}.property('status'),
	wDay:function(){
		return this.get('startDate').format('ddd');
	}.property('startDate'),
	day:function(){
		return this.get('startDate').format('DD');
	}.property('startDate'),
	bg:function(){
		var state=this.get('status') || 0;
		return 'event-bg-'+state;
	}.property('status'),
	color:function(){
		var state=this.get('status') || 0;
		return 'event-color-'+state;
	}.property('status'),
	month:function(){
		return this.get('startDate').format('MMM');
	}.property('startDate'),
	startHour:function(){
		return locHourMinute(this.get('startDate').hour(),this.get('startDate').minute());
	}.property('startDate'),
	statusText: function(){
	    if(this.get('id')){
	      var s="/event_status/"+this.get('status');
	      return App.locX(s);
	    }
	    return '';
  	}.property('status'),
	endHour:function(){
		return locHourMinute(this.get('endDate').hour(),this.get('endDate').minute());
	}.property('startDate'),
	format:{
		startDate: 'L LT',
		endDate:'L LT'
	},
	
});
export default EventModel;
Ember.Inflector.inflector.uncountable('event');