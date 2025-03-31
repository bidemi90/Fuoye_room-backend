const express = require("express");

const {
  signup,
  login,
  getUserByemail,
  verifyuserondashbord,
// 
  adminsignup,
  adminlogin,
  getadminByemail,
  verifyadminondashbord,
// 
  gettingalluserdata,
// 
  addingschoolmalehostel,
  addingschoolfemalehostel,
// 
  gettingschoolmalehostel,
  gettingschoolfemalehostel,
// 
  addingprivatemalehostel,
  addingprivatefemalehostel,
  addingmixedhostel,
  addingcoupleshostel,
// 
  gettingprivatemalehostel,
  gettingprivatefemalehostel,
  gettingmixedhostel,
  gettingcoupleshostel,
// 
  updateSchoolMaleHostel,
  updateSchoolFemaleHostel,

  updatePrivateMaleHostel,
  updatePrivateFemaleHostel,
  updatemixedhostel,
  updatecoupleshostel,

  
  //
  updatemaleBunkerOccupant,
  updatefemaleBunkerOccupant,
  
  updatePrivateMaleHostelOccupant,
  updatePrivateFemaleHostelOccupant,
  updatePrivateMixedHostelOccupant,
  updatePrivateCouplesHostelOccupant,
  //

  payformaleschoolhostel,
  verifypaymentformaleschoolhostel,

  payforfemaleschoolhostel,
  verifypaymentforfemaleschoolhostel,
  //

  payformaleprivatehostel,
  verifypaymentformaleprivatehostel,

  payforfemaleprivatehostel,
  verifypaymentforfemaleprivatehostel,
  
  payformixedprivatehostel,
  verifypaymentformixedprivatehostel,

  payforcouplesprivatehostel,
  verifypaymentforcouplesprivatehostel,


    // upload user profile
    uploadProfileImage,

} = require("../controllers/usercontroller");

const userrouters = express.Router();

userrouters.post("/signup", signup);
userrouters.post("/login", login);
userrouters.get("/getUserByemail/:email", getUserByemail);
userrouters.get("/verifyuserondashbord", verifyuserondashbord);

userrouters.post("/adminsignup", adminsignup);
userrouters.post("/adminlogin", adminlogin);
userrouters.get("/getadminByemail/:email", getadminByemail);
userrouters.get("/verifyadminondashbord", verifyadminondashbord);

userrouters.get("/gettingalluserdata", gettingalluserdata);

userrouters.post("/addingschoolmalehostel", addingschoolmalehostel);
userrouters.post("/addingschoolfemalehostel", addingschoolfemalehostel);
userrouters.get("/gettingschoolmalehostel", gettingschoolmalehostel);
userrouters.get("/gettingschoolfemalehostel", gettingschoolfemalehostel);

userrouters.post("/addingprivatemalehostel", addingprivatemalehostel);
userrouters.post("/addingprivatefemalehostel", addingprivatefemalehostel);
userrouters.post("/addingmixedhostel", addingmixedhostel);
userrouters.post("/addingcoupleshostel", addingcoupleshostel);

userrouters.get("/gettingprivatemalehostel", gettingprivatemalehostel);
userrouters.get("/gettingprivatefemalehostel", gettingprivatefemalehostel);
userrouters.get("/gettingmixedhostel", gettingmixedhostel);
userrouters.get("/gettingcoupleshostel", gettingcoupleshostel);

userrouters.put("/edit-school-male-hostel/:id", updateSchoolMaleHostel);
userrouters.put("/edit-school-female-hostel/:id", updateSchoolFemaleHostel);

userrouters.put("/edit-private-male-hostel/:id", updatePrivateMaleHostel);
userrouters.put("/edit-private-female-hostel/:id", updatePrivateFemaleHostel);

userrouters.put("/edit-mixed-hostel/:id", updatemixedhostel);
userrouters.put("/edit-couples-hostel/:id", updatecoupleshostel);

userrouters.post("/updatemale-bunker-occupant", updatemaleBunkerOccupant);
userrouters.post("/updatefemale-bunker-occupant", updatefemaleBunkerOccupant);

// 
userrouters.post("/updatePrivateMaleHostelOccupant", updatePrivateMaleHostelOccupant);
userrouters.post("/updatePrivateFemaleHostelOccupant", updatePrivateFemaleHostelOccupant);
userrouters.post("/updatePrivateMixedHostelOccupant", updatePrivateMixedHostelOccupant);
userrouters.post("/updatePrivateCouplesHostelOccupant", updatePrivateCouplesHostelOccupant);

// 
userrouters.post("/api/payformaleschoolhostel", payformaleschoolhostel);
userrouters.get("/api/verifyschoolmalepayment/:reference", verifypaymentformaleschoolhostel);


userrouters.post("/api/payforfemaleschoolhostel", payforfemaleschoolhostel);
userrouters.get("/api/verifyschoolfemalepayment/:reference", verifypaymentforfemaleschoolhostel);
// 
userrouters.post("/api/payformaleprivatehostel", payformaleprivatehostel);
userrouters.get("/api/verifyprivatemalepayment/:reference", verifypaymentformaleprivatehostel);
userrouters.post("/api/payforfemaleprivatehostel", payforfemaleprivatehostel);
userrouters.get("/api/verifyprivatefemalepayment/:reference", verifypaymentforfemaleprivatehostel);
userrouters.post("/api/payformixedprivatehostel", payformixedprivatehostel);
userrouters.get("/api/verifyprivatemixedpayment/:reference", verifypaymentformixedprivatehostel);
userrouters.post("/api/payforcouplesprivatehostel", payforcouplesprivatehostel);
userrouters.get("/api/verifyprivatecouplespayment/:reference", verifypaymentforcouplesprivatehostel);

// Upload profile image
userrouters.post("/uploadprofileimage", uploadProfileImage);

module.exports = userrouters;
