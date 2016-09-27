import Ember from 'ember';
import AuthenticatedRoute from "xprt/routes/authenticated";
import App from "xprt/app";
export default AuthenticatedRoute.extend({
  
  model:function(params,transition){
    return Ember.RSVP.all([this.loadCalendarSetup(params.xprtid),params.xprtid]);
  },
  setupController: function(controller, model) {
    controller.set('calendarSetup',model[0]);
    controller.set('xprtId',model[1]);
  }
});
