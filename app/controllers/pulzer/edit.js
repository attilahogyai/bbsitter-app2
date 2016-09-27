import Ember from 'ember';
import ApplicationController from "xprt/controllers/application";
import App from "xprt/app";

export default Ember.Controller.extend({
  backRoute : null,
  host:0, // host should be 0 if the event owner is the logedin user
  xprt:0,
  xprtModel:null,    
  model: null,
  name: null,
  desc: null,
  actionComment: null,
  addressList: null,
  calendarSetup:null,

  statusText:Ember.computed('model.status',function(){
    if(this.get('model.id')){
      var s="/event_status/"+this.get('model.status');
      return App.locX(s);
    }
    return null;
  }),
  eventDate: null,
  startDate:Ember.computed('eventDate',function(key,value,oldValue){
    if(arguments.length>1){
      this.set('eventDate',moment(value));
      return;
    }
    if(this.get('eventDate')){
      return this.get('eventDate').format('L');
    }
  }),
  startTimeH:null,
  startTimeM:null,
  endTimeH:null,
  endTimeM:null,
  period: null,

  app:window.App,
  session: Ember.computed.alias('app.authManager.session'),

  hasLogList:Ember.computed('logList.content',function(){
    if(this.get('logList')===undefined){
      return;
    }
    if(this.get('logList').get('length') >0 ){
      return true;
    }
    return false;
  }),
  logList:Ember.computed('model.id',function(){

    if(this.get('model.id')===null) {
      return;
    }
    var c=this;
    return this.store.filter('log',{event:this.get('model.id')},function(log){
      return log.get('comment')!=='' && log.get('comment')!==null && log.get('comment')!=="null" && log.get('event.id')===c.get('model.id');
    });    
    
  }),

  isHost:Ember.computed('session','model',function(){
    if(this.get('session.userid')==this.get('model.host.id')){
      return true;
    }
    return false;
  }),
  isInitiator:Ember.computed('session','model',function(){
    if(this.get('session.userid')==this.get('model.initiator.id')){
      return true;
    }
    return false;
  }),

  showActionComment:Ember.computed('awaitingForAccept','awaitingForClose','showSaveButton','showResignButton',function(){
    return (this.get('awaitingForAccept') || this.get('awaitingForClose') || this.get('showSaveButton') || this.get('showResignButton')) && this.get('model.id')!==null;
  }),
  awaitingForAccept:Ember.computed('model',function(){
    return this.get('model.isInRequestState') && !this.get('awaitingForClose') && this.get('isHost');
  }),
  showCompletedButton:Ember.computed('model',function(){
    return this.get('model.status')!==30 && this.get('awaitingForClose')  && !this.get('model.isInFinalState');
  }),
  awaitingForClose:Ember.computed('model','model.isInFinalState',function(){
    return (moment().isAfter(this.get('eventDate')) && this.get('model.id')!==null) && !this.get('model.isInFinalState');
  }),
  disableEdit:Ember.computed('model.isInFinalState','awaitingForClose',function(){
    return this.get('model.isInFinalState') || this.get('awaitingForClose');
  }),
  placeholderActionComment:Ember.computed('awaitingForAccept',function(){
    if(this.get('awaitingForAccept')){
      return App.locX('/event/awaitingforaccept_placeholder');
    }
    return '';
  }),
  showSaveButton:Ember.computed('isInitiator','model',function(){
      if(moment().isAfter(this.get('model.startDate'))){ // save past events is not allowed
        return false;
      }
      return this.get('model.id')===null;
      // || this.get('isInitiator'); save is allowed just once
    }),
  showResignButton:Ember.computed('isInitiator','model',function(){
    if(moment().isAfter(this.get('model.startDate'))){ // resign past events is not allowed
      return false;
    }
    return this.get('model.id')!==null && !this.get('model.isInFinalState') && this.get('isInitiator');
  }),

  empty: function (){
    this.set('name',null);
    this.set('model',null);
    this.set('host',0);
    this.set('xprt',0);
    this.set('desc',null);
    this.set('eventDate',null);
    this.set('startTimeH',null);
    this.set('startTimeM',null);
    this.set('endTimeH',null);
    this.set('endTimeM',null);
    this.set('isError',false);
    this.set('isSuccess',false);
    this.set('message',null);
    this.set('actionComment',null);
  },
  fill: function(){
    this.set('name',App.locX('/event/new_name'));
    this.set('desc',App.locX('/event/new_desc',this.get('xprtModel.name')));
  },
  periodList: [],
  hourList: [],
  minuteList: [],

  isError: false,
  isSuccess: false,
  message: null,

  init: function(){
    // fill period values

    var pl=[];
    var currentLangData = moment.langData();
    var enLangData = moment.langData('en');

    var durationFormat=enLangData.getDurationTimeFormat;
    var hourFormat=enLangData.getHourFormat;
    var minuteFormat=enLangData.getMinuteFormat;

    if(currentLangData.getDurationTimeFormat) {
      durationFormat=currentLangData.getDurationTimeFormat;
    }

    for(var i=30;i<=480;i=i+30){
      App.moment.set('hour',0);
      App.moment.set('minute',0);
      App.moment.add('minutes',i);
      pl[(i/30)-1]=Ember.Object.create({
        id: i,
        idText: durationFormat(App.moment),
      });
    }

    // fill hour values
    var hl=[];

    if(currentLangData.getHourFormat) {
      hourFormat=currentLangData.getHourFormat;
    }

    for(var j=0;j<24;j++){
      App.moment.set('hour',j);
      hl[j]=Ember.Object.create({
        id: j,
        idText: hourFormat(App.moment),
      });
    }

    // fill minute values
    var ml=[];

    if(currentLangData.getMiniuteFormat) {
      minuteFormat=currentLangData.getMiniuteFormat;
    }
    for(var m=0;m<=30;m=m+30){
      App.moment.set('minute',m);
      ml[m/30]=Ember.Object.create({
        id: m,
        idText: minuteFormat(App.moment),
      });
    }
    this.set('period',60);
    this.set('periodList',pl);
    this.set('hourList',hl);
    this.set('minuteList',ml);

    this.addObserver('startTimeH',this.get('endTimeSetter'));
    this.addObserver('startTimeM',this.get('endTimeSetter'));
    this.endTimeSetter();

  },

  saveSucces: function(status){
    if(this.get('_message')){
      this.set('message',this.get('_message'));
    }else{
      this.set('message',App.locX("/event/save_success"));
    }
    this.set('isSuccess',true);
    this.set('isError',false);
  },
  saveError: function(status){
    if(this.get('_message')){
      this.set('message',this.get('_message'));
    }else{
      this.set('message',App.extractError(status));
    }
    this.set('isError',true);
  },
  endTimeSetter: function(){
    if(this.get('startTimeH')!==null && this.get('startTimeM')!==null){
      var m=moment();
      m.set('hour',this.get('startTimeH'));
      m.set('minute',this.get('startTimeM'));
      m.add('minutes',this.get('period'));
      this.set('endTimeM',parseInt(m.format('m')));
      this.set('endTimeH',parseInt(m.format('H')));
      Ember.Logger.info('endTime set finished, period:'+this.get('period'));
    }
  },
  actions:{
    handleData: function(changeStatus){
      var c=this;
      var startDate=moment(this.get('eventDate').format());
      startDate.set('hour',this.get('startTimeH'));
      startDate.set('minute',this.get('startTimeM'));
      var endDate=moment(this.get('eventDate').format());
      if(this.get('endTimeH')==0){
        endDate.add(1,'days');  
      }
      endDate.hour(this.get('endTimeH'));
      endDate.minute(this.get('endTimeM'));
      if(startDate.isAfter(endDate) || startDate.isSame(endDate)){
        return this.saveError({
          status:'time_error',
          statusText: App.locX('/event/error_start_time_after_end')
        });
      }
      if(this.get('calendarSetup').isHoliday(startDate) || this.get('calendarSetup').isHoliday(endDate)){
       return this.saveError({
          status:'time_error',
          statusText: App.locX('/event/error_day_holiday')
        }); 
      }      
      if(!this.get('calendarSetup').isValidIntervall(startDate,endDate)){
       return this.saveError({
          status:'time_error',
          statusText: App.locX('/event/error_time_intervall')
        }); 
      }

      var saveData=function(){
        var data={
          name: this.get('name'),
          description: this.get('desc'),
          startDate: startDate,
          host:this.get('host'),
          endDate: endDate,
          location: '',
          xprtDetail: this.get('xprtModel'),
          address: address,
          actionComment:this.get('actionComment')
        };
        var backDate=startDate.format('YYYYMMDD');

        //if(!this.get('model')){
        //    this.set('model',this.store.createRecord('event'));
        //}else{ // empty properties which should not touch during update
        if(this.get('model.id')!==null){ // empty properties which should not touch during update
          delete data.host;
          delete data.initiator;
        }
        this.get('model').setProperties(data);
        var savePromise=this.get('model').save();
        App.Loader.startSaveProcess(savePromise);
        savePromise.then(
          function (status){
            c.saveSucces(status);
            Ember.run.later(this, function() {
              c.send('closeModal');
            },1500);
          }).catch(
          function (status){
            c.get('model').rollback();
            return c.saveError(status);
          });
        return false;
      };

      // create new address if there are chenges in model
      var address=this.get('model.address');
      var addressSet=address.get('zip')!==undefined && address.get('street')!==undefined && address.get('city')!==undefined;
      if(addressSet){
        var changedProps=address.get('content').changedAttributes();
        if(Object.keys(changedProps).length>0){ // create new address object because the previouse version was changed
          var address2=this.store.createRecord('address',{zip:address.get('zip'),city:address.get('city'),street:address.get('street')});
          address2.save().then(function (status){ // new address create old should be rolled back because existing address should be leaved untouched
            address.get('content').rollback(); 
            address=address2;
            saveData.apply(c);
          }).catch(function (status){
            return c.saveError(status);
          });
        }else{
          saveData.apply(c);
        }
      }else{
        return this.saveError({
          status:'address_error',
          statusText: App.locX('/event/missing_address')
        });
      }

    },
    accept:function(){
      this.get('model').set('status','20');
      this.send('handleData');
    },
    reject:function(){
      this.get('model').set('status','10');
      this.send('handleData');
    },
    completed:function(){
      this.get('model').set('status','30');
      this.send('handleData');
    },
    fail:function(){
      this.get('model').set('status','40');
      this.send('handleData');
    },
    resign:function(){
      this.get('model').set('status','50');
      this.send('handleData');
    }
  }
});