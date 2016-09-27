import DS from 'ember-data';
import Ember from 'ember';
var TimeTransform = DS.Transform.extend({
	deserialize: function(serialized) {
		return serialized;
	},
	serialize: function(deserialized) {
		return deserialized;
	}
});
var DatetimeTransform = DS.Transform.extend({
	deserialize: function(serialized) {
		if(Ember.isEmpty(serialized)) {
			return;
		}
		Ember.assert("Value type is not string", !!serialized.indexOf);
		return moment(serialized,'YYYY-MM-DDTHH:mm:ss.SSSZZ');
	},
	serialize: function(deserialized) {
		if(Ember.isEmpty(deserialized)) {
			return;
		}
		Ember.assert("Value type is not moment", !!deserialized.format);
		return deserialized.format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
	}
});
var RawTransform = DS.Transform.extend({
	deserialize: function(serialized) {
		return serialized;
	},
	serialize: function(deserialized) {
		return deserialized;
	}
});



export function initialize(container, application ) {
	application.inject('component:address-setter','store','store:main');
	application.inject('component:rank-editor','store','store:main');
	container.register('transform:time', TimeTransform);
	container.register('transform:datetime', DatetimeTransform);
	container.register('transform:raw', RawTransform);	
}

export default {
	after: 'store',    	
	name: 'inject-store',
	initialize: initialize
};
