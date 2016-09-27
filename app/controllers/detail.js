import Ember from 'ember';
import ApplicationController from "xprt/controllers/application";
import App from "xprt/app";
import CommentMixin from "xprt/mixins/comment-controller";
export default Ember.Controller.extend(CommentMixin,{
  queryParams:['userId'],
  userId:null,

  changed:0,

  actDate:moment(),
  xprt:null,
  calendarSetup:null,
  periodDays:6,
  showCalendar:false,
  eventList: null,
  commentList: null,
  rankList: null,


  eventListObserv: function(){
    var date=this.get('actDate').format('YYYYMMDD');
    if(this.get('xprt')!=null){
      var c=this;
      var publicEvents=this.store.find('event',{week:date,host:this.get('xprt.useracc.id')});
      publicEvents.then(function(data){
        Ember.Logger.debug('eventList set:'+data.get('length'));
        c.set('eventList',data);
      });
      this.get('loader').listenTo(publicEvents);
    }
  }.observes('actDate','xprt','changed').on('init'),
  showDetail: function(){ 
    if(this.get('xprt') === null){
      Ember.Logger.debug('xprt should not be null');
      return '';
    }
    if(!this.get('calendarSetup.isEmpty')){
      this.set('showCalendar',true);
    }else{
      this.set('showCalendar',false);
    }
  }.observes('xprt','calendarSetup').on('init'),
  actions:{
    backToResult: function(){
      this.set('xprt',null);
      this.set('showCalendar',false);
      this.transitionToRoute('index');
    },
    jumpToNext: function(event){
      //this.set('nextRenderDate',moment(this.get('actDate').add('days', 1)));
      this.set('actDate',moment(this.get('actDate').add('days', this.get('periodDays'))));
      //Em.$.('sandbox').insertAfter()
      //if(this.get('slider')) this.get('slider').goToNextSlide();
    },
    jumpToPrev: function(event){
      this.set('actDate',moment(this.get('actDate').subtract('days', this.get('periodDays'))));
      //if(this.get('slider')) this.get('slider').goToPrevSlide();
    }
  }
});