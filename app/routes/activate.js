import Ember from 'ember';
import App from "xprt/app";
export default Ember.Route.extend({
	setupController: function(controller, model) {
		var activate=App.getData('/activate/'+model.code,true,'GET',true,false,{},null,null);
		activate.then(function(){
			controller.set('activated',true);
		},function(){
			controller.set('activated',false);
		});
	}
});
