import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registerMode = false;
  values: any;

  constructor(private http: Http, private authService: AuthService) { }

  ngOnInit() {
  }

  registerToggle() {
    this.registerMode = true;
  }

  loggedIn() {
    const token = this.authService.loggedIn();
    if (token) {
      return true;
    }
    return false;
  }

  cancelRegisterMode(registerMode: boolean) {
    this.registerMode = registerMode;
  }
}
