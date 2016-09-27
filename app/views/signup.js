import Ember from 'ember';
import Foundation from "xprt/utils/foundation";
export default Ember.View.extend(Foundation,{  
    didInsertElement: function(){
    	this.initFoundation();
    }
});
