import Ember from 'ember';
import App from "xprt/app";
export default Ember.View.extend({ 
	resolve:null,
	willDestroyElement:function(){
		this.get('resolve')('ready');
	},
	didInsertElement:function(){
		var c=this;
		var loading = new Ember.RSVP.Promise(function(resolve,reject){
			c.set('resolve',resolve);
		});
		App.Loader.startLoadProcess(loading);
	}
});
