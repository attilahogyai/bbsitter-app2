import Ember from 'ember';
export default Ember.TextField.extend({
  minValue:0,
  maxValue:null,
  minValueOffset:1,
  valueObser:function(){
   
  }.observes('value','minValue').on('init'),
  focusIn:function(){
    this.checkValue();
  },
  focusOut:function(){
    this.checkValue();
  },
  checkValue:function(){
    if(this.get('value')===null) {
      return;
    }
    Ember.Logger.debug('minValue:'+this.get('minValue'));
    if(this.get('minValue')!==null){
      if(Number(this.get('value'))<=Number(this.get('minValue'))){
        var value=Number(this.get('minValue'));
        if(this.get('minValueOffset')!==null){
          value+=Number(this.get('minValueOffset'));
        }
        this.set('value',value);
      }
    }
    if((this.get('value')+'').length>this.get('maxLength')){
      this.set('value',this.get('value').substring(0,this.get('maxLength')));
    }
    if(this.get('maxValue')!==null){
      if(Number(this.get('value'))>Number(this.get('maxValue'))){
        this.set('value',this.get('maxValue'));
      }
    }
  }
});
