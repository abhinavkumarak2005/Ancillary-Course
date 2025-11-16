# 📄 Ancillary Course Allocation Portal


> *Your documentation is a direct reflection of your software, so hold it to the same standards.*

After architecting this system and refining its workflow this README documents the complete structure functionality and usage of the Ancillary Course Allocation Portal. This project aims to simplify college ancillary course allocation through automation clean UI and transparent CGPA-based decision-making.

*This guide is geared toward users and developers who need a reliable offline-capable allocation system without relying on heavy university ERP platforms.*


## 🌟 Highlights

I think a *"Highlights"* section is one of the most important to include at the top of a good README. Create a simple, bulleted list of the main selling points of your software.

Here are the main takeaways of this guide:

- Fully offline-capable system (except PDF CDN)
- Clean Student Portal: login CGPA verification and preference submission
- Powerful Admin Portal: course management seat editing CGPA uploads
- Bulk CSV CGPA importer using multer + csv-parser
- Deterministic CGPA-based allocation algorithm
- Professionally formatted PDF receipt for students
- CSV exports for preferences and final allocation
- Lightweight backend using Express and lowdb for a flat-file database
- Simple setup minimal dependencies and easy customization
- Screenshot-rich documentation to help new users understand the system quickly


## ℹ️ Overview

> *A polished README makes your software look credible mature and worth adopting.*

The Ancillary Course Allocation Portal is a Node.js-powered full-stack application designed to streamline ancillary course selection in educational institutions. Students authenticate verify their CGPA select their preference order and download a PDF submission receipt. Admins oversee course lists seat allocations CGPA data submissions and generate final allocation results through a transparent algorithm.

This system fills the gap between overly simple Google Forms workflows and full-scale ERP solutions by offering a focused modern approachable alternative.


### ✍️ Author
I’m [Abhinav Kumar Ilango](https://github.com/abhinavkumarak2005), the developer of this system. This project reflects my goal to build clean well-documented practical tools that solve real academic workflow problems in colleges.

This portal was built to support transparent CGPA-based allocation processes reduce manual workload automate error-prone operations and ensure fairness for every student.



## 🚀 Usage instructions

> *Show off what your software looks like in action using minimal examples and screenshots.*

# CGPA entry
![Admin CGPA](Assets/admin-cgpa.png)
# Preference selection
![Admin CGPA](Assets/student-prefs.png)
# Confirmation page
![Admin CGPA](Assets/pdf-receipt.png)

# Student Workflow
	1.	Login using Register Number + Password
	2.	Verify CGPA
	3.	Select and rank 8 course preferences
	4.	Submit
	5.	Download PDF receipt

# Admin Workflow
	1.	Login using the admin portal
	2.	Manage course titles subject IDs and seat counts
	3.	Upload or manually edit CGPA values
	4.	View submission status
	5.	Delete submissions if needed
	6.	Run the allocation algorithm
	7.	Download CSV export of allocation

# ⬇️ Installation instructions
## Aurora Backgroun:
```py
npm install ogl
```
## Animated List:
```py
npm install motion
```
## Bubble Menu :
```py
npm install gsap
```
## Install Node.js dependencies:
```py
npm install
```
## Install Python dependencies:
```py
pip install pandas
```
## Generate the database:
```py
python3 build_database.py
```
## Run the server:
```py
node server.js
```
## Portals:
	•	Student Portal → http://localhost:3000
	•	Admin Portal → http://localhost:3000/admin
## Admin password (default):
```py
admin123
```

## Minimum requirements:
	•	Node.js 18+
	•	Python 3+
	•	Browser with local file access enabled
	
