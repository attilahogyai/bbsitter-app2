import Ember from 'ember';
import AuthenticatedRoute from "xprt/routes/authenticated";
export default AuthenticatedRoute.extend({
	renderTemplate: function (controller, model) {
		this.send('openModal','pulzer/edit',controller);
		/*
		this.render('pulzer/edit', { 
			into: 'application', outlet: 'application-popup-outlet', controller: controller 
		});
*/
	},
	model:function(params,transition){
		var xprtModel=this.store.find('xprtDetail',params.xprt);
		var host=this.store.find('useracc',params.host);

		var xprt = new Ember.RSVP.all([xprtModel,host]);

		var promise = new Ember.RSVP.Promise(function(resolve, reject) {
			xprt.then(function(result){
					params.xprtModel=result[0];
					params.hostModel=result[1];
					resolve(params);
			},function(reason){
				reject(reason);	
			});
  			
		});
		return promise;
	},    
	setupController: function(controller, model, queryParams) {
        controller.empty();
		controller.set('startTimeH',parseInt(model.startTimeH));
		controller.set('startTimeM',parseInt(model.startTimeM));
		controller.set('eventDate',moment(model.startDate,'YYYYMMDD'));
		controller.set('host',model.hostModel);
		controller.set('xprt',model.xprt);
		controller.set('xprtModel',model.xprtModel);
		controller.set('model',this.store.createRecord('event'));	
		this.loadCalendarSetup(model.xprtModel.get('id')).then(function(data){
			controller.set('calendarSetup',data);		
		});
		
        controller.fill();		
	}
});
