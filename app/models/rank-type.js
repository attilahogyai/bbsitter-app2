import Ember from 'ember';
import DS from 'ember-data';
import App from "xprt/app";
var RankTypeModel=DS.Model.extend({
	desc: DS.attr('string'),
  avg: DS.attr('boolean')
});

RankTypeModel.reopenClass({
FIXTURES:[{
    id: 1,
    desc: App.locX('/rT_table/1'),
    avg:false
  },
  {
    id: 2,
    desc: App.locX('/rT_table/2'),
    avg:false
  },
  {
    id: 3,
    desc: App.locX('/rT_table/3'),
    avg:false
  },
  {
    id: 10,
    desc: App.locX('/rT_table/10'),
    avg:true
  },
  {
    id: 20,
    desc: App.locX('/rT_table/20'),
    avg:true
  },
  {
    id: 30,
    desc: App.locX('/rT_table/30'),
    avg:true
  },
  {
    id: 100,
    desc: App.locX('/rT_table/100'),
    avg:true
  }]
});

export default RankTypeModel;
Ember.Inflector.inflector.uncountable('rankType');