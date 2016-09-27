/**
Mixin used to save user timetable and holiday calendarSetup
**/
import Ember from 'ember';
import App from "xprt/app";
export default Ember.Mixin.create({
  calendarSetup: null,
  isProcessing:false,
  hasSetup: function(){
    if(this.get('calendarSetup')!=null && !this.get('calendarSetup.isEmpty')){
      return true;
    }else{
      return false;
    }
  }.property('calendarSetup'),
  actions:{
    saveSetup:function(){
      if(this.get('isProcessing')){
        return false;
      }
      this.set('isProcessing',true);



      var calendarSetup=this.get('calendarSetup');
      calendarSetup.setFirstDay(moment.langData()._week.dow);

      var c=this;
      var modelObject=calendarSetup.serialize();
      modelObject.save().then(
        function (status){
          c.set('isProcessing',false);
          if(c.get('setupSaved')!==undefined){
            c.get('setupSaved').apply(c);
          }
          c.setupOnRevealCloseHistoryBack();
          c.send('infoAlert',{text: App.locX("/profile/timetable_setup_saved")});
        }).catch(
        function (status){
          c.set('isProcessing',false);
          c.setupOnRevealCloseReopenCurrent();
          c.send('errorAlert',{text: App.locX("/profile/timetable_save_error")});
        });
    }
  } 
});
