import Ember from 'ember';
import ApplicationController from "xprt/controllers/application";
export default ApplicationController.extend({
	instance: null,
	objectList: null,
	modelName:null,
	mode:1, // 1 -list, 2 -insert, 3 -update
	error: null,
	isSaved: false,

	fields: function(){
		var attributes = this.get('instance').get('attributes');
		return attributes;
	}.property('modelName'),

	isEditMode: function(){
		return this.get('mode')===2 || this.get('mode')===3;
	}.property('mode'),
	message: function(){
		if(!this.get('modelName')) { return null; }
		if(this.get('isSaved')){
			return this.get('modelName')+' data was saved.';
		}
		if(this.get('error')){
			return this.get('error');
		}
		switch(this.get('mode')){
			case 1: return 'List of '+this.get('modelName');
			case 2: return 'Create new '+this.get('modelName');
			case 3: return 'Update '+this.get('modelName');
			default: return '?';
		}
	}.property('modelName','mode','error','isSaved'),
	

	initVariable: function(){
		this.set('error',null);
		this.set('isSaved',false);
		this.set('instance',null);
	},
	saveSucces: function(status){
		this.set('error',null);
		this.set('isSaved',true);
		Ember.run.later(this, function() {
			this.initVariable();
			this.set('mode',1);
		},1000);
	},
	saveError: function(status){
		this.set('error','Save failed: '+status.statusText+' ['+status.status+']' );
		this.set('isSaved',false);
	},


	actions: {
		listItems: function (modelName){
			console.log('modelName:'+modelName);
			var objectList=this.store.find(modelName);
			this.set('objectList',objectList);
			this.set('modelName',modelName);
			this.set('mode',1);
			return false;
		},
		loadInstance: function (id){
			var c=this;
			this.store.find(this.get('modelName'),id).then(function(data){
				c.initVariable();
				c.set('instance',data);
				c.set('mode',3);
			});
			return false;
		},
		initNew: function(){
			console.log('modelName:'+this.get('modelName'));
			var modelObject = this.store.createRecord(this.get('modelName'),  { name:'Profession name',description: 'Profession description'  });
			this.initVariable();
			this.set('instance',modelObject);
			this.set('mode',2);
			return false;
		},
		commit: function(){
			var c=this;
			this.get('instance').save().then(
				function (status){
					return c.saveSucces(status);}
				).catch(
				function (status){
					return c.saveError(status);
				}
			);
			return false;
		}
	}
});
