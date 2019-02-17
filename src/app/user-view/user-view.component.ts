import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService, User} from '../shared/services/api.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  user: User;
  empty: '';

  constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService) {
  }

  async ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    await this.apiService.getUserById(id).then((res: User) => {
      this.user = res;
    }).catch(e => console.error(e));
  }

}
