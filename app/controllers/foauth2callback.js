import Ember from 'ember';
import OAuth2CallbackController from "xprt/controllers/oauth2callback";
export default OAuth2CallbackController.extend({
	checkUrl:function(){
		return 'foauth2tokencheck';
	}
});
