import Ember from 'ember';
import PickadaySetup from "xprt/utils/pickaday-setup";
export default Ember.TextField.extend({
  _picker: null,
  placeholder: null,
  init: function() {
      var currentLangData = moment.langData();
      if(currentLangData.getPlaceholderDateFormat) {
        this.set('placeholder',currentLangData.getPlaceholderDateFormat());
      }else{
        this.set('placeholder',currentLangData.longDateFormat('L'));  
      }
      this._super();
  },
  modelChangedValue: function(){
    var picker = this.get("_picker");
    if (picker){
      picker.setDate(this.get("value"));
    }
  }.observes("value"),
 
  didInsertElement: function(){
    var currentYear = (new Date()).getFullYear();
    var formElement = this.$()[0];
    var picker = new Pikaday({
      field: formElement,
      format: 'L',
      firstDay: 1,
      yearRange: [1900,currentYear+2],
      i18n: PickadaySetup,
      onSelect: function(event){
        var c=event;
      },
      onOpen: function(event){
        var c=event;
      }
    });
    this.set("_picker", picker);
  },
     
  willDestroyElement: function(){
    var picker = this.get("_picker");
    if (picker) {
      picker.destroy();
    }
    this.set("_picker", null);
  },
});
