import Ember from 'ember';
import ApplicationController from "xprt/controllers/application";
import App from "xprt/app";
export default Ember.Controller.extend({
  //cityText: Ember.computed.alias('app.authManager.city'),
  cityText: null,
  cityId:'-1',

  citySearchResult:null,
  offerList:null,
  app:window.App,
  howto:false,

  
  offerListObserver:function(){
    if(this.get('offerList')!==null){
        Ember.run.later(this, function(){App.equalize("#offers", "div.id-panel-lens",false);} ,200);
      }
  }.observes('offerList').on('init'),
  actions:{
    doSearch: function(cityData){
      if(Ember.isEmpty(cityData)){
        cityData={label:this.get('cityText')};
      }
      var cityId=this.get('cityId');
      if(!Ember.isEmpty(cityData.value)){
        cityId=cityData.value.id;
      }
      this.transitionToRoute('search',cityId,cityData.label);
    },
    cityTextChanged: function(text){
      var result=this.store.find('city',{begin:text,country:'HU'});
      this.set('citySearchResult',result);
    },
    openHowTo:function(){
      this.set('howto',!this.get('howto'));
    }
  }
});
