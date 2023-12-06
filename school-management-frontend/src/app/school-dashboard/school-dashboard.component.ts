import { ChangeDetectionStrategy, NgZone, ChangeDetectorRef, Component, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions, Table } from 'pdfmake/interfaces';
import * as XLSX from 'xlsx';



(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-school-dashboard',
  templateUrl: './school-dashboard.component.html',
  styleUrls: ['./school-dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class SchoolDashboardComponent {
  @ViewChild('formContent', { read: TemplateRef }) formContent!: TemplateRef<any>;

  @ViewChild('schoolForm')
  admin: any = {};
  candidates: any[] = [];
  candidateActivities: any[] = [];
  isPopupOpen = false;
  myForm: FormGroup;
  editMode!: boolean;
  currentSchool: any;
  email: any;
  name: any;
  phoneNumber: any;
  showFiller = false;
  initialFormValues: any;
  selectedDate: any;
  isActivity: boolean = false;
  dateFormData: string = '';
  isLoading: boolean = false;
  schoolID: string = '';
  allTaskFeilds: any[] = [
    // "Name",
    // "ID",
    // "Gender",
    // "DOB",
    // "Age",
    // "Class",
    // "DominantSide",
    // "ParentName",
    // "ParentMobileNo",
    // "AlternateNo",
    // "ResidenceArea",
    // "ResidenceCity",
    // "SchoolName",
    // "SchoolID",
    // "SchoolContactName",
    // "SchoolContactNumber",
    // "SchoolContactEmailID",
    // "AssessmentTeam",
    // "AssessmentID",
    // "HeightCMs",
    "HeightRating",
    // "WeightKG",
    "WeightRating",
    // "BMI",
    "BmiRating",
    // "BodyFatPercentage",
    "BodyFatRating",
    // "ArmLengthCMs",
    "ArmLengthRating",
    // "LegLengthCMs",
    "LegLengthRating",
    // "SitAndReachCMs",
    "SitAndReachRating",
    // "SingleLegBalance",
    "SingleLegBalanceRating",
    // "PushUps",
    "PushUpsRating",
    // "GripStrengthKGs",
    "GripStrengthRating",
    // "SquatTest30Secs",
    "SquatTestRating",
    // "PlankSecs",
    "PlankRating",
    // "StandingLongJumpCMs",
    "StandingLongJumpRating",
    // "StandingVerticalJumpInches",
    "StandingVerticalJumpRating",
    // "FiveZeroFiveSecs",
    "FiveZeroFiveRating",
    // "Speed30MtrsSecs",
    "Speed30MtrsRating",
    // "SixHundredMtrsMins",
    "SixHundredMtrsRating",
    // "OneMileTest",
    "OneMileTestRating",
    "BearPositionHoldRating",
    "OverheadSquatsRating",
    "LungesRating",
    // "RemarksRemark1",
    // "RemarksRemark2",
    // "RemarksRemark3",
    // "createdAt",
    // "updatedAt",
    // "__v",
    // "AssessmentDate"
  ];
  selectedActivity: string = '';
  selectedRating: string = '';
  // count = 1
  ngOnInit() {
    // this.someAsyncOperation()
    this.SchoolDetails()
    // this.loadData()
    // this.fetchStudents();
    // this.fetchStudentsActivity()
    // this.openSpinner()
  }

  constructor(private zone: NgZone, private http: HttpClient, public dialog: MatDialog, private router: Router, private _snackBar: MatSnackBar, private formBuilder: FormBuilder, private cdr: ChangeDetectorRef) {
    this.myForm = this.formBuilder.group({
      candidateName: ['', Validators.required],
      schoolID: this.admin.schoolID,
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      age: ['', Validators.required],
      candidateClass: ['', Validators.required],
      dominantSide: ['', Validators.required],
      parentName: ['', Validators.required],
      parentMobileNo: ['', Validators.required],
      alternateNo: ['', Validators.required],
      email: ['', Validators.required],
      residenceArea: ['', Validators.required],
      residenceCity: ['', Validators.required],
      pastInjury: ['', Validators.required],
      presentInjury: ['', Validators.required],
    });
  }
  // someAsyncOperation() {
  //   this.zone.run(() => {
  // this.SchoolDetails();
  //   });
  // }
  SchoolDetails = () => {
    const email = localStorage.getItem('username');
    this.http.get(`${environment.apiUrl}/school/admin/${email}`)
      .subscribe((response: any) => {
        this.email = response.admin_login.email;
        this.name = response.admin_login.name;
        // this.phoneNumber = response.admin_login.phoneNumber
        // this.admin = response.admin_details
        // localStorage.setItem('schoolID', response.admin_details.schoolID)
        // this.admin = response.admin_details;
        localStorage.setItem('adminDetails', JSON.stringify(response.admin_details));
        this.fetchStudents();
        this.fetchStudentsActivity();
      }, (error) => {
        console.log(error.error, 'error in creating admin');
      });
  };

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
  activity(clickdata: any) {
    if (clickdata) {
      this.isActivity = false;
      // this.fetchStudentsActivity()
      // this.SchoolDetails()
    } else {
      this.isActivity = true;
    }
  }
  openPopup(): void {
    this.isPopupOpen = true;
  }

  closePopup(): void {
    this.isPopupOpen = false;
  }
  cancel() {
    this.myForm.reset();
    if (this.editMode) {
      this.editMode = false;
    }
  }
  logout() {
    // console.log('logout');
    const token = localStorage.clear();
    this.router.navigate(['/login']);
  }

  openDialog() {
    // this.openSpinner()
    const dialogRef = this.dialog.open(this.formContent, {
    });
    dialogRef.afterClosed().subscribe(result => {
      // this.closeSpinner()
      this.myForm.reset();
      this.editMode = false
    });
  }
  openSpinner() {
    this.isLoading = true;
    // console.log('open spinner');

  }
  closeSpinner() {
    this.isLoading = false;
    // console.log('close spinner');

  }
  onSubmit() {
    if (!this.myForm.valid) {
      this.openSnackBar('fill all the  required feilds', 'Close')
    }

    if (!this.editMode) {
      if (this.myForm.valid) {
        this.myForm.value.schoolID = this.admin.schoolID
        // this.openSpinner()
        this.http.post(`${environment.apiUrl}/school/student/create`, this.myForm.value)
          .subscribe((response: any) => {
            // this.closeSpinner()
            if (response.studentCreated) {
              this.openSnackBar('student created', 'Close')
              this.fetchStudents();
              this.myForm.reset();
            }
            if (!response.studentCreated) {
              this.openSnackBar(response.message, 'Close')
            }
          }, (error) => {
            console.log(error.error, 'error in creating student')
            this.openSnackBar(`error in creating student!`, 'Close');
            this.myForm.reset();
          });
      }
    }

    if (this.editMode) {
      if (this.myForm.valid) {
        if (JSON.stringify(this.myForm.value) === JSON.stringify(this.initialFormValues)) {
          this.openSnackBar('Edit any one feild at least', 'Close')
        } else {
          this.openSpinner()
          this.http.put(`${environment.apiUrl}/school/student/edit/${this.currentSchool._id}`, this.myForm.value)
            .subscribe((response: any) => {
              this.closeSpinner()
              if (response.modifiedCount == 1) {
                this.openSnackBar('student edited successfully', 'Close')
                this.myForm.reset();
                this.editMode = false;
                this.fetchStudents()
              }
              if (response.matchedCount == 1 && response.modifiedCount == 0) {
                this.openSnackBar('Edit any one feild at least', 'Close')
              }
            }, (error) => {
              console.log(error.error, 'error in creating student')
              this.openSnackBar('Somthing went wrong!', 'Close')
              this.myForm.reset();
            })
        }
      }
    }
  }

  fetchStudents() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'school') {
      this.router.navigate(['/login']);
    }
    this.admin = JSON.parse(localStorage.getItem('adminDetails') ?? '{}');
    this.http.get(`${environment.apiUrl}/school/student/${this.admin.schoolID}`)
      .subscribe((response: any) => {
        this.candidates = response;
        // console.log(this.candidates);
        this.cdr.detectChanges();
      }, (error) => {
        console.log(error.error, 'error in creating student')
      })
  }

  fetchStudentsByClassGender(classNumber: any, gender: any): any {
    try {
      if (classNumber != "" || gender != "") {
        classNumber = classNumber ? classNumber : undefined
        gender = gender ? gender : undefined

        this.admin = JSON.parse(localStorage.getItem('adminDetails') ?? '{}');
        this.http.get(`${environment.apiUrl}/school/student/${this.admin.schoolID}/${classNumber}/${gender}`)
          .subscribe((response: any) => {
            this.candidates = response;
            this.cdr.detectChanges();
          }, (error) => {
            console.log(error.error, 'error in getting student')
          })
      } else {
        this.openSnackBar("Both class and gender is empty", "close")
      }
    } catch (error) {
      console.log("something went wrong ");

    }
  }
  fetchStudentsActivity() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'school') {
      this.router.navigate(['/login']); 
    }
    this.admin = JSON.parse(localStorage.getItem('adminDetails') ?? '{}');
    this.http.get(`${environment.apiUrl}/student/activity/${this.admin.schoolID}`)
      .subscribe((response: any) => {
        this.candidateActivities = response;
        this.cdr.detectChanges();

      }, (error) => {
        console.log(error.error, 'error in creating student')
      })
  }
  saveCandidateAssinmentData(candidateActivity: any) {
    if (this.dateFormData == '') {
      this.openSnackBar('date is empty', 'Close')
      return 
    }

    this.http.put(`${environment.apiUrl}/student/activity/edit/${candidateActivity._id}`, { AssessmentDate: this.dateFormData })
      .subscribe((response: any) => {
        if (response.modifiedCount == 1) {
          this.fetchStudentsActivity()
          this.openSnackBar('date updated successfully', 'Close')
        }
      }, (error) => {
        console.log(error.error, 'error in updating activity date')
        this.openSnackBar('Somthing went wrong!', 'Close')
      })
  }

  editCandidate(school: any): void {
    this.editMode = true;
    this.myForm.patchValue(school);
    this.initialFormValues = this.myForm.value;
    this.currentSchool = school;
    this.openDialog()
    this.openSnackBar('Edit Mode', '')
  }

  deleteCandidate(id: any): void {
    this.http.delete(`${environment.apiUrl}/school/student/delete/${id}`)
      .subscribe((response: any) => {
        this.openSnackBar(' deleted successfully', 'Close')
        this.fetchStudents();
      }, (error) => {
        console.log(error.error, 'error in deleteing')
      })
  }
  onFilterClick() {
    try {
      if (this.selectedActivity && this.selectedRating) {
        this.admin = JSON.parse(localStorage.getItem('adminDetails') ?? '{}');
        this.http.get(`${environment.apiUrl}/student/activity/${this.admin.schoolID}/${this.selectedActivity}/${this.selectedRating}`)
          .subscribe((response: any) => {
            this.candidateActivities = response;
            this.cdr.detectChanges();
          }, (error) => {
            console.log(error.error, 'error in creating student')
          })
      } else {
        this.openSnackBar("Select filters", "Slose")
      }
    } catch (error) {

    }
  }
  // generatePDF() {
  //   // const data = this.candidateActivities
  //   type DataType = {
  //     [key: string]: any;
  //   };

  //   function excludeFields(obj: DataType, excludedFields: string[]): DataType {
  //     const newObj: DataType = {};
  //     for (const key in obj) {
  //       if (obj.hasOwnProperty(key) && !excludedFields.includes(key)) {
  //         newObj[key] = obj[key];
  //       }
  //     }
  //     return newObj;
  //   }

  //   const excludedFields: string[] = ['createdAt', 'updatedAt', '_id', '__v'];
  //   const newObject = excludeFields(data, excludedFields);

  //   const content: Content[] = [
  //     { text: (data.Name ? data.Name : '') + '  Activity Report', style: 'header' },
  //     { text: new Date().toLocaleString(), alignment: 'right' },
  //     this.createTable(newObject), // Pass newObject to createTable
  //   ];

  //   const documentDefinition: TDocumentDefinitions = {
  //     content: content,
  //     styles: {
  //       header: {
  //         fontSize: 18,
  //         bold: true,
  //         margin: [0, 0, 0, 10],
  //       },
  //     },
  //   };

  //   const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
  //   pdfDocGenerator.download(`${data.Name ? data.Name : ''}  Activity Report.pdf`);
  // }

  // private createTable(data: any): Content {
  //   const tableData: any[][] = [];
  //   for (const [key, value] of Object.entries(data)) {
  //     tableData.push([key, value]);
  //   }

  //   return { table: { body: tableData }, layout: 'lightHorizontalLines' } as Content;
  // }

  //   generatePDF() {
  //     const data = this.candidateActivities;
  //     const excludedFields: string[] = ['createdAt', 'updatedAt', '_id', '__v'];

  //     const content: Content[] = [
  //         { text: 'Activity Report', style: 'header' },
  //         { text: new Date().toLocaleString(), alignment: 'right' },
  //         this.createTable(data, excludedFields),
  //     ];

  //     const documentDefinition: TDocumentDefinitions = {
  //         content: content,
  //         styles: {
  //             header: {
  //                 fontSize: 18,
  //                 bold: true,
  //                 margin: [0, 0, 0, 10],
  //             },
  //         },
  //         pageOrientation: 'landscape',  // Set page orientation to landscape
  //     };

  //     const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
  //     pdfDocGenerator.download(`Activity Report.pdf`);
  // }

  // private createTable(data: any[], excludedFields: string[]): Content {
  //     const tableData: any[][] = [];

  //     // Assuming all objects in the array have the same structure
  //     const firstObject = data[0];
  //     const newObject = this.excludeFields(firstObject, excludedFields);

  //     // Table header
  //     tableData.push(Object.keys(newObject));

  //     // Table body
  //     data.forEach(item => {
  //         const row = Object.values(this.excludeFields(item, excludedFields));
  //         tableData.push(row);
  //     });

  //     return { table: { body: tableData, widths: 'auto' }, layout: 'lightHorizontalLines' } as Content;
  // }

  // private excludeFields(obj: any, excludedFields: string[]): any {
  //     const newObj: any = {};
  //     for (const key in obj) {
  //         if (obj.hasOwnProperty(key) && !excludedFields.includes(key)) {
  //             newObj[key] = obj[key];
  //         }
  //     }
  //     return newObj;
  // }

  generateActivityExcel() {
    const data = this.candidateActivities
    const excludedFields: string[] = ['createdAt', 'updatedAt', '_id', '__v'];

    const newData = data.map(item => this.excludeFields1(item, excludedFields));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Activity Report');
    XLSX.writeFile(wb, 'Activity Report.xlsx');
  }

  private excludeFields1(obj: any, excludedFields: string[]): any {
    const newObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && !excludedFields.includes(key)) {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }

  generateCandidatesExcel() {
    const data = this.candidates
    const excludedFields: string[] = ['createdAt', 'updatedAt', '_id', '__v'];

    const newData = data.map(item => this.excludeFields(item, excludedFields));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(newData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Student List');
    XLSX.writeFile(wb, 'Student List.xlsx');
  }

  private excludeFields(obj: any, excludedFields: string[]): any {
    const newObj: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key) && !excludedFields.includes(key)) {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  }

}
