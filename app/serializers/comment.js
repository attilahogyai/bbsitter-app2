import DS from 'ember-data';

export default DS.RESTSerializer.extend({
	// First, restructure the top-level so it's organized by type
	applyTransforms: function(type, data) {
		type.eachTransformedAttribute(function applyTransform(key, type) {
			if (!data.hasOwnProperty(key)) { return; }

			var transform = this.transformFor(type);
			data[key] = transform.deserialize(data[key]);
		}, this);

		return data;
	},
	normalize: function(type, hash, prop) {
		return this._super(type, hash, prop);
	},	
	extractSingle: function (store, primaryType, payload, recordId) {
		var pl=this._super(store, primaryType, payload, recordId);
		return pl;
	},
	serialize: function(record, options) {
		var json = this._super(record, options);
		delete json.reply;
		delete json.toggle;
		return json;
	},
	extractArray: function(store, primaryType, payload) {
		return this._super(store, primaryType, payload);
	}
});