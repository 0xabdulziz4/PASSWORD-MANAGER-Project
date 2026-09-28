const express = require("express");
const { body, validationResult } = require("express-validator");
const mysql = require("mysql2");

const app = express();

// Set up the database connection pool
const pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "passwordmanager",
  port: 3306,
});

// Middleware for parsing JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to edit a record
app.put(
  "/editRecord/:id",
  [
    body("website").notEmpty().withMessage("Website is required."),
    body("username").notEmpty().withMessage("Username is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { website, username, password } = req.body;

    const query =
      "UPDATE vault SET website = ?, username = ?, password = ? WHERE id = ?";
    pool.query(query, [website, username, password, id], (err, results) => {
      if (err) {
        console.error("Error updating record:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Record not found" });
      }
      res
        .status(200)
        .json({ success: true, message: "Record updated successfully" });
    });
  }
);

// Route to insert a record
app.post(
  "/insert",
  [
    body("website").notEmpty().withMessage("Website is required."),
    body("username").notEmpty().withMessage("Username is required."),
    body("password").notEmpty().withMessage("Password is required."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { website, username, password } = req.body;

    const query =
      "INSERT INTO vault (website, username, password) VALUES (?, ?, ?)";
    pool.query(query, [website, username, password], (err, results) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ error: "Database error" });
      }
      res.status(200).json({ message: "Data inserted successfully!" });
    });
  }
);

// Route to view all records
app.get("/view", (req, res) => {
  const query = "SELECT * FROM vault";
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.status(200).json(results);
  });
});

// Route to delete a record
app.delete("/deleteRecord/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM vault WHERE id = ?";
  pool.query(query, [id], (err, results) => {
    if (err) {
      console.error("Error deleting record:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Record not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Record deleted successfully" });
  });
});

// Route to handle contact form submission
app.post(
  "/submit-contact",
  [
    body("firstName").notEmpty().withMessage("First name is required."),
    body("lastName").notEmpty().withMessage("Last name is required."),
    body("gender")
      .isIn(["male", "female"])
      .withMessage("Gender must be either Male or Female."),
    body("mobile").isMobilePhone().withMessage("Invalid mobile number format."),
    body("dob")
      .isISO8601()
      .toDate()
      .withMessage("Invalid date of birth format."),
    body("email").isEmail().withMessage("Invalid email address."),
    body("language").notEmpty().withMessage("Preferred language is required."),
    body("message")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Message must be less than 500 characters."),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      firstName,
      lastName,
      gender,
      mobile,
      dob,
      email,
      language,
      message,
    } = req.body;

    const query = `
      INSERT INTO contact_requests (first_name, last_name, gender, mobile, date_of_birth, email_address, language_of_communication, message)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    pool.query(
      query,
      [firstName, lastName, gender, mobile, dob, email, language, message],
      (err) => {
        if (err) {
          console.error("Error inserting contact request:", err);
          return res
            .status(500)
            .json({ error: "Failed to submit contact form" });
        }
        res
          .status(200)
          .json({ message: "Contact form submitted successfully!" });
      }
    );
  }
);

// Serve static files
app.use(express.static("../website"));

// Start the server
app.listen(3500, () => {
  console.log("Server is running on port 3500");
});
