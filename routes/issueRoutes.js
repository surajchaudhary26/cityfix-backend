const express = require("express");
const issueController = require("../controllers/issueController");

const router = express.Router();

// Define the route: POST /api/v1/issues

// Professional way: Chain multiple methods to the same route
router
    .route("/")
    .post(issueController.createIssue)
    .get(issueController.getAllIssues);

// Professional chaining for routes that require an ID
router
  .route("/:id")
  .get(issueController.getIssue)
  .patch(issueController.updateIssue) // PATCH is for partial updates
  .delete(issueController.deleteIssue);

module.exports = router;