import AuthenticatedRoute from "xprt/routes/authenticated";
export default AuthenticatedRoute.extend({
	queryParams: {
    direction: {
      refreshModel: true
    }
  },
  model: function(params) {
   	if(params.direction===null){
   		params.direction='next';
   	}
		return this.store.find('xprtDetail',{forRating:true,direction:params.direction});
  },
	setupController: function(controller, model, transition) {
		controller.set('xprtDetailRatingList',model);
	}
});
