import Ember from 'ember';
export default Ember.Component.extend({
  classNames: ['pretty-color'],
  attributeBindings: ['style'],
  style:Ember.computed('name',function(){
    return 'color: ' + this.get('name') + ';';
  })
});
