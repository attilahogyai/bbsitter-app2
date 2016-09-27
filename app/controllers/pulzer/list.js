import Ember from 'ember';
import ApplicationController from "xprt/controllers/application";
import App from "xprt/app";
import CommentMixin from "xprt/mixins/comment-controller";
export default Ember.Controller.extend(CommentMixin,{
	app: window.App,
	userid: Ember.computed.alias('app.authManager.session.userid'),
	queryParams:['direction'],
	direction:'next',
	changed:0,
	isMine:function(event){
		var partner=this.getPartner(event);
		return partner.get('id')==this.get('userid');
	},
	getPartner:function(event){
		if(this.get('userid')==event.get('initiator.id')){
			return event.get('host');
		}else{
			return event.get('initiator');
		}
	},
	getPartnerName:function(event){
		var partner=this.getPartner(event);
		return partner.get('name');	
	},
	eventList: Ember.computed('direction','changed', function(){
		var direction=this.get('direction');
		var events=this.store.find('event',{direction:direction});
		App.Loader.listenTo(events);
		return events;
	}),
	actions:{
		openComment:function(event){
			this.send('openCommentPopup',this.getPartner(event));
		}
	}
	
});