const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

function prepareArray(inputString) {
  const noSpaceString = inputString.replace(/\s+/g, "");
  const preparedString = noSpaceString.split(',').map(Number);
  return preparedString;
}

// Function to calculate the final grade based on weights and grades
function calculateGrade(weight, grades) {
  const preparedArray = prepareArray(grades);
  const preparedWeight = parseFloat(weight);
  const sum = preparedArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  const total = (sum / preparedArray.length) * (preparedWeight / 100);
  const roundedTotal = total.toFixed(3);
  return roundedTotal;
}

app.post('/calculate/*', function(req, res) {
  const requestData = req.body; // Extract the "body" field from the request
  const courses = requestData.courses;
  // Initialize an array to store grades and weights
  const finalGrade = 0;

  const newCourses = courses.map(course => ({
    courseName: course.name,
    sections: course.assignments.map(assignment => ({
      sectionName: assignment.section,
      weight: assignment.weight,
      grades: assignment.grades,
      finalGrade: calculateGrade(assignment.weight, assignment.grades)
    }))
  }));
  // Respond with the grades and weights
  res.json({ success: true, newCourses });
});

// Failed method ------------------------------------------------------

app.post('/calculate', function(req, res) {
  const requestData = req.body.body; // Extract the "body" field from the request

  // Initialize an array to store calculated grades for each section
  const calculatedGrades = [];

  // Loop through each course in the requestData
  requestData.courses.forEach(course => {
    // Loop through each section in the current course
    course.sections.forEach(section => {
      // Extract the weight and grades for the current section
      const weight = section.weight;
      const grades = section.grades;

      // Perform your calculation based on weight and grades
      const calculatedGrade = calculate(weight, grades);

      // Add calculated grade to list
      calculatedGrades.push(calculatedGrade);
    });
  });

  // Respond with the calculated grades
  res.json({ success: true, calculatedGrades });
});

// Amplify generated methods----------------------------------------------------------------------


/**********************
 * Example get method *
 **********************/

app.get('/calculate', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

app.get('/calculate/*', function(req, res) {
  // Add your code here
  res.json({success: 'get call succeed!', url: req.url});
});

/****************************
* Example post method *
****************************/

/****************************
* Example put method *
****************************/

app.put('/calculate', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

app.put('/calculate/*', function(req, res) {
  // Add your code here
  res.json({success: 'put call succeed!', url: req.url, body: req.body})
});

/****************************
* Example delete method *
****************************/

app.delete('/calculate', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.delete('/calculate/*', function(req, res) {
  // Add your code here
  res.json({success: 'delete call succeed!', url: req.url});
});

app.listen(3000, function() {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
