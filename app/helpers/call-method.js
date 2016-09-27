import Ember from 'ember';
function cm(object, method, param1, param2, param3) {
	var m=object.get(method);
	return m.apply(object,[param1,param2,param3]);
}

export default Ember.Handlebars.makeBoundHelper(cm);
