import DS from 'ember-data';
import Ember from 'ember';
export default Ember.Component.extend({
  valueObject:null,
  app:window.App,
  valueField:'address',
  cityText: Ember.computed.alias('app.authManager.city'),
  selectedCity:null,
  citySearchResult:null,
  existingAddressResult:null,
  session:Ember.computed.alias('app.authManager.session'),
  existingAddressResultBackup:null,
  valueChanged: 0,
  
  init:function(){
    var allMyAddress=this.store.find('address',{useracc:this.get('session.userid')});

    var c=this;
    allMyAddress.then(function(addressList){
      if(addressList.get('length')>0){
        var addressCombo=addressList.map(function(data){
          var a=Ember.Object.create({
            id:data.get('id'),
            label:data.get('zip')+', '+data.get('city.cityName')+' '+data.get('street'),
            zip:data.get('zip'),
            addressModel:data
          });
          return a;
        });
        var ap = new Ember.RSVP.Promise(function(resolve,reject){
          resolve(addressCombo);
        });
        c.set('existingAddressResult',DS.PromiseArray.create({ promise: ap }));
        c.set('existingAddressResultBackup',DS.PromiseArray.create({ promise: ap }));
      }
    });
    this._super();
  },
  zipModel:Ember.computed('address',function(){
    var address=this.get('address');
    if(address!==null){
      return Ember.Object.create({id:address.get('id'),zip:address.get('zip'),addressModel:address});
    }
    return null;
  }),
  
  address: Ember.computed("valueObject", "valueChanged", {
    get: function() {
      if(this.get('valueObject')===null) {
        return null;
      }
      var address=this.get('valueObject.'+this.get('valueField'));
      if(address.get('content')===null){
        address=this.store.createRecord('address', {});
        this.set('valueObject.'+this.get('valueField'),address);
      }
      return address;
    },
    set: function(key, value) {
      if(value!==null && value.get('addressModel')!==undefined){
        this.set('valueObject.'+this.get('valueField'),value.get('addressModel'));
      }else{
        this.set('valueObject.'+this.get('valueField'),value);
      }

    }
  }),


  actions:{
    addressTextChanged: function(txt){
      this.set('existingAddressResult',this.get('existingAddressResultBackup'));

      if(this.get('valueObject.'+this.get('valueField')).get('content')!==null){
        this.set('valueObject.'+this.get('valueField')+'.zip',txt);  
        Ember.Logger.info('address zip changed:'+txt);
      }
    },
    addressSelected: function(selection){
      var addrr=selection.value.get('addressModel');
      Ember.Logger.info('addressSelected action set addrr:'+addrr.get('zip'));
      this.set('address',addrr);
      this.incrementProperty('valueChanged');
    },
    cityTextChanged: function(text){
      var result=this.store.find('city',{begin:text,country:'HU'});
      this.set('citySearchResult',result);
    },
    citySelected:function(selection){
      this.set('selectedCity',selection);
      var address=this.get('address');
      if(Ember.isEmpty(address)){
        this.set('address',this.store.createRecord('address', {}));  
      }
      address.set('city',selection.value);  
    }
  }
});