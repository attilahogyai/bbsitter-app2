import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	// First, restructure the top-level so it's organized by type
	normalize: function(type, hash, prop) {
		hash.hostId=hash.host;
		hash.initiatorId=hash.initiator;
		return this._super(type, hash, prop);
	},	
	extractSingle: function (store, primaryType, payload, recordId) {
		if(recordId==0 && payload.event.length===1){ // the hack because get queries for id 0
			recordId=undefined;
		}
		//this.fillUseraccId(payload);
		var pl=this._super(store, primaryType, payload, recordId);
		return pl;
	},
	serialize: function(record, options) {
		var json = this._super(record, options);
		delete json.initiatorId;
		delete json.hostId;
		return json;
	},
});