import Ember from 'ember';
export default Ember.Component.extend({
	App:window.App,
	date: null,
	dateS: null,
    month: null,
	day: null,
	dayStr: null,
	nextProcessing:false,
	prevProcessing:false,
	host:0,
	xprt:0,
	calendarSetup: null,
	startHour:24,
	endHour:0,
	startEndHourObserver:function(){
		if(this.calendarSetup.get('isEmpty')){
			this.set('startHour',0);
			this.set('endHour',24);			
			return;
		}
		var startHour=23;
		var endHour=1;
		var weekDays=this.calendarSetup.get('weekDays').get('content');
		
		for(var j=0;j<weekDays.length;j++){
			var periods=weekDays[j].period;
			for(var i=0;i<periods.length;i++){
				//var from=parseInt(periods[i].from);
				//var to=parseInt(periods[i].to);
				if(startHour>periods[i].fromDate.hour()){
					startHour=periods[i].fromDate.hour();
				}
				if(periods[i].toDate.hour()==0){
					endHour=24;
				}
				if(endHour<periods[i].toDate.hour()){
					endHour=periods[i].toDate.hour();
				}
			}
		}
		if(endHour<=23){
			endHour=endHour+1;
		}
		this.set('startHour',startHour);
		this.set('endHour',endHour);
	}.observes('calendarSetup','date').on('init'),
	isOpen:function(date,hour){
		if(this.get('calendarSetup')===null || this.get('calendarSetup.isEmpty')) { return true; }
		if(this.get('calendarSetup').isHoliday(date)){
			return false;
		}
		var currentWeekday=date.weekday();
		
		var mostEarlyDelay=parseInt(this.get('calendarSetup.mostEarlyDelay'));
		var now=moment().add(mostEarlyDelay, 'hours');
		var checkDate=date.hour(hour);
		if(now.isAfter(checkDate)){ // create events in past is not enabled
			return false;
		}
		var weekday=currentWeekday;
		/*
		var setupWeekday=this.get('settings').weekDays[currentWeekday].day.weekday();
		
		if(currentWeekday!==setupWeekday){
			if(currentWeekday===6){
				weekday=0;	
			}else{
				weekday=weekday+1;
			}
			
		}*/
		var periods=this.get('calendarSetup.weekDays.content')[weekday].period;
		for(var i=0;i<periods.length;i++){
			if(hour>=periods[i].get('from') && (hour<periods[i].get('to') || periods[i].get('to')==0)){
				return true;
			}
		}
		return false;
	},
	hoursOfDay:Ember.computed('startHour','endHour','date',function(){
		var sh = [];
		var c=0;
		for(var j=this.get('startHour');j<this.get('endHour');j++){
			sh[c]=j;
			c++;
		}
		var i = 0;
		var h = [];
		for(i=0;i<sh.length;i++){
			h[i]={hour:sh[i]};
		}
		return h; 
	}),
	recalc:function(){
        this.set('month',this.get('date').format('MMMM'));
        this.set('day',this.get('date').format('D'));
        this.set('dayStr',this.get('date').format('dddd'));
        this.set('year',this.get('date').format('YYYY'));
        this.set('dateS',this.get('date').format('YYYYMMDD'));
	}.observes('date').on('init'),
	actions:{
		new: function(hour,minute){
			this.sendAction('new',this.get('xprt'),this.get('host'),this.get('date'),hour,minute);
		},
		next: function(){
			this.get('loader').startProcess(this,'next');
			Ember.Logger.info('next action');
			var c=this;
			Ember.run.later(function(){
				Ember.Logger.info('send next');
				c.sendAction('next',c.get('date'));
			},50);

			/*
			Ember.run.scheduleOnce('afterRender', function(){
				c.sendAction('next',c.get('date'));
				});
			*/
			//Ember.run.later(,10);

		},
		prev: function(){
			this.get('loader').startProcess(this,'prev');
			Ember.Logger.info('prev action');
			var c=this;
			Ember.run.later(function(){
				Ember.Logger.info('send prev');
				c.sendAction('prev',c.get('date'));
			},50);
				/*
			Ember.run.later(function(){
				c.sendAction('prev',c.get('date'));
				},10);
				*/
		}
	},
	didInsertElement:function(){

	}
});