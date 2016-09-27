import Ember from 'ember';
import App from "xprt/app";
export default Ember.View.extend({  
    didInsertElement: function(){
    	if(window['FB']){
    		FB.XFBML.parse();	
    	}
    }
});
