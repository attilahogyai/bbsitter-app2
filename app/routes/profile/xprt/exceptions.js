import Ember from 'ember';
import AuthenticatedRoute from "xprt/routes/authenticated";
import App from "xprt/app";
export default AuthenticatedRoute.extend({
	model:function(params,transition){
		var calendarSetup=this.loadCalendarSetup(params.xprtid);
		var xprtDetail=this.store.find('xprtDetail',params.xprtid);
		var promise=Ember.RSVP.all([calendarSetup,xprtDetail]);
		return promise;
	},
	setupController: function(controller, model) {
		controller.set('calendarSetup',model[0]);
		controller.set('xprtDetail',model[1]);
	}
});
