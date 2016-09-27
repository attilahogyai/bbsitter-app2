import Ember from 'ember';
import AuthenticatedRoute from "xprt/routes/authenticated";
import App from "xprt/app";
import EventListRouteMixin from "xprt/mixins/event-edit-route-actions";
export default AuthenticatedRoute.extend(EventListRouteMixin,{
	app:window.App,
	session:Ember.computed.alias('app.authManager.session'),
	model:function(params,transition){
		return this.loadCalendarSetup(null,this.get('session.userid'),params);
	},
    setupController: function(controller, model) {
    	controller.set('calendarSetup',model.calendarSetup);
        var pulzerIndex = this.controllerFor('pulzer.index');
        var m = moment(model.actDate,'YYYYMMDD');
        pulzerIndex.set('actDate', m);
    }
});
