import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {User} from '../../shared/models/user.model';
import {ProjectsService} from '../../shared/services/projects.service';
import {UserService} from '../../shared/services/user.service';
import {AuthService} from '../../shared/services/auth.service';
import {parseJwt} from '../../shared/utils/functions.util';
import {UserProjects} from '../../shared/models/project.model';
import {MatSnackBar} from '@angular/material';


@Component({
  selector: 'app-user-view',
  templateUrl: './user-view.component.html',
  styleUrls: ['./user-view.component.scss']
})
export class UserViewComponent implements OnInit {
  user: User;
  canEdit: boolean;
  loading: boolean;
  projects: UserProjects;

  constructor(private activatedRoute: ActivatedRoute, private projectsService: ProjectsService, private router: Router,
              public authService: AuthService, private userService: UserService, private snackBar: MatSnackBar) {
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
      this.projectsService.getUserProjects(this.user.id).then(res => {
        this.projects = res;
      });
    }).catch(e => {
      this.snackBar.open(`Ошибка: ${e.error.message || 'отсутствует соединение с интернетом'}`, 'Закрыть');
      console.error(e);
    }).finally(() => this.loading = false);
  }

}
