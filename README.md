*Ancillary Course Allocation Portal*

A full-stack Ancillary Course Allocation system built with Node.js and Express.
Includes a dedicated Student Portal for CGPA verification and preference submission and a powerful Admin Portal for course seat management CGPA uploads and automated allocation.

⸻

📸 Screenshots

Admin Portal – CGPA Management

Student Portal – Preference Selection

Submission PDF Receipt


⸻

✨ Features

Student Portal
	•	Secure login using Register Number and Password
	•	CGPA verification as a second-layer check
	•	Preference ranking for 8 ancillary courses
	•	Automatically excludes home department courses
	•	Redirects to confirmation page after submission
	•	PDF receipt download
	•	If already submitted it skips login and shows confirmation

Admin Portal
	•	Password-protected admin access
	•	Dashboard for navigation
	•	Full course management (name subject ID seat count)
	•	CGPA management (edit by hand or bulk-upload CSV)
	•	Live preference submission status
	•	Delete preference option for resubmission
	•	Export all student preferences as CSV
	•	Run the CGPA-based allocation script
	•	Final allocation report generation

⸻

🧠 Allocation Logic

1 Sort all students by CGPA (descending)
2 For each student check their preferences from Rank 1 to Rank 8
3 Allocate the highest possible course that still has seats
4 Reduce seat count as allocations happen
5 Export final allocation CSV

Simple deterministic no randomness no bias.

⸻

🛠️ Tech Stack

Backend Node.js Express
Database lowdb (flat-file JSON)
File Uploads multer
CSV Parsing csv-parser
PDF jsPDF AutoTable
Frontend HTML Tailwind CSS Vanilla JS
Database Builder Python + pandas

⸻

🚀 Installation

1 Clone the repository

git clone https://github.com/your-username/your-repo.git
cd your-repo

2 Install Node dependencies

npm install

3 Install Python dependencies

pip install pandas

4 Download Tailwind for offline use

Open
https://cdn.tailwindcss.com
Save file as tailwindcss.js into the project root.

5 Create uploads folder

mkdir uploads


⸻

🗄️ Build Database

Place all student department CSVs inside student_data.

Run:

python3 build_database.py

This generates db.json automatically.

⸻

🖥️ Run the Server

node server.js

You’ll see:

Ancillary Portal Server is RUNNING!
Student Portal: http://localhost:3000
Admin Portal:   http://localhost:3000/admin

Admin password default: admin123

⸻

🌐 Access

Student Portal

http://localhost:3000

Admin Portal

http://localhost:3000/admin

PDF download uses jsPDF CDN so internet is needed for that one feature.

⸻

🎨 Optional UI Enhancements (React Version)

If you migrate this to React the following packages are supported:

Aurora backgrounds

npm install ogl

Smooth UI motion

npm install motion

Bubble button animations

npm install gsap

I’ll include these blocks in the React version of the README when you build that UI.

⸻

📄 License

MIT License

⸻

If you want this README styled even more professionally with tables callouts badges or a React-ready version tell me and I’ll upgrade it.
