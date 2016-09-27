import Ember from 'ember';
import ApplicationController from "xprt/controllers/application";
import App from "xprt/app";
export default Ember.Controller.extend({
	message:App.locX('/oauth/processing'),
	needs:['user/signin'],
	signinController: Ember.computed.alias("controllers.user/signin"),
	done:false,
	checkUrl:function(){
		return 'oauth2tokencheck';
	},
	codeObserver:function(){
		if(this.get('model.authToken')!=null){
			var c=this;
			var oauthPromise=App.getData(this.checkUrl()+'?code='+this.get('model.authToken'),false,'POST',true,false,{},null,null);
			oauthPromise.then(function(d){
				c.set('message',App.locX('/oauth/processing_done'));
				c.set('done',true);
				Ember.run.later(this,function(){
					var signin=c.get('signinController');
					signin.handleSessionData.apply(signin,[d]);
				},1000);
			},function(data){
				c.set('message',App.locX('/oauth/processing_error'));
				c.set('done',false);
			});
		}
	}.observes('model.authToken').on('init')

});
