import Ember from 'ember';
export default Ember.Route.extend({
	renderTemplate: function() {
		this.render('admin/editor');
	},
	setupController: function(controller, model) {
		var professions=this.store.find('profession');
		controller.set('list', professions);
	}
});
