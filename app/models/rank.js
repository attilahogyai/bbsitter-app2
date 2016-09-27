import Ember from 'ember';
import DS from 'ember-data';
var RankModel=DS.Model.extend({
	rank: DS.attr('number'),
	rankType: DS.belongsTo('rankType',{ async: true }),
	xprtDetail: DS.belongsTo('xprtDetail'),
	useracc: DS.belongsTo('useracc'),
	createDt: DS.attr('datetime'),
	comment: DS.belongsTo('comment'),
	rankFormat:function() {
		var rank=this.get('rank');
		if(rank===null){
			rank=0;
		}
		var rem=5;
		var rc=rank-rank%1;
		var rv='';
		for(var i=0;i<rc;i++){
			rv+='<i class="fa fa-star" {{action "setRank"}}></i>';
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
			rv+='<i class="fa fa-star-o" {{action "setRank"}}></i>'; 
		}
		return rv;
	}.property('rank')
});
export default RankModel;
Ember.Inflector.inflector.uncountable('rank');