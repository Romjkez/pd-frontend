import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiService} from '../../shared/services/api.service';
import {AuthService} from '../../shared/services/auth.service';
import {parseJwt} from '../../shared/utils/functions.util';
import {UserProjects} from '../../shared/models/project.model';
import {User} from '../../shared/models/user.model';
import {UserService} from '../../shared/services/user.service';


@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.css']
})
export class UserViewComponent implements OnInit {
  user: User;
  canEdit: boolean;
  loading: boolean;
  projects: UserProjects;

  constructor(private activatedRoute: ActivatedRoute, private apiService: ApiService, private router: Router,
              public authService: AuthService, private userService: UserService) {
  }

  async ngOnInit() {
    this.loading = true;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    await this.userService.getUserById(id).then((res: User) => {
      if (res.surname && res.id) {
        this.user = res;
        if (this.authService.getToken().length > 0) {
          this.canEdit = parseJwt(this.authService.getToken()).data.id === res.id;
        } else {
          this.canEdit = false;
        }
      } else {
        this.router.navigate(['/404']);
      }
    }).then(() => {
      this.apiService.getUserProjects(this.user.id).then(res => {
        this.projects = res;
      });
      this.loading = false;
    }).catch(e => console.error(e));
  }

}
