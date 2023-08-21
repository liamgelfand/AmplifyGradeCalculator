import React, { useState } from 'react';
import { Amplify, API } from 'aws-amplify';
import awsconfig from './aws-exports';
import './App.css';

Amplify.configure(awsconfig);

export default function App() {
  const [numAssignments, setNumAssignments] = useState(0);
  const [classes, setClasses] = useState([
    { name: '', assignments: [{ section: '', weight: '', grades: '' }], totalGrade: 0 },
  ]);
  const [studentName, setStudentName] = useState('');

  const addClass = () => {
    let newClass = { name: '', assignments: [{ section: '', weight: '', grades: '' }] };
    setClasses([...classes, newClass]);
  };

  const handleCourseChange = (courseIndex, assignmentIndex, event) => {
    let classData = [...classes];
    if (event.target.name === 'name') {
      classData[courseIndex][event.target.name] = event.target.value;
      setClasses(classData);
    } else {
      classData[courseIndex].assignments[assignmentIndex][event.target.name] = event.target.value;
      setClasses(classData);
    }
  };

  function addAssignment(courseIndex) {
    let classData = [...classes];
    let classToModify = classData[courseIndex];
    let newAssignment = { type: '', weight: '', grade: '' };
    classToModify.assignments.push(newAssignment);
    setNumAssignments(numAssignments + 1);
  }

  function submit(e) {
    e.preventDefault();

    const response = API.get('GradeCalculatorAPI', '/calculate')
    console.log({response})
    
    let objectToSend = {
      "body": {
        "user": "john doe",
        "courses": [
          {
            "courseName": "Math",
            "sections": [
              {
                "sectionName": "Test",
                "weight": 50,
                "grades": [100],
                "finalGrade": 0
              }
            ]
          },
          {
            "courseName": "Physics",
            "sections": [
              {
                "sectionName": "Test",
                "weight": 75,
                "grades": [100],
                "finalGrade": 0
              }
            ]
          }
        ]
      }
    }
    
    API.post('GradeCalculatorAPI', '/calculate/test', objectToSend)
      .then((response) => {
        console.log('Data sent successfully:', response);

        // Update state or perform any other necessary actions
      })
      .catch((error) => {
        console.error('Error fetching calculated grade:', error);
      });
  }


  const changeText = (e) => {
    setStudentName(e.target.value);
  };

  return (
    <div className="large-box">
      <h1 className="title">Grade Calculator</h1>
      <form onSubmit={(e) => submit(e)}>
        {/* Input field for entering student's name */}
        <input
          className='user-name'
          name='student-name'
          placeholder='Student Name'
          value={studentName}
          onChange={changeText}
        />
        {/* Container for adding a new class */}
        <div className="add-class-container">
          <button className="add-class-button" type="button" onClick={addClass}>
            Add Class
          </button>
        </div>
        {/* Mapping over the classes array to display each class */}
        {classes.map((input, courseIndex) => (
          <div key={courseIndex} className='course-container'>
            {/* Input field for entering class name */}
            <input
              className='class-name'
              name='name'
              placeholder='Class Name'
              value={input.name}
              onChange={(event) => handleCourseChange(courseIndex, null, event)}
            />
            {/* Mapping over assignments within a class to display each assignment */}
            {input.assignments.map((assignment, assignmentIndex) => (
              <div className='section' key={assignmentIndex}>
                <span>
                  {/* Input field for entering section name */}
                  <input
                    className="section-input"
                    name='section'
                    placeholder='Section Name'
                    value={assignment.section}
                    onChange={(event) =>
                      handleCourseChange(courseIndex, assignmentIndex, event)
                    }
                  />
                </span>
                <span>
                  {/* Input field for entering assignment weight */}
                  <input
                    className="weight-input"
                    name='weight'
                    placeholder='Weight (%)'
                    value={assignment.weight}
                    onChange={(event) =>
                      handleCourseChange(courseIndex, assignmentIndex, event)
                    }
                  />
                </span>
                {/* Input field for entering section grades */}
                <input
                  className="grades-input"
                  name='grades'
                  placeholder='Section Grades (Comma separated list)'
                  value={assignment.grades}
                  onChange={(event) =>
                    handleCourseChange(courseIndex, assignmentIndex, event)
                  }
                />
              </div>
            ))}
            {/* Button for adding a new section/assignment */}
            <button className="add-section-button" type="button" onClick={() => addAssignment(courseIndex)}>
              Add Section
            </button>
            {/* Display the calculated total grade for the class */}
            <div className="final-grade">Final Grade: {input.totalGrade}</div>
          </div>
        ))}
        {/* Button for submitting the form */}
        <button className="submit-button" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
   

