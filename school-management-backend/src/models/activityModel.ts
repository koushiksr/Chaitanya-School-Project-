const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
     Name: String,
     ID: String,
     Gender: String,
     DOB: Date,
     Age: Number,
     Class: String,
     DominantSide: String,
     ParentName: String,
     ParentMobileNo: String,
     AlternateNo: String,
     email: String,
     ResidenceArea: String,
     ResidenceCity: String,
     // schoolInfo: Object,
     SchoolName: String,
     SchoolID: String,
     SchoolContactName: String,
     SchoolContactNumber: String,
     SchoolContactEmailID: String,

     ongoing: Boolean,

     AssessmentTeam: String,
     AssessmentDate: String,
     AssessmentID: String,
     HeightCMs: String,
     HeightRating: Number,
     HeightComment: String,
     WeightKG: String,
     WeightRating: Number,
     WeightComment: String,
     BMI: String,
     BmiRating: Number,
     BMIComment: String,
     BodyFatPercentage: String,
     BodyFatRating: Number,
     BodyFatComment: String,
     ArmLengthCMs: String,
     ArmLengthRating: Number,
     ArmLengthComment: String,

     LegLengthCMs: String,
     LegLengthRating: Number,
     LegLengthComment: String,

     SitAndReachCMs: String,
     SitAndReachRating: String,
     SitAndReachComment: String,

     SingleLegBalance: String,
     SingleLegBalanceRating: String,
     SingleLegBalanceComment: String,

     PushUps: String,
     PushUpsRating: String,
     PushUpsComment: String,

     GripStrengthKGs: String,
     GripStrengthRating: String,
     GripStrengthComment: String,

     SquatTest30Secs: String,
     SquatTestRating: String,
     SquatTestComment: String,

     PlankSecs: String,
     PlankRating: String,
     PlankComment: String,

     StandingLongJumpCMs: String,
     StandingLongJumpRating: String,
     StandingLongJumpComment: String,

     StandingVerticalJumpInches: String,
     StandingVerticalJumpRating: String,
     StandingVerticalJumpComment: String,

     FiveZeroFiveSecs: String,
     FiveZeroFiveRating: String,
     FiveZeroFiveComment: String,

     Speed30MtrsSecs: String,
     Speed30MtrsRating: String,
     Speed30MtrsComment: String,

     SixHundredMtrsMins: String,
     SixHundredMtrsRating: String,
     SixHundredMtrsComment: String,

     // OneMileTest: String,
     // OneMileTestRating: String,
     // OneMileTestComment: String,

     BearPositionHold: String,
     BearPositionHoldComment: String,
     BearPositionHoldRating: String,

     OverheadSquats: String,
     OverheadSquatsRating: String,
     OverheadSquatsComment: String,

     LungesTest: String,
     LungesRating: String,
     LungesComment: String,

     RemarksRemark1: String,
     RemarksRemark2: String,
     RemarksRemark3: String,

}, {
     timestamps: true
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;