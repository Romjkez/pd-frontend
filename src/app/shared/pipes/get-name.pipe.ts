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
          return `${surname !== undefined ? surname : ''} ${name !== undefined ? name : ''} ${middle_name !== undefined ? middle_name : ''}`;
        }),
      );
  }
}
