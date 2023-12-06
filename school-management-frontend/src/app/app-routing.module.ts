import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SchoolDashboardComponent } from './school-dashboard/school-dashboard.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { RegistrationFormComponent } from './registration-form/registration-form.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { AssessorComponent } from './assessor/assessor.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'register', component: RegistrationFormComponent },
  { path: 'login', component: LoginComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'school', component: SchoolDashboardComponent },
  { path: 'assessor', component: AssessorComponent },
  { path: 'student', component: StudentDashboardComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
