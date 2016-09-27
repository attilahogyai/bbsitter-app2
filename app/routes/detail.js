/**
* A szakértő részletes adatait láthatja ezen az oldalon. 
* A naptárjában látszanak a szakértő host bejegyzései és a látogató initiator bejegyzései.
* Azok a bejegyzések ahol a látogató initiator ott láthatja az esemény adatait, egyébként szűrke szinnel és részletek nélkül látszik
**/
import Ember from 'ember';
import App from 'xprt/app';
import BaseRoute from "xprt/routes/base";
import EventListRouteMixin from "xprt/mixins/event-edit-route-actions";
export default BaseRoute.extend(EventListRouteMixin,{
  queryParams: {
    userId: {
      refreshModel: true
    }
  },  
  model:function(params, transition){
    var c=this;
    var commentPromise = this.store.filter('comment',{'xprt':params.xprtId},function(comment){
        return comment.get('comment')!==null && comment.get('comment').trim()!=='' && comment.get('xprtDetail.id')==params.xprtId;
      });

    var rankPromise = this.store.find('rank',{'xprt':params.xprtId});
    var promise=new Ember.RSVP.Promise(function(resolve,reject){
        var xprtDetailPromise=null;
        if(params.xprtId==0){
          xprtDetailPromise = c.store.find('xprtDetail',{'useraccId':params.userId});      
        }else{
          xprtDetailPromise = c.store.find('xprtDetail',{'id':params.xprtId});      
        }
        xprtDetailPromise.then(function(){
          if(xprtDetailPromise.get('length')===0){
            if(params.userId===undefined){
              reject('xprt not found');
            }else{
              c.transitionTo('user',params.userId);
            }
            return;
          }
          var xprtDetail=xprtDetailPromise.get('firstObject');
          var userId=xprtDetail.get('useracc').get('id');

          // load calendar setup
          
          var calendarSetupP=c.loadCalendarSetup(xprtDetail.get('id'));
          
          calendarSetupP.then(function(data){
            resolve([xprtDetail,data]);
          }).catch(reject);
  
        }).catch(reject);

    });
    var p=Ember.RSVP.all([promise,commentPromise,rankPromise]);
    return p;
  },

  setupController: function(controller, model) {
    Ember.Logger.debug('***** model ready');
    controller.set('commentList',model[1]);
    controller.set('rankList',model[2]);
    var oldx=controller.get('xprt');
    if(model[0].get('length')===1){
      controller.set('xprt',model[0][0]);
    }else if(model[0].get('length')===2){
      controller.set('xprt',model[0][0]);
      controller.set('calendarSetup',model[0][1]);
    }else{
      throw new Error('something went wrong there is no result for model: '+window.location.href);
    }
    if(oldx!==controller.get('xprt')){
      controller.incrementProperty('changed');
    }
  }
});
