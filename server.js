const express = require('express');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const csv = require('csv-parser');

const app = express();
const port = 3000;

const upload = multer({ dest: 'uploads/' });
const adapter = new FileSync('db.json');
const db = low(adapter);

app.use(express.json());
app.use(express.static(path.join(__dirname))); 

// --- Helper Functions ---
const getStudentByRegNum = (regNum) => {
  return db.get('students').find({ RegisterNumber: regNum }).value();
};

const getPreferencesByRegNum = (regNum) => {
  return db.get('preferences').find({ RegisterNumber: regNum }).value();
};

// ===========================================
//  MAIN PAGE ROUTES
// ===========================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'student.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// ===========================================
//  STUDENT PORTAL API ENDPOINTS
// ===========================================

// 1. Student Login (*** THIS IS THE FIX ***)
app.post('/api/student/login', (req, res) => {
  const { registerNumber, password } = req.body;
  if (!registerNumber || !password) {
    return res.status(400).json({ success: false, message: 'Register number and password are required.' });
  }
  const student = getStudentByRegNum(registerNumber);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found.' });
  }
  if (student.Password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid password.' });
  }

  const existingPrefs = getPreferencesByRegNum(registerNumber);
  
  if (existingPrefs) {
    // *** FIXED: If submitted, send back all data for confirmation page ***
    res.json({
      success: true,
      message: 'Login successful! Preferences already submitted.',
      registerNumber: student.RegisterNumber,
      hasSubmitted: true,
      studentDetails: { // Send details
          Name: student.Name,
          RegisterNumber: student.RegisterNumber,
          Department: student.Department,
          Year: '2nd Year'
      },
      preferences: existingPrefs.Preferences // Send their saved preferences
    });
  } else {
    // Standard login for first-time user
    res.json({ 
      success: true, 
      message: 'Login successful!', 
      registerNumber: student.RegisterNumber,
      hasSubmitted: false 
    });
  }
});

// 2. Get Student Details
app.get('/api/student/details/:registerNumber', (req, res) => {
  const { registerNumber } = req.params;
  const student = getStudentByRegNum(registerNumber);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found.' });
  }
  res.json({
    success: true,
    Name: student.Name,
    RegisterNumber: student.RegisterNumber,
    Department: student.Department,
    Year: '2nd Year'
  });
});

// 3. Verify CGPA
app.post('/api/student/verify-cgpa', (req, res) => {
  const { registerNumber, cgpa } = req.body;
  const student = getStudentByRegNum(registerNumber);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found.' });
  }
  if (parseFloat(student.CGPA) === parseFloat(cgpa)) {
    res.json({ success: true, message: 'CGPA verified successfully.' });
  } else {
    res.status(400).json({ success: false, message: 'CGPA mismatch. Please contact admin.' });
  }
});

// 4. Get List of Courses (for preference dropdowns)
app.get('/api/courses', (req, res) => {
  const courses = db.get('courses').value();
  const departments = courses.map(course => ({
      code: course.Department,
      name: `${course.Department} - ${course.CourseName}`
  }));
  res.json({ success: true, departments: departments });
});

// 5. Submit Preferences
app.post('/api/student/submit-preferences', (req, res) => {
  const { registerNumber, preferences } = req.body;
  // *** MODIFIED: Check for 8 preferences ***
  if (!registerNumber || !preferences || preferences.length !== 8) {
    return res.status(400).json({ success: false, message: 'Invalid preference data. Must submit 8 preferences.' });
  }
  const student = getStudentByRegNum(registerNumber);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found.' });
  }
  const existingPrefs = getPreferencesByRegNum(registerNumber);
  const preferenceData = {
    RegisterNumber: registerNumber,
    Name: student.Name,
    Department: student.Department,
    CGPA: student.CGPA,
    Preferences: preferences
  };
  if (existingPrefs) {
    db.get('preferences').find({ RegisterNumber: registerNumber }).assign(preferenceData).write();
  } else {
    db.get('preferences').push(preferenceData).write();
  }
  res.json({ success: true, message: 'Preferences submitted successfully.' });
});

// ===========================================
//  ADMIN PORTAL API ENDPOINTS
// ===========================================

