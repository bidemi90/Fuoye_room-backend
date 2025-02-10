const express = require("express");

const {
  signup,
  login,
  getUserByemail,

  adminsignup,
  adminlogin,
  getadminByemail,
  verifyadminondashbord,

  gettingalluserdata,

  addingschoolmalehostel,
  addingschoolfemalehostel,
  gettingschoolmalehostel,
  gettingschoolfemalehostel,
  verifyuserondashbord,

 
  addingprivatemalehostel,
  addingprivatefemalehostel,
  addingmixedhostel,
  addingcoupleshostel,
  gettingprivatemalehostel,
  gettingprivatefemalehostel,
  gettingmixedhostel,
  gettingcoupleshostel,
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

module.exports = userrouters;
