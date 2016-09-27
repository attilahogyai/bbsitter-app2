import ApplicationController from "xprt/controllers/application";
import App from "xprt/app";
import Ember from "ember";
import PulzerIndex from "xprt/controllers/pulzer/index";

export default PulzerIndex.extend({
	coverDays:7,
	dayRoute:false,
	weekRoute:true,
	weekList:Ember.computed('actDate','changed',function(){
        if(this.get('actDate')){
            var events=this.store.find('event',{week:this.get('actDate').format('YYYYMMDD')});
			App.Loader.listenTo(events);
			return events;
        }else{
            return null;
        }
	}),
});