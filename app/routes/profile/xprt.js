import Ember from 'ember';
import AuthenticatedRoute from "xprt/routes/authenticated";
import App from "xprt/app";
export default AuthenticatedRoute.extend({
  model: function() {
    var r=this;
    var xprt = this.getXprtDetail();
    var profession=this.store.find('profession',79); // BB sitter
    var languages=this.store.find('language');
    var study=this.store.find('study');
    var serviceLocationType=this.store.find('serviceLocationType',3);
    var storeV=this.store;
    var country=window.App.authManager.getCacheContent('countryList',function(){
      return storeV.find('country');
    });

    var currency=this.store.find('currency');
    var userPr=this.store.find('user',0);

    var promise=Ember.RSVP.all([xprt,profession,languages,study,serviceLocationType,country,currency,userPr]);
    
    App.Loader.startLoadProcess(promise);
    return promise;
  },
    setupController: function(controller, model) {
      if(Ember.isEmpty(model[0])){ // create new record and set default values
        var xprt={};
        xprt.status=1;
        
        var country=model[5].filter(function(data){
          return data.get('id')==='HU';
        });
        if(country.length===1){
          xprt.country=country[0];
        }
        
        var languageHU=model[2].filter(function(data){
          return data.get('code')===country[0].get('id');
        });        
        if(languageHU.length===1){
          xprt.languages=[languageHU[0]];
        }
        
        
        var huf=model[6].filter(function(data){
          return data.get('code')==='HUF';
        });
        if(huf.length===1){
          xprt.currency=huf[0];
        }

        if(model[7]!==null){
          xprt.phone=model[7].get('phone');
        }
        
        var education=model[3].filter(function(data){
          return data.get('id')==1;
        });        
        if(education.length===1){
          xprt.educationLevel=education[0];  
        }

        xprt.intProp1=1;
        model[0]=this.store.createRecord('xprtDetail',xprt);
        
      }
      model[0].set('profession',model[1]);
      model[0].set('serviceLocationType',model[4]);
      controller.set('instance',model[0]);
      controller.set('newItemDetailName','xprtProfession');
      controller.set('professionList',model[1]);
      controller.set('languageList',model[2]);
      controller.set('educationLevelList',model[3]);
      controller.set('serviceLocationTypeList',model[4]);
      controller.set('countryList',model[5]);
      controller.set('currencyList',model[6]);
      controller.set('user',model[7]);
  },
  actions:{
    closePopup:function(transitionTo){
      this.transitionTo(transitionTo);
    }
  }
});
