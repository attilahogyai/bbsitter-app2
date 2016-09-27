import BaseRoute from "xprt/routes/base";
import Ember from 'ember';
export default BaseRoute.extend({
  app:window.App,
  authenticated: Ember.computed.readOnly('app.authManager.authenticated'),
  beforeModel: function(transition){
    if(!this.get('authenticated')){
      transition.abort();
      var loginController = this.controllerFor('user/signin');
      loginController.set('prevTransition',transition);
      this.transitionTo('index',{queryParams: {signin: 'true'}});
    }
  },
  setupAuth: function(promise){
    var c=this;
    promise.catch(function(error){
      if(error.status===403){
        var loginController = this.controllerFor('user/signin');
        //loginController.set('prevTransition',transition);                
        c.transitionTo('index',{queryParams: {signin: 'true'}});
      }else{
        console.log('promise.error:'+error);
      }
    });
  },
  actions:{
    refreshRoute:function(){
      this.refresh();
    }
  }
});