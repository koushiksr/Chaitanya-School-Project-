import { Component } from '@angular/core';
import { ForgotPasswordComponent } from '../forgot-password/forgot-password.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment';
import { Router } from '@angular/router';
// import { Token } from '@angular/compiler';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginError!: string;

  constructor(private http: HttpClient, private router: Router) { }
  apiUrl = environment.apiUrl;

  login() {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    // console.group(`${this.apiUrl}/login/`)
    this.http.post(`${this.apiUrl}/login/`, { email, password }).subscribe(
      (response: any) => {
        // console.log(response.role == 'school')
        if (response.token &&  response.role) {
          const headers = new HttpHeaders().set('Authorization', response.token);
          localStorage.setItem('role', response.role);

        }

        if (response.role == 'school' && response.token) {
          localStorage.setItem('username', email);
          localStorage.setItem('token', response.token);
          this.router.navigate(['/school']);
        }
        if (response.role == 'admin' && response.token) {
          localStorage.setItem('username', email);
          localStorage.setItem('token', response.token);
          this.router.navigate(['/admin']);
        }
        if (response.role == 'student' && response.token) {
          localStorage.setItem('username', email);
          localStorage.setItem('token', response.token);
          // console.log('student login fe')
          this.router.navigate(['/student']);
        }
        if (response.role == 'assessor' && response.token) {
          localStorage.setItem('username', email);
          localStorage.setItem('token', response.token);
          // console.log('student login fe')
          this.router.navigate(['/assessor']);
        }
      },
      (error) => {
        this.loginError = 'Login failed. Please check your email and password.';
      }
    );
  }
}
