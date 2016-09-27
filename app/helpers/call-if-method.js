function cim(objectS, method, param1S, param2S, param3S) {
	var options=arguments[arguments.length-1];
	var keywords=options["data"]["keywords"];
	var object=keywords[objectS];
	var m=object.get(method);
	var param1=keywords[param1S];
	var param2=keywords[param2S];
	var param3=keywords[param3S];
	var b=m.apply(object,[param1,param2,param3]);
    if (b) {
        return options.fn(this);
    }
    return options.inverse(this);

}
export { cim };

export default cim;
//export default Ember.Handlebars.makeBoundHelper(cim);
