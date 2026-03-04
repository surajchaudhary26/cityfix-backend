const Issue = require("../models/Issue");
const AppError = require("../utils/AppError");

// This function handles the "POST" request to create a new report
exports.createIssue = async (req, res, next) => {
    try {
        // 1. Create the issue in the database using the data from the user (req.body)
        const newIssue = await Issue.create(req.body);

        // 2. Send a success response back to the citizen
        res.status(201).json({
            status: "success",
            data: {
                issue: newIssue
            }
        });
    } catch (err) {
        // If something goes wrong (like a missing title), send it to our Error Handler
        next(err);
    }
};

// This function fetches every issue in the database
exports.getAllIssues = async (req, res, next) => {
    try {
        // .find() with no arguments gets EVERYTHING in the collection
        const issues = await Issue.find();

        res.status(200).json({
            status: "success",
            results: issues.length,
            data: {
                issues
            }
        });
    } catch (err) {
        next(err);
    }
};

// This function fetches a single issue using the ID from the URL
exports.getIssue = async (req, res, next) => {
    try {
        // req.params.id comes from the ":id" in our route
        const issue = await Issue.findById(req.params.id);

        // If no issue is found with that ID, send a 404 error
        if (!issue) {
            return next(new AppError('No issue found with that ID', 404));
        }

        res.status(200).json({
            status: 'success',
            data: {
                issue
            }
        });
    } catch (err) {
        next(err);
    }
};

// Update an Issue (e.g., change status)
exports.updateIssue = async (req, res, next) => {
    try {
        const issue = await Issue.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Returns the updated document instead of the old one
            runValidators: true // Ensures the new data follows the Schema rules
        });

        if (!issue) return next(new AppError('No issue found with that ID', 404));

        res.status(200).json({
            status: 'success',
            data: { issue }
        });
    } catch (err) {
        next(err);
    }
};

// Delete an Issue
exports.deleteIssue = async (req, res, next) => {
    try {
        const issue = await Issue.findByIdAndDelete(req.params.id);

        if (!issue) return next(new AppError('No issue found with that ID', 404));

        // 204 means "No Content" - the standard for successful deletion
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        next(err);
    }
};