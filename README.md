Ancillary Course Allocation Portal

Full-stack Ancillary Course Allocation system using Node.js and Express. Features a Student Portal for CGPA verification and preference submission (with PDF download) and a powerful Admin Portal. Admins manage courses, seats, and student CGPAs (via manual edit or CSV upload). Includes a script to run CGPA-based allocation and generate final reports.

📸 Screenshots

Admin Portal (CGPA Management)

Student Portal (Preference Selection)

Student Portal (Submission PDF)
## 📸 Screenshots

| Admin Portal (CGPA Management) | Student Portal (Preference Selection) | Student Portal (Submission PDF) | 
| :---: | :---: | :---: | 
| ![Admin Portal CGPA Page](assets/admin-cgpa.png) | ![Student Preference Selection](assets/student-prefs.png) | ![PDF Receipt](assets/pdf-receipt.png) |





✨ Features

👨‍🎓 Student Portal (student.html)

Secure Login: Validates Register Number and Password against the database.

CGPA Verification: As a second security step, students must verify their own CGPA.

Smart Preference Submission: Allows students to rank 8 ancillary courses. Automatically filters out the student's own home department.

Submission Confirmation: After submission, students are redirected to a confirmation page showing their submitted preferences.

PDF Download: Students can download a professionally formatted PDF receipt of their submission.

Stateful Login: If a student logs in after submitting, they are taken directly to their confirmation page.

💼 Admin Portal (admin.html)

Secure Login: Separate, password-protected admin portal.

Dashboard: A central hub to navigate to all management sections.

Course Management: View, edit, and update all ancillary courses, including Course Name, Subject ID, and (most importantly) the number of available seats.

CGPA Management (Dual Mode):

Manual Entry: Click on a department and edit student CGPAs one by one.

CSV Upload: Select a department and upload a CSV file (RegisterNumber, CGPA) to update the CGPAs for all students in that department in bulk.

Preference Status: A dashboard to see which students have submitted and which have not, with a search function.

Delete Preference: Admins can delete a student's submission, allowing them to resubmit.

Report Generation:

Preference Report: Download a CSV of all student preferences, either for everyone or filtered by department.

Allocation Report: Run the complete allocation algorithm. The script sorts all students by CGPA, allocates them to their highest-ranked course with available seats, and generates a final CSV report with the results.

🛠️ Tech Stack

Backend: Node.js, Express.js

Database: lowdb (for a flat-file db.json database)

File Handling: multer (for file uploads), csv-parser (for reading CSVs)

Frontend: HTML, Tailwind CSS, Vanilla JavaScript

PDF Generation: jsPDF, jsPDF-AutoTable

Database Setup: A Python script (build_database.py) using pandas to build the initial db.json from student CSVs.

🚀 Getting Started

Follow these instructions to get the project running on your local machine.

Prerequisites

You must have the following software installed:

Node.js: (Version 18.x or higher)

Windows & Mac: Download from the official Node.js website.

Python: (Version 3.x)

Windows: Download from the Python website.

Mac: Python 3 is usually pre-installed. You can check by opening Terminal and typing python3 --version.

Installation & Setup

These steps are the same for both Windows and macOS, except where noted.

1. Clone the Repository

git clone [https://github.com/your-username/your-repository-name.git](https://github.com/your-username/your-repository-name.git)
cd your-repository-name


Or, download the ZIP file and unzip it.

2. Install Node.js Dependencies
This will install all backend packages listed in package.json.

npm install


This installs:

express: The web server.

lowdb: The JSON database.

multer: For handling CSV file uploads.

csv-parser: For reading the uploaded CSV files.

3. Install Python Dependencies
This is needed for the one-time database setup script.

Windows (Command Prompt):

pip install pandas


Mac (Terminal):

pip3 install pandas


4. Prepare for Offline Use (Crucial!)
The portals are designed to run 100% offline.

In your browser, go to: https://cdn.tailwindcss.com

Right-click on the page and "Save As...".

Save the file as tailwindcss.js inside your project folder.

5. Create the 'uploads' Folder
The server needs this folder to temporarily store CSV files during upload.

Windows (PowerShell):

New-Item -ItemType Directory -Path "uploads"


Mac (Terminal):

mkdir uploads


🖥️ Running the Application

You must follow these steps in order.

Step 1: Build the Database

First, you must generate the db.json file from your raw student data.

Place all your student .csv files inside the student_data folder.

Run the Python script:

Windows: python build_database.py

Mac: python3 build_database.py

You should see a new db.json file appear in your project folder.

Step 2: Run the Server

Now, start the Node.js server.

node server.js


You should see a confirmation in your terminal:

===================================================
  Ancillary Portal Server is RUNNING! 🚀
  Visit STUDENT Portal at: http://localhost:3000
  Visit ADMIN Portal at:   http://localhost:3000/admin
===================================================


Step 3: Use the Portals

You can now access the application in your web browser.

Student Portal:
http://localhost:3000

Admin Portal:
http://localhost:3000/admin
(Password: admin123)

Note: The Student Portal's "Download PDF" feature loads jsPDF from the internet (a CDN). An internet connection is required for the PDF download to work. All other features are 100% offline.

📄 License

This project is licensed under the MIT License.
