import Ember from 'ember';
import Foundation from "xprt/utils/foundation";
export default Ember.View.extend(Foundation,{  
	dragDropFile: DropletView.extend({multiple:null}),
    didInsertElement: function(){
    	this.initFoundation();
    }
});
