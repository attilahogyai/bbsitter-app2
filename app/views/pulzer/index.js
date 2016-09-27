import Ember from 'ember';
var PulzerIndexView=Ember.View.extend({
	didInsertElement: function(){
		/*
		var slider=Em.$('#day-slider').bxSlider({
  			infiniteLoop: true,
  			controls:false,
  			pagerCustom: '#setup-steps',
  			pager:false,
		});
		this.set('controller.slider',slider);
		*/
	},
	destroyElement: function() {
        //return this.currentState.destroyElement(this);
    }
});

export default PulzerIndexView;