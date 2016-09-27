import Ember from 'ember';
export default Ember.Route.extend({
  model:function(params, transition){
    return this.store.find('useracc',params.userId);
  },
  setupController: function(controller, model) {
    controller.set('user',model);
  }
});