// 2. Get ALL Students
app.get('/api/admin/students', (req, res) => {
  const students = db.get('students').value();
  res.json({ success: true, students: students });
});

// 3. Update a Student's CGPA
app.post('/api/admin/update-cgpa', (req, res) => {
  const { registerNumber, cgpa } = req.body;
  try {
    db.get('students').find({ RegisterNumber: registerNumber }).assign({ CGPA: parseFloat(cgpa) }).write();
    res.json({ success: true, message: 'CGPA updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating CGPA.' });
  }
});

// 4. Get ALL Courses
app.get('/api/admin/courses', (req, res) => {
  const courses = db.get('courses').value();
  res.json({ success: true, courses: courses });
});

// 5. Update Course Details
app.post('/api/admin/update-course', (req, res) => {
  const { originalSubjectID, newSubjectID, courseName, noOfSeats } = req.body;
  
  if (!originalSubjectID || !newSubjectID || !courseName || !noOfSeats) {
    return res.status(400).json({ success: false, message: 'Missing required fields.' });
  }
  
  const seats = parseInt(noOfSeats, 10);
  if (isNaN(seats) || seats < 0) {
      return res.status(400).json({ success: false, message: 'Invalid number of seats.' });
  }

  try {
    db.get('courses').find({ SubjectID: originalSubjectID }).assign({ 
      SubjectID: newSubjectID,
      CourseName: courseName,
      NoOfSeats: seats
    }).write();
    res.json({ success: true, message: 'Course updated.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating course.' });
  }
});

// 6. Get Preference Status
app.get('/api/admin/preference-status', (req, res) => {
  const allStudents = db.get('students').value();
  const allPreferences = db.get('preferences').value();
  const submittedRegNumbers = new Set(allPreferences.map(p => p.RegisterNumber));
  const submitted = [];
  const notSubmitted = [];
  for (const student of allStudents) {
    if (submittedRegNumbers.has(student.RegisterNumber)) {
      const prefs = allPreferences.find(p => p.RegisterNumber === student.RegisterNumber);
      submitted.push(prefs);
    } else {
      notSubmitted.push({
        RegisterNumber: student.RegisterNumber,
        Name: student.Name,
        Department: student.Department,
        CGPA: student.CGPA
      });
    }
  }
  res.json({ 
    success: true, 
    submitted: submitted,
    notSubmitted: notSubmitted 
  });
});

// 7. Download Report (as CSV)
app.get('/api/admin/download-report', (req, res) => {
    let students = db.get('students').value();
    const preferences = db.get('preferences').value();
    
    const dept = req.query.dept;
    let fileName = "Ancillary_Preference_Report_All.csv";

    if (dept) {
        students = students.filter(s => s.Department === dept);
        fileName = `Ancillary_Preference_Report_${dept}.csv`;
    }

    let csv = '"Register Number","Name","Department","CGPA","Preference 1","Preference 2","Preference 3","Preference 4","Preference 5","Preference 6","Preference 7","Preference 8"\n';
    const preferenceMap = new Map();
    for (const pref of preferences) {
        preferenceMap.set(pref.RegisterNumber, pref.Preferences);
    }
    for (const student of students) {
        const prefs = preferenceMap.get(student.RegisterNumber);
        csv += `"${student.RegisterNumber}","${student.Name}","${student.Department}","${student.CGPA}",`;
        if (prefs) {
            csv += `"${prefs.join('","')}"\n`;
        } else {
            csv += '"N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"\n';
        }
    }
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.status(200).end(csv);
});

