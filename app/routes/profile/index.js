import Ember from 'ember';
import ProfileRoute from "xprt/routes/profile";
import App from "xprt/app";
import Foundation from "xprt/utils/foundation";
export default ProfileRoute.extend(Foundation,{
  model: function() {
  	var xprtdetailPr=this.getXprtDetail();
    var userPr=this.store.find('user',0);
    return Ember.RSVP.all([userPr,xprtdetailPr]);
  },
  setupController: function(controller, model) {
  	// force choice profession
    if(model[0].get('profession')==null || model[0].get('profession')===''){
      this.transitionTo('professionselector');
    }
    // force fill profession form
  	if(model[1]===null && model[0].get('profession')===App.profession){
  		this.send('infoAlert',{text: App.locX('/xprt_data/create_alert')});
  		this.transitionTo('profile.xprt');
  	}else{

    }
    controller.set('instance',model[0]);
    controller.set('xprtDetail',model[1]);
    Ember.Logger.debug('profile.index called');
  }
});
