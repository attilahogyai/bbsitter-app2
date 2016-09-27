import DS from 'ember-data';

import AppSerializer from "xprt/serializers/application";
export default AppSerializer.extend({	
	normalize: function(type, hash, prop) {
		hash.useraccId=hash.useracc;
		return this._super(type, hash, prop);
	},
	pushPayload: function(store, rawPayload) {
		return this._super(store, rawPayload);
	},
	extract: function (store, type, payload, id, requestType) {
		var pl=this._super(store, type, payload, id, requestType);
		return pl;
	},
	/*
	fillUseraccId:function(payload){
		for(var i=0;i<payload.xprtDetail.length;i++){
			payload.xprtDetail[i].useraccId=payload.xprtDetail[i].useracc;
		}
	},
	*/
	extractArray: function(store, type, payload) {
		//this.fillUseraccId(payload);
		var pl=this._super(store, type, payload);
		return pl;
	},
	serialize: function(record, options) {
		var json = this._super(record, options);
		delete json.useraccId;
		return json;
	},
	extractSingle: function (store, primaryType, payload, recordId) {
		if(recordId==0 && payload.xprtDetail.length===1){ // the hack because get queries for id 0
			recordId=undefined;
		}
		//this.fillUseraccId(payload);
		var pl=this._super(store, primaryType, payload, recordId);
		return pl;
	}	
});