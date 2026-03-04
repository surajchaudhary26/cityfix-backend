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
        values: ["Roads", "Water", "Electricity", "Waste", "Sewage", "Other"],
        message: "Category must be: Roads, Water, Electricity, Waste, Sewage, or Other",
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
      type: String, 
      default: "default-issue.jpg",
    },
    // ⭐ ADDED THIS FIELD: This creates the link to the User model
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'An issue must belong to a user.']
    }
  },
  { timestamps: true }
);

// ✅ FIXED MIDDLEWARE: Removed 'next' to prevent the "not a function" error
issueSchema.pre(/^find/, function() {
  this.populate({
    path: 'user',        
    select: 'name email' 
  });
  // No next() needed for modern Mongoose find hooks
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;