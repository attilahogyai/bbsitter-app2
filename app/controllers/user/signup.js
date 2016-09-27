import Ember from 'ember';
import ApplicationController from "xprt/controllers/application";
import App from "xprt/app";

export default ApplicationController.extend({

	name:null,
	email:null,
	password:null,
	contract: false,
	message: null,
	profession:'0',
	isRegError: false,
	saving:false,
	saved:false,
	isRegSuccess: false,
	passwordAgainPlaceholder: App.locX('/general/password_again'),
  	saveButtonText:function(){
    	var saving=this.get('saving');
    	if(saving){
      		return App.locX('/button/pending');
    	}else{
      	return App.locX('/button/signup');
    }
  	}.property('saved','saving'),	
	saveSucces: function(status){
		this.set('message',App.locX("/signup/registration_ready"));
		this.set('isRegSuccess',true);
		this.set('isRegError',false);
	},
	regError: function(status){
		if(status.responseJSON!==undefined){
			if(status.responseJSON.error){
				this.set('message',App.locX(status.responseJSON.error.code));	
			}else{
				this.set('message',App.locX(status.responseJSON));	
			}
		}else{
			this.set('message',App.locX("/signup/error_",[status.statusText,status.status]));
		}
		this.set('isRegError',true);
	},
	actions:{
		doSignUp: function(){
			if(this.get('saving')){
				return false;
			}
			var userObject = this.store.createRecord('user',  { name:this.name,
				email:this.email,
				password:this.password,
				profession:this.profession
				 });
			var c = this;
      		this.set('saving',true);
			userObject.save().then(
					function (status){
						c.set('saved',true);	
						return c.saveSucces(status);}
					).catch(
					function (status){
						c.set('saved',false);	
						c.set('saving',false);
						return c.regError(status);
					}
				);
			return false;
		},
		readContract: function(){
			this.send('closeModal');
			this.transitionToRoute('terms');
		}
	}
});

