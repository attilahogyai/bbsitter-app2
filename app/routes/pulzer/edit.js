import Ember from 'ember';
import AuthenticatedRoute from "xprt/routes/authenticated";
import App from "xprt/app";
export default AuthenticatedRoute.extend({
    renderTemplate: function(controller, model) {
    	this.send('openModal','pulzer/edit',controller);
    },

	setupController: function(controller, model, queryParams) {
        controller.empty();
        var c=this;
		if(model.id){
			var eventObject=this.store.find('event',{id:model.id});

			App.Loader.startLoadProcess(eventObject);
			eventObject.then(function (data){
				if(data.get('length')===1){
					var startDate=data.get('firstObject').get('startDate');
					var endDate=data.get('firstObject').get('endDate');

					if(startDate){
						controller.set('model',data.get('firstObject'));
						c.loadCalendarSetup(null,data.get('firstObject').get('hostId')).then(function(data){
							controller.set('calendarSetup',data);		
						});						
						controller.set('eventDate',startDate);
						controller.set('period',endDate.diff(startDate,'minute'));
						Ember.Logger.info('set period:'+endDate.diff(startDate,'minute'));
						controller.set('startTimeH',startDate.hour());
						controller.set('startTimeM',startDate.minute());
						Ember.Logger.info('set startTimeH:'+startDate.hour());
						// is useles to set from here because these value will be recalculated based on values above
						//controller.set('endTimeH',endDate.hour());
						//controller.set('endTimeM',endDate.minute());
						controller.set('name',data.get('firstObject').get('name'));
						controller.set('desc',data.get('firstObject').get('description'));
					}else{
						throw new Error('event editor error: missign startDate');
					}
				}
			}, function (reason){
				throw new Error('network error');
			});
		}
	}
});
