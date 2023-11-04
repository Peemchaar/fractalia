import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterSkill'
})
export class FilterSkillPipe implements PipeTransform {

  transform(list: any[], filter:string): unknown {
    if(filter==undefined || filter=="") return list;
    filter = filter.toLowerCase();
    let result:any[] = [];
    result = list.filter(res => {
      return res.description.toLowerCase().match(filter);
    });
    return result;
  }

}
