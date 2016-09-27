import Ember from 'ember';
import App from 'xprt/app';
export default Ember.Controller.extend({
    queryParams: ['signin','signup'],
    signin:null,
    signup:null,
    app:window.App,
    authenticated: Ember.computed.readOnly('app.authManager.authenticated'),
    isAdminUser: Ember.computed.readOnly('app.authManager.admin'),
    signinObserver:function(){
        var c=this;
        if(this.get('signin')!==null){
            Ember.run.schedule('afterRender', function task3(){
               c.send('jumpToSignin');
            });   
        }
        if(this.get('signup')!==null){
            Ember.run.schedule('afterRender', function task3(){
                this.send('jumpToSignup');
            });
        }
    }.observes('signin','signup').on('init'),


    prevRouteName:null,
    tmpCurrRouteName:null,
    needs: ['application'],
    applicationController: Ember.computed.alias("controllers.application"),
    loader: Ember.inject.service(),
    loading:Ember.computed.readOnly('loader.loading'),
    currentRouteNameObserver:function(){
        if(this.get("currentRouteName")===undefined || 
            this.get("currentRouteName")===null ||
             this.get("currentRouteName")==="loading"){
            return;
        }
        var curr=this.get("tmpCurrRouteName");
        if(curr!==this.get("currentRouteName")){
            this.set("prevRouteName",curr);
            window.Em.prevRouteName=curr;
        }
        this.set("tmpCurrRouteName",this.get("currentRouteName"));
        window.Em.currRouteName=this.get("currentRouteName");
    }.observes("currentRouteName").on("init"),
    //menuTitle:"Bébiszitter (kereső/bérlés/időre)?",
    cite: "Connecting experts",

    username:Ember.computed.readOnly('app.authManager.session.username'),
    userid:Ember.computed.readOnly('app.authManager.session.userid'),
    session:Ember.computed.readOnly('app.authManager.session'),

    profileImg:function(){
        return "background-image:url(/api/profileimage?u="+this.get('userid')+"&v="+this.get('session.version')+");float:left";
    }.property('session.version'),

    todayS:moment().format('YYYYMMDD')
    
});
