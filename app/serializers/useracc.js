import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	extractSingle: function (store, primaryType, payload, recordId) {
		if(recordId==0 && payload.useracc.length===1){ // the hack because get queries for id 0
			recordId=undefined; // that way the super methods returns the first record from array
		}
		var pl=this._super(store, primaryType, payload, recordId);
		return pl;
	}
});