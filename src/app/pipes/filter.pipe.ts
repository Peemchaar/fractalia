import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(list: any[], filter:string): any {
    if(filter==undefined || filter=="") return list;
    let result:any[] = [];
    result = list.filter(res => {
      return (res.name + " " + res.internalName).toLowerCase().match(filter.toLowerCase());
    });
    return result;
  }

}
