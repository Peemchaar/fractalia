
export class StringUtils {
  static isValidString(str: string) {
      return str !== null && str !== undefined && typeof str === "string" && str.length > 0;
  }

  static validarEmail(email: string) {
    if (email.length <= 2) {
      return false;
    }
    if (email.indexOf("@") == -1) {
      return false;
    }
    var parts = email.split("@");
    var dot = parts[1].indexOf(".");
    var dotSplits = parts[1].split(".");
    var dotCount = dotSplits.length - 1;
    if (dot == -1 || dot < 2 || dotCount > 2) {
      return false;
    }
    for (var i = 0; i < dotSplits.length; i++) {
      if (dotSplits[i].length == 0) {
        return false;
      }
    }
    return true;
  }

  static deepClone(arg) {
    return JSON.parse(JSON.stringify(arg));
  }

  static getCurrentDate(){
    function pad(s) { return (s < 10) ? '0' + s : s; }
    let d = new Date();
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
  }

  static convertDateLatinFormat(date) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    let d = new Date(date);
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
  }

  static convertDateWithHour(date){
    function pad(s) { return (s < 10) ? '0' + s : s; }
    function parseHour(val) { 
      if(val > 12){
        s = "pm"
        return val-12
      }else{
        s = "am"
        return val
      }
    }
    let s = ''
    let d = new Date(date);
    let h = parseHour(d.getHours())
    let parseDate = [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
    let res = parseDate + ' - ' + h + ":" + d.getMinutes() + ":" + d.getSeconds() + " " + s
    return res
  }

  static addDaysAndFormat(date, days){
    function pad(s) { return (s < 10) ? '0' + s : s; }
    let d = new Date(date);
    d.setDate(d.getDate() + days)
    return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
  }

  static groupBy(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  static sortByProperty(array:any, property:any, inverse = false ){
    const arraySortered = array.sort((a:any, b:any) => {
        if (a[property] > b[property]) {
            return 1;
        }
        if (a[property] < b[property]) {
            return -1;
        }

        return 0;
    });

    if(inverse) {
        return arraySortered.reverse();
    }
    return arraySortered;
  }

  static textareaReplaceLineBreaks(text: string) {
    if (!text) {
      return '';
    }
    return text.replace(/(\r\n|\n)/g, '<br/>');
  }

}
