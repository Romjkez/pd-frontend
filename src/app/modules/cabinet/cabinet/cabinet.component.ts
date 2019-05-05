import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.css']
})
export class CabinetComponent implements OnInit {

  constructor(private authService: AuthService) {
  }

  usergroup: number;

  ngOnInit() {
    this.usergroup = <number>this.authService.getUserGroup();
  }
}
