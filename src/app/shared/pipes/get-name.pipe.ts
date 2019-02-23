import {Pipe, PipeTransform} from '@angular/core';
import {ApiService} from '../services/api.service';
import {from, Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Pipe({
  name: 'getName'
})
export class GetNamePipe implements PipeTransform {
  constructor(private apiService: ApiService) {
  }

  transform(value: number): Observable<any> {
    return from(this.apiService.getUserById(value))
      .pipe(
        map(({name, surname, middle_name}) => {
          return `${surname} ${name.length > 0 ? name : ''} ${middle_name.length > 0 ? middle_name : ''}`;
        }),
      );
  }
}
