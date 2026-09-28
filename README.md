# Password Manager

A secure and user-friendly password management website built as a Web Development course project.

## Features

- **Home page**: introduction to the website and its benefits
- **Password Vault**: add, view, edit and delete saved passwords (stored in a MySQL/MariaDB database)
- **Strength Checker**: checks a password against best practices (length, uppercase, lowercase, number, special character)
- **Contact page**: validated contact form whose submissions are saved to the database
- **About page**: information about the team
- Responsive design with a hamburger sidebar menu on small screens
- Validation on both the front end (HTML + JavaScript) and the back end (express-validator)

## Technologies

- **Front end:** HTML, CSS, JavaScript
- **Back end:** Node.js, Express, express-validator
- **Database:** MySQL / MariaDB (mysql2)

## Project Structure

```
project/
├── server/
│   └── server.js
└── website/
    ├── html/      index.html, vault.html, strength.html, contact.html, about.html
    ├── css/       main.css, style2.css, style3.css, hamburger.css
    ├── js/        contact.js, script.js, script2.js, hamburger.js
    └── images/    logo.png, 1.png, 2.png, 3.png
```

## Requirements

- [Node.js](https://nodejs.org) (LTS version)
- MySQL or MariaDB (for example through [XAMPP](https://www.apachefriends.org))

## Setup and Run

### 1. Create the database

Open phpMyAdmin (`http://localhost/phpmyadmin`) or the MySQL console and run:

```sql
CREATE DATABASE passwordmanager;
USE passwordmanager;

CREATE TABLE vault (
  id INT AUTO_INCREMENT PRIMARY KEY,
  website VARCHAR(255) NOT NULL,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE contact_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  gender VARCHAR(10),
  mobile VARCHAR(20),
  date_of_birth DATE,
  email_address VARCHAR(255),
  language_of_communication VARCHAR(50),
  message TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Check the database credentials

In `server/server.js`, the connection settings are:

```js
host: "localhost",
user: "root",
password: "root",
database: "passwordmanager",
port: 3306
```

Change `password` to match your own MySQL/MariaDB setup. (XAMPP's default root password is empty: `""`.)

### 3. Install dependencies

Open a terminal in the `server` folder and run:

```bash
npm install express express-validator mysql2
```

### 4. Start the server

```bash
node server.js
```

You should see: `Server is running on port 3500`

### 5. Open the website

Go to: **http://localhost:3500/html/index.html**

> Do not open the HTML files by double-clicking them. The pages talk to the Express server, so they must be opened through `localhost:3500`.

## API Routes

| Method | Route                  | Description                    |
| ------ | ---------------------- | ------------------------------ |
| GET    | `/view`                | Get all saved passwords        |
| POST   | `/insert`              | Add a new password             |
| PUT    | `/editRecord/:id`      | Update a saved password        |
| DELETE | `/deleteRecord/:id`    | Delete a saved password        |
| POST   | `/submit-contact`      | Save a contact form submission |

## Security Note

This is a student project. Passwords are stored in **plain text** and the database uses a simple root login. Use it for local learning only, not for real passwords.

