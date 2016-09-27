import Ember from 'ember';
import ApplicationController from "xprt/controllers/application";
import App from "xprt/app";


export default ApplicationController.extend({
  app:window.App,
  session:Ember.computed.alias('app.authManager.session'),
  email:null,
  password:null,
  message: null,
  isError: false,
  isSuccess: false,
  needs: ['application'],
  prevTransition: null,
  applicationController: Ember.computed.alias("controllers.application"),
  reset: function(){
    this.set('email',null);
    this.set('password',null);
    this.set('message',null);
    this.set('isError',false);
    this.set('isSuccess',false);
  },
  makeBaseAuth: function(user, password) {
    var tok = user + ':' + password;
    var hash = App.Base64.encode(tok);
    return "Basic " + hash;
  },
  loginSucces: function(status){
    this.set('message',App.locX("/signin/success"));
    this.set('isSuccess',true);
    this.set('isError',false);
    this.send('closeModal');
    Ember.run.later(this, function() {
      if(this.get('prevTransition')!==null){
        var prev=this.get('prevTransition');
        this.set('prevTransition',null);
        prev.retry();
      }else{
        this.transitionToRoute('profile');  
        /*
        if(this.get('session.prevLogin')===null){
          this.transitionToRoute('profile');  
        }else{
          this.transitionToRoute('pulzer.week',moment().format('YYYYMMDD'));  
        }
        */
      }
    },300);
  },
  loginError: function(status){
    this.set('message',App.locX("/signin/error",[status.statusText,status.status]));
    this.set('isError',true);
  },
  handleSessionData:function(data){
    if(data.access_token){
      var sessionInfo=this.store.createRecord('session',{
        token:data.access_token,
        scope:data.scope,
        username:data.username,
        userid:data.userid,
        createDt:new Date(),
        modifyDt:moment(data.modifyDt),
        prevLogin:null,
        xprtDetailId:data.xprtDetailId
      });
      if(data.prevLogin!==null){
        sessionInfo.set('prevLogin',moment(data.prevLogin).toDate());
      }
      var c=this;
      sessionInfo.save().then(
        function (status){
          window.App.authManager.setup(sessionInfo);
          return c.loginSucces(status);
        }).catch(
        function (status){
          return c.loginError(status);
        }
      );
    }
  },
  actions:{
    googlelogin:function(){
      var form=Ember.$('#googlePost');
      form.submit();
      return false;
    },
    facebooklogin:function(){
      var form=Ember.$('#facebookPost');
      form.submit();
      return false;
    },
    
    doSignIn: function(){
      var id='xp'+moment().format("X")+Math.floor((10000+Math.random()*100000));
      var c = this;
      var loginPromisse=Ember.$.ajax({
          type: 'POST',
          url: '/api/token',
          cache: false,
          data: {
            username: this.get('email'),
            grant_type: "client_credentials",
            scope: "basic,xprt",
            password: this.get('password')

          },
          success:function(data) {
            if(data.access_token){
              c.handleSessionData.apply(c,[data]);
            }else{
              c.loginError();
            }
          },
          error:function(status) {
            c.loginError(status);
          } 
        });
      App.Loader.startLoadProcess(loginPromisse);
      return false;
    }
    
  }
});

