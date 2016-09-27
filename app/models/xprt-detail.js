import Ember from 'ember';
import DS from 'ember-data';

import App from "xprt/app";
var XprtDetailModel=DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  phone: DS.attr('string'),
  birthYear: DS.attr('number',{positive:true}),
  sex: DS.attr('number'),

  country: DS.belongsTo('country'),
  targetLocations: DS.hasMany('city'),

  educationLevel: DS.belongsTo('study',{ async: true }),
  education: DS.attr('string'),

  languages: DS.hasMany('language',{async: true}),

  intProp1: DS.attr('number',{positive:true}), // bbsitter max vállalt gyerekek
  experience: DS.attr('number',{positive:true,zeroAllowed:true}),

  unitPrice: DS.attr('number',{positive:true}),
  currency: DS.belongsTo('currency',{ async: true }),

  description: DS.attr('string'),
  
  useraccId:  DS.attr('number'),
  useracc:  DS.belongsTo('useracc',{ async: true }),
  minHour: DS.attr('number'),
  maxHour: DS.attr('number'),

  profession: DS.belongsTo('profession',{async: true}),

  serviceLocationType: DS.belongsTo('serviceLocationType'),
  location: DS.belongsTo('city'),
  locationStr: DS.attr('string'), 
  zip: DS.attr('string'),
  address: DS.attr('string'),

  driveLicense: DS.attr('number',{positive:true}),
  ownCar: DS.attr('number',{positive:true}),

  checkedIds: DS.hasMany('certificate',{async: true}),

  rank: DS.attr('number'),
  top: DS.attr('number'),
  status: DS.attr('number'),
  modifyDt:DS.attr('datetime'),

  experienceS: Ember.computed("experience", function(){
    var e=this.get('experience');
    if(e!=null){
      return App.locX('/index/experience',e);
    }else{
      return '&nbsp;';
    }
  }),
  version: Ember.computed("modifyDt", function(){
    if(this.get('modifyDt')!==null){
      return this.get('modifyDt').format('YYMDHms');
    }
    return 1;
  }),
  isActive: Ember.computed("status",{
    get:function(){
      if(this.get('status')===1){
        return true;
      }else{
        return false;
      }
    },
    set:function(key,value){
      if(value){
        this.set('status',1);
      }else{
        this.set('status',0);
      }      
      return value;
    }

  }),
  targetLocation:Ember.computed('targetLocations',function(){
    return "<i class='fa fa-map-marker'></i> "+this.get('targetLocations').get('firstObject').get('cityName');
  }),

  age:Ember.computed('birthYear',function(){
    return moment().year()-this.get('birthYear');
  }),
  sexT:function(){
    if(this.get('sex')===1){
      return App.locX('/xprt_data/sex_male');
    }else{
      return App.locX('/xprt_data/sex_female');
    }
  }.property('sex'),
  hasDriveLicense:function(){
    return this.get('driveLicense')===2;
  }.property('driveLicense'),
  hasCarT:function(){
    if(this.get('ownCar')===2){
      return App.locX('/xprt_data/hasowncar');
    }else{
      return App.locX('/xprt_data/noowncar');
    }
  }.property('ownCar'),
  rankFormat:function() {
    var rank=this.get('rank');
    if(rank===null){
      rank=0;
    }
    var rem=5;
    var rc=rank-rank%1;
    var rv='';
    for(var i=0;i<rc;i++){
      rv+='<i class="fa fa-star"></i>';
      rem--;
    }
    if(rc!==rank && rank%1<=0.5){
      rv+='<i class="fa fa-star-half-o"></i>';
      rem--;
    }else if(rank%1>0.5){
      rv+='<i class="fa fa-star"></i>';
      rem--;
    }
    for(var j=0;j<rem;j++){
      rv+='<i class="fa fa-star-o"></i>'; 
    }
    return rv;
  }.property('rank'),
  stringRepr: function(){
    return this.get('name')+':'+this.get('birthYear');
  }.property('name','birthYear'),
  editables: function(){
    return ['name','status','top'];
  },
});
export default XprtDetailModel;
Ember.Inflector.inflector.uncountable('xprtDetail');