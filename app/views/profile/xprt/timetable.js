import Ember from 'ember';
import App from "xprt/app";
import FoundationReveal from "xprt/utils/foundation-reveal";
var TimetableView=Ember.View.extend(FoundationReveal,{
	didInsertElement: function(){
		this.initFoundation();
	}
});

export default TimetableView;