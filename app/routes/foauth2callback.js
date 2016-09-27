import Ember from 'ember';
import BaseRoute from "xprt/routes/base";
import App from "xprt/app";
export default BaseRoute.extend({
    renderTemplate: function(controller, model) {
    	this.send('openModal','foauth2callback',controller);
    },
	setupController: function(controller, model, queryParams) {
		controller.set('model',model);
	},
	leaveOauth: function(){
    	this.send('closeModal');	
  	}.on('deactivate')
});
