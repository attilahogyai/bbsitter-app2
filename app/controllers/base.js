import Ember from 'ember';
export default Ember.Controller.extend({
  app:window.App,
  xprtDetailId: Ember.computed.alias('app.authManager.session.xprtDetailId'),
  isXprt:Ember.computed('xprtDetailId',function(){
  	return this.get('xprtDetailId')!==null && this.get('xprtDetailId')!==undefined;
  })
});
