#                 **Assignment Submission Portal**
This project is a web application for managing assignment submissions where users can log in as either a student or an admin. Students can submit JSON objects (assignments) and tag admins. Admins can view submissions assigned to them and either accept or reject them.

# Features

1. User Authentication: Supports role-based login (student/admin) using hashed passwords.
2. Role-Based Authorization: Students can submit assignments, and admins can review, accept, or reject submissions.
3. Session Management: Secure session handling using express-session.
4. Data Handling: MongoDB used for storing users and assignment submissions.
5. Views: Separate views for students and admins using EJS templating engine.

# Prerequisites
Before running the application, ensure you have the following installed:
1. Node.js (v14.x or above).
2. MongoDB Atlas or local MongoDB instance.
3. npm (Node package manager).

# Setup

1. Clone the Repository.
2. Install dependencies using `npm install`.
3. Set up Environment Variables
Create a .env file in the root directory and configure the following:
SECRET_KEY=your_session_secret_key
MONGODB_KEY=your_mongodb_password

4.  Configure MongoDB
Make sure you have a MongoDB database set up. You can use MongoDB Atlas or a local instance. Update the MongoDB connection string in the code (already set in main() function).

5. Run the Application
 Start the server by running: `nodemon app.js`.

 # How to use
 User Roles
 1. Students: Can log in, submit their assignments (JSON object), and tag admins for review.
 2. Admins: Can log in, view student submissions assigned to them, and accept or reject submissions.

 # Student Workflow
1. Register with a "student" role.
2. Login and submit your assignment on the /submit page.
3. The submission will be tagged to an admin for review.

# Admin Workflow
1. Register with an "admin" role.
2. Login and view assigned submissions on the /dash page.
3. Accept or reject submissions using the provided options.

# Dependencies
. dotenv: For environment variable management.
. express: For creating the web server.
. ejs: For server-side rendering of views.
. body-parser: For parsing form data.
. mongoose: For connecting and interacting with MongoDB.
. bcrypt: For hashing user passwords.
. express-session: For handling user sessions.

