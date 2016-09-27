import Ember from 'ember';

import App from "xprt/app";
var AuthManager = Ember.Object.extend({
token: null,
	scope: null,
	session: null,
	settings: null,
	xprtSetup: null,
	dataCache:Ember.Object.create({}),
	authenticated:Ember.computed.notEmpty('token'),
	admin: function(){
		return this.hasRole('ROLE_ADMIN');
	}.property('scope'),

	getCacheContent:function(name,cb){
		var cc=this.get('dataCache.'+name);
		if(cc===null || cc===undefined){
			cc=cb();
			if(cc===null || cc===undefined){
				throw Error('unable to set cache callback '+cb+' returned empty');
			}
			this.set('dataCache.'+name,cc);
		}
		return cc;
	},


	listeners: {
		signOut:[]
	},

	// location data
	city:null,
	countryCode:'HU',
	findLocaleData_by_geoplugin:function(ip){
		var c=this;
		var servAddr='http://www.geoplugin.net/json.gp?ip='+ip;
		var loginPromisse=Ember.$.ajax({
	    		type: 'GET',
	    		url: servAddr,
	    		cache: false,
	     		data: null,
	    		success:function(data) {
	    			if(data.geoplugin_city!==null && data.geoplugin_city!==''){
	    				c.set('city',data.geoplugin_city);
	    			}
					c.set('countryCode',data.geoplugin_countryCode);
	    		},
	    		error:function(status) {
	    			//Ember.Logger.error('unable to get IP date from geoplugin');
	    			//throw Error('unable to get IP date from geoplugin');
	    			c.freegeoipNet(ip);
	    		} 
	    	});
	},

	freegeoipNet:function(ip){
		var c=this;
		var servAddr='http://freegeoip.net/json/'+ip;
		var loginPromisse=Ember.$.ajax({
	    		type: 'GET',
	    		url: servAddr,
	    		cache: false,
	     		data: null,
	    		success:function(data) {
	    			if(data.city!==null && data.city!==''){
	    				c.set('city',data.city);
	    			}
					c.set('countryCode',data.country_code);
	    		},
	    		error:function(status) {
	    			Ember.Logger.error('unable to get IP date from freegeoipNet');
	    			//throw Error('unable to get IP date from geoplugin');
	    		} 
	    	});		

	},
	findLocaleData_by_ipaddresslabs:function(ip){
		var c=this;
		var servAddr='http://api.ipaddresslabs.com/iplocation/v1.7/locateip?key=demo&ip='+ip+'&format=json';
		var loginPromisse=Ember.$.ajax({
	    		type: 'GET',
	    		url: servAddr,
	    		cache: false,
	     		data: null,
	    		success:function(data) {
	    			if(data.query_status && data.query_status.query_status_code==='OK'){
	    				if(data.geolocation_data.city!==null && data.geolocation_data.city!=='-'){
	    					c.set('city',data.geolocation_data.city);
	    				}
    					c.set('countryCode',data.geolocation_data['country_code_fips10-4']);
	    			}else{
	    				c.findLocaleData_by_geoplugin(ip);
	    			}
	    		},
	    		error:function(status) {
    				c.findLocaleData_by_geoplugin(ip);
	    		} 
	    	});
	},
	findLocaleData:function(ip){
		this.findLocaleData_by_ipaddresslabs(ip);

	},
	setup: function(input){
		/** disable IP finding for now
		var ip=this.getData('/ip',true,'GET',true,false,{},null,null);
		var c=this;
		ip.then(function(data){
			if(data && data.clientIP){
				c.findLocaleData(data.clientIP);
			}
		});
		**/
		if(input){
			this.set('session',input);
			this.set('scope',input.get('scope'));
			this.set('token',input.get('token'));
		}
	},
	hasRole: function(role){
		if(this.get('scope') && this.get('scope').indexOf(role)>-1){
			return true;
		}
		return false;
	},
	isAuthenticated: function(){
		return this.get('token')!==null && this.get('token')!==undefined;
	},
	signOut: function(){
		var cc=this;
		var all=this.get('session.store').find('session');
		all.then(function(data){
			data.forEach(function(session){
				session.destroyRecord().then(
				function(status) {
					cc.set('token',null);
					cc.set('scope',null);
					cc.set('settings',null);
					for(var i; i<cc.get('listeners').signOut.length; i++){
						cc.get('listeners').signOut[i]();
					}
				}).catch(
				function(status) {
					Ember.Logger.error(status);
				});

			},this);
		});
	},
	addListener: function(type,cb){
		if(this.get('listeners')[type]){
			this.get('listeners')[type].push(cb);
		}else{
			console.log('event type['+ type+'] not found!');
		}
	}
});
export default AuthManager;
