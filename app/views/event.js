import Ember from 'ember';
import App from "xprt/app";
var EventView=Ember.View.extend({
	app: window.App,
	templateName: "views/event",
	attributeBindings: ['style'],
	top: 0,
	left: 0,
	height: 0,
	width: 0,
	session: Ember.computed.alias('app.authManager.session'),
	event: null,
	hidden: function(){
		return this.get('event').get('name')==null;
	}.property(),
	class: function(){
		if(Ember.isEmpty(this.get('event.name')) || this.get('session')===null){
			return 'event-panel-hidden';
		}
		var myid=parseInt(this.get('session.userid'));
		var clazz="";
		if(parseInt(this.get('event.hostId')) === myid){
			clazz = 'event-panel';
		}else if(parseInt(this.get('event.initiatorId')) === myid){
			clazz = 'event-panel';
		}else{
			clazz = 'event-panel';
		}
		return clazz+'-'+this.get('event.status');
	}.property('event'),
	eventInfo:function(){
		var myid=parseInt(this.get('session.userid'));
		if(this.get('event.initiatorId')===this.get('event.hostId') && this.get('event.hostId')===myid){
			return App.locX('/event/owncreated');
		}else if(parseInt(this.get('event.hostId')) === myid){
			return this.get('event.initiator.name');
		}else{
			return this.get('event.host.name');
		}
	}.property('event'),
	style: function(){
		return 'position:absolute;left:'+this.get('left')+'px;top:'+this.get('top')+'px;height:'+this.get('height')+'px;width:'+this.get('width')+'px';
	}.property('top','left'),
	showDeleteButton:function(){
		var myid=parseInt(this.get('session.userid'));
		if(parseInt(this.get('event.initiatorId')) === myid && this.get('event.status')===1){
			return true;
		}
		return false;
	},
	setPosition: function(){
		var c=this;
		var start=moment(this.get('event.startDate'));
		var end=moment(this.get('event.endDate'));
		//var heightMultiplier=end.diff(start,'minutes')/30;
				

		var startId=start.format('YYYYMMDD[h]H_mm')+'_event';
		var endId=end.format('YYYYMMDD[h]H_mm')+'_event';
		var offsetStart = Ember.$('#'+startId).position();
		var offsetEnd = Ember.$('#'+endId).position();
		if(offsetStart && offsetEnd){
			var height = offsetEnd.top - offsetStart.top;
			var width = Ember.$('#'+startId).width();
			this.set('left',offsetStart.left);
			this.set('top',offsetStart.top);
			this.set('height',height);
			this.set('width',width);
		}else{
			Ember.Logger.debug('start:'+'#'+startId+' or end'+'#'+endId+' not found');
		}
	},
	didInsertElement: function(){
		var c=this;
		Ember.run.scheduleOnce('afterRender', function(){
			c._super();
			c.setPosition();
			Ember.addChangeSizeListener(function(){
				c.setPosition.apply(c);
			},c);			
		});
	},
	willClearRender: function(){
		this._super();
		Ember.removeChangeSizeListeners(this);
		this.setPosition();
	}
});

export default EventView;