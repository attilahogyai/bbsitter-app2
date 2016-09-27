
function dateF(date,format) {
		if(date==='this'){
				date=this;
		}
		if(date && date.format) {
				return date.format(format);
		}
		return '';
}

export default dateF;
