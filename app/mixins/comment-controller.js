/**
Mixin used to handle create comment
**/
import Ember from 'ember';
import App from "xprt/app";
export default Ember.Mixin.create({
  newMessage:null,

  saved:false,
  saving:false,
  parentMessage:null,
  addressee:null,
  app:window.App,
  saveButtonText:function(){
    var saved=this.get('saved');
    if(saved){
      return App.locX('/button/message_sent');
    }else{
      return App.locX('/button/send_message');
    }
  }.property('saved','saving'),
  buttonStatus:function(){
    return this.get('saved');
  }.property('saved'),


  actions:{
    openCommentPopup:function(addressee,parentMessage){
      if(this.get('app.authManager.authenticated')){
        this.set('parentMessage',parentMessage);
        this.set('addressee',addressee);
        window.backLink='current';
        this.set('saving',false);
        this.set('saved',false);
        this.set('newMessage','');      
        this.send('openModal','modal/comment',this);
      }else{
        this.send('infoAlert',{text: App.locX("/message/registration_required")});  
      }
    },
    saveMessage:function(){
      if(this.get('newMessage')!==null && this.get('newMessage')!==''){
        if(this.get('saving')){
          return false;
        }
        this.set('saving',true);
        var c=this;  
        var messageObject=this.store.createRecord('comment',
          {addressee: this.get('addressee'),
          source:2,
          original:this.get('parentMessage'),
          comment:this.get('newMessage')});
        
        messageObject.save().then(function(v){
          c.set('saved',true);
          Ember.run.later(function(){
              c.send('closeModal');
          },2000);
        }).catch(function(e){
            alert('Something went wrong :(');
        });
      }
    }
  } 
});
