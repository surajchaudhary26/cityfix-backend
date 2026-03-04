const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "An issue must have a title"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please describe the civic issue"],
    },
    category: {
      type: String,
      required: [true, "An issue must belong to a category"],
      enum: {
        values: ["Roads", "Water", "Electricity", "Waste", "Other"],
        message: "Category must be: Roads, Water, Electricity, Waste, or Other",
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "In Progress", "Resolved", "Rejected"],
      default: "Pending",
    },
    address: {
      type: String,
      required: [true, "Please provide the location of the issue"],
    },
    imageUrl: {
      type: String, // We will store the Cloudinary link here later
      default: "default-issue.jpg",
    },
    // We use timestamps to automatically track when it was reported/updated
  },
  { timestamps: true }
);


const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;