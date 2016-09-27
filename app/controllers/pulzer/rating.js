import Ember from 'ember';
import ApplicationController from "xprt/controllers/application";
import App from "xprt/app";

export default Ember.Controller.extend({
	queryParams:['direction'],
	direction:'next',

	xprtDetailRatingList:null,	
	xprt:null,
	showNext:Ember.computed('direction',function(){
		return this.get('direction')==='next';
	}),
	actions:{
		openRankPopup:function(xprt){
			window.backLink='current';
			this.set('xprt',xprt);
			this.send('openModal','modal/rankupdate',this);
		},
		rankSaved:function(){
			var c=this;
			Ember.run.later(function(){
				c.send('closeModal');		
				c.send('refreshRoute');
			},500);
		}
	}
});