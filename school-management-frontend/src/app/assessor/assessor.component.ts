import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Content, TDocumentDefinitions } from 'pdfmake/interfaces';
import 'chartjs-adapter-moment';
import * as XLSX from 'xlsx';
import { StandardFonts, error } from 'pdf-lib';
// import { MatLine } from '@angular/material/core';
const { PDFDocument, rgb } = require('pdf-lib');

@Component({
  selector: 'app-assessor',
  templateUrl: './assessor.component.html',
  styleUrl: './assessor.component.scss'
})
export class AssessorComponent {
  @ViewChild('formContent', { read: TemplateRef }) formContent!: TemplateRef<any>;
  @ViewChild('schoolForm')
  admin: any;
  @ViewChild('myChart') private chartRef!: ElementRef;
  @ViewChild('pdfViewer') pdfViewer: ElementRef | undefined;

  candidates: any[] = [];
  candidatesActivity: any[] = [];
  isPopupOpen = false;
  myForm: FormGroup;
  editMode!: boolean;
  currentActivity: any;
  email: any;
  name: any;
  phoneNumber: any;
  showFiller = false;
  initialFormValues: any;
  isActivity: boolean = false;
  isChartActive: boolean = false;
  myChart: any
  progressData: any;
  dateFormData: string = '';
  allSchools: any
  allStudents: any
  constructor(private http: HttpClient, public dialog: MatDialog, private router: Router, private _snackBar: MatSnackBar, private formBuilder: FormBuilder, private cdr: ChangeDetectorRef) {
    this.fetchAllActivites()
    this.fetchSchoolsAndStudents()

    this.myForm = this.formBuilder.group({
      // Name: ['', Validators.required],
      // Gender: ['', Validators.required],
      // DOB: ['', Validators.required],
      // Age: ['', Validators.required],
      // Class: ['', Validators.required],
      // DominantSide: ['', Validators.required],
      // ParentName: ['', Validators.required],
      // ParentMobileNo: ['', Validators.required],
      // AlternateNo: ['', Validators.required],
      // Email: ['', Validators.required],47
      // ResidenceArea: ['', Validators.required],
      // ResidenceCity: ['', Validators.required],
      // SchoolName: ['', Validators.required],
      // SchoolContactName: ['', Validators.required],
      // SchoolContactNumber: ['', Validators.required],
      // SchoolContactEmailID: ['', Validators.required],
      ID: ['', Validators.required],
      SchoolID: ['', Validators.required],
      AssessmentTeam: ['', Validators.required],
      AssessmentDate: ['', Validators.required],
      AssessmentID: ['', Validators.required],
      HeightCMs: ['', [Validators.required]],
      HeightRating: ['', [Validators.required]],
      HeightComment: ['', [Validators.required]],
      WeightKG: ['', [Validators.required]],
      WeightRating: ['', [Validators.required]],
      WeightComment: ['', [Validators.required]],
      BMI: ['', [Validators.required]],
      BmiRating: ['', [Validators.required]],
      BMIComment: ['', [Validators.required]],
      BodyFatPercentage: ['', [Validators.required]],
      BodyFatRating: ['', [Validators.required]],
      BodyFatComment: ['', [Validators.required]],
      ArmLengthCMs: ['', [Validators.required]],
      ArmLengthRating: ['', [Validators.required]],
      ArmLengthComment: ['', [Validators.required]],
      LegLengthCMs: ['', [Validators.required]],
      LegLengthRating: ['', [Validators.required]],
      LegLengthComment: ['', [Validators.required]],
      SitAndReachCMs: ['', [Validators.required]],
      SitAndReachRating: ['', [Validators.required]],
      SitAndReachComment: ['', [Validators.required]],
      SingleLegBalance: ['', [Validators.required]],
      SingleLegBalanceRating: ['', [Validators.required]],
      SingleLegBalanceComment: ['', [Validators.required]],
      PushUps: ['', [Validators.required]],
      PushUpsRating: ['', [Validators.required]],
      PushUpsComment: ['', [Validators.required]],
      GripStrengthKGs: ['', [Validators.required]],
      GripStrengthRating: ['', [Validators.required]],
      GripStrengthComment: ['', [Validators.required]],
      SquatTest30Secs: ['', [Validators.required]],
      SquatTestRating: ['', [Validators.required]],
      SquatTestComment: ['', [Validators.required]],
      PlankSecs: ['', [Validators.required]],
      PlankRating: ['', [Validators.required]],
      PlankComment: ['', [Validators.required]],
      StandingLongJumpCMs: ['', [Validators.required]],
      StandingLongJumpRating: ['', [Validators.required]],
      StandingLongJumpComment: ['', [Validators.required]],
      StandingVerticalJumpInches: ['', [Validators.required]],
      StandingVerticalJumpRating: ['', [Validators.required]],
      StandingVerticalJumpComment: ['', [Validators.required]],
      FiveZeroFiveSecs: ['', [Validators.required]],
      FiveZeroFiveRating: ['', [Validators.required]],
      FiveZeroFiveComment: ['', [Validators.required]],
      Speed30MtrsSecs: ['', [Validators.required]],
      Speed30MtrsRating: ['', [Validators.required]],
      Speed30MtrsComment: ['', [Validators.required]],
      SixHundredMtrsMins: ['', [Validators.required]],
      SixHundredMtrsRating: ['', [Validators.required]],
      SixHundredMtrsComment: ['', [Validators.required]],
      // OneMileTest: ['', [Validators.required]],
      // OneMileTestRating: ['', [Validators.required]],
      // OneMileTestComment: ['', [Validators.required]],
      BearPositionHold: ['', [Validators.required]],
      BearPositionHoldRating: ['', [Validators.required]],
      BearPositionHoldComment: ['', [Validators.required]],
      OverheadSquats: ['', [Validators.required]],
      OverheadSquatsRating: ['', [Validators.required]],
      OverheadSquatsComment: ['', [Validators.required]],
      LungesTest: ['', [Validators.required]],
      LungesRating: ['', [Validators.required]],
      LungesComment: ['', [Validators.required]],
      RemarksRemark1: ['', [Validators.required]],
      RemarksRemark2: ['', [Validators.required]],
      RemarksRemark3: ['', [Validators.required]],
    });
  }
  insertDataIntoPDF = async (assessment: any, download: boolean) => {
    try {
      const cm_coord = 28.34645669291339;
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf';
      fileInput.addEventListener('change', async () => {
        const file = fileInput.files?.[0];
        if (file) {
          const existingPdfBytes = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(existingPdfBytes);
          if (!pdfDoc) {
            console.log('PDF document not loaded.');
            return;
          }
          //helper functions
          const drawInnerBar = async (
            page2: {
              drawRectangle: (arg0: { x: any; y: any; width: any; height: any; color: any; borderColor: any; borderRadius: any }) => void;
              drawText: (arg0: any, arg1: { x: any; y: any; font: any; size: number; color: any; textAlign: any; }) => any;
              embedFont: (arg0: any) => any;
            },
            x: number,
            y: number,
            width: number,
            height: number,
            color: any,
            // label?: string,
            // labelSuffix?: string
          ) => {
            page2.drawRectangle({
              x,
              y,
              width,
              height,
              color,
              borderColor: rgb(0, 0, 0),
              borderRadius: 8,
            });
          }
          const drawRoundedRectangle = async (label: any, page2: { drawText: (arg0: any, arg1: { x: any; y: any; font: any; size: number; color: any; textAlign: any; }) => any; drawLine: (arg0: { start: { x: number; y: any; } | { x: number; y: any; } | { x: number; y: any; } | { x: number; y: any; }; end: { x: number; y: number; } | { x: number; y: number; } | { x: number; y: number; } | { x: number; y: number; }; thickness: number; color: any; }) => void; }, x: number, y: number, width: number, height: number, borderRadius: number, color: any, val: any, labelSuffix?: any) => {
            const step = 0.2;
            const radius = borderRadius;

            for (let angle = 0; angle < 90; angle += step) {
              const x1 = x + width - radius + radius * Math.cos((angle * Math.PI) / 180);
              const y1 = y + height - radius + radius * Math.sin((angle * Math.PI) / 180);
              page2.drawLine({ start: { x: x1, y: y + height }, end: { x: x1, y: y1 }, thickness: 0, color });
            }

            for (let angle = 90; angle < 180; angle += step) {
              const x1 = x + radius - radius * Math.cos(((angle - 90) * Math.PI) / 180);
              const y1 = y + height - radius + radius * Math.sin(((angle - 90) * Math.PI) / 180);
              page2.drawLine({ start: { x: x1, y: y + height }, end: { x: x1, y: y1 }, thickness: 0, color });
            }

            for (let angle = 180; angle < 270; angle += step) {
              const x1 = x + radius - radius * Math.cos(((angle - 180) * Math.PI) / 180);
              const y1 = y + radius - radius * Math.sin(((angle - 180) * Math.PI) / 180);
              page2.drawLine({ start: { x: x1, y: y }, end: { x: x1, y: y1 }, thickness: 0, color });
            }

            for (let angle = 270; angle < 360; angle += step) {
              const x1 = x + width - radius + radius * Math.cos(((angle - 270) * Math.PI) / 180);
              const y1 = y + radius - radius * Math.sin(((angle - 270) * Math.PI) / 180);
              page2.drawLine({ start: { x: x1, y: y }, end: { x: x1, y: y1 }, thickness: 0, color });
            }
            await page2.drawText(label, { x: ((x) + width / 2) - 40, y: (y - 3.7) + height / 2, font: undefined, size: 12, color: rgb(0, 0, 0), textAlign: 'center' });
            return label
          }
          const ProgressBar = async (x: number, y: number, valdummy: string, label: string, labelSuffix?: string) => {
            const progressBarX = cm_coord * x
            const progressBarY = cm_coord * (y - 0.5);
            const progressBarHeight = 20;
            const progressBarBorderRadius = 10;
            let innerBarColor = rgb(1, 0, 0)
            valdummy = ""
            let val = 33
            if (typeof label == "number") {
              val = parseInt(label)
              innerBarColor = rgb(0, (val / 100), 0)
              label = label + " " + "th Percentile"
              if (val >= 66) {
                innerBarColor = rgb(0, 1, 0.14)
              }
              if (val <= 66) {
                innerBarColor = rgb(1, 0.55, 0)
              }
              if (val <= 33) {
                innerBarColor = rgb(1, 0, 0)
              }
            }
            else {
              if (label.toLowerCase() === "Above Average".toLowerCase()) {
                innerBarColor = rgb(0, 1, 0.14)
                val = 90
              }
              if (label.toLowerCase() === "Average".toLowerCase()) {
                innerBarColor = rgb(1, 0.55, 0)
                val = 55
              }
              if (label.toLowerCase() === "Below Average".toLowerCase()) {
                innerBarColor = rgb(1, 0, 0)
                val = 25
              }
            }

            const totalVal = 100
            drawInnerBar(currentPage, progressBarX, progressBarY, totalVal, progressBarHeight, rgb(0.33, 0.33, 0.33));
            drawInnerBar(currentPage, progressBarX, progressBarY, val, progressBarHeight, innerBarColor);
            return await drawRoundedRectangle(label, currentPage, progressBarX, progressBarY, totalVal, progressBarHeight, progressBarBorderRadius, rgb(1, 1, 1), val, labelSuffix);
          }
          const insertText = async (Name: string, x: any, y: any, color: any, size?: number, font?: any) => {
            if (font == undefined) {
              font = StandardFonts.Helvetica
            }
            // console.log(font);
            const NameOptions = { font: await pdfDoc.embedFont(font), size: size, color: color, fillOpacity: 0.1 };//Helvetica
            currentPage.drawText(Name, { x: cm_coord * x, y: cm_coord * (y - 0.5), ...NameOptions });
          }
          // const StatusDecider = (val: number, totalVal: number) => {
          //   let label
          //   if (val > totalVal && val < 2 * totalVal) {
          //     let currentVal = totalVal - val * (-1)
          //     if (currentVal <= 33.33) {
          //       label = "below"
          //     }
          //     if (currentVal >= 33.33 && currentVal <= 66.66) {
          //       label = "Average"
          //     }
          //     if (currentVal >= 66.66) {
          //       label = "Average"
          //     }
          //   }
          //   return label
          // }
          //  helper functions end
          //------------------------------------writting text and inserting bar--------------------------//
          ///page 2
          let currentPage = pdfDoc.getPage(1);
          assessment.Name.length > 16 && (assessment.Name = assessment.Name.slice(0, 17) + "...")
          assessment.SchoolName.length > 14 && (assessment.SchoolName = assessment.SchoolName.slice(0, 15) + "...")
          await insertText(assessment.Name, 12.6747, 21.1083, rgb(1, 1, 1), 16, StandardFonts.HelveticaBold)
          await insertText(`${assessment.Age} Years`, 12.218, 20, rgb(1, 1, 1), 16, StandardFonts.HelveticaBold)
          await insertText(assessment.Gender, 13.0752, 19, rgb(1, 1, 1), 16, StandardFonts.HelveticaBold)
          await insertText(assessment.SchoolName, 12.9514, 18, rgb(1, 1, 1), 16, StandardFonts.HelveticaBold)
          await insertText(assessment.AssessmentDate + "", 13.7425, 17.1, rgb(1, 1, 1), 16, StandardFonts.HelveticaBold)
          await insertText(assessment.ID, 11.636, 16.1395, rgb(1, 1, 1), 16, StandardFonts.HelveticaBold)

          //page3
          currentPage = pdfDoc.getPage(2);
          await insertText(assessment.HeightCMs, 8.5, 21.696, rgb(0, 0.69, 1), 16, StandardFonts.HelveticaBold)
          await insertText(assessment.WeightKG, 8.5, 20.396, rgb(0, 0.69, 1), 16, StandardFonts.HelveticaBold)
          await insertText(assessment.BMI, 8.5, 19.096, rgb(0, 0.69, 1), 16, StandardFonts.HelveticaBold)
          await insertText(assessment.BodyFatPercentage, 8.5, 17.6, rgb(0, 0.69, 1), 16, StandardFonts.HelveticaBold)
          await insertText(assessment.ArmLengthCMs, 8.5, 16.196, rgb(0, 0.69, 1), 16, StandardFonts.HelveticaBold)
          await insertText(assessment.LegLengthCMs, 8.5, 14.9, rgb(0, 0.69, 1), 16, StandardFonts.HelveticaBold)

          ProgressBar(15.1275, 21.4815, assessment.HeightCMs, assessment.HeightRating)
          ProgressBar(15.1275, 20.1449, assessment.WeightKG, assessment.WeightRating)
          ProgressBar(15.1275, 18.8198, assessment.BMI, assessment.BmiRating)
          ProgressBar(15.1275, 17.4719, assessment.BodyFatPercentage, assessment.BodyFatRating)
          ProgressBar(15.1275, 16.1503, assessment.ArmLengthCMs, assessment.ArmLengthRating)
          ProgressBar(15.1275, 14.9153, assessment.LegLengthCMs, assessment.LegLengthRating)

          //page 4
          let font = 11; let y = 13.77; let x = 1.4324
          let fontHeadingVal = 16
          let color = rgb(0, 0.69, 1)//undefined/
          currentPage = pdfDoc.getPage(3);
          await insertText(assessment.SitAndReachCMs, 8.9159, 20.4613, rgb(0, 0.69, 1), fontHeadingVal, StandardFonts.HelveticaBold)
          let status = await ProgressBar(16, 20.2698, assessment.SitAndReachCMs, assessment.SitAndReachRating)
          let text1 = "The above average results on the test show optimal flexibility."
          let text2 = "An Average result indicates appropriate flexibility."
          let text3 = "A below-average /5th Percentile result on the Sit and Reach Test suggests limited flexibility in the "
          let text4 = "lower back and hamstrings. This may impact daily movements and increase the risk of injuries."
          await insertText(text1, x, y, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text2, x, y = y - 0.48, (status == "Average") ? color : undefined, font, (status == "Average") ? StandardFonts.Helvetica : undefined)//46 px
          await insertText(text3, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text4, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)

          //page 6
          currentPage = pdfDoc.getPage(5);
          await insertText(assessment.SingleLegBalance, 8.9159, 23.2641, rgb(0, 0.69, 1), fontHeadingVal, StandardFonts.HelveticaBold)
          status = await ProgressBar(16, 23.1, assessment.SingleLegBalance, assessment.SingleLegBalanceRating)
          x = x + 0.2; y = 16.07
          text1 = "An Above Average balance indicates an athlete's excellent ability to maintain a state of equilibrium (balance) in"
          text2 = "a static position."
          text3 = "An Average result indicates appropriate balance and stability."
          text4 = "A below-average result on the Single Leg Balance Test indicates potential balance and stability issues."
          // let text5 = "issues."
          await insertText(text1, x, y, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text2, x, y = y - 0.51, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)//46 px
          await insertText(text3, x, y = y - 0.51, (status == "Average") ? color : undefined, font, (status == "Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text4, x, y = y - 0.51, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)

          //page 8
          currentPage = pdfDoc.getPage(7);
          await insertText(assessment.PushUps, 9.4, 23, rgb(0, 0.69, 1), fontHeadingVal, StandardFonts.HelveticaBold)
          status = await ProgressBar(16, 22.8726, assessment.PushUps, assessment.PushUpsRating)
          x = x - 0.2; y = 14.5
          text1 = "Above average results suggests excellent upper body strength and power."
          text2 = "An Average result shows appropriate upper body strength."
          text3 = "Below Average result suggests potential weakness in upper body strength and power. This could impact"
          text4 = "their ability to perform tasks that require pushing or lifting, such as lifting objects, pushing doors, or"
          let text5 = "participating in sports."
          await insertText(text1, x, y, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text2, x, y = y - 0.48, (status == "Average") ? color : undefined, font, (status == "Average") ? StandardFonts.Helvetica : undefined)//46 px
          await insertText(text3, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text4, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text5, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          //page 10

          currentPage = pdfDoc.getPage(9);
          await insertText(assessment.GripStrengthKGs, 9.7, 24, rgb(0, 0.69, 1), fontHeadingVal, StandardFonts.HelveticaBold)
          status = await ProgressBar(16, 23.8726, assessment.GripStrengthKGs, assessment.GripStrengthRating)
          x = x + 0.2; y = 16.7
          text1 = "Above-average results indicate excellent strength in wrist and forearm muscles."
          text2 = "An Average/Normal grip strength indicates appropriate strength in hand and forearm muscles."
          text3 = "A below-average result can indicate muscle imbalances in the hand and forearm. These imbalances can"
          text4 = "lead to poor coordination and may contribute to overuse injuries in the upper extremities."
          await insertText(text1, x, y, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text2, x, y = y - 0.51, (status == "Average") ? color : undefined, font, (status == "Average") ? StandardFonts.Helvetica : undefined)//46 px
          await insertText(text3, x, y = y - 0.51, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text4, x, y = y - 0.51, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          //page 11
          currentPage = pdfDoc.getPage(10);
          await insertText(assessment.PlankSecs, 9.1, 23.0641, rgb(0, 0.69, 1), fontHeadingVal, StandardFonts.HelveticaBold)
          status = await ProgressBar(16, 22.8326, assessment.PlankSecs, assessment.PlankRating)
          y = 16
          text1 = "Above Average result shows excellent core strength and endurance."
          text2 = "An Average result indicates appropriate core strength and endurance."
          text3 = "A below-average/needs improvement result on the Plank Test suggests potential weaknesses in core"
          text4 = "strength and endurance."
          await insertText(text1, x, y, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text2, x, y = y - 0.48, (status == "Average") ? color : undefined, font, (status == "Average") ? StandardFonts.Helvetica : undefined)//46 px
          await insertText(text3, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text4, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          //page 12
          currentPage = pdfDoc.getPage(11);
          await insertText(assessment.StandingLongJumpCMs, 9.4, 23.2641, rgb(0, 0.69, 1), fontHeadingVal, StandardFonts.HelveticaBold)
          status = await ProgressBar(16, 23.0826, assessment.StandingLongJumpCMs, assessment.StandingLongJumpRating)
          x = x - 0.5; y = 17.3
          text1 = "Above Average result on the Standing Long Jump Test suggests excellent lower body power and"
          text2 = "explosiveness."
          text3 = "The average result on the Standing Long Jump Test suggests appropriate lower body power and"
          text4 = "explosiveness. "
          text5 = "Below Average result on the Standing Long Jump Test suggests potential limitations in lower body"
          let text6 = "power and explosiveness. This can impact their ability to generate explosive force from the legs, which is"
          let text7 = "important for activities like sprinting, jumping, and sports that require quick bursts of speed and agility."
          let text8 = "It's important to consider how this deficiency may affect their athletic abilities and overall fitness. "
          await insertText(text1, x, y, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text2, x, y = y - 0.48, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)//46 px
          await insertText(text3, x, y = y - 1, (status == "Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text4, x, y = y - 0.48, (status == "Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text5, x, y = y - 1, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text6, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text7, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text8, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          //page 14
          currentPage = pdfDoc.getPage(13);
          await insertText(assessment.StandingVerticalJumpInches, 9.7, 24.2, rgb(0, 0.69, 1), fontHeadingVal, StandardFonts.HelveticaBold)
          status = await ProgressBar(16, 24, assessment.StandingVerticalJumpInches, assessment.StandingVerticalJumpRating)
          x = x + 0.2; y = 19.5
          text1 = "Above Average vertical jump suggests excellent lower body power and explosiveness."
          text2 = "An Average vertical jump suggests that the individual has appropriate lower body power and"
          text3 = "explosiveness."
          text4 = "A below-average vertical jump suggests that the individual may have limitations in lower body power. "
          text5 = "This can affect their ability to generate explosive force from the legs, which is crucial for sports like"
          text6 = "basketball, volleyball, and soccer. Poor lower body power can impact an individual's performance in"
          text7 = "activities that involve jumping, sprinting, and quick changes in direction. It's important to consider how"
          text8 = "this deficiency may affect their athletic abilities and overall fitness."
          await insertText(text1, x, y, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text2, x, y = y - 0.8, (status == "Average") ? color : undefined, font, (status == "Average") ? StandardFonts.Helvetica : undefined)//46 px
          await insertText(text3, x, y = y - 0.48, (status == "Average") ? color : undefined, font, (status == "Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text4, x, y = y - 0.52, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text5, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text6, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text7, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text8, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          //page 16
          currentPage = pdfDoc.getPage(15);
          await insertText(assessment.FiveZeroFiveSecs, 8.9159, 23.2641, rgb(0, 0.69, 1), fontHeadingVal, StandardFonts.HelveticaBold)
          status = await ProgressBar(16, 23.1, assessment.FiveZeroFiveSecs, assessment.FiveZeroFiveRating)
          x = x + 0.3; y = 17.9
          text1 = "Above-average/Excellent result suggests excellent agility."
          text2 = "An Average result shows an appropriate agility."
          text3 = "A below-average result indicates that the individual may have limitations in agility, which can affect their"
          text4 = "ability to change direction rapidly while maintaining balance and control. "
          text5 = "This deficiency can impact performance in sports and activities that require quick movements. "
          await insertText(text1, x, y, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text2, x, y = y - 0.48, (status == "Average") ? color : undefined, font, (status == "Average") ? StandardFonts.Helvetica : undefined)//46 px
          await insertText(text3, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text4, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text5, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          //page 18
          currentPage = pdfDoc.getPage(17);
          await insertText(assessment.Speed30MtrsSecs, 8.9159, 23.2641, rgb(0, 0.69, 1), fontHeadingVal, StandardFonts.HelveticaBold)
          status = await ProgressBar(16, 23.1, assessment.Speed30MtrsSecs, assessment.Speed30MtrsRating)
          y = 17.4
          text1 = "Above average result shows excellent speed."
          text2 = "Average test result indicates appropriate speed."
          text3 = "A below-average result indicates that the individual may have limitations in sprinting speed and"
          text4 = "acceleration. This can affect their ability to quickly cover short distances, which is essential in many"
          text5 = "sports and activities."
          await insertText(text1, x, y, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text2, x, y = y - 0.48, (status == "Average") ? color : undefined, font, (status == "Average") ? StandardFonts.Helvetica : undefined)//46 px
          await insertText(text3, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text4, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text5, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          //page 19
          currentPage = pdfDoc.getPage(18);
          await insertText(assessment.SixHundredMtrsMins, 8.6159, 23.4641, rgb(0, 0.69, 1), fontHeadingVal, StandardFonts.HelveticaBold)
          status = await ProgressBar(16, 23.3, assessment.SixHundredMtrsMins, assessment.SixHundredMtrsRating)
          y = 16.7
          text1 = "Above Average test result suggests excellent aerobic endurance and cardiovascular fitness."
          text2 = "Average test result suggests appropriate aerobic endurance and cardiovascular fitness."
          text3 = "A below-average result on the 600mts Run Test suggests potential limitations in aerobic endurance and"
          text4 = "cardiovascular fitness."
          await insertText(text1, x, y, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text2, x, y = y - 0.48, (status == "Average") ? color : undefined, font, (status == "Average") ? StandardFonts.Helvetica : undefined)//46 px
          await insertText(text3, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text4, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          //page 20          
          currentPage = pdfDoc.getPage(19);
          await insertText(assessment.SquatTest30Secs, 9.7, 24.1, rgb(0, 0.69, 1), fontHeadingVal, StandardFonts.HelveticaBold)
          status = await ProgressBar(16, 24, assessment.SquatTest30Secs, assessment.SquatTestRating)
          x = x + 0.5; y = 16.3
          text1 = "An above-average result on the 30-Second Squats Test indicates excellent lower-body muscular endurance and"
          text2 = "strength"
          text3 = "The average result indicates appropriate lower-body muscular endurance and strength."
          text4 = "A below-average result on the 30-Second Squats Test indicates potential limitations in lower body muscular"
          text5 = "endurance and strength."
          await insertText(text1, x, y, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text2, x, y = y - 0.48, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)//46 px
          await insertText(text3, x, y = y - 0.48, (status == "Average") ? color : undefined, font, (status == "Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text4, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text5, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          //page 21
          currentPage = pdfDoc.getPage(20);
          await insertText(assessment.BearPositionHoldRating, 9.7, 20, rgb(0, 0.69, 1), fontHeadingVal, StandardFonts.HelveticaBold)
          status = await ProgressBar(16, 20, assessment.BearPositionHoldRating, assessment.BearPositionHoldRating)
          x = x - 0.8; y = 14
          text1 = "An above average position indicates Excellent core strength, stability and overall body control."
          text2 = "An average position indicates appropriate core strength, stability and overall body control."
          text3 = "A below-average result in the Bear Position Hold Test may indicate"
          await insertText(text1, x, y, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text2, x, y = y - 0.48, (status == "Average") ? color : undefined, font, (status == "Average") ? StandardFonts.Helvetica : undefined)//46 px
          await insertText(text3, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          //page 22
          currentPage = pdfDoc.getPage(21);
          await insertText(assessment.OverheadSquatsRating, 9.3, 22.5, rgb(0, 0.69, 1), fontHeadingVal, StandardFonts.HelveticaBold)
          status = await ProgressBar(16, 22.3, assessment.OverheadSquatsRating, assessment.OverheadSquatsRating)
          x = x + 0.2; y = 15.9
          text1 = "An Above Average score indicates Excellent mobility, flexibility, balance and overall co ordination.."
          text2 = "Average score indicates appropriate mobility, flexibility, balance and overall co ordination.."
          text3 = "A below-average result on the Overhead Squat Test suggests: "
          await insertText(text1, x, y, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text2, x, y = y - 0.48, (status == "Average") ? color : undefined, font, (status == "Average") ? StandardFonts.Helvetica : undefined)//46 px
          await insertText(text3, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)
          //page 23
          currentPage = pdfDoc.getPage(22);
          await insertText(assessment.LungesRating, 9.3, 22.7, rgb(0, 0.69, 1), fontHeadingVal, StandardFonts.HelveticaBold)
          status = await ProgressBar(16, 22.8326, assessment.LungesRating, assessment.LungesRating)
          x = x - 0.2; y = 16.3
          text1 = "An Above average score indicates Excellent balance ,stability, proprioception and lower body strength."
          text2 = "An average score indicates appropriate balance ,stability, proprioception and lower body strength."
          text3 = "A below-average result on the Single-Leg Dead lift Test suggests :"
          await insertText(text1, x, y, (status == "Above Average") ? color : undefined, font, (status == "Above Average") ? StandardFonts.Helvetica : undefined)
          await insertText(text2, x, y = y - 0.48, (status == "Average") ? color : undefined, font, (status == "Average") ? StandardFonts.Helvetica : undefined)//46 px
          await insertText(text3, x, y = y - 0.48, (status == "Below Average") ? color : undefined, font, (status == "Below Average") ? StandardFonts.Helvetica : undefined)

          const modifiedPdfBytes = await pdfDoc.save();
          const modifiedPdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
          const modifiedPdfUrl = URL.createObjectURL(modifiedPdfBlob);
          //preview
          if (!download) {
            const previewUrl = `${modifiedPdfUrl}`;
            window.open(previewUrl, '_blank');
          }
          //mail send
          const formData = new FormData();
          if (!download && modifiedPdfBlob) {
            let name = assessment.Name
            formData.append('file', modifiedPdfBlob, `${assessment.Name}.pdf`);
            this.http.post(`${environment.apiUrl}/assessor/students/assesment/${assessment.email}/${name}`, formData)
              .subscribe(
                (response: any) => {
                  console.log("Response from backend:", response);
                  this.openSnackBar("PDF Sent to Student", "Close")
                },
                (error) => {
                  console.log("Error sending PDF to backend:", error);
                  this.openSnackBar("Failed To Send PDF", "Close")
                }
              );
          }
          //download 
          if (download) {
            const downloadLink = document.createElement('a');
            downloadLink.href = modifiedPdfUrl;
            downloadLink.download = `${assessment.Name}.pdf`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }
          URL.revokeObjectURL(modifiedPdfUrl);
        }
      });
      fileInput.click();
    } catch (error) {
      console.error('Error inserting data into PDF:', error);
    }
  }

  // SchoolDetails = () => {
  //   const email = localStorage.getItem('username')
  //   this.http.get(`${environment.apiUrl}/student/admin/${email}`)
  //     .subscribe((response: any) => {
  //       localStorage.setItem('candidateID', response[0].candidateID)
  //       localStorage.setItem('schoolID', response[0].schoolID)
  //       // console.log(response[0]);

  //       this.admin = response[0]
  //       this.email = response[0].email
  //       this.name = response[0].name
  //       this.phoneNumber = response[0].phoneNumber
  //       this.fetchAllActivites();
  //     }, (error) => {
  //       console.log(error.error, 'error in creating admin')
  //     })
  // }
  // fetchFilteredAcivity(a: any, b: any) {

  // }
  fetchSchoolsAndStudents() {
    this.http.get(`${environment.apiUrl}/assessor/schools`)
      .subscribe((response: any) => {
        this.allSchools = response;
      }, (error) => {
        console.log(error.error, 'error in getting schools')
      })
    this.http.get(`${environment.apiUrl}/assessor/students`)
      .subscribe((response: any) => {
        this.allStudents = response
      }, (error) => {
        console.log(error.error, 'error in getting students')
      })
  }
  generateCandidatesExcel() {
    const data = this.candidatesActivity
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
      width: "89vh",
      height: "83.1vh"
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
        const candidateID = this.myForm.value.ID// localStorage.getItem("candidateID")
        const schoolID = this.myForm.value.SchoolID// localStorage.getItem("schoolID")
        this.http.post(`${environment.apiUrl}/student/activity/assessor/create`, { formData: this.myForm.value, schoolID, candidateID })
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
          this.http.put(`${environment.apiUrl}/student/activity/edit/${this.currentActivity._id}`, this.myForm.value)
            .subscribe((response: any) => {
              if (response.modifiedCount == 1) {
                this.openSnackBar('student edited successfully', 'Close')
                this.myForm.reset();
                this.editMode = false;
                this.fetchAllActivites()
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

  fetchAllActivites(schoolID?: any, candidateID?: any) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'assessor') {
      this.router.navigate(['/login']);
    }
    !schoolID && (schoolID = undefined)
    !candidateID && (candidateID = undefined)
    this.http.get(`${environment.apiUrl}/student/activity/assessor/${schoolID}/${candidateID}`)
      .subscribe((response: any) => {
        this.candidatesActivity = response;
      }, (error) => {
        console.log(error.error, 'error in creating student')
      })
  }

  editCandidate(activity: any): void {
    this.editMode = true;
    this.myForm.patchValue(activity);
    this.initialFormValues = this.myForm.value;
    this.currentActivity = activity;
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
  saveCandidateAssinmentData(candidateActivity: any, date: any) {
    if (date == '') {
      this.openSnackBar('date is empty', 'Close')
      return
    }

    this.http.put(`${environment.apiUrl}/student/activity/edit/${candidateActivity._id}`, { AssessmentDate: `${date}` })
      .subscribe((response: any) => {
        if (response.modifiedCount == 1) {
          this.fetchAllActivites()
          this.openSnackBar('date updated successfully', 'Close')
        }
      }, (error) => {
        console.log(error.error, 'error in updating activity date')
        this.openSnackBar('Somthing went wrong!', 'Close')
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
