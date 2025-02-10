const UserModel = require("../models/usermodel");

const adminModel = require("../models/adminmodel");

const MaleHostelModel = require("../models/malehostelmodel");

const FemaleHostelModel = require("../models/femalehostelmodel");

const PrivatemaleHostelModel = require("../models/privatemalehostel");

const PrivatefemaleHostelModel = require("../models/privatefemalehostel");

const MixedhostelModel = require("../models/mixedhostelmodel");

const CoupleshostelModel = require("../models/coupleshostelmodel");

const bcryptjs = require("bcryptjs");

const jsonwebtoken = require("jsonwebtoken");

const { usermailer } = require("../utils/usermailer");

const cloudinary = require("../utils/cloudinary");

const signup = async (req, res) => {
  console.log(req.body);
  let body = req.body;

  try {
    const ifuseremail = await UserModel.findOne({
      email: body.email,
    });
    const ifusermatricnumber = await UserModel.findOne({
      matric_number: body.matric_number,
    });
    if (ifuseremail) {
      return res.status(400).send({
        message: "Email already in use",
        status: false,
      });
    } else if (ifusermatricnumber) {
      return res.status(400).send({
        message: "matric-number already in use",
        status: false,
      });
    } else {
      // hashing the passoword
      const hashedPassword = await bcryptjs.hash(body.password, 10);

      const newuser = await UserModel.create({
        matric_number: body.matric_number,
        email: body.email,
        gender: body.gender,
        password: hashedPassword,
      });
      usermailer(body.email, body.matric_number, "welcome");
      if (newuser) {
        return res.status(200).send({
          message: "sign up successful",
          status: true,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "error",
      status: false,
    });
  }
};

const login = async (req, res) => {
  console.log(req.body);
  let body = req.body;

  try {
    const ifusermatricnumber = await UserModel.findOne({
      matric_number: body.matric_number,
    });
    if (ifusermatricnumber) {
      // comparing the hashpassword and the typed password
      const compare = await bcryptjs.compare(
        body.password,
        ifusermatricnumber.password
      );
      console.log("Password match result:", compare);

      if (compare) {
        // creating or generating a token using 4 par , 1 uni id,2 secretkey(you can write it or put it in the env and the expiresIN (when it will expires)) token for one user
        let matric_number = ifusermatricnumber.matric_number;
        const token = await jsonwebtoken.sign({ matric_number }, "secretkey", {
          expiresIn: "1d",
        });
        console.log("this one");

        console.log(ifusermatricnumber, token);
        return res.status(200).send({
          message: "login successful",
          status: true,
          ifusermatricnumber,
          token,
        });
      } else {
        return res.status(401).send({
          message: "password incorrect ",
          status: false,
        });
      }
    } else {
      return res.status(402).send({
        message: "account not found try creating an account",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "error",
      status: false,
    });
  }
};

const getUserByemail = async (req, res) => {
  console.log("Request params:", req.params);
  try {
    const { email } = req.params;

    // Log the email being searched for
    console.log("email provided:", email);

    // Find user by email
    const ifusermatricnumber = await UserModel.findOne({
      email: email,
    });

    if (!ifusermatricnumber) {
      // Log if no user is found
      console.log("No user found with the provided email");
      return res.status(404).send({ message: "User not found", status: false });
    } else {
      console.log("User found:", ifusermatricnumber);

      let matric_number = ifusermatricnumber.matric_number;
      const token = await jsonwebtoken.sign({ matric_number }, "secretkey", {
        expiresIn: "1d",
      });

      console.log(ifusermatricnumber, token);

      // Return the found user data
      console.log("User data retrieved successfully");
      return res.status(200).send({
        message: "User data retrieved successfully",
        status: true,
        ifusermatricnumber,
        token,
      });
    }
  } catch (error) {
    console.log("Error occurred while fetching user data:", error);
  }
};

const verifyuserondashbord = async (req, res) => {
  console.log(req.header);
  console.log(req.headers.authorization.split(" ")[1]);
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(402).send({ message: "invalid token", status: false });
    } else {
      const verifytoken = await jsonwebtoken.verify(token, "secretkey");
      console.log(verifytoken);
      const matric_number = verifytoken.matric_number;

      const checkforverifyemail = await UserModel.findOne({
        matric_number: matric_number,
      });
      if (checkforverifyemail) {
        console.log("verified");

        res.status(200).send({ message: "user is verified", status: true });
      }
    }
  } catch (error) {
    if (error.message == "jwt malformed") {
      console.log("incorrect token");
      res.status(402).send({ message: "incorrect", status: false });
    } else {
      // console.log(error);
      res.status(400).send({ message: error.message, status: false });
    }
  }
};

// admin controller
const adminsignup = async (req, res) => {
  console.log(req.body);
  let body = req.body;

  try {
    const ifadminemail = await adminModel.findOne({
      email: body.email,
    });
    const ifadminadminusername = await adminModel.findOne({
      adminusername: body.adminusername,
    });
    if (ifadminemail) {
      return res.status(400).send({
        message: "Email already in use",
        status: false,
      });
    } else if (ifadminadminusername) {
      return res.status(400).send({
        message: "username already in use",
        status: false,
      });
    } else {
      // hashing the passoword
      const hashedPassword = await bcryptjs.hash(body.password, 10);

      const newadmin = await adminModel.create({
        adminusername: body.adminusername,
        email: body.email,
        password: hashedPassword,
      });
      usermailer(body.email, body.adminusername, "welcomeAdmin");
      if (newadmin) {
        return res.status(200).send({
          message: "sign up successful",
          status: true,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "error",
      status: false,
    });
  }
};

const adminlogin = async (req, res) => {
  console.log(req.body);
  let body = req.body;

  try {
    const ifadminadminusername = await adminModel.findOne({
      adminusername: body.adminusername,
    });
    if (ifadminadminusername) {
      // comparing the hashpassword and the typed password
      const compare = await bcryptjs.compare(
        body.password,
        ifadminadminusername.password
      );
      console.log("Password match result:", compare);

      if (compare) {
        // creating or generating a token using 4 par , 1 uni id,2 secretkey(you can write it or put it in the env and the expiresIN (when it will expires)) token for one admin
        let adminusername = ifadminadminusername.adminusername;
        const token = await jsonwebtoken.sign({ adminusername }, "secretkey", {
          expiresIn: "1d",
        });
        console.log("this one");

        console.log(ifadminadminusername, token);
        return res.status(200).send({
          message: "login successful",
          status: true,
          ifadminadminusername,
          token,
        });
      } else {
        return res.status(401).send({
          message: "password incorrect ",
          status: false,
        });
      }
    } else {
      return res.status(402).send({
        message:
          "account not found try creating an account to be given permission",
        status: false,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "error",
      status: false,
    });
  }
};

const getadminByemail = async (req, res) => {
  console.log("Request params:", req.params);
  try {
    const { email } = req.params;

    // Log the email being searched for
    console.log("email provided:", email);

    // Find admin by email
    const ifadminadminusername = await adminModel.findOne({
      email: email,
    });

    if (!ifadminadminusername) {
      // Log if no admin is found
      console.log("No admin found with the provided email");
      return res
        .status(404)
        .send({ message: "admin not found", status: false });
    } else {
      console.log("admin found:", ifadminadminusername);

      let adminusername = ifadminadminusername.adminusername;
      const token = await jsonwebtoken.sign({ adminusername }, "secretkey", {
        expiresIn: "1d",
      });

      console.log(ifadminadminusername, token);

      // Return the found admin data
      console.log("admin data retrieved successfully");
      return res.status(200).send({
        message: "admin data retrieved successfully",
        status: true,
        ifadminadminusername,
        token,
      });
    }
  } catch (error) {
    console.log("Error occurred while fetching admin data:", error);
  }
};

const verifyadminondashbord = async (req, res) => {
  console.log(req.header);
  console.log(req.headers.authorization.split(" ")[1]);
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(402).send({ message: "invalid token", status: false });
    } else {
      const verifytoken = await jsonwebtoken.verify(token, "secretkey");
      console.log(verifytoken);
      const adminusername = verifytoken.adminusername;

      const checkforverifyemail = await adminModel.findOne({
        adminusername: adminusername,
      });
      if (checkforverifyemail) {
        console.log("verified");

        res.status(200).send({ message: "admin is verified", status: true });
      }
    }
  } catch (error) {
    if (error.message == "jwt malformed") {
      console.log("incorrect token");
      res.status(402).send({ message: "incorrect", status: false });
    } else {
      // console.log(error);
      res.status(400).send({ message: error.message, status: false });
    }
  }
};

//
const gettingalluserdata = async (req, res) => {
  try {
    // Fetch all personal loan requests from the database
    const alluserdata = await UserModel.find({});

    // Return the fetched personal loan requests
    return res.status(200).json({
      message: "all user data retrieved successfully",
      alluserdata,
    });
  } catch (error) {
    console.error("Error fetching all user data :", error);
    return res.status(500).json({
      message: "Error fetching all user data ",
      error: error.message,
    });
  }
};

//

const addingschoolmalehostel = async (req, res) => {
  console.log(req.body);
  let body = req.body;

  try {
    const roomNumber = await MaleHostelModel.findOne({
      roomNumber: body.roomNumber,
    });
    if (roomNumber) {
      return res.status(400).send({
        message: "room number already availiable",
        status: false,
      });
    } else {
      const newmaleroom = await MaleHostelModel.create({
        roomNumber: body.roomNumber,
        bunkerSpace: body.bunkerSpace,
        rent: body.rent,
        availability: true,
      });
      if (newmaleroom) {
        return res.status(200).send({
          message: "room added successful",
          status: true,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "error",
      status: false,
    });
  }
};

const addingschoolfemalehostel = async (req, res) => {
  console.log(req.body);
  let body = req.body;

  try {
    const roomNumber = await FemaleHostelModel.findOne({
      roomNumber: body.roomNumber,
    });
    if (roomNumber) {
      return res.status(400).send({
        message: "room number already availiable",
        status: false,
      });
    } else {
      const newmaleroom = await FemaleHostelModel.create({
        roomNumber: body.roomNumber,
        bunkerSpace: body.bunkerSpace,
        rent: body.rent,
        availability: true,
      });
      if (newmaleroom) {
        return res.status(200).send({
          message: "room added successful",
          status: true,
        });
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "error",
      status: false,
    });
  }
};

const gettingschoolmalehostel = async (req, res) => {
  try {
    // Fetch all personal loan requests from the database
    const schoolmalehostel = await MaleHostelModel.find({});

    // Return the fetched personal loan requests
    return res.status(200).json({
      message: "school male hostel retrieved successfully",
      schoolmalehostel,
    });
  } catch (error) {
    console.error("Error fetching school male hostel requests:", error);
    return res.status(500).json({
      message: "An error occurred while fetching school male hostel requests",
      error: error.message,
    });
  }
};

const gettingschoolfemalehostel = async (req, res) => {
  try {
    // Fetch all personal loan requests from the database
    const schoolfemalehostel = await FemaleHostelModel.find({});

    // Return the fetched personal loan requests
    return res.status(200).json({
      message: "school female hostel retrieved successfully",
      schoolfemalehostel,
    });
  } catch (error) {
    console.error("Error fetching school female hostel requests:", error);
    return res.status(500).json({
      message: "An error occurred while fetching school female hostel requests",
      error: error.message,
    });
  }
};

//

const addingprivatemalehostel = async (req, res) => {
  console.log(req.body);
  let body = req.body;

  // Check if image data exists
  if (!body.img_array) {
    return res
      .status(400)
      .send({ message: "Image cannot be empty", status: false });
  }

  try {
    // Upload image to Cloudinary
    const image = await cloudinary.uploader.upload(body.img_array);
    console.log(image);

    // Check if the building already exists
    const building_namecheck = await PrivatemaleHostelModel.findOne({
      building_name: body.building_name,
    });

    if (building_namecheck) {
      return res.status(400).send({
        message: "Building already available",
        status: false,
      });
    }

    // Create a new private male hostel entry
    const newmaleroom = await PrivatemaleHostelModel.create({
      img_array: image.secure_url, // Store the Cloudinary image URL
      building_name: body.building_name,
      building_address: body.address, // Ensure consistency with the frontend
      room_description: body.room_description,
      building_amenities: body.building_amenities,
      room_count: body.numbers_of_room, // Ensure consistency with the frontend
      one_room_capacity: body.room_capacity, // Consistent field names
      rent: body.rent,
      is_furnished: body.is_furnished,
      rules: body.building_rules,
    });

    if (newmaleroom) {
      return res.status(200).send({
        message: "Building added successfully",
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error adding building",
      status: false,
    });
  }
};

const addingprivatefemalehostel = async (req, res) => {
  console.log(req.body);
  let body = req.body;

  // Check if image data exists
  if (!body.img_array) {
    return res
      .status(400)
      .send({ message: "Image cannot be empty", status: false });
  }

  try {
    // Upload image to Cloudinary
    const image = await cloudinary.uploader.upload(body.img_array);
    console.log(image);

    // Check if the building already exists
    const building_namecheck = await PrivatefemaleHostelModel.findOne({
      building_name: body.building_name,
    });

    if (building_namecheck) {
      return res.status(400).send({
        message: "Building already available",
        status: false,
      });
    }

    // Create a new private male hostel entry
    const newfemaleroom = await PrivatefemaleHostelModel.create({
      img_array: image.secure_url, // Store the Cloudinary image URL
      building_name: body.building_name,
      building_address: body.address, // Ensure consistency with the frontend
      room_description: body.room_description,
      building_amenities: body.building_amenities,
      room_count: body.numbers_of_room, // Ensure consistency with the frontend
      one_room_capacity: body.room_capacity, // Consistent field names
      rent: body.rent,
      is_furnished: body.is_furnished,
      rules: body.building_rules,
    });

    if (newfemaleroom) {
      return res.status(200).send({
        message: "Building added successfully",
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error adding building",
      status: false,
    });
  }
};

const gettingprivatemalehostel = async (req, res) => {
  try {
    // Fetch all personal loan requests from the database
    const privatemalehostel = await PrivatemaleHostelModel.find({});

    // Return the fetched personal loan requests
    return res.status(200).json({
      message: "private male hostel retrieved successfully",
      privatemalehostel,
    });
  } catch (error) {
    console.error("Error fetching private male hostel requests:", error);
    return res.status(500).json({
      message: "An error occurred while fetching private male hostel requests",
      error: error.message,
    });
  }
};

const gettingprivatefemalehostel = async (req, res) => {
  try {
    // Fetch all personal loan requests from the database
    const privatefemalehostel = await PrivatefemaleHostelModel.find({});

    // Return the fetched personal loan requests
    return res.status(200).json({
      message: "private female hostel retrieved successfully",
      privatefemalehostel,
    });
  } catch (error) {
    console.error("Error fetching private female hostel requests:", error);
    return res.status(500).json({
      message:
        "An error occurred while fetching private female hostel requests",
      error: error.message,
    });
  }
};

// 
const addingmixedhostel = async (req, res) => {
  console.log(req.body);
  let body = req.body;

  // Check if image data exists
  if (!body.img_array) {
    return res
      .status(400)
      .send({ message: "Image cannot be empty", status: false });
  }

  try {
    // Upload image to Cloudinary
    const image = await cloudinary.uploader.upload(body.img_array);
    console.log(image);

    // Check if the building already exists
    const building_namecheck = await MixedhostelModel.findOne({
      building_name: body.building_name,
    });

    if (building_namecheck) {
      return res.status(400).send({
        message: "Building already available",
        status: false,
      });
    }

    // Create a new  mixed gender hostel entry
    const mixedroom = await MixedhostelModel.create({
      img_array: image.secure_url, // Store the Cloudinary image URL
      building_name: body.building_name,
      building_address: body.address, // Ensure consistency with the frontend
      room_description: body.room_description,
      building_amenities: body.building_amenities,
      room_count: body.numbers_of_room, // Ensure consistency with the frontend
      one_room_capacity: body.room_capacity, // Consistent field names
      rent: body.rent,
      is_furnished: body.is_furnished,
      rules: body.building_rules,
    });

    if (mixedroom) {
      return res.status(200).send({
        message: "Building added successfully",
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error adding building",
      status: false,
    });
  }
};

const gettingmixedhostel = async (req, res) => {
  try {
    // Fetch all personal loan requests from the database
    const mixedhostel = await MixedhostelModel.find({});

    // Return the fetched personal loan requests
    return res.status(200).json({
      message: "mixed hostel retrieved successfully",
      mixedhostel,
    });
  } catch (error) {
    console.error("Error fetching mixed hostel requests:", error);
    return res.status(500).json({
      message:
        "An error occurred while fetching mixed hostel requests",
      error: error.message,
    });
  }
};


const addingcoupleshostel = async (req, res) => {
  console.log(req.body);
  let body = req.body;

  // Check if image data exists
  if (!body.img_array) {
    return res
      .status(400)
      .send({ message: "Image cannot be empty", status: false });
  }

  try {
    // Upload image to Cloudinary
    const image = await cloudinary.uploader.upload(body.img_array);
    console.log(image);

    // Check if the building already exists
    const building_namecheck = await CoupleshostelModel.findOne({
      building_name: body.building_name,
    });

    if (building_namecheck) {
      return res.status(400).send({
        message: "Building already available",
        status: false,
      });
    }

    // Create a new  couples gender hostel entry
    const couplesroom = await CoupleshostelModel.create({
      img_array: image.secure_url, // Store the Cloudinary image URL
      building_name: body.building_name,
      building_address: body.address, // Ensure consistency with the frontend
      room_description: body.room_description,
      building_amenities: body.building_amenities,
      room_count: body.numbers_of_room, // Ensure consistency with the frontend
      one_room_capacity: body.room_capacity, // Consistent field names
      rent: body.rent,
      is_furnished: body.is_furnished,
      rules: body.building_rules,
    });

    if (couplesroom) {
      return res.status(200).send({
        message: "Building added successfully",
        status: true,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error adding building",
      status: false,
    });
  }
};

const gettingcoupleshostel = async (req, res) => {
  try {
    // Fetch all personal loan requests from the database
    const coupleshostel = await CoupleshostelModel.find({});

    // Return the fetched personal loan requests
    return res.status(200).json({
      message: "couples hostel retrieved successfully",
      coupleshostel,
    });
  } catch (error) {
    console.error("Error fetching couples hostel requests:", error);
    return res.status(500).json({
      message:
        "An error occurred while fetching couples hostel requests",
      error: error.message,
    });
  }
};
module.exports = {
  signup,
  login,
  getUserByemail,
  verifyuserondashbord,

  adminsignup,
  adminlogin,
  getadminByemail,
  verifyadminondashbord,

  gettingalluserdata,

  addingschoolmalehostel,
  addingschoolfemalehostel,
  gettingschoolmalehostel,
  gettingschoolfemalehostel,

  addingprivatemalehostel,
  addingprivatefemalehostel,
  addingmixedhostel,
  addingcoupleshostel,
  gettingprivatemalehostel,
  gettingprivatefemalehostel,
  gettingmixedhostel,
  gettingcoupleshostel,
};
