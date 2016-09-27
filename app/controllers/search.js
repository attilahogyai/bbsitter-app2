import Ember from 'ember';
import IndexController from "xprt/controllers/index";
import App from "xprt/app";
export default IndexController.extend({
  //cityText: Ember.computed.alias('app.authManager.city'),
  app:window.App,
  searchResult:null,
  resultCountText:Ember.computed('searchResult',function(){
    if(this.get('searchResult')!==null){
        Ember.run.later(this, function(){App.equalize("#searchResults", "div.id-panel-lens",false);} ,200);
      return App.locX('/landing/result_count',this.get('searchResult').get('length'));
    }else{
      return '';
    }
  })
});
