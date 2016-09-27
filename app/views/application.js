import Ember from 'ember';
import Foundation from "xprt/utils/foundation";
var ApplicationView=Ember.View.extend(Foundation,{
	changeSizeListeners: Ember.Object.create(),
	didInsertElement: function(){
		this.initFoundation();
		
		this.viewportSizeChanged();
		var target = document.querySelector('body');
		/*
 		target.addEventListener("onresize",function(event){
 			window.console.log('change 1 size');
 			this.displayViewportHeight();
 		},false);
 		 		target.onresize=function(event){
 			window.console.log('change 1 size');
 			this.displayViewportHeight();
 		};
 		*/
 		if(this.get('changeSizeListeners')){
 			this.get('changeSizeListeners').destroy();
 		}
 		this.set('changeSizeListeners',Ember.Object.create());
 		var e=this;
 		Ember.changeSize=function(event){
 			e.viewportSizeChanged();

 			for (var property in e.get('changeSizeListeners')) {
			    if (e.get('changeSizeListeners').hasOwnProperty(property)) {
			    	var listenersArray=e.get('changeSizeListeners').get(property);
			    	if(listenersArray===undefined) { continue; }
					for(var i=0;i<listenersArray.length;i++){
						Ember.run(listenersArray[i]);
 					}
			    }
			}
 		};
 		Ember.addChangeSizeListener=function(listener,owner){
 			var listeners=e.get('changeSizeListeners'); 
 			if(listeners.get(owner.toString())===undefined){
 				listeners.set(owner.toString(),[]);
 				listeners.set(owner.toString(),[]);
 			}
 			listeners.get(owner.toString()).push(listener);	
 			e.set('changeSizeListeners',listeners);
 		};
 		Ember.removeChangeSizeListeners=function(owner){
 			if(this.get('changeSizeListeners')){
 				this.get('changeSizeListeners').destroy();
 			}
 		};
		 
		// later, you can stop observing
		//observer.disconnect();
		/*
		Ember.$( "#main" ).bind('onpropertychange',function (e){
			e.preventDefault();
    		window.console.log('a div with  has changed it\'s height, the function below should do something about this...');  
    		
		});  
*/
	},
	viewportSizeChanged:function(){
		var fullHeight=Ember.$( "body" ).height();
		var headerSize=0;
		var navs=Ember.$( "nav" );
		navs.map(function(item){
			var n=Ember.$(navs[item]);
			if(n.css('display')!=='none'){
				headerSize=headerSize+n.outerHeight();
			}
		});
		var footerHeight=Ember.$( "#footer" ).outerHeight();

		var mainHeight=fullHeight - footerHeight - headerSize;
		Ember.$( "#main" ).css('min-height',mainHeight);
		//window.console.log('full height:'+fullHeight+'/ headerSize:'+headerSize+' footerheight:'+footerHeight+' mainheight:'+mainHeight);
	}
});
export default ApplicationView;