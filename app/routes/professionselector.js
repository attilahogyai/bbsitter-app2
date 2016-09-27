import Ember from 'ember';
import AuthenticatedRoute from "xprt/routes/authenticated";
import App from "xprt/app";
export default AuthenticatedRoute.extend({
	model:function(){
		return this.store.find('user',0);
	},
    renderTemplate: function(controller, model) {
    	this.send('openModal','professionselector',controller);
    },
    actions:{
    	professionSelected:function(){
    		this.send('closeModal');
    		this.transitionTo('profile');
    	}
    }    
});
