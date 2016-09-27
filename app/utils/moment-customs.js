import Ember from 'ember';

export default Ember.Object.extend({
    setup: function (){
        moment.lang('hu', {
            months : "január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),
            monthsShort : "jan_febr_márc_ápr_máj_jun_jul_aug_szept_okt_nov_dec".split("_"),
            weekdays : "vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),
            weekdaysShort : "vas_hétf_kedd_szer_csüt_pén_szom".split("_"),
            weekdaysMin : "V_H_K_Sze_Cs_P_Szo".split("_"),
            longDateFormat : {
                LT : "HH:mm",
                L : "YYYY.MM.DD",
                LL : "YYYY. MMMM D. ",
                LLL : "YYYY. MMMM D. LT",
                LLLL : "YYYY. MMMM D. dddd. LT",
            },
            calendar : {
                sameDay: "[ma] LT",
                nextDay: '[holnap] LT',
                nextWeek: 'dddd [jövő hét] LT',
                lastDay: '[tegnap] LT',
                lastWeek: 'dddd [múlt hét] LT',
                sameElse: 'L'
            },
            relativeTime : {
                future : "jövő %s",
                past : "elmúlt %s",
                s : "egy másodperce",
                m : "egy perce",
                mm : "%d perce",
                h : "egy órája",
                hh : "%d órája",
                d : "egy napja",
                dd : "%d napja",
                M : "egy hónapja",
                MM : "%d hónapja",
                y : "egy éve",
                yy : "%d éve"
            },
            getPlaceholderDateFormat: function(){
                return "éééé.hh.nn";
            },
            getDurationTimeFormat: function(m){
                if(m.minutes()===0){
                    return m.format('H [óra]');
                }else if(m.hours()===0){
                    return m.format('m [perc]');
                }
                return m.format('H [óra] m [perc]');
            },
            getHourFormat: function(m){
                return m.format('H [óra]');
            },
            getSHourFormat: function(m){
                return m.format('H');
            },
            getMiniuteFormat: function(m){
                return m.format('m [perc]');
            },
            getSHourMinuteFormat: function(m){
                return m.format('H:mm');
            },
            ordinal : function (number) {
                return number + (number === 1 ? 'er' : 'ème');
            },
            week : {
                dow : 1, // Monday is the first day of the week.
                doy : 4  // The week that contains Jan 4th is the first week of the year.
            }        
        });        

        var currentLangData = moment.langData('en');
        currentLangData.getDurationTimeFormat=function(m){
            if(m.minutes()===0){
                    return m.format('H [hour]');
                }else if(m.hours()===0){
                    return m.format('m [minute]');
                }
                return m.format('H [hour] m [minute]');
        };
        currentLangData.getHourFormat=function(m){
            return m.format('h a');
        };
        currentLangData.getSHourFormat=function(m){
            return m.format('h a');
        };
        currentLangData.getSHourMinuteFormat=function(m){
            return m.format('h:mm a');
        };
        currentLangData.getMiniuteFormat= function(m){
                return m.format('m [minute]');
        };
    }
});