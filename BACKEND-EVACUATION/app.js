const express = require("express");
const app = express();

const mongoose = require("mongoose");

const mongoURL = "mongodb+srv://prince:Paquiado102002@backenddb.fdt4dur.mongodb.net/ShelterGuard";
mongoose.connect(mongoURL).then(() => {
    console.log("Database connected");
}).catch((e) => {
    console.log(e);
});

require("./models/User");
const User = mongoose.model("User");

require("./models/calamityModel");
const Calamity = mongoose.model("Calamity");

require("./models/evacuationCenterModel");
const EvacuationCenter = mongoose.model("EvacuationCenter");

require("./models/calamityAssignmentModel");
const CalamityAssignment = mongoose.model("CalamityAssignment");

require("./models/resourcesModel");
const Resource = mongoose.model("Resource");

require("./models/evacueeAssignmentModel");
const EvacueeAssignment = mongoose.model("EvacueeAssignment");

app.use(express.json()); // Add this line to parse incoming JSON data

app.get("/", (req, res) => {
    res.send({ status: "Started" });
});

app.listen(8000, () => {
    console.log("Node Server Started");
});

app.get("/get-users", async (req, res) => {
    try {
        const users = await User.find();
        if (!users || users.length === 0) {
            return res.status(404).send({ message: "No users found" });
        }
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send({ message: "Error fetching users" });
    }
});

app.get("/get-calamities", async (req, res) => {
    try {
      const calamities = await Calamity.find();  // Fetches all calamities from the database
      if (!calamities || calamities.length === 0) {
        return res.status(404).send({ message: "No calamities found" });
      }
      res.status(200).json(calamities);  // Sends the calamities in response
    } catch (error) {
      console.error("Error fetching calamities:", error);
      res.status(500).send({ message: "Error fetching calamities" });
    }
  });

app.get("/get-evacuationcenters", async (req, res) => {
    try {
      const evacuationcenters = await EvacuationCenter.find();  // Fetches all evacuationcenters from the database
      if (!evacuationcenters || evacuationcenters.length === 0) {
        return res.status(404).send({ message: "No evacuationcenters found" });
      }
      res.status(200).json(evacuationcenters);  // Sends the evacuationcenters in response
    } catch (error) {
      console.error("Error fetching evacuationcenters:", error);
      res.status(500).send({ message: "Error fetching evacuationcenters" });
    }
  });
app.post("/assignment/evacuees", async (req, res) => {
  try {
    const { evacuee, center, resourcesAccepted } = req.body;
    
    const evacuationCenter = await EvacuationCenter.findById(center);
    if (!evacuationCenter) {
      return res.status(404).json({ error: "Evacuation center not found." });
    }

    const calamityAssignment = await CalamityAssignment.findOne({ center }).populate("calamity");
    if (!calamityAssignment) {
      return res.status(404).json({ error: "Calamity assignment not found for the given center." });
    }

    const calamityId = calamityAssignment.calamity._id;
    console.log("Calamity ID:", calamityId);

    const status = {
      "attendance": "checked in",
      "time": {
        "enRoute": new Date(),
        "checkIn": new Date(),
        "checkOut": null 
      },
    };

    // Check for required fields
    if (!evacuee || !center || !resourcesAccepted) {
      return res.status(400).json({ error: "Missing fields." });
    }
  
    // Check for duplicate evacuee assignment
    const hasDuplicate = await checkDuplicateEvacueeAssignment(null, evacuee, calamityId);
    if (hasDuplicate) {
      return res.status(409).json({
        error: "Evacuee assignment already exists.",
      });
    }
  
    const newEvacueeAssignment = new EvacueeAssignment({
      evacuee,
      center,
      calamity: calamityId,
      resourcesAccepted,
      status,
    });
  
    await newEvacueeAssignment.save();
    console.log("Evacuee assignment saved:", newEvacueeAssignment);
    return res.status(201).json({ success: "Evacuee assignment saved!" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: error.message });
  }
});
const checkDuplicateEvacueeAssignment = async (
  evacueeAssignmentId,
  evacueeId,
  calamityId
) => {
  const existingEvacueeAssignment = await EvacueeAssignment.findOne({
    $and: [{ evacuee: evacueeId }, { calamity: calamityId }],
    _id: { $ne: evacueeAssignmentId }, // * exclude the current document from the check
  });
  return existingEvacueeAssignment;
};

app.get('/evacuees', async (req, res) => {
  try{
    const evacuees = await EvacueeAssignment.find()
      .populate("evacuee")
      .populate("center")
      .populate("calamity")
      .populate("resourcesAccepted.resource");

    return res
      .status(200)
      .json({ success: "All evacuees", evacuees });
  }catch(error){
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});
app.get('/evacuees/evacuee/:evacueeId', async (req, res) => {
  try {
    const evacueeId = req.params.evacueeId;

    // Find all assignments for the given evacuee ID
    const assignments = await EvacueeAssignment.find({ evacuee: evacueeId })
      .populate("evacuee")
      .populate("center")
      .populate("calamity")
      .populate("resourcesAccepted.resource");

    if (!assignments || assignments.length === 0) {
       return res.status(200).json({ error: "No assignments found for this evacuee" });
    }

    return res.status(200).json({ success: "Assignments found", assignments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.get('/centers', async (req, res) => {
  try {
    const assignments = await CalamityAssignment.find()
      .populate("center")
      .populate("calamity")
      .populate("resources.resource");

    return res
      .status(200)
      .json({ success: "All calamity assignments", assignments });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
});

app.get("/get-resources", async (req, res) => {
    try {
      const resources = await Resource.find();  // Fetches all resources from the database
      if (!resources || resources.length === 0) {
        return res.status(404).send({ message: "No resources found" });
      }
      res.status(200).json(resources);  // Sends the resources in response
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).send({ message: "Error fetching resources" });
    }
  });

app.post("/login-user", async (req, res) => {
    const { username, password } = req.body;
    console.log("Received username:", username);

    const existingUser = await User.findOne({ username });

    if (!existingUser) {
        console.log("User does not exist!");
        return res.status(404).send({ message: "User doesn't exist!" });
    }

    const { password: _, ...userWithoutPassword } = existingUser.toObject();
    console.log("User found:", userWithoutPassword);

    // Direct password comparison (assuming passwords are stored as plain text or using another hashing method)
    if (existingUser.password !== password) {
        return res.status(401).send({ message: "Incorrect password!" });
    }

    res.status(200).send({ role: existingUser.role, message: "Login successful" , user: userWithoutPassword });
});

app.post("/evacuee-application", async (req, res) => {
  const { name, role, username, password, address,  centerName, centerID, contactInfo, additionalDetails } = req.body;

  // Simple validation
  if (!name || !role || !username || !password) {
      return res.status(400).send({ message: "Missing required fields" });
  }

  try {
      const newApplication = new User({
          name,
          role,
          username,
          password,
          address,
          centerName,
          centerID,
          contactInfo,
          additionalDetails
      });

      await newApplication.save();
      res.status(200).send({ message: "Application submitted successfully" });
  } catch (error) {
      console.error("Error saving application:", error);
      res.status(500).send({ message: "Server error. Please try again." });
  }
});