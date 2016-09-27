import BaseRoute from "xprt/routes/base";
import App from "xprt/app";
export default BaseRoute.extend({
  model:function(params, transition){
    return params;
  },
  setupController: function(controller, model) {
    controller.set('requestid',model.requestid);
    controller.set('newPassword','');
  },
  actions:{
    changePassword:function(newPassword,requestid,email){
      var reset=App.getData('/forgotChange',true,'POST',true,false,{
        new_password:newPassword,
        requestid:requestid,
        email:email
      },null,null);
      var c=this;
      reset.then(function(){
        c.send('infoAlert',{text: App.locX('/profile/password_changed')},function(popup){
          popup.foundation('reveal', 'close');
          c.controllerFor('forgotpwchange').set('newPassword', '');
          c.controllerFor('forgotpwchange').set('email', '');
          c.controllerFor('forgotpwchange').set('requestid', '');
          c.transitionTo('index',{queryParams: {signin: 'true'}});
        });
      },function(){
        c.send('infoAlert',{text: App.locX('/profile/password_change_error')});
      });
    }
  }
});
