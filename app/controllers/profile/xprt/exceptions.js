import Ember from 'ember';
import ApplicationController from "xprt/controllers/application";
import App from "xprt/app";
import SaveSetup from "xprt/mixins/save-setup";
export default Ember.Controller.extend(SaveSetup,{
  xprtDetail:null,
  calendarSetup:null,
  exceptionDay:null,
  // inital calendarSetup properties
  useNationalHoliday: false,

  itemChanged:false,

  addEnabled:Ember.computed('exceptionDay',function(){
    if(this.get('exceptionDay')===null || !moment(this.get('exceptionDay'),'YYYY.MM.DD').isValid()){
      return false;
    }
    return true;
  }),
  saveEnabled:Ember.computed('itemChanged','addEnabled',function(){
    if(!this.get('addEnabled') && this.get('itemChanged')){
      return true;
    }
    return false;
  }),
  nationalHolidayList:Ember.computed('useNationalHoliday',function(){
    if(this.get('useNationalHoliday')){
      var promise=this.store.find('nationalHoliday',{countryCode:this.get('xprtDetail.country.id')});
      promise.then(function(){

      });
      return promise;
    }
    return null;
  }),
  holidayList:Ember.computed('calendarSetup','calendarSetup.holidays',function(){
    return this.get('calendarSetup.holidays');
  }),
  setupSaved:function(){
    this.set('itemChanged',false);
  },
  actions:{
    addDate:function(){
      if(!this.get('addEnabled')){
        return;
      }
      if(this.get('exceptionDay')!==null){
        this.get('calendarSetup.addHoliday').apply(this.get('calendarSetup'),[this.get('exceptionDay')]);        
        this.set('itemChanged',true);
        this.set('exceptionDay',null);
      }
    },
    removeDate:function(date){
      this.get('calendarSetup.holidays').removeObject(date);      
      this.set('itemChanged',true);
    }
  }
});

