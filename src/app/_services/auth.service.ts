import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { User } from '../_models/User';

@Injectable()
export class AuthService {
    baseUrl = environment.apiUrl + 'auth/';
    userToken: any;
    decodedToken: any;
    currentUser: User;
    jwtHelper: JwtHelper = new JwtHelper();

    constructor(private http: Http) { }

    login(model: any) {
        return this.http.post(this.baseUrl + 'login', model, this.requestOptions()).map((response: Response) => {
            const user = response.json();
            if (user) {
                localStorage.setItem('token', user.tokenString);
                localStorage.setItem('user', JSON.stringify(user.user));
                this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
                this.currentUser = user.user;
                this.userToken = user.tokenString;
            }
        }).catch(this.handleError);
    }

    register(model: any) {
        return this.http.post(this.baseUrl + 'register', model, this.requestOptions()).catch(this.handleError);
    }

    loggedIn() {
        return tokenNotExpired('token');
    }

    // headers for http requests
    private requestOptions() {
        const headers = new Headers({'Content-Type': 'application/json'});
        return new RequestOptions({headers: headers});
    }

    // error handler
    private handleError(error: any) {
        const applicationError = error.headers.get('Application-Error');
        if (applicationError) {
            return Observable.throw(applicationError);
        }
        const serverError = error.json();
        let modelStateErrors = '';
        if (serverError) {
            for (const key in serverError) {
                if (serverError[key]) {
                    modelStateErrors += serverError[key] + '\n';
                }
            }
        }
        return Observable.throw(
            modelStateErrors || 'Server error'
        );
    }
}
