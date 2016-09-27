import Ember from 'ember';

export default Ember.Object.extend({
  __setup:null,
  settingsObject:null,
  weekdaysarray:null,
  holidays:null,
  mostEarlyDelay:2,
  weekDays:Ember.computed.readOnly('weekdaysarray'), 
  dataClass:Ember.Object.extend({
    from:Ember.computed("fromDate", {
      get: function() {
        return this.get('fromDate').hour();
      },
      set: function(key, value) {
        this.get('fromDate').hour(value);
        return value;
      }
    }),
    to:Ember.computed("toDate", {
      get: function() {
        return this.get('toDate').hour();
      },
      set: function(key, value) {
        this.get('toDate').hour(value);
        return value;
      }
    }),
    fromDate:null,
    toDate:null
  }),
  isHoliday:function(date){
    var h=this.get('holidays').any(function(item,index){
      return date.isSame(item.day,"day");
    });
    return h;
  },
  isValid:function(date){
    if(date===null) { return false; }
    //var p=this.get('periods').get(date.weekday());
    var p=this.get('weekDays').get("content")[date.weekday()].period;

    for(var i=0;i<p.length;i++){
      if(this.checkIntervall(p[i], date)){
        return true;
      }
    }
    return false;
  },
  checkIntervall:function(p, date){
    var startM=p.fromDate.hour()*60+p.fromDate.minute();

    var toHour=p.toDate.hour(); // handling of 24
    if(toHour==0){
      toHour=24;
    }
    var endM=toHour*60+p.toDate.minute();

    var dateH=date.hour();
    if(dateH==0){
      dateH=24;
    }
    var act=(dateH*60)+date.minute();
    if(startM<=act && act<=endM){
      return true;
    }
    return false;
  },
  isValidIntervall:function(start,end){
    //var p=this.get('periods').get(start.weekday());
    var p=this.get('weekDays').get("content")[start.weekday()].period;
    for(var i=0;i<p.length;i++){
      if(this.checkIntervall(p[i], start) && this.checkIntervall(p[i], end)){
        return true;
      }
    }
    return false;
  },

/*
  isValidIntervall:function(start,end){
    var p=this.get('weekDays').get("content")[start.weekday()].period;
    var startM=start.hour()*60+start.minute();
    var endM=end.hour()*60+end.minute();
    for(var i=0;i<p.length;i++){
      if(startM>=(p[i].from*60) && endM<=(p[i].to*60)){
        return true;
      }
    }
    return false;
  },
*/
  isEmpty:function(){
    return this.get('settingsObject')===null;
  }.property('settingsObject'),
  deserialize:function(setupModel){
    this.set('__setup',setupModel);
    if(setupModel){
      var s=setupModel.get('settings');
      var so=eval('('+s+')');
      this.set('settingsObject',so);
      var weekdaysarray=Ember.ArrayController.create();
      for(var j=0;j<so.weekDays.length;j++){
        so.weekDays[j].day=moment().clone().weekday(j);
      }
      weekdaysarray.set('model',so.weekDays);
      this.set('weekdaysarray',weekdaysarray);

      var holidaysArray=Ember.ArrayController.create();
      holidaysArray.set('model',so.holidays);
      this.set('holidays',holidaysArray);     

      // parse periods
      var c=this;

      var filter=function(inData){
        var data=c.get('dataClass').create();
        if(inData.fromDate===undefined){
          data.set('fromDate',day.clone().hour(inData.from).minute(0));
        }else{
          data.set('fromDate',moment(inData.fromDate));
        }
        if(inData.toDate===undefined){
          data.set('toDate',day.clone().hour(inData.to).minute(0));    
        }else{
          data.set('toDate',moment(inData.toDate));
        }
        return data;
      };

      for(var i=0;i<so.weekDays.length;i++){
        var day=moment(so.weekDays[i].day);
        var periodDates=so.weekDays[i].period.map(filter);
        so.weekDays[i].period=periodDates;
      }
    }else{
      // create template setup
      console.log('setup not found');
    }
  },
  setFirstDay:function(fd){
    var so=this.get('settingsObject');
    so.firstDay=fd;
  },
  serialize:function(){
    var setup=this.get('__setup');
    var so=this.get('settingsObject');
    so.weekDays=this.get('weekdaysarray').get('content');
    so.holidays=this.get('holidays').get('content');
    var settings=JSON.stringify(so);
    setup.set('settings',settings);
    return setup;
  },
  addHoliday:function(date){
    if(date.indexOf('.')>-1){
      date=moment(date,'YYYY.MM.DD').format('YYYY-MM-DD');  
    }
    var d={day:date};
    var itemExists=this.get('holidays').find(function(item){
      if(item.day===date){
        return true;
      }
      return false;
    });
    if(!itemExists){
      this.get('holidays').addObject(d);
    }
  },
  createWeekSetup:function(weekPeriod,p1,p2){
    var weekDays=[];
    var m=moment();
    var weekSetup={
      weekDays:weekDays,
      holidays:[{day:m.year()+'-12-25'},{day:m.year()+'-12-26'},{day:m.year()+'-12-27'},{day:(m.year()+1)+'-01-01'}],
      exception:{days:[{date:"2014.06.11",period:[{from:14,to:16}]},{date:"2014.06.12"},{date:"2014.06.13"}]},
      firstDay:moment.langData()._week.dow
    };
    for(var i=0;i<=6;i++){
      if((weekPeriod=="1" && i<=4) || (weekPeriod=="2") || (weekPeriod=="3" && i>4 && i<=6)){
        if(p2===undefined || p2===null){
          weekDays[i]={period:[{from:p1[0],to:p1[1]}]};
        }else{
          weekDays[i]={period:[{from:p1[0],to:p1[1]},{from:p2[0],to:p2[1]}]};
        }
      }else{
        weekDays[i]={period:[]};
      }
    }
    return JSON.stringify(weekSetup);
  }
});