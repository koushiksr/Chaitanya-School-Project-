import { Component } from '@angular/core';
import { environment } from 'src/environment';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';




@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  otp: string = '';
  emailVerified: boolean = false;
  otpVerified: boolean = false;
  constructor(private http: HttpClient, private _snackBar: MatSnackBar, private router: Router) {
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
    });
  }
  verifyEmail() {
    this.http.get(`${environment.apiUrl}/login/forgotpassword/${this.email}`)
      .subscribe((response: any) => {
        if (response) {
          this.emailVerified = true
          // console.log(this.emailVerified);
          this.openSnackBar('OTP sent to your mail ID', 'Close')
        } else {
          this.emailVerified = false
          this.openSnackBar(`invalid Email`, `close`)
        }
      }, (error) => {
        console.log(error.error)
        this.emailVerified = false
        this.openSnackBar(`invalid Email`, `close`)
      })
  }
  verifyOTP() {
    this.http.get(`${environment.apiUrl}/login/forgotpassword/otp/${this.otp}`)
      .subscribe((response: any) => {
        if (response) {
          this.openSnackBar('OTP Verified', 'Close')
          this.otpVerified = true;
        } else {
          this.openSnackBar(`invalid OTP`, `Close`)
        }
      }, (error) => {
        console.log(error.error)
      })
  }
  resetPassword() {
    // console.log(this.password, this.confirmPassword, 'password');
    if (this.password == this.confirmPassword) {
      this.http.put(`${environment.apiUrl}/login/forgotpassword/resetpassword/${this.email}/${this.password}`, {})
        .subscribe((response: any) => {
          if (response) {
            // console.log(response);
            this.openSnackBar('Password reset successfully', 'Close')
            this.router.navigate(['/login']);
          } else {
            this.openSnackBar(`Login entry with the specified email not found`, `close`)
          }
        }, (error) => {
          console.log(error.error)
        })
    }
  }
}
