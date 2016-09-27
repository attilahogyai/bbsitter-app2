import Ember from 'ember';
import App from "xprt/app";
export default Ember.Component.extend({
	user:null,
	processing:false,
  	done:false,
  	error:false,
  	disabled:Ember.computed('processing','done',function(){
  		return this.get('processing') || this.get('done');
  	}),
	saveButtonText:Ember.computed('done','processing',function(){
    	var done=this.get('done');
    	if(done){
      		return App.locX('/button/saved');
    	}else if(this.get('processing')){
    		return App.locX('/loading/save_processing');
    	}else{
      		return App.locX('/button/save');
  		}
  	}),	
	profession:Ember.computed('user',function(key, value){
		if(arguments.length>1){
			this.set('user.profession',value);
		}else{
			if(this.get('user.profession')===null){
				this.set('user.profession','0');
				return 0;
			}
			return this.get('user.profession');
		}
	}),
	actions:{
		makeSelection:function(){
			this.set('processing',true);
			var c=this;
			this.get('user').save().then(function(){
				c.set('done',true);
				Ember.run.later(this,function(){
					c.sendAction('doneEvent');
				},1000);
				
			}).catch(function(){
				c.set('processing',false);
			});
		}
	}
});
