import Ember from 'ember';
import App from "xprt/app";
import FormController from "xprt/controllers/form";
export default FormController.extend({
  queryParams: ['timetable','exceptions'],
  exceptions:null,
  timetable:null,
  app: window.App,
  session: Ember.computed.alias('app.authManager.session'),
  name:Ember.computed('instance.name','user.email',function(key, value, previousValue){
      if (arguments.length > 1) {
        this.set('instance.name',value);
      }else if(Ember.isEmpty(this.get('instance.name'))){
          this.set('instance.name',this.get('user.name'));
      }
      return this.get('instance.name');     
    }),
    email:Ember.computed('instance.email','user.email',function(key, value, previousValue){
      if (arguments.length > 1) {
        this.set('instance.email',value);
      }else if(Ember.isEmpty(this.get('instance.email'))){
        this.set('instance.email',this.get('user.email'));
      }
      return this.get('instance.email');      
    }),
    enableLocationInput:Ember.computed('instance.serviceLocationType',function(){
      if(this.get('instance.serviceLocationType.id')==="1" || this.get('instance.serviceLocationType.id')==="4"){
        return true;
      }
      return false;
    }),  

  
  queryObserver:function(){
    if(this.get('instance')===null || (this.get('exceptions')===null && this.get('timetable')===null)){
      return;
    }
    if(this.get('exceptions')!==null){
      this.set('exceptions',null);
      this.transitionTo('profile.xprt.exceptions',this.get('instance.id'));
    }
    if(this.get('timetable')!==null){
      this.set('timetable',null);
      this.transitionTo('profile.xprt.timetable',this.get('instance.id'));
    }
  }.observes('exceptions','timetable').on('init'),  

  professionList:null,
  languageList:null,
  educationLevelList:null,
  popup:true,
  // bbsitter
  serviceLocationTypeList:null,
  countryList:null,
  citySearchResult:null,
  cityName:null,
  currencyList:null,
  maxChildList: [1,2,3,4],
  user:null,
  addLanguage:null,
  requiredFields:['name','email','phone','birthYear','sex','country','targetLocations','educationLevel','education','languages','intProp1','experience','unitPrice','currency','driveLicense','ownCar','description'],
  updateMessage:function(status){
    if(this.get('firstSaved')){
      this.get('session').set('xprtDetailId',this.get('instance.id'));
      this.get('session').save().then(function(){
        
      }).catch(function(){
        App.reload();
      });
      return App.locX("/xprt_data/data_first_saved");  
    }else{
      return this._super(status);
    }
  },

  addLanguageObserver:function(){
    if(this.get('addLanguage')!==null && this.get('instance.languages')!==null){
      if(!this.get('instance.languages').contains(this.get('addLanguage'))){
        this.get('instance.languages').addObject(this.get('addLanguage'));
      }
    }
  }.observes('addLanguage').on('init'),
  

  countryCodeObserverver:function(){
    if(!Ember.isEmpty(this.get('app.authManager.countryCode')) && Ember.isEmpty(this.get('instance.country'))){
      var country=this.store.find('country',this.get('app.authManager.countryCode'));
      var c=this;
      country.then(function(data){
        c.set('instance.country',data);
      });
    }
    this.set('cityName',null);
  }.observes('instance.country','app.authManager.countryCode').on('init'),

  createNewDetailItem:function(){
    if(this.get('newItemDetail')===null && !Ember.isEmpty(this.get('instance'))){
      this.set('newItemDetail',this.store.createRecord(this.get('newItemDetailName'),{'xprtDetail':this.get('instance')}));
    }
  },
  actions:{
    cityTextChanged: function(text){ // triggered by autocomplatate widget 
      if(this.get('instance.country')){
        var result=this.store.find('city',{begin:text,country:this.get('instance.country.id')});
        this.set('citySearchResult',result);
      }
    },
    cityRemove:function(city){
      this.get('instance.targetLocations').removeObject(city);
    },
    citySelected: function(data){
      if(data.value){
        if(!this.get('instance.targetLocations').contains(data.value)){
          this.get('instance.targetLocations').addObject(data.value);
        }
      }
      return false;
    },
    showProfessions:function(){
      var alertWindow=Ember.$('#profession-popup');
          alertWindow.foundation('reveal', 'open');
    },
    langRemove:function(lang){
      this.get('instance.languages').removeObject(lang);
    }
  }
  
});
