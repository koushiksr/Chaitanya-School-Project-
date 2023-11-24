// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

@Injectable({
     providedIn: 'root',
})
export class AuthGuard implements CanActivateChild {
     constructor(private router: Router) { }

     canActivateChild(): boolean {
          if (this.isAuthenticated()) {
               return true;
          } else {
               this.router.navigate(['/login']);
               return false;
          }
     }

     private isAuthenticated(): boolean {
          // Check if the JWT token is present and not expired
          const token = localStorage.getItem('token');
          // const decodedToken: any = jwt_decode(token);

          // // Check if the token has an "exp" claim
          // if (decodedToken && decodedToken.exp) {
          //      const currentTimestamp = Math.floor(Date.now() / 1000); // Convert to seconds
          //      const tokenExpiration = decodedToken.exp;

          //      if (currentTimestamp > tokenExpiration) {
          //           console.log('Token has expired');
          //           return false;
          //      } else {
          //           console.log('Token is still valid');
          //           return !!token;
          //      }
          // } else {
          //      console.log('Invalid token or no expiration claim');
          // }



          return !!token;
     }
}
function jwt_decode(token: string | null): any {
     throw new Error('Function not implemented.');
}

