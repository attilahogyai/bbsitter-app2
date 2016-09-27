import Ember from "ember";
function evalInContext(source, context) {
    source = '(function(' + Object.keys(context).join(', ') + ') {' + source + '})';
    var compiled = eval(source);

    return compiled.apply(context, values());

    // you likely don't need this - use underscore, jQuery, etc
    function values() {
        var result = [];
        for (var property in context){
            if (context.hasOwnProperty(property)){
                result.push(context[property]);
            }
        }
        return result;
    }
}

function evalF(script,options) {
	while(script.indexOf('$$')>-1){
		script=script.replace('$$','data.view');
	}
	return evalInContext('return '+script,options);
}

export { evalF };

export default Ember.HTMLBars.makeBoundHelper(evalF);



