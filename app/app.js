import Ember from 'ember';
import DS from 'ember-data';
import Resolver from 'ember/resolver';
import loadInitializers from 'ember/load-initializers';
import config from './config/environment';

import AuthManager from 'xprt/utils/authmanager';
import B64 from 'xprt/utils/base64';
import MomentSetup from 'xprt/utils/moment-customs';

if(window.App){
	throw Error('import App called!');
}

Ember.MODEL_FACTORY_INJECTIONS = true;

var authManager = new AuthManager();
var Base64=B64;

var momentSetup=new MomentSetup();	
momentSetup.setup();

var App = Ember.Application.extend({

	modulePrefix: config.modulePrefix,
	podModulePrefix: config.podModulePrefix,
	Resolver: Resolver,
	

	authManager : authManager,
	momentSetup : momentSetup,
	moment: moment()	
});
window.App=App;
App.authManager = authManager;

App.momentSetup = momentSetup;

App.Base64=B64;
App.lastLang=null;

App.moment=moment();

App.profession=79;

App.getData = function(url,async,type,processdata,cache,data,success,error){
	url = '/api/' + url;
		Ember.$.ajaxSetup({async:async});
		return Ember.$.ajax({
				type: type,
		data: data,
				url: url,
				headers: {
					"Authorization": "Bearer "+window.App.authManager.token
					},
		processdata: processdata,
				cache: cache,
				success:success,
				error: error
		});
	};
App.lastLang='hu';
App.lastLangF='hu_HU';	
if(window.location.href.indexOf('bbsitter.hu')>-1){
//	App.lastLang='en';
//	App.lastLangF='en_EN';	
}

App.getLang=function(){
	var lang=App.lastLang;
	if(lang===null){
		lang = navigator.language || navigator.userLanguage;  
		if(!Ember.isEmpty(lang)){
			var l=lang.split('-');
			moment.lang(l[0]);
			App.moment.lang(l[0]);
			lang=l[0];
		}
	}
	App.lastLang=lang;
	return lang;
};
App.getLang();

App.locX=function(key, params){
	return Ember.String.loc(key+"/"+App.getLang(), params);
};
App.locDatePattern=function(key, params){
	return Ember.String.loc(key+"/"+App.getLang(), params);
};

App.TranslateableAttributes=Ember.Mixin.create({
	didInsertElement: function() {
		var result = this._super.apply(this, arguments);
		var translateArray=this.get('translate') || [];
		for(var i=0;i<translateArray.length;i++){
			var v=this.get(translateArray[i]);
			if(v){
				this.$().attr(translateArray[i], App.locX(v));
			}
		}
	}
});

App.extractError=function(status){
	if(status.responseJSON && status.responseJSON.indexOf('/')>-1){
    	return App.locX(status.responseJSON);
    }else if(status.statusText){
    	return status.statusText;
    }else{
    	return App.locX("/event/save_error_"+status.status);
    }
};

App.enLangData = moment.langData('en');
App.locHour=function(hour,minute){
	var currentLangData = moment.langData();
	App.moment.hour(hour).minute(minute);
	if(currentLangData.getSHourFormat){
		return currentLangData.getSHourFormat(App.moment);
	}else{
		return App.enLangData.getSHourFormat(App.moment);
	}
};



DS.Model.reopen({
	getF: function(name,type){
		if(this.get('format') && this.get('format')[name]){
			var methodName=Ember.String.camelize('format_'+type);
			if(this[methodName]){
				return this[methodName](this.get(name),this.get('format')[name]);
			}
		}
		return this.get(name);
	},
	setF: function(name,value,type){
		if(this.get('format') && this.get('format')[name]){
			var methodName=Ember.String.camelize('parse_'+type);
			if(this[methodName]){
				value=this[methodName](value,this.get('format')[name]);
			}
		}
		this.set( name,value);
	},
	formatDatetime: function(value, formatString){
		if(!value) { return; }
		Ember.assert("Value type is not moment", value.format);
		return value.format(formatString);
	},
	parseDatetime: function(value, formatString){
		if(!value) { return; }
		Ember.assert("Value type is not string", value.indexOf);
		return moment(value,formatString);
	},
});

