import Ember from 'ember';
import DS from 'ember-data';
import App from "xprt/app";
var StudyModel=DS.Model.extend({
	desc: DS.attr('string')
});



StudyModel.reopenClass({
FIXTURES:[
  {
    id: 1,
    desc: App.locX('/study_table/intermediate')
  },
  {
    id: 2,
    desc: App.locX('/study_table/high')
  },
  {
    id: 3,
    desc: App.locX('/study_table/intermediate_expert')
  },
  {
    id: 4,
    desc: App.locX('/study_table/high_expert')
  },
  {
    id: 5,
    desc: App.locX('/study_table/student')
  },
]
});

export default StudyModel;
Ember.Inflector.inflector.uncountable('study');