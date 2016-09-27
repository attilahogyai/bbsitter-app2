import Ember from 'ember';
function dateF(date,format) {
	if(date==='this'){
			date=this;
	}
	if(typeof date === 'string'){
		date=moment(date);
	}
	if(format==='fromNow'){
		return date.fromNow();
	}
	if(date && date.format) {
			return date.format(format);
	}
	return '';
}

export default Ember.Handlebars.makeBoundHelper(dateF);
