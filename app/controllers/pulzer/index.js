import Ember from 'ember';
import ApplicationController from "xprt/controllers/application";
import App from "xprt/app";

export default Ember.Controller.extend({
  changed:0,
  App:window.App,
  dayRoute:true,
  weekRoute:false,
  needs: ['pulzer/new','application'],
  newController: Ember.computed.alias("controllers.pulzer/new"),
  applicationController: Ember.computed.alias("controllers.application"),
  coverDays:1,
  slider: null,
  actDate: null,
  prevDate: null,
  nextDate: null,
  nextRenderDate: null,
  calendarSetup:null,

  actDateS:Ember.computed('actDate',function(){
    return this.get('actDate').format('YYYYMMDD');
  }),
  currentPath:Ember.computed('controllers.application.currentPath',function(){
    return this.get('applicationController.currentPath');
  }),
  eventList:Ember.computed('actDate','changed',function(){
    if(this.get('actDate')){
      var events=this.store.find('event',{date:this.get('actDate').format('YYYYMMDD')});
      App.Loader.listenTo(events);
      return events;
    }else{
      return null;
    }
  }),
  init: function(){
    if(this.get('actDate')===null){
      this.set('actDate',moment());
    }
    this._super();
  },
  actions:{
    
    jumpToNext: function(event){
      //this.set('nextRenderDate',moment(this.get('actDate').add('days', 1)));
      this.set('actDate',moment(this.get('actDate').add('days', this.get('coverDays'))));
      //Em.$.('sandbox').insertAfter()
      //if(this.get('slider')) this.get('slider').goToNextSlide();
    },
    jumpToPrev: function(event){
      this.set('actDate',moment(this.get('actDate').subtract('days', this.get('coverDays'))));
      //if(this.get('slider')) this.get('slider').goToPrevSlide();
    }

  }
});