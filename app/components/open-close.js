import Ember from 'ember';
import App from "xprt/app";
export default Ember.Component.extend({
  // ezzel müxik http://jsfiddle.net/6Evrq/
  status:false,
  initValue:false,
  opentextCode:'/general/open',
  opentext:Ember.computed('opentextCode',function(){
    return App.locX(this.get('opentextCode'));
  }),  
  init:function(){
  	this.set('status',this.get('initValue'));
    this._super();
  },

  actions:{
    toggle:function(){
    	this.set('status',!this.get('status'));
    }
  }
});