// 8. Delete a Student's Preference
app.post('/api/admin/delete-preference', (req, res) => {
    const { registerNumber } = req.body;
    if (!registerNumber) {
        return res.status(400).json({ success: false, message: 'Register number is required.' });
    }
    
    try {
        const result = db.get('preferences').remove({ RegisterNumber: registerNumber }).write();
        if (result.length > 0) {
            res.json({ success: true, message: 'Preference deleted successfully.' });
        } else {
            res.status(404).json({ success: false, message: 'No preference found for this student.' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting preference.' });
    }
});


// 9. Download Allocation Report
app.get('/api/admin/download-allocation', (req, res) => {
    try {
        const students = db.get('students').cloneDeep().value();
        const courses = db.get('courses').cloneDeep().value();
        const preferences = db.get('preferences').cloneDeep().value();

        const courseSeats = new Map();
        const courseNameMap = new Map(); 
        for (const course of courses) {
            courseSeats.set(course.Department, course.NoOfSeats);
            courseNameMap.set(course.Department, course.CourseName);
        }

        const preferenceMap = new Map();
        for (const pref of preferences) {
            preferenceMap.set(pref.RegisterNumber, pref.Preferences);
        }
        
        students.sort((a, b) => b.CGPA - a.CGPA);
        
        const allocationResults = [];

        for (const student of students) {
            let allocatedCourse = ""; 
            const studentPrefs = preferenceMap.get(student.RegisterNumber);

            if (studentPrefs) {
                for (const preferredDept of studentPrefs) {
                    const currentSeats = courseSeats.get(preferredDept);
                    
                    if (currentSeats > 0) {
                        allocatedCourse = courseNameMap.get(preferredDept); 
                        courseSeats.set(preferredDept, currentSeats - 1);
                        break; 
                    }
                }
            } else {
                allocatedCourse = ""; 
            }
            
            allocationResults.push({
                RegisterNumber: student.RegisterNumber,
                Name: student.Name,
                Department: student.Department,
                CGPA: student.CGPA,
                AllocatedCourse: allocatedCourse
            });
        }
        
        let csv = '"Register Number","Name","Department","CGPA","Allocated Course"\n';
        for (const result of allocationResults) {
            csv += `"${result.RegisterNumber}","${result.Name}","${result.Department}","${result.CGPA}","${result.AllocatedCourse}"\n`;
        }

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="Ancillary_Allocation_Report.csv"');
        res.status(200).end(csv);

    } catch (error) {
        console.error("Error generating allocation report:", error);
        res.status(500).send("Error generating allocation report.");
    }
});

// 10. Upload CGPA Data
app.post('/api/admin/upload-cgpa', upload.single('csvFile'), (req, res) => {
    const { department } = req.body;
    const filePath = req.file.path;

    if (!department || !filePath) {
        return res.status(400).json({ success: false, message: 'Missing department or file.' });
    }

    const updates = [];
    let requiredColumnsFound = false;

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('headers', (headers) => {
            const lowerCaseHeaders = headers.map(h => h.toLowerCase());
            if (lowerCaseHeaders.includes('registernumber') && lowerCaseHeaders.includes('cgpa')) {
                requiredColumnsFound = true;
            }
        })
        .on('data', (row) => {
            const regNum = row.RegisterNumber || row.registernumber;
            const cgpa = row.CGPA || row.cgpa;
            
            if (regNum && cgpa) {
                updates.push({ regNum: regNum.trim(), cgpa: parseFloat(cgpa) });
            }
        })
        .on('end', () => {
            fs.unlinkSync(filePath);

            if (!requiredColumnsFound) {
                return res.status(400).json({ success: false, message: 'CSV must contain "RegisterNumber" and "CGPA" columns.' });
            }
            
            if (updates.length === 0) {
                return res.status(400).json({ success: false, message: 'No valid student data found in the file.' });
            }

            try {
                let updatedCount = 0;
                const studentsTable = db.get('students');
                
                updates.forEach(item => {
                    if (isNaN(item.cgpa)) return; 
                    
                    const student = studentsTable.find({ 
                        RegisterNumber: item.regNum,
                        Department: department 
                    });
                    
                    if (student.value()) {
                        student.assign({ CGPA: item.cgpa }).write();
                        updatedCount++;
                    }
                });

                res.json({ success: true, message: `Successfully updated ${updatedCount} students in ${department}.` });
                
            } catch (error) {
                res.status(500).json({ success: false, message: 'An error occurred while writing to the database.' });
            }
        });
});


// ===========================================
//  START THE SERVER
// ===========================================
app.listen(port, () => {
  console.log(`===================================================`);
  console.log(`  Ancillary Portal Server is RUNNING! 🚀`);
  console.log(`  Visit STUDENT Portal at: http://localhost:${port}`);
  console.log(`  Visit ADMIN Portal at:   http://localhost:${port}/admin`);
  console.log(`===================================================`);
  console.log(`  Your database file is: db.json`);
  console.log(`  Press CTRL+C to stop the server.`);
});