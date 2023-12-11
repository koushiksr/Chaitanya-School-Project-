import { ChangeDetectionStrategy, ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { TemplateRef } from '@angular/core';
// import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-admin-dashboard', 
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent {
  @ViewChild('formContent', { read: TemplateRef }) formContent!: TemplateRef<any>;

  @ViewChild('schoolForm')
  admin: any;
  schools: any[] = [];
  assessors: any[] = [];
  isPopupOpen = false;
  myForm: FormGroup;
  myForm1: FormGroup;
  editMode: boolean = false;
  currentSchool: any;
  currentAssessor: any;
  email: any;
  firstName: any;
  lastName: any;
  phoneNumber: any;
  showFiller = false;
  isActivity: boolean = false;



  constructor(private http: HttpClient, private router: Router,
    private _snackBar: MatSnackBar, private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef, private dialog: MatDialog) {
    this.dialogRef = {} as MatDialogRef<any>;
    this.fetchSchools();
    this.adminDetails();
    this.fetchAssessors()
    this.myForm = this.formBuilder.group({
      schoolName: ['', Validators.required],
      schoolCity: ['', Validators.required],
      contactName: ['', Validators.required],
      contactNo: ['', Validators.required],
      schoolEmail: ['', [Validators.required, Validators.email]],
      schoolType: ['', Validators.required],
      principalName: ['', Validators.required],
      principalContact: ['', Validators.required],
      principalEmail: ['', [Validators.required, Validators.email]],
      classesFrom: ['', Validators.required],
      classesTo: ['', Validators.required],
      totalStudents: ['', Validators.required],
      noOfBoys: ['', Validators.required],
      noOfGirls: ['', Validators.required],
    });
    this.myForm1 = this.formBuilder.group({
      name: ['', Validators.required],
      phNO: ['', Validators.required],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  customEmailValidator(control: AbstractControl): { [key: string]: any } | null {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const valid = emailPattern.test(control.value);
    return valid ? null : { invalidEmail: true };
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 4000,
    });
  }
  dialogRef!: MatDialogRef<any>;

  activity(clickdata: any) {
    if (clickdata) {
      this.isActivity = false;
      // this.fetchStudentsActivity()
      // this.SchoolDetails()
    } else {
      this.isActivity = true;
    }
  }
  // closeDialog(dialogRef: MatDialogRef<any>): void {
  //   dialogRef.afterClosed().subscribe(() => {
  //     this.myForm.reset();
  //     this.editMode = false;
  //   });
  // }
  openPopup(): void {
    this.isPopupOpen = true;
  }

  closePopup(): void {
    this.isPopupOpen = false;
  }

  openDialog() {
    // this.myForm.reset();
    this.dialogRef = this.dialog.open(this.formContent, {
    });
    this.dialogRef.afterClosed().subscribe(result => {
      this.myForm.reset();
      this.editMode = false
    });
  }
  editSchool(school: any): void {
    this.editMode = true;
    this.myForm.patchValue(school);
    this.currentSchool = school;
    this.openDialog()
    this.openSnackBar('Edit Mode', '')
  }
  editAssessor(assessor: any): void {
    this.editMode = true;
    this.myForm1.patchValue(assessor);
    this.currentAssessor = assessor;
    this.openDialog()
    this.openSnackBar('Edit Mode', '')
  }
  logout() {
    console.log('logout');
    const token = localStorage.clear();
    this.router.navigate(['/login']);
  }

  onSubmit() {
    // this.closeDialog(dialogRef)
    if (!this.myForm.valid) {
      this.openSnackBar('fill all the  required feilds', 'Close')
    }
    console.log(this.myForm.value, 'form');

    if (!this.editMode) {
      if (this.myForm.valid) {
        this.http.post(`${environment.apiUrl}/admin/school/create`, this.myForm.value)
          .subscribe((response) => {
            console.log(response)
            if (response) {
              this.openSnackBar('school created', 'Close')
              this.fetchSchools();
              this.myForm.reset();
            }
            if (!response) {
              this.openSnackBar('email exist', 'Close')
              this.myForm.reset();
            }
            if (response == null) {
              this.openSnackBar('school not created', 'Close')
              this.myForm.reset();
              this.fetchSchools();
              this.myForm.reset();
            }
          }, (error) => {
            console.log(error.error, 'error in creating school')
            this.openSnackBar(`error in creating school!`, 'Close');
            this.myForm.reset();
          });
      }
    }

    if (this.editMode) {
      if (this.myForm.valid) {
        // console.log(this.currentSchool)
        this.http.put(`${environment.apiUrl}/admin/school/edit/${this.currentSchool._id}`, this.myForm.value)
          .subscribe((response: any) => {
            console.log(response.message === 'edit data to update ')
            if (response.result.modifiedCount == 1 && response.message === 'edit data to update ') {
              this.openSnackBar('Edit any one feild at least', 'Close')
              // this.myForm.reset();
            } else {
              this.openSnackBar('school edited successfully', 'Close')
              this.fetchSchools()
              this.myForm.reset();
              this.editMode = false;
            }

          }, (error) => {
            console.log(error.error, 'error in creating school')
            this.openSnackBar('Somthing went wrong!', 'Close')
            this.myForm.reset();
          })
      }
    }
  }
  onSubmitOfAsssessor() {
    // this.closeDialog(dialogRef)
    if (!this.myForm1.valid) {
      this.openSnackBar('fill all the  required feilds', 'Close')
    }
    console.log(this.myForm1.value, 'form');

    if (!this.editMode) {
      if (this.myForm1.valid) {
        this.http.post(`${environment.apiUrl}/admin/assessor`, this.myForm1.value)
          .subscribe((response) => {
            console.log(response)
            if (response) {
              this.openSnackBar('Asssessor created', 'Close')
              this.fetchAssessors();
              this.myForm1.reset();
            }
            if (!response) {
              this.openSnackBar('email exist', 'Close')
              this.myForm1.reset();
            }
            if (response == null) {
              this.openSnackBar('Asssessor not created', 'Close')
              this.myForm1.reset();
              this.fetchSchools();
              this.myForm1.reset();
            }
          }, (error) => {
            console.log(error.error, 'error in creating Asssessor')
            this.openSnackBar(`error in creating Asssessor!`, 'Close');
            this.myForm1.reset();
          });
      }
    }

    if (this.editMode) {
      if (this.myForm1.valid) {
        // console.log(this.currentSchool)
        this.http.put(`${environment.apiUrl}/admin/asssessor/${this.currentAssessor._id}`, this.myForm1.value)
          .subscribe((response: any) => {
            console.log(response.message === 'edit data to update ')
            if (response.result.modifiedCount == 1 && response.message === 'edit data to update ') {
              this.openSnackBar('Edit any one feild at least', 'Close')
              // this.myForm1.reset();
            } else {
              this.openSnackBar('Asssessor edited successfully', 'Close')
              this.fetchAssessors()
              this.myForm1.reset();
              this.editMode = false;
            }

          }, (error) => {
            console.log(error.error, 'error in creating Asssessor')
            this.openSnackBar('Somthing went wrong!', 'Close')
            this.myForm1.reset();
          })
      }
    }
  }

  fetchSchools() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'admin') {
      this.router.navigate(['/login']);
    }
    this.http.get(`${environment.apiUrl}/admin/school`)
      .subscribe((response: any) => {
        this.schools = response;
        this.cdr.detectChanges();
      }, (error) => {
        console.log(error.error, 'error in creating school')
      })
  }

  fetchAssessors() {
    this.http.get(`${environment.apiUrl}/admin/assessor`)
      .subscribe((response: any) => {
        this.assessors = response;
        console.log(response);

        this.cdr.detectChanges();
      }, (error) => {
        console.log(error.error, 'error in creating school')
      })
  }



  deleteSchool(id: any): void {
    this.http.delete(`${environment.apiUrl}/admin/school/delete/${id}`)
      .subscribe((response: any) => {
        this.openSnackBar('school deleted successfully', 'Close')
        this.fetchSchools();
      }, (error) => {
        console.log(error.error, 'error in deleteing')
      })
  }
  deleteAssesor(id: any): void {
    this.http.delete(`${environment.apiUrl}/admin/assessor/${id}`)
      .subscribe((response: any) => {
        this.openSnackBar('Assessor deleted successfully', 'Close')
        this.fetchAssessors();
      }, (error) => {
        console.log(error.error, 'error in deleteing')
      })
  }

  adminDetails() {
    this.http.get(`${environment.apiUrl}/admin/`)
      .subscribe((response: any) => {
        this.email = response[0].email
        this.firstName = response[0].firstName
        this.lastName = response[0].lastName
        this.phoneNumber = response[0].phoneNumber
        // console.log(typeof (response[0]), 'siws')
      }, (error) => {
        console.log(error.error, 'error in creating admin')
      })
  }
}