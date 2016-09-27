import Ember from 'ember';
import DayEventsComponent from "xprt/components/day-events";
import App from "xprt/app";

export default DayEventsComponent.extend({
    periodDays: 6,
    weekMode:true,
    legend:false,
    weekDays:Ember.computed('date',function(){
        var weekDayArray=[];
        for(var i=0;i<=this.get('periodDays');i++){
            var date=null;
            if(this.get('weekMode')){
        	   date=this.get('date').clone().weekday(i);
            }else{
               date=this.get('date').clone().add('days',i);
            }
            weekDayArray[i]={
            	date:date,
            	dateS: date.format('YYYYMMDD')
            };
        }
        return weekDayArray;
    }),
    startOfWeek:Ember.computed('date',function(){
        if(this.get('weekMode')){
            return this.get('date').clone().weekday(0);
        }else{
            return this.get('date');
        }
    }),
    endOfWeek:Ember.computed('date',function(){
        return this.get('startOfWeek').clone().add('days',this.get('periodDays'));
    }),
    weekStr:Ember.computed('date',function(){
        return App.locX('/pulzer/number_of_week',[this.get('date').week()]);
    }),
    actions:{
		new: function(date,hour,minute){
			this.sendAction('new',this.get('xprt'),this.get('host'),date,hour,minute);
		},
        next: function(){
			var c=this;
			this.get('loader').startProcess(this,'next');
			Ember.run.later(function(){
				c.sendAction('next',c.get('date'));
			},50);
        },
        prev: function(){
			var c=this;
			this.get('loader').startProcess(this,'prev');
			Ember.run.later(function(){
				c.sendAction('prev',c.get('date'));
			},50);

        },
        edit: function(appEvent){
            this.sendAction('edit',appEvent);
        }
    }
});