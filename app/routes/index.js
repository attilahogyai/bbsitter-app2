import Ember from 'ember';
import App from "xprt/app";
export default Ember.Route.extend({
	model:function(){
		var offerPromise=this.store.find('xprtDetail',{offer:true});
		//var offerPromise=App.getData('/offer',true,'GET',true,false,{},null,null);
		return offerPromise;
	},
	setupController: function(controller, model) {
		controller.set('offerList', model);
		controller.set('cityText', '');
		//window.App.authManager.findLocaleData('178.48.72.87');
		//var professions=this.store.find('profession');
		//controller.set('professions', professions);
	}
});
