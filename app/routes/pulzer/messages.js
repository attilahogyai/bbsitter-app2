import Ember from 'ember';
import AuthenticatedRoute from "xprt/routes/authenticated";
export default AuthenticatedRoute.extend({
	queryParams: {
    folder: {
      refreshModel: true
    }
  },
  app:window.App,
  session: Ember.computed.alias('app.authManager.session'),
  model: function(params) {
   	if(params.folder===null){
   		params.folder='in';
   	}
    var c=this;
		return this.store.filter('comment',{folder:params.folder},function(comment){
      if(Ember.isEmpty(comment.get('addressee')) || Ember.isEmpty(comment.get('useracc')) || comment.get('source')=='1'){
        return false;
      }
      if(params.folder==='in'){
        return comment.get('addressee').get('id')==c.get('session.userid');
      }else{
        return comment.get('useracc').get('id')==c.get('session.userid');
      }
    });
  },
	setupController: function(controller, model, transition) {
    var messageArray = Ember.ArrayController.create({
      model: model.toArray(),
      sortProperties: ['id'],
      sortAscending: false
    });
		controller.set('messagesList',messageArray);
	}
});
