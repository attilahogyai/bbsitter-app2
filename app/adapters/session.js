import DS from 'ember-data';

var SessionAdapter = DS.LSAdapter.extend({
	init: function(){
		this._super();
	},
	name: 'hoa adapter'
});

export default SessionAdapter;
