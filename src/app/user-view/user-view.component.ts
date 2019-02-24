import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService, User} from '../shared/services/api.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  user: User;

  constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService, private router: Router) {
  }

  async ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    await this.apiService.getUserById(id).then((res: User) => {
      if (res.surname && res.id) {
        this.user = res;
      } else {
        this.router.navigate(['/404']);
      }
    }).catch(e => console.error(e));
  }

}
