import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService, User} from '../shared/services/api.service';
import {AuthService, parseJwt} from '../shared/services/auth.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  user: User;
  canEdit: boolean;
  loading: boolean;

  constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService, private router: Router,
              private authService: AuthService) {
  }

  async ngOnInit() {
    this.loading = true;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    await this.apiService.getUserById(id).then((res: User) => {
      if (res.surname && res.id) {
        this.user = res;
        this.canEdit = parseJwt(this.authService.getToken()).data.email === res.email;
        this.loading = false;
      } else {
        this.router.navigate(['/404']);
      }
    }).catch(e => console.error(e));
  }
}
