import Ember from 'ember';
import DS from 'ember-data';
import App from "xprt/app";
var SLTModel=DS.Model.extend({
	desc: DS.attr('string')
});

SLTModel.reopenClass({
  FIXTURES:[
  {
    id: 1,
    desc: App.locX('/slt_table/xprt_address')
  },
  {
    id: 3,
    desc: App.locX('/slt_table/client_address')
  },
  {
    id: 4,
    desc: App.locX('/slt_table/xprt_or_client_address')
  },
  {
    id: 2,
    desc: App.locX('/slt_table/online')
  }
  
]
});

export default SLTModel;
Ember.Inflector.inflector.uncountable('serviceLocationType');