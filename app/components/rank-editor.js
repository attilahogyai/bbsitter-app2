import DS from 'ember-data';
import Ember from 'ember';
import Rank from 'xprt/models/rank';
import App from 'xprt/app';
import RankType from 'xprt/models/rank-type';
export default Ember.Component.extend({
  xprt:null,
  rankList:null,
  app:window.App,
  session:Ember.computed.alias('app.authManager.session'),

  rankComment:null, 
  rankCommentObserver:function(){
    if(this.get('rankComment')===null) {
      if(this.get('commentObject')!==null){
        this.set('rankComment',this.get('commentObject.comment'));
      }
      return;
    }
  }.observes('commentObject').on('init'),

  commentObject:null,
  saved:false,
  saving:false,
  saveButtonText:Ember.computed('saved',function(){
    var saved=this.get('saved');
    if(saved){
      return App.locX('/button/saved');
    }else{
      return App.locX('/xprt_data/send_review');
    }
  }),
  commentPlaceholder:Ember.computed(function(){
   return App.locX("/xprt_data/review_comment");
  }),
  getEmptyRank:function(type){
    return this.store.createRecord('rank',
      {rank: 0,
      rankType: type,
      xprtDetail: this.get('xprt')}
      );
  },
  newRanks:false,
  ranks:function(){
  	if(this.get('rankList')!==null){
  		return this.get('rankList');
  	}else{
      if(this.get('xprt')===null) {
        return [];
      }
		  var rankPromise = this.store.find('rank',{'xprt':this.get('xprt.id'),'user':this.get('session.userid')});
      var c=this;
      rankPromise.then(function(data){
        if(data.get('length')===0){ // create new
          Ember.RSVP.all([
            c.store.find('rank-type',1),
            c.store.find('rank-type',2),
            c.store.find('rank-type',3)
          ]).then(function(v){
            var list=[c.getEmptyRank(v[0]),
            c.getEmptyRank(v[1]),
            c.getEmptyRank(v[2])
            ];
            c.set('rankList',DS.AdapterPopulatedRecordArray.create({content:list}));
            c.set('newRanks',true);
          });
        }else{ // set existing
          c.set('rankList',data);
          c.set('commentObject',data.get('firstObject').get('comment'));
          c.set('newRanks',false);
        }
      });
		  return [];
  	}
  }.property('xprt','rankList'),
  actions:{
    saveRank:function(){
      var ranks=this.get('ranks');
      if(this.get('saving')){
        return false;
      }
      this.set('saving',true);
      /*
      var savePromises=[];
      
      for(var i=0;i<ranks.get('length');i++){
        savePromises[i]=ranks[i].save();
      }
      */
      var c=this;

      var saveRankF=function(co){
        if(co!==undefined){
          var r=ranks.get('content').map(function(rank){
            rank=rank.set('comment',co);
            return rank;
          });
        }
        ranks.save().then(function(v){
          c.set('saved',true);
          c.sendAction('savedEvent');
        }).catch(function(v){
          alert('Something wrong happend :(, please try again!');
          c.set('saving',false);
          throw v;
        });
      };
      var commentObject=this.get('commentObject');
      if(commentObject===null){
        commentObject=this.store.createRecord('comment',
        {xprtDetail: this.get('xprt'),
        source:1});
        this.set('commentObject',commentObject);
      }
      commentObject.set('comment',this.get('rankComment'));

      if(commentObject!==null && commentObject.get('comment')!==''){
        this.get('commentObject').save().then(saveRankF);
      }else{
        saveRankF();
      }
    }
  },
  didInsertElement:function(){
    this.set('saved',false);
    this.set('saving',false);
  }
});