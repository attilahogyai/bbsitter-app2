import Ember from 'ember';
export default Ember.Component.extend({
  classNames:['autocomplete-text'],

  // displayed and selected value
  inputText:null,
  eagerInputTextChange:false, // triggers the change event for each change


  modelItem:null,

  required:false,

  index:-1,
  liId:'li',
  open:false,
  inputClass:null,

  minCharacters:3,
  autoSelect:true, // automatic selection in case there is just one match or in case of label exact match

  emptyAfterSelected:false,
  focus:false,


  autoSelectState:Ember.computed('autoSelect',function(){
    if(typeof this.get('autoSelect')=="string") {
      return this.get('autoSelect')==='true';
    }else{
      return this.get('autoSelect');
    }
  }),
  forceOpen:true, // forces to open the result list otherwise it will open for down button
  
  forceOpenState:Ember.computed('forceOpen',function(){
    if(typeof this.get('forceOpen')=="string") {
      return this.get('forceOpen')==='true';
    }else{
      return this.get('forceOpen');
    }
  }),

  searchResult:null, // search result displayed in dropdown

  valueField:'id',
  labelField:'name',
  textField:'name',

  displayResult: null, // displayed in dropdown
  bubble:false,
  triggerIfEnter:false,

  


  mobelItemObserver:function(){
    if(this.get('modelItem')!=null){
      var textField=this.get('textField');
      this.set('inputText',this.get('modelItem').get(textField));
    }
  }.observes('modelItem').on('init'),

  displayResultObserver:function(){
    var txt=this.get('inputText');  
    if(txt==null){ return; }
    if(txt.length<this.get('minCharacters')){ 
      this.set('displayResult',null);
      return ;
    } // further filtering in the result is enabled if the text length is bigger than the minimum character number
    txt=txt.toLowerCase();
    var searchResult=this.get('searchResult');
    if(searchResult===null){ 
      this.set('displayResult',null);
      return; 
    }
    var labelField=this.get('labelField');
    var c=this;
    var exactMatch=null;
    searchResult.then(function(){
      // filter result based on typed string
      var r= searchResult.filter(function(element){
        if(element.get(labelField)!==undefined && element.get(labelField).toLowerCase().search(txt)===0){
          if(element.get(labelField).toLowerCase()===txt){
            exactMatch=element;
          }
          return true;
        }else{
          return false;
        }
      });

      // set display result and force open if inputText is not empty and is not null
      if(!c.get('isDestroyed')){
        Ember.Logger.debug('display result set:'+r.length);
        c.set('displayResult',r);
        if(c.get('forceOpenState') && 
          c.get('inputText')!==null && 
          c.get('inputText').length!==0 && 
          c.get('focus')
          ){
          Ember.Logger.debug('force open');
          c.set('open',true);
        }
      }else{
        Ember.Logger.debug('component says that it is distroyed'+r.length);
      }

      // in case of autoslect trigger selected event
      Ember.Logger.debug('search result:'+r.length);
      if(c.get('autoSelectState')){
        if(r.length==1){
          c.sendAction('valueSelectedEvent',{value:r[0],label:c.inputText}); 
          c.set('inputText',c.inputText);
        }else if(exactMatch!==null){
          c.sendAction('valueSelectedEvent',{value:exactMatch,label:exactMatch.get(labelField)}); 
          c.set('inputText',exactMatch.get(labelField));
        }
      }
    });
  }.observes('searchResult','inputText').on('init'),
  icon:null, 
  clearIcon: true,
  placeholder: '',
  lastSearchString: null,
  titleIcon:function(){
    var icon=this.get('icon');
    return icon+' titleIcon';
  }.property('icon'),
  textStyle:Ember.computed('inputClass','icon',function(){
    var inputClass=this.get('inputClass');
    var icon=this.get('icon');
    var style='';
    if(!Ember.isEmpty(inputClass)){
      style=inputClass;
    }
    if(!Ember.isEmpty(icon)){
      style=style+' titleIcon';
    }
    if(this.get('clearIcon')){
      style=style+' clearIcon';
    }
    return style;
  }),
  observIdx:function(){
    var idx=this.get('index');
    if(idx>-1 && this.get('displayResult')!==null){
      var id=this.itemId(idx);
      var liItem=Ember.$('#'+id);
      liItem.addClass('active');
    }
  }.observes('index').on('init'),
  clearSelection:function(){
    var idx=this.get('index');
    var id=this.itemId(idx);
    var liItem=Ember.$('#'+id);
    liItem.removeClass('active');
  },
  observText:function(){
    var txt=this.get('inputText');
    var minChars=this.get('minCharacters');
    if(txt && txt.length>=minChars){
      var lastSearchString=this.get('lastSearchString');
      var eagerInputTextChange=this.get('eagerInputTextChange');
      Ember.Logger.info('lastSearchString:'+this.get('lastSearchString'));
      if(lastSearchString===null || Boolean(eagerInputTextChange) || (lastSearchString.length>=txt.length && lastSearchString!==txt)){
        Ember.run.throttle(this, function(){
          this.set('lastSearchString',txt);
          Ember.Logger.info('lastSearchString set:'+this.get('lastSearchString'));
          this.sendAction('textChangedEvent',txt);
        }, 700);
      }
    }else{
      this.reset();
    }
  }.observes('inputText').on('init'),

  itemId:function(idx){
    return this.get('liId')+idx;
  },
  itemLabel:function(item){
    return item.get(this.get('labelField'));
  },
  reset:function(){
    this.set('open',false);
    this.set('searchResult',null);
    this.set('index',-1);
    this.set('lastSearchString',null);
    this.set('displayResult',null);
    Ember.Logger.debug('open:'+this.get('open'));
  },
  clear:function(){
    this.set('inputText','');
    this.sendAction('valueClearedEvent',{value:null,label:''}); 
  },
  /*
  searchResult:function(){
    if(!this.get('inputText')) return [];
    this.set('index',-1);
    return ['Budapest','Budaőrs','Debrecen','Pécs','Győr'];
  }.property('inputText'),
  */
  keyUp:function(e){
    var open=this.get('open');
    var i=this.get('index');
    var displayResult=this.get('displayResult');
    if(displayResult===null){
      return;
    }

    Ember.Logger.debug('e.keyCode:'+e.keyCode);
    if(e.keyCode===40){ // scroll down
      if(!open) { 
        this.set('open',true);
      }
      if(i===displayResult.length){
        this.set('index',-1);
      }else{
        this.clearSelection();
        this.incrementProperty('index');
      }
    }else if(e.keyCode===38){ // scroll up
      if(!open) { return; }
      if(i===-1){
        this.set('index',displayResult.length-1);
      }else{
        this.clearSelection();
        this.decrementProperty('index');
      }
    }else if(e.keyCode===13){
      if(i>-1 && displayResult[i]){
        this.set('inputText',displayResult[i].get(this.get('labelField')));
        this.sendAction('valueSelectedEvent',{value:displayResult[i],label:this.itemLabel(displayResult[i])}); 
      }
      this.reset();
    }
    return false;
  },
  click:function(e){
    if(e.target.localName==='li'){
      var id=e.target.id;
      var selectedIdx=id.replace(this.get('liId'),'');
      var selectedItem=this.get('displayResult').objectAt(selectedIdx);
      this.set('inputText',Ember.$(e.target).text());
      this.sendSelectEvent(selectedItem,this.get('inputText'));
    }
    return false;
  },
  actions:{
    clearText:function(){
      this.clear();
      this.reset();
    },
    focusOut:function(){
      var c=this;
      Ember.run.later(function(){
        if(!c.isDestroyed){
          c.set('open',false);
          c.set('focus',false);
        }
      },300);
    },
    focusIn:function(){
      var c=this;
      Ember.run.later(function(){
        if(!c.isDestroyed){
          c.set('open',true);
          c.set('focus',true);
        }
      },300);
    },
    /** this event will be called when the user hits the enter on the input field.
    This method triggers the valueSelectedEvent if there is a match between the result items label and the typed string
    */ 
    setValue:function(){
      var i=this.get('index');
      var displayResult=this.get('displayResult');
      var inputText=this.get('inputText');
      var labelField=this.get('labelField');

      var modelItem=null;

      if(i>-1 && displayResult[i]){
        modelItem=displayResult[i];
      }else if(!Ember.isEmpty(displayResult)){
        displayResult.find(function(item,index){
          if(item.get(labelField).toLowerCase()===inputText.toLowerCase()){
            modelItem=item;
            return true;
          }
          return false;
        },this);
      }
      if(modelItem){
        this.set('modelItem',modelItem);
        Ember.Logger.debug('inputText:'+this.itemLabel(modelItem));
        this.set('inputText',this.itemLabel(modelItem));
        this.sendSelectEvent(modelItem,this.itemLabel(modelItem));
      }else if(this.get('triggerIfEnter')){
        this.sendAction('valueSelectedEvent',{value:null,label:inputText}); 
      }
    }
  },
  sendSelectEvent:function(valueObject,labelString){
    var c=this;
    Ember.run.schedule('afterRender', function() {
      c.sendAction('valueSelectedEvent',{value:valueObject,label:labelString}); 
      if(c.get('emptyAfterSelected')===true || c.get('emptyAfterSelected')=='true'){
        c.clear();
      }
      c.reset();
    });
  }
});