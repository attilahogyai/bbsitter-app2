import Ember from 'ember';
import App from "xprt/app";
import CalendarSetup from "xprt/utils/calendar-setup";
export default Ember.Route.extend({
  app: window.App,
  userid: Ember.computed.alias('app.authManager.session.userid'),
  xprtDetailId: Ember.computed.alias('app.authManager.session.xprtDetailId'),
  /*
  beforeModel:function(){
    App.Loader.startAppLoadProcess();
  },
  */

  getSinglePromise:function(inputPromise){
    var promise=new Ember.RSVP.Promise(function(resolve,reject){
      inputPromise.then(function(data){
        resolve(data);            
      },function(error){
        resolve(null);            
      });   
    });
    return promise;
  },  
  getXprtDetail:function(){
    if(this.get('xprtDetailId')===undefined || this.get('xprtDetailId')===null){
      var promise=new Ember.RSVP.Promise(function(resolve,reject){
        resolve(null);            
      });   
      return promise;  
    }else{
      return this.getSinglePromise(this.store.find('xprtDetail',this.get('xprtDetailId')));
    }
  },
  loadCalendarSetup: function(xprtID,userID,optParams){
    var c=this;
    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
      var setupP = null;
      if(xprtID!==null){
        setupP = c.store.find('setup',{xprtid:xprtID});
      }else{
        setupP = c.store.find('setup',{useracc:userID});
      }  
      setupP.then(function(data){
        var s=new CalendarSetup();
        if(data.get('length')===1){
          s.deserialize(data.get('firstObject'));  
        }else{
          Ember.Logger.warn(' more or less setup record than 1 - > '+data.get('length'));
        }
        if(optParams!==null && optParams!==undefined){
          optParams.calendarSetup=s;
          resolve(optParams);  
        }else{
          resolve(s);  
        }
        
      }).catch(function(status){
        reject(status);
      });

    });
    return promise;
  }
});
