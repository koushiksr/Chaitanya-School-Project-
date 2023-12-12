import { ChangeDetectionStrategy, ChangeDetectorRef, OnInit, AfterViewInit, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
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
import { Chart, ChartDataset, ChartOptions, ChartType } from 'chart.js/auto';
import 'chartjs-adapter-moment';


(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent implements AfterViewInit {
  @ViewChild('formContent', { read: TemplateRef }) formContent!: TemplateRef<any>;

  @ViewChild('schoolForm')
  admin: any;
  @ViewChild('myChart') private chartRef!: ElementRef;
  candidates: any[] = [];
  candidatesActivity: any[] = [];
  isPopupOpen = false;
  myForm: FormGroup;
  editMode!: boolean;
  currentSchool: any;
  email: any;
  name: any;
  phoneNumber: any;
  showFiller = false;
  initialFormValues: any;
  isActivity: boolean = false;
  isChartActive: boolean = false;
  myChart: any
  progressData: any;
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
    // "OneMileTestRating",
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

  // ngOnInit() {
  //   this.displayChart();
  // }

  ngAfterViewInit() {
    // this.displayChart();
  }

  constructor(private http: HttpClient, public dialog: MatDialog, private router: Router, private _snackBar: MatSnackBar, private formBuilder: FormBuilder, private cdr: ChangeDetectorRef) {
    this.SchoolDetails();
    // this.funa();

    this.myForm = this.formBuilder.group({
      // Name: ['', Validators.required],
      // ID: ['', Validators.required],
      // Gender: ['', Validators.required],
      // DOB: ['', Validators.required],
      // Age: ['', Validators.required],
      // Class: ['', Validators.required],
      // DominantSide: ['', Validators.required],
      // ParentName: ['', Validators.required],
      // ParentMobileNo: ['', Validators.required],
      // AlternateNo: ['', Validators.required],
      // Email: ['', Validators.required],
      // ResidenceArea: ['', Validators.required],
      // ResidenceCity: ['', Validators.required],
      // SchoolName: ['', Validators.required],
      // SchoolID: ['', Validators.required],
      // SchoolContactName: ['', Validators.required],
      // SchoolContactNumber: ['', Validators.required],
      // SchoolContactEmailID: ['', Validators.required],
      // AssessmentTeam: ['', Validators.required],
      AssessmentDate: ['', Validators.required],
      // AssessmentID: ['', Validators.required],
      // HeightCMs: ['', Validators.required],
      // HeightRating: ['', Validators.required],
      // WeightKG: ['', Validators.required],
      // WeightRating: ['', Validators.required],
      // BMI: ['', Validators.required],
      // BmiRating: ['', Validators.required],
      // BodyFatPercentage: ['', Validators.required],
      // BodyFatRating: ['', Validators.required],
      // ArmLengthCMs: ['', Validators.required],
      // ArmLengthRating: ['', Validators.required],
      // LegLengthCMs: ['', Validators.required],
      // LegLengthRating: ['', Validators.required],
      // SitAndReachCMs: ['', Validators.required],
      // SitAndReachRating: ['', Validators.required],
      // SingleLegBalance: ['', Validators.required],
      // SingleLegBalanceRating: ['', Validators.required],
      // PushUps: ['', Validators.required],
      // PushUpsRating: ['', Validators.required],
      // GripStrengthKGs: ['', Validators.required],
      // GripStrengthRating: ['', Validators.required],
      // SquatTest30Secs: ['', Validators.required],
      // SquatTestRating: ['', Validators.required],
      // PlankSecs: ['', Validators.required],
      // PlankRating: ['', Validators.required],
      // StandingLongJumpCMs: ['', Validators.required],
      // StandingLongJumpRating: ['', Validators.required],
      // StandingVerticalJumpInches: ['', Validators.required],
      // StandingVerticalJumpRating: ['', Validators.required],
      // FiveZeroFiveSecs: ['', Validators.required],
      // FiveZeroFiveRating: ['', Validators.required],
      // Speed30MtrsSecs: ['', Validators.required],
      // Speed30MtrsRating: ['', Validators.required],
      // SixHundredMtrsMins: ['', Validators.required],
      // SixHundredMtrsRating: ['', Validators.required],
      // OneMileTest: ['', Validators.required],
      // OneMileTestRating: ['', Validators.required],
      // BearPositionHoldRating: ['', Validators.required],
      // OverheadSquatsRating: ['', Validators.required],
      // LungesRating: ['', Validators.required],
      // RemarksRemark1: ['', Validators.required],
      // RemarksRemark2: ['', Validators.required],
      // RemarksRemark3: ['', Validators.required],
    });
  }
  SchoolDetails = () => {
    const email = localStorage.getItem('username')
    this.http.get(`${environment.apiUrl}/student/admin/${email}`)
      .subscribe((response: any) => {
        localStorage.setItem('candidateID', response[0].candidateID)
        localStorage.setItem('schoolID', response[0].schoolID)
        // console.log(response[0]);

        this.admin = response[0]
        this.email = response[0].email
        this.name = response[0].name
        this.phoneNumber = response[0].phoneNumber
        this.fetchAllActivites();
      }, (error) => {
        console.log(error.error, 'error in creating admin')
      })
  }
  onFilterClick() {
    if (this.myChart) {
      this.myChart.destroy();
    }
    if (!this.selectedActivity) {
      this.openSnackBar("select any one assesment", "Close")
      return
    }
    // this.displayChart()
    const candidateID = localStorage.getItem('candidateID')
    const SchoolID = localStorage.getItem("schoolID")
    this.http.get(`${environment.apiUrl}/student/activity/progress/${SchoolID}/${candidateID}/${this.selectedActivity}`)
      .subscribe((response: any) => {
        this.progressData = response.map((obj: ArrayLike<unknown> | { [s: string]: unknown; }) => Object.values(obj)[1]);
        const average = this.progressData.filter((value: string) => value === "Average").length / this.progressData.length;
        let replacedData
        if (this.progressData.every((value: any) => typeof value === "number")) {
          replacedData = this.progressData
        } else {
          replacedData = this.progressData.map((value: string) =>
            value === "Above Average" ? average > 2 ? 3 : 2 : value === "Below Average" && average < 2 ? 1 : 2
          );
        }

        console.log(replacedData, this.progressData);
        let bValues = response.map((item: { createdAt: any; }) => item.createdAt.slice(0, 10));
        const data: ChartDataset[] = [
          { data: replacedData.reverse(), label: this.selectedActivity || 'Dataset 1' },
          // { data: [28, 48, 40, 19], label: 'Dataset 2' },
          // { data: [45, 25, 16, 36], label: 'Dataset 3' },
          // { data: [12, 30, 50, 65], label: 'Dataset 4' }
        ];
        // console.log(this.progressData);

        const options: ChartOptions = {
          // Your chart options go here
        };

        // Create the chart
        const ctx = this.chartRef.nativeElement.getContext('2d');
        this.myChart = new Chart(ctx, {
          type: 'bar',
          // type: 'line',
          //
          // type: 'polarArea',
          // type: 'pie',
          // type: 'doughnut',
          // type: 'radar',

          data: {
            labels: bValues.reverse(),
            datasets: data,
          },
          options: options,
        });
      }, (error) => {
        console.log(error.error, 'error in creating student')
      })
  }
  isChartActiveFun() {
    this.isChartActive = true
  }
  // displayChart() {
  //   console.log(this.progressData);

  //   const data: ChartDataset[] = [
  //     { data: this.progressData, label: this.selectedActivity || 'Dataset 1' },
  //     // { data: [28, 48, 40, 19], label: 'Dataset 2' },
  //     // { data: [45, 25, 16, 36], label: 'Dataset 3' },
  //     // { data: [12, 30, 50, 65], label: 'Dataset 4' }
  //   ];

  //   const options: ChartOptions = {
  //     // Your chart options go here
  //   };

  //   // Create the chart
  //   const ctx = this.chartRef.nativeElement.getContext('2d');
  //   this.myChart = new Chart(ctx, {
  //     // type: 'bar',
  //     type: 'line',
  //     //
  //     // type: 'polarArea',
  //     // type: 'pie',
  //     // type: 'doughnut',
  //     // type: 'radar',

  //     data: {
  //       labels: ['Category 1', 'Category 2', 'Category 3', 'Category 4'],
  //       datasets: data,
  //     },
  //     options: options,
  //   });
  // }
  destroyChart() {
    this.isChartActive = false
    if (this.myChart) {
      this.myChart.destroy();
    }
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
  activity(clickdata: any) {
    if (clickdata) {
      this.isActivity = false;
    } else {
      this.isActivity = true;
    }
  }
  openPopup(): void {
    this.isPopupOpen = true;
  }
  // openChartDilog() {
  //   if (this.isChartActive == false) {
  //     this.isChartActive = true
  //     this.displayChart()
  //   } else {
  //     this.destroyChart()
  //     this.isChartActive = false
  //   }
  // }

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
    console.log('logout');
    const token = localStorage.clear();
    this.router.navigate(['/login']);
  }

  openDialog() {
    const dialogRef = this.dialog.open(this.formContent, {
      width: '31vh',
      height: '23.1vh'
    });
    dialogRef.afterClosed().subscribe(result => {
      this.myForm.reset();
      this.editMode = false
    });
  }
  onSubmit() {
    if (!this.myForm.valid) {
      this.openSnackBar('fill all the  required feilds', 'Close')
    }

    if (!this.editMode) {
      if (this.myForm.valid) {
        const candidateID = localStorage.getItem("candidateID")
        const schoolID = localStorage.getItem("schoolID")
        console.log(candidateID, schoolID);

        this.http.post(`${environment.apiUrl}/student/activity/create`, { formData: this.myForm.value, schoolID, candidateID })
          .subscribe((response) => {
            if (response) {
              this.openSnackBar('activity initiated', 'Close')
              this.fetchAllActivites();
              this.myForm.reset();
            }
            if (!response) {
              this.openSnackBar('email exist', 'Close')
            }
            if (response == null) {
              this.openSnackBar('student not created', 'Close')
              this.myForm.reset();
              this.fetchAllActivites();
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
          this.http.put(`${environment.apiUrl}/student/activity/edit/${this.currentSchool._id}`, this.myForm.value)
            .subscribe((response: any) => {
              if (response.modifiedCount == 1) {
                this.openSnackBar('student edited successfully', 'Close')
                this.myForm.reset();
                this.editMode = false;
                this.fetchAllActivites()
              }
              if (response.matchedCount == 1 && response.modifiedCount == 0) {
                this.openSnackBar('Edit any one feild at least', 'Close')
                // this.myForm.reset();
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

  fetchAllActivites() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'student') {
      this.router.navigate(['/login']);
    }
    const schoolID = localStorage.getItem('schoolID')
    const candidateID = localStorage.getItem('candidateID')
    this.http.get(`${environment.apiUrl}/student/activity/${schoolID}/${candidateID}`)
      .subscribe((response: any) => {
        this.candidatesActivity = response;
        // this.generatePDF(response);
      }, (error) => {
        console.log(error.error, 'error in creating student')
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
    this.http.delete(`${environment.apiUrl}/student/activity/delete/${id}`)
      .subscribe((response: any) => {
        this.openSnackBar(' deleted successfully', 'Close')
        this.fetchAllActivites();
      }, (error) => {
        console.log(error.error, 'error in deleteing')
      })
  }


  generatePDF(data: any) {
    type DataType = {
      [key: string]: any;
    };

    function excludeFields(obj: DataType, excludedFields: string[]): DataType {
      const newObj: DataType = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key) && !excludedFields.includes(key)) {
          newObj[key] = obj[key];
        }
      }
      return newObj;
    }

    const excludedFields: string[] = ['createdAt', 'updatedAt', '_id', '__v'];
    const newObject = excludeFields(data, excludedFields);

    const content: Content[] = [
      { text: (data.Name ? data.Name : '') + '  Activity Report', style: 'header' },
      { text: new Date().toLocaleString(), alignment: 'right' },
      this.createTable(newObject), // Pass newObject to createTable
    ];

    const documentDefinition: TDocumentDefinitions = {
      content: content,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };

    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    pdfDocGenerator.download(`${data.Name ? data.Name : ''}  Activity Report.pdf`);
  }

  private createTable(data: any): Content {
    const tableData: any[][] = [];
    for (const [key, value] of Object.entries(data)) {
      tableData.push([key, value]);
    }

    return { table: { body: tableData }, layout: 'lightHorizontalLines' } as Content;
  }


















}



function displayChart() {
  throw new Error('Function not implemented.');
}

