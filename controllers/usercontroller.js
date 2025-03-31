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

require("dotenv").config();

const axios = require("axios"); // Add this import

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

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
    const ifusername = await UserModel.findOne({
      username: body.username,
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
    } else if (ifusername) {
      return res.status(400).send({
        message: "username already in use",
        status: false,
      });
    } else {
      // hashing the passoword
      const hashedPassword = await bcryptjs.hash(body.password, 10);

      const newuser = await UserModel.create({
        matric_number: body.matric_number,
        username: body.username,
        full_name: body.full_name,
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
    if (email == "undefined" || email == "") {
      return res.status(404).send({ message: "User not found", status: false });
    }
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
  console.log(1);
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
      subaccount: body.subaccount, // subaccount
      whatsappcontact: body.whatsappcontact, // New field
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
      subaccount: body.subaccount, // subaccount
      whatsappcontact: body.whatsappcontact, // New field
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
      subaccount: body.subaccount, // subaccount
      whatsappcontact: body.whatsappcontact, // New field
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
      message: "An error occurred while fetching mixed hostel requests",
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
      subaccount: body.subaccount, // subaccount
      whatsappcontact: body.whatsappcontact, // New field
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
      message: "An error occurred while fetching couples hostel requests",
      error: error.message,
    });
  }
};

