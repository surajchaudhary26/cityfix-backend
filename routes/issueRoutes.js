const express = require("express");
const issueController = require("../controllers/issueController");
const authController = require('../controllers/authController');
const router = express.Router();

const multer = require('multer');
const { storage } = require('../utils/cloudinary');
const upload = multer({ storage: storage });
// Update your POST route to include upload.single('image')
router.post('/', 
  authController.protect, 
  upload.single('image'), // 'image' is the key name in Thunder Client
  issueController.createIssue
);

// Define the route: POST /api/v1/issues
// Professional way: Chain multiple methods to the same route
router
  .route("/")
  .get(issueController.getAllIssues)
  .post(authController.protect, issueController.createIssue); // 🛡️ PROTECTED

// Professional chaining for routes that require an ID
router
  .route("/:id")
  .get(issueController.getIssue)
  .patch(issueController.updateIssue) // PATCH is for partial updates
  .delete(
     authController.protect, 
     authController.restrictTo('admin'), // 🛡️ Only admins can delete!
     issueController.deleteIssue
  );

module.exports = router;