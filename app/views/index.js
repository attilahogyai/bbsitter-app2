import Ember from 'ember';
import Foundation from "xprt/utils/foundation";
import App from "xprt/app";

export default Ember.View.extend(Foundation,{  
    didInsertElement: function(){
    	this.initFoundation();
    	if(window['FB']){
    		FB.XFBML.parse();	
    	}
    }
});
