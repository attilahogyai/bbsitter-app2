import Ember from 'ember';
import App from "xprt/app";
import Foundation from "xprt/utils/foundation";
export default Ember.Route.extend(Foundation,{
  modalName:null,
  loader:Ember.inject.service(),
  init: function(){
    return this._super();
  },
  triggerAlert:function(headerText,contentText,callback){

    var alertWindow=Ember.$('#errorAlert');
    var textBlock=Ember.$(alertWindow).find(">p");
    var headerBlock=Ember.$(alertWindow).find(">h2");
    Ember.$(textBlock).html(contentText);
    Ember.$(headerBlock).html(headerText);
    var okButton=Ember.$(alertWindow).find("input.ok");
    if(callback){
      Ember.$(okButton).one('click',function(){
        callback(alertWindow);
      });
    }else{
      Ember.$(okButton).one('click',function(){
        alertWindow.foundation('reveal', 'close');
        return false;
      });
    }
    alertWindow.foundation('reveal', 'open');

  },
  actions:{
    loading:function(data){
      this.get('loader').startLoadProcess(data.promise);
      console.log('loading...:'+data.promise);
    },

    signout: function(){
      window.App.authManager.signOut();
      this.store.unloadAll('user');
      this.store.unloadAll('useracc');
      this.store.unloadAll('xprtDetail');
      this.store.unloadAll('event');
      this.set('token',null);
      Ember.run.schedule('afterRender',function(){
          var n = window.location.href.indexOf("#");
          window.location.href=window.location.href.substring(0,n);
      });
    },

    openModal: function(modalName,controllerName) {
      if(!controllerName){
        controllerName=modalName;
      }
      var controller=null;
      if ((typeof controllerName)==='string'){
        controller=this.controllerFor(controllerName);
      }else{
        controller=controllerName;
      }
      
      if(controller && controller.reset){
        controller.reset();
      }
      this.render(modalName, {
        into: 'application',
        outlet: 'application-popup-outlet',
        controller: controller
      });
      var c=this;
      Ember.run.schedule('afterRender', function (){
        var subrouteWindow=Ember.$('#application-popup');
        modalName=modalName.replace('/','-');
        c.set('modalName',modalName);
        subrouteWindow.attr('class','reveal-modal app-modal '+modalName);
        subrouteWindow.foundation('reveal', 'open');          
        c.initFoundation();
      });
      return false;
    },
    closeModal: function() {
      var subrouteWindow=Ember.$('#application-popup');
      subrouteWindow.foundation('reveal', 'close');
      var modalName=this.get('modalName');
      this.disconnectOutlet({
        outlet: 'application-popup-outlet',
        parentView: 'application'
      });
      this.set('modalName',null);

      if(window.backLink==='current'){
        window.backLink=null;
        // do nothing the reveal was close above
      }else if(window.backLink){
        if(window.backLink.backController.get('changed')!==undefined){
          window.backLink.backController.incrementProperty('changed');
        }
        if(window.backLink.backData!==undefined){
          try{
            this.transitionTo(window.backLink.backPath,window.backLink.backData);
          }catch(err){
            Ember.Logger.info("route to "+window.backLink.backPath+" with data failed, try without");
            this.transitionTo(window.backLink.backPath);
          }
        }else{
          this.transitionTo(window.backLink.backPath);
        }
        window.backLink=null;
      }else {
        this.transitionTo('index');
      }
      return false;
    },
    jumpToSignup:function(){
      this.send('openModal','user/signup');
    },
    jumpToSignin:function(){
      this.send('openModal','user/signin');
    },
    authStateChanged: function(data){
      //token=App.AuthManager.token;
    },
    error: function(reason, transition){
      if(reason.status===401 || reason.status===403){
        this.transitionTo('signin');
      }else{
        Ember.onerror(reason);
      }
    },
    errorAlert: function(event){
      var header=App.locX("/alert/error");
      this.triggerAlert(header,event.text);
    },
    infoAlert: function(event,callback){
      var header=App.locX("/alert/info");
      this.triggerAlert(header,event.text,callback);
    },
    confirmAlert: function(event){
      var alertWindow=Ember.$('#confirmAlert');
      var textBlock=Ember.$(alertWindow).find(">p");
      Ember.$(textBlock).html(event.text);
      var yesButton=Ember.$(alertWindow).find("input.yes");
      var cancelButton=Ember.$(alertWindow).find("input.cancel");
      
      yesButton.one('click', function(){
        alertWindow.foundation('reveal', 'close');
        if(event.yes) {
          event.yes();
        }
        return false;
      });
      
      cancelButton.one('click', function(){
        alertWindow.foundation('reveal', 'close');
        if(event.cancel) {
          event.cancel();
        }
        return false;
      });
      alertWindow.foundation('reveal', 'open');
    },
    refresh:function(){
      this.refresh();
    }

  }
});
