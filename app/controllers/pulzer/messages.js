import Ember from 'ember';
import ApplicationController from "xprt/controllers/application";
import App from "xprt/app";
import CommentMixin from "xprt/mixins/comment-controller";
export default Ember.Controller.extend(CommentMixin,{
	queryParams:['folder'],
	folder:'in',

  toggle:false,

	messagesList:null,	
	xprt:null,
  isOutbox:function(){
    return this.get('folder')==='out';
  }.property('folder'),
  actions:{
    switchToggle:function(message){
      message.set('toggle',!message.get('toggle'));
    }
  }
});