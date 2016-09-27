import Ember from 'ember';
import DS from 'ember-data';
var CommentModel=DS.Model.extend({
	comment: DS.attr('string'),
	xprtDetail: DS.belongsTo('xprtDetail'),
	useracc: DS.belongsTo('useracc'),
	createDt: DS.attr('datetime'),
	modifyDt: DS.attr('datetime'),
	source: DS.attr('number'),
	rank: DS.hasMany('rank'),
	addressee: DS.belongsTo('useracc'),
	status: DS.attr('number'),
	original: DS.belongsTo('comment',{inverse: 'reply'}),
	reply: DS.belongsTo('comment',{inverse: 'original'}),
	toggle:false,
	isUnreaded:function(){
		return this.get('status')===1;
	}.property('status'),
	hasParent:function(){
		return this.get('original')!==null;
	}.property('original')
});
export default CommentModel;
Ember.Inflector.inflector.uncountable('comment');