Ember.Controller.reopen({
	setupOnRevealCloseHistoryBack:function(){
		var c=this;
		var setupRoute=window.Ember.currRouteName;
		Ember.$(document).one('closed.fndtn.reveal', '[data-reveal]', function () {
			if(setupRoute===window.Ember.currRouteName){
				c.transitionToRoute(window.Ember.prevRouteName);
			}else{
				Ember.Logger.info('skip reveal close, was set for :'+setupRoute);
			}
		});
	},
	setupOnRevealCloseReopenCurrent:function(){

		var prevView=null;
		Ember.$(document).one('close.fndtn.reveal', '[data-reveal]', function () {
   			if(prevView===null){ // create new listener for open the old opened one
   				//window.Ember.lastSubrouteRevealView.foundation('reveal', 'open');    			
   				prevView=Ember.$('#'+window.Ember.lastSubrouteRevealViewId);
   				prevView.foundation('reveal', 'open');
   			}
   		});

	}
});


App.reload=function(){
	Ember.run.schedule('afterRender',function(){
		window.localStorage.clear();
        var n = window.location.href.indexOf("#");
    	window.location.href=window.location.href.substring(0,n);
	});
};



Ember.RSVP.configure('onerror', function(error) {
	if (error instanceof Error) {
		Ember.Logger.assert(false, error);
		Ember.Logger.error(error.stack);
	}
});

// ember customization
Ember.TextField.reopen({
	translate:['placeholder'],
	attributeBindings: ['required']
});
Ember.TextField.reopen(App.TranslateableAttributes);



Ember.Checkbox.reopen({
	attributeBindings: ['required']
});


Ember.onerror = function(error) {
	if(error.status){
		Ember.Logger.error(error.status+":"+error.statusText);	
	}else{
		Ember.Logger.error(error+" : "+error.stack);
		Ember.$.ajax({
			type: 'POST',
			url: '/api/error-notification',
			data: {
				stack: error+" : "+error.stack,
				otherInformation: error.message
			}
		});
	}
};

// UTIL functions
App.convertToFormData=function (id,data){
	var text='', keys = Object.keys(data), i = keys.length;
	while (i--) {
		var key = keys[i];
		text+='--'+id+'\r\n';
		text+='Content-Disposition: form-data; name=\"'+key+'\"\r\n\r\n';
		text+=data[key]+'\r\n';
	}
	text+='--'+id+'--';
	return text;
}; 

App.equalize=function(id,child,recycle){
	var divs=Ember.$(id);
	if(divs.length===0 && recycle){
		Ember.run.later(this, function(){App.equalize(id,child,recycle);} ,200);
	}else{
		var c=child || 'div';
		Ember.$(id).equalize({equalize:"outerHeight",children:c});
	}
};



App.queryUrl = function(url,type,success,error,async,data,processdata,cache){
	type = type || 'GET';
	async = async || 'true';
	processdata = processdata || 'false';
	Ember.$.ajaxSetup({async:async});
	return Ember.$.ajax({
		type: type,
		data: data,
		url: url,
		processdata: processdata,
		cache: cache,
		success:success,
		error: error
	});
};
loadInitializers(App, config.modulePrefix);



export default App;

/** find object helper
var find = function(name,inO){
  var props=Object.keys(inO);
  for(var i=0;i<props.length;i++){
    if(props[i].indexOf(name)===-1 && inO[props[i]] instanceof Object){
      console.log('>'+props[i]);
      find(name,inO[props[i]]);
      console.log('<'+props[i]);
    }else if(props[i].indexOf(name)>-1) {
      console.log('-->'+props[i]);
    }
  }
}
var a={};
a.p1=1;
a.p2=3;

find('document',window);

**/
