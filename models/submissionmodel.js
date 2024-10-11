const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // Reference to student
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },   // Reference to tagged admin
  data: { type: Object, required: true },  // JSON object submitted by the student
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }  // Submission status
});

//module.exports = mongoose.model("Submission", submissionSchema);
module.exports = submissionSchema;
