import DS from 'ember-data';

export default DS.RESTSerializer.extend({
		// First, restructure the top-level so it's organized by type
		extractSingle: function(store, type, payload, id, requestType) {
			return this._super(store, type, payload, id, requestType);
		}
});