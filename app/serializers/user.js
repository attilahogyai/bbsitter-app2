import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	// First, restructure the top-level so it's organized by type
  	extractArray: function(store, primaryType, payload) {
  		/*
  		Ember.assert('result or the result size is more than 1', !Ember.isEmpty(payload.result) && payload.result.length===1);
		payload.result[0].user.image=payload.result[0].image==="true";
		var pl={
			user:[payload.result[0].user]
		};
		*/
		payload.user=payload.useracc;
		delete payload.useracc;
		return this._super(store, primaryType, payload);
	},
	extractSingle: function (store, primaryType, payload, recordId) {
		payload.user=payload.useracc;
		delete payload.useracc;
		if(recordId==0 && payload.user.length===1){ // the hack because get queries for id 0
			recordId=undefined; // that way the super methods returns the first record from array
		}
		var pl=this._super(store, primaryType, payload, recordId);
		return pl;
	}
});