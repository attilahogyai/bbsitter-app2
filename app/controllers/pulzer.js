import BaseController from "xprt/controllers/base";
import Ember from "ember";
export default BaseController.extend({
	actDate: null,
	xprtDetail: null,
	actDateS:Ember.computed('actDate',function(){
		if(this.get('actDate')==null){
			this.set('actDate',moment());
		}
		return this.get('actDate').format('YYYYMMDD');
	})
});