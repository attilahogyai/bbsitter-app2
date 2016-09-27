import Ember from 'ember';
import App from "xprt/app";
export default Ember.Route.extend({
	model:function(params, transition, queryParams){
		var resultPromise=this.store.find('xprtDetail',{cId:params.cId,cN:params.cN});
		var p = Ember.RSVP.all([resultPromise,params]);
		return p;
	},
	setupController: function(controller, model) {
		controller.set('searchResult', model[0]);
		controller.set('cityText', model[1].cN);
		controller.set('cityId', model[1].cId);
	}
});
