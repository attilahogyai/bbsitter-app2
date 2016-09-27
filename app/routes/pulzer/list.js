import AuthenticatedRoute from "xprt/routes/authenticated";
import EventListRouteMixin from "xprt/mixins/event-edit-route-actions";
export default AuthenticatedRoute.extend(EventListRouteMixin,{
	setupController: function(controller, model, transition) {
		controller.incrementProperty('changed');
	}	
});
