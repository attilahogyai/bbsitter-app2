import Ember from 'ember';
import App from 'xprt/app';
function locHour(hour,minute){
	var currentLangData = moment.langData();
	App.moment.hour(hour).minute(minute);
	if(currentLangData.getSHourFormat){
		return currentLangData.getSHourFormat(App.moment);
	}else{
		return App.enLangData.getSHourFormat(App.moment);
	}
}
function locHourMinute(hour,minute){
	var currentLangData = moment.langData();
	App.moment.hour(hour).minute(minute);
	if(currentLangData.getSHourMinuteFormat){
		return currentLangData.getSHourMinuteFormat(App.moment);
	}else{
		return App.enLangData.getSHourMinuteFormat(App.moment);
	}
}


export { locHour,locHourMinute };

export default Ember.Handlebars.makeBoundHelper(locHour);





