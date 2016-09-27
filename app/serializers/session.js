import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	// First, restructure the top-level so it's organized by type
  	extractArray: function(store, primaryType, payload) {
  		var pl={
  			session:payload.map(function(data){return data;}),
  		};
		return this._super(store, primaryType, pl);
	},
});