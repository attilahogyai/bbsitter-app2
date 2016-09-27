import DayRoute from "xprt/routes/pulzer/day";
export default DayRoute.extend({
    setupController: function(controller, model) {
    	controller.set('calendarSetup',model.calendarSetup);
    	controller.incrementProperty('changed');
        var m = moment(model.actDate,'YYYYMMDD');
        var pulzerIndexController=this.controllerFor("pulzer");
        pulzerIndexController.set('actDate',m);
        if(controller.get('actDate')===null){
	        controller.set('actDate', m);
        }
    }

});
