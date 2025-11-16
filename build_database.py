import pandas as pd
import json
import os

# --- Configuration ---
# This tells the script what to do with each file.
file_mappings = [
    ("18.08.2025  B.Tech.Batch 2024-2028.xlsx - CE-A.csv", "CE", 4),
    ("18.08.2025  B.Tech.Batch 2024-2028.xlsx - CE-B.csv", "CE", 3),
    ("18.08.2025  B.Tech.Batch 2024-2028.xlsx - CHE.csv", "CHE", 3),
    ("18.08.2025  B.Tech.Batch 2024-2028.xlsx - CSE-A.csv", "CSE", 3),
    ("18.08.2025  B.Tech.Batch 2024-2028.xlsx - CSE-B.csv", "CSE", 3),
    ("18.08.2025  B.Tech.Batch 2024-2028.xlsx - ECE-A.csv", "ECE", 3),
    ("18.08.2025  B.Tech.Batch 2024-2028.xlsx - ECE-B.csv", "ECE", 3),
    ("18.08.2025  B.Tech.Batch 2024-2028.xlsx - EEE.csv", "EEE", 3),
    ("18.08.2025  B.Tech.Batch 2024-2028.xlsx - EIE.csv", "EIE", 3),
    ("18.08.2025  B.Tech.Batch 2024-2028.xlsx - IT.csv", "IT", 3),
    ("18.08.2025  B.Tech.Batch 2024-2028.xlsx - ME-A.csv", "ME", 3),
    ("18.08.2025  B.Tech.Batch 2024-2028.xlsx - ME-B.csv", "ME", 3),
    ("18.08.2025  B.Tech.Batch 2024-2028.xlsx - MT.csv", "MTE", 3) # MT is MTE
]

data_folder = "student_data"
output_file = "db.json"
default_cgpa = 8.5
default_password = "Ptu@123"

all_students = []
# ---------------------

print("Starting database build...")

# Process each file
for file, dept, skip in file_mappings:
    file_path = os.path.join(data_folder, file)
    
    if not os.path.exists(file_path):
        print(f"Warning: File not found, skipping: {file}")
        continue
        
    try:
        df = pd.read_csv(file_path, skiprows=skip)
        
        # Clean column names (remove leading/trailing spaces, newlines)
        df.columns = df.columns.str.strip()
        
        # Find 'Register Number' column
        reg_col = None
        for col_name in ['Reg.No', 'Reg. No', 'Reg.No ', 'Reg.  No']:
            if col_name in df.columns:
                reg_col = col_name
                break
                
        # Find 'Name' column
        name_col = 'Name of  the Students'

        if reg_col is None or name_col not in df.columns:
            print(f"Warning: Could not find required columns in {file}.")
            continue
            
        # Drop rows where 'Reg.No' is NaN
        df = df.dropna(subset=[reg_col])
        
        student_count = 0
        for index, row in df.iterrows():
            reg_num = str(row[reg_col]).strip()
            name = str(row[name_col]).strip()
            
            if not reg_num or reg_num == "nan" or not name or name == "nan":
                continue
                
            # Clean up (Repeater) tags in name
            name = name.split("(Repeater")[0].split("-Repeater")[0].strip()
            
            student = {
                "RegisterNumber": reg_num,
                "Name": name,
                "Department": dept,
                "CGPA": default_cgpa,
                "Password": default_password
            }
            all_students.append(student)
            student_count += 1
            
        print(f"Successfully processed {student_count} students from {file}.")

    except Exception as e:
        print(f"Error processing file {file}: {e}")

# --- Create the final db.json structure ---
db_data = {
    "students": all_students,
    "courses": [
        {"Department": "CE", "CourseName": "Structural Analysis", "SubjectID": "CE301", "NoOfSeats": 30},
        {"Department": "ME", "CourseName": "Thermodynamics", "SubjectID": "ME302", "NoOfSeats": 35},
        {"Department": "ECE", "CourseName": "Digital Signal Processing", "SubjectID": "EC303", "NoOfSeats": 40},
        {"Department": "CSE", "CourseName": "Data Structures", "SubjectID": "CS304", "NoOfSeats": 45},
        {"Department": "EEE", "CourseName": "Power Systems", "SubjectID": "EE305", "NoOfSeats": 30},
        {"Department": "CHE", "CourseName": "Chemical Reactions", "SubjectID": "CH306", "NoOfSeats": 20},
        {"Department": "EIE", "CourseName": "Control Systems", "SubjectID": "EI307", "NoOfSeats": 25},
        {"Department": "IT", "CourseName": "Database Management", "SubjectID": "IT308", "NoOfSeats": 40},
        {"Department": "MTE", "CourseName": "Material Science", "SubjectID": "MT309", "NoOfSeats": 25}
    ],
    "preferences": []
}

# Write the file
with open(output_file, 'w') as f:
    json.dump(db_data, f, indent=2)

print("-----------------------------------------")
print(f"Success! All {len(all_students)} students processed.")
print(f"Database file '{output_file}' has been created in your project folder.")