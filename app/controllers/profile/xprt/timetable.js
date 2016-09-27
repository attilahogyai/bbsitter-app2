import Ember from 'ember';
import ApplicationController from "xprt/controllers/application";
import App from "xprt/app";
import CalendarSetup from "xprt/utils/calendar-setup";
import SaveSetupMixin from "xprt/mixins/save-setup";

export default Ember.Controller.extend(SaveSetupMixin,{

	// inital setup properties
	twoPeriod: false,
	p1from:9,
	p1to:Ember.computed('twoPeriod',function(){
		if(!this.get('twoPeriod')) { return 17; } else { return 11; }
	}),
	p2from:14,
	p2to:17,
	weekPeriod:1, // 1- workdays, 2- whole week, 3- weekend

	// properties

	settingsObject:null,
	slider:null,
	xprtId:null,
	initStep:1,
	is1:Ember.computed('initStep',function(){
		return this.get('initStep')===1;
	}),
	is2:Ember.computed('initStep',function(){
		return this.get('initStep')===2;
	}),
	weekDays:Ember.computed('calendarSetup',function(){
		return this.get('calendarSetup.weekdaysarray');
	}),
	actions:{
		addPeriod: function(period,index){
			var col=Ember.$("#day-"+index);
			if(col){
				col.height('auto');
				period.pushObject({from:9,to:17});
				//Ember.run.later(this, function(){App.equalize("#day-setup",false);} ,200);
			}
		},
		delPeriod:function(period,o,index){
			var col=Ember.$("#day-"+index);
			if(col){
				col.height('auto');
				
				period.removeObject(o);
				//Ember.run.later(this, function(){App.equalize("#day-setup",false);} ,200);
			}
		},
		setupPeriods:function(){
			var p1 = Ember.$.isNumeric(this.get('p1from')) && Ember.$.isNumeric(this.get('p1to'));
			var p2 = Ember.$.isNumeric(this.get('p2from')) && Ember.$.isNumeric(this.get('p2to'));
			if(!p1 || (!p2 && this.get('twoPeriod'))){
				this.send('errorAlert',{text: App.locX("/profile/please_fill_periods")});
			}else{
				this.send('nextSetup');
			}
		},
		nextSetup:function(step){
			this.set('initStep',this.incrementProperty('initStep'));
			//if(this.get('slider')) { this.get('slider').goToNextSlide(); }
		},
		setupReady:function(){
			var secondPeriod=null;
			if(this.get('twoPeriod')){
				secondPeriod=[this.get('p2from'),this.get('p2to')];
			}
			var calendarSetup=new CalendarSetup();
			var settings=calendarSetup.createWeekSetup(this.get('weekPeriod'),[this.get('p1from'),this.get('p1to')],secondPeriod);
			var modelObject = this.store.createRecord('setup',  {name:'timetable',settings:settings,xprtDetail:this.get('xprtId')});
			var c=this;

			//c.setupOnRevealCloseReopenCurrent();

			modelObject.save().then(
				function (status){
					calendarSetup.deserialize(modelObject);
					c.set('calendarSetup',calendarSetup);
					//c.send('infoAlert',{text: App.locX("/profile/first_setup_ready")});	
				}
				).catch(
				function (status){
					c.setupOnRevealCloseReopenCurrent();
					c.send('errorAlert',{text: App.locX("/profile/first_setup_save_error")});	
					throw new Error('error saving timetable');					

				}
			);
		}
	}

});
