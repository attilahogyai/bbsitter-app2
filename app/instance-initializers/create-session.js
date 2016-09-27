import Ember from 'ember';
import App from 'xprt/app';
export function initialize(instance) {
	var store=instance.container.lookup('store:main');
	if(!window.App.authManager.isAuthenticated()){
		store.find('session').then(function(data){
			if(data && data.get('firstObject')){
				window.App.authManager.setup(data.get('firstObject'));	

				//** check force relogin
				var userPr=store.find('user',0);
				userPr.catch(function(result){
					if(result.status=="401" || result.status=="403"){
						App.reload();
					}
				});
				//** check expert 
				if(data.get('firstObject').get('xprtDetailId')!==null){ // if there is xprt id then check it on the server side
					var xprt=store.find('xprtDetail',data.get('firstObject').get('xprtDetailId'));
					xprt.then(function(xprtData){
						if(xprtData.get('length')===0){
							data.get('firstObject').destroyRecord();
							App.reload();
						}
					}).catch(function(error){
						data.get('firstObject').destroyRecord();
						App.reload();
					});

				}
			}
			//window.Xprt.advanceReadiness();
		}).catch(function(error){
			Ember.Logger.error(error);
			//window.Xprt.advanceReadiness();
		}
		); 
	}
}

export default {
  name: 'create-session',
  after: 'ember-data',    	
  initialize: initialize
};
