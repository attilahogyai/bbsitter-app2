import Ember from 'ember';
import App from 'xprt/app';
function numberFormat(value) {
	value = Math.round((value*100)/100).toFixed(0);
	if (App.getLang() === 'HU'){
		value = value.toString().replace('.',',');
		value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	} else {
		value = value.toString().replace(',','.');
		value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}
	return value;
}
export default Ember.Handlebars.makeBoundHelper(numberFormat);
