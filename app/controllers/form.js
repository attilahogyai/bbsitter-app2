import Ember from 'ember';
import App from "xprt/app";
import BaseController from "xprt/controllers/base";
export default BaseController.extend({
  instance:null,
  detailInstance:null,
  newItemDetail:null,
  newItemDetailName:null,
  message: null,
  detailMessage:null,
  isError: false,
  isDetailError: false,
  isDetailSuccess: false,
  isSuccess: false,
  addNewItem: false,
  processCount:0,
  popup:false,
  firstSaved:false,
  isProcessing:Ember.computed('processCount',function(){
    return this.get('processCount')>0;
  }),
  createNewDetailModel:function(){
    if(this.get('newItemDetailName')===null){
      return;
    }
    if(this.get('addNewItem')){
      this.createNewDetailItem();     
    }else{
      this.set('newItemDetail',null); 
    }
  }.observes('addNewItem').on('init'),
  updateMessage:function(status){
    return App.locX("/form/base_success_message");
  },
  saveSuccess: function(status){
    this.decrementProperty('processCount',1);
    var func=this.get('updateMessage');
    var message=func.apply(this,[status]);
    this.set('message',message);
    this.set('isError',false);
    this.set('isSuccess',true);
    if(this.get('popup')){
      this.send('infoAlert',{text: message});
    }

    var c=this;

    Ember.run.later(this, function() {
      c.initVariable();
    },2500);      
  },
  saveError: function(status){
    this.decrementProperty('processCount',1);
    Ember.Logger.error(status.stack);
    this.set('isError',true);
    var message=App.locX("/form/save_error_",[status.statusText,status.status]);
    this.set('message',message);
    if(this.get('popup')){
            this.send('errorAlert',{text: message});
    }

  },
  detailSaveSuccess: function(status){
    this.decrementProperty('processCount',1);
    this.set('isDetailError',false);
    var message=App.locX("/form/base_success_message");
    this.set('detailMessage',message);
    this.set('isDetailSuccess',true);
    if(this.get('popup')){
            this.send('infoAlert',{text: message});
    }

    var c=this;
    Ember.run.later(this, function() {
      c.initVariable();
    },2500);      
  },
  detailSaveError: function(status){
    this.decrementProperty('processCount',1);
    Ember.Logger.error(status.stack);
    this.set('isDetailError',true);
    var message=App.locX("/form/save_error_",[status.statusText,status.status]);
    this.set('detailMessage',message);
    if(this.get('popup')){
            this.send('errorAlert',{text: message});
    }
  },

  initVariable: function(){
    this.set('isError',false);
    this.set('isSuccess',false);
    this.set('isDetailError',false);
    this.set('isDetailSuccess',false);
    this.set('detailMessage',null);
  },
  startProcessing:function(){
    this.incrementProperty('processCount',1);
  },

  checkRequired:function(name,requiredFields){
    // find label for input type
    var label=Ember.$('#i-'+name);
    if(label.get(0).tagName!=='LABEL'){
      label=Ember.$('label',label); 
    }
    Ember.assert('#i-'+name+' not found in DOM',!Ember.isEmpty(label));
    return label;
  },
  validate:function(){
    if(this.get('requiredFields')===null || this.get('requiredFields')===undefined) {
      return true;
    }
    var requiredFields=this.get('requiredFields');
    var firstError=null;

    var c=this;

    var validateFunc=function(name,meta){ 
      Ember.Logger.info('check :'+name);
      if(requiredFields.indexOf(name)===-1){  // if field not in the requred filds list return
        return;
      }
      var label=c.checkRequired(name,requiredFields);
      var value=model.get(name);
      if(meta.type==='number'){
        if(isNaN(value)){
          label.addClass('error');
          if(firstError===null) { 
            firstError=label;
          }
          return;
        }
        var zeroAllowed=meta.options.zeroAllowed || false;
        var min=zeroAllowed?-1:0;
        var positive=meta.options.positive || false;

        if(positive && value<=min){
          label.addClass('error');
          if(firstError===null) { 
            firstError=label;
          }
          return; 
        }
      }else if(Ember.isEmpty(value) || (value['content']!==undefined && value['content']===null)) {
        label.addClass('error');
        if(firstError===null) { 
          firstError=label;
        }
        return;
      }

      label.removeClass('error');
      Ember.Logger.info('removeClass error:'+name+' label:'+label.attr('id'));
    };

    var model=this.get('instance');
    
    this.get('instance').eachRelationship(validateFunc);
    this.get('instance').eachAttribute(validateFunc);
    
    if(!firstError){
      this.get('instance').eachRelationship(function(name,meta){ 
        if(requiredFields.indexOf(name)===-1){  // if field not in the requred filds list return
          return;
        }
        var label=c.checkRequired(name,requiredFields);
        var value=model.get(name);
        if(Ember.isEmpty(value) || (value['content']!==undefined && value['content']===null)) {
          label.addClass('error');
          if(firstError===null) { 
            firstError=label;
          }
          return;
        }
        label.removeClass('error');
      });
    }

    if(firstError){
      this.send('infoAlert',{text: App.locX("/common/fillall")},function(alertWindow){
          alertWindow.foundation('reveal', 'close');
          firstError.velocity("scroll", { duration: 1000, easing: "spring", offset:-70 }).velocity({ opacity: 1 });
      });
      return false;
    }
    return true;
  },
  actions:{
    doUpdate:function(){
      if(this.get('isProcessing')){
        return false;
      }
      var model=this.get('instance');
      if(model){
        if(!this.validate()){
          return;
        }
        var cc=this;
        this.startProcessing();
        var firstSave=model.get('id')===null;
        model.save().then(
          function (status){
            cc.set("firstSaved",firstSave);
            return cc.saveSuccess(status);}
          ).catch(
          function (status){
            cc.set("firstSaved",false);
            return cc.saveError(status);
          }
        );
      }else{
        Ember.Logger.error('something went wrong');
        this.saveError({status:'internal_error'});
      }
    },
    doUpdateDetail:function(){
      if(this.get('isProcessing')){
        return false;
      }
      var cc=this;
      if(!Ember.isEmpty(this.get('newItemDetail'))){
        this.startProcessing();
        this.get('newItemDetail').save().then(
          function (status){
            //cc.get('detailInstance').addObject(cc.get('newItemDetail'));
            //cc.get('detailInstance').reload();
            cc.set('newItemDetail',null);
            cc.set('addNewItem',false);
            cc.send('refresh');
            return cc.detailSaveSuccess(status);}
          ).catch(
          function (status){
            return cc.detailSaveError(status);
          }
        );
      }
      if(this.get('detailInstance')){
        this.get('detailInstance').forEach(function(item){
          if(item.get('isDirty')){
            this.startProcessing();
            item.save().then(
            function (status){
              return cc.detailSaveSuccess(status);}
            ).catch(
            function (status){
              return cc.detailSaveError(status);
            });
          }
        },this);
      }
    },
    onDeleteDetail:function(item){
      var c=this;

      var fyes=function(){
        var id=item.get('id');
                item.destroyRecord().then(
                    function(status) {
                        var obj=c.get('detailInstance').findBy('id',id);
                        c.get('detailInstance').removeObject(obj);
                        
                    }).catch(
                    function(status) {
                        c.send('errorAlert',{text: App.locX("/delete/error")});
                        item.rollback();
                    });
            };
      c.send('confirmAlert',{text: App.locX("/profile/del_activity"),yes:fyes});
    }
  }
});