//
const updateSchoolMaleHostel = async (req, res) => {
  const { id } = req.params; // Room ID from URL
  const { roomNumber, bunkerSpace, rent } = req.body; // Data from form

  try {
    // Find the existing room
    let existingRoom = await MaleHostelModel.findById(id);
    if (!existingRoom) {
      return res.status(404).json({ message: "Room not found", status: false });
    }

    // Update the bunkerDetails array if bunkerSpace changes
    let newBunkerDetails = existingRoom.bunkerDetails;

    if (bunkerSpace !== existingRoom.bunkerSpace) {
      // Recalculate bunker details based on new bunkerSpace
      newBunkerDetails = [];
      const bunkerLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

      for (let i = 0; i < bunkerSpace * 2; i++) {
        newBunkerDetails.push({
          id: bunkerLabels[i],
          occupant: existingRoom.bunkerDetails[i]?.occupant || null, // Keep existing occupants if possible
        });
      }
    }

    // Update the room details
    existingRoom.roomNumber = roomNumber;
    existingRoom.bunkerSpace = bunkerSpace;
    existingRoom.rent = rent;
    existingRoom.bunkerDetails = newBunkerDetails;

    // Save the updated room
    await existingRoom.save();

    return res.status(200).json({
      message: "Room updated successfully",
      status: true,
      updatedRoom: existingRoom,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error updating room", status: false });
  }
};

const updateSchoolFemaleHostel = async (req, res) => {
  const { id } = req.params; // Room ID from URL
  const { roomNumber, bunkerSpace, rent } = req.body; // Data from form

  try {
    // Find the existing room
    let existingRoom = await FemaleHostelModel.findById(id);
    if (!existingRoom) {
      return res.status(404).json({ message: "Room not found", status: false });
    }

    // Update the bunkerDetails array if bunkerSpace changes
    let newBunkerDetails = existingRoom.bunkerDetails;

    if (bunkerSpace !== existingRoom.bunkerSpace) {
      // Recalculate bunker details based on new bunkerSpace
      newBunkerDetails = [];
      const bunkerLabels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

      for (let i = 0; i < bunkerSpace * 2; i++) {
        newBunkerDetails.push({
          id: bunkerLabels[i],
          occupant: existingRoom.bunkerDetails[i]?.occupant || null, // Keep existing occupants if possible
        });
      }
    }

    // Update the room details
    existingRoom.roomNumber = roomNumber;
    existingRoom.bunkerSpace = bunkerSpace;
    existingRoom.rent = rent;
    existingRoom.bunkerDetails = newBunkerDetails;

    // Save the updated room
    await existingRoom.save();

    return res.status(200).json({
      message: "Room updated successfully",
      status: true,
      updatedRoom: existingRoom,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error updating room", status: false });
  }
};

//

const updatePrivateMaleHostel = async (req, res) => {
  const { id } = req.params; // Hostel ID from URL
  let body = req.body; // Store request body

  try {
    // Find existing hostel by ID
    let existingHostel = await PrivatemaleHostelModel.findById(id);
    if (!existingHostel) {
      return res
        .status(404)
        .json({ message: "Hostel not found", status: false });
    }

    // Upload new image if provided
    let imageUrl = existingHostel.img_array;
    if (body.img_array) {
      const uploadedImage = await cloudinary.uploader.upload(body.img_array);
      imageUrl = uploadedImage.secure_url;
    }

    // Update the rooms array if room_count changes
    let newRooms = existingHostel.rooms;
    if (body.numbers_of_room !== existingHostel.room_count) {
      newRooms = [];
      for (let i = 1; i <= body.numbers_of_room; i++) {
        newRooms.push({
          room_id: i,
          availability: existingHostel.rooms[i - 1]?.availability || false, // Keep old availability if possible
          lease_start_date:
            existingHostel.rooms[i - 1]?.lease_start_date || null,
          lease_end_date: existingHostel.rooms[i - 1]?.lease_end_date || null,
        });
      }
    }
    // Update hostel details
    existingHostel.img_array = imageUrl;
    existingHostel.building_name = body.building_name;
    existingHostel.building_address = body.address;
    existingHostel.room_description = body.room_description;
    existingHostel.building_amenities = body.building_amenities;
    existingHostel.room_count = body.numbers_of_room;
    existingHostel.one_room_capacity = body.room_capacity;
    existingHostel.rent = body.rent;
    existingHostel.is_furnished = body.is_furnished;
    existingHostel.rules = body.building_rules;
    existingHostel.subaccount = body.subaccount;
    existingHostel.rooms = newRooms;
    (existingHostel.whatsappcontact = body.whatsappcontact), // New field
      // Save updated hostel
      await existingHostel.save();

    return res.status(200).json({
      message: "Hostel updated successfully",
      status: true,
      updatedHostel: existingHostel,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error updating hostel", status: false });
  }
};
const updatePrivateFemaleHostel = async (req, res) => {
  const { id } = req.params; // Hostel ID from URL
  let body = req.body; // Store request body

  try {
    // Find existing hostel by ID
    let existingHostel = await PrivatefemaleHostelModel.findById(id);
    if (!existingHostel) {
      return res
        .status(404)
        .json({ message: "Hostel not found", status: false });
    }

    // Upload new image if provided
    let imageUrl = existingHostel.img_array;
    if (body.img_array) {
      const uploadedImage = await cloudinary.uploader.upload(body.img_array);
      imageUrl = uploadedImage.secure_url;
    }

    // Update the rooms array if room_count changes
    let newRooms = existingHostel.rooms;
    if (body.numbers_of_room !== existingHostel.room_count) {
      newRooms = [];
      for (let i = 1; i <= body.numbers_of_room; i++) {
        newRooms.push({
          room_id: i,
          availability: existingHostel.rooms[i - 1]?.availability || false, // Keep old availability if possible
          lease_start_date:
            existingHostel.rooms[i - 1]?.lease_start_date || null,
          lease_end_date: existingHostel.rooms[i - 1]?.lease_end_date || null,
        });
      }
    }

    // Update hostel details
    existingHostel.img_array = imageUrl;
    existingHostel.building_name = body.building_name;
    existingHostel.building_address = body.address;
    existingHostel.room_description = body.room_description;
    existingHostel.building_amenities = body.building_amenities;
    existingHostel.room_count = body.numbers_of_room;
    existingHostel.one_room_capacity = body.room_capacity;
    existingHostel.rent = body.rent;
    existingHostel.is_furnished = body.is_furnished;
    existingHostel.rules = body.building_rules;
    existingHostel.subaccount = body.subaccount;
    existingHostel.rooms = newRooms;
    (existingHostel.whatsappcontact = body.whatsappcontact), // New field
      // Save updated hostel
      await existingHostel.save();

    return res.status(200).json({
      message: "Hostel updated successfully",
      status: true,
      updatedHostel: existingHostel,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error updating hostel", status: false });
  }
};

//
const updatemixedhostel = async (req, res) => {
  const { id } = req.params; // Hostel ID from URL
  let body = req.body; // Store request body

  try {
    // Find existing hostel by ID
    let existingHostel = await MixedhostelModel.findById(id);
    if (!existingHostel) {
      return res
        .status(404)
        .json({ message: "Hostel not found", status: false });
    }

    // Upload new image if provided
    let imageUrl = existingHostel.img_array;
    if (body.img_array) {
      const uploadedImage = await cloudinary.uploader.upload(body.img_array);
      imageUrl = uploadedImage.secure_url;
    }

    // Update the rooms array if room_count changes
    let newRooms = existingHostel.rooms;
    if (body.numbers_of_room !== existingHostel.room_count) {
      newRooms = [];
      for (let i = 1; i <= body.numbers_of_room; i++) {
        newRooms.push({
          room_id: i,
          availability: existingHostel.rooms[i - 1]?.availability || false, // Keep old availability if possible
          lease_start_date:
            existingHostel.rooms[i - 1]?.lease_start_date || null,
          lease_end_date: existingHostel.rooms[i - 1]?.lease_end_date || null,
        });
      }
    }

    // Update hostel details
    existingHostel.img_array = imageUrl;
    existingHostel.building_name = body.building_name;
    existingHostel.building_address = body.address;
    existingHostel.room_description = body.room_description;
    existingHostel.building_amenities = body.building_amenities;
    existingHostel.room_count = body.numbers_of_room;
    existingHostel.one_room_capacity = body.room_capacity;
    existingHostel.rent = body.rent;
    existingHostel.is_furnished = body.is_furnished;
    existingHostel.rules = body.building_rules;
    existingHostel.subaccount = body.subaccount;
    existingHostel.rooms = newRooms;
    (existingHostel.whatsappcontact = body.whatsappcontact), // New field
      // Save updated hostel
      await existingHostel.save();

    return res.status(200).json({
      message: "Hostel updated successfully",
      status: true,
      updatedHostel: existingHostel,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error updating hostel", status: false });
  }
};
const updatecoupleshostel = async (req, res) => {
  const { id } = req.params; // Hostel ID from URL
  let body = req.body; // Store request body

  try {
    // Find existing hostel by ID
    let existingHostel = await CoupleshostelModel.findById(id);
    if (!existingHostel) {
      return res
        .status(404)
        .json({ message: "Hostel not found", status: false });
    }

    // Upload new image if provided
    let imageUrl = existingHostel.img_array;
    if (body.img_array) {
      const uploadedImage = await cloudinary.uploader.upload(body.img_array);
      imageUrl = uploadedImage.secure_url;
    }

    // Update the rooms array if room_count changes
    let newRooms = existingHostel.rooms;
    if (body.numbers_of_room !== existingHostel.room_count) {
      newRooms = [];
      for (let i = 1; i <= body.numbers_of_room; i++) {
        newRooms.push({
          room_id: i,
          availability: existingHostel.rooms[i - 1]?.availability || false, // Keep old availability if possible
          lease_start_date:
            existingHostel.rooms[i - 1]?.lease_start_date || null,
          lease_end_date: existingHostel.rooms[i - 1]?.lease_end_date || null,
        });
      }
    }

    // Update hostel details
    existingHostel.img_array = imageUrl;
    existingHostel.building_name = body.building_name;
    existingHostel.building_address = body.address;
    existingHostel.room_description = body.room_description;
    existingHostel.building_amenities = body.building_amenities;
    existingHostel.room_count = body.numbers_of_room;
    existingHostel.one_room_capacity = body.room_capacity;
    existingHostel.rent = body.rent;
    existingHostel.is_furnished = body.is_furnished;
    existingHostel.rules = body.building_rules;
    existingHostel.subaccount = body.subaccount;
    existingHostel.rooms = newRooms;
    (existingHostel.whatsappcontact = body.whatsappcontact), // New field
      // Save updated hostel
      await existingHostel.save();

    return res.status(200).json({
      message: "Hostel updated successfully",
      status: true,
      updatedHostel: existingHostel,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Error updating hostel", status: false });
  }
};

//

const updatemaleBunkerOccupant = async (req, res) => {
  try {
    const { occupant, old_occupant, malehostel_id, bunkerdetails_id } =
      req.body;

    // 1️⃣ Find the hostel by ID
    const hostel = await MaleHostelModel.findById(malehostel_id);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    // 2️⃣ If there's a new occupant, validate them
    if (occupant) {
      const newOccupant = await UserModel.findOne({ matric_number: occupant });

      if (!newOccupant) {
        return res.status(400).json({ message: "New occupant not found" });
      }

      if (newOccupant.gender === "female") {
        return res
          .status(400)
          .json({ message: "Cannot assign a female to a male hostel" });
      }

      if (newOccupant.roomDetails.length > 0) {
        return res
          .status(400)
          .json({ message: "New occupant already has a room" });
      }
    }

    // 3️⃣ Find the correct bunker and update occupant
    let bunkerFound = false;
    hostel.bunkerDetails.forEach((bunker) => {
      if (bunker.id === bunkerdetails_id) {
        if (occupant) {
          bunker.occupant = occupant; // Assign new occupant
        } else {
          bunker.occupant = null; // Make the bunker empty if no new occupant
        }
        bunkerFound = true;
      }
    });

    if (!bunkerFound) {
      return res.status(400).json({ message: "Bunker not found" });
    }

    // 4️⃣ If there's an old occupant, remove their room details
    if (old_occupant) {
      await UserModel.updateOne(
        { matric_number: old_occupant },
        { $set: { roomDetails: [] } }
      );
    }

    // 5️⃣ If there is a new occupant, update their room details
    if (occupant) {
      await UserModel.updateOne(
        { matric_number: occupant },
        {
          $set: {
            roomDetails: [
              {
                hostel_type: "male school hostel",
                roomNumber: hostel.roomNumber,
                hostel_id: malehostel_id,
                bunker_id: bunkerdetails_id,
              },
            ],
          },
        }
      );
    }

    // 6️⃣ Mark `bunkerDetails` as modified and save
    hostel.markModified("bunkerDetails");
    await hostel.save();

    return res
      .status(200)
      .json({ message: "Bunker occupant updated successfully" });
  } catch (error) {
    console.error("Error updating bunker:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const updatefemaleBunkerOccupant = async (req, res) => {
  try {
    const { occupant, old_occupant, femalehostel_id, bunkerdetails_id } =
      req.body;

    // 1️⃣ Find the hostel by ID
    const hostel = await FemaleHostelModel.findById(femalehostel_id);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    // 2️⃣ If there's a new occupant, validate them
    if (occupant) {
      const newOccupant = await UserModel.findOne({ matric_number: occupant });

      if (!newOccupant) {
        return res.status(400).json({ message: "New occupant not found" });
      }

      if (newOccupant.gender === "male") {
        return res
          .status(400)
          .json({ message: "Cannot assign a male to a female hostel" });
      }

      if (newOccupant.roomDetails.length > 0) {
        return res
          .status(400)
          .json({ message: "New occupant already has a room" });
      }
    }

    // 3️⃣ Find the correct bunker and update occupant
    let bunkerFound = false;
    hostel.bunkerDetails.forEach((bunker) => {
      if (bunker.id === bunkerdetails_id) {
        if (occupant) {
          bunker.occupant = occupant; // Assign new occupant
        } else {
          bunker.occupant = null; // Make the bunker empty if no new occupant
        }
        bunkerFound = true;
      }
    });

    if (!bunkerFound) {
      return res.status(400).json({ message: "Bunker not found" });
    }

    // 4️⃣ If there's an old occupant, remove their room details
    if (old_occupant) {
      await UserModel.updateOne(
        { matric_number: old_occupant },
        { $set: { roomDetails: [] } }
      );
    }

    // 5️⃣ If there is a new occupant, update their room details
    if (occupant) {
      await UserModel.updateOne(
        { matric_number: occupant },
        {
          $set: {
            roomDetails: [
              {
                hostel_type: "female school hostel",
                roomNumber: hostel.roomNumber,
                hostel_id: femalehostel_id,
                bunker_id: bunkerdetails_id,
              },
            ],
          },
        }
      );
    }

    // 6️⃣ Mark `bunkerDetails` as modified and save
    hostel.markModified("bunkerDetails");
    await hostel.save();

    return res
      .status(200)
      .json({ message: "Bunker occupant updated successfully" });
  } catch (error) {
    console.error("Error updating bunker:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//
const updatePrivateMaleHostelOccupant = async (req, res) => {
  try {
    const { occupant, old_occupant, privatemalehostel_id, room_id } = req.body;

    // 1️⃣ Find the hostel by ID
    const hostel = await PrivatemaleHostelModel.findById(privatemalehostel_id);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    // 2️⃣ If there's a new occupant, validate them
    if (occupant) {
      const newOccupant = await UserModel.findOne({ matric_number: occupant });

      if (!newOccupant) {
        return res.status(400).json({ message: "New occupant not found" });
      }

      if (newOccupant.gender === "female") {
        return res
          .status(400)
          .json({ message: "Cannot assign a female to a male hostel" });
      }

      if (newOccupant.roomDetails.length > 0) {
        return res
          .status(400)
          .json({ message: "New occupant already has a room" });
      }
    }

    // 3️⃣ Find the correct room and update the occupant
    let roomFound = false;
    hostel.rooms.forEach((room) => {
      if (room.room_id === room_id) {
        if (occupant) {
          room.occupant = occupant; // Assign new occupant
          room.availability = true; // Mark room as occupied
        } else {
          room.occupant = null; // Make the room empty
          room.availability = false; // Mark room as available
        }
        roomFound = true;
      }
    });

    if (!roomFound) {
      return res.status(400).json({ message: "Room not found" });
    }

    // 4️⃣ If there's an old occupant, remove their room details
    if (old_occupant) {
      await UserModel.updateOne(
        { matric_number: old_occupant },
        { $set: { roomDetails: [] } }
      );
    }

    // 5️⃣ If there is a new occupant, update their room details
    if (occupant) {
      await UserModel.updateOne(
        { matric_number: occupant },
        {
          $set: {
            roomDetails: [
              {
                hostel_type: "private male hostel",
                hostel_name: hostel.building_name,
                roomNumber: room_id,
                hostel_id: privatemalehostel_id,
              },
            ],
          },
        }
      );
    }

    // 6️⃣ Mark `rooms` as modified and save
    hostel.markModified("rooms");
    await hostel.save();

    return res
      .status(200)
      .json({ message: "Room occupant updated successfully" });
  } catch (error) {
    console.error("Error updating room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const updatePrivateFemaleHostelOccupant = async (req, res) => {
  try {
    const { occupant, old_occupant, privatefemalehostel_id, room_id } =
      req.body;

    // 1️⃣ Find the hostel by ID
    const hostel = await PrivatefemaleHostelModel.findById(
      privatefemalehostel_id
    );
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    // 2️⃣ If there's a new occupant, validate them
    if (occupant) {
      const newOccupant = await UserModel.findOne({ matric_number: occupant });

      if (!newOccupant) {
        return res.status(400).json({ message: "New occupant not found" });
      }

      if (newOccupant.gender === "male") {
        return res
          .status(400)
          .json({ message: "Cannot assign a male to a female hostel" });
      }

      if (newOccupant.roomDetails.length > 0) {
        return res
          .status(400)
          .json({ message: "New occupant already has a room" });
      }
    }

    // 3️⃣ Find the correct room and update the occupant
    let roomFound = false;
    hostel.rooms.forEach((room) => {
      if (room.room_id === room_id) {
        if (occupant) {
          room.occupant = occupant; // Assign new occupant
          room.availability = true; // Mark room as occupied
        } else {
          room.occupant = null; // Make the room empty
          room.availability = false; // Mark room as available
        }
        roomFound = true;
      }
    });

    if (!roomFound) {
      return res.status(400).json({ message: "Room not found" });
    }

    // 4️⃣ If there's an old occupant, remove their room details
    if (old_occupant) {
      await UserModel.updateOne(
        { matric_number: old_occupant },
        { $set: { roomDetails: [] } }
      );
    }

    // 5️⃣ If there is a new occupant, update their room details
    if (occupant) {
      await UserModel.updateOne(
        { matric_number: occupant },
        {
          $set: {
            roomDetails: [
              {
                hostel_type: "private female hostel",
                hostel_name: hostel.building_name,
                roomNumber: room_id,
                hostel_id: privatefemalehostel_id,
              },
            ],
          },
        }
      );
    }

    // 6️⃣ Mark `rooms` as modified and save
    hostel.markModified("rooms");
    await hostel.save();

    return res
      .status(200)
      .json({ message: "Room occupant updated successfully" });
  } catch (error) {
    console.error("Error updating room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const updatePrivateMixedHostelOccupant = async (req, res) => {
  try {
    const { occupant, old_occupant, privatemixedhostel_id, room_id } = req.body;

    // 1️⃣ Find the hostel by ID
    const hostel = await MixedhostelModel.findById(privatemixedhostel_id);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    // 2️⃣ If there's a new occupant, validate them
    if (occupant) {
      const newOccupant = await UserModel.findOne({ matric_number: occupant });

      if (!newOccupant) {
        return res.status(400).json({ message: "New occupant not found" });
      }

      // if (newOccupant.gender === "male") {
      //   return res
      //     .status(400)
      //     .json({ message: "Cannot assign a male to a female hostel" });
      // }
      // // commenting this allow user of both gender

      if (newOccupant.roomDetails.length > 0) {
        return res
          .status(400)
          .json({ message: "New occupant already has a room" });
      }
    }

    // 3️⃣ Find the correct room and update the occupant
    let roomFound = false;
    hostel.rooms.forEach((room) => {
      if (room.room_id === room_id) {
        if (occupant) {
          room.occupant = occupant; // Assign new occupant
          room.availability = true; // Mark room as occupied
        } else {
          room.occupant = null; // Make the room empty
          room.availability = false; // Mark room as available
        }
        roomFound = true;
      }
    });

    if (!roomFound) {
      return res.status(400).json({ message: "Room not found" });
    }

    // 4️⃣ If there's an old occupant, remove their room details
    if (old_occupant) {
      await UserModel.updateOne(
        { matric_number: old_occupant },
        { $set: { roomDetails: [] } }
      );
    }

    // 5️⃣ If there is a new occupant, update their room details
    if (occupant) {
      await UserModel.updateOne(
        { matric_number: occupant },
        {
          $set: {
            roomDetails: [
              {
                hostel_type: "private mixed hostel",
                hostel_name: hostel.building_name,
                roomNumber: room_id,
                hostel_id: privatemixedhostel_id,
              },
            ],
          },
        }
      );
    }

    // 6️⃣ Mark `rooms` as modified and save
    hostel.markModified("rooms");
    await hostel.save();

    return res
      .status(200)
      .json({ message: "Room occupant updated successfully" });
  } catch (error) {
    console.error("Error updating room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
const updatePrivateCouplesHostelOccupant = async (req, res) => {
  try {
    const { occupant, old_occupant, privatecoupleshostel_id, room_id } =
      req.body;

    // 1️⃣ Find the hostel by ID
    const hostel = await CoupleshostelModel.findById(privatecoupleshostel_id);
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found" });
    }

    // 2️⃣ If there's a new occupant, validate them
    if (occupant) {
      const newOccupant = await UserModel.findOne({ matric_number: occupant });

      if (!newOccupant) {
        return res.status(400).json({ message: "New occupant not found" });
      }

      // if (newOccupant.gender === "male") {
      //   return res
      //     .status(400)
      //     .json({ message: "Cannot assign a male to a female hostel" });
      // }
      // // commenting this allow user of both gender

      if (newOccupant.roomDetails.length > 0) {
        return res
          .status(400)
          .json({ message: "New occupant already has a room" });
      }
    }

    // 3️⃣ Find the correct room and update the occupant
    let roomFound = false;
    hostel.rooms.forEach((room) => {
      if (room.room_id === room_id) {
        if (occupant) {
          room.occupant = occupant; // Assign new occupant
          room.availability = true; // Mark room as occupied
        } else {
          room.occupant = null; // Make the room empty
          room.availability = false; // Mark room as available
        }
        roomFound = true;
      }
    });

    if (!roomFound) {
      return res.status(400).json({ message: "Room not found" });
    }

    // 4️⃣ If there's an old occupant, remove their room details
    if (old_occupant) {
      await UserModel.updateOne(
        { matric_number: old_occupant },
        { $set: { roomDetails: [] } }
      );
    }

    // 5️⃣ If there is a new occupant, update their room details
    if (occupant) {
      await UserModel.updateOne(
        { matric_number: occupant },
        {
          $set: {
            roomDetails: [
              {
                hostel_type: "private couples hostel",
                hostel_name: hostel.building_name,
                roomNumber: room_id,
                hostel_id: privatecoupleshostel_id,
              },
            ],
          },
        }
      );
    }

    // 6️⃣ Mark `rooms` as modified and save
    hostel.markModified("rooms");
    await hostel.save();

    return res
      .status(200)
      .json({ message: "Room occupant updated successfully" });
  } catch (error) {
    console.error("Error updating room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//
const payformaleschoolhostel = async (req, res) => {
  console.log("Paystack Secret Key:", process.env.PAYSTACK_SECRET_KEY);

  try {
    const { email, amount, hostel_id, bunker_id, matric_number } = req.body;
    console.log("Received request:", req.body);

    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Convert Naira to Kobo
        currency: "NGN",
        metadata: { hostel_id, bunker_id, matric_number },
        callback_url:
          "http://localhost:5173/dashboard/Payment_successfull_formaleschoolhostel", // Redirect after payment
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Paystack Response:", paystackResponse.data);
    res.json(paystackResponse.data);
  } catch (error) {
    console.error(
      "Payment initiation failed:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Payment initiation failed",
      details: error.response?.data || error.message,
    });
  }
};

const verifypaymentformaleschoolhostel = async (req, res) => {
  try {
    const { reference } = req.params;

    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (paystackResponse.data.data.status === "success") {
      const { hostel_id, bunker_id, matric_number } =
        paystackResponse.data.data.metadata;

      // 🔥 Update the hostel: Assign user to the bunker
      const hostel = await MaleHostelModel.findOneAndUpdate(
        { _id: hostel_id, "bunkerDetails.id": bunker_id },
        { $set: { "bunkerDetails.$.occupant": matric_number } },
        { new: true }
      );

      // 🔥 Update the user's profile with room details and payment history
      const ifusermatricnumber = await UserModel.findOneAndUpdate(
        { matric_number },
        {
          $set: {
            roomDetails: [
              {
                hostel_type: "male school hostel",
                roomNumber: hostel.roomNumber,
                hostel_id: hostel_id,
                bunker_id: bunker_id,
              },
            ],
          },
          $push: {
            payment_history: {
              reference: reference,
              amount: paystackResponse.data.data.amount / 100, // Convert from kobo to Naira
              hostel_type: "male school hostel",
              hostel_id: hostel_id,
              // // Assuming hostel has a 'hostelName' field
              room_number: hostel.roomNumber,
              bunker_id: bunker_id,
              payment_time: new Date(), // Store the current time
            },
          },
        },
        { new: true }
      );

      const token = await jsonwebtoken.sign({ matric_number }, "secretkey", {
        expiresIn: "1d",
      });

      const user_details = {
        message: "login successful",
        status: true,
        ifusermatricnumber,
        token,
      };

      res.json({
        success: true,
        message: "Payment verified, room booked",
        user_details,
        hostel,
      });
    } else {
      res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

const payforfemaleschoolhostel = async (req, res) => {
  console.log("Paystack Secret Key:", process.env.PAYSTACK_SECRET_KEY);

  try {
    const { email, amount, hostel_id, bunker_id, matric_number } = req.body;
    console.log("Received request:", req.body);

    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Convert Naira to Kobo
        currency: "NGN",
        metadata: { hostel_id, bunker_id, matric_number },
        callback_url:
          "http://localhost:5173/dashboard/Payment_successfull_forfemaleschoolhostel", // Redirect after payment
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Paystack Response:", paystackResponse.data);
    res.json(paystackResponse.data);
  } catch (error) {
    console.error(
      "Payment initiation failed:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Payment initiation failed",
      details: error.response?.data || error.message,
    });
  }
};

const verifypaymentforfemaleschoolhostel = async (req, res) => {
  try {
    const { reference } = req.params;

    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (paystackResponse.data.data.status === "success") {
      const { hostel_id, bunker_id, matric_number } =
        paystackResponse.data.data.metadata;

      // 🔥 Update the hostel: Assign user to the bunker
      const hostel = await FemaleHostelModel.findOneAndUpdate(
        { _id: hostel_id, "bunkerDetails.id": bunker_id },
        { $set: { "bunkerDetails.$.occupant": matric_number } },
        { new: true }
      );

      // 🔥 Update the user's profile with room details
      const ifusermatricnumber = await UserModel.findOneAndUpdate(
        { matric_number },
        {
          $set: {
            roomDetails: [
              {
                hostel_type: "female school hostel",
                roomNumber: hostel.roomNumber,
                hostel_id: hostel_id,
                bunker_id: bunker_id,
              },
            ],
          },
          $push: {
            payment_history: {
              reference: reference,
              amount: paystackResponse.data.data.amount / 100, // Convert from kobo to Naira
              hostel_type: "female school hostel",
              hostel_id: hostel_id,
              // // Assuming hostel has a 'hostelName' field
              room_number: hostel.roomNumber,
              bunker_id: bunker_id,
              payment_time: new Date(), // Store the current time
            },
          },
        },
        { new: true }
      );

      const token = await jsonwebtoken.sign({ matric_number }, "secretkey", {
        expiresIn: "1d",
      });

      const user_details = {
        message: "login successful",
        status: true,
        ifusermatricnumber,
        token,
      };

      res.json({
        success: true,
        message: "Payment verified, room booked",
        user_details,
        hostel,
      });
    } else {
      res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

//
const payformaleprivatehostel = async (req, res) => {
  console.log("Paystack Secret Key:", process.env.PAYSTACK_SECRET_KEY);

  try {
    const {
      email,
      amount,
      privatemalehostel_id,
      room_id,
      matric_number,
      subaccount,
    } = req.body;
    console.log("Received request:", req.body);
    console.log(email);
    console.log(amount);
    console.log(privatemalehostel_id);
    console.log(room_id);
    console.log(matric_number);

    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Convert Naira to Kobo
        currency: "NGN",
        metadata: { privatemalehostel_id, room_id, matric_number },
        callback_url:
          "http://localhost:5173/dashboard/Payment_successfullforprivatemalehostel",
        subaccount, // Attach the subaccount to split the payment
        bearer: "subaccount", // The subaccount bears the transaction charges
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Paystack Response:", paystackResponse.data);
    res.json(paystackResponse.data);
  } catch (error) {
    console.error(
      "Payment initiation failed:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Payment initiation failed",
      details: error.response?.data || error.message,
    });
  }
};

const verifypaymentformaleprivatehostel = async (req, res) => {
  try {
    const { reference } = req.params;

    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (paystackResponse.data.data.status === "success") {
      const { privatemalehostel_id, room_id, matric_number } =
        paystackResponse.data.data.metadata;
      console.log("testing details");
      console.log(privatemalehostel_id);
      console.log(room_id);
      console.log(matric_number);

      // 🔥 Update the hostel: Assign user to the room
      const hostel = await PrivatemaleHostelModel.findOneAndUpdate(
        { _id: privatemalehostel_id, "rooms.room_id": Number(room_id) }, // Use "rooms.room_id" instead of "rooms.id"
        {
          $set: {
            "rooms.$.occupant": matric_number,
            "rooms.$.availability": true,
          },
        },
        { new: true }
      );

      // 🔥 Update the user's profile with room details
      const ifusermatricnumber = await UserModel.findOneAndUpdate(
        { matric_number },
        {
          $set: {
            roomDetails: [
              {
                hostel_type: "private male hostel",
                hostel_name: hostel.building_name,
                roomNumber: room_id,
                hostel_id: privatemalehostel_id,
              },
            ],
          },
          $push: {
            payment_history: {
              reference: reference,
              amount: paystackResponse.data.data.amount / 100, // Convert from kobo to Naira
              hostel_type: " private male hostel",
              hostel_id: privatemalehostel_id,
              // // Assuming hostel has a 'hostelName' field
              hostel_name: hostel.building_name,
              roomNumber: room_id,
              payment_time: new Date(), // Store the current time
            },
          },
        },
        { new: true }
      );

      const token = await jsonwebtoken.sign({ matric_number }, "secretkey", {
        expiresIn: "1d",
      });

      const user_details = {
        message: "login successful",
        status: true,
        ifusermatricnumber,
        token,
      };

      res.json({
        success: true,
        message: "Payment verified, room booked",
        user_details,
        hostel,
      });
    } else {
      res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

const payforfemaleprivatehostel = async (req, res) => {
  console.log("Paystack Secret Key:", process.env.PAYSTACK_SECRET_KEY);

  try {
    const {
      email,
      amount,
      privatefemalehostel_id,
      room_id,
      matric_number,
      subaccount,
    } = req.body;
    console.log("Received request:", req.body);
    console.log(email);
    console.log(amount);
    console.log(privatefemalehostel_id);
    console.log(room_id);
    console.log(matric_number);

    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Convert Naira to Kobo
        currency: "NGN",
        metadata: { privatefemalehostel_id, room_id, matric_number },
        callback_url:
          "http://localhost:5173/dashboard/Payment_successfullforprivatefemalehostel",
        subaccount, // Attach the subaccount to split the payment
        bearer: "subaccount", // The subaccount bears the transaction charges
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Paystack Response:", paystackResponse.data);
    res.json(paystackResponse.data);
  } catch (error) {
    console.error(
      "Payment initiation failed:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Payment initiation failed",
      details: error.response?.data || error.message,
    });
  }
};

const verifypaymentforfemaleprivatehostel = async (req, res) => {
  try {
    const { reference } = req.params;

    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (paystackResponse.data.data.status === "success") {
      const { privatefemalehostel_id, room_id, matric_number } =
        paystackResponse.data.data.metadata;
      console.log("testing details");
      console.log(privatefemalehostel_id);
      console.log(room_id);
      console.log(matric_number);

      // 🔥 Update the hostel: Assign user to the room
      const hostel = await PrivatefemaleHostelModel.findOneAndUpdate(
        { _id: privatefemalehostel_id, "rooms.room_id": Number(room_id) }, // Use "rooms.room_id" instead of "rooms.id"
        {
          $set: {
            "rooms.$.occupant": matric_number,
            "rooms.$.availability": true,
          },
        },
        { new: true }
      );

      // 🔥 Update the user's profile with room details
      const ifusermatricnumber = await UserModel.findOneAndUpdate(
        { matric_number },
        {
          $set: {
            roomDetails: [
              {
                hostel_type: "private female hostel",
                hostel_name: hostel.building_name,
                roomNumber: room_id,
                hostel_id: privatefemalehostel_id,
              },
            ],
          },
          $push: {
            payment_history: {
              reference: reference,
              amount: paystackResponse.data.data.amount / 100, // Convert from kobo to Naira
              hostel_type: " private female hostel",
              hostel_id: privatefemalehostel_id,
              // // Assuming hostel has a 'hostelName' field
              hostel_name: hostel.building_name,
              roomNumber: room_id,
              payment_time: new Date(), // Store the current time
            },
          },
        },
        { new: true }
      );

      const token = await jsonwebtoken.sign({ matric_number }, "secretkey", {
        expiresIn: "1d",
      });

      const user_details = {
        message: "login successful",
        status: true,
        ifusermatricnumber,
        token,
      };

      res.json({
        success: true,
        message: "Payment verified, room booked",
        user_details,
        hostel,
      });
    } else {
      res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

const payformixedprivatehostel = async (req, res) => {
  console.log("Paystack Secret Key:", process.env.PAYSTACK_SECRET_KEY);

  try {
    const {
      email,
      amount,
      privatemixedhostel_id,
      room_id,
      matric_number,
      subaccount,
    } = req.body;
    console.log("Received request:", req.body);
    console.log(email);
    console.log(amount);
    console.log(privatemixedhostel_id);
    console.log(room_id);
    console.log(matric_number);

    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Convert Naira to Kobo
        currency: "NGN",
        metadata: { privatemixedhostel_id, room_id, matric_number },
        callback_url:
          "http://localhost:5173/dashboard/Payment_successfullforprivatemixedhostel",
        subaccount, // Attach the subaccount to split the payment
        bearer: "subaccount", // The subaccount bears the transaction charges
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Paystack Response:", paystackResponse.data);
    res.json(paystackResponse.data);
  } catch (error) {
    console.error(
      "Payment initiation failed:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Payment initiation failed",
      details: error.response?.data || error.message,
    });
  }
};

const verifypaymentformixedprivatehostel = async (req, res) => {
  try {
    const { reference } = req.params;

    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (paystackResponse.data.data.status === "success") {
      const { privatemixedhostel_id, room_id, matric_number } =
        paystackResponse.data.data.metadata;
      console.log("testing details");
      console.log(privatemixedhostel_id);
      console.log(room_id);
      console.log(matric_number);

      // 🔥 Update the hostel: Assign user to the room
      const hostel = await MixedhostelModel.findOneAndUpdate(
        { _id: privatemixedhostel_id, "rooms.room_id": Number(room_id) }, // Use "rooms.room_id" instead of "rooms.id"
        {
          $set: {
            "rooms.$.occupant": matric_number,
            "rooms.$.availability": true,
          },
        },
        { new: true }
      );

      // 🔥 Update the user's profile with room details
      const ifusermatricnumber = await UserModel.findOneAndUpdate(
        { matric_number },
        {
          $set: {
            roomDetails: [
              {
                hostel_type: "private mixed hostel",
                hostel_name: hostel.building_name,
                roomNumber: room_id,
                hostel_id: privatemixedhostel_id,
              },
            ],
          },
          $push: {
            payment_history: {
              reference: reference,
              amount: paystackResponse.data.data.amount / 100, // Convert from kobo to Naira
              hostel_type: " private mixed hostel",
              hostel_id: privatemixedhostel_id,
              // // Assuming hostel has a 'hostelName' field
              hostel_name: hostel.building_name,
              roomNumber: room_id,
              payment_time: new Date(), // Store the current time
            },
          },
        },
        { new: true }
      );

      const token = await jsonwebtoken.sign({ matric_number }, "secretkey", {
        expiresIn: "1d",
      });

      const user_details = {
        message: "login successful",
        status: true,
        ifusermatricnumber,
        token,
      };

      res.json({
        success: true,
        message: "Payment verified, room booked",
        user_details,
        hostel,
      });
    } else {
      res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

const payforcouplesprivatehostel = async (req, res) => {
  console.log("Paystack Secret Key:", process.env.PAYSTACK_SECRET_KEY);

  try {
    const {
      email,
      amount,
      privatecoupleshostel_id,
      room_id,
      matric_number,
      subaccount,
    } = req.body;
    console.log("Received request:", req.body);
    console.log(email);
    console.log(amount);
    console.log(privatecoupleshostel_id);
    console.log(room_id);
    console.log(matric_number);

    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Convert Naira to Kobo
        currency: "NGN",
        metadata: { privatecoupleshostel_id, room_id, matric_number },
        callback_url:
          "http://localhost:5173/dashboard/Payment_successfullforprivatcoupleshostel",
        subaccount, // Attach the subaccount to split the payment
        bearer: "subaccount", // The subaccount bears the transaction charges
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Paystack Response:", paystackResponse.data);
    res.json(paystackResponse.data);
  } catch (error) {
    console.error(
      "Payment initiation failed:",
      error.response?.data || error.message
    );
    res.status(500).json({
      error: "Payment initiation failed",
      details: error.response?.data || error.message,
    });
  }
};

const verifypaymentforcouplesprivatehostel = async (req, res) => {
  try {
    const { reference } = req.params;

    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (paystackResponse.data.data.status === "success") {
      const { privatecoupleshostel_id, room_id, matric_number } =
        paystackResponse.data.data.metadata;
      console.log("testing details");
      console.log(privatecoupleshostel_id);
      console.log(room_id);
      console.log(matric_number);

      // 🔥 Update the hostel: Assign user to the room
      const hostel = await CoupleshostelModel.findOneAndUpdate(
        { _id: privatecoupleshostel_id, "rooms.room_id": Number(room_id) }, // Use "rooms.room_id" instead of "rooms.id"
        {
          $set: {
            "rooms.$.occupant": matric_number,
            "rooms.$.availability": true,
          },
        },
        { new: true }
      );

      // 🔥 Update the user's profile with room details
      const ifusermatricnumber = await UserModel.findOneAndUpdate(
        { matric_number },
        {
          $set: {
            roomDetails: [
              {
                hostel_type: "private couples hostel",
                hostel_name: hostel.building_name,
                roomNumber: room_id,
                hostel_id: privatecoupleshostel_id,
              },
            ],
          },
          $push: {
            payment_history: {
              reference: reference,
              amount: paystackResponse.data.data.amount / 100, // Convert from kobo to Naira
              hostel_type: " private couples hostel",
              hostel_id: privatecoupleshostel_id,
              // // Assuming hostel has a 'hostelName' field
              hostel_name: hostel.building_name,
              roomNumber: room_id,
              payment_time: new Date(), // Store the current time
            },
          },
        },
        { new: true }
      );

      const token = await jsonwebtoken.sign({ matric_number }, "secretkey", {
        expiresIn: "1d",
      });

      const user_details = {
        message: "login successful",
        status: true,
        ifusermatricnumber,
        token,
      };

      res.json({
        success: true,
        message: "Payment verified, room booked",
        user_details,
        hostel,
      });
    } else {
      res.status(400).json({ error: "Payment failed" });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

// upload profile image for user

const uploadProfileImage = async (req, res) => {
  try {
    const { matric_number, img_array } = req.body;
    console.log(req.body);
    console.log(matric_number);
    console.log(img_array);

    if (!matric_number || !img_array) {
      return res
        .status(400)
        .json({ message: "Matric number and image data are required" });
    }

    // Find the user by matric number
    const user = await UserModel.findOne({ matric_number });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Upload image to Cloudinary
    const image = await cloudinary.uploader.upload(img_array);
    console.log(image);

    // Update user profile image
    user.profileImage = image.secure_url;
    await user.save();

    res.json({
      message: "Profile image updated successfully",
      profileImage: image.secure_url,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
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
};
